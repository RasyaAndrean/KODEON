//! Semantic analyzer for the KODEON programming language

use crate::parser::{ASTNode, Position};
use std::collections::HashMap;

/// Symbol table entry with position information
#[derive(Debug, Clone)]
pub struct Symbol {
    pub name: String,
    pub symbol_type: SymbolType,
    pub is_initialized: bool,
    pub is_used: bool,
    pub position: Position, // Position where symbol was declared
}

/// Types of symbols
#[derive(Debug, Clone)]
pub enum SymbolType {
    Variable(VariableInfo),
    Function(FunctionSignature),
    Class(ClassInfo),
    Parameter(VariableInfo),
}

/// Information about a variable
#[derive(Debug, Clone)]
pub struct VariableInfo {
    pub var_type: Option<String>,
    pub inferred_type: Option<String>,
    pub is_constant: bool,
}

/// Function signature
#[derive(Debug, Clone)]
pub struct FunctionSignature {
    pub parameters: Vec<Parameter>,
    pub return_type: Option<String>,
    pub position: Position, // Position where function was declared
}

/// Function parameter
#[derive(Debug, Clone)]
pub struct Parameter {
    pub name: String,
    pub param_type: Option<String>,
    pub position: Position, // Position where parameter was declared
}

/// Class information
#[derive(Debug, Clone)]
pub struct ClassInfo {
    pub fields: HashMap<String, VariableInfo>,
    pub methods: HashMap<String, FunctionSignature>,
    pub position: Position, // Position where class was declared
}

/// Scope in the symbol table
#[derive(Debug)]
pub struct Scope {
    pub symbols: HashMap<String, Symbol>,
    pub parent: Option<usize>,
    pub position: Position, // Position where scope was created
}

/// Symbol table
#[derive(Debug)]
pub struct SymbolTable {
    pub scopes: Vec<Scope>,
    pub current_scope: usize,
}

impl SymbolTable {
    /// Create a new symbol table
    pub fn new() -> Self {
        let global_scope = Scope {
            symbols: HashMap::new(),
            parent: None,
            position: Position::start(),
        };

        SymbolTable {
            scopes: vec![global_scope],
            current_scope: 0,
        }
    }

    /// Enter a new scope
    pub fn enter_scope(&mut self, position: Position) {
        let new_scope = Scope {
            symbols: HashMap::new(),
            parent: Some(self.current_scope),
            position,
        };
        self.scopes.push(new_scope);
        self.current_scope = self.scopes.len() - 1;
    }

    /// Exit the current scope
    pub fn exit_scope(&mut self) {
        if let Some(parent) = self.scopes[self.current_scope].parent {
            self.current_scope = parent;
        }
    }

    /// Add a symbol to the current scope
    pub fn add_symbol(&mut self, name: String, symbol: Symbol) {
        self.scopes[self.current_scope].symbols.insert(name, symbol);
    }

    /// Look up a symbol, searching through scopes
    pub fn lookup_symbol(&self, name: &str) -> Option<&Symbol> {
        let mut scope_index = self.current_scope;

        loop {
            if let Some(symbol) = self.scopes[scope_index].symbols.get(name) {
                return Some(symbol);
            }

            // Move to parent scope
            if let Some(parent) = self.scopes[scope_index].parent {
                scope_index = parent;
            } else {
                break;
            }
        }

        None
    }
}

/// Enhanced semantic analysis error with detailed information
#[derive(Debug)]
pub enum SemanticError {
    UndeclaredVariable {
        name: String,
        position: Position,
        context: String,     // Additional context about the error
        suggestion: String,  // Suggested fix
        example: String,     // Example of correct usage
    },
    DuplicateDeclaration {
        name: String,
        first_position: Position,
        duplicate_position: Position,
        context: String,
        suggestion: String,
        example: String,
    },
    TypeMismatch {
        expected: String,
        found: String,
        position: Position,
        context: String,
        suggestion: String,
        example: String,
    },
    InvalidOperation {
        message: String,
        position: Position,
        context: String,
        suggestion: String,
        example: String,
    },
    UninitializedVariable {
        name: String,
        position: Position,
        context: String,
        suggestion: String,
        example: String,
    },
}

impl std::fmt::Display for SemanticError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            SemanticError::UndeclaredVariable { name, position, context, suggestion, example } => {
                writeln!(f, "❌ Semantic error at line {}, column {}: Variable '{}' is not declared",
                       position.line, position.column, name)?;
                if !context.is_empty() {
                    writeln!(f, "   💡 Context: {}", context)?;
                }
                if !suggestion.is_empty() {
                    writeln!(f, "   💡 Tip: {}", suggestion)?;
                }
                if !example.is_empty() {
                    writeln!(f, "   📘 Example:\n{}", example)?;
                }
                Ok(())
            }
            SemanticError::DuplicateDeclaration { name, first_position, duplicate_position, context, suggestion, example } => {
                writeln!(f, "❌ Semantic error at line {}, column {}: Duplicate declaration of '{}'",
                       duplicate_position.line, duplicate_position.column, name)?;
                writeln!(f, "   First declared at line {}, column {}",
                       first_position.line, first_position.column)?;
                if !context.is_empty() {
                    writeln!(f, "   💡 Context: {}", context)?;
                }
                if !suggestion.is_empty() {
                    writeln!(f, "   💡 Tip: {}", suggestion)?;
                }
                if !example.is_empty() {
                    writeln!(f, "   📘 Example:\n{}", example)?;
                }
                Ok(())
            }
            SemanticError::TypeMismatch { expected, found, position, context, suggestion, example } => {
                writeln!(f, "❌ Semantic error at line {}, column {}: Type mismatch - expected '{}', found '{}'",
                       position.line, position.column, expected, found)?;
                if !context.is_empty() {
                    writeln!(f, "   💡 Context: {}", context)?;
                }
                if !suggestion.is_empty() {
                    writeln!(f, "   💡 Tip: {}", suggestion)?;
                }
                if !example.is_empty() {
                    writeln!(f, "   📘 Example:\n{}", example)?;
                }
                Ok(())
            }
            SemanticError::InvalidOperation { message, position, context, suggestion, example } => {
                writeln!(f, "❌ Semantic error at line {}, column {}: {}",
                       position.line, position.column, message)?;
                if !context.is_empty() {
                    writeln!(f, "   💡 Context: {}", context)?;
                }
                if !suggestion.is_empty() {
                    writeln!(f, "   💡 Tip: {}", suggestion)?;
                }
                if !example.is_empty() {
                    writeln!(f, "   📘 Example:\n{}", example)?;
                }
                Ok(())
            }
            SemanticError::UninitializedVariable { name, position, context, suggestion, example } => {
                writeln!(f, "❌ Semantic error at line {}, column {}: Variable '{}' used before initialization",
                       position.line, position.column, name)?;
                if !context.is_empty() {
                    writeln!(f, "   💡 Context: {}", context)?;
                }
                if !suggestion.is_empty() {
                    writeln!(f, "   💡 Tip: {}", suggestion)?;
                }
                if !example.is_empty() {
                    writeln!(f, "   📘 Example:\n{}", example)?;
                }
                Ok(())
            }
        }
    }
}

impl std::error::Error for SemanticError {}

/// Semantic analyzer
pub struct SemanticAnalyzer {
    symbol_table: SymbolTable,
}

impl SemanticAnalyzer {
    /// Create a new semantic analyzer
    pub fn new() -> Self {
        SemanticAnalyzer {
            symbol_table: SymbolTable::new(),
        }
    }

    /// Analyze an AST
    pub fn analyze(&mut self, ast: &ASTNode) -> Result<(), SemanticError> {
        self.analyze_node(ast)
    }

    /// Analyze a node in the AST
    fn analyze_node(&mut self, node: &ASTNode) -> Result<(), SemanticError> {
        match node {
            ASTNode::Program(statements) => {
                for statement in statements {
                    self.analyze_statement(statement)?;
                }
                Ok(())
            }
            ASTNode::BinaryOp { left, operator: _, right } => {
                self.analyze_node(&left.node)?;
                self.analyze_node(&right.node)?;
                Ok(())
            }
            ASTNode::UnaryOp { operator: _, operand } => {
                self.analyze_node(&operand.node)?;
                Ok(())
            }
            ASTNode::Identifier(name) => {
                // Check if identifier is declared
                if self.symbol_table.lookup_symbol(name).is_none() {
                    return Err(SemanticError::UndeclaredVariable {
                        name: name.clone(),
                        position: Position::start(), // This would be the actual position in a real implementation
                    });
                }
                Ok(())
            }
            ASTNode::Number(_) => Ok(()),
            ASTNode::String(_) => Ok(()),
            ASTNode::Boolean(_) => Ok(()),
            ASTNode::FunctionCall { name, arguments } => {
                // Check if function is declared
                if self.symbol_table.lookup_symbol(name).is_none() {
                    return Err(SemanticError::UndeclaredVariable {
                        name: name.clone(),
                        position: Position::start(), // This would be the actual position in a real implementation
                    });
                }

                // Analyze arguments
                for arg in arguments {
                    self.analyze_node(&arg.node)?;
                }
                Ok(())
            }
            ASTNode::MemberAccess { object, property: _ } => {
                self.analyze_node(&object.node)?;
                Ok(())
            }
            _ => Ok(())
        }
    }

    /// Analyze a statement
    fn analyze_statement(&mut self, statement: &crate::parser::Statement) -> Result<(), SemanticError> {
        match statement {
            crate::parser::Statement::Declaration { identifier, value } => {
                // Check for duplicate declaration
                if self.symbol_table.lookup_symbol(identifier).is_some() {
                    return Err(SemanticError::DuplicateDeclaration {
                        name: identifier.clone(),
                        first_position: Position::start(), // This would be the actual position in a real implementation
                        duplicate_position: Position::start(), // This would be the actual position in a real implementation
                    });
                }

                // Add to symbol table
                let symbol = Symbol {
                    name: identifier.clone(),
                    symbol_type: SymbolType::Variable(VariableInfo {
                        var_type: None,
                        inferred_type: None,
                        is_constant: false,
                    }),
                    is_initialized: true,
                    is_used: false,
                };
                self.symbol_table.add_symbol(identifier.clone(), symbol);

                // Analyze the value
                self.analyze_node(value)?;
                Ok(())
            }
            crate::parser::Statement::Assignment { identifier, value } => {
                // Check if variable is declared
                if self.symbol_table.lookup_symbol(identifier).is_none() {
                    return Err(SemanticError::UndeclaredVariable {
                        name: identifier.clone(),
                        position: Position::start(), // This would be the actual position in a real implementation
                    });
                }

                // Mark as used
                // In a real implementation, we would update the symbol table

                // Analyze the value
                self.analyze_node(value)?;
                Ok(())
            }
            crate::parser::Statement::IfStatement { condition, then_block, else_block } => {
                // Analyze condition
                self.analyze_node(condition)?;

                // Analyze then block
                self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                for stmt in then_block {
                    self.analyze_statement(stmt)?;
                }
                self.symbol_table.exit_scope();

                // Analyze else block if present
                if let Some(else_block) = else_block {
                    self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                    for stmt in else_block {
                        self.analyze_statement(stmt)?;
                    }
                    self.symbol_table.exit_scope();
                }

                Ok(())
            }
            crate::parser::Statement::FunctionDef { name, parameters: _, body } => {
                // Add function to symbol table
                let symbol = Symbol {
                    name: name.clone(),
                    symbol_type: SymbolType::Function(FunctionSignature {
                        parameters: vec![], // In a real implementation, we would populate this
                        return_type: None,
                    }),
                    is_initialized: true,
                    is_used: false,
                };
                self.symbol_table.add_symbol(name.clone(), symbol);

                // Analyze function body
                self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                for stmt in body {
                    self.analyze_statement(stmt)?;
                }
                self.symbol_table.exit_scope();

                Ok(())
            }
            crate::parser::Statement::ClassDef { name, body } => {
                // Add class to symbol table
                let symbol = Symbol {
                    name: name.clone(),
                    symbol_type: SymbolType::Class(ClassInfo {
                        fields: HashMap::new(),
                        methods: HashMap::new(),
                    }),
                    is_initialized: true,
                    is_used: false,
                };
                self.symbol_table.add_symbol(name.clone(), symbol);

                // Analyze class body
                self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                for stmt in body {
                    self.analyze_statement(stmt)?;
                }
                self.symbol_table.exit_scope();

                Ok(())
            }
            crate::parser::Statement::WhileLoop { condition, body } => {
                // Analyze condition
                self.analyze_node(condition)?;

                // Analyze body
                self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                for stmt in body {
                    self.analyze_statement(stmt)?;
                }
                self.symbol_table.exit_scope();

                Ok(())
            }
            crate::parser::Statement::ForLoop { variable, start, end, body } => {
                // Check for duplicate declaration
                if self.symbol_table.lookup_symbol(variable).is_some() {
                    return Err(SemanticError::DuplicateDeclaration {
                        name: variable.clone(),
                        first_position: Position::start(), // This would be the actual position in a real implementation
                        duplicate_position: Position::start(), // This would be the actual position in a real implementation
                    });
                }

                // Add loop variable to symbol table
                let symbol = Symbol {
                    name: variable.clone(),
                    symbol_type: SymbolType::Variable(VariableInfo {
                        var_type: None,
                        inferred_type: None,
                        is_constant: false,
                    }),
                    is_initialized: true,
                    is_used: false,
                };
                self.symbol_table.add_symbol(variable.clone(), symbol);

                // Analyze start and end expressions
                self.analyze_node(start)?;
                self.analyze_node(end)?;

                // Analyze body
                self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                for stmt in body {
                    self.analyze_statement(stmt)?;
                }
                self.symbol_table.exit_scope();

                Ok(())
            }
            crate::parser::Statement::TryCatch { try_block, catch_block, finally_block } => {
                // Analyze try block
                self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                for stmt in try_block {
                    self.analyze_statement(stmt)?;
                }
                self.symbol_table.exit_scope();

                // Analyze catch block
                self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                for stmt in catch_block {
                    self.analyze_statement(stmt)?;
                }
                self.symbol_table.exit_scope();

                // Analyze finally block if present
                if let Some(finally_block) = finally_block {
                    self.symbol_table.enter_scope(Position::start()); // This would be the actual position in a real implementation
                    for stmt in finally_block {
                        self.analyze_statement(stmt)?;
                    }
                    self.symbol_table.exit_scope();
                }

                Ok(())
            }
            crate::parser::Statement::Expression(expr) => {
                self.analyze_node(expr)?;
                Ok(())
            }
            crate::parser::Statement::ReturnStmt(expr) => {
                self.analyze_node(expr)?;
                Ok(())
            }
        }
    }
}
