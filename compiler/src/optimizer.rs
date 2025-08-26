//! Optimizer for the KODEON programming language
//! Implements various optimization passes for the IR

use crate::ir::{IRModule, Instruction, Value, Constant, BinaryOperator, UnaryOperator};

/// Optimization pass trait
pub trait OptimizationPass {
    /// Run the optimization pass on an IR module
    fn run(&self, module: &mut IRModule) -> Result<(), String>;

    /// Get the name of the optimization pass
    fn name(&self) -> &str;
}

/// Constant folding optimization pass
/// Evaluates constant expressions at compile time
pub struct ConstantFolding;

impl OptimizationPass for ConstantFolding {
    fn run(&self, module: &mut IRModule) -> Result<(), String> {
        for function in &mut module.functions {
            for block in &mut function.blocks {
                let mut i = 0;
                while i < block.instructions.len() {
                    if let Some(folded_value) = self.try_fold_instruction(&block.instructions[i]) {
                        // Replace the instruction with a constant
                        block.instructions[i] = Instruction::Load {
                            result: match &block.instructions[i] {
                                Instruction::BinaryOp { result, .. } => result.clone(),
                                Instruction::UnaryOp { result, .. } => result.clone(),
                                _ => "folded".to_string(),
                            },
                            variable: match folded_value {
                                Value::Constant(Constant::Int(val)) => format!("int_const_{}", val),
                                Value::Constant(Constant::Float(val)) => format!("float_const_{}", val),
                                Value::Constant(Constant::Bool(val)) => format!("bool_const_{}", val),
                                Value::Constant(Constant::String(ref val)) => format!("string_const_{}", val),
                                _ => "const".to_string(),
                            },
                            debug_info: None,
                        };
                    }
                    i += 1;
                }
            }
        }
        Ok(())
    }

    fn name(&self) -> &str {
        "Constant Folding"
    }
}

impl ConstantFolding {
    /// Try to fold an instruction into a constant value
    fn try_fold_instruction(&self, instruction: &Instruction) -> Option<Value> {
        match instruction {
            Instruction::BinaryOp { op, left, right, .. } => {
                if let (Value::Constant(left_const), Value::Constant(right_const)) = (left, right) {
                    match (left_const, right_const, op) {
                        // Integer operations
                        (Constant::Int(left_val), Constant::Int(right_val), BinaryOperator::Add) => {
                            Some(Value::Constant(Constant::Int(left_val + right_val)))
                        }
                        (Constant::Int(left_val), Constant::Int(right_val), BinaryOperator::Sub) => {
                            Some(Value::Constant(Constant::Int(left_val - right_val)))
                        }
                        (Constant::Int(left_val), Constant::Int(right_val), BinaryOperator::Mul) => {
                            Some(Value::Constant(Constant::Int(left_val * right_val)))
                        }
                        (Constant::Int(left_val), Constant::Int(right_val), BinaryOperator::Div) => {
                            if *right_val != 0 {
                                Some(Value::Constant(Constant::Int(left_val / right_val)))
                            } else {
                                None
                            }
                        }
                        // Float operations
                        (Constant::Float(left_val), Constant::Float(right_val), BinaryOperator::Add) => {
                            Some(Value::Constant(Constant::Float(left_val + right_val)))
                        }
                        (Constant::Float(left_val), Constant::Float(right_val), BinaryOperator::Sub) => {
                            Some(Value::Constant(Constant::Float(left_val - right_val)))
                        }
                        (Constant::Float(left_val), Constant::Float(right_val), BinaryOperator::Mul) => {
                            Some(Value::Constant(Constant::Float(left_val * right_val)))
                        }
                        (Constant::Float(left_val), Constant::Float(right_val), BinaryOperator::Div) => {
                            if *right_val != 0.0 {
                                Some(Value::Constant(Constant::Float(left_val / right_val)))
                            } else {
                                None
                            }
                        }
                        // Boolean operations
                        (Constant::Bool(left_val), Constant::Bool(right_val), BinaryOperator::And) => {
                            Some(Value::Constant(Constant::Bool(*left_val && *right_val)))
                        }
                        (Constant::Bool(left_val), Constant::Bool(right_val), BinaryOperator::Or) => {
                            Some(Value::Constant(Constant::Bool(*left_val || *right_val)))
                        }
                        _ => None,
                    }
                } else {
                    None
                }
            }
            Instruction::UnaryOp { op, operand, .. } => {
                if let Value::Constant(const_val) = operand {
                    match (const_val, op) {
                        (Constant::Bool(val), UnaryOperator::Not) => {
                            Some(Value::Constant(Constant::Bool(!val)))
                        }
                        (Constant::Int(val), UnaryOperator::Neg) => {
                            Some(Value::Constant(Constant::Int(-val)))
                        }
                        (Constant::Float(val), UnaryOperator::Neg) => {
                            Some(Value::Constant(Constant::Float(-val)))
                        }
                        _ => None,
                    }
                } else {
                    None
                }
            }
            _ => None,
        }
    }
}

/// Dead code elimination optimization pass
/// Removes unused instructions and values
pub struct DeadCodeElimination;

impl OptimizationPass for DeadCodeElimination {
    fn run(&self, module: &mut IRModule) -> Result<(), String> {
        // This is a simplified implementation
        // In a real compiler, this would track which values are actually used
        for function in &mut module.functions {
            for block in &mut function.blocks {
                // Remove unused instructions (simplified)
                block.instructions.retain(|instruction| {
                    match instruction {
                        // Keep instructions that have side effects
                        Instruction::Store { .. } => true,
                        Instruction::Call { .. } => true,
                        Instruction::Return { .. } => true,
                        // Remove unused computations
                        _ => true, // For now, keep all instructions
                    }
                });
            }
        }
        Ok(())
    }

    fn name(&self) -> &str {
        "Dead Code Elimination"
    }
}

/// Optimizer that runs multiple optimization passes
pub struct Optimizer {
    passes: Vec<Box<dyn OptimizationPass>>,
}

impl Optimizer {
    /// Create a new optimizer
    pub fn new() -> Self {
        Optimizer {
            passes: vec![
                Box::new(ConstantFolding),
                Box::new(DeadCodeElimination),
            ],
        }
    }

    /// Add an optimization pass
    pub fn add_pass(&mut self, pass: Box<dyn OptimizationPass>) {
        self.passes.push(pass);
    }

    /// Run all optimization passes on an IR module
    pub fn optimize(&self, module: &mut IRModule) -> Result<(), String> {
        for pass in &self.passes {
            println!("Running optimization pass: {}", pass.name());
            pass.run(module)?;
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ir::{Function, BasicBlock, Parameter, Type, Terminator};

    #[test]
    fn test_constant_folding() {
        let mut module = IRModule {
            functions: vec![],
            global_vars: vec![],
            debug_info: None,
        };

        let optimizer = Optimizer::new();
        assert!(optimizer.optimize(&mut module).is_ok());
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
}
