//! Parser for the KODEON programming language

use crate::lexer::{Lexer, Token, Position};
use std::collections::HashMap;

/// Enhanced AST node with position information for better error reporting
#[derive(Debug, PartialEq)]
pub struct PositionedASTNode {
    pub node: ASTNode,
    pub position: Position,
}

/// Abstract Syntax Tree nodes
#[derive(Debug, PartialEq)]
pub enum ASTNode {
    Program(Vec<Statement>),
    // Statements
    Declaration {
        identifier: String,
        value: Box<PositionedASTNode>,
        mutable: bool, // for let/mut bindings
    },
    Assignment {
        identifier: String,
        value: Box<PositionedASTNode>,
    },
    ExpressionStmt(Box<PositionedASTNode>),
    IfStatement {
        condition: Box<PositionedASTNode>,
        then_block: Vec<Statement>,
        else_block: Option<Vec<Statement>>,
    },
    FunctionDef {
        name: String,
        parameters: Vec<String>,
        body: Vec<Statement>,
        access_modifier: Option<String>, // public, private, protected
        is_static: bool,
        is_async: bool,
    },
    ClassDef {
        name: String,
        body: Vec<Statement>,
        access_modifier: Option<String>, // public, private, protected
        parent_class: Option<String>, // inheritance
    },
    ReturnStmt(Box<PositionedASTNode>),
    WhileLoop {
        condition: Box<PositionedASTNode>,
        body: Vec<Statement>,
    },
    ForLoop {
        variable: String,
        start: Box<PositionedASTNode>,
        end: Box<PositionedASTNode>,
    },
    ForEachLoop {
        variable: String,
        iterable: Box<PositionedASTNode>,
        body: Vec<Statement>,
    },
    TryCatch {
        try_block: Vec<Statement>,
        catch_block: Vec<Statement>,
        finally_block: Option<Vec<Statement>>,
    },
    BreakStmt,
    ContinueStmt,
    ImportStmt {
        module: String,
        alias: Option<String>,
    },
    WhenStmt { // Pattern matching
        expression: Box<PositionedASTNode>,
        cases: Vec<(PositionedASTNode, Vec<Statement>)>, // pattern, body
        else_case: Option<Vec<Statement>>,
    },

    // Concurrency Statements
    GoStmt {
        body: Vec<Statement>,
    },
    ChannelSendStmt {
        channel: Box<PositionedASTNode>,
        value: Box<PositionedASTNode>,
    },
    ChannelReceiveStmt {
        channel: Box<PositionedASTNode>,
        variable: String,
    },
    MakeChannelExpr {
        element_type: Box<PositionedASTNode>,
    },
    MutexLockStmt {
        mutex: Box<PositionedASTNode>,
    },
    MutexUnlockStmt {
        mutex: Box<PositionedASTNode>,
    },
    CreateConditionExpr,
    WaitConditionStmt {
        condition: Box<PositionedASTNode>,
        mutex: Box<PositionedASTNode>,
    },
    SignalConditionStmt {
        condition: Box<PositionedASTNode>,
    },
    BroadcastConditionStmt {
        condition: Box<PositionedASTNode>,
    },
    AtomicLoadExpr {
        address: Box<PositionedASTNode>,
    },
    AtomicStoreStmt {
        address: Box<PositionedASTNode>,
        value: Box<PositionedASTNode>,
    },
    CreateAddressExpr {
        initial_value: Box<PositionedASTNode>,
    },

    // Expressions
    BinaryOp {
        left: Box<PositionedASTNode>,
        operator: BinaryOperator,
        right: Box<PositionedASTNode>,
    },
    UnaryOp {
        operator: UnaryOperator,
        operand: Box<PositionedASTNode>,
    },
    Identifier(String),
    Number(f64),
    String(String),
    Boolean(bool),
    FunctionCall {
        name: String,
        arguments: Vec<PositionedASTNode>,
    },
    MemberAccess {
        object: Box<PositionedASTNode>,
        property: String,
    },
    ArrayLiteral(Vec<PositionedASTNode>),
    ObjectLiteral(HashMap<String, PositionedASTNode>),
    ListComprehension { // Python-like list comprehension
        expression: Box<PositionedASTNode>,
        variable: String,
        iterable: Box<PositionedASTNode>,
        condition: Option<Box<PositionedASTNode>>,
    },
    RangeExpr {
        start: Box<PositionedASTNode>,
        end: Box<PositionedASTNode>,
        inclusive: bool,
    },
    OptionalExpr { // Swift-like optional
        value: Box<PositionedASTNode>,
    },
    PointerExpr { // C++-like pointer
        value: Box<PositionedASTNode>,
    },
    ReferenceExpr { // C++-like reference
        value: Box<PositionedASTNode>,
    },
    AwaitExpr(Box<PositionedASTNode>), // async/await
    YieldExpr(Box<PositionedASTNode>), // generators
}

/// Enhanced statement with position information
#[derive(Debug, PartialEq)]
pub struct Statement {
    pub node: ASTNode,
    pub position: Position,
}

/// Parser error with position information for better error reporting
#[derive(Debug)]
pub enum ParseError {
    UnexpectedToken {
        expected: String,
        found: String,
        position: Position,
    },
    UnexpectedEOF {
        expected: String,
        position: Position,
    },
    InvalidSyntax {
        message: String,
        position: Position,
    },
}

impl std::fmt::Display for ParseError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            ParseError::UnexpectedToken { expected, found, position } => {
                write!(f, "Parse error at line {}, column {}: Expected {}, found '{}'",
                       position.line, position.column, expected, found)
            }
            ParseError::UnexpectedEOF { expected, position } => {
                write!(f, "Parse error at line {}, column {}: Unexpected end of file, expected {}",
                       position.line, position.column, expected)
            }
            ParseError::InvalidSyntax { message, position } => {
                write!(f, "Parse error at line {}, column {}: {}",
                       position.line, position.column, message)
            }
        }
    }
}

impl std::error::Error for ParseError {}

/// Binary operators
#[derive(Debug, PartialEq, Clone)]
pub enum BinaryOperator {
    Add,        // +
    Subtract,   // -
    Multiply,   // *
    Divide,     // /
    Modulo,     // %
    Power,      // **
    Equal,      // ==
    NotEqual,   // !=
    Less,       // <
    Greater,    // >
    LessEqual,  // <=
    GreaterEqual, // >=
    And,        // and / dan
    Or,         // or / atau
    Assign,     // =
    BitAnd,     // &
    BitOr,      // |
    BitXor,     // ^
    LeftShift,  // <<
    RightShift, // >>
    Range,      // ..
    In,         // in
    // Natural language operators
    Tambah,     // tambah (add in Indonesian)
    Kurang,     // kurang (subtract in Indonesian)
    Kali,       // kali (multiply in Indonesian)
    Bagi,       // bagi (divide in Indonesian)
    SamaDengan, // sama dengan (equal in Indonesian)
    LebihDari,  // lebih dari (greater than in Indonesian)
    KurangDari, // kurang dari (less than in Indonesian)
}

/// Unary operators
#[derive(Debug, PartialEq, Clone)]
pub enum UnaryOperator {
    Negate,     // -
    Not,        // not / tidak
    Increment,  // ++
    Decrement,  // --
    BitNot,     // ~
    Dereference, // *
    AddressOf,  // &
    // Natural language unary operators
    Balik,      // balik (reverse/negate in Indonesian)
    Tidak,      // tidak (not in Indonesian)
}

/// Parser for KODEON source code
pub struct Parser<'a> {
    lexer: Lexer<'a>,
    current_token: Token,
    current_position: Position,
}

impl<'a> Parser<'a> {
    /// Create a new parser for the given input
    pub fn new(input: &'a str) -> Result<Self, ParseError> {
        let mut lexer = Lexer::new(input);
        let current_token = lexer.next_token()?;
        let current_position = Position { line: 1, column: 1 }; // Initial position

        Ok(Parser {
            lexer,
            current_token,
            current_position,
        })
    }

    /// Parse the entire program
    pub fn parse_program(&mut self) -> Result<ASTNode, ParseError> {
        let mut statements = Vec::new();
        let start_position = self.current_position.clone();

        while self.current_token != Token::Eof {
            // Skip comments
            match &self.current_token {
                Token::LineComment(_) | Token::BlockComment(_) => {
                    self.consume()?;
                    continue;
                }
                _ => {}
            }

            statements.push(self.parse_statement()?);
        }

        Ok(ASTNode::Program(statements))
    }

    /// Parse a statement
    fn parse_statement(&mut self) -> Result<Statement, ParseError> {
        let token = self.lexer.peek_token()?.clone();
        let position = self.lexer.current_position();

        match token {
            Token::Jika | Token::If => self.parse_if_statement(),
            Token::Fungsi | Token::Function => self.parse_function_definition(),
            Token::Kelas | Token::Class => self.parse_class_definition(),
            Token::Kembalikan | Token::Return => self.parse_return_statement(),
            Token::Selama | Token::While => self.parse_while_loop(),
            Token::Untuk | Token::For => self.parse_for_loop(),
            Token::Coba | Token::Try => self.parse_try_catch(),
            Token::Pecah | Token::Break => {
                self.lexer.next_token()?; // consume break
                Ok(Statement::BreakStmt)
            }
            Token::Lanjut | Token::Continue => {
                self.lexer.next_token()?; // consume continue
                Ok(Statement::ContinueStmt)
            }
            Token::Jalan | Token::Go => self.parse_go_statement(),
            Token::KunciMutex | Token::LockMutex => self.parse_mutex_lock_statement(),
            Token::BukaKunciMutex | Token::UnlockMutex => self.parse_mutex_unlock_statement(),
            Token::TungguKondisi | Token::WaitCondition => self.parse_wait_condition_statement(),
            Token::SinyalKondisi | Token::SignalCondition => self.parse_signal_condition_statement(),
            Token::SiarkanKondisi | Token::BroadcastCondition => self.parse_broadcast_condition_statement(),
            Token::Impor | Token::Import => self.parse_import_statement(),
            Token::Ketika | Token::When => self.parse_when_statement(),
            Token::Variabel | Token::Variable | Token::Biarkan | Token::Let | Token::Mut => {
                self.parse_declaration_statement()
            }
            _ => {
                // Try to parse as expression statement
                let expr = self.parse_expression(0)?;
                if self.lexer.peek_token()? == &Token::Assign {
                    self.parse_assignment_statement(expr)
                } else {
                    Ok(Statement::ExpressionStmt(expr))
                }
            }
        }
    }

    /// Parse a go statement
    fn parse_go_statement(&mut self) -> Result<Statement, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume go/jalan

        // Expect left brace
        self.expect_token(Token::LeftBrace)?;

        // Parse body
        let mut body = Vec::new();
        while self.lexer.peek_token()? != &Token::RightBrace && self.lexer.peek_token()? != &Token::Eof {
            body.push(self.parse_statement()?);
        }

        // Expect right brace
        self.expect_token(Token::RightBrace)?;

        Ok(Statement::GoStmt {
            body,
            position,
        })
    }

    /// Parse a mutex lock statement
    fn parse_mutex_lock_statement(&mut self) -> Result<Statement, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume lock_mutex/kunci_mutex

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse mutex expression
        let mutex = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(Statement::MutexLockStmt {
            mutex,
            position,
        })
    }

    /// Parse a mutex unlock statement
    fn parse_mutex_unlock_statement(&mut self) -> Result<Statement, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume unlock_mutex/buka_kunci_mutex

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse mutex expression
        let mutex = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(Statement::MutexUnlockStmt {
            mutex,
            position,
        })
    }

    /// Parse a wait condition statement
    fn parse_wait_condition_statement(&mut self) -> Result<Statement, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume wait_condition/tunggu_kondisi

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse condition expression
        let condition = self.parse_expression(0)?;

        // Expect comma
        self.expect_token(Token::Comma)?;

        // Parse mutex expression
        let mutex = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(Statement::WaitConditionStmt {
            condition,
            mutex,
            position,
        })
    }

    /// Parse a signal condition statement
    fn parse_signal_condition_statement(&mut self) -> Result<Statement, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume signal_condition/sinyal_kondisi

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse condition expression
        let condition = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(Statement::SignalConditionStmt {
            condition,
            position,
        })
    }

    /// Parse a broadcast condition statement
    fn parse_broadcast_condition_statement(&mut self) -> Result<Statement, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume broadcast_condition/siaran_kondisi

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse condition expression
        let condition = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(Statement::BroadcastConditionStmt {
            condition,
            position,
        })
    }

    /// Parse an expression
    fn parse_expression(&mut self, precedence: u8) -> Result<ASTNode, ParseError> {
        let token = self.lexer.peek_token()?.clone();
        let position = self.lexer.current_position();

        let mut left = match token {
            Token::Identifier(_) => self.parse_identifier(),
            Token::Number(_) => self.parse_number(),
            Token::String(_) => self.parse_string(),
            Token::Benar | Token::Salah | Token::Boolean(_) => self.parse_boolean(),
            Token::KiriKurung | Token::LeftParen => self.parse_grouped_expression(),
            Token::BuatChannel | Token::MakeChannel => self.parse_make_channel_expression(),
            Token::BuatKondisi | Token::CreateCondition => self.parse_create_condition_expression(),
            Token::MuatAtomik | Token::AtomicLoad => self.parse_atomic_load_expression(),
            Token::BuatAlamat | Token::CreateAddress => self.parse_create_address_expression(),
            Token::Kurang | Token::Minus => self.parse_prefix_expression(),
            Token::Tidak | Token::Not => self.parse_prefix_expression(),
            Token::KiriKurungSiku | Token::LeftBracket => self.parse_array_literal(),
            Token::KiriKurungKurawal | Token::LeftBrace => self.parse_object_literal(),
            _ => {
                return Err(ParseError::UnexpectedToken {
                    expected: "expression".to_string(),
                    found: format!("{:?}", token),
                    position,
                });
            }
        }?;

        while precedence < self.peek_precedence() {
            let token = self.lexer.peek_token()?.clone();
            match token {
                Token::Plus | Token::Tambah | Token::Minus | Token::Kurang |
                Token::Multiply | Token::Kali | Token::Divide | Token::Bagi |
                Token::Modulo | Token::Power | Token::SamaDengan | Token::Equal |
                Token::TidakSamaDengan | Token::NotEqual | Token::KurangDari | Token::Less |
                Token::LebihDari | Token::Greater | Token::KurangSamaDengan | Token::LessEqual |
                Token::LebihSamaDari | Token::GreaterEqual | Token::Dan | Token::And |
                Token::Atau | Token::Or | Token::Titik | Token::Dot | Token::KiriKurung | Token::LeftParen |
                Token::KiriKurungSiku | Token::LeftBracket | Token::Di | Token::In |
                Token::Kirim | Token::Send => {
                    left = self.parse_infix_expression(left)?;
                }
                _ => break,
            }
        }

        Ok(left)
    }

    /// Parse make_channel expression
    fn parse_make_channel_expression(&mut self) -> Result<ASTNode, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume make_channel/buat_channel

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse element type
        let element_type = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(ASTNode::MakeChannelExpr {
            element_type: Box::new(element_type),
            position,
        })
    }

    /// Parse create_condition expression
    fn parse_create_condition_expression(&mut self) -> Result<ASTNode, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume create_condition/buat_kondisi

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(ASTNode::CreateConditionExpr {
            position,
        })
    }

    /// Parse atomic_load expression
    fn parse_atomic_load_expression(&mut self) -> Result<ASTNode, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume atomic_load/muat_atomik

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse address expression
        let address = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(ASTNode::AtomicLoadExpr {
            address: Box::new(address),
            position,
        })
    }

    /// Parse create_address expression
    fn parse_create_address_expression(&mut self) -> Result<ASTNode, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume create_address/buat_alamat

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse initial value expression
        let initial_value = self.parse_expression(0)?;

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(ASTNode::CreateAddressExpr {
            initial_value: Box::new(initial_value),
            position,
        })
    }

    /// Parse an infix expression
    fn parse_infix_expression(&mut self, left: ASTNode) -> Result<ASTNode, ParseError> {
        let token = self.lexer.next_token()?.clone();
        let position = self.lexer.current_position();
        let precedence = self.current_precedence();

        match token {
            Token::Plus | Token::Tambah => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Add,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Minus | Token::Kurang => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Subtract,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Multiply | Token::Kali => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Multiply,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Divide | Token::Bagi => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Divide,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Modulo => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Modulo,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Power => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Power,
                    right: Box::new(right),
                    position,
                })
            }
            Token::SamaDengan | Token::Equal => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Equal,
                    right: Box::new(right),
                    position,
                })
            }
            Token::TidakSamaDengan | Token::NotEqual => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::NotEqual,
                    right: Box::new(right),
                    position,
                })
            }
            Token::KurangDari | Token::Less => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Less,
                    right: Box::new(right),
                    position,
                })
            }
            Token::LebihDari | Token::Greater => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Greater,
                    right: Box::new(right),
                    position,
                })
            }
            Token::KurangSamaDari | Token::LessEqual => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::LessEqual,
                    right: Box::new(right),
                    position,
                })
            }
            Token::LebihSamaDari | Token::GreaterEqual => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::GreaterEqual,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Dan | Token::And => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::And,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Atau | Token::Or => {
                let right = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::Or,
                    right: Box::new(right),
                    position,
                })
            }
            Token::Titik | Token::Dot => {
                let property = self.parse_identifier()?;
                Ok(ASTNode::MemberAccess {
                    object: Box::new(left),
                    property,
                    position,
                })
            }
            Token::KiriKurung | Token::LeftParen => {
                let arguments = self.parse_argument_list()?;
                Ok(ASTNode::FunctionCall {
                    name: match left {
                        ASTNode::Identifier(name, _) => name,
                        _ => return Err(ParseError::UnexpectedToken {
                            expected: "identifier".to_string(),
                            found: format!("{:?}", left),
                            position,
                        }),
                    },
                    arguments,
                    position,
                })
            }
            Token::KiriKurungSiku | Token::LeftBracket => {
                let index = self.parse_expression(0)?;
                self.expect_token(Token::KananKurungSiku)?;
                Ok(ASTNode::MemberAccess {
                    object: Box::new(left),
                    property: format!("{}", index),
                    position,
                })
            }
            Token::Di | Token::In => {
                let iterable = self.parse_expression(precedence)?;
                Ok(ASTNode::BinaryOp {
                    left: Box::new(left),
                    operator: BinaryOperator::In,
                    right: Box::new(iterable),
                    position,
                })
            }
            Token::Kirim | Token::Send => {
                // Channel send operation: channel <- value
                let value = self.parse_expression(precedence)?;
                Ok(ASTNode::ChannelSendStmt {
                    channel: Box::new(left),
                    value: Box::new(value),
                    position,
                })
            }
            _ => Err(ParseError::UnexpectedToken {
                expected: "infix operator".to_string(),
                found: format!("{:?}", token),
                position,
            }),
        }
    }

    /// Parse an import statement
    fn parse_import_statement(&mut self) -> Result<Statement, ParseError> {
        let position = self.lexer.current_position();
        self.lexer.next_token()?; // consume import/impor

        // Expect string literal for module path
        let module_token = self.lexer.next_token()?;
        let module = match module_token {
            Token::String(s) => s,
            _ => {
                return Err(ParseError::UnexpectedToken {
                    expected: "string literal".to_string(),
                    found: format!("{:?}", module_token),
                    position: self.lexer.current_position(),
                });
            }
        };

        // Check for optional alias (as/sebagai)
        let mut alias = None;
        if let Ok(peek_token) = self.lexer.peek_token() {
            if *peek_token == Token::As || *peek_token == Token::Sebagai {
                self.lexer.next_token()?; // consume as/sebagai

                // Expect identifier for alias
                let alias_token = self.lexer.next_token()?;
                match alias_token {
                    Token::Identifier(name) => {
                        alias = Some(name);
                    }
                    _ => {
                        return Err(ParseError::UnexpectedToken {
                            expected: "identifier".to_string(),
                            found: format!("{:?}", alias_token),
                            position: self.lexer.current_position(),
                        });
                    }
                }
            }
        }

        Ok(Statement::ImportStmt {
            module,
            alias,
            position,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_declaration() {
        let input = "buat x = 42";
        let mut parser = Parser::new(input).unwrap();
        let ast = parser.parse_program().unwrap();

        // Basic test to ensure parsing doesn't crash
        assert!(matches!(ast, ASTNode::Program(_)));
    }

    #[test]
    fn test_simple_expression() {
        let input = "x = 5 + 3";
        let mut parser = Parser::new(input).unwrap();
        let ast = parser.parse_program().unwrap();

        // Basic test to ensure parsing doesn't crash
        assert!(matches!(ast, ASTNode::Program(_)));
    }

    #[test]
    fn test_if_statement() {
        let input = "jika x > 0 maka:\n    tampilkan \"positif\"";
        let mut parser = Parser::new(input).unwrap();
        let ast = parser.parse_program().unwrap();

        // Basic test to ensure parsing doesn't crash
        assert!(matches!(ast, ASTNode::Program(_)));
    }
}
