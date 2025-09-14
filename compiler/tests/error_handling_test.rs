//! Test for enhanced error handling in the KODEON compiler

use kodeon_compiler::{Lexer, Parser, SemanticAnalyzer};

#[test]
fn test_enhanced_parse_error() {
    // Test case with syntax error
    let source = r#"
    fungsi utama() {
        x = 5
        y = 10
    "#;

    let mut parser = Parser::new(source).expect("Failed to create parser");

    // This should produce an enhanced error message
    let result = parser.parse_program();

    assert!(result.is_err());

    let error = result.unwrap_err();
    let error_string = format!("{}", error);

    // Check that the error message contains enhanced information
    assert!(error_string.contains("Parse error"));
    assert!(error_string.contains("line 4"));
    assert!(error_string.contains("column 5"));

    // Check for enhanced elements
    assert!(error_string.contains("💡"));
    println!("Enhanced error message:\n{}", error_string);
}

#[test]
fn test_enhanced_semantic_error() {
    // Test case with semantic error (undeclared variable)
    let source = r#"
    fungsi utama() {
        hasil = jumlah + 5
    }
    "#;

    let mut parser = Parser::new(source).expect("Failed to create parser");
    let ast = parser.parse_program().expect("Failed to parse");

    let mut semantic_analyzer = SemanticAnalyzer::new();
    let result = semantic_analyzer.analyze(&ast);

    assert!(result.is_err());

    let error = result.unwrap_err();
    let error_string = format!("{}", error);

    // Check that the error message contains enhanced information
    assert!(error_string.contains("Semantic error"));
    assert!(error_string.contains("line 3"));
    assert!(error_string.contains("column 17"));
    assert!(error_string.contains("jumlah"));

    // Check for enhanced elements
    assert!(error_string.contains("💡"));
    assert!(error_string.contains("📘"));
    println!("Enhanced error message:\n{}", error_string);
}

#[test]
fn test_type_mismatch_error() {
    // Test case with type mismatch error
    let source = r#"
    fungsi utama() {
        var x = 5
        var y = "hello"
        var z = x + y
    }
    "#;

    let mut parser = Parser::new(source).expect("Failed to create parser");
    let ast = parser.parse_program().expect("Failed to parse");

    let mut semantic_analyzer = SemanticAnalyzer::new();
    let result = semantic_analyzer.analyze(&ast);

    assert!(result.is_err());

    let error = result.unwrap_err();
    let error_string = format!("{}", error);

    // Check that the error message contains enhanced information
    assert!(error_string.contains("Type mismatch"));
    assert!(error_string.contains("line 5"));

    // Check for enhanced elements
    assert!(error_string.contains("💡"));
    assert!(error_string.contains("📘"));
    println!("Enhanced error message:\n{}", error_string);
}
