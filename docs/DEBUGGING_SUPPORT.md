# Debugging Support in KODEON

## Overview

This document describes the debugging support implementation in the KODEON compiler. Debugging support enables developers to debug their KODEON programs with source-level debugging information, making it easier to identify and fix issues in their code.

## Features

### Debug Information Generation

The KODEON compiler generates debug information that maps compiled code back to the original source code. This includes:

1. **Source File Information** - Mapping between source files and compiled code
2. **Line Number Mapping** - Mapping between source lines and compiled instructions
3. **Function Debug Information** - Information about function definitions and parameters
4. **Variable Debug Information** - Information about variable declarations and scopes

### LLVM Debug Metadata

The compiler generates LLVM debug metadata compatible with standard debugging tools. This includes:

1. **DWARF Debug Format** - Standard debug information format
2. **Debug Information Builder** - LLVM's debug info builder API
3. **Compile Unit Information** - Information about the compilation unit
4. **Subprogram Information** - Information about functions and methods

## Implementation Details

### Debug Information Structures

The compiler uses the following structures to represent debug information:

```rust
/// Debug information for source code locations
#[derive(Debug, Clone)]
pub struct DebugInfo {
    pub file_name: String,
    pub line: usize,
    pub column: usize,
}
```

### IR Extensions

Debug information has been integrated into the Intermediate Representation (IR):

1. **Module-level debug info** - Information about the entire module
2. **Function-level debug info** - Information about individual functions
3. **Block-level debug info** - Information about basic blocks
4. **Instruction-level debug info** - Information about individual instructions

### LLVM Backend Integration

The LLVM backend has been extended to emit debug metadata:

1. **Debug Info Builder** - Creates debug information entries
2. **Compile Unit** - Represents the compilation unit
3. **File Information** - Represents source files
4. **Subprogram Information** - Represents functions with debug info

## Usage

### Compiler Integration

The debugging support is automatically enabled when generating code. The compiler:

1. Collects source position information during parsing
2. Propagates debug information through the IR
3. Emits LLVM debug metadata in the backend

### Debugging Tools

The generated debug information is compatible with standard debugging tools:

1. **GDB** - GNU Debugger
2. **LLDB** - LLVM Debugger
3. **IDE Debuggers** - Visual Studio Code, CLion, etc.

## Future Enhancements

### Enhanced Debug Information

Planned improvements include:

1. **Variable Tracking** - Detailed information about variable lifetimes
2. **Type Information** - Complete type descriptions for debugging
3. **Inlined Function Information** - Debug info for inlined functions
4. **Macro Debug Information** - Information about macro expansions

### Advanced Debugging Features

1. **Conditional Breakpoints** - Breakpoints with conditions
2. **Watchpoints** - Monitoring variable changes
3. **Memory Debugging** - Tracking memory allocations
4. **Concurrency Debugging** - Debugging concurrent programs

## Example

See [debug_demo.kodeon](../examples/debug_demo.kodeon) for a sample program that demonstrates debugging support.

## Testing

The debugging support includes comprehensive tests:

1. **Debug Info Structure Tests** - Verify debug information structures
2. **IR Generation Tests** - Test debug info propagation through IR
3. **LLVM Backend Tests** - Verify debug metadata generation

## Conclusion

The debugging support implementation provides KODEON developers with powerful debugging capabilities while maintaining the language's simplicity and ease of use. The integration with standard debugging tools ensures compatibility with existing development workflows.
