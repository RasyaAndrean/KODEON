# KODEON Language Guide

This guide provides a comprehensive overview of the KODEON programming language syntax and features.

## Syntax Philosophy

KODEON is designed with a natural language approach that allows developers to write code that closely resembles human language. The language supports both Indonesian and English syntax to make it accessible to a wider audience.

## Basic Syntax

### Comments

KODEON supports single-line comments using `//`:

```kodeon
// This is a comment in English
// Ini adalah komentar dalam bahasa Indonesia
```

### Variables

Variables are declared using `buat` (Indonesian) or `create` (English):

```kodeon
// Indonesian
buat nama = "KODEON"
buat versi = 1.0
buat aktif = benar

// English
create name = "KODEON"
create version = 1.0
create active = true
```

### Data Types

KODEON supports several built-in data types:

1. **Numbers**: Integer and floating-point values
2. **Strings**: Text enclosed in double quotes
3. **Booleans**: `benar/salah` or `true/false`
4. **Lists**: Ordered collections of values
5. **Maps**: Key-value collections

```kodeon
// Numbers
buat umur = 25
buat tinggi = 175.5

// Strings
buat nama = "Andi"
buat salam = "Halo, " + nama

// Booleans
buat sudah_makan = benar
buat lapar = tidak sudah_makan  // false

// Lists
buat warna = ["merah", "hijau", "biru"]
buat angka = [1, 2, 3, 4, 5]

// Maps
buat orang = {
    "nama": "Budi",
    "umur": 30,
    "kota": "Jakarta"
}
```

## Control Structures

### Conditional Statements

Conditional statements use `jika`/`if` and `maka`/`then`:

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

Multiple conditions can be combined with `dan`/`and` and `atau`/`or`:

```kodeon
jika umur >= 18 dan memiliki_ktp maka:
    tampilkan "Bisa membuat rekening bank"
```

### Loops

KODEON supports several loop constructs:

```kodeon
// Repeat while loop - Indonesian
buat i = 0
ulangi:
    tampilkan "Angka: " + i
    i = i + 1
selama i < 5

// Repeat while loop - English
create i = 0
repeat:
    show "Number: " + i
    i = i + 1
while i < 5

// For loop - Indonesian
untuk i dari 0 sampai 5 lakukan:
    tampilkan "Angka: " + i

// For loop - English
for i from 0 to 5 do:
    show "Number: " + i
```

## Functions

Functions are defined using `fungsi` (Indonesian) or `function` (English):

```kodeon
// Indonesian
fungsi hitung_luas(panjang, lebar):
    kembalikan panjang * lebar

hasil = hitung_luas(10, 5)

// English
function calculate_area(length, width):
    return length * width

result = calculate_area(10, 5)
```

Functions can have multiple parameters and can return any data type:

```kodeon
fungsi sapa(nama, waktu):
    jika waktu == "pagi" maka:
        kembalikan "Selamat pagi, " + nama
    sebaliknya:
        kembalikan "Halo, " + nama

salam = sapa("Andi", "pagi")
tampilkan salam
```

## Classes and Objects

KODEON supports object-oriented programming with classes:

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

## Operators

KODEON supports a variety of operators:

### Arithmetic Operators

- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `%` Modulo
- `**` Exponentiation

### Comparison Operators

- `==` Equal
- `!=` Not equal
- `<` Less than
- `>` Greater than
- `<=` Less than or equal
- `>=` Greater than or equal

### Logical Operators

- `dan`/`and` Logical AND
- `atau`/`or` Logical OR
- `tidak`/`not` Logical NOT

### Assignment Operators

- `=` Assignment

## Standard Library Functions

KODEON comes with a rich standard library. Here are some commonly used functions:

```kodeon
// Input/Output
tampilkan "Halo, Dunia!"  // Print to console
buat nama = baca_input()  // Read user input

// String functions
buat panjang = panjang("KODEON")  // Get string length
buat huruf_besar = ke_huruf_besar("kodeon")  // Convert to uppercase

// Math functions
buat acak = acak()  // Generate random number
buat akar = akar_kuadrat(16)  // Square root

// List functions
buat daftar = [1, 2, 3]
tambah_item(daftar, 4)  // Add item to list
buat panjang = panjang_daftar(daftar)  // Get list length
```

## Error Handling

KODEON provides mechanisms for handling errors gracefully:

```kodeon
// Try-catch structure (planned for future versions)
coba:
    // Code that might fail
    buat hasil = bagi(10, 0)
tangkap(error):
    tampilkan "Terjadi kesalahan: " + error.pesan
```

## Modules and Imports

For organizing larger programs, KODEON supports modules:

```kodeon
// math.kodeon
fungsi tambah(a, b):
    kembalikan a + b

fungsi kurang(a, b):
    kembalikan a - b

// main.kodeon
impor "math"
hasil = tambah(5, 3)
```

## Best Practices

1. **Use consistent language**: Choose either Indonesian or English keywords and stick with them throughout your project
2. **Meaningful variable names**: Use descriptive names that clearly indicate the purpose of variables
3. **Comment your code**: Add comments to explain complex logic
4. **Follow indentation**: Use consistent indentation to make code structure clear
5. **Modularize**: Break large programs into smaller, reusable functions and classes

## Next Steps

- Explore the [Standard Library Reference](stdlib.md) for detailed information about built-in functions
- Check out the [Tutorials](tutorials/) for hands-on learning
- Review the [Examples](../examples/) for practical code samples
