# 📦 Package Management in KODEON

## Overview

KODEON now supports package management through the `kodeon_modules` directory structure. This allows developers to organize and reuse code across projects.

## Package Structure

Packages in KODEON follow a simple directory structure:

```
project/
├── main.kodeon              # Main program file
├── kodeon_modules/          # Directory for external packages
│   ├── package_name/        # Package directory
│   │   ├── src/             # Source code directory
│   │   │   └── lib.kodeon   # Main package file
│   │   └── main.kodeon      # Alternative main file (optional)
│   └── another_package/
│       └── main.kodeon      # Package with main file at root
```

## Importing Packages

To use a package in your KODEON program, use the `impor` (import) statement:

```kodeon
// Import a package with default name
impor "package_name"

// Import a package with an alias
impor "package_name" sebagai alias

// Examples:
impor "math_utils" sebagai matematika
impor "http_client"
```

## Creating a Package

To create a package:

1. Create a directory in `kodeon_modules` with your package name
2. Add your source code in either:
    - `src/lib.kodeon` (recommended)
    - `main.kodeon` in the package root directory

Example package structure:

```
kodeon_modules/
└── greeting/
    └── src/
        └── lib.kodeon
```

Example package content (`greeting/src/lib.kodeon`):

```kodeon
fungsi sapa(nama):
    kembalikan "Halo, " + nama + "!"

fungsi selamat_tinggal(nama):
    kembalikan "Selamat tinggal, " + nama + "!"
```

Using the package:

```kodeon
impor "greeting" sebagai sapa

fungsi utama():
    buat pesan = sapa.sapa("Dunia")
    tampilkan(pesan)
    kembalikan 0
```

## Package Resolution Order

When resolving imports, KODEON follows this order:

1. **Standard Library** - Built-in modules like `core`, `math`, `string`, etc.
2. **User Modules** - Modules registered programmatically
3. **External Packages** - Packages in the `kodeon_modules` directory
4. **Search Paths** - Additional paths specified in the module resolver

## Package File Priority

When looking for a package, KODEON checks for files in this order:

1. `kodeon_modules/package_name/src/lib.kodeon`
2. `kodeon_modules/package_name/main.kodeon`

## Best Practices

1. **Use Descriptive Names** - Choose clear, descriptive names for your packages
2. **Organize Code** - Structure your package code logically
3. **Document Functions** - Add comments to explain what your functions do
4. **Handle Errors** - Include proper error handling in your package functions
5. **Version Control** - Use version control for your packages

## Example Package

Here's a complete example of a math utilities package:

**kodeon_modules/math_utils/src/lib.kodeon:**

```kodeon
// Math utilities package for KODEON

fungsi tambah(a, b):
    kembalikan a + b

fungsi kurang(a, b):
    kembalikan a - b

fungsi kali(a, b):
    kembalikan a * b

fungsi bagi(a, b):
    jika b == 0 maka:
        lempar "Pembagian dengan nol tidak diperbolehkan"
    kembalikan a / b
```

**main.kodeon:**

```kodeon
impor "math_utils" sebagai matematika

fungsi utama():
    buat hasil = matematika.tambah(5, 3)
    tampilkan("5 + 3 = " + string(hasil))
    kembalikan 0
```

## Future Enhancements

The current package management system is the foundation for more advanced features:

1. **Package Manager (kpm)** - A command-line tool for managing packages
2. **Central Registry** - Online repository for sharing packages
3. **Dependency Management** - Automatic resolution of package dependencies
4. **Versioning** - Support for different package versions
5. **Security** - Package verification and signing

This package management system makes KODEON more modular and allows developers to build upon existing libraries, promoting code reuse and collaboration.
