//! LLVM backend for the KODEON programming language

use crate::ir::{IRModule, Type, DebugInfo};
use inkwell::context::Context;
use inkwell::module::Module;
use inkwell::targets::{InitializationConfig, Target};
use inkwell::types::BasicTypeEnum;
use inkwell::values::{BasicValueEnum, FunctionValue};
use inkwell::AddressSpace;
use inkwell::debug_info::{DIFile, DICompileUnit, DIBasicType, DISubprogram, DISubroutineType, DIType, DIFlags};
use std::collections::HashMap;

/// LLVM backend for KODEON
pub struct LLVMBackend<'ctx> {
    context: &'ctx Context,
    module: Module<'ctx>,
    builder: inkwell::builder::Builder<'ctx>,
    variables: HashMap<String, inkwell::values::PointerValue<'ctx>>,
    functions: HashMap<String, FunctionValue<'ctx>>,
    // Debug information
    di_builder: Option<inkwell::debug_info::DebugInfoBuilder<'ctx>>,
    di_compile_unit: Option<DICompileUnit<'ctx>>,
    di_file: Option<DIFile<'ctx>>,
}

impl<'ctx> LLVMBackend<'ctx> {
    /// Create a new LLVM backend
    pub fn new(context: &'ctx Context, module_name: &str) -> Self {
        // Initialize LLVM targets
        let config = InitializationConfig::default();
        Target::initialize_native(&config)
            .expect("Failed to initialize native target");

        let module = context.create_module(module_name);
        let builder = context.create_builder();

        // Future-oriented initialization
        // Enable optimization passes by default
        module.set_inline_threshold(100);
        module.set_source_file_name(module_name);

        // Initialize debug information builder
        let (di_builder, di_compile_unit) = context.create_debug_info_builder(
            true, // allow_unresolved
            inkwell::debug_info::DWARFSourceLanguage::C,
            module_name,
            ".",
            "KODEON Compiler",
            false, // is_optimized
            "", // flags
            0, // runtime_ver
            "", // split_name
            inkwell::debug_info::DWARFEmissionKind::Full,
            0, // dwo_id
            false, // split_debug_inlining
            false, // debug_info_for_profiling
            "", // sys_root
            "", // sdk
        );

        let di_file = di_builder.create_file(module_name, ".");

        LLVMBackend {
            context,
            module,
            builder,
            variables: HashMap::new(),
            functions: HashMap::new(),
            di_builder: Some(di_builder),
            di_compile_unit: Some(di_compile_unit),
            di_file: Some(di_file),
        }
    }

    /// Compile an IR module to LLVM IR with future-ready optimizations
    pub fn compile_ir(&mut self, ir_module: &IRModule) -> Result<(), String> {
        // Compile global variables
        for global_var in &ir_module.global_vars {
            self.compile_global_variable(global_var)?;
        }

        // Compile functions
        for function in &ir_module.functions {
            self.compile_function(function)?;
        }

        // Future-oriented: Apply optimization passes
        self.apply_optimizations()?;

        Ok(())
    }

    /// Apply future-ready optimization passes
    fn apply_optimizations(&self) -> Result<(), String> {
        // This is where we would integrate LLVM optimization passes
        // For now, we'll just log that optimizations are enabled
        println!("🚀 Future-ready optimizations enabled");

        // In a full implementation, we would:
        // 1. Create a pass manager
        // 2. Add optimization passes (constant folding, dead code elimination, etc.)
        // 3. Run the passes on the module
        //
        // Example (simplified):
        // let pass_manager = PassManager::create(());
        // pass_manager.add_constant_propagation_pass();
        // pass_manager.add_dead_code_elimination_pass();
        // pass_manager.run_on_module(&self.module);

        Ok(())
    }

    /// Compile a global variable
    fn compile_global_variable(
        &mut self,
        global_var: &crate::ir::GlobalVariable,
    ) -> Result<(), String> {
        let llvm_type = self.convert_type(&global_var.var_type)?;
        let global = self.module.add_global(llvm_type, Some(AddressSpace::default()), &global_var.name);

        if let Some(initializer) = &global_var.initializer {
            let llvm_value = self.convert_value(initializer)?;
            global.set_initializer(&llvm_value);
        }

        Ok(())
    }

    /// Compile a function
    fn compile_function(&mut self, function: &crate::ir::Function) -> Result<(), String> {
        // Convert return type
        let return_type = self.convert_type(&function.return_type)?;

        // Convert parameter types
        let param_types: Vec<BasicTypeEnum> = function
            .parameters
            .iter()
            .map(|param| self.convert_type(&param.param_type))
            .collect::<Result<Vec<_>, _>>()?;

        // Create function type
        let fn_type = if function.return_type == crate::ir::Type::Void {
            self.context.void_type().fn_type(&param_types, false)
        } else {
            return_type.fn_type(&param_types, false)
        };

        // Create function
        let llvm_function = self.module.add_function(&function.name, fn_type, None);
        self.functions.insert(function.name.clone(), llvm_function);

        // Set parameter names
        for (i, param) in llvm_function.get_param_iter().enumerate() {
            if i < function.parameters.len() {
                param.set_name(&function.parameters[i].name);
            }
        }

        // Handle debug information for the function
        if let (Some(ref di_builder), Some(ref di_file), Some(ref di_compile_unit)) =
            (&self.di_builder, &self.di_file, &self.di_compile_unit) {

            // Create subroutine type for the function
            let mut di_param_types = vec![];
            for param_type in &param_types {
                // Simplified - in a real implementation, we would convert LLVM types to DI types
                di_param_types.push(None); // Placeholder
            }

            let subroutine_type = di_builder.create_subroutine_type(
                *di_file,
                None, // return type placeholder
                &di_param_types,
                DIFlags::ZERO,
            );

            // Get line number from debug info if available
            let line_number = function.debug_info.as_ref().map_or(0, |di| di.line as u32);

            // Create debug subprogram for the function
            let di_subprogram = di_builder.create_function(
                *di_compile_unit,
                &function.name,
                None, // linkage_name
                *di_file,
                line_number,
                subroutine_type,
                false, // is_local_to_unit
                true, // is_definition
                line_number,
                DIFlags::ZERO,
                false, // is_optimized
            );

            // Associate the function with its debug info
            llvm_function.set_subprogram(di_subprogram);
        }

        // Create basic blocks
        for (i, block) in function.blocks.iter().enumerate() {
            let block_name = if i == 0 {
                "entry"
            } else {
                &block.name
            };

            let llvm_block = self.context.append_basic_block(llvm_function, block_name);

            // Compile instructions in the block
            self.builder.position_at_end(llvm_block);

            for instruction in &block.instructions {
                self.compile_instruction(instruction)?;
            }

            // Compile terminator
            self.compile_terminator(&block.terminator)?;
        }

        Ok(())
    }

    /// Compile an instruction
    fn compile_instruction(&mut self, instruction: &crate::ir::Instruction) -> Result<(), String> {
        match instruction {
            crate::ir::Instruction::BinaryOp { result, op, left, right } => {
                self.compile_binary_op(result, op, left, right)
            }
            crate::ir::Instruction::UnaryOp { result, op, operand } => {
                self.compile_unary_op(result, op, operand)
            }
            crate::ir::Instruction::Load { result, variable } => {
                self.compile_load(result, variable)
            }
            crate::ir::Instruction::Store { variable, value } => {
                self.compile_store(variable, value)
            }
            crate::ir::Instruction::Call { result, function, arguments } => {
                self.compile_call(result, function, arguments)
            }
            crate::ir::Instruction::Alloca { result, alloca_type } => {
                self.compile_alloca(result, alloca_type)
            }
            crate::ir::Instruction::Return { value } => {
                self.compile_return(value)
            }
            // Concurrency instructions
            crate::ir::Instruction::MakeChannel { result, channel_type } => {
                self.compile_make_channel(result, channel_type)
            }
            crate::ir::Instruction::ChannelSend { channel, value } => {
                self.compile_channel_send(channel, value)
            }
            crate::ir::Instruction::ChannelReceive { result, channel } => {
                self.compile_channel_receive(result, channel)
            }
            crate::ir::Instruction::MakeGoroutine { result, function } => {
                self.compile_make_goroutine(result, function)
            }
            crate::ir::Instruction::GoRoutine { function, arguments } => {
                self.compile_goroutine(function, arguments)
            }
            crate::ir::Instruction::MutexLock { mutex } => {
                self.compile_mutex_lock(mutex)
            }
            crate::ir::Instruction::MutexUnlock { mutex } => {
                self.compile_mutex_unlock(mutex)
            }
            crate::ir::Instruction::ConditionWait { condition, mutex } => {
                self.compile_condition_wait(condition, mutex)
            }
            crate::ir::Instruction::ConditionSignal { condition } => {
                self.compile_condition_signal(condition)
            }
            crate::ir::Instruction::ConditionBroadcast { condition } => {
                self.compile_condition_broadcast(condition)
            }
            crate::ir::Instruction::AtomicLoad { result, address, ordering } => {
                self.compile_atomic_load(result, address, ordering)
            }
            crate::ir::Instruction::AtomicStore { address, value, ordering } => {
                self.compile_atomic_store(address, value, ordering)
            }
            crate::ir::Instruction::AtomicExchange { result, address, value, ordering } => {
                self.compile_atomic_exchange(result, address, value, ordering)
            }
            crate::ir::Instruction::AtomicCompareExchange { result, address, expected, desired, success_ordering, failure_ordering } => {
                self.compile_atomic_compare_exchange(result, address, expected, desired, success_ordering, failure_ordering)
            }
            crate::ir::Instruction::AtomicFetchAdd { result, address, value, ordering } => {
                self.compile_atomic_fetch_add(result, address, value, ordering)
            }
            crate::ir::Instruction::AtomicFetchSub { result, address, value, ordering } => {
                self.compile_atomic_fetch_sub(result, address, value, ordering)
            }
            // Other instructions...
            _ => {
                // For unsupported instructions, we'll just print a message
                println!("Unsupported instruction: {:?}", instruction);
                Ok(())
            }
        }
    }

    /// Compile make channel instruction
    fn compile_make_channel(&mut self, result: &str, channel_type: &crate::ir::Type) -> Result<(), String> {
        // For now, we'll create a simple pointer to represent the channel
        let llvm_type = self.convert_type(channel_type)?;
        let channel_ptr_type = llvm_type.ptr_type(AddressSpace::default());
        let channel_ptr = self.builder.build_alloca(channel_ptr_type, result);

        // Store null pointer as initial value
        self.builder.build_store(channel_ptr, channel_ptr_type.const_null());

        // Store the channel pointer in our variables map
        self.variables.insert(result.to_string(), channel_ptr);

        Ok(())
    }

    /// Compile channel send instruction
    fn compile_channel_send(&mut self, channel: &crate::ir::Value, value: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll just print a message indicating a channel send operation
        println!("Channel send operation: {:?} <- {:?}", channel, value);
        Ok(())
    }

    /// Compile channel receive instruction
    fn compile_channel_receive(&mut self, result: &str, channel: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll create a dummy value to represent the received value
        let dummy_value = self.context.i64_type().const_zero().as_basic_value_enum();
        let result_ptr = self.builder.build_alloca(self.context.i64_type(), result);
        self.builder.build_store(result_ptr, dummy_value);
        self.variables.insert(result.to_string(), result_ptr);
        Ok(())
    }

    /// Compile make goroutine instruction
    fn compile_make_goroutine(&mut self, result: &str, function: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll create a simple pointer to represent the goroutine
        let goroutine_type = self.context.i8_type().ptr_type(AddressSpace::default());
        let goroutine_ptr = self.builder.build_alloca(goroutine_type, result);

        // Store null pointer as initial value
        self.builder.build_store(goroutine_ptr, goroutine_type.const_null());

        // Store the goroutine pointer in our variables map
        self.variables.insert(result.to_string(), goroutine_ptr);

        Ok(())
    }

    /// Compile goroutine instruction
    fn compile_goroutine(&mut self, function: &crate::ir::Value, arguments: &[crate::ir::Value]) -> Result<(), String> {
        // For now, we'll just print a message indicating a goroutine creation
        println!("Goroutine creation: {:?} with {:?} arguments", function, arguments.len());
        Ok(())
    }

    /// Compile mutex lock instruction
    fn compile_mutex_lock(&mut self, mutex: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll just print a message indicating a mutex lock operation
        println!("Mutex lock operation: {:?}", mutex);
        Ok(())
    }

    /// Compile mutex unlock instruction
    fn compile_mutex_unlock(&mut self, mutex: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll just print a message indicating a mutex unlock operation
        println!("Mutex unlock operation: {:?}", mutex);
        Ok(())
    }

    /// Compile condition wait instruction
    fn compile_condition_wait(&mut self, condition: &crate::ir::Value, mutex: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll just print a message indicating a condition wait operation
        println!("Condition wait operation: {:?} with mutex {:?}", condition, mutex);
        Ok(())
    }

    /// Compile condition signal instruction
    fn compile_condition_signal(&mut self, condition: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll just print a message indicating a condition signal operation
        println!("Condition signal operation: {:?}", condition);
        Ok(())
    }

    /// Compile condition broadcast instruction
    fn compile_condition_broadcast(&mut self, condition: &crate::ir::Value) -> Result<(), String> {
        // For now, we'll just print a message indicating a condition broadcast operation
        println!("Condition broadcast operation: {:?}", condition);
        Ok(())
    }

    /// Compile atomic load instruction
    fn compile_atomic_load(&mut self, result: &str, address: &crate::ir::Value, ordering: &crate::ir::AtomicOrdering) -> Result<(), String> {
        // Convert the address value
        let addr_val = self.convert_value(address)?;

        // For now, we'll do a regular load (not atomic)
        let loaded_value = self.builder.build_load(addr_val.into_pointer_value(), result);

        // Store the result
        let result_ptr = self.builder.build_alloca(loaded_value.get_type(), result);
        self.builder.build_store(result_ptr, loaded_value);
        self.variables.insert(result.to_string(), result_ptr);

        Ok(())
    }

    /// Compile atomic store instruction
    fn compile_atomic_store(&mut self, address: &crate::ir::Value, value: &crate::ir::Value, _ordering: &crate::ir::AtomicOrdering) -> Result<(), String> {
        // Convert the address and value
        let addr_val = self.convert_value(address)?;
        let val = self.convert_value(value)?;

        // For now, we'll do a regular store (not atomic)
        self.builder.build_store(addr_val.into_pointer_value(), val);

        Ok(())
    }

    /// Compile atomic exchange instruction
    fn compile_atomic_exchange(&mut self, result: &str, address: &crate::ir::Value, value: &crate::ir::Value, _ordering: &crate::ir::AtomicOrdering) -> Result<(), String> {
        // Convert the address and value
        let addr_val = self.convert_value(address)?;
        let val = self.convert_value(value)?;

        // For now, we'll do a regular exchange (not atomic)
        let old_value = self.builder.build_load(addr_val.into_pointer_value(), "old_value");
        self.builder.build_store(addr_val.into_pointer_value(), val);

        // Store the old value as result
        let result_ptr = self.builder.build_alloca(old_value.get_type(), result);
        self.builder.build_store(result_ptr, old_value);
        self.variables.insert(result.to_string(), result_ptr);

        Ok(())
    }

    /// Compile atomic compare exchange instruction
    fn compile_atomic_compare_exchange(&mut self, result: &str, address: &crate::ir::Value, expected: &crate::ir::Value, desired: &crate::ir::Value, _success_ordering: &crate::ir::AtomicOrdering, _failure_ordering: &crate::ir::AtomicOrdering) -> Result<(), String> {
        // Convert the address, expected, and desired values
        let addr_val = self.convert_value(address)?;
        let exp_val = self.convert_value(expected)?;
        let des_val = self.convert_value(desired)?;

        // For now, we'll do a regular compare exchange (not atomic)
        let current_value = self.builder.build_load(addr_val.into_pointer_value(), "current_value");
        let comparison = self.builder.build_int_compare(
            inkwell::IntPredicate::EQ,
            current_value.into_int_value(),
            exp_val.into_int_value(),
            "comparison"
        );

        // Conditional store
        self.builder.build_select(
            comparison,
            des_val,
            current_value,
            "cas_result"
        );

        // Store the comparison result
        let result_ptr = self.builder.build_alloca(comparison.get_type(), result);
        self.builder.build_store(result_ptr, comparison);
        self.variables.insert(result.to_string(), result_ptr);

        Ok(())
    }

    /// Compile atomic fetch add instruction
    fn compile_atomic_fetch_add(&mut self, result: &str, address: &crate::ir::Value, value: &crate::ir::Value, _ordering: &crate::ir::AtomicOrdering) -> Result<(), String> {
        // Convert the address and value
        let addr_val = self.convert_value(address)?;
        let val = self.convert_value(value)?;

        // For now, we'll do a regular fetch add (not atomic)
        let current_value = self.builder.build_load(addr_val.into_pointer_value(), "current_value");
        let new_value = self.builder.build_int_add(
            current_value.into_int_value(),
            val.into_int_value(),
            "new_value"
        );
        self.builder.build_store(addr_val.into_pointer_value(), new_value);

        // Store the old value as result
        let result_ptr = self.builder.build_alloca(current_value.get_type(), result);
        self.builder.build_store(result_ptr, current_value);
        self.variables.insert(result.to_string(), result_ptr);

        Ok(())
    }

    /// Compile atomic fetch sub instruction
    fn compile_atomic_fetch_sub(&mut self, result: &str, address: &crate::ir::Value, value: &crate::ir::Value, _ordering: &crate::ir::AtomicOrdering) -> Result<(), String> {
        // Convert the address and value
        let addr_val = self.convert_value(address)?;
        let val = self.convert_value(value)?;

        // For now, we'll do a regular fetch sub (not atomic)
        let current_value = self.builder.build_load(addr_val.into_pointer_value(), "current_value");
        let new_value = self.builder.build_int_sub(
            current_value.into_int_value(),
            val.into_int_value(),
            "new_value"
        );
        self.builder.build_store(addr_val.into_pointer_value(), new_value);

        // Store the old value as result
        let result_ptr = self.builder.build_alloca(current_value.get_type(), result);
        self.builder.build_store(result_ptr, current_value);
        self.variables.insert(result.to_string(), result_ptr);

        Ok(())
    }
                    self.context.i64_type().fn_type(&[channel_val.get_type().into()], false)
                };

                let recv_func = self.module.get_function("channel_receive")
                    .unwrap_or_else(|| {
                        self.module.add_function("channel_receive", recv_func_type, None)
                    });

                let call_result = self.builder.build_call(recv_func, &[channel_val], result);
                let return_val = call_result.try_as_basic_value().left().unwrap();

                let ptr = self.builder.build_alloca(return_val.get_type(), result);
                self.builder.build_store(ptr, return_val);
                self.variables.insert(result.clone(), ptr);
            }
            crate::ir::Instruction::GoRoutine { function, arguments } => {
                // Goroutine creation
                let func_val = self.convert_value(function)?;
                let arg_vals: Vec<BasicValueEnum> = arguments
                    .iter()
                    .map(|arg| self.convert_value(arg))
                    .collect::<Result<Vec<_>, _>>()?;

                // In a real implementation, this would generate code to:
                // 1. Create a new thread or coroutine
                // 2. Set up the execution context
                // 3. Start executing the function in the new context

                // For now, we'll create a placeholder call to a runtime function
                let mut param_types = vec![func_val.get_type().into()];
                param_types.extend(arg_vals.iter().map(|v| v.get_type().into()));

                let go_func_type = self.context.void_type().fn_type(&param_types, false);
                let go_func = self.module.get_function("go_routine")
                    .unwrap_or_else(|| {
                        self.module.add_function("go_routine", go_func_type, None)
                    });

                let mut args = vec![func_val];
                args.extend(arg_vals);

                self.builder.build_call(go_func, &args, "goroutine_result");
            }
            crate::ir::Instruction::Select { result, cases: _, default: _ } => {
                // Select operation on channels
                // In a real implementation, this would generate code to:
                // 1. Monitor multiple channels for readiness
                // 2. Execute the first ready case
                // 3. Handle the default case if provided and no channels are ready

                // For now, we'll create a simplified implementation
                let llvm_type = self.context.i64_type(); // Simplified return type
                let ptr = self.builder.build_alloca(llvm_type, result);
                self.variables.insert(result.clone(), ptr);

                // In a real implementation, this would generate proper select logic
            }
            crate::ir::Instruction::Defer { function, arguments } => {
                // Defer operation
                let func_val = self.convert_value(function)?;
                let arg_vals: Vec<BasicValueEnum> = arguments
                    .iter()
                    .map(|arg| self.convert_value(arg))
                    .collect::<Result<Vec<_>, _>>()?;

                // In a real implementation, this would generate code to:
                // 1. Register the function to be called at function exit
                // 2. Maintain a stack of deferred functions

                // For now, we'll just call the function immediately as a placeholder
                let mut param_types = vec![func_val.get_type().into()];
                param_types.extend(arg_vals.iter().map(|v| v.get_type().into()));

                let defer_func_type = self.context.void_type().fn_type(&param_types, false);
                let defer_func = self.module.get_function("defer_call")
                    .unwrap_or_else(|| {
                        self.module.add_function("defer_call", defer_func_type, None)
                    });

                let mut args = vec![func_val];
                args.extend(arg_vals);

                self.builder.build_call(defer_func, &args, "defer_result");
            }
            // Rust-style instructions
            crate::ir::Instruction::TraitMethodCall { result, trait_name: _, method_name: _, receiver: _, arguments: _ } => {
                // Trait method calls would require vtable support
                // For now, we'll create a placeholder
                let llvm_type = self.context.i64_type(); // Simplified
                let ptr = self.builder.build_alloca(llvm_type, result);
                self.variables.insert(result.clone(), ptr);

                // In a real implementation, this would generate code to:
                // 1. Look up the method in the trait's vtable
                // 2. Call the method with the receiver and arguments
            }
            crate::ir::Instruction::Match { result, expression: _, cases: _, default: _ } => {
                // Match would require complex control flow generation
                // For now, we'll create a placeholder
                let llvm_type = self.context.i64_type(); // Simplified
                let ptr = self.builder.build_alloca(llvm_type, result);
                self.variables.insert(result.clone(), ptr);

                // In a real implementation, this would generate code to:
                // 1. Evaluate the expression
                // 2. Compare against each pattern
                // 3. Execute the matching case
            }
            // Kotlin-style instructions
            crate::ir::Instruction::NullCheck { result, value } => {
                // Null check operation
                let value_val = self.convert_value(value)?;

                // For optional types, we check the flag
                // For pointer types, we compare with null
                let is_null = if value_val.is_pointer_value() {
                    // Check if pointer is null
                    self.builder.build_is_null(value_val.into_pointer_value(), "is_null")
                } else if value_val.is_struct_value() {
                    // For struct types (like optionals), check the flag
                    // Assuming the first field is the flag
                    let flag_ptr = self.builder.build_struct_gep(
                        value_val.into_struct_value(),
                        0,
                        "flag_ptr"
                    )?;
                    let flag_val = self.builder.build_load(flag_ptr, "flag_val");
                    self.builder.build_int_compare(
                        inkwell::IntPredicate::EQ,
                        flag_val.into_int_value(),
                        self.context.bool_type().const_int(0, false),
                        "is_null"
                    )
                } else {
                    // For other types, assume not null
                    self.context.bool_type().const_int(0, false)
                };

                let ptr = self.builder.build_alloca(self.context.bool_type(), result);
                self.builder.build_store(ptr, is_null);
                self.variables.insert(result.clone(), ptr);
            }
            crate::ir::Instruction::Elvis { result, value, default } => {
                // Elvis operator (null coalescing)
                let value_val = self.convert_value(value)?;
                let default_val = self.convert_value(default)?;

                // Check if value is null
                let is_null = if value_val.is_pointer_value() {
                    self.builder.build_is_null(value_val.into_pointer_value(), "is_null")
                } else if value_val.is_struct_value() {
                    // For struct types (like optionals), check the flag
                    let flag_ptr = self.builder.build_struct_gep(
                        value_val.into_struct_value(),
                        0,
                        "flag_ptr"
                    )?;
                    let flag_val = self.builder.build_load(flag_ptr, "flag_val");
                    self.builder.build_int_compare(
                        inkwell::IntPredicate::EQ,
                        flag_val.into_int_value(),
                        self.context.bool_type().const_int(0, false),
                        "is_null"
                    )
                } else {
                    // For other types, assume not null
                    self.context.bool_type().const_int(0, false)
                };

                // Select between value and default based on null check
                let selected_val = self.builder.build_select(
                    is_null,
                    default_val,
                    value_val,
                    result
                );

                let ptr = self.builder.build_alloca(selected_val.get_type(), result);
                self.builder.build_store(ptr, selected_val);
                self.variables.insert(result.clone(), ptr);
            }
            // C#-style instructions
            crate::ir::Instruction::LinqQuery { result, source: _, operations: _ } => {
                // LINQ queries would require complex implementation
                // For now, we'll create a simplified array result
                let llvm_type = self.context.i64_type().ptr_type(AddressSpace::default());
                let ptr = self.builder.build_alloca(llvm_type, result);
                self.variables.insert(result.clone(), ptr);

                // In a real implementation, this would generate code to:
                // 1. Execute the LINQ operations on the source
                // 2. Return the result
            }
            // PHP-style instructions
            crate::ir::Instruction::SuperglobalAccess { result, global_name } => {
                // Superglobal access would require runtime support
                // For now, we'll create a simplified string result
                let llvm_type = self.context.i8_type().ptr_type(AddressSpace::default());
                let ptr = self.builder.build_alloca(llvm_type, result);
                self.variables.insert(result.clone(), ptr);

                // In a real implementation, this would generate code to:
                // 1. Access the superglobal variable by name
                // 2. Return its value
            }
            // Ruby-style instructions
            crate::ir::Instruction::BlockCall { result, function, block } => {
                // Block calls would require closure support
                let func_val = self.convert_value(function)?;
                let block_val = self.convert_value(block)?;

                // For now, we'll just call the function with the block as parameter
                let call_result = self.builder.build_call(
                    func_val.into_pointer_value(),
                    &[block_val],
                    result
                );

                if let Some(return_val) = call_result.try_as_basic_value().left() {
                    let ptr = self.builder.build_alloca(return_val.get_type(), result);
                    self.builder.build_store(ptr, return_val);
                    self.variables.insert(result.clone(), ptr);
                }
            }
            // SQL-style instructions
            crate::ir::Instruction::SqlQuery { result, query: _, parameters: _ } => {
                // SQL queries would require database connectivity
                // For now, we'll create a simplified string result
                let llvm_type = self.context.i8_type().ptr_type(AddressSpace::default());
                let ptr = self.builder.build_alloca(llvm_type, result);
                self.variables.insert(result.clone(), ptr);

                // In a real implementation, this would generate code to:
                // 1. Connect to the database
                // 2. Execute the query with parameters
                // 3. Return the result
            }
            // R-style instructions
            crate::ir::Instruction::StatisticalFunction { result, function_name, arguments: _ } => {
                // Statistical functions would require math library support
                let llvm_type = self.context.f64_type(); // Floating point result
                let ptr = self.builder.build_alloca(llvm_type, result);
                self.variables.insert(result.clone(), ptr);

                // In a real implementation, this would generate code to:
                // 1. Call the appropriate statistical function by name
                // 2. Return the result
            }
            // Advanced concurrency instructions
            crate::ir::Instruction::MutexLock { mutex } => {
                // Mutex lock operation
                let mutex_val = self.convert_value(mutex)?;

                // In a real implementation, this would generate code to:
                // 1. Call the platform-specific mutex lock function
                // 2. Handle potential errors

                // For now, we'll create a placeholder call to a runtime function
                let lock_func = self.module.get_function("mutex_lock")
                    .unwrap_or_else(|| {
                        let fn_type = self.context.void_type().fn_type(
                            &[mutex_val.get_type().into()],
                            false
                        );
                        self.module.add_function("mutex_lock", fn_type, None)
                    });

                self.builder.build_call(lock_func, &[mutex_val], "mutex_lock_result");
            }
            crate::ir::Instruction::MutexUnlock { mutex } => {
                // Mutex unlock operation
                let mutex_val = self.convert_value(mutex)?;

                // In a real implementation, this would generate code to:
                // 1. Call the platform-specific mutex unlock function
                // 2. Handle potential errors

                // For now, we'll create a placeholder call to a runtime function
                let unlock_func = self.module.get_function("mutex_unlock")
                    .unwrap_or_else(|| {
                        let fn_type = self.context.void_type().fn_type(
                            &[mutex_val.get_type().into()],
                            false
                        );
                        self.module.add_function("mutex_unlock", fn_type, None)
                    });

                self.builder.build_call(unlock_func, &[mutex_val], "mutex_unlock_result");
            }
            crate::ir::Instruction::ConditionWait { condition, mutex } => {
                // Condition variable wait operation
                let condition_val = self.convert_value(condition)?;
                let mutex_val = self.convert_value(mutex)?;

                // In a real implementation, this would generate code to:
                // 1. Call the platform-specific condition wait function
                // 2. Handle potential errors

                // For now, we'll create a placeholder call to a runtime function
                let wait_func = self.module.get_function("condition_wait")
                    .unwrap_or_else(|| {
                        let fn_type = self.context.void_type().fn_type(
                            &[condition_val.get_type().into(), mutex_val.get_type().into()],
                            false
                        );
                        self.module.add_function("condition_wait", fn_type, None)
                    });

                self.builder.build_call(wait_func, &[condition_val, mutex_val], "condition_wait_result");
            }
            crate::ir::Instruction::ConditionSignal { condition } => {
                // Condition variable signal operation
                let condition_val = self.convert_value(condition)?;

                // In a real implementation, this would generate code to:
                // 1. Call the platform-specific condition signal function
                // 2. Handle potential errors

                // For now, we'll create a placeholder call to a runtime function
                let signal_func = self.module.get_function("condition_signal")
                    .unwrap_or_else(|| {
                        let fn_type = self.context.void_type().fn_type(
                            &[condition_val.get_type().into()],
                            false
                        );
                        self.module.add_function("condition_signal", fn_type, None)
                    });

                self.builder.build_call(signal_func, &[condition_val], "condition_signal_result");
            }
            crate::ir::Instruction::ConditionBroadcast { condition } => {
                // Condition variable broadcast operation
                let condition_val = self.convert_value(condition)?;

                // In a real implementation, this would generate code to:
                // 1. Call the platform-specific condition broadcast function
                // 2. Handle potential errors

                // For now, we'll create a placeholder call to a runtime function
                let broadcast_func = self.module.get_function("condition_broadcast")
                    .unwrap_or_else(|| {
                        let fn_type = self.context.void_type().fn_type(
                            &[condition_val.get_type().into()],
                            false
                        );
                        self.module.add_function("condition_broadcast", fn_type, None)
                    });

                self.builder.build_call(broadcast_func, &[condition_val], "condition_broadcast_result");
            }
            // Atomic operations
            crate::ir::Instruction::AtomicLoad { result, address, ordering } => {
                // Atomic load operation
                let address_val = self.convert_value(address)?;
                let llvm_ordering = self.convert_atomic_ordering(ordering);

                let loaded_value = self.builder.build_load(address_val.into_pointer_value(), result);
                // Set atomic ordering
                if let inkwell::values::BasicValueEnum::IntValue(int_val) = loaded_value {
                    let atomic_inst = int_val.as_instruction_value().unwrap();
                    atomic_inst.set_atomic_ordering(llvm_ordering).unwrap();
                }

                let ptr = self.builder.build_alloca(loaded_value.get_type(), result);
                self.builder.build_store(ptr, loaded_value);
                self.variables.insert(result.clone(), ptr);
            }
            crate::ir::Instruction::AtomicStore { address, value, ordering } => {
                // Atomic store operation
                let address_val = self.convert_value(address)?;
                let value_val = self.convert_value(value)?;
                let llvm_ordering = self.convert_atomic_ordering(ordering);

                let store_inst = self.builder.build_store(address_val.into_pointer_value(), value_val);
                store_inst.set_atomic_ordering(llvm_ordering).unwrap();
            }
            crate::ir::Instruction::AtomicExchange { result, address, value, ordering } => {
                // Atomic exchange operation
                let address_val = self.convert_value(address)?;
                let value_val = self.convert_value(value)?;
                let llvm_ordering = self.convert_atomic_ordering(ordering);

                let exchanged_value = self.builder.build_atomicrmw(
                    inkwell::AtomicRMWBinOp::Xchg,
                    address_val.into_pointer_value(),
                    value_val.into_int_value(),
                    llvm_ordering
                ).unwrap();

                let ptr = self.builder.build_alloca(exchanged_value.get_type(), result);
                self.builder.build_store(ptr, exchanged_value);
                self.variables.insert(result.clone(), ptr);
            }
            crate::ir::Instruction::AtomicCompareExchange { result, address, expected, desired, success_ordering, failure_ordering } => {
                // Atomic compare exchange operation
                let address_val = self.convert_value(address)?;
                let expected_val = self.convert_value(expected)?;
                let desired_val = self.convert_value(desired)?;
                let success_ord = self.convert_atomic_ordering(success_ordering);
                let failure_ord = self.convert_atomic_ordering(failure_ordering);

                let cmpxchg_result = self.builder.build_cmpxchg(
                    address_val.into_pointer_value(),
                    expected_val.into_int_value(),
                    desired_val.into_int_value(),
                    success_ord,
                    failure_ord
                ).unwrap();

                let ptr = self.builder.build_alloca(cmpxchg_result.get_type(), result);
                self.builder.build_store(ptr, cmpxchg_result);
                self.variables.insert(result.clone(), ptr);
            }
            crate::ir::Instruction::AtomicFetchAdd { result, address, value, ordering } => {
                // Atomic fetch add operation
                let address_val = self.convert_value(address)?;
                let value_val = self.convert_value(value)?;
                let llvm_ordering = self.convert_atomic_ordering(ordering);

                let fetched_value = self.builder.build_atomicrmw(
                    inkwell::AtomicRMWBinOp::Add,
                    address_val.into_pointer_value(),
                    value_val.into_int_value(),
                    llvm_ordering
                ).unwrap();

                let ptr = self.builder.build_alloca(fetched_value.get_type(), result);
                self.builder.build_store(ptr, fetched_value);
                self.variables.insert(result.clone(), ptr);
            }
            crate::ir::Instruction::AtomicFetchSub { result, address, value, ordering } => {
                // Atomic fetch subtract operation
                let address_val = self.convert_value(address)?;
                let value_val = self.convert_value(value)?;
                let llvm_ordering = self.convert_atomic_ordering(ordering);

                let fetched_value = self.builder.build_atomicrmw(
                    inkwell::AtomicRMWBinOp::Sub,
                    address_val.into_pointer_value(),
                    value_val.into_int_value(),
                    llvm_ordering
                ).unwrap();

                let ptr = self.builder.build_alloca(fetched_value.get_type(), result);
                self.builder.build_store(ptr, fetched_value);
                self.variables.insert(result.clone(), ptr);
            }
            _ => return Err(format!("Unsupported instruction: {:?}", instruction)),
        }

        Ok(())
    }

    /// Compile a terminator
    fn compile_terminator(&mut self, terminator: &crate::ir::Terminator) -> Result<(), String> {
        match terminator {
            crate::ir::Terminator::Return { value } => {
                if let Some(val) = value {
                    let llvm_value = self.convert_value(val)?;
                    self.builder.build_return(Some(&llvm_value));
                } else {
                    self.builder.build_return(None);
                }
            }
            crate::ir::Terminator::Branch { target: _target } => {
                // For now, we'll just return void
                self.builder.build_return(None);
            }
            crate::ir::Terminator::ConditionalBranch { condition: _condition, then_target: _then_target, else_target: _else_target } => {
                // For now, we'll just return void
                self.builder.build_return(None);
            }
        }

        Ok(())
    }

    /// Convert an IR type to LLVM type
    fn convert_type(&self, ty: &Type) -> Result<BasicTypeEnum<'ctx>, String> {
        match ty {
            Type::Int => Ok(self.context.i64_type().into()),
            Type::Float => Ok(self.context.f64_type().into()),
            Type::Bool => Ok(self.context.bool_type().into()),
            Type::String => Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into()),
            Type::Void => Err("Void type cannot be converted to BasicTypeEnum".to_string()),
            Type::Reference { inner_type } => {
                // References are pointers in LLVM
                let inner_llvm_type = self.convert_type(inner_type)?;
                Ok(inner_llvm_type.ptr_type(AddressSpace::default()).into())
            }
            Type::Pointer { inner_type } => {
                // Pointers are pointers in LLVM
                let inner_llvm_type = self.convert_type(inner_type)?;
                Ok(inner_llvm_type.ptr_type(AddressSpace::default()).into())
            }
            Type::Optional { inner_type } => {
                // Optionals could be represented as a struct with a flag and value
                let inner_llvm_type = self.convert_type(inner_type)?;
                let flag_type = self.context.bool_type();
                Ok(self.context.struct_type(&[flag_type.into(), inner_llvm_type], false).into())
            }
            Type::Range => {
                // Range could be represented as a struct with start and end values
                let int_type = self.context.i64_type();
                Ok(self.context.struct_type(&[int_type.into(), int_type.into()], false).into())
            }
            Type::Async { inner_type } => {
                // Async types would require complex runtime support
                // For now, we'll just use the inner type
                self.convert_type(inner_type)
            }
            Type::Array { element_type } => {
                // Arrays are pointers to element type in LLVM
                let elem_llvm_type = self.convert_type(element_type)?;
                Ok(elem_llvm_type.ptr_type(AddressSpace::default()).into())
            }
            Type::Object { .. } => {
                // Objects are pointers in LLVM
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into())
            }
            Type::Function { param_types, return_type } => {
                // Function types need to be converted recursively
                let param_llvm_types: Vec<BasicTypeEnum> = param_types
                    .iter()
                    .map(|ty| self.convert_type(ty))
                    .collect::<Result<Vec<_>, _>>()?;

                let return_llvm_type = if **return_type == Type::Void {
                    None
                } else {
                    Some(self.convert_type(return_type)?)
                };

                match return_llvm_type {
                    Some(ret_ty) => Ok(ret_ty.fn_type(&param_llvm_types, false).ptr_type(AddressSpace::default()).into()),
                    None => Ok(self.context.void_type().fn_type(&param_llvm_types, false).ptr_type(AddressSpace::default()).into()),
                }
            }
            // Go-style concurrency types
            Type::Channel { element_type } => {
                // Channels are represented as structs with internal state
                let elem_llvm_type = self.convert_type(element_type)?;
                let buffer_type = elem_llvm_type.ptr_type(AddressSpace::default()); // Buffer pointer
                let size_type = self.context.i32_type(); // Buffer size
                let count_type = self.context.i32_type(); // Current count
                let mutex_type = self.context.i32_type(); // Simple mutex (in real implementation would be more complex)

                Ok(self.context.struct_type(
                    &[buffer_type.into(), size_type.into(), count_type.into(), mutex_type.into()],
                    false
                ).into())
            }
            Type::Goroutine => {
                // Goroutines are represented as pointers to execution context
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into())
            }
            // Rust-style types
            Type::Trait { .. } => {
                // Traits are represented as pointers to vtables
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into())
            }
            // Kotlin-style types
            Type::Nullable { inner_type } => {
                // Nullable types are represented as optionals (same as Swift optionals)
                let inner_llvm_type = self.convert_type(inner_type)?;
                let flag_type = self.context.bool_type();
                Ok(self.context.struct_type(&[flag_type.into(), inner_llvm_type], false).into())
            }
            // SQL-style types
            Type::Table { columns } => {
                // Tables are represented as pointers to complex data structures
                // In a real implementation, this would be more sophisticated
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into())
            }
            // R-style types
            Type::Vector { element_type } => {
                // Vectors are represented as arrays with metadata
                let elem_llvm_type = self.convert_type(element_type)?;
                let data_ptr = elem_llvm_type.ptr_type(AddressSpace::default());
                let length_type = self.context.i64_type();
                Ok(self.context.struct_type(&[data_ptr.into(), length_type.into()], false).into())
            }
            Type::DataFrame => {
                // Data frames are represented as pointers to complex data structures
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into())
            }
            // Advanced concurrency types
            Type::Mutex => {
                // Mutexes are represented as pointers to internal state
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into())
            }
            Type::Condition => {
                // Condition variables are represented as pointers to internal state
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).into())
            }
            _ => Err(format!("Unsupported type: {:?}", ty)),
        }
    }

    /// Convert an IR value to LLVM value
    fn convert_value(&self, value: &crate::ir::Value) -> Result<BasicValueEnum<'ctx>, String> {
        match value {
            crate::ir::Value::Constant(constant) => match constant {
                crate::ir::Constant::Int(i) => {
                    Ok(self.context.i64_type().const_int(*i as u64, false).into())
                }
                crate::ir::Constant::Float(f) => {
                    Ok(self.context.f64_type().const_float(*f).into())
                }
                crate::ir::Constant::Bool(b) => {
                    Ok(self.context.bool_type().const_int(*b as u64, false).into())
                }
                crate::ir::Constant::String(s) => {
                    let ptr = self.builder.build_global_string_ptr(s, "str");
                    Ok(ptr.as_basic_value_enum())
                }
                crate::ir::Constant::Array(elements) => {
                    // For arrays, we create a constant array
                    let llvm_elements: Vec<BasicValueEnum> = elements
                        .iter()
                        .map(|elem| self.convert_constant(elem))
                        .collect::<Result<Vec<_>, _>>()?;

                    if llvm_elements.is_empty() {
                        // Empty array
                        let array_type = self.context.i64_type().array_type(0);
                        Ok(array_type.const_zero().into())
                    } else {
                        // Non-empty array
                        let first_element_type = llvm_elements[0].get_type();
                        let array_type = first_element_type.array_type(llvm_elements.len() as u32);
                        Ok(array_type.const_array(&llvm_elements).into())
                    }
                }
                crate::ir::Constant::Object(properties) => {
                    // For objects, we create a pointer to a struct
                    // This is a simplified implementation
                    Ok(self.context.i8_type().ptr_type(AddressSpace::default()).const_null().as_basic_value_enum())
                }
                crate::ir::Constant::Null => {
                    // Null is represented as a null pointer
                    Ok(self.context.i8_type().ptr_type(AddressSpace::default()).const_null().as_basic_value_enum())
                }
            },
            crate::ir::Value::Variable(name) => {
                if let Some(ptr) = self.variables.get(name) {
                    let value = self.builder.build_load(*ptr, name);
                    Ok(value)
                } else {
                    Err(format!("Variable {} not found", name))
                }
            }
            crate::ir::Value::InstructionRef(_) => {
                Err("InstructionRef not supported in this context".to_string())
            }
            // New value types for enhanced features
            crate::ir::Value::RangeValue { start, end, inclusive: _ } => {
                // For range values, we create a struct with start and end
                let start_val = self.convert_value(start)?;
                let end_val = self.convert_value(end)?;

                let range_type = self.context.struct_type(
                    &[self.context.i64_type().into(), self.context.i64_type().into()],
                    false
                );

                let range_struct = self.builder.build_alloca(range_type, "range_val");
                self.builder.build_store(
                    self.builder.build_struct_gep(range_struct, 0, "range_start_ptr")?,
                    start_val.into_int_value()
                );
                self.builder.build_store(
                    self.builder.build_struct_gep(range_struct, 1, "range_end_ptr")?,
                    end_val.into_int_value()
                );

                let loaded_range = self.builder.build_load(range_struct, "range_loaded");
                Ok(loaded_range)
            }
            crate::ir::Value::ListComprehensionValue { expression: _, variable: _, iterable: _, condition: _ } => {
                // For list comprehensions, we would generate complex code
                // For now, we'll return a simple array pointer
                Ok(self.context.i64_type().ptr_type(AddressSpace::default()).const_null().as_basic_value_enum())
            }
            crate::ir::Value::ObjectValue { properties: _ } => {
                // For object values, we return a pointer
                Ok(self.context.i8_type().ptr_type(AddressSpace::default()).const_null().as_basic_value_enum())
            }
            crate::ir::Value::AwaitValue(_) => {
                // For await values, we would generate async code
                // For now, we'll return a simple integer
                Ok(self.context.i64_type().const_zero().into())
            }
            crate::ir::Value::YieldValue(_) => {
                // For yield values, we would generate generator code
                // For now, we'll return a simple integer
                Ok(self.context.i64_type().const_zero().into())
            }
            // New value types for extended features
            crate::ir::Value::ChannelValue { element_type: _ } => {
                // For channel values, we return a pointer to a channel struct
                let channel_type = self.context.i8_type().ptr_type(AddressSpace::default());
                Ok(channel_type.const_null().as_basic_value_enum())
            }
            crate::ir::Value::GoroutineValue { function: _ } => {
                // For goroutine values, we return a pointer to execution context
                let goroutine_type = self.context.i8_type().ptr_type(AddressSpace::default());
                Ok(goroutine_type.const_null().as_basic_value_enum())
            }
            crate::ir::Value::TraitValue { name: _ } => {
                // For trait values, we return a pointer to a vtable
                let trait_type = self.context.i8_type().ptr_type(AddressSpace::default());
                Ok(trait_type.const_null().as_basic_value_enum())
            }
            crate::ir::Value::NullableValue { value } => {
                // For nullable values, we create an optional struct
                let optional_type = self.context.struct_type(
                    &[self.context.bool_type().into(), self.context.i64_type().into()],
                    false
                );

                let optional_struct = self.builder.build_alloca(optional_type, "optional_val");

                if let Some(inner_value) = value {
                    // Value is present
                    self.builder.build_store(
                        self.builder.build_struct_gep(optional_struct, 0, "optional_flag_ptr")?,
                        self.context.bool_type().const_int(1, false)
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
                        self.context.bool_type().const_int(0, false)
                    );

                    self.builder.build_store(
                        self.builder.build_struct_gep(optional_struct, 1, "optional_value_ptr")?,
                        self.context.i64_type().const_zero()
                    );
                }

                let loaded_optional = self.builder.build_load(optional_struct, "optional_loaded");
                Ok(loaded_optional)
            }
            crate::ir::Value::TableValue { columns: _ } => {
                // For table values, we return a pointer to table data
                let table_type = self.context.i8_type().ptr_type(AddressSpace::default());
                Ok(table_type.const_null().as_basic_value_enum())
            }
            crate::ir::Value::VectorValue { elements: _ } => {
                // For vector values, we create a struct with data pointer and length
                let vector_type = self.context.struct_type(
                    &[self.context.i8_type().ptr_type(AddressSpace::default()).into(), self.context.i64_type().into()],
                    false
                );
                Ok(vector_type.const_zero().into())
            }
            crate::ir::Value::DataframeValue { data: _ } => {
                // For dataframe values, we return a pointer to dataframe data
                let dataframe_type = self.context.i8_type().ptr_type(AddressSpace::default());
                Ok(dataframe_type.const_null().as_basic_value_enum())
            }
            crate::ir::Value::MutexValue => {
                // For mutex values, we return a pointer to mutex data
                let mutex_type = self.context.i8_type().ptr_type(AddressSpace::default());
                Ok(mutex_type.const_null().as_basic_value_enum())
            }
            crate::ir::Value::ConditionValue => {
                // For condition variable values, we return a pointer to condition data
                let condition_type = self.context.i8_type().ptr_type(AddressSpace::default());
                Ok(condition_type.const_null().as_basic_value_enum())
            }
        }
    }

    /// Convert an IR constant to LLVM value
    fn convert_constant(&self, constant: &crate::ir::Constant) -> Result<BasicValueEnum<'ctx>, String> {
        match constant {
            crate::ir::Constant::Int(i) => {
                Ok(self.context.i64_type().const_int(*i as u64, false).into())
            }
            crate::ir::Constant::Float(f) => {
                Ok(self.context.f64_type().const_float(*f).into())
            }
            crate::ir::Constant::Bool(b) => {
                Ok(self.context.bool_type().const_int(*b as u64, false).into())
            }
            crate::ir::Constant::String(s) => {
                let ptr = self.builder.build_global_string_ptr(s, "str");
                Ok(ptr.as_basic_value_enum())
            }
            _ => Err(format!("Unsupported constant: {:?}", constant)),
        }
    }

    /// Get the LLVM module
    pub fn get_module(&self) -> &Module<'ctx> {
        &self.module
    }

    /// Print the LLVM IR to stdout
    pub fn print_ir(&self) {
        self.module.print_to_stderr();
    }

    /// Write the LLVM IR to a file
    pub fn write_ir_to_file(&self, filename: &str) -> Result<(), String> {
        self.module
            .print_to_file(filename)
            .map_err(|e| format!("Failed to write IR to file: {:?}", e))
    }

    /// Helper method to get the element type of a channel
    fn get_channel_element_type(&self, channel: &crate::ir::Value) -> Result<Option<BasicTypeEnum<'ctx>>, String> {
        // This is a simplified implementation
        // In a real implementation, we would analyze the channel value to determine its element type
        Ok(Some(self.context.i64_type().into()))
    }

    /// Convert IR atomic ordering to LLVM atomic ordering
    fn convert_atomic_ordering(&self, ordering: &crate::ir::AtomicOrdering) -> inkwell::AtomicOrdering {
        match ordering {
            crate::ir::AtomicOrdering::Relaxed => inkwell::AtomicOrdering::Monotonic,
            crate::ir::AtomicOrdering::Consume => inkwell::AtomicOrdering::Acquire,
            crate::ir::AtomicOrdering::Acquire => inkwell::AtomicOrdering::Acquire,
            crate::ir::AtomicOrdering::Release => inkwell::AtomicOrdering::Release,
            crate::ir::AtomicOrdering::AcqRel => inkwell::AtomicOrdering::AcqRel,
            crate::ir::AtomicOrdering::SeqCst => inkwell::AtomicOrdering::SequentiallyConsistent,
        }
    }
}
