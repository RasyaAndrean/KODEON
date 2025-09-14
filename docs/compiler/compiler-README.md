# KODEON Compiler

The KODEON compiler is the core component responsible for translating KODEON source code into executable code or other target languages.

## Structure

-   `src/` - Main source code for the compiler
    -   `main.rs` - Main entry point
    -   `lib.rs` - Library exports
    -   `cli.rs` - Command line interface
    -   `lexer.rs` - Lexical analysis
    -   `parser.rs` - Parsing and AST generation
    -   `semantic_analyzer.rs` - Semantic analysis
    -   `ir.rs` - Intermediate representation
    -   `llvm_backend/` - LLVM backend implementation
-   `tests/` - Unit and integration tests
-   `examples/` - Example KODEON programs
-   `docs/` - Documentation specific to the compiler
-   `foundation/` - Foundation version of the compiler

## Building

To build the KODEON compiler, you need Rust and Cargo installed:

```bash
cargo build
```

To build with optimizations:

```bash
cargo build --release
```

## Running

To compile a KODEON source file:

```bash
cargo run -- input.kodeon
```

To compile with LLVM backend:

```bash
cargo run -- input.kodeon --llvm
```

To compile to JavaScript:

```bash
cargo run -- input.kodeon --target javascript
```

To compile to Python:

```bash
cargo run -- input.kodeon --target python
```

## Testing

To run the test suite:

```bash
cargo test
```

To run specific tests:

```bash
# Run lexer tests
cargo test lexer

# Run parser tests
cargo test parser

# Run LLVM backend tests
cargo test llvm
```

## Features

The KODEON compiler supports:

-   Multi-language syntax (English/Indonesian)
-   LLVM backend for high-performance compilation
-   JavaScript and Python transpilation
-   Advanced language features:
    -   Go-style concurrency (channels, goroutines)
    -   Rust-style traits
    -   Kotlin-style null safety
    -   C++-style references and pointers
    -   Swift-style optionals
    -   SQL-style table operations
    -   R-style statistical functions
    -   Advanced concurrency features (mutexes, condition variables, atomic operations)

## Development Plan

See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for the compiler development roadmap.

## Documentation

See the [docs](docs/) directory for detailed documentation on specific components.
