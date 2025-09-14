//! Test for the KODEON debugger functionality

#[cfg(test)]
mod tests {
    use kodeon_compiler::debugger::Debugger;
    use kodeon_compiler::ir::{IRModule, Function, BasicBlock, Instruction, Type, DebugInfo};

    #[test]
    fn test_debugger_creation() {
        let debugger = Debugger::new();
        assert!(!debugger.is_running());
    }

    #[test]
    fn test_breakpoint_management() {
        let mut debugger = Debugger::new();

        // Add a breakpoint
        debugger.add_breakpoint("test.kodeon", 10);

        // Check if breakpoint exists
        let breakpoints = debugger.list_breakpoints();
        assert!(breakpoints.contains_key("test.kodeon"));
        assert_eq!(breakpoints.get("test.kodeon").unwrap().len(), 1);
        assert_eq!(breakpoints.get("test.kodeon").unwrap()[0].line, 10);

        // Remove breakpoint
        debugger.remove_breakpoint("test.kodeon", 10);
        let breakpoints = debugger.list_breakpoints();
        assert!(breakpoints.get("test.kodeon").map_or(true, |bps| bps.is_empty()));
    }

    #[test]
    fn test_conditional_breakpoint() {
        let mut debugger = Debugger::new();

        // Add a conditional breakpoint
        debugger.set_conditional_breakpoint("test.kodeon", 15, "x > 5".to_string());

        // Check if breakpoint exists
        let breakpoints = debugger.list_breakpoints();
        assert!(breakpoints.contains_key("test.kodeon"));
        assert_eq!(breakpoints.get("test.kodeon").unwrap().len(), 1);
        assert_eq!(breakpoints.get("test.kodeon").unwrap()[0].line, 15);
        assert_eq!(breakpoints.get("test.kodeon").unwrap()[0].condition, Some("x > 5".to_string()));
    }

    #[test]
    fn test_variable_management() {
        let mut debugger = Debugger::new();

        // Add a variable
        debugger.add_variable(
            "x".to_string(),
            "10".to_string(),
            "int".to_string(),
            "local".to_string()
        );

        // Check if variable exists
        let var = debugger.get_variable("x");
        assert!(var.is_some());
        if let Some(debug_var) = var {
            assert_eq!(debug_var.value, "10");
            assert_eq!(debug_var.type_name, "int");
            assert_eq!(debug_var.scope, "local");
        }

        // Remove variable
        debugger.remove_variable("x");
        assert!(debugger.get_variable("x").is_none());
    }

    #[test]
    fn test_debug_info_struct() {
        let debug_info = DebugInfo::new("test.kodeon".to_string(), 10, 5);
        assert_eq!(debug_info.file_name, "test.kodeon");
        assert_eq!(debug_info.line, 10);
        assert_eq!(debug_info.column, 5);
    }

    #[test]
    fn test_debug_info_with_scope() {
        let debug_info = DebugInfo::with_scope("test.kodeon".to_string(), 10, 5, "main".to_string());
        assert_eq!(debug_info.file_name, "test.kodeon");
        assert_eq!(debug_info.line, 10);
        assert_eq!(debug_info.column, 5);
        assert_eq!(debug_info.scope, Some("main".to_string()));
    }

    #[test]
    fn test_debug_info_with_function() {
        let debug_info = DebugInfo::new("test.kodeon".to_string(), 10, 5)
            .with_function("main".to_string());
        assert_eq!(debug_info.file_name, "test.kodeon");
        assert_eq!(debug_info.line, 10);
        assert_eq!(debug_info.column, 5);
        assert_eq!(debug_info.function, Some("main".to_string()));
    }

    #[test]
    fn test_debug_info_with_module() {
        let debug_info = DebugInfo::new("test.kodeon".to_string(), 10, 5)
            .with_module("test_module".to_string());
        assert_eq!(debug_info.file_name, "test.kodeon");
        assert_eq!(debug_info.line, 10);
        assert_eq!(debug_info.column, 5);
        assert_eq!(debug_info.module, Some("test_module".to_string()));
    }

    #[test]
    fn test_variable_inspection() {
        let mut debugger = Debugger::new();

        // Inspect a value
        debugger.inspect_value("y", "20", "int", "local");

        // Check if variable was added
        let var = debugger.get_variable("y");
        assert!(var.is_some());
        if let Some(debug_var) = var {
            assert_eq!(debug_var.value, "20");
            assert_eq!(debug_var.type_name, "int");
            assert_eq!(debug_var.scope, "local");
        }
    }

    #[test]
    fn test_clear_variables() {
        let mut debugger = Debugger::new();

        // Add variables
        debugger.add_variable(
            "a".to_string(),
            "1".to_string(),
            "int".to_string(),
            "local".to_string()
        );
        debugger.add_variable(
            "b".to_string(),
            "2".to_string(),
            "int".to_string(),
            "local".to_string()
        );

        // Check variables exist
        assert!(debugger.get_variable("a").is_some());
        assert!(debugger.get_variable("b").is_some());

        // Clear variables
        debugger.clear_variables();

        // Check variables were removed
        assert!(debugger.get_variable("a").is_none());
        assert!(debugger.get_variable("b").is_none());
    }

    #[test]
    fn test_get_variables() {
        let mut debugger = Debugger::new();

        // Add variables
        debugger.add_variable(
            "x".to_string(),
            "10".to_string(),
            "int".to_string(),
            "local".to_string()
        );
        debugger.add_variable(
            "name".to_string(),
            "KODEON".to_string(),
            "string".to_string(),
            "global".to_string()
        );

        // Get all variables
        let variables = debugger.get_variables();
        assert_eq!(variables.len(), 2);
        assert!(variables.contains_key("x"));
        assert!(variables.contains_key("name"));
    }

    #[test]
    fn test_watchpoint_management() {
        let mut debugger = Debugger::new();

        // Add a watchpoint
        debugger.add_watchpoint("test_var");

        // Check if watchpoint exists
        let watchpoints = debugger.list_watchpoints();
        assert!(watchpoints.contains_key("test_var"));
        assert_eq!(watchpoints.get("test_var").unwrap().variable_name, "test_var");

        // Remove watchpoint
        debugger.remove_watchpoint("test_var");

        // Check if watchpoint was removed
        let watchpoints = debugger.list_watchpoints();
        assert!(!watchpoints.contains_key("test_var"));
    }

    #[test]
    fn test_conditional_watchpoint() {
        let mut debugger = Debugger::new();

        // Add a conditional watchpoint
        debugger.set_conditional_watchpoint("test_var", "x > 5".to_string());

        // Check if watchpoint exists
        let watchpoints = debugger.list_watchpoints();
        assert!(watchpoints.contains_key("test_var"));
        assert_eq!(watchpoints.get("test_var").unwrap().variable_name, "test_var");
        assert_eq!(watchpoints.get("test_var").unwrap().condition, Some("x > 5".to_string()));
    }

    #[test]
    fn test_watchpoint_checking() {
        let mut debugger = Debugger::new();

        // Add a watchpoint
        debugger.add_watchpoint("counter");

        // Check if variable change is detected
        let changed = debugger.check_watchpoints("counter", "10");
        assert!(changed);

        // Check if same value doesn't trigger change
        let changed = debugger.check_watchpoints("counter", "10");
        assert!(!changed);

        // Check if different value triggers change
        let changed = debugger.check_watchpoints("counter", "15");
        assert!(changed);
    }

    #[test]
    fn test_breakpoint_listing() {
        let mut debugger = Debugger::new();

        // Add breakpoints
        debugger.add_breakpoint("test1.kodeon", 10);
        debugger.add_breakpoint("test2.kodeon", 20);
        debugger.set_conditional_breakpoint("test3.kodeon", 30, "x > 5".to_string());

        // List breakpoints
        let breakpoints = debugger.list_breakpoints();
        assert_eq!(breakpoints.len(), 3);
        assert!(breakpoints.contains_key("test1.kodeon"));
        assert!(breakpoints.contains_key("test2.kodeon"));
        assert!(breakpoints.contains_key("test3.kodeon"));
    }

    #[test]
    fn test_watchpoint_listing() {
        let mut debugger = Debugger::new();

        // Add watchpoints
        debugger.add_watchpoint("var1");
        debugger.add_watchpoint("var2");
        debugger.set_conditional_watchpoint("var3", "y < 10".to_string());

        // List watchpoints
        let watchpoints = debugger.list_watchpoints();
        assert_eq!(watchpoints.len(), 3);
        assert!(watchpoints.contains_key("var1"));
        assert!(watchpoints.contains_key("var2"));
        assert!(watchpoints.contains_key("var3"));
    }

    #[test]
    fn test_print_variable() {
        let mut debugger = Debugger::new();

        // Add a variable
        debugger.add_variable(
            "test_var".to_string(),
            "42".to_string(),
            "int".to_string(),
            "local".to_string()
        );

        // Check variable exists
        let var = debugger.get_variable("test_var");
        assert!(var.is_some());

        // Check non-existent variable
        let var = debugger.get_variable("non_existent");
        assert!(var.is_none());
    }

    #[test]
    fn test_print_variables() {
        let mut debugger = Debugger::new();

        // Add variables
        debugger.add_variable(
            "x".to_string(),
            "10".to_string(),
            "int".to_string(),
            "local".to_string()
        );
        debugger.add_variable(
            "y".to_string(),
            "20".to_string(),
            "int".to_string(),
            "local".to_string()
        );

        // Check variables exist
        let variables = debugger.get_variables();
        assert_eq!(variables.len(), 2);

        // Clear variables and check
        debugger.clear_variables();
        let variables = debugger.get_variables();
        assert_eq!(variables.len(), 0);
    }
}
