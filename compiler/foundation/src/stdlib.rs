//! Simple Standard Library for KODEON Foundation (v0.1)
//! Basic implementations of common functions

use std::collections::HashMap;

/// Standard library functions available in KODEON Foundation
pub struct StandardLibrary {
    functions: HashMap<String, StdLibFunction>,
}

/// Standard library function signature
pub type StdLibFunction = fn(Vec<String>) -> Result<String, String>;

impl StandardLibrary {
    /// Create a new standard library instance
    pub fn new() -> Self {
        let mut stdlib = StandardLibrary {
            functions: HashMap::new(),
        };

        // Register built-in functions
        stdlib.register_function("print", print_function);
        stdlib.register_function("len", len_function);
        stdlib.register_function("str", str_function);
        stdlib.register_function("int", int_function);
        stdlib.register_function("float", float_function);
        stdlib.register_function("range", range_function);

        stdlib
    }

    /// Register a new function in the standard library
    pub fn register_function(&mut self, name: &str, function: StdLibFunction) {
        self.functions.insert(name.to_string(), function);
    }

    /// Check if a function exists in the standard library
    pub fn has_function(&self, name: &str) -> bool {
        self.functions.contains_key(name)
    }

    /// Call a standard library function
    pub fn call_function(&self, name: &str, args: Vec<String>) -> Result<String, String> {
        match self.functions.get(name) {
            Some(function) => function(args),
            None => Err(format!("Function '{}' not found in standard library", name)),
        }
    }

    /// Get list of all available functions
    pub fn list_functions(&self) -> Vec<String> {
        self.functions.keys().cloned().collect()
    }
}

/// Print function - outputs values to console
fn print_function(args: Vec<String>) -> Result<String, String> {
    let output = args.join(" ");
    println!("{}", output);
    Ok("".to_string()) // Print returns nothing
}

/// Length function - returns length of string
fn len_function(args: Vec<String>) -> Result<String, String> {
    if args.len() != 1 {
        return Err("len() expects exactly one argument".to_string());
    }

    Ok(args[0].len().to_string())
}

/// String conversion function
fn str_function(args: Vec<String>) -> Result<String, String> {
    if args.len() != 1 {
        return Err("str() expects exactly one argument".to_string());
    }

    Ok(args[0].clone())
}

/// Integer conversion function
fn int_function(args: Vec<String>) -> Result<String, String> {
    if args.len() != 1 {
        return Err("int() expects exactly one argument".to_string());
    }

    match args[0].parse::<i64>() {
        Ok(value) => Ok(value.to_string()),
        Err(_) => Err(format!("Cannot convert '{}' to integer", args[0])),
    }
}

/// Float conversion function
fn float_function(args: Vec<String>) -> Result<String, String> {
    if args.len() != 1 {
        return Err("float() expects exactly one argument".to_string());
    }

    match args[0].parse::<f64>() {
        Ok(value) => Ok(value.to_string()),
        Err(_) => Err(format!("Cannot convert '{}' to float", args[0])),
    }
}

/// Range function - generates a sequence of numbers
fn range_function(args: Vec<String>) -> Result<String, String> {
    match args.len() {
        1 => {
            // range(stop)
            let stop = args[0].parse::<i64>()
                .map_err(|_| format!("Invalid argument for range: {}", args[0]))?;

            let mut result = Vec::new();
            for i in 0..stop {
                result.push(i.to_string());
            }
            Ok(format!("[{}]", result.join(", ")))
        }
        2 => {
            // range(start, stop)
            let start = args[0].parse::<i64>()
                .map_err(|_| format!("Invalid start argument for range: {}", args[0]))?;
            let stop = args[1].parse::<i64>()
                .map_err(|_| format!("Invalid stop argument for range: {}", args[1]))?;

            let mut result = Vec::new();
            for i in start..stop {
                result.push(i.to_string());
            }
            Ok(format!("[{}]", result.join(", ")))
        }
        3 => {
            // range(start, stop, step)
            let start = args[0].parse::<i64>()
                .map_err(|_| format!("Invalid start argument for range: {}", args[0]))?;
            let stop = args[1].parse::<i64>()
                .map_err(|_| format!("Invalid stop argument for range: {}", args[1]))?;
            let step = args[2].parse::<i64>()
                .map_err(|_| format!("Invalid step argument for range: {}", args[2]))?;

            if step == 0 {
                return Err("Step argument for range cannot be zero".to_string());
            }

            let mut result = Vec::new();
            if step > 0 {
                let mut i = start;
                while i < stop {
                    result.push(i.to_string());
                    i += step;
                }
            } else {
                let mut i = start;
                while i > stop {
                    result.push(i.to_string());
                    i += step;
                }
            }
            Ok(format!("[{}]", result.join(", ")))
        }
        _ => Err("range() expects 1-3 arguments".to_string())
    }
}

/// Mathematical functions module
pub mod math {
    /// Add two numbers
    pub fn add(a: f64, b: f64) -> f64 {
        a + b
    }

    /// Subtract two numbers
    pub fn subtract(a: f64, b: f64) -> f64 {
        a - b
    }

    /// Multiply two numbers
    pub fn multiply(a: f64, b: f64) -> f64 {
        a * b
    }

    /// Divide two numbers
    pub fn divide(a: f64, b: f64) -> Result<f64, String> {
        if b == 0.0 {
            Err("Division by zero".to_string())
        } else {
            Ok(a / b)
        }
    }

    /// Power function
    pub fn power(base: f64, exponent: f64) -> f64 {
        base.powf(exponent)
    }

    /// Square root
    pub fn sqrt(value: f64) -> Result<f64, String> {
        if value < 0.0 {
            Err("Cannot calculate square root of negative number".to_string())
        } else {
            Ok(value.sqrt())
        }
    }
}

/// String functions module
pub mod string {
    /// Concatenate strings
    pub fn concat(strings: Vec<String>) -> String {
        strings.join("")
    }

    /// Convert to uppercase
    pub fn to_upper(s: &str) -> String {
        s.to_uppercase()
    }

    /// Convert to lowercase
    pub fn to_lower(s: &str) -> String {
        s.to_lowercase()
    }

    /// Trim whitespace
    pub fn trim(s: &str) -> String {
        s.trim().to_string()
    }

    /// Split string by delimiter
    pub fn split(s: &str, delimiter: &str) -> Vec<String> {
        s.split(delimiter).map(|s| s.to_string()).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_standard_library_creation() {
        let stdlib = StandardLibrary::new();
        assert!(stdlib.has_function("print"));
        assert!(stdlib.has_function("len"));
        assert!(stdlib.has_function("str"));
    }

    #[test]
    fn test_print_function() {
        let result = print_function(vec!["Hello".to_string(), "World".to_string()]);
        assert!(result.is_ok());
    }

    #[test]
    fn test_len_function() {
        let result = len_function(vec!["Hello".to_string()]);
        assert_eq!(result.unwrap(), "5");
    }

    #[test]
    fn test_int_function() {
        let result = int_function(vec!["123".to_string()]);
        assert_eq!(result.unwrap(), "123");

        let result = int_function(vec!["abc".to_string()]);
        assert!(result.is_err());
    }

    #[test]
    fn test_range_function() {
        let result = range_function(vec!["5".to_string()]);
        assert_eq!(result.unwrap(), "[0, 1, 2, 3, 4]");

        let result = range_function(vec!["2".to_string(), "5".to_string()]);
        assert_eq!(result.unwrap(), "[2, 3, 4]");
    }

    #[test]
    fn test_math_functions() {
        assert_eq!(math::add(2.0, 3.0), 5.0);
        assert_eq!(math::subtract(5.0, 3.0), 2.0);
        assert_eq!(math::multiply(3.0, 4.0), 12.0);

        let result = math::divide(10.0, 2.0);
        assert_eq!(result.unwrap(), 5.0);

        let result = math::divide(10.0, 0.0);
        assert!(result.is_err());
    }

    #[test]
    fn test_string_functions() {
        assert_eq!(string::concat(vec!["Hello".to_string(), "World".to_string()]), "HelloWorld");
        assert_eq!(string::to_upper("hello"), "HELLO");
        assert_eq!(string::to_lower("HELLO"), "hello");
        assert_eq!(string::trim("  hello  "), "hello");
        assert_eq!(string::split("a,b,c", ","), vec!["a", "b", "c"]);
    }
}
