//! Test for KODEON concurrency features

use kodeon_compiler::{Lexer, Parser, SemanticAnalyzer, IRGenerator};
use kodeon_compiler::llvm_backend::LLVMBackend;
use inkwell::context::Context;

#[test]
fn test_concurrency_parsing() {
    let source = r#"
fungsi utama() {
    var ch = buat_channel(int)
    var mtx = buat_mutex()
    var cond = buat_kondisi()
    var addr = buat_alamat(0)

    jalan {
        kirim ch <- 42
        simpan_atomik addr, 1
        sinyal_kondisi cond
    }

    var nilai = terima <- ch
    kunci_mutex mtx
    tunggu_kondisi cond, mtx
    buka_kunci_mutex mtx
    var hasil = muat_atomik addr

    kembali 0
}
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
    let mut llvm_backend = LLVMBackend::new(&context, "test_concurrency");
    llvm_backend.compile_ir(&ir_module).unwrap();

    // Print the LLVM IR for verification
    llvm_backend.print_ir();
}

#[test]
fn test_concurrency_parsing_english() {
    let source = r#"
function main() {
    var ch = make_channel(int)
    var mtx = make_mutex()
    var cond = create_condition()
    var addr = create_address(0)

    go {
        send ch <- 42
        atomic_store addr, 1
        signal_condition cond
    }

    var value = receive <- ch
    lock_mutex mtx
    wait_condition cond, mtx
    unlock_mutex mtx
    var result = atomic_load addr

    return 0
}
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
    let mut llvm_backend = LLVMBackend::new(&context, "test_concurrency_en");
    llvm_backend.compile_ir(&ir_module).unwrap();

    // Print the LLVM IR for verification
    llvm_backend.print_ir();
}
