//! Simplified Parser for KODEON Foundation (v0.x)
//! Focuses on core syntax: variables, functions, conditionals, loops, I/O

use std::collections::HashMap;

/// Token types for the simplified KODEON parser
#[derive(Debug, PartialEq, Clone)]
pub enum Token {
    // Core tokens
    Identifier(String),
    Number(f64),
    String(String),
    Boolean(bool),

    // Keywords - English
    Function,
    If,
    Else,
    While,
    For,
    In,
    Print,
    Input,
    Return,
    True,
    False,

    // Keywords - Indonesian
    Fungsi,
    Jika,
    Sebaliknya,
    Selama,
    Untuk,
    Di,
    Tampilkan,
    Baca,
    Kembalikan,
    Benar,
    Salah,

    // Operators
    Plus,           // +
    Minus,          // -
    Multiply,       // *
    Divide,         // /
    Assign,         // =
    Equal,          // ==
    NotEqual,       // !=
    Less,           // <
    Greater,        // >
    LessEqual,      // <=
    GreaterEqual,   // >=
    And,            // and / dan
    Or,             // or / atau

    // Delimiters
    LeftParen,      // (
    RightParen,     // )
    LeftBrace,      // {
    RightBrace,     // }
    Colon,          // :
    Comma,          // ,
    Newline,        // \n

    // Special
    Eof,
}

/// Position in the source code
#[derive(Debug, Clone, PartialEq)]
pub struct Position {
    pub line: usize,
    pub column: usize,
}

/// Abstract Syntax Tree nodes for simplified parser
#[derive(Debug, PartialEq)]
pub enum ASTNode {
    Program(Vec<Statement>),

    // Statements
    VariableDeclaration {
        identifier: String,
        value: Box<ASTNode>,
        position: Position,
    },
    Assignment {
        identifier: String,
        value: Box<ASTNode>,
        position: Position,
    },
    FunctionDef {
        name: String,
        parameters: Vec<String>,
        body: Vec<Statement>,
        position: Position,
    },
    IfStatement {
        condition: Box<ASTNode>,
        then_block: Vec<Statement>,
        else_block: Option<Vec<Statement>>,
        position: Position,
    },
    WhileLoop {
        condition: Box<ASTNode>,
        body: Vec<Statement>,
        position: Position,
    },
    ForLoop {
        variable: String,
        iterable: Box<ASTNode>,
        body: Vec<Statement>,
        position: Position,
    },
    PrintStatement(Box<ASTNode>),
    ReturnStatement(Option<Box<ASTNode>>),

    // Expressions
    BinaryOp {
        left: Box<ASTNode>,
        operator: BinaryOperator,
        right: Box<ASTNode>,
        position: Position,
    },
    UnaryOp {
        operator: UnaryOperator,
        operand: Box<ASTNode>,
        position: Position,
    },
    Identifier(String, Position),
    Number(f64, Position),
    String(String, Position),
    Boolean(bool, Position),
    FunctionCall {
        name: String,
        arguments: Vec<ASTNode>,
        position: Position,
    },
}

/// Binary operators
#[derive(Debug, PartialEq, Clone)]
pub enum BinaryOperator {
    Add,        // +
    Subtract,   // -
    Multiply,   // *
    Divide,     // /
    Equal,      // ==
    NotEqual,   // !=
    Less,       // <
    Greater,    // >
    LessEqual,  // <=
    GreaterEqual, // >=
    And,        // and / dan
    Or,         // or / atau
    Assign,     // =
}

/// Unary operators
#[derive(Debug, PartialEq, Clone)]
pub enum UnaryOperator {
    Negate,     // -
    Not,        // not / tidak
}

/// Statements
#[derive(Debug, PartialEq)]
pub enum Statement {
    VariableDeclaration {
        identifier: String,
        value: Box<ASTNode>,
        position: Position,
    },
    Assignment {
        identifier: String,
        value: Box<ASTNode>,
        position: Position,
    },
    FunctionDef {
        name: String,
        parameters: Vec<String>,
        body: Vec<Statement>,
        position: Position,
    },
    IfStatement {
        condition: Box<ASTNode>,
        then_block: Vec<Statement>,
        else_block: Option<Vec<Statement>>,
        position: Position,
    },
    WhileLoop {
        condition: Box<ASTNode>,
        body: Vec<Statement>,
        position: Position,
    },
    ForLoop {
        variable: String,
        iterable: Box<ASTNode>,
        body: Vec<Statement>,
        position: Position,
    },
    PrintStatement(Box<ASTNode>),
    ReturnStatement(Option<Box<ASTNode>>),
    Expression(Box<ASTNode>),
}

/// Simplified Lexer for KODEON Foundation
pub struct SimpleLexer {
    input: Vec<char>,
    position: usize,
    line: usize,
    column: usize,
}

impl SimpleLexer {
    pub fn new(input: &str) -> Self {
        SimpleLexer {
            input: input.chars().collect(),
            position: 0,
            line: 1,
            column: 1,
        }
    }

    fn current_char(&self) -> Option<char> {
        self.input.get(self.position).copied()
    }

    fn advance(&mut self) {
        if let Some(ch) = self.current_char() {
            if ch == '\n' {
                self.line += 1;
                self.column = 1;
            } else {
                self.column += 1;
            }
        }
        self.position += 1;
    }

    fn skip_whitespace(&mut self) {
        while let Some(ch) = self.current_char() {
            if ch.is_whitespace() && ch != '\n' {
                self.advance();
            } else {
                break;
            }
        }
    }

    fn read_number(&mut self) -> f64 {
        let start = self.position;
        while let Some(ch) = self.current_char() {
            if ch.is_ascii_digit() || ch == '.' {
                self.advance();
            } else {
                break;
            }
        }
        let number_str: String = self.input[start..self.position].iter().collect();
        number_str.parse().unwrap_or(0.0)
    }

    fn read_identifier(&mut self) -> String {
        let start = self.position;
        while let Some(ch) = self.current_char() {
            if ch.is_alphanumeric() || ch == '_' {
                self.advance();
            } else {
                break;
            }
        }
        self.input[start..self.position].iter().collect()
    }

    fn read_string(&mut self) -> String {
        self.advance(); // Skip opening quote
        let start = self.position;
        while let Some(ch) = self.current_char() {
            if ch != '"' {
                self.advance();
            } else {
                break;
            }
        }
        let string_content: String = self.input[start..self.position].iter().collect();
        self.advance(); // Skip closing quote
        string_content
    }

    pub fn next_token(&mut self) -> Result<Token, String> {
        self.skip_whitespace();

        let pos = Position {
            line: self.line,
            column: self.column,
        };

        match self.current_char() {
            None => Ok(Token::Eof),
            Some(ch) => {
                match ch {
                    '+' => {
                        self.advance();
                        Ok(Token::Plus)
                    }
                    '-' => {
                        self.advance();
                        Ok(Token::Minus)
                    }
                    '*' => {
                        self.advance();
                        Ok(Token::Multiply)
                    }
                    '/' => {
                        self.advance();
                        Ok(Token::Divide)
                    }
                    '=' => {
                        self.advance();
                        if let Some('=') = self.current_char() {
                            self.advance();
                            Ok(Token::Equal)
                        } else {
                            Ok(Token::Assign)
                        }
                    }
                    '!' => {
                        self.advance();
                        if let Some('=') = self.current_char() {
                            self.advance();
                            Ok(Token::NotEqual)
                        } else {
                            Err("Unexpected character after !".to_string())
                        }
                    }
                    '<' => {
                        self.advance();
                        if let Some('=') = self.current_char() {
                            self.advance();
                            Ok(Token::LessEqual)
                        } else {
                            Ok(Token::Less)
                        }
                    }
                    '>' => {
                        self.advance();
                        if let Some('=') = self.current_char() {
                            self.advance();
                            Ok(Token::GreaterEqual)
                        } else {
                            Ok(Token::Greater)
                        }
                    }
                    '(' => {
                        self.advance();
                        Ok(Token::LeftParen)
                    }
                    ')' => {
                        self.advance();
                        Ok(Token::RightParen)
                    }
                    '{' => {
                        self.advance();
                        Ok(Token::LeftBrace)
                    }
                    '}' => {
                        self.advance();
                        Ok(Token::RightBrace)
                    }
                    ':' => {
                        self.advance();
                        Ok(Token::Colon)
                    }
                    ',' => {
                        self.advance();
                        Ok(Token::Comma)
                    }
                    '\n' => {
                        self.advance();
                        Ok(Token::Newline)
                    }
                    '"' => {
                        let content = self.read_string();
                        Ok(Token::String(content))
                    }
                    '0'..='9' => {
                        let number = self.read_number();
                        Ok(Token::Number(number))
                    }
                    _ => {
                        if ch.is_alphabetic() || ch == '_' {
                            let identifier = self.read_identifier();
                            match identifier.as_str() {
                                // English keywords
                                "function" => Ok(Token::Function),
                                "if" => Ok(Token::If),
                                "else" => Ok(Token::Else),
                                "while" => Ok(Token::While),
                                "for" => Ok(Token::For),
                                "in" => Ok(Token::In),
                                "print" => Ok(Token::Print),
                                "input" => Ok(Token::Input),
                                "return" => Ok(Token::Return),
                                "true" => Ok(Token::True),
                                "false" => Ok(Token::False),
                                "and" => Ok(Token::And),
                                "or" => Ok(Token::Or),

                                // Indonesian keywords
                                "fungsi" => Ok(Token::Fungsi),
                                "jika" => Ok(Token::Jika),
                                "sebaliknya" => Ok(Token::Sebaliknya),
                                "selama" => Ok(Token::Selama),
                                "untuk" => Ok(Token::Untuk),
                                "di" => Ok(Token::Di),
                                "tampilkan" => Ok(Token::Tampilkan),
                                "baca" => Ok(Token::Baca),
                                "kembalikan" => Ok(Token::Kembalikan),
                                "benar" => Ok(Token::Benar),
                                "salah" => Ok(Token::Salah),
                                "dan" => Ok(Token::And),
                                "atau" => Ok(Token::Or),

                                _ => Ok(Token::Identifier(identifier)),
                            }
                        } else {
                            Err(format!("Unexpected character: {}", ch))
                        }
                    }
                }
            }
        }
    }
}

/// Simplified Parser for KODEON Foundation
pub struct SimpleParser {
    tokens: Vec<Token>,
    position: usize,
    source: String,
}

impl SimpleParser {
    pub fn new(source: &str) -> Result<Self, String> {
        let mut lexer = SimpleLexer::new(source);
        let mut tokens = Vec::new();

        loop {
            let token = lexer.next_token()?;
            if token == Token::Eof {
                break;
            }
            tokens.push(token);
        }

        Ok(SimpleParser {
            tokens,
            position: 0,
            source: source.to_string(),
        })
    }

    fn current_token(&self) -> Option<&Token> {
        self.tokens.get(self.position)
    }

    fn advance(&mut self) {
        if self.position < self.tokens.len() {
            self.position += 1;
        }
    }

    fn expect_token(&mut self, expected: Token) -> Result<(), String> {
        if let Some(token) = self.current_token() {
            if *token == expected {
                self.advance();
                Ok(())
            } else {
                Err(format!("Expected {:?}, found {:?}", expected, token))
            }
        } else {
            Err("Unexpected end of input".to_string())
        }
    }

    pub fn parse_program(&mut self) -> Result<ASTNode, String> {
        let mut statements = Vec::new();

        while let Some(token) = self.current_token() {
            if *token == Token::Eof {
                break;
            }

            let statement = self.parse_statement()?;
            statements.push(statement);
        }

        Ok(ASTNode::Program(statements))
    }

    fn parse_statement(&mut self) -> Result<Statement, String> {
        match self.current_token() {
            Some(Token::Function) | Some(Token::Fungsi) => self.parse_function_def(),
            Some(Token::If) | Some(Token::Jika) => self.parse_if_statement(),
            Some(Token::While) | Some(Token::Selama) => self.parse_while_loop(),
            Some(Token::For) | Some(Token::Untuk) => self.parse_for_loop(),
            Some(Token::Print) | Some(Token::Tampilkan) => self.parse_print_statement(),
            Some(Token::Return) | Some(Token::Kembalikan) => self.parse_return_statement(),
            Some(Token::Identifier(_)) => {
                // Could be assignment or expression
                self.parse_identifier_statement()
            }
            _ => {
                let expr = self.parse_expression()?;
                Ok(Statement::Expression(expr))
            }
        }
    }

    fn parse_function_def(&mut self) -> Result<Statement, String> {
        // Skip function/fungsi keyword
        self.advance();

        // Get function name
        let name = match self.current_token() {
            Some(Token::Identifier(name)) => {
                let name_clone = name.clone();
                self.advance();
                name_clone
            }
            _ => return Err("Expected function name".to_string()),
        };

        // Expect left parenthesis
        self.expect_token(Token::LeftParen)?;

        // Parse parameters
        let mut parameters = Vec::new();
        while let Some(token) = self.current_token() {
            match token {
                Token::RightParen => break,
                Token::Identifier(param_name) => {
                    parameters.push(param_name.clone());
                    self.advance();

                    // Check for comma or right parenthesis
                    match self.current_token() {
                        Some(Token::Comma) => {
                            self.advance();
                        }
                        Some(Token::RightParen) => break,
                        _ => return Err("Expected comma or right parenthesis".to_string()),
                    }
                }
                _ => return Err("Expected parameter name".to_string()),
            }
        }

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        // Expect colon
        self.expect_token(Token::Colon)?;

        // Parse function body
        let mut body = Vec::new();
        while let Some(token) = self.current_token() {
            // Stop at end of function (newline or new function)
            match token {
                Token::Function | Token::Fungsi | Token::Eof => break,
                Token::Newline => {
                    self.advance();
                    continue;
                }
                _ => {}
            }

            let statement = self.parse_statement()?;
            body.push(statement);
        }

        Ok(Statement::FunctionDef {
            name,
            parameters,
            body,
            position: Position { line: 0, column: 0 }, // Simplified
        })
    }

    fn parse_if_statement(&mut self) -> Result<Statement, String> {
        // Skip if/jika keyword
        self.advance();

        // Parse condition
        let condition = self.parse_expression()?;

        // Expect colon
        self.expect_token(Token::Colon)?;

        // Parse then block
        let mut then_block = Vec::new();
        while let Some(token) = self.current_token() {
            // Stop at else/sebaliknya or end of if block
            match token {
                Token::Else | Token::Sebaliknya | Token::Newline => break,
                _ => {}
            }

            let statement = self.parse_statement()?;
            then_block.push(statement);
        }

        // Parse else block if present
        let else_block = match self.current_token() {
            Some(Token::Else) | Some(Token::Sebaliknya) => {
                self.advance();
                self.expect_token(Token::Colon)?;

                let mut else_statements = Vec::new();
                while let Some(token) = self.current_token() {
                    match token {
                        Token::Newline | Token::Eof => break,
                        _ => {}
                    }

                    let statement = self.parse_statement()?;
                    else_statements.push(statement);
                }

                Some(else_statements)
            }
            _ => None,
        };

        Ok(Statement::IfStatement {
            condition: Box::new(condition),
            then_block,
            else_block,
            position: Position { line: 0, column: 0 }, // Simplified
        })
    }

    fn parse_while_loop(&mut self) -> Result<Statement, String> {
        // Skip while/selama keyword
        self.advance();

        // Parse condition
        let condition = self.parse_expression()?;

        // Expect colon
        self.expect_token(Token::Colon)?;

        // Parse loop body
        let mut body = Vec::new();
        while let Some(token) = self.current_token() {
            match token {
                Token::Newline | Token::Eof => break,
                _ => {}
            }

            let statement = self.parse_statement()?;
            body.push(statement);
        }

        Ok(Statement::WhileLoop {
            condition: Box::new(condition),
            body,
            position: Position { line: 0, column: 0 }, // Simplified
        })
    }

    fn parse_for_loop(&mut self) -> Result<Statement, String> {
        // Skip for/untuk keyword
        self.advance();

        // Get loop variable
        let variable = match self.current_token() {
            Some(Token::Identifier(name)) => {
                let name_clone = name.clone();
                self.advance();
                name_clone
            }
            _ => return Err("Expected loop variable".to_string()),
        };

        // Expect in/di keyword
        match self.current_token() {
            Some(Token::In) | Some(Token::Di) => self.advance(),
            _ => return Err("Expected 'in' or 'di'".to_string()),
        }

        // Parse iterable (simplified to range for now)
        let iterable = self.parse_expression()?;

        // Expect colon
        self.expect_token(Token::Colon)?;

        // Parse loop body
        let mut body = Vec::new();
        while let Some(token) = self.current_token() {
            match token {
                Token::Newline | Token::Eof => break,
                _ => {}
            }

            let statement = self.parse_statement()?;
            body.push(statement);
        }

        Ok(Statement::ForLoop {
            variable,
            iterable: Box::new(iterable),
            body,
            position: Position { line: 0, column: 0 }, // Simplified
        })
    }

    fn parse_print_statement(&mut self) -> Result<Statement, String> {
        // Skip print/tampilkan keyword
        self.advance();

        // Parse expression to print
        let expr = self.parse_expression()?;

        Ok(Statement::PrintStatement(Box::new(expr)))
    }

    fn parse_return_statement(&mut self) -> Result<Statement, String> {
        // Skip return/kembalikan keyword
        self.advance();

        // Parse optional return value
        let value = match self.current_token() {
            Some(Token::Newline) | Some(Token::Eof) => None,
            _ => {
                let expr = self.parse_expression()?;
                Some(Box::new(expr))
            }
        };

        Ok(Statement::ReturnStatement(value))
    }

    fn parse_identifier_statement(&mut self) -> Result<Statement, String> {
        // Look ahead to see if this is an assignment
        let mut lookahead_pos = self.position;
        let mut is_assignment = false;

        // Skip identifier
        lookahead_pos += 1;

        // Check if next token is assignment
        if lookahead_pos < self.tokens.len() {
            if let Token::Assign = &self.tokens[lookahead_pos] {
                is_assignment = true;
            }
        }

        if is_assignment {
            self.parse_assignment()
        } else {
            let expr = self.parse_expression()?;
            Ok(Statement::Expression(expr))
        }
    }

    fn parse_assignment(&mut self) -> Result<Statement, String> {
        // Get identifier
        let identifier = match self.current_token() {
            Some(Token::Identifier(name)) => {
                let name_clone = name.clone();
                self.advance();
                name_clone
            }
            _ => return Err("Expected identifier".to_string()),
        };

        // Expect assignment operator
        self.expect_token(Token::Assign)?;

        // Parse value
        let value = self.parse_expression()?;

        Ok(Statement::Assignment {
            identifier,
            value: Box::new(value),
            position: Position { line: 0, column: 0 }, // Simplified
        })
    }

    fn parse_expression(&mut self) -> Result<ASTNode, String> {
        self.parse_or_expression()
    }

    fn parse_or_expression(&mut self) -> Result<ASTNode, String> {
        let mut left = self.parse_and_expression()?;

        while let Some(token) = self.current_token() {
            let op = match token {
                Token::Or | Token::And => {
                    let op = match token {
                        Token::Or => BinaryOperator::Or,
                        Token::And => BinaryOperator::And,
                        _ => unreachable!(),
                    };
                    self.advance();
                    op
                }
                _ => break,
            };

            let right = self.parse_and_expression()?;
            left = ASTNode::BinaryOp {
                left: Box::new(left),
                operator: op,
                right: Box::new(right),
                position: Position { line: 0, column: 0 }, // Simplified
            };
        }

        Ok(left)
    }

    fn parse_and_expression(&mut self) -> Result<ASTNode, String> {
        let mut left = self.parse_equality_expression()?;

        while let Some(token) = self.current_token() {
            let op = match token {
                Token::And => {
                    self.advance();
                    BinaryOperator::And
                }
                _ => break,
            };

            let right = self.parse_equality_expression()?;
            left = ASTNode::BinaryOp {
                left: Box::new(left),
                operator: op,
                right: Box::new(right),
                position: Position { line: 0, column: 0 }, // Simplified
            };
        }

        Ok(left)
    }

    fn parse_equality_expression(&mut self) -> Result<ASTNode, String> {
        let mut left = self.parse_comparison_expression()?;

        while let Some(token) = self.current_token() {
            let op = match token {
                Token::Equal => {
                    self.advance();
                    BinaryOperator::Equal
                }
                Token::NotEqual => {
                    self.advance();
                    BinaryOperator::NotEqual
                }
                _ => break,
            };

            let right = self.parse_comparison_expression()?;
            left = ASTNode::BinaryOp {
                left: Box::new(left),
                operator: op,
                right: Box::new(right),
                position: Position { line: 0, column: 0 }, // Simplified
            };
        }

        Ok(left)
    }

    fn parse_comparison_expression(&mut self) -> Result<ASTNode, String> {
        let mut left = self.parse_additive_expression()?;

        while let Some(token) = self.current_token() {
            let op = match token {
                Token::Less => {
                    self.advance();
                    BinaryOperator::Less
                }
                Token::Greater => {
                    self.advance();
                    BinaryOperator::Greater
                }
                Token::LessEqual => {
                    self.advance();
                    BinaryOperator::LessEqual
                }
                Token::GreaterEqual => {
                    self.advance();
                    BinaryOperator::GreaterEqual
                }
                _ => break,
            };

            let right = self.parse_additive_expression()?;
            left = ASTNode::BinaryOp {
                left: Box::new(left),
                operator: op,
                right: Box::new(right),
                position: Position { line: 0, column: 0 }, // Simplified
            };
        }

        Ok(left)
    }

    fn parse_additive_expression(&mut self) -> Result<ASTNode, String> {
        let mut left = self.parse_multiplicative_expression()?;

        while let Some(token) = self.current_token() {
            let op = match token {
                Token::Plus => {
                    self.advance();
                    BinaryOperator::Add
                }
                Token::Minus => {
                    self.advance();
                    BinaryOperator::Subtract
                }
                _ => break,
            };

            let right = self.parse_multiplicative_expression()?;
            left = ASTNode::BinaryOp {
                left: Box::new(left),
                operator: op,
                right: Box::new(right),
                position: Position { line: 0, column: 0 }, // Simplified
            };
        }

        Ok(left)
    }

    fn parse_multiplicative_expression(&mut self) -> Result<ASTNode, String> {
        let mut left = self.parse_unary_expression()?;

        while let Some(token) = self.current_token() {
            let op = match token {
                Token::Multiply => {
                    self.advance();
                    BinaryOperator::Multiply
                }
                Token::Divide => {
                    self.advance();
                    BinaryOperator::Divide
                }
                _ => break,
            };

            let right = self.parse_unary_expression()?;
            left = ASTNode::BinaryOp {
                left: Box::new(left),
                operator: op,
                right: Box::new(right),
                position: Position { line: 0, column: 0 }, // Simplified
            };
        }

        Ok(left)
    }

    fn parse_unary_expression(&mut self) -> Result<ASTNode, String> {
        match self.current_token() {
            Some(Token::Minus) => {
                self.advance();
                let operand = self.parse_unary_expression()?;
                Ok(ASTNode::UnaryOp {
                    operator: UnaryOperator::Negate,
                    operand: Box::new(operand),
                    position: Position { line: 0, column: 0 }, // Simplified
                })
            }
            Some(Token::Not) => {
                self.advance();
                let operand = self.parse_unary_expression()?;
                Ok(ASTNode::UnaryOp {
                    operator: UnaryOperator::Not,
                    operand: Box::new(operand),
                    position: Position { line: 0, column: 0 }, // Simplified
                })
            }
            _ => self.parse_primary_expression(),
        }
    }

    fn parse_primary_expression(&mut self) -> Result<ASTNode, String> {
        match self.current_token() {
            Some(Token::Number(value)) => {
                let val = *value;
                self.advance();
                Ok(ASTNode::Number(val, Position { line: 0, column: 0 }))
            }
            Some(Token::String(value)) => {
                let val = value.clone();
                self.advance();
                Ok(ASTNode::String(val, Position { line: 0, column: 0 }))
            }
            Some(Token::True) | Some(Token::Benar) => {
                self.advance();
                Ok(ASTNode::Boolean(true, Position { line: 0, column: 0 }))
            }
            Some(Token::False) | Some(Token::Salah) => {
                self.advance();
                Ok(ASTNode::Boolean(false, Position { line: 0, column: 0 }))
            }
            Some(Token::Identifier(name)) => {
                let name_clone = name.clone();
                self.advance();

                // Check if this is a function call
                if let Some(Token::LeftParen) = self.current_token() {
                    self.parse_function_call(name_clone)
                } else {
                    Ok(ASTNode::Identifier(name_clone, Position { line: 0, column: 0 }))
                }
            }
            Some(Token::LeftParen) => {
                self.advance();
                let expr = self.parse_expression()?;
                self.expect_token(Token::RightParen)?;
                Ok(expr)
            }
            _ => Err("Expected expression".to_string()),
        }
    }

    fn parse_function_call(&mut self, name: String) -> Result<ASTNode, String> {
        // Skip left parenthesis
        self.advance();

        // Parse arguments
        let mut arguments = Vec::new();
        while let Some(token) = self.current_token() {
            match token {
                Token::RightParen => break,
                Token::Comma => {
                    self.advance();
                }
                _ => {
                    let arg = self.parse_expression()?;
                    arguments.push(arg);
                }
            }
        }

        // Expect right parenthesis
        self.expect_token(Token::RightParen)?;

        Ok(ASTNode::FunctionCall {
            name,
            arguments,
            position: Position { line: 0, column: 0 }, // Simplified
        })
    }
}

/// Transpiler to Python for immediate execution
pub struct PythonTranspiler;

impl PythonTranspiler {
    pub fn transpile(ast: &ASTNode) -> Result<String, String> {
        let mut output = String::new();
        Self::transpile_node(ast, &mut output, 0)?;
        Ok(output)
    }

    fn transpile_node(node: &ASTNode, output: &mut String, indent: usize) -> Result<(), String> {
        match node {
            ASTNode::Program(statements) => {
                // Add standard library functions
                output.push_str("# KODEON Python Transpiled Code\n");
                output.push_str("import sys\n\n");

                // Add KODEON standard library functions
                output.push_str("# KODEON Standard Library\n");
                output.push_str("def _kodeon_print(*args):\n");
                output.push_str("    print(' '.join(str(arg) for arg in args))\n\n");

                output.push_str("def _kodeon_len(obj):\n");
                output.push_str("    return len(obj)\n\n");

                output.push_str("def _kodeon_range(*args):\n");
                output.push_str("    return list(range(*args))\n\n");

                for statement in statements {
                    Self::transpile_statement(statement, output, indent)?;
                }

                // Add main execution
                output.push_str("\nif __name__ == \"__main__\":\n");
                output.push_str("    pass  # Program execution\n");
            }
            _ => return Err("Expected Program node".to_string()),
        }
        Ok(())
    }

    fn transpile_statement(statement: &Statement, output: &mut String, indent: usize) -> Result<(), String> {
        let indent_str = "    ".repeat(indent);

        match statement {
            Statement::VariableDeclaration { identifier, value, .. } => {
                output.push_str(&format!("{}{} = ", indent_str, identifier));
                Self::transpile_expression(value, output)?;
                output.push('\n');
            }
            Statement::Assignment { identifier, value, .. } => {
                output.push_str(&format!("{}{} = ", indent_str, identifier));
                Self::transpile_expression(value, output)?;
                output.push('\n');
            }
            Statement::FunctionDef { name, parameters, body, .. } => {
                output.push_str(&format!("{}def {}({}):\n", indent_str, name, parameters.join(", ")));
                for stmt in body {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }
                output.push('\n');
            }
            Statement::IfStatement { condition, then_block, else_block, .. } => {
                output.push_str(&format!("{}if ", indent_str));
                Self::transpile_expression(condition, output)?;
                output.push_str(":\n");

                for stmt in then_block {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }

                if let Some(else_stmts) = else_block {
                    output.push_str(&format!("{}else:\n", indent_str));
                    for stmt in else_stmts {
                        Self::transpile_statement(stmt, output, indent + 1)?;
                    }
                }
                output.push('\n');
            }
            Statement::WhileLoop { condition, body, .. } => {
                output.push_str(&format!("{}while ", indent_str));
                Self::transpile_expression(condition, output)?;
                output.push_str(":\n");

                for stmt in body {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }
                output.push('\n');
            }
            Statement::ForLoop { variable, iterable, body, .. } => {
                output.push_str(&format!("{}for {} in ", indent_str, variable));
                Self::transpile_expression(iterable, output)?;
                output.push_str(":\n");

                for stmt in body {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }
                output.push('\n');
            }
            Statement::PrintStatement(expr) => {
                output.push_str(&format!("{}print(", indent_str));
                Self::transpile_expression(expr, output)?;
                output.push_str(")\n");
            }
            Statement::ReturnStatement(value) => {
                output.push_str(&format!("{}return", indent_str));
                if let Some(expr) = value {
                    output.push(' ');
                    Self::transpile_expression(expr, output)?;
                }
                output.push('\n');
            }
            Statement::Expression(expr) => {
                output.push_str(&format!("{}{}", indent_str));
                Self::transpile_expression(expr, output)?;
                output.push('\n');
            }
        }
        Ok(())
    }

    fn transpile_expression(expr: &ASTNode, output: &mut String) -> Result<(), String> {
        match expr {
            ASTNode::BinaryOp { left, operator, right, .. } => {
                Self::transpile_expression(left, output)?;

                let op_str = match operator {
                    BinaryOperator::Add => " + ",
                    BinaryOperator::Subtract => " - ",
                    BinaryOperator::Multiply => " * ",
                    BinaryOperator::Divide => " / ",
                    BinaryOperator::Equal => " == ",
                    BinaryOperator::NotEqual => " != ",
                    BinaryOperator::Less => " < ",
                    BinaryOperator::Greater => " > ",
                    BinaryOperator::LessEqual => " <= ",
                    BinaryOperator::GreaterEqual => " >= ",
                    BinaryOperator::And => " and ",
                    BinaryOperator::Or => " or ",
                    BinaryOperator::Assign => " = ",
                };

                output.push_str(op_str);
                Self::transpile_expression(right, output)?;
            }
            ASTNode::UnaryOp { operator, operand, .. } => {
                let op_str = match operator {
                    UnaryOperator::Negate => "-",
                    UnaryOperator::Not => "not ",
                };
                output.push_str(op_str);
                Self::transpile_expression(operand, output)?;
            }
            ASTNode::Identifier(name, _) => {
                output.push_str(name);
            }
            ASTNode::Number(value, _) => {
                output.push_str(&value.to_string());
            }
            ASTNode::String(value, _) => {
                output.push_str(&format!("\"{}\"", value));
            }
            ASTNode::Boolean(value, _) => {
                output.push_str(if *value { "True" } else { "False" });
            }
            ASTNode::FunctionCall { name, arguments, .. } => {
                output.push_str(&format!("{}(", name));
                for (i, arg) in arguments.iter().enumerate() {
                    if i > 0 {
                        output.push_str(", ");
                    }
                    Self::transpile_expression(arg, output)?;
                }
                output.push(')');
            }
            _ => return Err("Unsupported expression type".to_string()),
        }
        Ok(())
    }
}

/// Transpiler to JavaScript for web execution
pub struct JavaScriptTranspiler;

impl JavaScriptTranspiler {
    pub fn transpile(ast: &ASTNode) -> Result<String, String> {
        let mut output = String::new();
        Self::transpile_node(ast, &mut output, 0)?;
        Ok(output)
    }

    fn transpile_node(node: &ASTNode, output: &mut String, indent: usize) -> Result<(), String> {
        match node {
            ASTNode::Program(statements) => {
                // Add standard library functions
                output.push_str("// KODEON JavaScript Transpiled Code\n\n");

                // Add KODEON standard library functions
                output.push_str("// KODEON Standard Library\n");
                output.push_str("function _kodeon_print(...args) {\n");
                output.push_str("    console.log(args.join(' '));\n");
                output.push_str("}\n\n");

                output.push_str("function _kodeon_len(obj) {\n");
                output.push_str("    return obj.length;\n");
                output.push_str("}\n\n");

                output.push_str("function _kodeon_range(start, stop, step) {\n");
                output.push_str("    if (stop === undefined) {\n");
                output.push_str("        stop = start;\n");
                output.push_str("        start = 0;\n");
                output.push_str("    }\n");
                output.push_str("    if (step === undefined) step = 1;\n");
                output.push_str("    const result = [];\n");
                output.push_str("    if (step > 0) {\n");
                output.push_str("        for (let i = start; i < stop; i += step) result.push(i);\n");
                output.push_str("    } else {\n");
                output.push_str("        for (let i = start; i > stop; i += step) result.push(i);\n");
                output.push_str("    }\n");
                output.push_str("    return result;\n");
                output.push_str("}\n\n");

                for statement in statements {
                    Self::transpile_statement(statement, output, indent)?;
                }
            }
            _ => return Err("Expected Program node".to_string()),
        }
        Ok(())
    }

    fn transpile_statement(statement: &Statement, output: &mut String, indent: usize) -> Result<(), String> {
        let indent_str = "    ".repeat(indent);

        match statement {
            Statement::VariableDeclaration { identifier, value, .. } => {
                output.push_str(&format!("{}let {} = ", indent_str, identifier));
                Self::transpile_expression(value, output)?;
                output.push_str(";\n");
            }
            Statement::Assignment { identifier, value, .. } => {
                output.push_str(&format!("{}{} = ", indent_str, identifier));
                Self::transpile_expression(value, output)?;
                output.push_str(";\n");
            }
            Statement::FunctionDef { name, parameters, body, .. } => {
                output.push_str(&format!("{}function {}({}) {{\n", indent_str, name, parameters.join(", ")));
                for stmt in body {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }
                output.push_str(&format!("{}}}\n\n", indent_str));
            }
            Statement::IfStatement { condition, then_block, else_block, .. } => {
                output.push_str(&format!("{}if (", indent_str));
                Self::transpile_expression(condition, output)?;
                output.push_str(") {\n");

                for stmt in then_block {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }

                output.push_str(&format!("{}}}", indent_str));

                if let Some(else_stmts) = else_block {
                    output.push_str(" else {\n");
                    for stmt in else_stmts {
                        Self::transpile_statement(stmt, output, indent + 1)?;
                    }
                    output.push_str(&format!("{}}}", indent_str));
                }
                output.push_str("\n\n");
            }
            Statement::WhileLoop { condition, body, .. } => {
                output.push_str(&format!("{}while (", indent_str));
                Self::transpile_expression(condition, output)?;
                output.push_str(") {\n");

                for stmt in body {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }
                output.push_str(&format!("{}}}\n\n", indent_str));
            }
            Statement::ForLoop { variable, iterable, body, .. } => {
                output.push_str(&format!("{}for (let {} of ", indent_str, variable));
                Self::transpile_expression(iterable, output)?;
                output.push_str(") {\n");

                for stmt in body {
                    Self::transpile_statement(stmt, output, indent + 1)?;
                }
                output.push_str(&format!("{}}}\n\n", indent_str));
            }
            Statement::PrintStatement(expr) => {
                output.push_str(&format!("{}console.log(", indent_str));
                Self::transpile_expression(expr, output)?;
                output.push_str(");\n");
            }
            Statement::ReturnStatement(value) => {
                output.push_str(&format!("{}return", indent_str));
                if let Some(expr) = value {
                    output.push(' ');
                    Self::transpile_expression(expr, output)?;
                }
                output.push_str(";\n");
            }
            Statement::Expression(expr) => {
                output.push_str(&format!("{}{}", indent_str));
                Self::transpile_expression(expr, output)?;
                output.push_str(";\n");
            }
        }
        Ok(())
    }

    fn transpile_expression(expr: &ASTNode, output: &mut String) -> Result<(), String> {
        match expr {
            ASTNode::BinaryOp { left, operator, right, .. } => {
                Self::transpile_expression(left, output)?;

                let op_str = match operator {
                    BinaryOperator::Add => " + ",
                    BinaryOperator::Subtract => " - ",
                    BinaryOperator::Multiply => " * ",
                    BinaryOperator::Divide => " / ",
                    BinaryOperator::Equal => " === ",
                    BinaryOperator::NotEqual => " !== ",
                    BinaryOperator::Less => " < ",
                    BinaryOperator::Greater => " > ",
                    BinaryOperator::LessEqual => " <= ",
                    BinaryOperator::GreaterEqual => " >= ",
                    BinaryOperator::And => " && ",
                    BinaryOperator::Or => " || ",
                    BinaryOperator::Assign => " = ",
                };

                output.push_str(op_str);
                Self::transpile_expression(right, output)?;
            }
            ASTNode::UnaryOp { operator, operand, .. } => {
                let op_str = match operator {
                    UnaryOperator::Negate => "-",
                    UnaryOperator::Not => "!",
                };
                output.push_str(op_str);
                Self::transpile_expression(operand, output)?;
            }
            ASTNode::Identifier(name, _) => {
                output.push_str(name);
            }
            ASTNode::Number(value, _) => {
                output.push_str(&value.to_string());
            }
            ASTNode::String(value, _) => {
                output.push_str(&format!("\"{}\"", value));
            }
            ASTNode::Boolean(value, _) => {
                output.push_str(if *value { "true" } else { "false" });
            }
            ASTNode::FunctionCall { name, arguments, .. } => {
                output.push_str(&format!("{}(", name));
                for (i, arg) in arguments.iter().enumerate() {
                    if i > 0 {
                        output.push_str(", ");
                    }
                    Self::transpile_expression(arg, output)?;
                }
                output.push(')');
            }
            _ => return Err("Unsupported expression type".to_string()),
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_lexer() {
        let source = "x = 5\nprint(x)";
        let mut lexer = SimpleLexer::new(source);

        let tokens = vec![
            Token::Identifier("x".to_string()),
            Token::Assign,
            Token::Number(5.0),
            Token::Newline,
            Token::Print,
            Token::LeftParen,
            Token::Identifier("x".to_string()),
            Token::RightParen,
            Token::Eof,
        ];

        for expected_token in tokens {
            let token = lexer.next_token().unwrap();
            assert_eq!(token, expected_token);
        }
    }

    #[test]
    fn test_simple_parser() {
        let source = "x = 5\nprint(x)";
        let mut parser = SimpleParser::new(source).unwrap();
        let ast = parser.parse_program().unwrap();

        // Basic structure check
        match ast {
            ASTNode::Program(statements) => {
                assert_eq!(statements.len(), 2);
            }
            _ => panic!("Expected Program node"),
        }
    }

    #[test]
    fn test_python_transpiler() {
        let source = "x = 5\nprint(x)";
        let mut parser = SimpleParser::new(source).unwrap();
        let ast = parser.parse_program().unwrap();
        let python_code = PythonTranspiler::transpile(&ast).unwrap();

        assert!(python_code.contains("x = 5"));
        assert!(python_code.contains("print(x)"));
    }

    #[test]
    fn test_javascript_transpiler() {
        let source = "x = 5\nprint(x)";
        let mut parser = SimpleParser::new(source).unwrap();
        let ast = parser.parse_program().unwrap();
        let js_code = JavaScriptTranspiler::transpile(&ast).unwrap();

        assert!(js_code.contains("x = 5"));
        assert!(js_code.contains("console.log(x)"));
    }
}
