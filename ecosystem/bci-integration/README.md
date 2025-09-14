# KODEON BCI Integration

Natural language programming framework for Brain-Computer Interface (BCI) applications in KODEON.

## Overview

The BCI Integration component provides a comprehensive framework for creating Brain-Computer Interface applications using KODEON's natural language syntax. It supports both Indonesian and English programming constructs, making it accessible to a wider audience.

## Features

-   **Dual Language Support**: Write BCI applications in both Indonesian (Bahasa Indonesia) and English
-   **Cross-Platform**: Works with various BCI devices and platforms
-   **Signal Processing**: Comprehensive EEG signal processing capabilities
-   **Classification**: Multiple classification algorithms for intent recognition
-   **Calibration**: Automated calibration procedures for optimal performance
-   **Stimulus Management**: Visual, auditory, and tactile stimulus generation
-   **Response Handling**: Robust response processing and validation
-   **Component-Based Architecture**: Modular design for easy extension and customization

## Installation

```bash
# BCI integration is part of the KODEON ecosystem
# No additional installation required
```

## Quick Start

### Basic BCI Setup

```kodeon
// Import the BCI framework
impor BCI

// Create BCI instance
buat bci = BCI("motorik")

// Connect to BCI device
bci.hubungkan("Device_EEG_16_Channel")

// Start signal acquisition
bci.mulai_akuisisi()

// Add signal processor
buat pemroses = bci.tambah_pemroses_sinyal("filter_rendah")
pemroses.atur_parameter({ frekuensi_cutoff: 30 })

// Add classifier
buat klasifikasi = bci.tambah_klasifikasi("lda")

// Process signals
buat sinyal = SinyalEEG(16, 256)
buat sinyal_diproses = bci.proses_sinyal(sinyal)

// Send stimulus and get response
buat stimulus = Stimulus("visual")
stimulus.inisialisasi_visual(10, 0.8, { lebar: 200, tinggi: 200 })
bci.kirim_stimulus(stimulus)

buat respons = bci.dapatkan_respons()
```

## Components

### Core Modules

-   `IntiBCI`: Brain-Computer Interface core functionality

### BCI Components

-   `SinyalEEG`: EEG signal representation and management
-   `Stimulus`: Stimulus generation and management
-   `Respons`: Response representation and handling

### Utilities

-   `PemrosesSinyal`: Signal processing utilities
-   `Klasifikasi`: Classification algorithms
-   `Kalibrasi`: Calibration procedures

## API Reference

### BCI Class

Main class for creating BCI applications.

```kodeon
kelas BCI {
    fungsi inisialisasi(tipe)  // Initialize with BCI type
    fungsi hubungkan(perangkat)  // Connect to BCI device
    fungsi putuskan_koneksi()  // Disconnect from BCI device
    fungsi mulai_akuisisi()  // Start signal acquisition
    fungsi hentikan_akuisisi()  // Stop signal acquisition
    fungsi tambah_pemroses_sinyal(pemroses)  // Add signal processor
    fungsi tambah_klasifikasi(klasifikasi)  // Add classifier
    fungsi kalibrasi(data_kalibrasi)  // Calibrate BCI system
    fungsi proses_sinyal(sinyal)  // Process EEG signal
    fungsi kirim_stimulus(stimulus)  // Send stimulus
    fungsi dapatkan_respons()  // Get response
    fungsi perbarui()  // Update loop
}
```

## Examples

Check the [examples](examples/) directory for complete usage examples:

-   [Basic Usage](examples/basic-usage.kodeon): Comprehensive example showing BCI setup
-   [Advanced Features](examples/advanced.kodeon): Advanced features like calibration and multiple stimuli

## Contributing

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
