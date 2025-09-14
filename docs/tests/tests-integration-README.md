# KODEON Integration Tests

This directory contains end-to-end integration tests that verify the complete compilation pipeline.

## Test Files

-   [comprehensive_extended_test.kodeon](comprehensive_extended_test.kodeon) - Comprehensive integration test

## Running Integration Tests

To run integration tests:

```bash
cd compiler
cargo test integration
```

Integration tests are designed to verify:

1. Complete compilation workflow
2. Multi-language feature integration
3. Target platform integration
4. Error handling integration

## Test Structure

Integration tests in this directory focus on testing the complete KODEON toolchain:

1. **Complete Compilation Workflow** - Testing the entire process from source code to executable
2. **Multi-Language Integration** - Testing integration between English and Indonesian syntax features
3. **Target Platform Integration** - Testing compilation to different target platforms (LLVM, JavaScript, etc.)
4. **Error Handling Integration** - Testing how errors propagate through the entire compilation pipeline

## Test Format

Integration tests are KODEON programs that:

1. Exercise multiple language features together
2. Test complex interactions between components
3. Verify correct behavior across the entire toolchain
4. Include both positive and negative test cases

## Contributing

When adding new integration tests:

1. Place test files in this directory
2. Follow the existing naming conventions
3. Ensure tests are well-documented with expected outcomes
4. Verify all tests pass before submitting changes

For more information about the testing roadmap, see [../DEVELOPMENT_PLAN.md](../DEVELOPMENT_PLAN.md).
