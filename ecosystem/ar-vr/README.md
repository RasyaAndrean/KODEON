# KODEON AR/VR Integration

Natural language programming framework for Augmented Reality (AR) and Virtual Reality (VR) applications in KODEON.

## Overview

The AR/VR Integration component provides a comprehensive framework for creating immersive AR and VR experiences using KODEON's natural language syntax. It supports both Indonesian and English programming constructs, making it accessible to a wider audience.

## Features

-   **Dual Language Support**: Write AR/VR applications in both Indonesian (Bahasa Indonesia) and English
-   **Cross-Platform**: Works on various AR/VR devices and platforms
-   **Gesture Recognition**: Hand tracking and gesture detection capabilities
-   **Voice Control**: Voice recognition for hands-free interactions
-   **Motion Detection**: Device motion sensing for immersive experiences
-   **3D Scene Management**: Complete 3D scene graph with objects, lighting, and cameras
-   **Component-Based Architecture**: Modular design for easy extension and customization

## Installation

```bash
# AR/VR integration is part of the KODEON ecosystem
# No additional installation required
```

## Quick Start

### Basic AR Setup

```kodeon
// Import the AR/VR framework
impor ARVR

// Create AR instance
buat ar = ARVR("ar")

// Initialize with configuration
buat konfigurasi = {
    resolusi: { lebar: 1920, tinggi: 1080 },
    pencahayaan: { tipe: "lingkungan", intensitas: 0.8 }
}

ar.inisialisasi_lingkungan(konfigurasi)

// Add a 3D object
buat kubus = Objek3D("Kubus", geometri_kubus(), material_dasar())
kubus.atur_posisi(0, 0, -5)
ar.tambah_objek(kubus)

// Render the scene
ar.render()
```

### Basic VR Setup

```kodeon
// Create VR instance
buat vr = ARVR("vr")

// Initialize with configuration
buat konfigurasi = {
    resolusi: { lebar: 2160, tinggi: 2160 },
    pencahayaan: { tipe: "arah", arah: { x: 0, y: -1, z: -1 }, intensitas: 1.0 }
}

vr.inisialisasi_lingkungan(konfigurasi)

// Add 3D objects
buat bola = Objek3D("Bola", geometri_bola(), material_berkilau())
bola.atur_posisi(-2, 0, -5)
vr.tambah_objek(bola)

// Render the scene
vr.render()
```

## Components

### Core Modules

-   `IntiAR`: Augmented Reality core functionality
-   `IntiVR`: Virtual Reality core functionality

### 3D Components

-   `Pemandangan3D`: 3D scene management
-   `Objek3D`: 3D object representation
-   `Kamera`: Camera management
-   `Pencahayaan`: Lighting system

### Utilities

-   `DeteksiGerak`: Motion detection for device movement
-   `PelacakanTangan`: Hand tracking and gesture recognition
-   `PengenalanSuara`: Voice recognition for voice commands

## API Reference

### ARVR Class

Main class for creating AR/VR applications.

```kodeon
kelas ARVR {
    fungsi inisialisasi(tipe)  // Initialize with "ar" or "vr"
    fungsi inisialisasi_lingkungan(konfigurasi)  // Set up environment
    fungsi tambah_pemandangan(pemandangan)  // Add 3D scene
    fungsi tambah_objek(objek)  // Add 3D object
    fungsi atur_kamera(kamera)  // Set camera
    fungsi atur_pencahayaan(pencahayaan)  // Set lighting
    fungsi aktifkan_deteksi_gerak()  // Enable motion detection
    fungsi aktifkan_pelacakan_tangan()  // Enable hand tracking
    fungsi aktifkan_pengenalan_suara()  // Enable voice recognition
    fungsi render()  // Render the scene
    fungsi perbarui()  // Update loop
}
```

## Examples

Check the [examples](examples/) directory for complete usage examples:

-   [Basic Usage](examples/basic-usage.kodeon): Comprehensive example showing AR and VR setup
-   [Advanced Features](examples/advanced.kodeon): Advanced features like animations and interactions

## Contributing

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
