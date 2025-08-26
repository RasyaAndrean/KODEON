//! Test for the enhanced LLVM backend with extended language features

use inkwell::context::Context;
use kodeon_compiler::ir::{IRBuilder, Type, Value, Constant};
use kodeon_compiler::llvm_backend::LLVMBackend;

#[test]
fn test_extended_llvm_backend() {
    let context = Context::create();
    let mut llvm_backend = LLVMBackend::new(&context, "test_module");

    // Create a simple IR module with extended features
    let mut builder = IRBuilder::new();

    // Create a function that uses some extended features
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

    println!("Extended LLVM backend test passed!");
}
