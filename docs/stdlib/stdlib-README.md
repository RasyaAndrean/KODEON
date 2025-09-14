# KODEON Standard Library

The KODEON standard library provides essential functions and utilities for KODEON programs. It follows the principle of "less is more" - providing powerful, essential functionality through minimal, intuitive interfaces.

## Directory Structure

The standard library is organized into the following categories:

-   [core/](core/) - Core modules (types, math)
-   [text/](text/) - Text manipulation and processing
-   [data/](data/) - Data structures and formats (collections, JSON)
-   [system/](system/) - System interaction (IO, time, concurrency, file system)
-   [web-modules/](web-modules/) - Web development and networking
-   [security/](security/) - Security and cryptography
-   [utilities/](utilities/) - Utility modules (logging)
-   [encoding/](encoding/) - Data encoding and decoding
-   [reflect/](reflect/) - Runtime reflection capabilities
-   [testing/](testing/) - Testing framework utilities
-   [domain-specific/](domain-specific/) - Domain-specific modules

## Implemented Modules

### Core Modules ([core/](core/))

Provides fundamental functions for type inspection, string manipulation, and mathematical operations.

**Features:**

-   Type inspection and conversion functions
-   Mathematical constants and functions
-   Basic I/O functions

### Text Modules ([text/](text/))

Provides comprehensive string manipulation and processing capabilities.

**Features:**

-   String creation and formatting
-   String analysis and searching
-   String transformation (case conversion, trimming)

### Data Modules ([data/](data/))

Provides data structures and data format handling.

**Features:**

-   Collections (List, Map, Set)
-   JSON parsing and generation

### System Modules ([system/](system/))

Provides interaction with the operating system and system resources.

**Features:**

-   Input/output operations
-   Environment variable access
-   Process management
-   Time and date operations
-   Concurrent and parallel execution
-   File system operations

### Web Modules ([web-modules/](web-modules/))

Provides web development and networking capabilities.

**Features:**

-   HTTP client operations
-   Web server creation
-   Networking utilities

### Security Modules ([security/](security/))

Provides security-related functions.

**Features:**

-   Cryptographic hash functions
-   Encryption and decryption

### Utility Modules ([utilities/](utilities/))

Provides utility functions for common programming tasks.

**Features:**

-   Application logging

### Encoding Modules ([encoding/](encoding/))

Provides functions for encoding and decoding data in various formats.

**Features:**

-   Base64 encoding and decoding
-   URL encoding and decoding

### Reflection Modules ([reflect/](reflect/))

Provides functions for examining and manipulating program structure at runtime.

**Features:**

-   Type introspection
-   Function metadata inspection

### Testing Modules ([testing/](testing/))

Provides functions for writing and running tests.

**Features:**

-   Unit testing framework
-   Assertion functions

### Domain-Specific Modules ([domain-specific/](domain-specific/))

Provides specialized functionality for various application domains.

**Features:**

-   Web development utilities (implemented)
-   Data science, graphics, AI, IoT, mobile, database, and security utilities (planned)

## Usage

To use the standard library in your KODEON programs, import the modules you need:

```kodeon
impor "core/core"
impor "text/string"
impor "data/collections"
impor "system/io"
impor "web-modules/net"
```

## Design Principles

1. **Essential Functionality** - Include only what virtually every program needs
2. **Intuitive Interfaces** - Clear, descriptive function names with consistent APIs
3. **Powerful Abstractions** - Hide complexity behind simple interfaces
4. **Minimal Dependencies** - No external dependencies in core modules

## Implementation Status

✅ Core modules (types, math, collections, io, system, concurrent, time, json)
✅ Advanced modules (net, fs, crypto, log, web)
🚧 String module (partially implemented)
🚧 Encoding module (placeholder)
🚧 Reflection module (placeholder)
🚧 Testing module (placeholder)
🚧 Domain-specific modules (web implemented, others planned)

## Testing

The standard library includes comprehensive tests in the [tests/functional/](../tests/functional/) directory.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for information on how to contribute to the KODEON standard library.

## License

See [LICENSE](../LICENSE) for licensing information.
