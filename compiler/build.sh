#!/bin/bash

# Shell build script for KODEON Compiler

echo -e "\033[0;32mKODEON Compiler Build Script\033[0m"
echo -e "\033[0;32m============================\033[0m"

# Check if Rust is installed
if ! command -v rustc &> /dev/null
then
    echo -e "\033[0;31mError: Rust is not installed or not in PATH\033[0m"
    echo -e "\033[0;33mPlease install Rust from https://www.rust-lang.org/\033[0m"
    exit 1
else
    echo -e "\033[0;32mRust found: $(rustc --version)\033[0m"
fi

# Check if Cargo is installed
if ! command -v cargo &> /dev/null
then
    echo -e "\033[0;31mError: Cargo is not installed or not in PATH\033[0m"
    exit 1
else
    echo -e "\033[0;32mCargo found: $(cargo --version)\033[0m"
fi

# Build the compiler
echo -e "\033[0;36mBuilding KODEON compiler...\033[0m"
cargo build

if [ $? -eq 0 ]; then
    echo -e "\033[0;32mBuild successful!\033[0m"
else
    echo -e "\033[0;31mBuild failed!\033[0m"
    exit 1
fi

# Run tests
echo -e "\033[0;36mRunning tests...\033[0m"
cargo test

if [ $? -eq 0 ]; then
    echo -e "\033[0;32mAll tests passed!\033[0m"
else
    echo -e "\033[0;31mSome tests failed!\033[0m"
    exit 1
fi

# Test with example files
echo -e "\033[0;36mTesting with example files...\033[0m"

# Test simple example
echo -e "\033[0;36mTesting simple example...\033[0m"
cargo run -- examples/simple_test.kodeon

if [ $? -eq 0 ]; then
    echo -e "\033[0;32mSimple example test passed!\033[0m"
else
    echo -e "\033[0;31mSimple example test failed!\033[0m"
fi

# Test LLVM IR generation
echo -e "\033[0;36mTesting LLVM IR generation...\033[0m"
cargo run -- --llvm examples/simple_test.kodeon

if [ $? -eq 0 ]; then
    echo -e "\033[0;32mLLVM IR generation test passed!\033[0m"
else
    echo -e "\033[0;31mLLVM IR generation test failed!\033[0m"
fi

echo -e "\033[0;32mBuild script completed!\033[0m"
