//! Debugger implementation for the KODEON programming language

use crate::ir::{IRModule, DebugInfo};
use std::collections::HashMap;
use std::io::{self, Write};

/// Debugger for KODEON programs
pub struct Debugger {
    breakpoints: HashMap<String, Vec<Breakpoint>>,
    watchpoints: HashMap<String, Watchpoint>,
    current_line: usize,
    current_function: String,
    variables: HashMap<String, DebugValue>,
    running: bool,
}

/// Breakpoint in the source code
#[derive(Debug, Clone)]
pub struct Breakpoint {
    pub line: usize,
    pub condition: Option<String>,
    pub enabled: bool,
}

/// Watchpoint for variable monitoring
#[derive(Debug, Clone)]
pub struct Watchpoint {
    pub variable_name: String,
    pub condition: Option<String>,
    pub enabled: bool,
    pub last_value: Option<String>,
}

/// Debug value with type information
#[derive(Debug, Clone)]
pub struct DebugValue {
    pub value: String,
    pub type_name: String,
    pub scope: String,
}

impl Debugger {
    /// Create a new debugger
    pub fn new() -> Self {
        Debugger {
            breakpoints: HashMap::new(),
            watchpoints: HashMap::new(),
            current_line: 0,
            current_function: String::new(),
            variables: HashMap::new(),
            running: false,
        }
    }

    /// Add a breakpoint at the specified line
    pub fn add_breakpoint(&mut self, file_name: &str, line: usize) {
        let breakpoint = Breakpoint {
            line,
            condition: None,
            enabled: true,
        };

        self.breakpoints
            .entry(file_name.to_string())
            .or_insert_with(Vec::new)
            .push(breakpoint);

        println!("Breakpoint added at {} line {}", file_name, line);
    }

    /// Remove a breakpoint at the specified line
    pub fn remove_breakpoint(&mut self, file_name: &str, line: usize) {
        if let Some(breakpoints) = self.breakpoints.get_mut(file_name) {
            breakpoints.retain(|bp| bp.line != line);
            println!("Breakpoint removed at {} line {}", file_name, line);
        }
    }

    /// Set a conditional breakpoint
    pub fn set_conditional_breakpoint(&mut self, file_name: &str, line: usize, condition: String) {
        let breakpoint = Breakpoint {
            line,
            condition: Some(condition),
            enabled: true,
        };

        self.breakpoints
            .entry(file_name.to_string())
            .or_insert_with(Vec::new)
            .push(breakpoint);

        println!("Conditional breakpoint added at {} line {}", file_name, line);
    }

    /// Add a watchpoint for a variable
    pub fn add_watchpoint(&mut self, variable_name: &str) {
        let watchpoint = Watchpoint {
            variable_name: variable_name.to_string(),
            condition: None,
            enabled: true,
            last_value: None,
        };

        self.watchpoints.insert(variable_name.to_string(), watchpoint);
        println!("Watchpoint added for variable '{}'", variable_name);
    }

    /// Remove a watchpoint for a variable
    pub fn remove_watchpoint(&mut self, variable_name: &str) {
        self.watchpoints.remove(variable_name);
        println!("Watchpoint removed for variable '{}'", variable_name);
    }

    /// Set a conditional watchpoint
    pub fn set_conditional_watchpoint(&mut self, variable_name: &str, condition: String) {
        let watchpoint = Watchpoint {
            variable_name: variable_name.to_string(),
            condition: Some(condition),
            enabled: true,
            last_value: None,
        };

        self.watchpoints.insert(variable_name.to_string(), watchpoint);
        println!("Conditional watchpoint added for variable '{}'", variable_name);
    }

    /// Check if there's a breakpoint at the current location
    pub fn has_breakpoint(&self, file_name: &str, line: usize) -> bool {
        if let Some(breakpoints) = self.breakpoints.get(file_name) {
            breakpoints.iter().any(|bp| bp.line == line && bp.enabled)
        } else {
            false
        }
    }

    /// Check if a variable has changed (for watchpoints)
    pub fn check_watchpoints(&mut self, variable_name: &str, new_value: &str) -> bool {
        if let Some(watchpoint) = self.watchpoints.get_mut(variable_name) {
            if watchpoint.enabled {
                let changed = watchpoint.last_value.as_ref() != Some(&new_value.to_string());
                watchpoint.last_value = Some(new_value.to_string());

                if changed {
                    println!("Watchpoint hit: {} = {}", variable_name, new_value);
                    return true;
                }
            }
        }
        false
    }

    /// Start debugging the IR module
    pub fn debug(&mut self, module: &IRModule) -> Result<(), String> {
        println!("Starting debugger for module: {}", module.module_name);
        self.running = true;

        // Process functions in the module
        for function in &module.functions {
            self.debug_function(function)?;
        }

        self.running = false;
        Ok(())
    }

    /// Debug a function
    fn debug_function(&mut self, function: &crate::ir::Function) -> Result<(), String> {
        println!("Debugging function: {}", function.name);
        self.current_function = function.name.clone();

        // Process basic blocks in the function
        for block in &function.blocks {
            self.debug_block(block)?;
        }

        Ok(())
    }

    /// Debug a basic block
    fn debug_block(&mut self, block: &crate::ir::BasicBlock) -> Result<(), String> {
        println!("Debugging block: {}", block.name);

        // Check for breakpoints at the start of the block
        if let Some(ref debug_info) = block.debug_info {
            if self.has_breakpoint(&debug_info.file_name, debug_info.line) {
                self.handle_breakpoint(&debug_info.file_name, debug_info.line)?;
            }
        }

        // Process instructions in the block
        for instruction in &block.instructions {
            self.debug_instruction(instruction)?;
        }

        Ok(())
    }

    /// Debug an instruction
    fn debug_instruction(&mut self, instruction: &crate::ir::Instruction) -> Result<(), String> {
        // Get debug information for the instruction
        let debug_info = match instruction {
            crate::ir::Instruction::BinaryOp { debug_info, .. } => debug_info,
            crate::ir::Instruction::UnaryOp { debug_info, .. } => debug_info,
            crate::ir::Instruction::Load { debug_info, .. } => debug_info,
            crate::ir::Instruction::Store { debug_info, .. } => debug_info,
            crate::ir::Instruction::Call { debug_info, .. } => debug_info,
            crate::ir::Instruction::Alloca { debug_info, .. } => debug_info,
            crate::ir::Instruction::Return { debug_info, .. } => debug_info,
            // Elegant instructions
            crate::ir::Instruction::Chain { debug_info, .. } => debug_info,
            crate::ir::Instruction::Pipeline { debug_info, .. } => debug_info,
            crate::ir::Instruction::Destructure { debug_info, .. } => debug_info,
            crate::ir::Instruction::Swap { debug_info, .. } => debug_info,
            // New instructions for enhanced features
            crate::ir::Instruction::ListComprehension { debug_info, .. } => debug_info,
            crate::ir::Instruction::Range { debug_info, .. } => debug_info,
            crate::ir::Instruction::ObjectLiteral { debug_info, .. } => debug_info,
            crate::ir::Instruction::MemberAccess { debug_info, .. } => debug_info,
            crate::ir::Instruction::ForEachLoop { debug_info, .. } => debug_info,
            crate::ir::Instruction::PatternMatch { debug_info, .. } => debug_info,
            crate::ir::Instruction::Await { debug_info, .. } => debug_info,
            crate::ir::Instruction::Yield { debug_info, .. } => debug_info,
            // Concurrency instructions
            crate::ir::Instruction::MakeChannel { debug_info, .. } => debug_info,
            crate::ir::Instruction::ChannelSend { debug_info, .. } => debug_info,
            crate::ir::Instruction::ChannelReceive { debug_info, .. } => debug_info,
            crate::ir::Instruction::MakeGoroutine { debug_info, .. } => debug_info,
            crate::ir::Instruction::GoRoutine { debug_info, .. } => debug_info,
            crate::ir::Instruction::MutexLock { debug_info, .. } => debug_info,
            crate::ir::Instruction::MutexUnlock { debug_info, .. } => debug_info,
            crate::ir::Instruction::ConditionWait { debug_info, .. } => debug_info,
            crate::ir::Instruction::ConditionSignal { debug_info, .. } => debug_info,
            crate::ir::Instruction::ConditionBroadcast { debug_info, .. } => debug_info,
            // Atomic operations
            crate::ir::Instruction::AtomicLoad { debug_info, .. } => debug_info,
            crate::ir::Instruction::AtomicStore { debug_info, .. } => debug_info,
            crate::ir::Instruction::AtomicExchange { debug_info, .. } => debug_info,
            crate::ir::Instruction::AtomicCompareExchange { debug_info, .. } => debug_info,
            crate::ir::Instruction::AtomicFetchAdd { debug_info, .. } => debug_info,
            crate::ir::Instruction::AtomicFetchSub { debug_info, .. } => debug_info,
        };

        // Check for breakpoints at the instruction
        if let Some(ref debug_info) = debug_info {
            self.current_line = debug_info.line;
            if self.has_breakpoint(&debug_info.file_name, debug_info.line) {
                self.handle_breakpoint(&debug_info.file_name, debug_info.line)?;
            }
        }

        Ok(())
    }

    /// Handle a breakpoint
    fn handle_breakpoint(&mut self, file_name: &str, line: usize) -> Result<(), String> {
        println!("Breakpoint hit at {} line {}", file_name, line);
        self.show_debug_prompt()?;
        Ok(())
    }

    /// Show the debug prompt and handle user commands
    fn show_debug_prompt(&mut self) -> Result<(), String> {
        loop {
            print!("(dbg) ");
            io::stdout().flush().unwrap();

            let mut input = String::new();
            io::stdin().read_line(&mut input).unwrap();
            let input = input.trim();

            match input {
                "continue" | "c" => {
                    println!("Continuing execution...");
                    break;
                }
                "step" | "s" => {
                    println!("Stepping to next line...");
                    break;
                }
                "next" | "n" => {
                    println!("Stepping over...");
                    break;
                }
                "print" | "p" => {
                    self.print_variables();
                }
                "list" | "l" => {
                    self.list_source();
                }
                "backtrace" | "bt" => {
                    self.show_backtrace();
                }
                "quit" | "q" => {
                    println!("Quitting debugger...");
                    self.running = false;
                    break;
                }
                "help" | "h" => {
                    self.show_help();
                }
                "" => {
                    // Empty input, show prompt again
                }
                _ => {
                    if input.starts_with("print ") || input.starts_with("p ") {
                        let parts: Vec<&str> = input.split_whitespace().collect();
                        if parts.len() >= 2 {
                            self.print_variable(parts[1]);
                        } else {
                            println!("Usage: print <variable_name>");
                        }
                    } else {
                        println!("Unknown command: {}", input);
                        self.show_help();
                    }
                }
            }
        }

        Ok(())
    }

    /// Print all variables in the current scope
    fn print_variables(&self) {
        if self.variables.is_empty() {
            println!("No variables in current scope");
        } else {
            println!("Variables in current scope:");
            for (name, value) in &self.variables {
                println!("  {} = {} ({})", name, value.value, value.type_name);
            }
        }
    }

    /// Print a specific variable
    fn print_variable(&self, name: &str) {
        if let Some(value) = self.variables.get(name) {
            println!("{} = {} ({})", name, value.value, value.type_name);
        } else {
            println!("Variable '{}' not found", name);
        }
    }

    /// List source code around current line
    fn list_source(&self) {
        println!("Source code around line {} in function {}",
                 self.current_line, self.current_function);
        // In a real implementation, this would show actual source code
        println!("  (Source code display would be implemented here)");
    }

    /// Show call stack/backtrace
    fn show_backtrace(&self) {
        println!("Call stack:");
        println!("  #0  {} at line {}", self.current_function, self.current_line);
        // In a real implementation, this would show the full call stack
        println!("  (Full call stack would be implemented here)");
    }

    /// Show help information
    fn show_help(&self) {
        println!("Debugger commands:");
        println!("  continue (c)     - Continue execution");
        println!("  step (s)         - Step to next line");
        println!("  next (n)         - Step over function calls");
        println!("  print (p)        - Print variables in current scope");
        println!("  print <var>      - Print specific variable");
        println!("  list (l)         - Show source code");
        println!("  backtrace (bt)   - Show call stack");
        println!("  quit (q)         - Quit debugger");
        println!("  help (h)         - Show this help");
    }

    /// Add a variable to the debug context
    pub fn add_variable(&mut self, name: String, value: String, type_name: String, scope: String) {
        let debug_value = DebugValue {
            value,
            type_name,
            scope,
        };
        self.variables.insert(name, debug_value);
    }

    /// Remove a variable from the debug context
    pub fn remove_variable(&mut self, name: &str) {
        self.variables.remove(name);
    }

    /// Get a variable's value
    pub fn get_variable(&self, name: &str) -> Option<&DebugValue> {
        self.variables.get(name)
    }

    /// Check if the debugger is running
    pub fn is_running(&self) -> bool {
        self.running
    }

    /// Inspect a value and add it to the debug context
    pub fn inspect_value(&mut self, name: &str, value: &str, type_name: &str, scope: &str) {
        self.add_variable(
            name.to_string(),
            value.to_string(),
            type_name.to_string(),
            scope.to_string()
        );
        println!("Inspected variable: {} = {} ({})", name, value, type_name);

        // Check watchpoints
        self.check_watchpoints(name, value);
    }

    /// Get all variables in the current scope
    pub fn get_variables(&self) -> &HashMap<String, DebugValue> {
        &self.variables
    }

    /// Clear all variables
    pub fn clear_variables(&mut self) {
        self.variables.clear();
    }

    /// List all breakpoints
    pub fn list_breakpoints(&self) -> &HashMap<String, Vec<Breakpoint>> {
        &self.breakpoints
    }

    /// List all watchpoints
    pub fn list_watchpoints(&self) -> &HashMap<String, Watchpoint> {
        &self.watchpoints
    }
}

/// Create a new debugger
pub fn create_debugger() -> Debugger {
    Debugger::new()
}
