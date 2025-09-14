//! KODEON Programming Language Compiler Library

pub mod lexer;
pub mod parser;
pub mod semantic_analyzer;
pub mod ir;
pub mod llvm_backend;
pub mod module_resolver;
pub mod optimizer;
pub mod error_messages;
pub mod debugger;

// Re-export the main components for easier access
pub use lexer::{Lexer, Token};
pub use parser::{Parser, ASTNode};
pub use semantic_analyzer::{SemanticAnalyzer, SymbolTable, Symbol};
pub use ir::{IRModule, IRGenerator, print_ir};
pub use llvm_backend::LLVMBackend;
pub use module_resolver::ModuleResolver;
pub use optimizer::Optimizer;
pub use error_messages::{ErrorMessage, ErrorMessages};
pub use debugger::{Debugger, create_debugger};
