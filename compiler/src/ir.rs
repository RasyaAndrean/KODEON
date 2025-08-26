//! Intermediate Representation (IR) for the KODEON programming language

use std::collections::HashMap;
use crate::parser::{ASTNode, Statement, BinaryOperator, UnaryOperator, ParseError};
use crate::module_resolver::ModuleResolver;

/// Debug information for source code locations
#[derive(Debug, Clone)]
pub struct DebugInfo {
    pub file_name: String,
    pub line: usize,
    pub column: usize,
}

/// IR module containing functions and global variables
#[derive(Debug)]
pub struct IRModule {
    pub functions: Vec<Function>,
    pub global_vars: Vec<GlobalVariable>,
    pub debug_info: Option<DebugInfo>, // Module-level debug info
}

/// Function in IR
#[derive(Debug)]
pub struct Function {
    pub name: String,
    pub parameters: Vec<Parameter>,
    pub return_type: Type,
    pub blocks: Vec<BasicBlock>,
    pub debug_info: Option<DebugInfo>, // Function-level debug info
}

/// Basic block in IR
#[derive(Debug)]
pub struct BasicBlock {
    pub name: String,
    pub instructions: Vec<Instruction>,
    pub terminator: Terminator,
    pub debug_info: Option<DebugInfo>, // Block-level debug info
}

/// Parameter for a function
#[derive(Debug)]
pub struct Parameter {
    pub name: String,
    pub param_type: Type,
    pub debug_info: Option<DebugInfo>, // Parameter-level debug info
}

/// Global variable
#[derive(Debug)]
pub struct GlobalVariable {
    pub name: String,
    pub var_type: Type,
    pub initializer: Option<Value>,
    pub debug_info: Option<DebugInfo>, // Variable-level debug info
}

/// Types in IR
#[derive(Debug, Clone, PartialEq)]
pub enum Type {
    Int,
    Float,
    Bool,
    String,
    Array { element_type: Box<Type> },
    Object { name: String },
    Function { param_types: Vec<Type>, return_type: Box<Type> },
    Void,
    // New types for enhanced features
    Reference { inner_type: Box<Type> },  // C++-like references
    Pointer { inner_type: Box<Type> },    // C++-like pointers
    Optional { inner_type: Box<Type> },   // Swift-like optionals
    Range,                                // Range type
    Async { inner_type: Box<Type> },      // Async type
    // Types for Go-style concurrency
    Channel { element_type: Box<Type> },  // Go-style channels
    Goroutine,                            // Go-style goroutines
    // Types for Rust-style features
    Trait { name: String },               // Rust-style traits
    // Types for Kotlin-style features
    Nullable { inner_type: Box<Type> },   // Kotlin-style nullable types
    // Types for SQL-style features
    Table { columns: HashMap<String, Type> }, // SQL-style tables
    // Types for R-style features
    Vector { element_type: Box<Type> },   // R-style vectors
    DataFrame,                            // R-style data frames
    // Advanced concurrency types
    Mutex,                                // Mutual exclusion lock
    Condition,                            // Condition variable
}

/// Values in IR
#[derive(Debug, Clone)]
pub enum Value {
    Constant(Constant),
    Variable(String),
    InstructionRef(usize), // Reference to an instruction result
    // New value types for enhanced features
    RangeValue { start: Box<Value>, end: Box<Value>, inclusive: bool },
    ListComprehensionValue { expression: Box<Value>, variable: String, iterable: Box<Value>, condition: Option<Box<Value>> },
    ObjectValue { properties: HashMap<String, Value> },
    AwaitValue(Box<Value>),
    YieldValue(Box<Value>),
    // New value types for extended features
    ChannelValue { element_type: Box<Type> },     // Go-style channels
    GoroutineValue { function: Box<Value> },      // Go-style goroutines
    TraitValue { name: String },                  // Rust-style traits
    NullableValue { value: Option<Box<Value>> },  // Kotlin-style nullable
    TableValue { columns: HashMap<String, Value> }, // SQL-style tables
    VectorValue { elements: Vec<Value> },         // R-style vectors
    DataframeValue { data: HashMap<String, Value> }, // R-style data frames
    // Advanced concurrency values
    MutexValue,                                   // Mutex value
    ConditionValue,                               // Condition variable value
}

/// Atomic ordering for atomic operations
#[derive(Debug, Clone)]
pub enum AtomicOrdering {
    Relaxed,
    Consume,
    Acquire,
    Release,
    AcqRel,
    SeqCst,
}

/// Constants in IR
#[derive(Debug, Clone)]
pub enum Constant {
    Int(i64),
    Float(f64),
    Bool(bool),
    String(String),
    // New constants for enhanced features
    Array(Vec<Constant>),
    Object(HashMap<String, Constant>),
    Null,
    // Elegant constants for reduced boilerplate
    Empty,          // Represents empty values elegantly
    Undefined,      // Represents undefined values
    Placeholder,    // Generic placeholder for elegant code
}

/// Instructions in IR
#[derive(Debug)]
pub enum Instruction {
    BinaryOp {
        result: String,
        op: BinaryOp,
        left: Value,
        right: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    UnaryOp {
        result: String,
        op: UnaryOp,
        operand: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Load {
        result: String,
        variable: String,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Store {
        variable: String,
        value: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Call {
        result: Option<String>,
        function: String,
        arguments: Vec<Value>,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Alloca {
        result: String,
        alloca_type: Type,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Return {
        value: Option<Value>,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    // Elegant instructions for reduced boilerplate
    Chain {             // Method chaining instruction
        result: String,
        object: Value,
        methods: Vec<(String, Vec<Value>)>, // method name and arguments
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Pipeline {          // Pipeline operator support
        result: String,
        initial: Value,
        operations: Vec<Value>, // sequence of operations
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Destructure {       // Object/array destructuring
        bindings: Vec<String>,
        value: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Swap {              // Elegant variable swapping
        left: String,
        right: String,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    // New instructions for enhanced features
    ListComprehension {
        result: String,
        expression: Value,
        variable: String,
        iterable: Value,
        condition: Option<Value>,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Range {
        result: String,
        start: Value,
        end: Value,
        inclusive: bool,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    ObjectLiteral {
        result: String,
        properties: HashMap<String, Value>,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    MemberAccess {
        result: String,
        object: Value,
        property: String,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    ForEachLoop {
        variable: String,
        iterable: Value,
        body: Vec<Instruction>,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    PatternMatch {
        result: String,
        expression: Value,
        cases: Vec<(Value, Vec<Instruction>)>,
        default: Option<Vec<Instruction>>,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Await {
        result: String,
        value: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    Yield {
        result: String,
        value: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    // Concurrency instructions
    MakeChannel {
        result: String,
        channel_type: Type,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    ChannelSend {
        channel: Value,
        value: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    ChannelReceive {
        result: String,
        channel: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    MakeGoroutine {
        result: String,
        function: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    GoRoutine {
        function: Value,
        arguments: Vec<Value>,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    MutexLock {
        mutex: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    MutexUnlock {
        mutex: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    ConditionWait {
        condition: Value,
        mutex: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    ConditionSignal {
        condition: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    ConditionBroadcast {
        condition: Value,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    AtomicLoad {
        result: String,
        address: Value,
        ordering: AtomicOrdering,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    AtomicStore {
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    AtomicExchange {
        result: String,
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    AtomicCompareExchange {
        result: String,
        address: Value,
        expected: Value,
        desired: Value,
        success_ordering: AtomicOrdering,
        failure_ordering: AtomicOrdering,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    AtomicFetchAdd {
        result: String,
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
    AtomicFetchSub {
        result: String,
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
        debug_info: Option<DebugInfo>, // Instruction-level debug info
    },
}

/// Binary operations
#[derive(Debug)]
pub enum BinaryOp {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    Eq,
    Ne,
    Lt,
    Gt,
    Le,
    Ge,
    And,
    Or,
    BitAnd,
    BitOr,
    BitXor,
    LeftShift,
    RightShift,
    In,  // Membership test
}

/// Unary operations
#[derive(Debug)]
pub enum UnaryOp {
    Neg,
    Not,
    BitNot,
    Increment,
    Decrement,
    AddressOf,    // &
    Dereference,  // *
}

/// Atomic ordering for atomic operations
#[derive(Debug)]
pub enum AtomicOrdering {
    Relaxed,
    Consume,
    Acquire,
    Release,
    AcqRel,
    SeqCst,
}

/// Terminators for basic blocks
#[derive(Debug)]
pub enum Terminator {
    Return { value: Option<Value> },
    Branch { target: String },
    ConditionalBranch {
        condition: Value,
        then_target: String,
        else_target: String,
    },
}

/// IR builder for constructing IR programmatically
pub struct IRBuilder {
    module: IRModule,
    current_function: Option<usize>,
    current_block: Option<usize>,
    next_value_id: usize,
}

impl IRBuilder {
    /// Create a new IR builder
    pub fn new() -> Self {
        IRBuilder {
            module: IRModule {
                functions: Vec::new(),
                global_vars: Vec::new(),
                debug_info: None, // No module-level debug info initially
            },
            current_function: None,
            current_block: None,
            next_value_id: 0,
        }
    }

    /// Create a new function
    pub fn create_function(
        &mut self,
        name: String,
        parameters: Vec<Parameter>,
        return_type: Type,
    ) -> usize {
        let function = Function {
            name,
            parameters,
            return_type,
            blocks: Vec::new(),
            debug_info: None, // No debug info initially
        };

        self.module.functions.push(function);
        let function_index = self.module.functions.len() - 1;
        self.current_function = Some(function_index);
        function_index
    }

    /// Create a new basic block
    pub fn create_block(&mut self, name: String) -> Result<usize, String> {
        if let Some(function_index) = self.current_function {
            let block = BasicBlock {
                name,
                instructions: Vec::new(),
                terminator: Terminator::Return { value: None }, // Default terminator
                debug_info: None, // No debug info initially
            };

            self.module.functions[function_index].blocks.push(block);
            let block_index = self.module.functions[function_index].blocks.len() - 1;
            self.current_block = Some(block_index);
            Ok(block_index)
        } else {
            Err("No current function".to_string())
        }
    }

    /// Add an instruction to the current block
    pub fn add_instruction(&mut self, instruction: Instruction) -> Result<String, String> {
        if let (Some(function_index), Some(block_index)) =
            (self.current_function, self.current_block)
        {
            self.module.functions[function_index].blocks[block_index]
                .instructions
                .push(instruction);

            // Generate a unique name for the result
            let result_name = format!("%{}", self.next_value_id);
            self.next_value_id += 1;
            Ok(result_name)
        } else {
            Err("No current block".to_string())
        }
    }

    /// Set debug information for the current module
    pub fn set_module_debug_info(&mut self, file_name: String, line: usize, column: usize) {
        self.module.debug_info = Some(DebugInfo {
            file_name,
            line,
            column,
        });
    }

    /// Set debug information for the current function
    pub fn set_function_debug_info(&mut self, file_name: String, line: usize, column: usize) {
        if let Some(function_index) = self.current_function {
            self.module.functions[function_index].debug_info = Some(DebugInfo {
                file_name,
                line,
                column,
            });
        }
    }

    /// Set debug information for the current block
    pub fn set_block_debug_info(&mut self, file_name: String, line: usize, column: usize) {
        if let (Some(function_index), Some(block_index)) =
            (self.current_function, self.current_block)
        {
            self.module.functions[function_index].blocks[block_index].debug_info = Some(DebugInfo {
                file_name,
                line,
                column,
            });
        }
    }

    /// Get a reference to the module
    pub fn get_module(&self) -> &IRModule {
        &self.module
    }

    /// Get a mutable reference to the module
    pub fn get_module_mut(&mut self) -> &mut IRModule {
        &mut self.module
    }

    /// Add a list comprehension instruction
    pub fn add_list_comprehension(
        &mut self,
        expression: Value,
        variable: String,
        iterable: Value,
        condition: Option<Value>,
    ) -> Result<String, String> {
        let instruction = Instruction::ListComprehension {
            result: "".to_string(),
            expression,
            variable,
            iterable,
            condition,
        };
        self.add_instruction(instruction)
    }

    /// Add a range instruction
    pub fn add_range(
        &mut self,
        start: Value,
        end: Value,
        inclusive: bool,
    ) -> Result<String, String> {
        let instruction = Instruction::Range {
            result: "".to_string(),
            start,
            end,
            inclusive,
        };
        self.add_instruction(instruction)
    }

    /// Add an object literal instruction
    pub fn add_object_literal(
        &mut self,
        properties: HashMap<String, Value>,
    ) -> Result<String, String> {
        let instruction = Instruction::ObjectLiteral {
            result: "".to_string(),
            properties,
        };
        self.add_instruction(instruction)
    }

    /// Add a member access instruction
    pub fn add_member_access(
        &mut self,
        object: Value,
        property: String,
    ) -> Result<String, String> {
        let instruction = Instruction::MemberAccess {
            result: "".to_string(),
            object,
            property,
        };
        self.add_instruction(instruction)
    }

    /// Add an await instruction
    pub fn add_await(
        &mut self,
        value: Value,
    ) -> Result<String, String> {
        let instruction = Instruction::Await {
            result: "".to_string(),
            value,
        };
        self.add_instruction(instruction)
    }

    /// Add a yield instruction
    pub fn add_yield(
        &mut self,
        value: Value,
    ) -> Result<String, String> {
        let instruction = Instruction::Yield {
            result: "".to_string(),
            value,
        };
        self.add_instruction(instruction)
    }

    /// Add a make channel instruction (Go-style)
    pub fn add_make_channel(
        &mut self,
        result: String,
        channel_type: Type,
    ) -> Result<(), String> {
        let instruction = Instruction::MakeChannel {
            result,
            channel_type,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a channel send instruction (Go-style)
    pub fn add_channel_send(
        &mut self,
        channel: Value,
        value: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::ChannelSend {
            channel,
            value,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a channel receive instruction (Go-style)
    pub fn add_channel_receive(
        &mut self,
        result: String,
        channel: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::ChannelReceive {
            result,
            channel,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a goroutine creation instruction (Go-style)
    pub fn add_make_goroutine(
        &mut self,
        result: String,
        function: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::MakeGoroutine {
            result,
            function,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a mutex lock instruction
    pub fn add_mutex_lock(
        &mut self,
        mutex: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::MutexLock {
            mutex,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a mutex unlock instruction
    pub fn add_mutex_unlock(
        &mut self,
        mutex: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::MutexUnlock {
            mutex,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a condition wait instruction
    pub fn add_condition_wait(
        &mut self,
        condition: Value,
        mutex: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::ConditionWait {
            condition,
            mutex,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a condition signal instruction
    pub fn add_condition_signal(
        &mut self,
        condition: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::ConditionSignal {
            condition,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add a condition broadcast instruction
    pub fn add_condition_broadcast(
        &mut self,
        condition: Value,
    ) -> Result<(), String> {
        let instruction = Instruction::ConditionBroadcast {
            condition,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add an atomic load instruction
    pub fn add_atomic_load(
        &mut self,
        result: String,
        address: Value,
        ordering: AtomicOrdering,
    ) -> Result<(), String> {
        let instruction = Instruction::AtomicLoad {
            result,
            address,
            ordering,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add an atomic store instruction
    pub fn add_atomic_store(
        &mut self,
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
    ) -> Result<(), String> {
        let instruction = Instruction::AtomicStore {
            address,
            value,
            ordering,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add an atomic exchange instruction
    pub fn add_atomic_exchange(
        &mut self,
        result: String,
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
    ) -> Result<(), String> {
        let instruction = Instruction::AtomicExchange {
            result,
            address,
            value,
            ordering,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add an atomic compare exchange instruction
    pub fn add_atomic_compare_exchange(
        &mut self,
        result: String,
        address: Value,
        expected: Value,
        desired: Value,
        success_ordering: AtomicOrdering,
        failure_ordering: AtomicOrdering,
    ) -> Result<(), String> {
        let instruction = Instruction::AtomicCompareExchange {
            result,
            address,
            expected,
            desired,
            success_ordering,
            failure_ordering,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add an atomic fetch add instruction
    pub fn add_atomic_fetch_add(
        &mut self,
        result: String,
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
    ) -> Result<(), String> {
        let instruction = Instruction::AtomicFetchAdd {
            result,
            address,
            value,
            ordering,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }

    /// Add an atomic fetch sub instruction
    pub fn add_atomic_fetch_sub(
        &mut self,
        result: String,
        address: Value,
        value: Value,
        ordering: AtomicOrdering,
    ) -> Result<(), String> {
        let instruction = Instruction::AtomicFetchSub {
            result,
            address,
            value,
            ordering,
        };
        self.current_block_mut()?.instructions.push(instruction);
        Ok(())
    }
}

/// IR generator that translates AST to IR
pub struct IRGenerator {
    module: IRModule,
    current_function: Option<String>,
    current_block: Option<String>,
    builder: IRBuilder,
    // Module resolver for handling imports
    module_resolver: ModuleResolver,
}

impl IRGenerator {
    /// Create a new IR generator
    pub fn new() -> Self {
        IRGenerator {
            module: IRModule {
                functions: Vec::new(),
                global_vars: Vec::new(),
                debug_info: None, // No module-level debug info initially
            },
            current_function: None,
            current_block: None,
            builder: IRBuilder::new(),
            module_resolver: ModuleResolver::new(),
        }
    }

    /// Create a new IR generator with a custom module resolver
    pub fn with_module_resolver(module_resolver: ModuleResolver) -> Self {
        IRGenerator {
            module: IRModule {
                functions: Vec::new(),
                global_vars: Vec::new(),
                debug_info: None, // No module-level debug info initially
            },
            current_function: None,
            current_block: None,
            builder: IRBuilder::new(),
            module_resolver,
        }
    }

    /// Generate IR from an AST
    pub fn generate_ir(&mut self, ast: &crate::parser::ASTNode) -> Result<IRModule, String> {
        self.translate_node(ast)?;
        Ok(self.builder.get_module().clone())
    }

    /// Translate an AST node to IR
    fn translate_node(&mut self, node: &crate::parser::ASTNode) -> Result<Option<Value>, String> {
        match node {
            crate::parser::ASTNode::Program(statements) => {
                // Create main function
                self.builder.create_function(
                    "main".to_string(),
                    vec![],
                    Type::Int,
                );

                // Create entry block
                self.builder.create_block("entry".to_string())?;

                // Translate statements
                for statement in statements {
                    self.translate_statement(statement)?;
                }

                // Add return instruction
                self.builder.set_terminator(Terminator::Return {
                    value: Some(Value::Constant(Constant::Int(0))),
                })?;

                Ok(None)
            }
            crate::parser::ASTNode::Number(value) => {
                Ok(Some(Value::Constant(Constant::Float(*value))))
            }
            crate::parser::ASTNode::String(value) => {
                Ok(Some(Value::Constant(Constant::String(value.clone()))))
            }
            crate::parser::ASTNode::Boolean(value) => {
                Ok(Some(Value::Constant(Constant::Bool(*value))))
            }
            crate::parser::ASTNode::Identifier(name, _) => {
                Ok(Some(Value::Variable(name.clone())))
            }
            crate::parser::ASTNode::BinaryOp { left, operator, right, .. } => {
                let left_val = self.translate_node(left)?.unwrap();
                let right_val = self.translate_node(right)?.unwrap();

                let op = match operator {
                    crate::parser::BinaryOperator::Add => BinaryOp::Add,
                    crate::parser::BinaryOperator::Subtract => BinaryOp::Sub,
                    crate::parser::BinaryOperator::Multiply => BinaryOp::Mul,
                    crate::parser::BinaryOperator::Divide => BinaryOp::Div,
                    crate::parser::BinaryOperator::Modulo => BinaryOp::Mod,
                    crate::parser::BinaryOperator::Equal => BinaryOp::Eq,
                    crate::parser::BinaryOperator::NotEqual => BinaryOp::Ne,
                    crate::parser::BinaryOperator::Less => BinaryOp::Lt,
                    crate::parser::BinaryOperator::Greater => BinaryOp::Gt,
                    crate::parser::BinaryOperator::LessEqual => BinaryOp::Le,
                    crate::parser::BinaryOperator::GreaterEqual => BinaryOp::Ge,
                    crate::parser::BinaryOperator::And => BinaryOp::And,
                    crate::parser::BinaryOperator::Or => BinaryOp::Or,
                    crate::parser::BinaryOperator::BitAnd => BinaryOp::BitAnd,
                    crate::parser::BinaryOperator::BitOr => BinaryOp::BitOr,
                    crate::parser::BinaryOperator::BitXor => BinaryOp::BitXor,
                    crate::parser::BinaryOperator::LeftShift => BinaryOp::LeftShift,
                    crate::parser::BinaryOperator::RightShift => BinaryOp::RightShift,
                    crate::parser::BinaryOperator::Range => BinaryOp::Add, // Simplified for now
                    crate::parser::BinaryOperator::In => BinaryOp::In,
                    crate::parser::BinaryOperator::Assign => return Err("Assignment should be handled as statement".to_string()),
                };

                let result = self.builder.add_instruction(Instruction::BinaryOp {
                    result: "".to_string(), // Will be filled by the builder
                    op,
                    left: left_val,
                    right: right_val,
                })?;

                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::UnaryOp { operator, operand, .. } => {
                let operand_val = self.translate_node(operand)?.unwrap();

                let op = match operator {
                    crate::parser::UnaryOperator::Negate => UnaryOp::Neg,
                    crate::parser::UnaryOperator::Not => UnaryOp::Not,
                    crate::parser::UnaryOperator::Increment => UnaryOp::Increment,
                    crate::parser::UnaryOperator::Decrement => UnaryOp::Decrement,
                    crate::parser::UnaryOperator::BitNot => UnaryOp::BitNot,
                    crate::parser::UnaryOperator::AddressOf => UnaryOp::AddressOf,
                    crate::parser::UnaryOperator::Dereference => UnaryOp::Dereference,
                };

                let result = self.builder.add_instruction(Instruction::UnaryOp {
                    result: "".to_string(), // Will be filled by the builder
                    op,
                    operand: operand_val,
                })?;

                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::FunctionCall { name, arguments, .. } => {
                let arg_values: Vec<Value> = arguments
                    .iter()
                    .map(|arg| self.translate_node(arg))
                    .collect::<Result<Vec<_>, _>>()?
                    .into_iter()
                    .flatten()
                    .collect();

                let result = self.builder.add_instruction(Instruction::Call {
                    result: Some("".to_string()), // Will be filled by the builder
                    function: name.clone(),
                    arguments: arg_values,
                })?;

                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::ArrayLiteral(elements, _) => {
                // For now, we'll create an array allocation and store each element
                let element_values: Vec<Value> = elements
                    .iter()
                    .map(|elem| self.translate_node(elem))
                    .collect::<Result<Vec<_>, _>>()?
                    .into_iter()
                    .flatten()
                    .collect();

                // Create an array type (simplified)
                let array_type = Type::Array {
                    element_type: Box::new(Type::Int), // Simplified - would determine actual type
                };

                // Allocate the array
                let array_var = self.builder.add_instruction(Instruction::Alloca {
                    result: "".to_string(),
                    alloca_type: array_type,
                })?;

                // Store each element (simplified)
                for (i, element) in element_values.iter().enumerate() {
                    // In a real implementation, we would generate code to store each element
                    // at the appropriate index in the array
                }

                Ok(Some(Value::Variable(array_var)))
            }
            crate::parser::ASTNode::ObjectLiteral(properties, _) => {
                let mut ir_properties = HashMap::new();

                for (key, value) in properties {
                    if let Some(val) = self.translate_node(value)? {
                        ir_properties.insert(key.clone(), val);
                    }
                }

                let result = self.builder.add_object_literal(ir_properties)?;
                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::RangeExpr { start, end, inclusive, .. } => {
                let start_val = self.translate_node(start)?.unwrap();
                let end_val = self.translate_node(end)?.unwrap();

                let result = self.builder.add_range(start_val, end_val, *inclusive)?;
                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::ListComprehension { expression, variable, iterable, condition, .. } => {
                let expr_val = self.translate_node(expression)?.unwrap();
                let iter_val = self.translate_node(iterable)?.unwrap();
                let cond_val = if let Some(cond) = condition {
                    Some(self.translate_node(cond)?.unwrap())
                } else {
                    None
                };

                let result = self.builder.add_list_comprehension(expr_val, variable.clone(), iter_val, cond_val)?;
                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::MemberAccess { object, property, .. } => {
                let object_val = self.translate_node(object)?.unwrap();

                let result = self.builder.add_member_access(object_val, property.clone())?;
                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::AwaitExpr(expr, _) => {
                let expr_val = self.translate_node(expr)?.unwrap();

                let result = self.builder.add_await(expr_val)?;
                Ok(Some(Value::Variable(result)))
            }
            crate::parser::ASTNode::YieldExpr(expr, _) => {
                let expr_val = self.translate_node(expr)?.unwrap();

                let result = self.builder.add_yield(expr_val)?;
                Ok(Some(Value::Variable(result)))
            }
            _ => Err(format!("Unsupported AST node: {:?}", node)),
        }
    }

    /// Translate a statement to IR
    pub fn translate_statement(&mut self, statement: Statement) -> Result<(), ParseError> {
        match statement.node {
            crate::parser::Statement::Declaration { identifier, value, mutable, .. } => {
                // Allocate space for the variable
                let var_type = Type::Int; // Simplified - would determine actual type in real implementation

                self.builder.add_instruction(Instruction::Alloca {
                    result: identifier.clone(),
                    alloca_type: var_type,
                })?;

                // Evaluate the value
                let value_ref = self.translate_node(value)?;
                if let Some(val) = value_ref {
                    // Store the value in the variable
                    self.builder.add_instruction(Instruction::Store {
                        variable: identifier.clone(),
                        value: val,
                    })?;
                }
                Ok(())
            }
            crate::parser::Statement::Assignment { identifier, value, .. } => {
                // Evaluate the value
                let value_ref = self.translate_node(value)?;
                if let Some(val) = value_ref {
                    // Store the value in the variable
                    self.builder.add_instruction(Instruction::Store {
                        variable: identifier.clone(),
                        value: val,
                    })?;
                }
                Ok(())
            }
            crate::parser::Statement::Expression(expr) => {
                self.translate_node(expr)?;
                Ok(())
            }
            crate::parser::Statement::FunctionDef { name, parameters, body, access_modifier, is_static, is_async, .. } => {
                // Create function parameters
                let params: Vec<Parameter> = parameters
                    .iter()
                    .map(|param| Parameter {
                        name: param.clone(),
                        param_type: Type::Int, // Simplified - would determine actual type in real implementation
                    })
                    .collect();

                // Determine return type (simplified)
                let return_type = if *is_async {
                    Type::Async { inner_type: Box::new(Type::Int) }
                } else {
                    Type::Int
                };

                // Create function
                self.builder.create_function(
                    name.clone(),
                    params,
                    return_type,
                );

                // Create entry block
                self.builder.create_block("entry".to_string())?;

                // Translate function body
                for stmt in body {
                    self.translate_statement(stmt)?;
                }

                // Add default return for now
                self.builder.set_terminator(Terminator::Return {
                    value: Some(Value::Constant(Constant::Int(0))),
                })?;

                Ok(())
            }
            crate::parser::Statement::ClassDef { name, body, access_modifier, parent_class, .. } => {
                // In IR, classes are represented as collections of functions and data
                // For now, we'll just process the body statements
                for stmt in body {
                    self.translate_statement(stmt)?;
                }
                Ok(())
            }
            crate::parser::Statement::ReturnStmt(expr) => {
                let value_ref = self.translate_node(expr)?;
                self.builder.set_terminator(Terminator::Return {
                    value: value_ref,
                })?;
                Ok(())
            }
            crate::parser::Statement::IfStatement { condition, then_block, else_block, .. } => {
                let condition_val = self.translate_node(condition)?;

                // For now, we'll just translate the then block
                // A full implementation would need to generate proper control flow
                for stmt in then_block {
                    self.translate_statement(stmt)?;
                }

                if let Some(else_stmts) = else_block {
                    for stmt in else_stmts {
                        self.translate_statement(stmt)?;
                    }
                }

                Ok(())
            }
            crate::parser::Statement::WhileLoop { condition, body, .. } => {
                let condition_val = self.translate_node(condition)?;

                // For now, we'll just translate the body
                // A full implementation would need to generate proper control flow
                for stmt in body {
                    self.translate_statement(stmt)?;
                }

                Ok(())
            }
            crate::parser::Statement::ForLoop { variable, start, end, body, .. } => {
                // Translate initialization
                let start_val = self.translate_node(start)?;
                if let Some(val) = start_val {
                    self.builder.add_instruction(Instruction::Store {
                        variable: variable.clone(),
                        value: val,
                    })?;
                }

                // For now, we'll just translate the body
                // A full implementation would need to generate proper control flow
                for stmt in body {
                    self.translate_statement(stmt)?;
                }

                Ok(())
            }
            crate::parser::Statement::ForEachLoop { variable, iterable, body, .. } => {
                let iterable_val = self.translate_node(iterable)?;

                if let Some(val) = iterable_val {
                    let instruction = Instruction::ForEachLoop {
                        variable: variable.clone(),
                        iterable: val,
                        body: vec![], // Simplified - would generate actual body instructions
                    };
                    self.builder.add_instruction(instruction)?;
                }

                // For now, we'll just translate the body
                for stmt in body {
                    self.translate_statement(stmt)?;
                }

                Ok(())
            }
            crate::parser::Statement::TryCatch { try_block, catch_block, finally_block, .. } => {
                // For now, we'll just translate the try block
                for stmt in try_block {
                    self.translate_statement(stmt)?;
                }

                // Then the catch block
                for stmt in catch_block {
                    self.translate_statement(stmt)?;
                }

                // Then the finally block if it exists
                if let Some(finally_stmts) = finally_block {
                    for stmt in finally_stmts {
                        self.translate_statement(stmt)?;
                    }
                }

                Ok(())
            }
            crate::parser::Statement::BreakStmt => {
                // Break statements would need proper control flow handling
                Ok(())
            }
            crate::parser::Statement::ContinueStmt => {
                // Continue statements would need proper control flow handling
                Ok(())
            }
            crate::parser::Statement::ImportStmt { module, alias, .. } => {
                // Handle import statements by resolving and processing the module
                match self.module_resolver.resolve_module(&module) {
                    Ok(module_content) => {
                        // Parse the imported module content
                        let mut import_parser = crate::parser::Parser::new(&module_content)?;
                        let import_ast = import_parser.parse_program()?;

                        // Process the imported module AST
                        // For now, we'll just acknowledge the import and store the alias if provided
                        let module_name = if let Some(alias_name) = alias {
                            alias_name.clone()
                        } else {
                            module.clone()
                        };

                        println!("Imported module: {} as {}", module, module_name);

                        // In a full implementation, we would integrate the imported module's
                        // functions and variables into the current module's scope
                        // For now, we'll just note the import
                    }
                    Err(e) => {
                        eprintln!("Warning: Failed to resolve module '{}': {}", module, e);
                    }
                }
                Ok(())
            }
            crate::parser::Statement::WhenStmt { expression, cases, else_case, .. } => {
                let expr_val = self.translate_node(expression)?;

                if let Some(val) = expr_val {
                    let mut ir_cases = Vec::new();

                    for (pattern, body_stmts) in cases {
                        let pattern_val = self.translate_node(pattern)?;
                        // Simplified - would generate actual body instructions
                        if let Some(pat_val) = pattern_val {
                            ir_cases.push((pat_val, vec![]));
                        }

                        // Translate body statements
                        for stmt in body_stmts {
                            self.translate_statement(stmt)?;
                        }
                    }

                    let default_body = if let Some(else_stmts) = else_case {
                        // Translate else case statements
                        for stmt in else_stmts {
                            self.translate_statement(stmt)?;
                        }
                        Some(vec![]) // Simplified
                    } else {
                        None
                    };

                    let instruction = Instruction::PatternMatch {
                        result: "".to_string(),
                        expression: val,
                        cases: ir_cases,
                        default: default_body,
                    };
                    self.builder.add_instruction(instruction)?;
                }

                Ok(())
            }
            _ => Ok(()), // Skip unsupported statements for now
        }
    }

    /// Set debug information for the current module
    pub fn set_module_debug_info(&mut self, file_name: String, line: usize, column: usize) {
        self.module.debug_info = Some(DebugInfo {
            file_name,
            line,
            column,
        });
    }

    /// Set debug information for the current function
    pub fn set_function_debug_info(&mut self, file_name: String, line: usize, column: usize) {
        // This would set debug info for the current function
        // Implementation would depend on how we track the current function
    }
}

/// Print IR in a human-readable format
pub fn print_ir(module: &IRModule) {
    println!("; KODEON IR Module");

    // Print global variables
    for global in &module.global_vars {
        println!("@{} = global {}", global.name, print_type(&global.var_type));
    }

    // Print functions
    for function in &module.functions {
        print!("define {} @{}(", print_type(&function.return_type), function.name);

        for (i, param) in function.parameters.iter().enumerate() {
            if i > 0 {
                print!(", ");
            }
            print!("{} %{}", print_type(&param.param_type), param.name);
        }

        println!(") {{");

        // Print basic blocks
        for block in &function.blocks {
            println!("{}:", block.name);

            // Print instructions
            for instruction in &block.instructions {
                print!("  ");
                print_instruction(instruction);
            }

            // Print terminator
            print!("  ");
            print_terminator(&block.terminator);
        }

        println!("}}");
    }
}

/// Print an instruction
fn print_instruction(instruction: &Instruction) {
    match instruction {
        Instruction::BinaryOp { result, op, left, right } => {
            print!("{} = ", result);
            match op {
                BinaryOp::Add => print!("add "),
                BinaryOp::Sub => print!("sub "),
                BinaryOp::Mul => print!("mul "),
                BinaryOp::Div => print!("div "),
                BinaryOp::Mod => print!("mod "),
                BinaryOp::Eq => print!("eq "),
                BinaryOp::Ne => print!("ne "),
                BinaryOp::Lt => print!("lt "),
                BinaryOp::Gt => print!("gt "),
                BinaryOp::Le => print!("le "),
                BinaryOp::Ge => print!("ge "),
                BinaryOp::And => print!("and "),
                BinaryOp::Or => print!("or "),
                BinaryOp::BitAnd => print!("bitand "),
                BinaryOp::BitOr => print!("bitor "),
                BinaryOp::BitXor => print!("bitxor "),
                BinaryOp::LeftShift => print!("shl "),
                BinaryOp::RightShift => print!("shr "),
                BinaryOp::In => print!("in "),
            }
            print_value(left);
            print!(", ");
            print_value(right);
            println!();
        }
        Instruction::Store { variable, value } => {
            print!("store {}, %{}", print_value_str(value), variable);
            println!();
        }
        Instruction::Alloca { result, alloca_type } => {
            print!("{} = alloca {}", result, print_type(alloca_type));
            println!();
        }
        Instruction::ListComprehension { result, expression, variable, iterable, condition } => {
            print!("{} = listcomp ", result);
            print_value(expression);
            print!(" for {} in ", variable);
            print_value(iterable);
            if let Some(cond) = condition {
                print!(" if ");
                print_value(cond);
            }
            println!();
        }
        Instruction::Range { result, start, end, inclusive } => {
            print!("{} = range ", result);
            print_value(start);
            if *inclusive {
                print!("...");
            } else {
                print!("..");
            }
            print_value(end);
            println!();
        }
        Instruction::ObjectLiteral { result, properties } => {
            print!("{} = object {{", result);
            for (i, (key, value)) in properties.iter().enumerate() {
                if i > 0 {
                    print!(", ");
                }
                print!("{}: ", key);
                print_value(value);
            }
            print!("}}");
            println!();
        }
        Instruction::MemberAccess { result, object, property } => {
            print!("{} = memberaccess ", result);
            print_value(object);
            print!(".{}", property);
            println!();
        }
        Instruction::Await { result, value } => {
            print!("{} = await ", result);
            print_value(value);
            println!();
        }
        Instruction::Yield { result, value } => {
            print!("{} = yield ", result);
            print_value(value);
            println!();
        }
        Instruction::MutexLock { mutex } => {
            print!("mutex.lock ");
            print_value(mutex);
            println!();
        }
        Instruction::MutexUnlock { mutex } => {
            print!("mutex.unlock ");
            print_value(mutex);
            println!();
        }
        Instruction::ConditionWait { condition, mutex } => {
            print!("condition.wait ");
            print_value(condition);
            print!(", ");
            print_value(mutex);
            println!();
        }
        Instruction::ConditionSignal { condition } => {
            print!("condition.signal ");
            print_value(condition);
            println!();
        }
        Instruction::ConditionBroadcast { condition } => {
            print!("condition.broadcast ");
            print_value(condition);
            println!();
        }
        Instruction::AtomicLoad { result, address, ordering } => {
            print!("{} = atomic.load ", result);
            print_value(address);
            print!(", ordering={:?}", ordering);
            println!();
        }
        Instruction::AtomicStore { address, value, ordering } => {
            print!("atomic.store ");
            print_value(address);
            print!(", ");
            print_value(value);
            print!(", ordering={:?}", ordering);
            println!();
        }
        Instruction::AtomicExchange { result, address, value, ordering } => {
            print!("{} = atomic.exchange ", result);
            print_value(address);
            print!(", ");
            print_value(value);
            print!(", ordering={:?}", ordering);
            println!();
        }
        Instruction::AtomicCompareExchange { result, address, expected, desired, success_ordering, failure_ordering } => {
            print!("{} = atomic.cmpxchg ", result);
            print_value(address);
            print!(", ");
            print_value(expected);
            print!(", ");
            print_value(desired);
            print!(", success_ordering={:?}, failure_ordering={:?}", success_ordering, failure_ordering);
            println!();
        }
        Instruction::AtomicFetchAdd { result, address, value, ordering } => {
            print!("{} = atomic.fetch_add ", result);
            print_value(address);
            print!(", ");
            print_value(value);
            print!(", ordering={:?}", ordering);
            println!();
        }
        Instruction::AtomicFetchSub { result, address, value, ordering } => {
            print!("{} = atomic.fetch_sub ", result);
            print_value(address);
            print!(", ");
            print_value(value);
            print!(", ordering={:?}", ordering);
            println!();
        }
        _ => println!("; Instruction not implemented"),
    }
}

/// Print a terminator
fn print_terminator(terminator: &Terminator) {
    match terminator {
        Terminator::Return { value } => {
            print!("ret ");
            if let Some(val) = value {
                print_value(val);
            } else {
                print!("void");
            }
            println!();
        }
        _ => println!("; Terminator not implemented"),
    }
}

/// Print a value
fn print_value(value: &Value) {
    print!("{}", print_value_str(value));
}

/// Convert a value to string
fn print_value_str(value: &Value) -> String {
    match value {
        Value::Constant(Constant::Int(i)) => i.to_string(),
        Value::Constant(Constant::Float(f)) => f.to_string(),
        Value::Constant(Constant::Bool(b)) => b.to_string(),
        Value::Constant(Constant::String(s)) => format!("\"{}\"", s),
        Value::Variable(name) => format!("%{}", name),
        Value::InstructionRef(_) => "%<instruction>".to_string(),
        Value::MutexValue => "%mutex".to_string(),
        Value::ConditionValue => "%condition".to_string(),
    }
}

/// Print a type
fn print_type(ty: &Type) -> String {
    match ty {
        Type::Int => "i64".to_string(),
        Type::Float => "f64".to_string(),
        Type::Bool => "i1".to_string(),
        Type::String => "ptr".to_string(),
        Type::Void => "void".to_string(),
        Type::Reference { inner_type } => format!("ref<{}>", print_type(inner_type)),
        Type::Pointer { inner_type } => format!("ptr<{}>", print_type(inner_type)),
        Type::Optional { inner_type } => format!("opt<{}>", print_type(inner_type)),
        Type::Range => "range".to_string(),
        Type::Async { inner_type } => format!("async<{}>", print_type(inner_type)),
        Type::Mutex => "mutex".to_string(),
        Type::Condition => "condition".to_string(),
        _ => "<type>".to_string(),
    }
}
