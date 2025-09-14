# Getting Started with KODEON Package Manager

This guide will help you get started with the KODEON Package Manager (kpm) for managing packages in your KODEON projects.

## Prerequisites

Before using the KODEON Package Manager, ensure you have:

-   KODEON programming language installed
-   Internet connection for accessing the package registry

## Installation

The KODEON Package Manager is included with the KODEON ecosystem, so no additional installation is required.

## Basic Usage

### Initializing the Package Manager

To start using the package manager in your KODEON application:

```kodeon
// Import the Package Manager
impor PackageManager

// Create Package Manager instance
buat pm = PackageManager()

// Initialize package manager environment
pm.inisialisasi_lingkungan({
    registry: "https://registry.kodeon.dev",
    cache: "./.kodeon_cache"
})
```

### Installing Packages

To install a package:

```kodeon
// Install a specific version of a package
pm.pasang_paket("http-client", "1.2.3")

// Install the latest version of a package
pm.pasang_paket("database-driver")
```

### Listing Installed Packages

To see what packages are installed in your project:

```kodeon
buat daftar = pm.daftar_paket()
untuk setiap paket dalam daftar {
    tampilkan(paket.nama + " versi " + paket.versi)
}
```

### Searching for Packages

To search for packages in the registry:

```kodeon
buat hasil = pm.cari_paket("http")
untuk setiap item dalam hasil {
    tampilkan(item.nama + " - " + item.deskripsi)
}
```

### Getting Package Information

To get detailed information about a specific package:

```kodeon
buat info = pm.info_paket("http-client")
jika info bukan_tidak_ada {
    tampilkan("Nama: " + info.nama)
    tampilkan("Versi: " + info.versi)
    tampilkan("Deskripsi: " + info.deskripsi)
}
```

### Updating Packages

To check for package updates:

```kodeon
buat pembaruan = pm.periksa_pembaruan()
jika pembaruan.panjang > 0 {
    untuk setiap item dalam pembaruan {
        tampilkan(item.nama + " bisa diperbarui ke versi " + item.versi_baru)
    }
}
```

To update a specific package:

```kodeon
pm.perbarui_paket("http-client", "1.3.0")
```

### Removing Packages

To remove a package from your project:

```kodeon
pm.hapus_paket("http-client")
```

## Command Line Interface

The KODEON Package Manager also includes a command-line interface for managing packages:

```bash
# Install a package
kpm install http-client

# Remove a package
kpm remove http-client

# List installed packages
kpm list

# Search for packages
kpm search http

# Get package information
kpm info http-client

# Check for updates
kpm outdated

# Update all packages
kpm update
```

## Package Structure

When you install packages, they are stored in the `kodeon_modules` directory in your project:

```
project/
├── main.kodeon
├── kodeon_modules/
│   ├── http-client/
│   │   ├── src/
│   │   │   └── lib.kodeon
│   │   └── package.json
│   └── database-driver/
│       └── main.kodeon
```

## Creating Your Own Packages

To create a package for others to use:

1. Create a directory in `kodeon_modules` with your package name
2. Add your source code in either:
    - `src/lib.kodeon` (recommended)
    - `main.kodeon` in the package root directory
3. Create a `package.json` file with package metadata

Example package structure:

```
kodeon_modules/
└── greeting/
    ├── src/
    │   └── lib.kodeon
    └── package.json
```

Example `package.json`:

```json
{
    "name": "greeting",
    "version": "1.0.0",
    "description": "A simple greeting package",
    "author": "Your Name",
    "license": "MIT"
}
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

## Best Practices

1. **Use Semantic Versioning**: Follow semantic versioning (SemVer) for your packages
2. **Specify Dependencies**: Clearly specify your package dependencies
3. **Document Your Code**: Add comments to explain what your functions do
4. **Test Your Packages**: Include tests with your packages
5. **Keep Packages Small**: Create focused, single-purpose packages
6. **Handle Errors Gracefully**: Include proper error handling in your package functions

## Troubleshooting

### Package Not Found

If you get a "package not found" error:

1. Check your internet connection
2. Verify the package name is correct
3. Check if the package exists in the registry

### Version Conflicts

If you encounter version conflicts:

1. Check your dependency constraints
2. Use compatible version ranges
3. Consider updating conflicting packages

### Installation Failures

If package installation fails:

1. Check your disk space
2. Verify file permissions
3. Clear the package cache and try again

## Next Steps

-   Explore the [API Reference](api-reference.md) for detailed information about all package manager functions
-   Check out the [examples](../examples/) directory for more usage examples
-   Read about [dependency management](dependency-management.md) for advanced usage
-   Learn about [publishing packages](publishing-packages.md) to share your work with the community
