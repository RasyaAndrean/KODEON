# KODEON Examples

This directory contains example programs demonstrating various features of the KODEON programming language.

## Directory Structure

The examples are organized into the following categories:

-   [basics/](basics/) - Basic KODEON programs for beginners
-   [standard-library/](standard-library/) - Examples using standard library modules
-   [web/](web/) - Web development examples
-   [concurrency/](concurrency/) - Concurrency and parallelism examples
-   [advanced/](advanced/) - Advanced KODEON features

## Examples by Category

### Basics ([basics/](basics/))

Simple programs to help you get started with KODEON:

-   `hello-world.kodeon` - Classic "Hello, World!" program
-   `simple_test.kodeon` - Basic syntax demonstration
-   `simple_math.kodeon` - Mathematical operations
-   `calculator.kodeon` - Simple calculator implementation

### Standard Library ([standard-library/](standard-library/))

Examples demonstrating the use of standard library modules:

-   `comprehensive_demo.kodeon` - Comprehensive demonstration of standard library modules

### Web ([web/](web/))

Web development examples:

-   `web_api_demo.kodeon` - REST API implementation

### Concurrency ([concurrency/](concurrency/))

Examples demonstrating concurrent and parallel execution:

-   `concurrency_example.kodeon` - Basic concurrency features
-   `concurrency_example_en.kodeon` - English version of concurrency example

### Advanced ([advanced/](advanced/))

Advanced KODEON features:

-   `advanced_concurrency.kodeon` - Advanced concurrency patterns
-   `advanced_concurrency_en.kodeon` - English version of advanced concurrency

## Running Examples

To run any example, use the KODEON compiler:

```bash
# Navigate to the compiler directory
cd ../compiler

# Run an example
cargo run -- ../examples/basics/hello-world.kodeon
```

## Multi-language Support

KODEON supports both Indonesian and English syntax. Examples are provided in both languages where applicable:

-   Files with Indonesian syntax use Indonesian keywords
-   Files with English syntax use English keywords
-   Some files contain both languages for comparison

## Contributing

Feel free to add more examples to demonstrate KODEON features. When adding examples:

1. Place them in the appropriate category directory
2. Include comments explaining the code
3. Follow the existing naming conventions
4. Ensure the code compiles and runs correctly
