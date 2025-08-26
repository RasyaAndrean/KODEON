# Standard Library Integration in KODEON

## Overview

This document describes how the KODEON compiler integrates with the standard library modules. The standard library provides essential functionality for KODEON programs, including core utilities, data structures, I/O operations, and more.

## Module System

KODEON uses a simple module system for organizing and importing functionality. Modules can be imported using the `impor` (Indonesian) or `import` (English) keyword.

### Import Syntax

```kodeon
// Basic import
impor "core"

// Import with alias
impor "math" sebagai m

// English equivalent
import "collections"
import "string" as s
```

## Standard Library Modules

### Core Modules

1. **core** - Basic language functionality including type inspection, conversion, and fundamental operations
2. **math** - Mathematical functions and constants
3. **collections** - Data structures like lists, maps, and sets

### Text Processing

1. **string** - String manipulation functions

### Data Formats

1. **json** - JSON parsing and serialization

### System Modules

1. **system** - System-level operations like environment variables and process management
2. **io** - Input/output operations
3. **time** - Time and date functionality
4. **concurrent** - Concurrency primitives

## Implementation Details

### Module Resolver

The compiler uses a `ModuleResolver` to locate and load modules. The resolver checks:

1. Standard library modules (built-in)
2. User-defined modules (in search paths)
3. Registered modules (programmatically added)

### IR Generation

When the compiler encounters an import statement, it:

1. Resolves the module using the `ModuleResolver`
2. Processes the module content (in future versions)
3. Integrates the module's functions and types into the compilation context

## Future Enhancements

Planned improvements to the standard library integration include:

1. **Module Content Processing** - Actually parse and integrate imported module content
2. **Dependency Resolution** - Handle transitive dependencies between modules
3. **Optimized Imports** - Only include used functions from imported modules
4. **Package Management** - Support for external packages and versioning

## Example Usage

See [stdlib_demo.kodeon](../examples/stdlib_demo.kodeon) for a comprehensive example of using standard library modules.
