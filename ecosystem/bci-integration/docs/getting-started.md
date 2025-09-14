# Getting Started with KODEON BCI Integration

This guide will help you get started with creating Brain-Computer Interface applications using KODEON's natural language programming framework.

## Prerequisites

-   KODEON development environment installed
-   Basic understanding of KODEON syntax (dual language support for Indonesian/English)
-   BCI hardware (EEG device or compatible simulator)

## Installation

The BCI Integration component is part of the KODEON ecosystem and is included by default. No additional installation is required.

## Creating Your First BCI Application

### 1. Import the Framework

```kodeon
// Import the BCI framework
impor BCI
```

### 2. Initialize BCI Environment

```kodeon
// Create BCI instance
buat bci = BCI("motorik")

// Connect to BCI device
bci.hubungkan("Device_EEG_16_Channel")
```

### 3. Configure Signal Processing

```kodeon
// Start signal acquisition
bci.mulai_akuisisi()

// Add signal processor
buat pemroses = bci.tambah_pemroses_sinyal("filter_rendah")
pemroses.atur_parameter({ frekuensi_cutoff: 30 })

// Add classifier
buat klasifikasi = bci.tambah_klasifikasi("lda")
```

### 4. Process Signals

```kodeon
// Process EEG signals
buat sinyal = SinyalEEG(16, 256)
buat sinyal_diproses = bci.proses_sinyal(sinyal)
```

### 5. Send Stimulus and Get Response

```kodeon
// Send stimulus
buat stimulus = Stimulus("visual")
stimulus.inisialisasi_visual(10, 0.8, { lebar: 200, tinggi: 200 })
bci.kirim_stimulus(stimulus)

// Get response
buat respons = bci.dapatkan_respons()
```

## BCI Types

KODEON supports different types of BCI applications:

### Motor Imagery BCI

```kodeon
buat bci = BCI("motorik")
```

### Visual BCI

```kodeon
buat bci = BCI("visual")
```

### Auditory BCI

```kodeon
buat bci = BCI("auditori")
```

## Signal Processing

### Creating EEG Signals

```kodeon
// Create EEG signal with 16 channels at 256 Hz sampling rate
buat sinyal = SinyalEEG(16, 256)

// Get signal information
buat info = sinyal.dapatkan_info()
tampilkan(info)
```

### Signal Filtering

```kodeon
// Apply low-pass filter
buat sinyal_difilter = sinyal.saring(30) // 30 Hz cutoff

// Normalize signal
buat sinyal_dinormalisasi = sinyal.normalisasi()
```

### Feature Extraction

```kodeon
// Extract frequency band power features
buat fitur = sinyal.ekstrak_fitur()
tampilkan("Alpha power: " + fitur.alpha_power)
tampilkan("Beta power: " + fitur.beta_power)
```

## Stimulus Generation

### Visual Stimulus

```kodeon
// Create visual stimulus
buat stimulus = Stimulus("visual")
stimulus.inisialisasi_visual(10, 0.8, { lebar: 200, tinggi: 200 })
stimulus.mulai()
```

### Auditory Stimulus

```kodeon
// Create auditory stimulus
buat stimulus = Stimulus("auditori")
stimulus.inisialisasi_auditori(500, 0.6, 1.0)
stimulus.mulai()
```

### Tactile Stimulus

```kodeon
// Create tactile stimulus
buat stimulus = Stimulus("taktil")
stimulus.inisialisasi_taktil(0.7, 0.5, "tangan_kanan")
stimulus.mulai()
```

## Response Handling

### Creating Responses

```kodeon
// Create motor imagery response
buat respons = Respons("gerak_kiri", { arah: "kiri", kekuatan: 0.8 }, 0.9)

// Create selection response
buat respons = Respons("pilihan", { indeks: 2, label: "Opsi C" }, 0.85)

// Create rest response
buat respons = Respons("istirahat", { durasi: 2.0 }, 0.95)
```

### Response Validation

```kodeon
// Check if response is valid
jika respons.apakah_valid() {
    tampilkan("Respons valid dengan kepercayaan: " + respons.dapatkan_kepercayaan())
}
```

### Response Mapping

```kodeon
// Map response to action
buat aksi = respons.petakan_ke_aksi()
tampilkan("Aksi yang dipetakan: " + aksi)
```

## Calibration

### Performing Calibration

```kodeon
// Generate calibration data
buat data_kalibrasi = []
// ... populate with training data ...

// Perform calibration
buat hasil_kalibrasi = bci.kalibrasi(data_kalibrasi)

jika hasil_kalibrasi.berhasil {
    tampilkan("Kalibrasi berhasil dengan akurasi: " + hasil_kalibrasi.akurasi)
}
```

### Online Calibration

```kodeon
// Perform online calibration with new data
bci.kalibrasi_online(data_baru)
```

## Advanced Features

### Signal Segmentation

```kodeon
// Segment signal into windows
buat segmen = sinyal.segmentasi(1.0, 0.5) // 1 second windows, 0.5 second steps
tampilkan("Jumlah segmen: " + segmen.panjang)
```

### Multiple Classifiers

```kodeon
// Add multiple classifiers for comparison
buat lda = bci.tambah_klasifikasi("lda")
buat svm = bci.tambah_klasifikasi("svm")
buat nn = bci.tambah_klasifikasi("neural_network")
```

### Cross-Validation

```kodeon
// Perform cross-validation
buat hasil = klasifikasi.validasi_silang(data, label, 5) // 5-fold CV
tampilkan("Akurasi rata-rata: " + hasil.rata_rata_akurasi)
```

## Next Steps

1. Explore the [examples](../examples/) directory for more comprehensive usage examples
2. Check the [API Reference](api-reference.md) for detailed documentation of all classes and methods
3. Learn about [Advanced Features](advanced-features.md) like real-time processing and feedback
4. Review the [Best Practices](best-practices.md) for optimal BCI performance

## Troubleshooting

### Common Issues

1. **Connection problems**: Ensure BCI device is properly connected and drivers are installed
2. **Poor signal quality**: Check electrode placement and impedance
3. **Low classification accuracy**: Perform additional calibration with more data

### Getting Help

-   Check the [KODEON Documentation](../../docs/)
-   Visit the [Community Forum](../../community/)
-   File issues on the [GitHub Repository](../../.github/)

## Further Reading

-   [API Reference](api-reference.md)
-   [Advanced Features](advanced-features.md)
-   [Performance Optimization](performance.md)
-   [Deployment Guide](deployment.md)
