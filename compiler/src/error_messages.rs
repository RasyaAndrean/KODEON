//! Enhanced error messages for the KODEON programming language

use crate::lexer::Position;

/// Error message templates with multi-language support
pub struct ErrorMessage {
    pub id: &'static str,
    pub english: &'static str,
    pub indonesian: &'static str,
    pub context: &'static str,
    pub suggestion: &'static str,
    pub example: &'static str,
}

/// Collection of error messages
pub struct ErrorMessages;

impl ErrorMessages {
    /// Get error message by ID and language
    pub fn get_message(id: &str, language: &str) -> Option<&'static ErrorMessage> {
        match id {
            "unexpected_token" => Some(&UNEXPECTED_TOKEN),
            "unexpected_eof" => Some(&UNEXPECTED_EOF),
            "undeclared_variable" => Some(&UNDECLARED_VARIABLE),
            "duplicate_declaration" => Some(&DUPLICATE_DECLARATION),
            "type_mismatch" => Some(&TYPE_MISMATCH),
            "invalid_operation" => Some(&INVALID_OPERATION),
            "uninitialized_variable" => Some(&UNINITIALIZED_VARIABLE),
            _ => None,
        }
    }
}

// Error message definitions
lazy_static::lazy_static! {
    pub static ref UNEXPECTED_TOKEN: ErrorMessage = ErrorMessage {
        id: "unexpected_token",
        english: "Unexpected token",
        indonesian: "Token tidak terduga",
        context: "The parser encountered a token it wasn't expecting at this position.",
        suggestion: "Check if you've forgotten a semicolon, brace, or other punctuation mark.",
        example: "   // Correct syntax:\n   x = 5;\n   y = 10;"
    };

    pub static ref UNEXPECTED_EOF: ErrorMessage = ErrorMessage {
        id: "unexpected_eof",
        english: "Unexpected end of file",
        indonesian: "Akhir file tidak terduga",
        context: "The parser reached the end of the file while expecting more tokens.",
        suggestion: "Check if you've closed all braces, parentheses, or other delimiters.",
        example: "   // Correct syntax:\n   function example() {\n       // code here\n   }"
    };

    pub static ref UNDECLARED_VARIABLE: ErrorMessage = ErrorMessage {
        id: "undeclared_variable",
        english: "Undeclared variable",
        indonesian: "Variabel tidak dideklarasikan",
        context: "You're trying to use a variable that hasn't been declared.",
        suggestion: "Declare the variable before using it, or check if you've spelled the name correctly.",
        example: "   // Correct syntax:\n   var jumlah = 0;\n   hasil = jumlah + 5;"
    };

    pub static ref DUPLICATE_DECLARATION: ErrorMessage = ErrorMessage {
        id: "duplicate_declaration",
        english: "Duplicate declaration",
        indonesian: "Deklarasi duplikat",
        context: "You're trying to declare a variable or function that already exists in this scope.",
        suggestion: "Use a different name, or remove the duplicate declaration.",
        example: "   // Correct syntax:\n   var x = 5;\n   var y = 10;  // Different name"
    };

    pub static ref TYPE_MISMATCH: ErrorMessage = ErrorMessage {
        id: "type_mismatch",
        english: "Type mismatch",
        indonesian: "Ketidakcocokan tipe",
        context: "You're trying to perform an operation on incompatible types.",
        suggestion: "Convert one of the values to match the other type, or use an appropriate operation.",
        example: "   // Correct syntax:\n   hasil = string(5) + \"hello\";  // Convert int to string\n   // Or:\n   hasil = 5 + int(\"10\");  // Convert string to int"
    };

    pub static ref INVALID_OPERATION: ErrorMessage = ErrorMessage {
        id: "invalid_operation",
        english: "Invalid operation",
        indonesian: "Operasi tidak valid",
        context: "The operation you're trying to perform is not supported on this type.",
        suggestion: "Check if you're using the correct operator for this type, or convert to a compatible type.",
        example: "   // Correct syntax:\n   var x = 5;\n   var y = x + 10;  // Addition is supported for integers"
    };

    pub static ref UNINITIALIZED_VARIABLE: ErrorMessage = ErrorMessage {
        id: "uninitialized_variable",
        english: "Uninitialized variable",
        indonesian: "Variabel tidak diinisialisasi",
        context: "You're trying to use a variable before giving it a value.",
        suggestion: "Assign a value to the variable before using it.",
        example: "   // Correct syntax:\n   var x;  // Declaration\n   x = 5;  // Initialization\n   print(x);  // Usage"
    };
}

/// Create an enhanced parse error with detailed information
pub fn create_enhanced_parse_error(
    error_type: &str,
    expected: String,
    found: String,
    position: Position,
    language: &str,
) -> crate::parser::ParseError {
    if let Some(msg) = ErrorMessages::get_message(error_type, language) {
        match error_type {
            "unexpected_token" => crate::parser::ParseError::UnexpectedToken {
                expected,
                found,
                position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
            "unexpected_eof" => crate::parser::ParseError::UnexpectedEOF {
                expected,
                position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
            _ => crate::parser::ParseError::InvalidSyntax {
                message: if language == "indonesian" { msg.indonesian } else { msg.english }.to_string(),
                position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
        }
    } else {
        // Fallback to basic error
        crate::parser::ParseError::InvalidSyntax {
            message: format!("Unknown error: {}", error_type),
            position,
            context: "".to_string(),
            suggestion: "".to_string(),
            example: "".to_string(),
        }
    }
}

/// Create an enhanced semantic error with detailed information
pub fn create_enhanced_semantic_error(
    error_type: &str,
    name: String,
    expected: String,
    found: String,
    position: Position,
    first_position: Option<Position>,
    language: &str,
) -> crate::semantic_analyzer::SemanticError {
    if let Some(msg) = ErrorMessages::get_message(error_type, language) {
        match error_type {
            "undeclared_variable" => crate::semantic_analyzer::SemanticError::UndeclaredVariable {
                name,
                position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
            "duplicate_declaration" => crate::semantic_analyzer::SemanticError::DuplicateDeclaration {
                name,
                first_position: first_position.unwrap_or(position.clone()),
                duplicate_position: position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
            "type_mismatch" => crate::semantic_analyzer::SemanticError::TypeMismatch {
                expected,
                found,
                position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
            "invalid_operation" => crate::semantic_analyzer::SemanticError::InvalidOperation {
                message: if language == "indonesian" { msg.indonesian } else { msg.english }.to_string(),
                position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
            "uninitialized_variable" => crate::semantic_analyzer::SemanticError::UninitializedVariable {
                name,
                position,
                context: msg.context.to_string(),
                suggestion: if language == "indonesian" { msg.suggestion } else { msg.english }.to_string(),
                example: msg.example.to_string(),
            },
            _ => crate::semantic_analyzer::SemanticError::InvalidOperation {
                message: format!("Unknown error: {}", error_type),
                position,
                context: "".to_string(),
                suggestion: "".to_string(),
                example: "".to_string(),
            },
        }
    } else {
        // Fallback to basic error
        crate::semantic_analyzer::SemanticError::InvalidOperation {
            message: format!("Unknown error: {}", error_type),
            position,
            context: "".to_string(),
            suggestion: "".to_string(),
            example: "".to_string(),
        }
    }
}
