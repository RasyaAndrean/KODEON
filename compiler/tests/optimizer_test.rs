//! Test for optimization passes

use kodeon_compiler::optimizer::{Optimizer, ConstantFolding, DeadCodeElimination};
use kodeon_compiler::ir::{IRModule, Function, BasicBlock, Instruction, Value, Constant, BinaryOperator};

#[test]
fn test_optimizer_creation() {
    let optimizer = Optimizer::new();
    // The optimizer should be created successfully
    assert!(true);
}

#[test]
fn test_constant_folding_creation() {
    let folding = ConstantFolding;
    // The constant folding pass should be created successfully
    assert!(true);
}

#[test]
fn test_dead_code_elimination_creation() {
    let dce = DeadCodeElimination;
    // The dead code elimination pass should be created successfully
    assert!(true);
}

#[test]
fn test_constant_folding_int_addition() {
    let folding = ConstantFolding;

    let instruction = Instruction::BinaryOp {
        result: "result".to_string(),
        op: BinaryOperator::Add,
        left: Value::Constant(Constant::Int(2)),
        right: Value::Constant(Constant::Int(3)),
        debug_info: None,
    };

    let folded = folding.try_fold_instruction(&instruction);
    assert!(folded.is_some());

    if let Some(Value::Constant(Constant::Int(val))) = folded {
        assert_eq!(val, 5);
    } else {
        panic!("Expected integer constant");
    }
}

#[test]
fn test_constant_folding_float_multiplication() {
    let folding = ConstantFolding;

    let instruction = Instruction::BinaryOp {
        result: "result".to_string(),
        op: BinaryOperator::Mul,
        left: Value::Constant(Constant::Float(2.5)),
        right: Value::Constant(Constant::Float(4.0)),
        debug_info: None,
    };

    let folded = folding.try_fold_instruction(&instruction);
    assert!(folded.is_some());

    if let Some(Value::Constant(Constant::Float(val))) = folded {
        assert_eq!(val, 10.0);
    } else {
        panic!("Expected float constant");
    }
}

#[test]
fn test_constant_folding_boolean_and() {
    let folding = ConstantFolding;

    let instruction = Instruction::BinaryOp {
        result: "result".to_string(),
        op: BinaryOperator::And,
        left: Value::Constant(Constant::Bool(true)),
        right: Value::Constant(Constant::Bool(false)),
        debug_info: None,
    };

    let folded = folding.try_fold_instruction(&instruction);
    assert!(folded.is_some());

    if let Some(Value::Constant(Constant::Bool(val))) = folded {
        assert_eq!(val, false);
    } else {
        panic!("Expected boolean constant");
    }
}

#[test]
fn test_constant_folding_unary_not() {
    let folding = ConstantFolding;

    let instruction = Instruction::UnaryOp {
        result: "result".to_string(),
        op: kodeon_compiler::ir::UnaryOperator::Not,
        operand: Value::Constant(Constant::Bool(true)),
        debug_info: None,
    };

    let folded = folding.try_fold_instruction(&instruction);
    assert!(folded.is_some());

    if let Some(Value::Constant(Constant::Bool(val))) = folded {
        assert_eq!(val, false);
    } else {
        panic!("Expected boolean constant");
    }
}
