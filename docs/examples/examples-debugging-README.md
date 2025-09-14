# KODEON Debugging Examples

This directory contains example programs that demonstrate the debugging capabilities of the KODEON compiler and runtime.

## Examples

### [debug_demo.kodeon](debug_demo.kodeon) / [debug_demo_en.kodeon](debug_demo_en.kodeon)

Demonstrates various debugging scenarios:

1. **Class with Concurrency** - A Counter class using mutexes for thread safety
2. **Recursive Function** - A factorial function to demonstrate call stack debugging
3. **Loop Execution** - A for loop to show iteration debugging
4. **Variable Inspection** - Multiple variables with different scopes and types

## Debugging Features

When used with the enhanced KODEON debugger, these examples will support:

-   **Breakpoint Setting** - Set breakpoints at specific lines
-   **Step Execution** - Step through code line by line
-   **Variable Inspection** - Inspect variable values at any point
-   **Call Stack Viewing** - View the current call stack
-   **Expression Evaluation** - Evaluate expressions during debugging

## Usage

To debug these examples with the enhanced KODEON debugger:

```bash
# Debug the Indonesian version
kodeon --debug debug_demo.kodeon

# Debug the English version
kodeon --debug debug_demo_en.kodeon
```

## Debugging Commands

The enhanced KODEON debugger supports the following commands:

-   `break <line>` - Set breakpoint at line number
-   `run` - Start program execution
-   `continue` - Continue execution until next breakpoint
-   `step` - Step to next line
-   `next` - Step over function calls
-   `print <variable>` - Print variable value
-   `backtrace` - Show call stack
-   `list` - Show source code
-   `quit` - Exit debugger

## Example Debugging Session

A typical debugging session might look like this:

```
$ kodeon --debug debug_demo.kodeon
KODEON Debugger v1.0
Reading symbols from debug_demo.kodeon...done.
(kodeon-db) break 25
Breakpoint 1 at line 25
(kodeon-db) run
Starting program: debug_demo.kodeon
Breakpoint 1, at line 25
25:     untuk i dalam 1..5 {
(kodeon-db) print i
i = undefined
(kodeon-db) step
26:         penghitung.tambah(i)
(kodeon-db) print i
i = 1
(kodeon-db) continue
Program exited normally.
```

These debugging capabilities make it much easier for developers to understand program execution flow and identify issues in their code.
