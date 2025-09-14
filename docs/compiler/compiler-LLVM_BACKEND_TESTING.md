# LLVM Backend Testing Guide

## Overview

This document explains how to test the KODEON LLVM backend implementation with the enhanced language features.

## Prerequisites

1. Rust toolchain installed (including Cargo)
2. LLVM libraries installed
3. inkwell crate dependencies satisfied

## Running Tests

To run the LLVM backend tests, execute the following commands:

```bash
cd compiler
cargo test llvm_backend_enhanced_test
```

This will run the enhanced LLVM backend tests that verify support for:

- Go-style concurrency features (channels, goroutines)
- Kotlin-style null safety features (null checking, elvis operator)
- Extended type system mapping
- Advanced instruction translation

## Test Descriptions

### test_enhanced_llvm_backend

This test creates an IR module with enhanced language features and compiles it to LLVM IR using the LLVMBackend.

Features tested:

- Channel creation
- Null checking
- Elvis operator (null coalescing)

### test_llvm_builder_enhanced

This test directly tests the LLVMBuilder with enhanced instruction support.

Features tested:

- Function creation with channel parameters
- Null check instruction building
- Elvis operator instruction building

## Expected Output

When the tests run successfully, you should see output similar to:

```
Enhanced LLVM backend test passed!
LLVM builder enhanced test passed!
```

The tests will also print the generated LLVM IR to stderr for inspection.

## Troubleshooting

If you encounter issues:

1. Ensure LLVM is properly installed and accessible
2. Check that the inkwell crate can find the LLVM libraries
3. Verify that the KODEON compiler builds correctly with `cargo build`
