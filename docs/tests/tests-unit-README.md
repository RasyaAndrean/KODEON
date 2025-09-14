# KODEON Unit Tests

This directory contains unit tests for individual components of the KODEON compiler, written in Rust.

## Test Files

-   [lexer_extended_test.rs](lexer_extended_test.rs) - Extended tests for the lexical analyzer
-   [llvm_backend_enhanced_test.rs](llvm_backend_enhanced_test.rs) - Enhanced tests for the LLVM backend
-   [llvm_backend_extended_test.rs](llvm_backend_extended_test.rs) - Extended tests for the LLVM backend

## Running Unit Tests

To run all unit tests:

```bash
cd compiler
cargo test
```

To run only unit tests (excluding integration tests):

```bash
cd compiler
cargo test --lib
```

## Test Structure

Unit tests in this directory focus on testing individual components of the compiler in isolation:

1. **Lexer Tests** - Test tokenization of KODEON source code
2. **Parser Tests** - Test parsing and AST generation
3. **Semantic Analyzer Tests** - Test type checking and symbol resolution
4. **IR Generation Tests** - Test intermediate representation generation
5. **LLVM Backend Tests** - Test code generation for the LLVM backend

## Contributing

When adding new unit tests:

1. Place test files in this directory
2. Follow the existing naming conventions
3. Ensure tests are well-documented
4. Verify all tests pass before submitting changes

For more information about the testing roadmap, see [../DEVELOPMENT_PLAN.md](../DEVELOPMENT_PLAN.md).
