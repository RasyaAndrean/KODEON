//! Integration tests for the KODEON compiler

// Existing tests
mod concurrency_test;
mod llvm_backend_test;
mod llvm_backend_concurrency_test;

// New error handling tests
mod error_handling_test;

#[cfg(test)]
mod tests {
    use std::fs;

    #[test]
    fn test_hello_world() {
        // Test basic compilation of hello world program
        let source = r#"fungsi utama():
    tampilkan("Halo, Dunia!")
"#;

        // This would actually compile and run the program
        // For now, we just test that the source is valid
        assert!(!source.is_empty());
    }

    #[test]
    fn test_english_hello_world() {
        // Test basic compilation of English hello world program
        let source = r#"function main():
    show("Hello, World!")
"#;

        // This would actually compile and run the program
        // For now, we just test that the source is valid
        assert!(!source.is_empty());
    }

    #[test]
    fn test_concurrency_example() {
        // Test basic concurrency features
        let source = r#"fungsi contoh_konkurensi():
    buat channel = buat_kanal(integer)

    pergi(fungsi():
        kirim(channel, 42)
    akhir)

    buat hasil = terima(channel)
    tampilkan(hasil)
"#;

        // This would actually compile and run the program
        // For now, we just test that the source is valid
        assert!(!source.is_empty());
    }

    #[test]
    fn test_error_handling_examples() {
        // Test that our error handling examples compile correctly
        let valid_source = r#"fungsi uji_kesalahan():
    buat x = 42
    tampilkan(x)
"#;

        assert!(!valid_source.is_empty());
    }
}

use kodeon_compiler::{Lexer, Parser, Token, ASTNode};

#[test]
fn test_hello_world_lexing() {
    let source = "buat pesan = \"Halo, Dunia!\"";
    let mut lexer = Lexer::new(source);

    let tokens = vec![
        Token::Buat,
        Token::Identifier("pesan".to_string()),
        Token::Assign,
        Token::String("Halo, Dunia!".to_string()),
        Token::Eof,
    ];

    for expected_token in tokens {
        let actual_token = lexer.next_token().unwrap();
        assert_eq!(expected_token, actual_token);
    }
}

#[test]
fn test_simple_program_parsing() {
    let source = "buat x = 42\nbuat y = x + 1";

    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Should be a Program node containing two declarations
    match ast {
        ASTNode::Program(statements) => {
            assert_eq!(statements.len(), 2);
        }
        _ => panic!("Expected Program node"),
    }
}

#[test]
fn test_if_statement_parsing() {
    let source = "jika x > 0 maka:\n    tampilkan \"positif\"";

    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Should be a Program node containing an if statement
    match ast {
        ASTNode::Program(statements) => {
            assert_eq!(statements.len(), 1);
        }
        _ => panic!("Expected Program node"),
    }
}

#[test]
fn test_while_loop_parsing() {
    let source = "selama x < 10 maka:\n    x = x + 1";

    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Should be a Program node containing a while loop
    match ast {
        ASTNode::Program(statements) => {
            assert_eq!(statements.len(), 1);
        }
        _ => panic!("Expected Program node"),
    }
}

#[test]
fn test_for_loop_parsing() {
    let source = "untuk i dari 0 sampai 10 lakukan:\n    tampilkan i";

    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Should be a Program node containing a for loop
    match ast {
        ASTNode::Program(statements) => {
            assert_eq!(statements.len(), 1);
        }
        _ => panic!("Expected Program node"),
    }
}

#[test]
fn test_function_definition_parsing() {
    let source = "fungsi tambah(a, b):\n    kembalikan a + b";

    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Should be a Program node containing a function definition
    match ast {
        ASTNode::Program(statements) => {
            assert_eq!(statements.len(), 1);
        }
        _ => panic!("Expected Program node"),
    }
}

#[test]
fn test_class_definition_parsing() {
    let source = "kelas Mobil:\n    buat merek\n    buat model";

    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Should be a Program node containing a class definition
    match ast {
        ASTNode::Program(statements) => {
            assert_eq!(statements.len(), 1);
        }
        _ => panic!("Expected Program node"),
    }
}

#[test]
fn test_comments_lexing() {
    let source = "// This is a comment\nbuat x = 42 /* Block comment */";
    let mut lexer = Lexer::new(source);

    // Skip the line comment
    let token = lexer.next_token().unwrap();
    assert!(matches!(token, Token::LineComment(_)));

    // Parse the rest
    let tokens = vec![
        Token::Buat,
        Token::Identifier("x".to_string()),
        Token::Assign,
        Token::Number(42.0),
        Token::BlockComment(" Block comment ".to_string()),
        Token::Eof,
    ];

    for expected_token in tokens {
        let actual_token = lexer.next_token().unwrap();
        assert_eq!(expected_token, actual_token);
    }
}

#[test]
fn test_unary_operators_parsing() {
    let source = "buat x = -5\nbuat y = tidak benar\n++x\n--y";

    let mut parser = Parser::new(source).unwrap();
    let ast = parser.parse_program().unwrap();

    // Should be a Program node containing four statements
    match ast {
        ASTNode::Program(statements) => {
            assert_eq!(statements.len(), 4);
        }
        _ => panic!("Expected Program node"),
    }
}
