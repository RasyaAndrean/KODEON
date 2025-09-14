# KODEON Functional Tests

This directory contains functional tests written in KODEON to test specific language features and functionality.

## Test Files

-   [function_test.kodeon](function_test.kodeon) - Tests for function-related features
-   [multi_language_test.kodeon](multi_language_test.kodeon) - Tests for multi-language features
-   [multi_language_extended_test.kodeon](multi_language_extended_test.kodeon) - Extended tests for multi-language features

## Running Functional Tests

To run functional tests:

```bash
cd compiler
cargo test
```

Functional tests are automatically executed as part of the Rust testing framework.

## Test Structure

Functional tests in this directory focus on testing specific language features:

1. **Basic Syntax Features** - Testing fundamental KODEON syntax
2. **Multi-Language Support** - Testing both English and Indonesian syntax
3. **Advanced Language Features** - Testing complex language constructs
4. **Standard Library Functions** - Testing built-in functions and utilities

## Test Format

Functional tests are KODEON programs that:

1. Exercise specific language features
2. Include both positive and negative test cases
3. Are designed to be self-verifying
4. Follow consistent naming conventions

## Contributing

When adding new functional tests:

1. Place test files in this directory
2. Follow the existing naming conventions
3. Ensure tests are well-documented with comments
4. Verify all tests pass before submitting changes

For more information about the testing roadmap, see [../DEVELOPMENT_PLAN.md](../DEVELOPMENT_PLAN.md).
