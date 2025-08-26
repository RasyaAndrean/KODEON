# KODEON User Guide

Welcome to KODEON, the world's easiest programming language! This guide will help you get started with writing programs in KODEON.

## What is KODEON?

KODEON is a revolutionary programming language designed to be the easiest to learn in the world while being versatile enough to support all application development needs. It uses a natural language-based syntax and eliminates unnecessary complexity.

## Key Features

- **Natural Language Approach** - Syntax similar to human language
- **Zero Configuration** - Ready to use without complex setup
- **Universal Platform** - One language for all platforms
- **Smart Defaults** - Automation of repetitive tasks
- **Progressive Learning** - Easy for beginners, powerful for experts
- **Bilingual Support** - Works with both Indonesian and English syntax

## Getting Started

### Installation

1. Download the KODEON installer from [kodeon-lang.org](https://kodeon-lang.org)
2. Run the installer and follow the setup instructions
3. Launch the KODEON IDE

### Your First Program

Let's write a simple "Hello, World!" program:

```kodeon
// Indonesian version
buat pesan = "Halo, Dunia!"
tampilkan pesan

// English version
create message = "Hello, World!"
show message
```

To run this program:

1. Open the KODEON IDE
2. Type the code above
3. Click the "Run" button
4. See the output in the console

## Language Basics

### Variables

Variables are used to store data. You can declare variables using `buat` (Indonesian) or `create` (English):

```kodeon
// Indonesian
buat nama = "KODEON"
buat umur = 5
buat aktif = benar

// English
create name = "KODEON"
create age = 5
create active = true
```

### Data Types

KODEON supports several data types:

1. **Numbers** - Integer and floating-point values
2. **Strings** - Text enclosed in double quotes
3. **Booleans** - `benar/salah` or `true/false`
4. **Arrays** - Collections of values
5. **Objects** - Key-value collections

### Operators

KODEON supports common mathematical and logical operators:

```kodeon
// Mathematical operators
buat hasil = 10 + 5    // Addition
buat hasil = 10 - 5    // Subtraction
buat hasil = 10 * 5    // Multiplication
buat hasil = 10 / 5    // Division
buat hasil = 10 % 3    // Modulo
buat hasil = 2 ** 3    // Power

// Comparison operators
buat hasil = 10 == 5   // Equal
buat hasil = 10 != 5   // Not equal
buat hasil = 10 < 5    // Less than
buat hasil = 10 > 5    // Greater than
buat hasil = 10 <= 5   // Less than or equal
buat hasil = 10 >= 5   // Greater than or equal

// Logical operators
buat hasil = benar dan salah  // AND
buat hasil = benar atau salah // OR
buat hasil = tidak benar      // NOT
```

### Control Structures

#### Conditional Statements

Use `jika`/`if` statements to execute code based on conditions:

```kodeon
// Indonesian
jika umur >= 18 maka:
    tampilkan "Dewasa"
sebaliknya:
    tampilkan "Anak-anak"

// English
if age >= 18 then:
    show "Adult"
otherwise:
    show "Child"
```

#### Loops

KODEON supports several types of loops:

```kodeon
// While loop - Indonesian
buat counter = 0
selama counter < 5 maka:
    tampilkan "Counter: " + counter
    counter = counter + 1

// While loop - English
create counter = 0
while counter < 5:
    show "Counter: " + counter
    counter = counter + 1

// For loop - Indonesian
untuk i dari 1 sampai 10 lakukan:
    tampilkan "Number: " + i

// For loop - English
for i from 1 to 10 do:
    show "Number: " + i
```

### Functions

Functions are reusable blocks of code. Define functions using `fungsi` (Indonesian) or `function` (English):

```kodeon
// Indonesian
fungsi sapa(nama):
    kembalikan "Halo, " + nama + "!"

hasil = sapa("KODEON")
tampilkan hasil

// English
function greet(name):
    return "Hello, " + name + "!"

result = greet("KODEON")
show result
```

### Classes

Classes are blueprints for creating objects. Define classes using `kelas` (Indonesian) or `class` (English):

```kodeon
// Indonesian
kelas Mobil:
    buat merek, model, tahun

    fungsi mulai():
        tampilkan "{merek} {model} dinyalakan"

    fungsi berhenti():
        tampilkan "Mobil berhenti"

mobil_saya = Mobil("Toyota", "Camry", 2023)
mobil_saya.mulai()

// English
class Car:
    create brand, model, year

    function start():
        show "{brand} {model} started"

    function stop():
        show "Car stopped"

my_car = Car("Toyota", "Camry", 2023)
my_car.start()
```

## Standard Library

KODEON comes with a comprehensive standard library. Here are some commonly used functions:

### Input/Output

```kodeon
// Display output
tampilkan "Hello, World!"  // Indonesian
show "Hello, World!"       // English
```

### String Functions

```kodeon
// Indonesian
buat panjang = panjang_string("KODEON")
buat hasil = gabung_string("Halo", " Dunia")

// English
create length = string_length("KODEON")
create result = concat_string("Hello", " World")
```

### Mathematical Functions

```kodeon
// Indonesian
buat akar = akar_kuadrat(16)
buat mutlak = nilai_mutlak(-5)

// English
create root = square_root(16)
create absolute = absolute_value(-5)
```

## Best Practices

### Naming Conventions

- Use descriptive names for variables and functions
- Use `camelCase` for variable names
- Use `PascalCase` for class names

### Code Organization

- Group related code together
- Use comments to explain complex logic
- Break large programs into smaller functions

### Error Handling

```kodeon
// Indonesian
coba:
    buat hasil = 10 / 0
tangkap:
    tampilkan "Terjadi kesalahan"
akhirnya:
    tampilkan "Operasi selesai"

// English
try:
    create result = 10 / 0
catch:
    show "An error occurred"
finally:
    show "Operation completed"
```

## Advanced Features

### Arrays

```kodeon
// Indonesian
buat angka = [1, 2, 3, 4, 5]
buat panjang = panjang_array(angka)
tampilkan "Panjang array: " + panjang

// English
create numbers = [1, 2, 3, 4, 5]
create length = array_length(numbers)
show "Array length: " + length
```

### Objects

```kodeon
// Indonesian
buat orang = {
    nama: "KODEON",
    umur: 5,
    aktif: benar
}

tampilkan orang.nama

// English
create person = {
    name: "KODEON",
    age: 5,
    active: true
}

show person.name
```

### Modules

Import functionality from other files:

```kodeon
// Indonesian
impor "math.kodeon" sebagai matematika
buat hasil = matematika.akar_kuadrat(16)

// English
import "math.kodeon" as math
create result = math.square_root(16)
```

## IDE Features

The KODEON IDE provides several features to enhance your development experience:

### Syntax Highlighting

The IDE automatically highlights different parts of your code:

- Keywords (blue)
- Strings (green)
- Comments (gray)
- Numbers (purple)

### Auto-Completion

As you type, the IDE suggests possible completions for keywords and functions.

### Error Detection

The IDE highlights syntax errors in real-time and provides helpful error messages.

### Running Programs

Click the "Run" button to execute your program and see the output in the console.

## Troubleshooting

### Common Errors

1. **"Variable not declared"** - Make sure you've declared the variable before using it
2. **"Syntax error"** - Check that your code follows the correct syntax
3. **"Function not found"** - Verify the function name is spelled correctly

### Getting Help

If you encounter issues not covered in this guide:

1. Check the examples in the `examples/` directory
2. Visit the KODEON community forums
3. Contact the support team

## Next Steps

1. Try the examples in the `examples/` directory
2. Experiment with different language features
3. Build your own programs
4. Join the KODEON community to share your creations

Happy coding with KODEON!
