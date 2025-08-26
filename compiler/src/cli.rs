//! Simple CLI interface for KODEON Foundation (v0.x)
//! Provides basic compilation and execution capabilities

use std::env;
use std::fs;
use std::process::Command;
use clap::Parser;

/// KODEON Foundation CLI
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct CliArgs {
    /// Input KODEON source file
    #[clap(value_parser)]
    input: String,

    /// Output target: python, javascript, or execute
    #[clap(short, long, value_parser, default_value = "execute")]
    target: String,

    /// Output file path (optional)
    #[clap(short, long, value_parser)]
    output: Option<String>,

    /// Verbose output
    #[clap(short, long, action)]
    verbose: bool,

    /// Show version information
    #[clap(short = 'V', long, action)]
    version: bool,
}

/// Main entry point for the KODEON Foundation CLI
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
    let args = CliArgs::parse();

    if args.version {
        println!("KODEON Foundation v{}", env!("CARGO_PKG_VERSION"));
        return Ok(());
    }

    if args.verbose {
        println!("KODEON Foundation v{}", env!("CARGO_PKG_VERSION"));
        println!("Processing file: {}", args.input);
        println!("Target: {}", args.target);
    }

    // Read the source file
    let source_code = fs::read_to_string(&args.input)?;

    if args.verbose {
        println!("Source code loaded ({} bytes)", source_code.len());
    }

    // Parse the source code
    let mut parser = crate::simplified_parser::SimpleParser::new(&source_code)?;
    let ast = parser.parse_program()?;

    if args.verbose {
        println!("Parsing completed successfully");
    }

    // Generate output based on target
    match args.target.as_str() {
        "python" | "py" => {
            let python_code = crate::simplified_parser::PythonTranspiler::transpile(&ast)?;
            save_or_execute_output(&python_code, &args.output, "py", args.verbose)?;
        }
        "javascript" | "js" => {
            let js_code = crate::simplified_parser::JavaScriptTranspiler::transpile(&ast)?;
            save_or_execute_output(&js_code, &args.output, "js", args.verbose)?;
        }
        "execute" | "run" => {
            // Transpile to Python and execute
            let python_code = crate::simplified_parser::PythonTranspiler::transpile(&ast)?;
            execute_python_code(&python_code, args.verbose)?;
        }
        _ => {
            return Err(format!("Unknown target: {}. Supported targets: python, javascript, execute", args.target).into());
        }
    }

    Ok(())
}

/// Save output to file or print to stdout
fn save_or_execute_output(code: &str, output: &Option<String>, extension: &str, verbose: bool) -> Result<(), Box<dyn std::error::Error>> {
    match output {
        Some(output_path) => {
            fs::write(output_path, code)?;
            if verbose {
                println!("Output written to: {}", output_path);
            }
        }
        None => {
            println!("{}", code);
        }
    }
    Ok(())
}

/// Execute Python code directly
fn execute_python_code(code: &str, verbose: bool) -> Result<(), Box<dyn std::error::Error>> {
    // Create a temporary file
    let temp_file = std::env::temp_dir().join("kodeon_temp.py");
    fs::write(&temp_file, code)?;

    if verbose {
        println!("Executing Python code...");
    }

    // Execute the Python code
    let output = Command::new("python")
        .arg(&temp_file)
        .output()?;

    if verbose {
        println!("Execution completed");
    }

    // Print stdout
    if !output.stdout.is_empty() {
        println!("{}", String::from_utf8_lossy(&output.stdout));
    }

    // Print stderr if any
    if !output.stderr.is_empty() {
        eprintln!("{}", String::from_utf8_lossy(&output.stderr));
    }

    // Remove temporary file
    let _ = fs::remove_file(&temp_file);

    Ok(())
}

/// Example KODEON programs for testing
pub mod examples {
    pub const HELLO_WORLD: &str = r#"// Hello World in KODEON
x = "Hello, World!"
print(x)
"#;

    pub const SIMPLE_FUNCTION: &str = r#"// Simple function example
function greet(name):
    return "Hello, " + name + "!"

message = greet("KODEON")
print(message)
"#;

    pub const LOOP_EXAMPLE: &str = r#"// Loop example
counter = 0
while counter < 5:
    print("Counter: " + counter)
    counter = counter + 1
"#;

    pub const CONDITIONAL_EXAMPLE: &str = r#"// Conditional example
x = 10
if x > 5:
    print("x is greater than 5")
else:
    print("x is 5 or less")
"#;

    pub const FOR_LOOP_EXAMPLE: &str = r#"// For loop example
for i in range(5):
    print("Number: " + i)
"#;

    pub const STANDARD_LIBRARY_EXAMPLE: &str = r#"// Standard library example
message = "Hello, KODEON!"
length = len(message)
print("Message: " + message)
print("Length: " + length)

// Range example
numbers = range(1, 6)
print("Numbers: " + numbers)
"#;
}
