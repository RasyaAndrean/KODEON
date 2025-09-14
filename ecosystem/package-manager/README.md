# KODEON Package Manager (kpm)

Natural language package management for KODEON programming language.

## Overview

The KODEON Package Manager (kpm) provides a comprehensive solution for managing packages in KODEON projects. It supports both Indonesian and English programming constructs, making package management accessible to a wider audience.

## Features

-   **Dual Language Support**: Write package management commands in both Indonesian (Bahasa Indonesia) and English
-   **Package Installation**: Install packages from local and remote sources
-   **Dependency Management**: Automatic resolution and installation of package dependencies
-   **Package Publishing**: Publish your packages to the KODEON package registry
-   **Version Management**: Support for semantic versioning and version constraints
-   **Package Search**: Search for packages in the central registry
-   **Package Information**: View detailed information about packages
-   **Package Removal**: Remove packages from your project
-   **Package Updates**: Update packages to newer versions
-   **Local Registry**: Manage packages in a local registry
-   **Security Verification**: Verify package integrity and authenticity
-   **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

```bash
# Package manager is part of the KODEON ecosystem
# No additional installation required
```

## Quick Start

### Basic Package Management

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

// Install a package
pm.pasang_paket("http-client", "1.2.3")

// List installed packages
buat daftar = pm.daftar_paket()
tampilkan(daftar)

// Remove a package
pm.hapus_paket("http-client")
```

### Package Search and Information

```kodeon
// Search for packages
buat hasil = pm.cari_paket("http")
tampilkan(hasil)

// Get package information
buat info = pm.info_paket("http-client")
tampilkan(info)

// Check for updates
buat pembaruan = pm.periksa_pembaruan()
tampilkan(pembaruan)
```

## Components

### Core Modules

-   `IntiPackageManager`: Package manager core functionality

### Package Manager Components

-   `Paket`: Package representation and management
-   `Registry`: Package registry for package discovery
-   `Resolver`: Dependency resolver for package dependencies
-   `Installer`: Package installer for installing packages

### Utilities

-   `Cache`: Package caching mechanisms
-   `Security`: Security verification features
-   `Version`: Version management and comparison
-   `Downloader`: Package downloading functionality

### CLI

-   `CommandLine`: Command-line interface for package management

## API Reference

### PackageManager Class

Main class for managing packages in KODEON projects.

```kodeon
kelas PackageManager {
    fungsi inisialisasi()  // Initialize package manager
    fungsi inisialisasi_lingkungan(konfigurasi)  // Initialize package manager environment
    fungsi matikan_lingkungan()  // Shutdown package manager environment
    fungsi pasang_paket(nama, versi)  // Install a package
    fungsi hapus_paket(nama)  // Remove a package
    fungsi perbarui_paket(nama, versi)  // Update a package
    fungsi cari_paket(kueri)  // Search for packages
    fungsi info_paket(nama)  // Get package information
    fungsi daftar_paket()  // List installed packages
    fungsi periksa_pembaruan()  // Check for package updates
    fungsi publikasikan_paket(paket)  // Publish a package
    fungsi verifikasi_paket(nama)  // Verify package integrity
    fungsi perbarui()  // Update loop
}
```

## Command Line Interface

The Package Manager includes a command-line interface for managing packages:

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

# Publish a package
kpm publish
```

## Examples

Check the [examples](examples/) directory for complete usage examples:

-   [Basic Usage](examples/basic-usage.kodeon): Comprehensive example showing package management
-   [Advanced Features](examples/advanced.kodeon): Advanced features like publishing and security

## Contributing

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
