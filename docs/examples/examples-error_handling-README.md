# KODEON Error Handling Examples

This directory contains example programs that demonstrate the enhanced error handling capabilities of the KODEON compiler.

## Examples

### [error_demo.kodeon](error_demo.kodeon) / [error_demo_en.kodeon](error_demo_en.kodeon)

Demonstrates various types of common programming errors:

1. **Undeclared Variable Error** - Using a variable before it's declared
2. **Type Mismatch Error** - Attempting operations on incompatible types
3. **Missing Semicolon** - Syntax error due to missing statement terminator
4. **Unclosed Brace** - Syntax error due to missing closing brace
5. **Duplicate Declaration** - Declaring the same variable twice

## Enhanced Error Features

When compiled with the enhanced KODEON compiler, these examples will produce detailed error messages that include:

-   **Clear Problem Description** - Natural language explanation of what went wrong
-   **Context Information** - Additional details about why the error occurred
-   **Helpful Suggestions** - Tips on how to fix the error
-   **Code Examples** - Examples of correct usage
-   **Visual Indicators** - Clear formatting with emojis and structured output

## Usage

To see the enhanced error messages in action:

```bash
# Compile the Indonesian version
kodeon error_demo.kodeon

# Compile the English version
kodeon error_demo_en.kodeon
```

## Expected Enhanced Error Output

The enhanced error messages will look something like this:

```
❌ Semantic error at line 3, column 13: Variable 'jumlah' is not declared
   💡 Context: You're trying to use a variable that hasn't been declared.
   💡 Tip: Declare the variable before using it, or check if you've spelled the name correctly.
   📘 Example:
      // Correct syntax:
      var jumlah = 0;
      hasil = jumlah + 5;
```

These enhanced error messages make it much easier for developers to understand what went wrong and how to fix it, improving the overall development experience.
