//! Test for standard library integration

use kodeon_compiler::lexer::Lexer;
use kodeon_compiler::parser::Parser;
use kodeon_compiler::ir::IRGenerator;
use kodeon_compiler::module_resolver::ModuleResolver;

#[test]
fn test_module_resolver_stdlib() {
    let mut resolver = ModuleResolver::new();

    // Test that core modules can be resolved
    assert!(resolver.resolve_module("core").is_ok());
    assert!(resolver.resolve_module("math").is_ok());
    assert!(resolver.resolve_module("collections").is_ok());
    assert!(resolver.resolve_module("string").is_ok());
    assert!(resolver.resolve_module("json").is_ok());
    assert!(resolver.resolve_module("system").is_ok());
    assert!(resolver.resolve_module("io").is_ok());
    assert!(resolver.resolve_module("time").is_ok());
    assert!(resolver.resolve_module("concurrent").is_ok());

    // Test that nonexistent modules return an error
    assert!(resolver.resolve_module("nonexistent").is_err());
}

#[test]
fn test_import_parsing() {
    let source = r#"
        impor "core"
        impor "math" sebagai m
        fungsi utama() {
            tampilkan("Hello, World!")
            kembalikan 0
        }
    "#;

    let mut parser = Parser::new(source).expect("Failed to create parser");
    let ast = parser.parse_program().expect("Failed to parse program");

    // The parsing should succeed without errors
    assert!(matches!(ast, kodeon_compiler::parser::ASTNode::Program(_)));
}

#[test]
fn test_import_ir_generation() {
    let source = r#"
        impor "core"
        impor "math" sebagai m
        fungsi utama() {
            tampilkan("Hello, World!")
            kembalikan 0
        }
    "#;

    let mut parser = Parser::new(source).expect("Failed to create parser");
    let ast = parser.parse_program().expect("Failed to parse program");

    let mut ir_generator = IRGenerator::new();
    let result = ir_generator.generate_ir(&ast);

    // IR generation should succeed
    assert!(result.is_ok());
}
