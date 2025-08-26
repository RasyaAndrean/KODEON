# Using the KODEON LLVM Backend

## Overview

This document provides instructions on how to use the LLVM backend for the KODEON programming language compiler.

## Prerequisites

1. Rust toolchain installed (latest stable version)
2. LLVM development libraries installed (version 12.0 or compatible)
3. Git for cloning the repository
4. Basic understanding of command-line tools

## Installation

### Clone the Repository

```bash
git clone https://github.com/kodeon/kodeon.git
cd kodeon
```

### Install LLVM

#### Ubuntu/Debian:

```bash
sudo apt-get install llvm-12-dev libclang-12-dev
```

#### macOS (with Homebrew):

```bash
brew install llvm@12
```

#### Windows:

Download and install LLVM from the official website, or use a package manager like Chocolatey:

```powershell
choco install llvm
```

## Building the Compiler

Navigate to the compiler directory and build:

```bash
cd compiler
cargo build --release
```

## Using the LLVM Backend

### Basic Usage

To compile a KODEON program and generate LLVM IR:

```bash
cargo run --release -- examples/full_example.kodeon --llvm
```

This will:

1. Parse the KODEON source file
2. Perform semantic analysis
3. Generate intermediate representation (IR)
4. Compile IR to LLVM IR
5. Print the LLVM IR to stdout

### Saving LLVM IR to File

To save the LLVM IR to a file:

```bash
cargo run --release -- examples/full_example.kodeon --llvm --output output.ll
```

### Verbose Output

To see detailed compilation steps:

```bash
cargo run --release -- examples/full_example.kodeon --llvm --verbose
```

## Example Programs

### Simple Arithmetic

```kodeon
// simple.kodeon
buat a = 42
buat b = 8
buat c = a + b
kembalikan c
```

Compile with:

```bash
cargo run --release -- examples/simple.kodeon --llvm
```

### Function Definition

```kodeon
// function.kodeon
fungsi tambah(x, y):
    kembalikan x + y

buat hasil = tambah(10, 20)
kembalikan hasil
```

Compile with:

```bash
cargo run --release -- examples/function.kodeon --llvm
```

## Supported Features

### Data Types

- Integer (64-bit)
- Floating-point (64-bit)
- Boolean
- String (null-terminated)

### Operations

- Arithmetic: +, -, \*, /, %
- Comparisons: ==, !=, <, >, <=, >=
- Logical: and, or, not

### Control Structures

- Variable declarations
- Function definitions
- Return statements
- If/else conditions

### Functions

- Function definition with parameters
- Function calls
- Return values

## LLVM IR Output

The generated LLVM IR will include:

1. Module definition with source filename
2. Function definitions with proper signatures
3. Basic blocks with instructions
4. Memory operations (alloca, store, load)
5. Arithmetic and logical operations
6. Control flow instructions
7. Return statements

## Optimization

To apply LLVM optimizations, you can use the LLVM tools directly on the generated IR:

```bash
# Optimize the generated LLVM IR
opt -O3 output.ll -o optimized.ll

# Compile to machine code
llc optimized.ll -o output.s
```

## Troubleshooting

### Common Issues

1. **LLVM Library Not Found**

   - Ensure LLVM development libraries are installed
   - Check that the correct version is installed
   - Verify environment variables are set correctly

2. **Compilation Errors**

   - Check that the KODEON source code is syntactically correct
   - Verify all required dependencies are installed
   - Ensure the Rust toolchain is up to date

3. **Runtime Errors**
   - Check that LLVM targets are properly initialized
   - Verify that the generated IR is valid
   - Ensure sufficient memory is available

### Debugging

To debug issues with the LLVM backend:

1. Use the `--verbose` flag to see detailed compilation output
2. Check the generated IR for correctness
3. Validate the LLVM IR with `llvm-as`
4. Use LLVM debugging tools like `lli` for interpretation

## Extending the Backend

### Adding New Instructions

To add support for new IR instructions:

1. Update the `compile_instruction` method in `llvm_backend/mod.rs`
2. Add appropriate LLVM IR generation code
3. Test with example programs
4. Update documentation

### Adding New Types

To add support for new data types:

1. Update the `convert_type` method in `llvm_backend/mod.rs`
2. Add appropriate LLVM type mapping
3. Update value conversion methods
4. Test with example programs

## Performance Considerations

### Compilation Speed

- Use `--release` flag for optimized builds
- Enable incremental compilation in Cargo
- Use SSD storage for faster I/O

### Generated Code Quality

- Apply LLVM optimization passes
- Use profile-guided optimization
- Enable link-time optimization

## Future Enhancements

Planned improvements to the LLVM backend include:

1. **Advanced Optimizations** - Integration with LLVM's optimization passes
2. **Debug Information** - Source-level debugging support
3. **Exception Handling** - Support for KODEON's exception mechanisms
4. **Target-Specific Features** - Architecture-specific optimizations
5. **JIT Compilation** - Just-in-time compilation support

## Conclusion

The KODEON LLVM backend provides a powerful foundation for generating high-quality machine code from KODEON source programs. With its modular design and comprehensive feature set, it enables KODEON to compete with established programming languages in terms of performance while maintaining its unique ease-of-learning characteristics.
