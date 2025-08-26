# PowerShell build script for KODEON Compiler

Write-Host "KODEON Compiler Build Script" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Check if Rust is installed
try {
    $rustcVersion = rustc --version
    Write-Host "Rust found: $rustcVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Rust is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Rust from https://www.rust-lang.org/" -ForegroundColor Yellow
    exit 1
}

# Check if Cargo is installed
try {
    $cargoVersion = cargo --version
    Write-Host "Cargo found: $cargoVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Cargo is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Build the compiler
Write-Host "Building KODEON compiler..." -ForegroundColor Cyan
cargo build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Run tests
Write-Host "Running tests..." -ForegroundColor Cyan
cargo test

if ($LASTEXITCODE -eq 0) {
    Write-Host "All tests passed!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed!" -ForegroundColor Red
    exit 1
}

# Test with example files
Write-Host "Testing with example files..." -ForegroundColor Cyan

# Test simple example
Write-Host "Testing simple example..." -ForegroundColor Cyan
cargo run -- examples/simple_test.kodeon

if ($LASTEXITCODE -eq 0) {
    Write-Host "Simple example test passed!" -ForegroundColor Green
} else {
    Write-Host "Simple example test failed!" -ForegroundColor Red
}

# Test LLVM IR generation
Write-Host "Testing LLVM IR generation..." -ForegroundColor Cyan
cargo run -- --llvm examples/simple_test.kodeon

if ($LASTEXITCODE -eq 0) {
    Write-Host "LLVM IR generation test passed!" -ForegroundColor Green
} else {
    Write-Host "LLVM IR generation test failed!" -ForegroundColor Red
}

Write-Host "Build script completed!" -ForegroundColor Green
