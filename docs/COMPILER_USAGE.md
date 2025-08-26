# KODEON Compiler Usage Guide

## Overview

The KODEON compiler translates KODEON source code into various target formats, including LLVM IR for efficient machine code generation.

## Basic Usage

To compile a KODEON program, use the following command:

```bash
kodeon-compiler <input_file.kodeon>
```

This will generate an IR representation of your program and save it to a file with the same name but with an `.ir` extension.

## LLVM Backend Usage

To generate LLVM IR, use the `--llvm` flag:

```bash
kodeon-compiler --llvm <input_file.kodeon>
```

This will generate an LLVM IR file with the `.ll` extension.

You can also specify a custom output file:

```bash
kodeon-compiler --llvm -o <output_file.ll> <input_file.kodeon>
```

## Target Platforms

The compiler supports multiple target platforms:

```bash
# Generate LLVM IR
kodeon-compiler --target llvm <input_file.kodeon>

# Generate JavaScript (placeholder)
kodeon-compiler --target javascript <input_file.kodeon>

# Generate Python (placeholder)
kodeon-compiler --target python <input_file.kodeon>
```

## Verbose Output

For detailed compilation information, use the `-v` or `--verbose` flag:

```bash
kodeon-compiler -v <input_file.kodeon>
```

## Execution

To execute the compiled program, use the `--execute` flag:

```bash
kodeon-compiler --execute <input_file.kodeon>
```

Note: Execution of LLVM IR requires additional tools like LLVM's `lli` command.

## Examples

### Simple Compilation

```bash
kodeon-compiler examples/simple_test.kodeon
```

### LLVM IR Generation

```bash
kodeon-compiler --llvm examples/simple_test.kodeon
```

### Verbose LLVM IR Generation

```bash
kodeon-compiler --llvm -v examples/simple_test.kodeon
```

## Supported Language Features

The LLVM backend currently supports translation of the following KODEON language features:

### Basic Features

- Variables and constants
- Arithmetic operations
- Control flow (if/else, loops)
- Function definitions and calls
- Basic data types (int, float, bool, string)

### Advanced Features

- Go-style concurrency:
  - Channels
  - Goroutines
- Kotlin-style null safety:
  - Null checking
  - Elvis operator (null coalescing)
- Extended type system:
  - Channel types
  - Nullable types
  - Goroutine types

## Troubleshooting

### LLVM Library Issues

If you encounter issues with LLVM libraries, ensure that:

1. LLVM is properly installed on your system
2. The inkwell crate can find the LLVM libraries
3. Your LLVM version is compatible with the inkwell version specified in Cargo.toml

### Compilation Errors

Common compilation errors and solutions:

1. **"Input file must have .kodeon extension"**: Ensure your source file has the correct extension
2. **"Input file does not exist"**: Check that the file path is correct
3. **"Unknown target"**: Verify that you're using a supported target platform

## Future Enhancements

Planned enhancements for the compiler include:

- Full JavaScript and Python transpilation
- JIT execution of LLVM IR
- Optimization passes
- Debug information generation
- Profile-guided optimization

For more information about the LLVM backend implementation, see [LLVM Backend Implementation Plan](../compiler/LLVM_BACKEND_IMPLEMENTATION_PLAN.md) and [LLVM Backend Usage Guide](LLVM_BACKEND_USAGE.md).
