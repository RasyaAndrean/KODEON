# KODEON Performance Tests

This directory contains performance and benchmark tests for the KODEON compiler and runtime.

## Test Files

-   [simple_add.kodeon](simple_add.kodeon) - Simple addition performance test
-   [llvm_test.kodeon](llvm_test.kodeon) - LLVM backend performance tests

## Running Performance Tests

To run performance tests:

```bash
cd compiler
cargo bench
```

Performance tests are designed to measure:

1. Compilation speed
2. Memory usage
3. Execution speed
4. Scalability characteristics

## Test Structure

Performance tests in this directory focus on measuring various performance characteristics:

1. **Compilation Performance** - Measuring how quickly KODEON code compiles
2. **Runtime Performance** - Measuring execution speed of compiled code
3. **Memory Usage** - Measuring memory consumption during compilation and execution
4. **Scalability** - Measuring performance with varying input sizes

## Test Format

Performance tests are KODEON programs designed to:

1. Exercise specific performance-critical code paths
2. Be representative of real-world usage patterns
3. Include timing and measurement code
4. Produce consistent, reproducible results

## Contributing

When adding new performance tests:

1. Place test files in this directory
2. Follow the existing naming conventions
3. Ensure tests are well-documented with performance objectives
4. Verify tests produce consistent results before submitting changes

For more information about the testing roadmap, see [../DEVELOPMENT_PLAN.md](../DEVELOPMENT_PLAN.md).
