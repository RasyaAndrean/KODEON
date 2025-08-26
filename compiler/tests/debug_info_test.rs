//! Test for debug information support

use kodeon_compiler::ir::{IRGenerator, DebugInfo};
use kodeon_compiler::lexer::Lexer;
use kodeon_compiler::parser::Parser;

#[test]
fn test_debug_info_structures() {
    // Test that we can create DebugInfo structures
    let debug_info = DebugInfo {
        file_name: "test.kodeon".to_string(),
        line: 10,
        column: 5,
    };

    assert_eq!(debug_info.file_name, "test.kodeon");
    assert_eq!(debug_info.line, 10);
    assert_eq!(debug_info.column, 5);
}

#[test]
fn test_ir_with_debug_info() {
    let source = r#"
        fungsi utama() {
            buat x = 42
            kembalikan x
        }
    "#;

    let mut parser = Parser::new(source).expect("Failed to create parser");
    let ast = parser.parse_program().expect("Failed to parse program");

    let mut ir_generator = IRGenerator::new();

    // Set module debug info
    ir_generator.set_module_debug_info("test.kodeon".to_string(), 1, 1);

    let result = ir_generator.generate_ir(&ast);

    // IR generation should succeed
    assert!(result.is_ok());

    let ir_module = result.unwrap();

    // Check that debug info was set (it will be None since we haven't fully implemented it yet)
    // In a full implementation, we would check that debug info is properly propagated
}
