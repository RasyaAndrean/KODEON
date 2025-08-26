//! Test for the enhanced LLVM backend with extended language features

use inkwell::context::Context;
use kodeon_compiler::ir::{IRBuilder, Type, Value, Constant};
use kodeon_compiler::llvm_backend::{LLVMBackend, LLVMBuilder};
use kodeon_compiler::llvm_backend::context::LLVMContext;

#[test]
fn test_enhanced_llvm_backend() {
    let context = Context::create();
    let mut llvm_backend = LLVMBackend::new(&context, "test_module");

    // Create a simple IR module with enhanced features
    let mut builder = IRBuilder::new();

    // Create a function that uses some enhanced features
    let func_index = builder.create_function(
        "test_function".to_string(),
        vec![],
        Type::Int,
    );

    // Create entry block
    builder.create_block("entry".to_string()).unwrap();

    // Test creating a channel
    let channel_result = builder.add_make_channel(Type::Int).unwrap();

    // Test null check
    let null_value = Value::Constant(Constant::Null);
    let null_check_result = builder.add_null_check(null_value).unwrap();

    // Test elvis operator
    let default_value = Value::Constant(Constant::Int(42));
    let elvis_result = builder.add_elvis(null_value, default_value).unwrap();

    // Set terminator
    builder.set_terminator(kodeon_compiler::ir::Terminator::Return {
        value: Some(Value::Variable(elvis_result)),
    }).unwrap();

    // Get the module
    let ir_module = builder.get_module().clone();

    // Compile with LLVM backend
    let result = llvm_backend.compile_ir(&ir_module);

    // Should compile successfully
    assert!(result.is_ok());

    // Print the LLVM IR for inspection
    llvm_backend.print_ir();

    println!("Enhanced LLVM backend test passed!");
}

#[test]
fn test_llvm_builder_enhanced() {
    // Test the LLVMBuilder directly
    let llvm_context = LLVMContext::new("test_builder_module");
    let mut llvm_builder = LLVMBuilder::new(&llvm_context);

    // Test building a function with channel parameter
    let func_result = llvm_builder.build_function(
        "channel_func",
        &Type::Void,
        &[Type::Channel { element_type: Box::new(Type::Int) }]
    );

    // Should build successfully
    assert!(func_result.is_ok());

    // Test building a null check instruction
    let null_value = Value::Constant(Constant::Null);
    let null_check_instruction = kodeon_compiler::ir::Instruction::NullCheck {
        result: "is_null".to_string(),
        value: null_value,
    };

    let instruction_result = llvm_builder.build_instruction(&null_check_instruction);
    assert!(instruction_result.is_ok());

    // Test building an elvis operator instruction
    let elvis_instruction = kodeon_compiler::ir::Instruction::Elvis {
        result: "result_val".to_string(),
        value: Value::Constant(Constant::Null),
        default: Value::Constant(Constant::Int(100)),
    };

    let elvis_result = llvm_builder.build_instruction(&elvis_instruction);
    assert!(elvis_result.is_ok());

    println!("LLVM builder enhanced test passed!");
}
