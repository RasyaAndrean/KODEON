# KODEON Developer Guide

This guide provides comprehensive information for developers who want to contribute to the KODEON programming language project.

## Project Overview

KODEON is a revolutionary programming language designed to be the easiest to learn in the world while being versatile enough to support all application development needs. It uses a natural language-based syntax and eliminates unnecessary complexity.

## Architecture

The KODEON project consists of several components:

### 1. Compiler

The compiler is written in Rust and follows a traditional multi-phase compilation architecture:

```
Source Code → Lexer → Parser → AST → Semantic Analysis → IR → Optimization → Code Generation → Machine Code
```

Key components:

- **Lexer** - Tokenizes source code
- **Parser** - Generates Abstract Syntax Tree (AST)
- **Semantic Analyzer** - Performs type checking and validation
- **IR Generator** - Creates Intermediate Representation
- **LLVM Backend** - Generates optimized machine code

### 2. IDE

The IDE is built with Electron and provides a modern development environment:

- Monaco Editor for code editing
- Syntax highlighting for KODEON
- Real-time error checking
- Integrated terminal

### 3. Standard Library

The standard library provides essential functions and modules:

- Core utilities (I/O, string manipulation)
- Mathematical functions
- Data structures
- System interfaces

## Getting Started

### Prerequisites

1. **Rust and Cargo** - For compiling the compiler
2. **Node.js and npm** - For running the IDE
3. **Git** - For version control

### Setting Up the Development Environment

1. Clone the repository:

   ```bash
   git clone https://github.com/kodeon/kodeon.git
   cd kodeon
   ```

2. Set up the compiler:

   ```bash
   cd compiler
   cargo build
   ```

3. Set up the IDE:
   ```bash
   cd ../ide
   npm install
   npm run dev
   ```

## Code Structure

### Compiler Structure

```
compiler/
├── src/
│   ├── lexer.rs         # Lexical analysis
│   ├── parser.rs        # Syntax analysis
│   ├── semantic_analyzer.rs  # Semantic analysis
│   ├── ir.rs            # Intermediate representation
│   ├── llvm_backend/    # LLVM code generation
│   ├── lib.rs           # Library exports
│   └── main.rs          # Main entry point
├── tests/
│   └── integration_test.rs  # Integration tests
├── Cargo.toml           # Rust project configuration
└── README.md            # Compiler documentation
```

### IDE Structure

```
ide/
├── index.html           # Main HTML file
├── main.js              # Electron main process
├── renderer.js          # Electron renderer process
├── preload.js           # Preload script
├── package.json         # Node.js project configuration
└── README.md            # IDE documentation
```

## Development Workflow

### Working on the Compiler

1. Make changes to the Rust source files in `compiler/src/`
2. Run tests to verify your changes:
   ```bash
   cargo test
   ```
3. Build the compiler:
   ```bash
   cargo build
   ```
4. Test with example files:
   ```bash
   cargo run -- examples/hello-world.kodeon
   ```

### Working on the IDE

1. Make changes to the JavaScript/HTML/CSS files in `ide/`
2. Test changes in development mode:
   ```bash
   npm run dev
   ```
3. Build for production when ready:
   ```bash
   npm run build
   ```

## Contributing

### Code Style

- Follow Rust coding conventions for the compiler
- Follow JavaScript/TypeScript best practices for the IDE
- Write clear, descriptive comments
- Use meaningful variable and function names

### Testing

- Write unit tests for new functionality
- Ensure all existing tests pass before submitting changes
- Add integration tests for significant features

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run all tests to ensure nothing is broken
6. Submit a pull request with a clear description of changes

## Component-Specific Guides

### Lexer Development

The lexer is responsible for tokenizing source code. Key considerations:

1. **Token Types** - Ensure all language constructs have appropriate tokens
2. **Error Handling** - Provide meaningful error messages for invalid input
3. **Performance** - Optimize for speed as lexing is frequently executed

### Parser Development

The parser generates an AST from tokens. Important aspects:

1. **Grammar Rules** - Follow the defined grammar specification
2. **Error Recovery** - Implement graceful error recovery for better user experience
3. **AST Design** - Create clear, extensible AST node structures

### Semantic Analyzer Development

The semantic analyzer validates program correctness. Focus areas:

1. **Symbol Table** - Efficiently manage identifiers and their properties
2. **Type Checking** - Implement comprehensive type checking rules
3. **Scope Management** - Properly handle variable scoping

### IR Generator Development

The IR generator translates AST to KODEON IR. Considerations:

1. **IR Design** - Follow the KIR specification
2. **Optimization** - Generate IR that is amenable to optimization
3. **Debugging** - Include position information for debugging

### LLVM Backend Development

The LLVM backend generates machine code. Key aspects:

1. **Translation** - Accurately translate KIR to LLVM IR
2. **Optimization** - Leverage LLVM's optimization passes
3. **Target Support** - Support multiple target architectures

## Testing

### Unit Tests

Unit tests are located in the same files as the code they test (for Rust) or in separate test files (for JavaScript).

Run Rust unit tests:

```bash
cd compiler
cargo test
```

### Integration Tests

Integration tests verify that components work together correctly.

Run integration tests:

```bash
cd compiler
cargo test --test integration_test
```

### Example Programs

Example programs in the `examples/` directory serve as both documentation and tests.

## Debugging

### Compiler Debugging

1. Use `println!` statements for simple debugging
2. Use `dbg!` macro for structured debugging output
3. Use a Rust debugger (e.g., rust-gdb) for complex issues

### IDE Debugging

1. Use Chrome DevTools when running in development mode
2. Check Electron's console for errors
3. Use logging for tracing execution flow

## Performance Considerations

### Compiler Performance

1. Profile code to identify bottlenecks
2. Use efficient data structures
3. Minimize memory allocations
4. Consider parallelization opportunities

### IDE Performance

1. Optimize rendering performance
2. Minimize blocking operations
3. Use efficient data structures for large files
4. Implement virtual scrolling for large files

## Documentation

### Code Documentation

- Document all public APIs
- Use Rust doc comments for Rust code
- Use JSDoc for JavaScript code
- Include examples in documentation

### User Documentation

- Keep user-facing documentation up to date
- Provide clear examples
- Document breaking changes

## Release Process

1. Update version numbers in all relevant files
2. Update changelog
3. Run all tests
4. Create Git tag
5. Publish releases

## Community

### Getting Help

- Open issues on GitHub for bugs and feature requests
- Join the KODEON Discord server for real-time discussion
- Check existing documentation and examples

### Code of Conduct

Follow the KODEON Code of Conduct in all interactions with the community.

## Advanced Topics

### Language Extensions

To add new language features:

1. Update the lexer to recognize new tokens
2. Modify the parser to handle new syntax
3. Extend the semantic analyzer for validation
4. Update the IR generator
5. Modify the LLVM backend if necessary
6. Add documentation and examples

### Tooling Integration

To integrate with external tools:

1. Define clear interfaces
2. Implement appropriate APIs
3. Provide configuration options
4. Document integration process

### Internationalization

KODEON supports both Indonesian and English syntax. When adding new keywords:

1. Add both Indonesian and English versions
2. Update lexer and parser for both versions
3. Ensure consistent behavior between versions
4. Update documentation for both languages

## Troubleshooting

### Common Issues

1. **Build Failures** - Check dependencies and environment setup
2. **Test Failures** - Run tests in isolation to identify issues
3. **Performance Problems** - Profile code to identify bottlenecks
4. **Integration Issues** - Verify component interfaces match

### Getting Support

If you encounter issues not covered in this guide:

1. Check the issue tracker on GitHub
2. Ask questions on the community forums
3. Contact the development team directly
