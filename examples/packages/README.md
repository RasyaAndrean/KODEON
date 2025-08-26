# 📦 Package Management Example

This example demonstrates how to use external packages in KODEON.

## Structure

```
packages/
├── main.kodeon                    # Main program
├── kodeon_modules/                # External packages
│   └── math_utils/                # Math utilities package
│       └── src/
│           └── lib.kodeon         # Package implementation
```

## Package Content

The `math_utils` package provides basic mathematical operations:

-   `tambah(a, b)` - Addition
-   `kurang(a, b)` - Subtraction
-   `kali(a, b)` - Multiplication
-   `bagi(a, b)` - Division
-   `pangkat(basis, eksponen)` - Exponentiation
-   `akar_kuadrat(n)` - Square root

## Usage

To run this example:

```bash
cd compiler
cargo run -- ../examples/packages/main.kodeon
```

## Import Syntax

The main program imports the package using:

```kodeon
impor "math_utils" sebagai matematika
```

This makes all functions in the `math_utils` package available through the `matematika` alias.

## Output

When executed, the program will output:

```
Hasil tambah: 15
Hasil kurang: 5
Hasil kali: 50
Hasil bagi: 2
2 pangkat 8: 256
Akar kuadrat dari 16: 4
```

This demonstrates successful package resolution and function calls.
