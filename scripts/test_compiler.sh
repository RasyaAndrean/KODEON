#!/bin/bash

# Test script for KODEON compiler

echo "Testing KODEON compiler..."

# Compile the simple addition test
echo "Compiling simple_add.kodeon..."
cargo run -- tests/simple_add.kodeon --llvm

echo "Test completed."
