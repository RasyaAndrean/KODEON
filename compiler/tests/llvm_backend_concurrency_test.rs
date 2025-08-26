//! Unit tests for the LLVM backend concurrency features

use kodeon_compiler::ir::*;
use kodeon_compiler::llvm_backend::LLVMBackend;
use inkwell::context::Context;

#[test]
fn test_mutex_instructions() {
    let context = Context::create();
    let mut backend = LLVMBackend::new(&context, "test_mutex");

    // Create a simple IR module with mutex operations
    let mut module = IRModule {
        functions: vec![],
        global_vars: vec![],
    };

    // Create a function with mutex operations
    let function = Function {
        name: "test_mutex".to_string(),
        parameters: vec![],
        return_type: Type::Void,
        blocks: vec![
            BasicBlock {
                name: "entry".to_string(),
                instructions: vec![
                    Instruction::MutexLock {
                        mutex: Value::Variable("mutex".to_string()),
                    },
                    Instruction::MutexUnlock {
                        mutex: Value::Variable("mutex".to_string()),
                    },
                ],
                terminator: Terminator::Return { value: None },
            }
        ],
    };

    module.functions.push(function);

    // Compile the module
    let result = backend.compile_ir(&module);
    assert!(result.is_ok(), "Failed to compile mutex instructions: {:?}", result.err());
}

#[test]
fn test_condition_variable_instructions() {
    let context = Context::create();
    let mut backend = LLVMBackend::new(&context, "test_condition");

    // Create a simple IR module with condition variable operations
    let mut module = IRModule {
        functions: vec![],
        global_vars: vec![],
    };

    // Create a function with condition variable operations
    let function = Function {
        name: "test_condition".to_string(),
        parameters: vec![],
        return_type: Type::Void,
        blocks: vec![
            BasicBlock {
                name: "entry".to_string(),
                instructions: vec![
                    Instruction::ConditionWait {
                        condition: Value::Variable("condition".to_string()),
                        mutex: Value::Variable("mutex".to_string()),
                    },
                    Instruction::ConditionSignal {
                        condition: Value::Variable("condition".to_string()),
                    },
                    Instruction::ConditionBroadcast {
                        condition: Value::Variable("condition".to_string()),
                    },
                ],
                terminator: Terminator::Return { value: None },
            }
        ],
    };

    module.functions.push(function);

    // Compile the module
    let result = backend.compile_ir(&module);
    assert!(result.is_ok(), "Failed to compile condition variable instructions: {:?}", result.err());
}

#[test]
fn test_atomic_instructions() {
    let context = Context::create();
    let mut backend = LLVMBackend::new(&context, "test_atomic");

    // Create a simple IR module with atomic operations
    let mut module = IRModule {
        functions: vec![],
        global_vars: vec![],
    };

    // Create a function with atomic operations
    let function = Function {
        name: "test_atomic".to_string(),
        parameters: vec![],
        return_type: Type::Void,
        blocks: vec![
            BasicBlock {
                name: "entry".to_string(),
                instructions: vec![
                    Instruction::AtomicLoad {
                        result: "value".to_string(),
                        address: Value::Variable("address".to_string()),
                        ordering: AtomicOrdering::SeqCst,
                    },
                    Instruction::AtomicStore {
                        address: Value::Variable("address".to_string()),
                        value: Value::Constant(Constant::Int(42)),
                        ordering: AtomicOrdering::SeqCst,
                    },
                    Instruction::AtomicExchange {
                        result: "old_value".to_string(),
                        address: Value::Variable("address".to_string()),
                        value: Value::Constant(Constant::Int(100)),
                        ordering: AtomicOrdering::SeqCst,
                    },
                ],
                terminator: Terminator::Return { value: None },
            }
        ],
    };

    module.functions.push(function);

    // Compile the module
    let result = backend.compile_ir(&module);
    assert!(result.is_ok(), "Failed to compile atomic instructions: {:?}", result.err());
}

#[test]
fn test_complex_concurrency_scenario() {
    let context = Context::create();
    let mut backend = LLVMBackend::new(&context, "test_complex");

    // Create a more complex IR module with multiple concurrency features
    let mut module = IRModule {
        functions: vec![],
        global_vars: vec![],
    };

    // Create a function with multiple concurrency operations
    let function = Function {
        name: "complex_concurrency".to_string(),
        parameters: vec![],
        return_type: Type::Void,
        blocks: vec![
            BasicBlock {
                name: "entry".to_string(),
                instructions: vec![
                    // Mutex operations
                    Instruction::MutexLock {
                        mutex: Value::Variable("mutex".to_string()),
                    },
                    // Atomic operations
                    Instruction::AtomicStore {
                        address: Value::Variable("shared_data".to_string()),
                        value: Value::Constant(Constant::Int(42)),
                        ordering: AtomicOrdering::SeqCst,
                    },
                    // Condition variable operations
                    Instruction::ConditionSignal {
                        condition: Value::Variable("condition".to_string()),
                    },
                    // Unlock mutex
                    Instruction::MutexUnlock {
                        mutex: Value::Variable("mutex".to_string()),
                    },
                ],
                terminator: Terminator::Return { value: None },
            }
        ],
    };

    module.functions.push(function);

    // Compile the module
    let result = backend.compile_ir(&module);
    assert!(result.is_ok(), "Failed to compile complex concurrency scenario: {:?}", result.err());
}
