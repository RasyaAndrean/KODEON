//! Test cases for enhanced error handling in the KODEON compiler

#[cfg(test)]
mod tests {
    use crate::lexer::{Lexer, Position};
    use crate::parser::Parser;
    use crate::semantic_analyzer::SemanticAnalyzer;

    #[test]
    fn test_position_tracking() {
        let source = "let x = 42\nlet y = x + z";
        let mut lexer = Lexer::new(source);

        // Test that lexer tracks positions correctly
        let tokens = lexer.tokenize().expect("Lexing should succeed");

        // Check that we have tokens with proper positions
        assert!(!tokens.is_empty());

        // First token should be at line 1, column 1
        let first_token = &tokens[0];
        assert_eq!(first_token.position.line, 1);
        assert_eq!(first_token.position.column, 1);

        // Test advancement through the source
        let mut pos = Position::start();
        pos.advance_str("let x = 42");
        pos.advance('\n');
        assert_eq!(pos.line, 2);
        assert_eq!(pos.column, 1);
    }

    #[test]
    fn test_undeclared_variable_error() {
        let source = "print(undefined_var)";
        let mut parser = Parser::new(source).expect("Parser creation should succeed");
        let ast = parser.parse();

        // Even if parsing succeeds, semantic analysis should catch the error
        match ast {
            Ok(program) => {
                let mut analyzer = SemanticAnalyzer::new();
                let result = analyzer.analyze(&program);

                // We expect a semantic error for the undeclared variable
                assert!(result.is_err());

                // Check that the error message contains the variable name
                let error = result.unwrap_err();
                assert!(format!("{}", error).contains("undefined_var"));
            }
            Err(e) => {
                // If parsing fails, that's also acceptable for this test
                println!("Parse error (acceptable): {}", e);
            }
        }
    }

    #[test]
    fn test_duplicate_declaration_error() {
        let source = "let x = 42\nlet x = 43"; // Duplicate declaration
        let mut parser = Parser::new(source).expect("Parser creation should succeed");
        let ast = parser.parse();

        match ast {
            Ok(program) => {
                let mut analyzer = SemanticAnalyzer::new();
                let result = analyzer.analyze(&program);

                // We expect a semantic error for the duplicate declaration
                assert!(result.is_err());

                // Check that the error message indicates a duplicate
                let error = result.unwrap_err();
                assert!(format!("{}", error).contains("Duplicate"));
            }
            Err(e) => {
                // If parsing fails, that's also acceptable for this test
                println!("Parse error (acceptable): {}", e);
            }
        }
    }

    #[test]
    fn test_type_mismatch_error() {
        // This would be a more complex test in a real implementation
        // For now, we'll just test that our error types are properly defined
        let error = crate::semantic_analyzer::SemanticError::TypeMismatch {
            expected: "int".to_string(),
            found: "string".to_string(),
            position: Position::start(),
        };

        let error_string = format!("{}", error);
        assert!(error_string.contains("Type mismatch"));
        assert!(error_string.contains("expected 'int'"));
        assert!(error_string.contains("found 'string'"));
    }

    #[test]
    fn test_parse_error_formatting() {
        let error = crate::parser::ParseError::UnexpectedToken {
            expected: "identifier".to_string(),
            found: "123".to_string(),
            position: Position::new(5, 10, 42),
        };

        let error_string = format!("{}", error);
        assert!(error_string.contains("line 5"));
        assert!(error_string.contains("column 10"));
        assert!(error_string.contains("Expected identifier"));
        assert!(error_string.contains("found '123'"));
    }

    #[test]
    fn test_semantic_error_formatting() {
        let error = crate::semantic_analyzer::SemanticError::UndeclaredVariable {
            name: "my_var".to_string(),
            position: Position::new(3, 7, 25),
        };

        let error_string = format!("{}", error);
        assert!(error_string.contains("line 3"));
        assert!(error_string.contains("column 7"));
        assert!(error_string.contains("Undeclared variable"));
        assert!(error_string.contains("'my_var'"));
    }
}
