//! Main entry point for the KODEON compiler

use clap::Parser;
use std::path::PathBuf;
use std::process;
use kodeon_compiler::{Lexer, Parser, SemanticAnalyzer, IRGenerator, print_ir};
use kodeon_compiler::llvm_backend::LLVMBackend;
use inkwell::context::Context;

/// KODEON Programming Language Compiler
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// Input KODEON source file
    #[clap(value_parser)]
    input: PathBuf,

    /// Output file path
    #[clap(short, long, value_parser)]
    output: Option<PathBuf>,

    /// Compile to specific target platform
    #[clap(short, long, value_parser, possible_values = &["llvm", "javascript", "python"])]
    target: Option<String>,

    /// Enable verbose output
    #[clap(short, long, action)]
    verbose: bool,

    /// Generate LLVM IR output
    #[clap(long, action)]
    llvm: bool,

    /// Execute the compiled program
    #[clap(long, action)]
    execute: bool,
}

fn main() {
    let args = Args::parse();

    if args.verbose {
        env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    }

    // Validate input file
    if !args.input.exists() {
        eprintln!("❌ Error: Input file '{}' does not exist", args.input.display());
        process::exit(1);
    }

    if args.input.extension().unwrap_or_default() != "kodeon" {
        eprintln!("❌ Error: Input file must have .kodeon extension");
        process::exit(1);
    }

    // Compile the source file
    match compile_file(&args.input, &args.output, &args.target, args.verbose, args.llvm, args.execute) {
        Ok(_) => {
            println!("✅ Successfully compiled {}", args.input.display());
        }
        Err(e) => {
            eprintln!("💥 Compilation error: {}", e);
            process::exit(1);
        }
    }
}

/// Compile a KODEON source file
fn compile_file(
    input: &PathBuf,
    output: &Option<PathBuf>,
    target: &Option<String>,
    verbose: bool,
    generate_llvm: bool,
    execute: bool,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("Compiling {}...", input.display());

    // Read the source file
    let contents = std::fs::read_to_string(input)?;

    // Tokenize the source code
    let mut lexer = Lexer::new(&contents);
    let mut tokens = Vec::new();

    if verbose {
        println!("Tokenizing...");
    }

    loop {
        let token = lexer.next_token()?;
        if token == kodeon_compiler::Token::Eof {
            break;
        }
        tokens.push(token);
    }

    if verbose {
        println!("Tokens: {:?}", tokens);
    }

    // Parse the source code
    if verbose {
        println!("Parsing...");
    }

    let mut parser = Parser::new(&contents)?;
    let ast = parser.parse_program()?;

    if verbose {
        println!("AST: {:?}", ast);
    }

    // Perform semantic analysis
    if verbose {
        println!("Performing semantic analysis...");
    }

    let mut semantic_analyzer = SemanticAnalyzer::new();
    semantic_analyzer.analyze(&ast)?;

    // Create module resolver with project root for package management
    let project_root = input.parent().unwrap_or_else(|| std::path::Path::new(".")).to_path_buf();
    let module_resolver = kodeon_compiler::ModuleResolver::with_project_root(project_root);

    // Generate IR
    if verbose {
        println!("Generating IR...");
    }

    let mut ir_generator = IRGenerator::with_module_resolver(module_resolver);
    let mut ir_module = ir_generator.generate_ir(&ast)?;

    // Apply optimizations
    if verbose {
        println!("Applying optimizations...");
    }

    let optimizer = kodeon_compiler::Optimizer::new();
    optimizer.optimize(&mut ir_module)?;

    if verbose {
        println!("Optimized IR generated:");
        print_ir(&ir_module);
    }

    // Handle different targets
    match target.as_deref() {
        Some("llvm") | None if generate_llvm => {
            // Generate LLVM IR
            println!("Generating LLVM IR...");
            let context = Context::create();
            let module_name = input.file_stem().unwrap().to_str().unwrap();
            let mut llvm_backend = LLVMBackend::new(&context, module_name);

            llvm_backend.compile_ir(&ir_module)?;

            // Determine output path
            let output_path = match output {
                Some(path) => path.clone(),
                None => {
                    let mut path = input.clone();
                    path.set_extension("ll");
                    path
                }
            };

            // Write LLVM IR to file
            llvm_backend.write_ir_to_file(output_path.to_str().unwrap())?;
            println!("LLVM IR written to {}", output_path.display());

            // Print LLVM IR to stdout if verbose
            if verbose {
                llvm_backend.print_ir();
            }

            // Execute if requested
            if execute {
                // For now, we'll just print a message since actual execution would require
                // additional steps like JIT compilation or linking with a runtime
                println!("Note: Execution of LLVM IR not yet implemented. Use the generated .ll file with LLVM tools.");
            }
        }
        Some("javascript") => {
            // TODO: Implement JavaScript transpilation
            println!("JavaScript transpilation not yet implemented");

            // Determine output path
            let output_path = match output {
                Some(path) => path.clone(),
                None => {
                    let mut path = input.clone();
                    path.set_extension("js");
                    path
                }
            };

            // Write a placeholder JavaScript file
            std::fs::write(&output_path, "// JavaScript transpilation placeholder")?;
            println!("JavaScript output written to {}", output_path.display());
        }
        Some("python") => {
            // TODO: Implement Python transpilation
            println!("Python transpilation not yet implemented");

            // Determine output path
            let output_path = match output {
                Some(path) => path.clone(),
                None => {
                    let mut path = input.clone();
                    path.set_extension("py");
                    path
                }
            };

            // Write a placeholder Python file
            std::fs::write(&output_path, "# Python transpilation placeholder")?;
            println!("Python output written to {}", output_path.display());
        }
        Some(target) => {
            return Err(format!("Unknown target: {}", target).into());
        }
        None => {
            // Default behavior - just generate IR and print it
            if !verbose {
                print_ir(&ir_module);
            }

            // Determine output path
            let output_path = match output {
                Some(path) => path.clone(),
                None => {
                    let mut path = input.clone();
                    path.set_extension("ir");
                    path
                }
            };

            // Write IR to file
            std::fs::write(&output_path, format!("{:#?}", ir_module))?;
            println!("IR written to {}", output_path.display());
        }
    }

    Ok(())
}
