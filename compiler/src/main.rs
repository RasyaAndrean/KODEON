//! Main entry point for the KODEON compiler

use std::env;
use std::fs;
use std::process;
use kodeon_compiler::lexer::Lexer;
use kodeon_compiler::parser::Parser;
use kodeon_compiler::semantic_analyzer::SemanticAnalyzer;
use kodeon_compiler::ir::{IRGenerator, print_ir};
use kodeon_compiler::llvm_backend::LLVMBackend;
use kodeon_compiler::debugger::{Debugger, create_debugger};
use inkwell::context::Context;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <input_file> [--debug]", args[0]);
        process::exit(1);
    }

    let input_file = &args[1];
    let debug_mode = args.contains(&"--debug".to_string());

    // Read the input file
    let source_code = match fs::read_to_string(input_file) {
        Ok(code) => code,
        Err(e) => {
            eprintln!("Error reading file {}: {}", input_file, e);
            process::exit(1);
        }
    };

    // Lexical analysis
    let mut lexer = Lexer::new(&source_code);
    let tokens = match lexer.tokenize() {
        Ok(tokens) => tokens,
        Err(e) => {
            eprintln!("Lexical analysis error: {}", e);
            process::exit(1);
        }
    };

    // Parsing
    let mut parser = Parser::new(&tokens).expect("Failed to create parser");
    let ast = match parser.parse_program() {
        Ok(ast) => ast,
        Err(e) => {
            eprintln!("Parsing error: {}", e);
            process::exit(1);
        }
    };

    // Semantic analysis
    let mut semantic_analyzer = SemanticAnalyzer::new();
    if let Err(e) = semantic_analyzer.analyze(&ast) {
        eprintln!("Semantic analysis error: {}", e);
        process::exit(1);
    }

    // IR generation
    let mut ir_generator = IRGenerator::new();
    let ir_module = match ir_generator.generate_ir(&ast) {
        Ok(module) => module,
        Err(e) => {
            eprintln!("IR generation error: {}", e);
            process::exit(1);
        }
    };

    if debug_mode {
        // Debug mode - start the debugger
        println!("Starting debugger for {}", input_file);
        let mut debugger = create_debugger();
        if let Err(e) = debugger.debug(&ir_module) {
            eprintln!("Debugging error: {}", e);
            process::exit(1);
        }
    } else {
        // Normal mode - compile to LLVM IR
        let context = Context::create();
        let module_name = input_file.clone();
        let mut llvm_backend = LLVMBackend::new(&context, &module_name);

        if let Err(e) = llvm_backend.compile_ir(&ir_module) {
            eprintln!("LLVM compilation error: {}", e);
            process::exit(1);
        }

        // Print the generated IR
        print_ir(&ir_module);

        // Print the LLVM IR
        llvm_backend.print_ir();
    }
}
