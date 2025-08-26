//! LLVM backend context for the KODEON programming language

use inkwell::context::Context;
use inkwell::module::Module;
use inkwell::targets::{InitializationConfig, Target};
use std::cell::RefCell;
use std::rc::Rc;

/// LLVM context wrapper
pub struct LLVMContext {
    context: Rc<Context>,
    module: RefCell<Module<'static>>,
}

impl LLVMContext {
    /// Create a new LLVM context
    pub fn new(module_name: &str) -> Self {
        // Initialize LLVM targets
        let config = InitializationConfig::default();
        Target::initialize_native(&config)
            .expect("Failed to initialize native target");

        let context = Context::create();
        let module = context.create_module(module_name);

        // SAFETY: We're storing the module in a RefCell to manage the lifetime
        // This is safe as long as we don't move the module out of the RefCell
        let module = unsafe { std::mem::transmute(module) };

        LLVMContext {
            context: Rc::new(context),
            module: RefCell::new(module),
        }
    }

    /// Get the LLVM context
    pub fn get_context(&self) -> &Context {
        &self.context
    }

    /// Get the LLVM module
    pub fn get_module(&self) -> std::cell::Ref<Module> {
        self.module.borrow()
    }

    /// Get a mutable reference to the LLVM module
    pub fn get_module_mut(&self) -> std::cell::RefMut<Module> {
        self.module.borrow_mut()
    }
}
