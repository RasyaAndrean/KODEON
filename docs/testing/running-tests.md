# Running KODEON Tests

## Overview

This document explains how to run the various tests for the KODEON compiler and components.

## Prerequisites

1. Rust toolchain installed
2. LLVM development libraries installed
3. Cargo package manager

## Running Unit Tests

### All Tests

To run all unit tests:

```bash
cd compiler
cargo test
```

### Specific Test Modules

To run tests for a specific module:

```bash
cd compiler
cargo test lexer
cargo test parser
cargo test semantic_analyzer
cargo test ir
cargo test llvm_backend
```

### Running Tests with Output

To see output from tests:

```bash
cd compiler
cargo test -- --nocapture
```

## LLVM Backend Tests

The LLVM backend tests are located in `tests/llvm_backend_test.rs` and include:

1. `test_simple_llvm_generation` - Tests basic LLVM IR generation
2. `test_function_llvm_generation` - Tests function definition and call LLVM IR generation

To run just the LLVM backend tests:

```bash
cd compiler
cargo test llvm_backend
```

## Test Files

Test files are located in:

- `tests/` - Unit tests
- `examples/` - Example programs
- `tests/` - Additional test programs

## Continuous Integration

The test suite is designed to be run in CI environments. All tests should pass before merging changes.

## Debugging Test Failures

If tests fail:

1. Run with `--nocapture` to see output
2. Check that LLVM libraries are properly installed
3. Verify that the inkwell crate is correctly configured
4. Ensure all dependencies are up to date

## Adding New Tests

To add new tests:

1. Create a new test function in the appropriate test file
2. Use the `#[test]` attribute
3. Follow the pattern of existing tests
4. Run tests to ensure they pass

## Performance Tests

Performance benchmarks are located in the `benches/` directory and can be run with:

```bash
cd compiler
cargo bench
```
