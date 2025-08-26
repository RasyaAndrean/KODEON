# Testing the LLVM Backend

## Overview

This document describes how to test the LLVM backend implementation for the KODEON programming language.

## Prerequisites

1. Rust toolchain installed
2. LLVM development libraries installed
3. Cargo package manager

## Running Tests

### Simple LLVM Test

To test the LLVM backend with a simple program:

```bash
cd compiler
cargo run -- ../tests/llvm_test.kodeon --llvm
```

This will:

1. Parse the KODEON source file
2. Generate IR
3. Compile the IR to LLVM IR
4. Print the LLVM IR to stdout

### Function Test

To test function definitions and calls:

```bash
cd compiler
cargo run -- ../tests/function_test.kodeon --llvm
```

## Test Files

- `tests/llvm_test.kodeon` - Simple arithmetic test
- `tests/function_test.kodeon` - Function definition and call test
- `tests/simple_add.kodeon` - Basic addition test

## Expected Output

When running the LLVM backend tests, you should see:

1. Tokenization output (in verbose mode)
2. AST output (in verbose mode)
3. IR generation output
4. LLVM IR output

## Debugging

If you encounter issues:

1. **Missing LLVM libraries**: Ensure LLVM development libraries are installed
2. **Linking errors**: Check that the inkwell crate is properly configured
3. **Runtime errors**: Verify that LLVM targets are properly initialized

## Adding New Tests

To add new tests:

1. Create a new `.kodeon` file in the `tests/` directory
2. Run it with the `--llvm` flag
3. Verify the generated LLVM IR is correct

## Example Output

A successful run should produce LLVM IR similar to:

```llvm
; ModuleID = 'llvm_test'
source_filename = "llvm_test"

define i64 @main() {
entry:
  %0 = alloca i64, align 8
  store i64 42, i64* %0, align 4
  %1 = alloca i64, align 8
  store i64 8, i64* %1, align 4
  %2 = alloca i64, align 8
  %3 = load i64, i64* %0, align 4
  %4 = load i64, i64* %1, align 4
  %5 = add i64 %3, %4
  store i64 %5, i64* %2, align 4
  %6 = load i64, i64* %2, align 4
  ret i64 %6
}
```
