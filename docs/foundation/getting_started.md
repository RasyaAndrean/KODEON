# 🚀 Getting Started with KODEON Foundation (v0.1)

Welcome to KODEON Foundation, the simple and clear beginning of the KODEON programming language journey!

## What is KODEON Foundation?

KODEON Foundation (v0.1) is the first publicly available version of the KODEON programming language. It focuses on providing a minimal, easy-to-understand implementation with core programming concepts:

- Variables and assignment
- Functions and function calls
- Conditional statements (if/else)
- Loops (while, for)
- Input/output operations
- Basic expressions and operators

## Installation

### Prerequisites

- Rust and Cargo (for building from source)
- Python 3.x (for execution)
- Node.js (optional, for JavaScript transpilation)

### Building from Source

```bash
# Clone the repository
git clone https://github.com/kodeon-lang/kodeon.git
cd kodeon/compiler/foundation

# Build the compiler
cargo build --release

# The compiler binary will be in target/release/
```

### Using Pre-built Binaries

Pre-built binaries will be available in future releases.

## Your First KODEON Program

Create a file called `hello.kodeon`:

```kodeon
// Hello World in KODEON
message = "Hello, World!"
print(message)
```

Run it directly:

```bash
kodeon hello.kodeon
```

## Core Syntax

### Variables and Assignment

```kodeon
// Variable assignment
name = "KODEON"
age = 7
isAwesome = true

// Mathematical expressions
result = 5 + 3 * 2
```

### Functions

```kodeon
// Function definition
function greet(name):
    return "Hello, " + name + "!"

// Function call
message = greet("World")
print(message)
```

### Conditional Statements

```kodeon
x = 10

if x > 5:
    print("x is greater than 5")
else:
    print("x is 5 or less")
```

### Loops

```kodeon
// While loop
counter = 0
while counter < 5:
    print("Count: " + counter)
    counter = counter + 1

// For loop
for i in range(1, 6):
    print("Number: " + i)
```

### Input/Output

```kodeon
// Print to console
print("Hello, World!")

// In future versions, we'll add input functionality
```

## Compilation Targets

KODEON Foundation supports multiple targets:

### Execute Directly (Default)

```bash
kodeon program.kodeon
```

This transpiles to Python and executes immediately.

### Python Transpilation

```bash
kodeon program.kodeon -t python -o output.py
```

### JavaScript Transpilation

```bash
kodeon program.kodeon -t javascript -o output.js
```

## Example Programs

### Calculator

```kodeon
function add(a, b):
    return a + b

function multiply(a, b):
    return a * b

result = add(5, 3)
print("5 + 3 = " + result)

product = multiply(4, 7)
print("4 * 7 = " + product)
```

### Simple Loop Example

```kodeon
// Print numbers 1 to 10
for i in range(1, 11):
    print("Number: " + i)
```

### Conditional Logic

```kodeon
function checkAge(age):
    if age >= 18:
        return "Adult"
    else:
        return "Minor"

status = checkAge(25)
print("Status: " + status)
```

## Supported Features

### Language Features

- Variable declaration and assignment
- Mathematical and logical expressions
- Function definitions and calls
- If/else conditional statements
- While and for loops
- Print statements

### Operators

- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logical: `and`, `or`, `not`

### Data Types

- Numbers (integers and floats)
- Strings
- Booleans (`true`, `false`)

## Limitations

This is a foundation version with intentional limitations:

- No classes or object-oriented features
- No advanced data structures (lists, maps, etc.)
- No error handling constructs
- No module/import system
- Limited standard library
- No complex type system

These features will be added in future versions.

## Next Steps

1. Try the example programs in the `examples/foundation/` directory
2. Experiment with writing your own simple programs
3. Check out the more advanced KODEON implementation in the main compiler
4. Join the KODEON community to contribute to future development

## Getting Help

- Documentation: https://docs.kodeon.dev
- GitHub Issues: https://github.com/kodeon-lang/kodeon/issues
- Community Discord: https://discord.gg/kodeon

---

Happy coding with KODEON! 🌟
