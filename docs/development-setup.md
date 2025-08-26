# KODEON Development Environment Setup

This document provides instructions for setting up the development environment for working on the KODEON programming language.

## Prerequisites

Before you begin, you'll need to install the following tools:

1. **Rust and Cargo** - For compiling the KODEON compiler
2. **Node.js and npm** - For running the IDE
3. **Git** - For version control (optional but recommended)

## Installing Rust and Cargo

### Windows

1. Download and run the Rust installer from [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
2. Follow the installation instructions
3. Restart your command prompt or PowerShell
4. Verify the installation:
   ```bash
   rustc --version
   cargo --version
   ```

### macOS

1. Install using Homebrew:
   ```bash
   brew install rust
   ```
2. Or download and run the installer from [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
3. Verify the installation:
   ```bash
   rustc --version
   cargo --version
   ```

### Linux

1. Install using the package manager for your distribution or use rustup:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
2. Follow the on-screen instructions
3. Restart your terminal
4. Verify the installation:
   ```bash
   rustc --version
   cargo --version
   ```

## Setting up the Compiler

1. Navigate to the compiler directory:

   ```bash
   cd compiler
   ```

2. Build the compiler:

   ```bash
   cargo build
   ```

3. Run the tests:

   ```bash
   cargo test
   ```

4. Run the compiler:
   ```bash
   cargo run -- <input_file.kodeon>
   ```

## Setting up the IDE

1. Navigate to the IDE directory:

   ```bash
   cd ide
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the IDE in development mode:

   ```bash
   npm run dev
   ```

4. Build the IDE for production:
   ```bash
   npm run build
   ```

## Directory Structure

```
KODEON/
├── compiler/           # Rust-based compiler
│   ├── src/            # Source code
│   ├── tests/          # Integration tests
│   ├── Cargo.toml      # Rust project configuration
│   └── target/         # Build output (generated)
│
├── ide/                # Electron-based IDE
│   ├── node_modules/   # Dependencies (generated)
│   ├── package.json    # Node.js project configuration
│   └── dist/           # Build output (generated)
│
├── examples/           # Sample KODEON programs
├── stdlib/             # Standard library
└── docs/               # Documentation
```

## Development Workflow

### Working on the Compiler

1. Make changes to the Rust source files in `compiler/src/`
2. Run tests to verify your changes:
   ```bash
   cargo test
   ```
3. Build the compiler:
   ```bash
   cargo build
   ```
4. Test with example files:
   ```bash
   cargo run -- examples/hello-world.kodeon
   ```

### Working on the IDE

1. Make changes to the JavaScript/HTML/CSS files in `ide/`
2. Test changes in development mode:
   ```bash
   npm run dev
   ```
3. Build for production when ready:
   ```bash
   npm run build
   ```

## Troubleshooting

### Common Issues

1. **"command not found: cargo"**

   - Make sure Rust is properly installed
   - Restart your terminal/command prompt
   - Check that Rust is in your PATH

2. **"command not found: npm"**

   - Make sure Node.js is properly installed
   - Restart your terminal/command prompt
   - Check that Node.js is in your PATH

3. **Build errors**
   - Make sure you're in the correct directory
   - Check that all dependencies are installed
   - Clean and rebuild:
     ```bash
     cargo clean
     cargo build
     ```

### Getting Help

If you encounter issues not covered in this document:

1. Check the [Rust documentation](https://doc.rust-lang.org/)
2. Check the [Electron documentation](https://www.electronjs.org/docs)
3. Open an issue on the KODEON GitHub repository
4. Contact the development team

## Contributing

To contribute to KODEON:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run all tests to ensure nothing is broken
6. Submit a pull request
