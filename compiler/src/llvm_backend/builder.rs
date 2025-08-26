//! LLVM IR builder for the KODEON programming language

use crate::ir::{BinaryOp, Instruction, Terminator, Type, Value};
use crate::llvm_backend::context::LLVMContext;
use inkwell::builder::Builder;
use inkwell::types::BasicTypeEnum;
use inkwell::values::{BasicValueEnum, FunctionValue, PointerValue};
use std::collections::HashMap;

/// LLVM IR builder for KODEON
pub struct LLVMBuilder<'ctx> {
    context: &'ctx LLVMContext,
    builder: Builder<'ctx>,
    variables: HashMap<String, PointerValue<'ctx>>,
    functions: HashMap<String, FunctionValue<'ctx>>,
}

impl<'ctx> LLVMBuilder<'ctx> {
    /// Create a new LLVM builder
    pub fn new(context: &'ctx LLVMContext) -> Self {
        let llvm_context = context.get_context();
        let builder = llvm_context.create_builder();

        LLVMBuilder {
            context,
            builder,
            variables: HashMap::new(),
            functions: HashMap::new(),
        }
    }

    /// Build a function
    pub fn build_function(
        &mut self,
        name: &str,
        return_type: &Type,
        param_types: &[Type],
    ) -> Result<FunctionValue<'ctx>, String> {
        let llvm_context = self.context.get_context();
        let module = self.context.get_module();

        // Convert return type
        let llvm_return_type = self.convert_type(return_type)?;

        // Convert parameter types
        let llvm_param_types: Vec<BasicTypeEnum> = param_types
            .iter()
            .map(|ty| self.convert_type(ty))
            .collect::<Result<Vec<_>, _>>()?;

        // Create function type
        let fn_type = if *return_type == Type::Void {
            llvm_context.void_type().fn_type(&llvm_param_types, false)
        } else {
            llvm_return_type.fn_type(&llvm_param_types, false)
        };

        // Create function
        let function = module.add_function(name, fn_type, None);
        self.functions.insert(name.to_string(), function);

        Ok(function)
    }

    /// Build an instruction
    pub fn build_instruction(&mut self, instruction: &Instruction) -> Result<(), String> {
        match instruction {
            Instruction::BinaryOp { result, op, left, right } => {
                self.build_binary_op(result, op, left, right)
            }
            Instruction::Store { variable, value } => {
                self.build_store(variable, value)
            }
            Instruction::Alloca { result, alloca_type } => {
                self.build_alloca(result, alloca_type)
            }
            Instruction::Call { result, function, arguments } => {
                self.build_call(result, function, arguments)
            }
            Instruction::MakeChannel { result, channel_type } => {
                self.build_make_channel(result, channel_type)
            }
            Instruction::ChannelSend { channel, value } => {
                self.build_channel_send(channel, value)
            }
            Instruction::ChannelReceive { result, channel } => {
                self.build_channel_receive(result, channel)
            }
            Instruction::GoRoutine { function, arguments } => {
                self.build_goroutine(function, arguments)
            }
            Instruction::NullCheck { result, value } => {
                self.build_null_check(result, value)
            }
            Instruction::Elvis { result, value, default } => {
                self.build_elvis(result, value, default)
            }
            _ => Err(format!("Unsupported instruction: {:?}", instruction))
        }
    }

    /// Build a binary operation
    fn build_binary_op(
        &mut self,
        result: &str,
        op: &BinaryOp,
        left: &Value,
        right: &Value,
    ) -> Result<(), String> {
        let llvm_context = self.context.get_context();

        let left_val = self.convert_value(left)?;
        let right_val = self.convert_value(right)?;

        let llvm_value = match op {
            BinaryOp::Add => {
                self.builder.build_int_add(
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Sub => {
                self.builder.build_int_sub(
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Mul => {
                self.builder.build_int_mul(
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Div => {
                self.builder.build_int_signed_div(
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Mod => {
                self.builder.build_int_signed_rem(
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Eq => {
                self.builder.build_int_compare(
                    inkwell::IntPredicate::EQ,
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Ne => {
                self.builder.build_int_compare(
                    inkwell::IntPredicate::NE,
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Lt => {
                self.builder.build_int_compare(
                    inkwell::IntPredicate::SLT,
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Gt => {
                self.builder.build_int_compare(
                    inkwell::IntPredicate::SGT,
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Le => {
                self.builder.build_int_compare(
                    inkwell::IntPredicate::SLE,
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            BinaryOp::Ge => {
                self.builder.build_int_compare(
                    inkwell::IntPredicate::SGE,
                    left_val.into_int_value(),
                    right_val.into_int_value(),
                    result,
                )
            }
            _ => return Err(format!("Unsupported binary operation: {:?}", op)),
        };

        // Store the result in our variable map
        let ptr = self.builder.build_alloca(llvm_value.get_type(), result);
        self.builder.build_store(ptr, llvm_value);
        self.variables.insert(result.to_string(), ptr);

        Ok(())
    }

    /// Build a store instruction
    fn build_store(&mut self, variable: &str, value: &Value) -> Result<(), String> {
        let llvm_value = self.convert_value(value)?;
        if let Some(ptr) = self.variables.get(variable) {
            self.builder.build_store(*ptr, llvm_value);
            Ok(())
        } else {
            Err(format!("Variable {} not found", variable))
        }
    }

    /// Build an alloca instruction
    fn build_alloca(&mut self, result: &str, alloca_type: &Type) -> Result<(), String> {
        let llvm_type = self.convert_type(alloca_type)?;
        let ptr = self.builder.build_alloca(llvm_type, result);
        self.variables.insert(result.to_string(), ptr);
        Ok(())
    }

    /// Build a call instruction
    fn build_call(
        &mut self,
        result: &Option<String>,
        function_name: &str,
        arguments: &[Value],
    ) -> Result<(), String> {
        let llvm_function = self.functions.get(function_name)
            .ok_or_else(|| format!("Function {} not found", function_name))?;

        let llvm_args: Vec<BasicValueEnum> = arguments
            .iter()
            .map(|arg| self.convert_value(arg))
            .collect::<Result<Vec<_>, _>>()?;

        let call_result = self.builder.build_call(*llvm_function, &llvm_args,
            result.as_deref().unwrap_or("calltmp"))
            .try_as_basic_value()
            .left();

        if let (Some(res), Some(result_name)) = (call_result, result) {
            let ptr = self.builder.build_alloca(res.get_type(), result_name);
            self.builder.build_store(ptr, res);
            self.variables.insert(result_name.clone(), ptr);
        }

        Ok(())
    }

    /// Build a make channel instruction
    fn build_make_channel(&mut self, result: &str, channel_type: &Type) -> Result<(), String> {
        let llvm_context = self.context.get_context();
        let module = self.context.get_module();

        // Create a channel struct type
        let element_llvm_type = self.convert_type(channel_type)?;
        let buffer_type = element_llvm_type.ptr_type(Default::default());
        let size_type = llvm_context.i32_type();
        let count_type = llvm_context.i32_type();
        let mutex_type = llvm_context.i32_type();

        let channel_struct_type = llvm_context.struct_type(
            &[buffer_type.into(), size_type.into(), count_type.into(), mutex_type.into()],
            false
        );

        // Create runtime function for channel creation
        let channel_create_type = channel_struct_type.fn_type(&[element_llvm_type], false);
        let channel_create_func = module.add_function("channel_create", channel_create_type, None);

        // For now, we'll just create an alloca for the channel
        let ptr = self.builder.build_alloca(channel_struct_type, result);
        self.variables.insert(result.to_string(), ptr);

        Ok(())
    }

    /// Build a channel send instruction
    fn build_channel_send(&mut self, channel: &Value, value: &Value) -> Result<(), String> {
        let llvm_context = self.context.get_context();
        let module = self.context.get_module();

        let channel_val = self.convert_value(channel)?;
        let value_val = self.convert_value(value)?;

        // Create runtime function for channel send
        let send_func_type = llvm_context.void_type().fn_type(
            &[channel_val.get_type().into(), value_val.get_type().into()],
            false
        );
        let send_func = module.add_function("channel_send", send_func_type, None);

        self.builder.build_call(send_func, &[channel_val, value_val], "send_result");

        Ok(())
    }

    /// Build a channel receive instruction
    fn build_channel_receive(&mut self, result: &str, channel: &Value) -> Result<(), String> {
        let llvm_context = self.context.get_context();
        let module = self.context.get_module();

        let channel_val = self.convert_value(channel)?;

        // For now, we'll just create a placeholder result
        let result_type = llvm_context.i64_type();
        let ptr = self.builder.build_alloca(result_type, result);
        self.variables.insert(result.to_string(), ptr);

        Ok(())
    }

    /// Build a goroutine instruction
    fn build_goroutine(&mut self, function: &Value, arguments: &[Value]) -> Result<(), String> {
        let llvm_context = self.context.get_context();
        let module = self.context.get_module();

        let func_val = self.convert_value(function)?;
        let arg_vals: Vec<BasicValueEnum> = arguments
            .iter()
            .map(|arg| self.convert_value(arg))
            .collect::<Result<Vec<_>, _>>()?;

        // Create runtime function for goroutine creation
        let mut param_types = vec![func_val.get_type().into()];
        param_types.extend(arg_vals.iter().map(|v| v.get_type().into()));

        let go_func_type = llvm_context.void_type().fn_type(&param_types, false);
        let go_func = module.add_function("go_routine", go_func_type, None);

        let mut args = vec![func_val];
        args.extend(arg_vals);

        self.builder.build_call(go_func, &args, "goroutine_result");

        Ok(())
    }

    /// Build a null check instruction
    fn build_null_check(&mut self, result: &str, value: &Value) -> Result<(), String> {
        let llvm_context = self.context.get_context();

        let value_val = self.convert_value(value)?;

        // For pointer types, check if null
        let is_null = if value_val.is_pointer_value() {
            self.builder.build_is_null(value_val.into_pointer_value(), "is_null")
        } else {
            // For other types, assume not null
            llvm_context.bool_type().const_int(0, false)
        };

        let ptr = self.builder.build_alloca(llvm_context.bool_type(), result);
        self.builder.build_store(ptr, is_null);
        self.variables.insert(result.to_string(), ptr);

        Ok(())
    }

    /// Build an elvis operator instruction
    fn build_elvis(&mut self, result: &str, value: &Value, default: &Value) -> Result<(), String> {
        let value_val = self.convert_value(value)?;
        let default_val = self.convert_value(default)?;

        // For now, we'll just use the default value as a placeholder
        let ptr = self.builder.build_alloca(default_val.get_type(), result);
        self.builder.build_store(ptr, default_val);
        self.variables.insert(result.to_string(), ptr);

        Ok(())
    }

    /// Build a terminator
    pub fn build_terminator(&mut self, terminator: &Terminator) -> Result<(), String> {
        match terminator {
            Terminator::Return { value } => {
                if let Some(val) = value {
                    let llvm_value = self.convert_value(val)?;
                    self.builder.build_return(Some(&llvm_value));
                } else {
                    self.builder.build_return(None);
                }
                Ok(())
            }
            _ => Err(format!("Unsupported terminator: {:?}", terminator))
        }
    }

    /// Convert an IR type to LLVM type
    fn convert_type(&self, ty: &Type) -> Result<BasicTypeEnum<'ctx>, String> {
        let llvm_context = self.context.get_context();

        match ty {
            Type::Int => Ok(llvm_context.i64_type().into()),
            Type::Float => Ok(llvm_context.f64_type().into()),
            Type::Bool => Ok(llvm_context.bool_type().into()),
            Type::String => Ok(llvm_context.i8_type().ptr_type(Default::default()).into()),
            Type::Void => Err("Void type cannot be converted to BasicTypeEnum".to_string()),
            Type::Channel { element_type } => {
                // Channels are represented as structs with internal state
                let elem_llvm_type = self.convert_type(element_type)?;
                let buffer_type = elem_llvm_type.ptr_type(Default::default());
                let size_type = llvm_context.i32_type();
                let count_type = llvm_context.i32_type();
                let mutex_type = llvm_context.i32_type();

                Ok(llvm_context.struct_type(
                    &[buffer_type.into(), size_type.into(), count_type.into(), mutex_type.into()],
                    false
                ).into())
            }
            Type::Goroutine => {
                // Goroutines are represented as pointers to execution context
                Ok(llvm_context.i8_type().ptr_type(Default::default()).into())
            }
            Type::Nullable { inner_type } => {
                // Nullable types are represented as optionals
                let inner_llvm_type = self.convert_type(inner_type)?;
                let flag_type = llvm_context.bool_type();
                Ok(llvm_context.struct_type(&[flag_type.into(), inner_llvm_type], false).into())
            }
            _ => Err(format!("Unsupported type: {:?}", ty)),
        }
    }

    /// Convert an IR value to LLVM value
    fn convert_value(&self, value: &Value) -> Result<BasicValueEnum<'ctx>, String> {
        let llvm_context = self.context.get_context();

        match value {
            Value::Constant(constant) => match constant {
                crate::ir::Constant::Int(i) => {
                    Ok(llvm_context.i64_type().const_int(*i as u64, false).into())
                }
                crate::ir::Constant::Float(f) => {
                    Ok(llvm_context.f64_type().const_float(*f).into())
                }
                crate::ir::Constant::Bool(b) => {
                    Ok(llvm_context.bool_type().const_int(*b as u64, false).into())
                }
                crate::ir::Constant::String(s) => {
                    let module = self.context.get_module();
                    let ptr = self.builder.build_global_string_ptr(s, "str");
                    Ok(ptr.as_basic_value_enum())
                }
                crate::ir::Constant::Null => {
                    // Null is represented as a null pointer
                    Ok(llvm_context.i8_type().ptr_type(Default::default()).const_null().as_basic_value_enum())
                }
            },
            Value::Variable(name) => {
                if let Some(ptr) = self.variables.get(name) {
                    let value = self.builder.build_load(*ptr, name);
                    Ok(value)
                } else {
                    Err(format!("Variable {} not found", name))
                }
            }
            Value::InstructionRef(_) => {
                Err("InstructionRef not supported in this context".to_string())
            }
            Value::ChannelValue { element_type } => {
                // For channel values, we return a pointer to a channel struct
                let channel_type = self.convert_type(element_type)?;
                let buffer_type = channel_type.ptr_type(Default::default());
                let size_type = llvm_context.i32_type();
                let count_type = llvm_context.i32_type();
                let mutex_type = llvm_context.i32_type();

                let channel_struct_type = llvm_context.struct_type(
                    &[buffer_type.into(), size_type.into(), count_type.into(), mutex_type.into()],
                    false
                );

                let ptr = self.builder.build_alloca(channel_struct_type, "channel_val");
                Ok(self.builder.build_load(ptr, "channel_loaded"))
            }
            Value::GoroutineValue { function: _ } => {
                // For goroutine values, we return a pointer to execution context
                Ok(llvm_context.i8_type().ptr_type(Default::default()).const_null().as_basic_value_enum())
            }
            Value::NullableValue { value } => {
                // For nullable values, we create an optional struct
                let optional_type = llvm_context.struct_type(
                    &[llvm_context.bool_type().into(), llvm_context.i64_type().into()],
                    false
                );

                let optional_struct = self.builder.build_alloca(optional_type, "optional_val");

                if let Some(inner_value) = value {
                    // Value is present
                    self.builder.build_store(
                        self.builder.build_struct_gep(optional_struct, 0, "optional_flag_ptr")?,
                        llvm_context.bool_type().const_int(1, false)
                    );

                    let inner_val = self.convert_value(inner_value)?;
                    self.builder.build_store(
                        self.builder.build_struct_gep(optional_struct, 1, "optional_value_ptr")?,
                        inner_val
                    );
                } else {
                    // Value is null
                    self.builder.build_store(
                        self.builder.build_struct_gep(optional_struct, 0, "optional_flag_ptr")?,
                        llvm_context.bool_type().const_int(0, false)
                    );

                    self.builder.build_store(
                        self.builder.build_struct_gep(optional_struct, 1, "optional_value_ptr")?,
                        llvm_context.i64_type().const_zero()
                    );
                }

                let loaded_optional = self.builder.build_load(optional_struct, "optional_loaded");
                Ok(loaded_optional)
            }
        }
    }
}
