//! Tests for the LLVM backend

use kodeon_compiler::lexer::Lexer;
use kodeon_compiler::parser::Parser;
use kodeon_compiler::semantic_analyzer::SemanticAnalyzer;
use kodeon_compiler::ir::IRGenerator;
use kodeon_compiler::llvm_backend::LLVMBackend;
use inkwell::context::Context;

#[test]
fn test_simple_llvm_generation() {
    let source = r#"
        buat a = 42
        buat b = 8
        buat c = a + b
        kembalikan c
    "#;

    // Tokenize
    let mut lexer = Lexer::new(source);
    let mut tokens = Vec::new();

    loop {
        let token = lexer.next_token().unwrap();
        if token == kodeon_compiler::Token::Eof {
            break;
        }
        tokens.push(token);
    }

    // Parse
    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Semantic analysis
    let mut semantic_analyzer = SemanticAnalyzer::new();
    semantic_analyzer.analyze(&ast).unwrap();

    // Generate IR
    let mut ir_generator = IRGenerator::new();
    let ir_module = ir_generator.generate_ir(&ast).unwrap();

    // Generate LLVM IR
    let context = Context::create();
    let mut llvm_backend = LLVMBackend::new(&context, "test_module");

    let result = llvm_backend.compile_ir(&ir_module);
    assert!(result.is_ok());

    // Print the LLVM IR for manual inspection
    llvm_backend.print_ir();
}

#[test]
fn test_function_llvm_generation() {
    let source = r#"
        fungsi tambah(x, y):
            kembalikan x + y

        buat a = 10
        buat b = 20
        buat c = tambah(a, b)
        kembalikan c
    "#;

    // Tokenize
    let mut lexer = Lexer::new(source);
    let mut tokens = Vec::new();

    loop {
        let token = lexer.next_token().unwrap();
        if token == kodeon_compiler::Token::Eof {
            break;
        }
        tokens.push(token);
    }

    // Parse
    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Semantic analysis
    let mut semantic_analyzer = SemanticAnalyzer::new();
    semantic_analyzer.analyze(&ast).unwrap();

    // Generate IR
    let mut ir_generator = IRGenerator::new();
    let ir_module = ir_generator.generate_ir(&ast).unwrap();

    // Generate LLVM IR
    let context = Context::create();
    let mut llvm_backend = LLVMBackend::new(&context, "test_function_module");

    let result = llvm_backend.compile_ir(&ir_module);
    assert!(result.is_ok());

    // Print the LLVM IR for manual inspection
    llvm_backend.print_ir();
}
