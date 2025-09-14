# KODEON Tests

This directory contains tests for the KODEON programming language and its compiler, organized according to the [MASTER_ORGANIZATION_PLAN.md](../MASTER_ORGANIZATION_PLAN.md).

## Directory Structure

The tests are organized into the following categories:

-   [unit/](unit/) - Unit tests for individual compiler components
-   [integration/](integration/) - Integration tests for end-to-end functionality
-   [performance/](performance/) - Performance and benchmark tests
-   [compatibility/](compatibility/) - Cross-platform compatibility tests
-   [functional/](functional/) - Feature-specific functional tests

## Functional Test Structure

The functional tests are further organized into:

-   [functional/standard-library/](functional/standard-library/) - Tests for standard library modules
-   [functional/compiler/](functional/compiler/) - Tests for compiler features
-   [functional/language-features/](functional/language-features/) - Tests for language features

## Test Categories

### Unit Tests ([unit/](unit/))

These tests are written in Rust and test individual components of the compiler:

-   Lexer tests
-   Parser tests
-   Semantic analyzer tests
-   IR generation tests
-   LLVM backend tests
-   Transpiler tests

### Integration Tests ([integration/](integration/))

The [integration/](integration/) directory contains end-to-end tests that verify the complete compilation pipeline:

-   [comprehensive_extended_test.kodeon](integration/comprehensive_extended_test.kodeon) - Comprehensive integration test

### Functional Tests ([functional/](functional/))

KODEON test programs used for testing various language features:

-   [functional/standard-library/](functional/standard-library/) - Standard library tests
-   [functional/language-features/](functional/language-features/) - Language feature tests
-   Individual test files for specific features

### Performance Tests ([performance/](performance/))

Performance and benchmark tests:

-   [simple_add.kodeon](performance/simple_add.kodeon) - Simple addition performance test
-   [llvm_test.kodeon](performance/llvm_test.kodeon) - LLVM backend performance tests

## Running Tests

To run all tests:

```bash
cd compiler
cargo test
```

To run specific tests:

```bash
# Run lexer tests
cargo test lexer

# Run LLVM backend tests
cargo test llvm

# Run integration tests
cargo test integration
```

## Test Standards

### Code Quality

-   Tests should be clear and readable
-   Each test should verify a specific behavior
-   Tests should include both positive and negative cases
-   Test names should clearly describe what is being tested

### Coverage

-   All language features should have corresponding tests
-   Edge cases should be thoroughly tested
-   Both English and Indonesian syntax should be tested
-   Error conditions should be tested

### Maintenance

-   Tests should be updated when features change
-   Flaky tests should be identified and fixed
-   Test performance should be monitored
-   Test documentation should be maintained

## Contributing

To contribute new tests:

1. Fork the repository
2. Add your test file to the appropriate directory
3. Ensure your tests follow the established patterns
4. Verify all tests pass
5. Submit a pull request

Please ensure your tests:

-   Test clear, specific functionality
-   Include both positive and negative cases
-   Follow the existing style
-   Work correctly with the current compiler

For more information about the testing roadmap, see [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md).
