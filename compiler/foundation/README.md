# KODEON Foundation (v0.1)

The foundation version of the KODEON programming language - simple, clear, and immediately usable.

## 🎯 Purpose

KODEON Foundation is the minimal viable implementation of the KODEON programming language, designed to:

- Provide a simple and clear introduction to KODEON
- Demonstrate core language concepts
- Enable immediate usage with Python transpilation
- Serve as a stepping stone to the full KODEON implementation

## 🚀 Features

### Core Language Features

- Variables and assignment
- Functions and function calls
- Conditional statements (if/else)
- Loops (while, for)
- Input/output operations
- Basic expressions and operators

### Compilation Targets

- **Python**: Transpile to Python for immediate execution
- **JavaScript**: Transpile to JavaScript for web usage
- **Direct Execution**: Transpile and run immediately

### Supported Syntax

```
// Variables
x = 5
name = "KODEON"

// Functions
function greet(name):
    return "Hello, " + name + "!"

// Conditionals
if x > 5:
    print("Greater")
else:
    print("Less or equal")

// Loops
while counter < 10:
    print(counter)
    counter = counter + 1

for i in range(1, 6):
    print(i)
```

## 📦 Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/kodeon-lang/kodeon.git
cd kodeon/compiler/foundation

# Build
cargo build --release

# Run
./target/release/kodeon examples/hello_world.kodeon
```

### Prerequisites

- Rust and Cargo (for building)
- Python 3.x (for execution)
- Node.js (optional, for JavaScript target)

## 🚀 Quick Start

1. Create a simple KODEON file (`hello.kodeon`):

```kodeon
message = "Hello, World!"
print(message)
```

2. Run it directly:

```bash
kodeon hello.kodeon
```

3. Or transpile to Python:

```bash
kodeon hello.kodeon -t python -o hello.py
python hello.py
```

## 📚 Documentation

- [Getting Started Guide](../../docs/foundation/getting_started.md)
- [Language Reference](../../docs/foundation/language_reference.md)
- [Examples](../../examples/foundation/)

## 🛣️ Roadmap

### Foundation (v0.x)

- ✅ Core syntax implementation
- ✅ Python transpilation
- ✅ JavaScript transpilation
- ✅ Basic CLI interface

### Basic Features (v1.0)

- Standard library foundation
- Package manager
- Human-readable error messages
- Python/JavaScript interoperability
- Built-in testing framework

### Multi-Role Expansion (v2.0)

- Web development support
- AI/ML integration
- Game development kit
- Automation & scripting
- Embedded readiness

## 🤝 Contributing

We welcome contributions to KODEON Foundation! Here's how you can help:

1. Report bugs and issues
2. Suggest new features
3. Improve documentation
4. Add new examples
5. Fix bugs in the code

See our [Contributing Guide](../../docs/CONTRIBUTING.md) for more details.

## 📄 License

KODEON Foundation is licensed under either of:

- Apache License, Version 2.0
- MIT License

at your option.

## 🌟 Community

- **GitHub**: [kodeon-lang/kodeon](https://github.com/kodeon-lang/kodeon)
- **Discord**: [KODEON Community](https://discord.gg/kodeon)
- **Twitter**: [@kodeonlang](https://twitter.com/kodeonlang)

---

_Made with ❤️ by the KODEON community_
