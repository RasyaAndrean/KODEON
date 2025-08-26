# 🚀 KODEON Programming Language

**The Easiest Programming Language to Learn in the World**

KODEON is a revolutionary programming language designed to be the easiest to learn while being versatile enough to support all application development needs. It simplifies programming by using a natural language-based syntax and eliminating unnecessary complexity.

## 🌟 Key Features

-   **Multi-language Support**: Write code in both Indonesian and English
-   **Intuitive Syntax**: Natural language-based programming
-   **Comprehensive Standard Library**: Rich set of built-in functions
-   **Package Management**: Import and use external libraries
-   **Cross-platform**: Runs on Windows, macOS, and Linux
-   **High Performance**: Compiles to efficient native code via LLVM
-   **Modern Concurrency**: Built-in support for concurrent programming
-   **Web Ready**: Transpiles to JavaScript for web development

## 📁 Project Structure

```
KODEON/
├── compiler/           # Rust-based compiler implementation
├── stdlib/             # Standard library modules
├── examples/           # Example programs
├── tests/              # Test suite
├── docs/               # Documentation
├── ide/                # Electron-based IDE
├── scripts/            # Build and utility scripts
└── research/           # Research and experimental features
```

### Compiler ([compiler/](compiler/))

The KODEON compiler is written in Rust and includes:

-   Lexer, parser, and semantic analyzer
-   Intermediate representation (IR)
-   LLVM backend for native compilation
-   JavaScript and Python transpilers
-   Package management system
-   Comprehensive test suite

### Standard Library ([stdlib/](stdlib/))

The standard library is organized into categories:

-   [Core](stdlib/core/) - Essential functions (types, math)
-   [Text](stdlib/text/) - Text manipulation and processing
-   [Data](stdlib/data/) - Data structures and formats (collections, JSON)
-   [System](stdlib/system/) - System interaction (IO, time, concurrency, file system)
-   [Web Modules](stdlib/web-modules/) - Web development and networking
-   [Security](stdlib/security/) - Security and cryptography
-   [Utilities](stdlib/utilities/) - Utility functions (logging)
-   [Encoding](stdlib/encoding/) - Data encoding and decoding
-   [Reflection](stdlib/reflect/) - Runtime reflection capabilities
-   [Testing](stdlib/testing/) - Testing framework utilities
-   [Domain-Specific](stdlib/domain-specific/) - Domain-specific modules

### Examples ([examples/](examples/))

Example programs demonstrating KODEON features:

-   [Basics](examples/basics/) - Simple programs for beginners
-   [Standard Library](examples/standard-library/) - Standard library usage
-   [Web](examples/web/) - Web development examples
-   [Concurrency](examples/concurrency/) - Concurrency examples
-   [Packages](examples/packages/) - Package management examples
-   [Advanced](examples/advanced/) - Advanced features

### Tests ([tests/](tests/))

Comprehensive test suite organized by type:

-   [Unit](tests/unit/) - Compiler component tests
-   [Integration](tests/integration/) - End-to-end tests
-   [Functional](tests/functional/) - Feature-specific tests
-   [Package Management](tests/package-management/) - Package management tests
-   [Performance](tests/performance/) - Benchmark tests
-   [Compatibility](tests/compatibility/) - Cross-platform tests

### Documentation ([docs/](docs/))

Complete documentation for users and developers:

-   [User Guide](docs/user-guide/) - Getting started and usage
-   [Developer Guide](docs/developer-guide/) - Compiler development
-   [API Reference](docs/api/) - Standard library API
-   [Package Management](docs/package-management/) - Package management guide
-   [Tutorials](docs/tutorials/) - Step-by-step guides

## 🚀 Getting Started

### Prerequisites

-   Rust (with Cargo)
-   Node.js (for IDE)

### Building the Compiler

```bash
cd compiler
cargo build
```

### Running Examples

```bash
cd compiler
cargo run -- ../examples/basics/hello-world.kodeon
```

### Using Packages

KODEON supports external packages through the `kodeon_modules` directory:

```kodeon
// Import a package
impor "math_utils" sebagai matematika

fungsi utama():
    buat hasil = matematika.tambah(5, 3)
    tampilkan(hasil)
    kembalikan 0
```

See [docs/PACKAGE_MANAGEMENT.md](docs/PACKAGE_MANAGEMENT.md) for detailed information.

### Setting up the IDE

```bash
cd ide
npm install
npm start
```

## 📚 Language Features

KODEON supports a wide range of programming paradigms and features:

-   **Variables and Constants**: `var`, `const`
-   **Control Structures**: `if/then/otherwise`, `for`, `while`
-   **Functions**: First-class functions with closures
-   **Data Types**: Numbers, strings, booleans, arrays, objects
-   **Error Handling**: Try/catch mechanism
-   **Package Management**: Import external libraries
-   **Concurrency**: Goroutines and channels (Go-inspired)
-   **Object-Oriented**: Classes and inheritance
-   **Functional**: Higher-order functions, immutability

## 🌍 Multi-language Syntax

KODEON supports both Indonesian and English syntax:

```kodeon
// Indonesian
fungsi halo(nama) {
    tampilkan("Halo, " + nama + "!")
}

// English
function hello(name) {
    show("Hello, " + name + "!")
}
```

## 🧪 Testing

Run the test suite:

```bash
cd compiler
cargo test
```

## 📖 Documentation

Complete documentation is available in the [docs/](docs/) directory, including:

-   Language reference
-   Standard library API
-   Package management guide
-   Compiler architecture
-   Tutorials and examples

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Thanks to all contributors who have helped make KODEON a reality
-   Inspired by the best features of modern programming languages
-   Designed with beginners and experts in mind
