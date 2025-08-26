# KODEON Compiler Examples

This directory contains example programs that demonstrate various features of the KODEON programming language.

## Basic Examples

-   [hello-world.kodeon](hello-world.kodeon) - Simple "Hello, World!" program
-   [calculator.kodeon](calculator.kodeon) - Basic calculator implementation

## Concurrency Examples

-   [concurrency_example.kodeon](concurrency_example.kodeon) - Basic concurrency features (Indonesian)
-   [concurrency_example_en.kodeon](concurrency_example_en.kodeon) - Basic concurrency features (English)
-   [advanced_concurrency.kodeon](advanced_concurrency.kodeon) - Advanced concurrency features (Indonesian)
-   [advanced_concurrency_en.kodeon](advanced_concurrency_en.kodeon) - Advanced concurrency features (English)

## Running Examples

To compile and run an example:

```bash
cd ..
cargo run -- examples/hello-world.kodeon
```

For LLVM output:

```bash
cargo run -- examples/hello-world.kodeon --llvm
```

## Features Demonstrated

### Basic Features

-   Variable declarations
-   Function definitions
-   Control flow (if/else, loops)
-   Basic I/O operations

### Concurrency Features

-   Goroutines (`go`/`jalan`)
-   Channels (`make_channel`, `send`, `receive`)
-   Mutexes (`lock_mutex`, `unlock_mutex`)
-   Condition variables (`create_condition`, `wait_condition`, `signal_condition`)
-   Atomic operations (`atomic_load`, `atomic_store`)

## Contributing

To add new examples:

1. Create a new .kodeon file in this directory
2. Follow the existing style and conventions
3. Add the example to this README
4. Ensure the example compiles and runs correctly
