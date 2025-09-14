//! Command-line interface for the KODEON debugger

use crate::debugger::Debugger;
use crate::ir::IRModule;
use std::io::{self, Write};

/// Command-line interface for the debugger
pub struct DebuggerCLI {
    debugger: Debugger,
}

impl DebuggerCLI {
    /// Create a new debugger CLI
    pub fn new() -> Self {
        DebuggerCLI {
            debugger: Debugger::new(),
        }
    }

    /// Start the debugger CLI with the given IR module
    pub fn start(&mut self, module: &IRModule) -> Result<(), String> {
        println!("KODEON Debugger");
        println!("Type 'help' for available commands");
        println!();

        // Start debugging the module
        self.debugger.debug(module)?;

        Ok(())
    }

    /// Process a debugger command
    pub fn process_command(&mut self, command: &str) -> Result<bool, String> {
        let parts: Vec<&str> = command.split_whitespace().collect();

        if parts.is_empty() {
            return Ok(true);
        }

        match parts[0] {
            "break" | "b" => {
                if parts.len() >= 3 {
                    let file_name = parts[1];
                    let line = parts[2].parse::<usize>().map_err(|_| "Invalid line number")?;
                    self.debugger.add_breakpoint(file_name, line);
                } else {
                    println!("Usage: break <file> <line>");
                }
            }
            "delete" | "d" => {
                if parts.len() >= 2 {
                    if parts.len() >= 3 {
                        // Delete breakpoint
                        let file_name = parts[1];
                        let line = parts[2].parse::<usize>().map_err(|_| "Invalid line number")?;
                        self.debugger.remove_breakpoint(file_name, line);
                    } else {
                        // Delete watchpoint
                        let var_name = parts[1];
                        self.debugger.remove_watchpoint(var_name);
                    }
                } else {
                    println!("Usage: delete <file> <line> or delete <variable>");
                }
            }
            "condition" => {
                if parts.len() >= 4 {
                    let file_name = parts[1];
                    let line = parts[2].parse::<usize>().map_err(|_| "Invalid line number")?;
                    let condition = parts[3..].join(" ");
                    self.debugger.set_conditional_breakpoint(file_name, line, condition);
                } else {
                    println!("Usage: condition <file> <line> <condition>");
                }
            }
            "run" | "r" => {
                println!("Running program...");
                // In a real implementation, this would start program execution
            }
            "continue" | "c" => {
                println!("Continuing execution...");
                return Ok(false); // Exit command loop
            }
            "step" | "s" => {
                println!("Stepping to next line...");
                return Ok(false); // Exit command loop
            }
            "next" | "n" => {
                println!("Stepping over...");
                return Ok(false); // Exit command loop
            }
            "print" | "p" => {
                if parts.len() >= 2 {
                    let var_name = parts[1];
                    if let Some(value) = self.debugger.get_variable(var_name) {
                        println!("{} = {} ({})", var_name, value.value, value.type_name);
                    } else {
                        println!("Variable '{}' not found", var_name);
                    }
                } else {
                    self.debugger.print_variables();
                }
            }
            "inspect" => {
                if parts.len() >= 5 {
                    let name = parts[1];
                    let value = parts[2];
                    let type_name = parts[3];
                    let scope = parts[4];
                    self.debugger.inspect_value(name, value, type_name, scope);
                } else {
                    println!("Usage: inspect <name> <value> <type> <scope>");
                }
            }
            "list" | "l" => {
                self.debugger.list_source();
            }
            "backtrace" | "bt" => {
                self.debugger.show_backtrace();
            }
            "info" => {
                if parts.len() >= 2 {
                    match parts[1] {
                        "breakpoints" => {
                            let breakpoints = self.debugger.list_breakpoints();
                            if breakpoints.is_empty() {
                                println!("No breakpoints set");
                            } else {
                                println!("Breakpoints:");
                                for (file_name, breakpoints) in breakpoints {
                                    for breakpoint in breakpoints {
                                        println!("  {}:{} (enabled: {})", file_name, breakpoint.line, breakpoint.enabled);
                                        if let Some(ref condition) = breakpoint.condition {
                                            println!("    Condition: {}", condition);
                                        }
                                    }
                                }
                            }
                        }
                        "variables" => {
                            self.debugger.print_variables();
                        }
                        "functions" => {
                            println!("Functions:");
                            // In a real implementation, this would show all functions
                            println!("  (Function list would be implemented here)");
                        }
                        "watchpoints" => {
                            let watchpoints = self.debugger.list_watchpoints();
                            if watchpoints.is_empty() {
                                println!("No watchpoints set");
                            } else {
                                println!("Watchpoints:");
                                for (var_name, watchpoint) in watchpoints {
                                    println!("  {} (enabled: {})", var_name, watchpoint.enabled);
                                    if let Some(ref condition) = watchpoint.condition {
                                        println!("    Condition: {}", condition);
                                    }
                                    if let Some(ref last_value) = watchpoint.last_value {
                                        println!("    Last value: {}", last_value);
                                    }
                                }
                            }
                        }
                        _ => {
                            println!("Usage: info [breakpoints|variables|functions|watchpoints]");
                        }
                    }
                } else {
                    println!("Usage: info [breakpoints|variables|functions|watchpoints]");
                }
            }
            "watch" => {
                if parts.len() >= 2 {
                    let var_name = parts[1];
                    if parts.len() >= 4 && parts[2] == "condition" {
                        let condition = parts[3..].join(" ");
                        self.debugger.set_conditional_watchpoint(var_name, condition);
                    } else {
                        self.debugger.add_watchpoint(var_name);
                    }
                } else {
                    println!("Usage: watch <variable> [condition <condition>]");
                }
            }
            "eval" => {
                if parts.len() >= 2 {
                    let expression = parts[1..].join(" ");
                    println!("Evaluating: {}", expression);
                    // In a real implementation, this would evaluate the expression
                } else {
                    println!("Usage: eval <expression>");
                }
            }
            "quit" | "q" => {
                println!("Quitting debugger...");
                return Ok(false); // Exit command loop
            }
            "help" | "h" => {
                self.show_help();
            }
            _ => {
                println!("Unknown command: {}", parts[0]);
                self.show_help();
            }
        }

        Ok(true) // Continue command loop
    }

    /// Show help information
    fn show_help(&self) {
        println!("Debugger commands:");
        println!("  break (b) <file> <line>     - Set breakpoint at line");
        println!("  delete (d) <file> <line>    - Delete breakpoint at line");
        println!("  delete <variable>           - Delete watchpoint for variable");
        println!("  condition <file> <line> <condition> - Set conditional breakpoint");
        println!("  run (r)                     - Start program execution");
        println!("  continue (c)                - Continue execution");
        println!("  step (s)                    - Step to next line");
        println!("  next (n)                    - Step over function calls");
        println!("  print (p) [<variable>]      - Print variable value or all variables");
        println!("  inspect <name> <value> <type> <scope> - Inspect a value");
        println!("  list (l)                    - Show source code");
        println!("  backtrace (bt)              - Show call stack");
        println!("  info [breakpoints|variables|functions|watchpoints] - Show program information");
        println!("  watch <variable>            - Watch variable for changes");
        println!("  watch <variable> condition <condition> - Set conditional watchpoint");
        println!("  eval <expression>           - Evaluate expression");
        println!("  quit (q)                    - Exit debugger");
        println!("  help (h)                    - Show this help");
    }

    /// Run the interactive debugger CLI
    pub fn run_interactive(&mut self) -> Result<(), String> {
        println!("KODEON Interactive Debugger");
        println!("Type 'help' for available commands");
        println!();

        loop {
            print!("(kodeon-dbg) ");
            io::stdout().flush().unwrap();

            let mut input = String::new();
            io::stdin().read_line(&mut input).unwrap();
            let input = input.trim();

            if !self.process_command(input)? {
                break;
            }
        }

        Ok(())
    }
}

/// Create a new debugger CLI
pub fn create_debugger_cli() -> DebuggerCLI {
    DebuggerCLI::new()
}
