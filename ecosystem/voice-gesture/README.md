# KODEON Voice/Gesture

Natural interaction framework for voice commands and gesture recognition in KODEON.

## Description

The Voice/Gesture component enables natural interaction with the KODEON platform through voice commands and gesture recognition. It provides a comprehensive framework for integrating voice control and gesture-based interfaces into KODEON applications.

## Features

-   Voice command recognition and processing
-   Gesture recognition and interpretation
-   Device control through voice and gesture commands
-   Multi-language support (Indonesian/English)
-   Extensible command system
-   Device connection management
-   Comprehensive logging and monitoring

## Installation

```bash
npm install @kodeon/voice-gesture
```

Or using KODEON Package Manager:

```bash
kpm install voice-gesture
```

## Usage

### Basic Usage

```kodeon
// Import the VoiceGesture class
impor VoiceGesture dari '@kodeon/voice-gesture'

// Initialize the framework
buat voiceGesture = VoiceGesture()

// Initialize with configuration
voiceGesture.inisialisasi_voice_gesture({
  bahasa: "indonesia",
  perangkat_suara: "default",
  perangkat_gestur: "kamera"
})

// Register voice commands
voiceGesture.daftar_perintah_suara("halo", fungsi() {
  tampilkan("Halo! Ada yang bisa saya bantu?")
})

// Register gesture commands
voiceGesture.daftar_perintah_gerakan("tangan_terbuka", fungsi() {
  tampilkan("Gestur dikenali: Tangan terbuka")
})

// Start recognition
voiceGesture.mulai_pengenalan_suara()
voiceGesture.mulai_pengenalan_gerakan()
```

### Advanced Usage

```kodeon
// Connect to devices
buat kontroler = voiceGesture.tambah_pengendali_perangkat(PengendaliPerangkat())
kontroler.hubungkan_perangkat("TV_Pintar", "192.168.1.100", "wifi")

// Register complex commands
voiceGesture.daftar_perintah_suara("matikan tv", fungsi() {
  kontroler.kirim_perintah("TV_Pintar", "power_off")
})

// Use gesture combinations
voiceGesture.daftar_perintah_gerakan("gerak_ke_kiri", fungsi() {
  // Switch to previous tab/application
})
```

## Examples

### Basic Example

Run the basic example:

```bash
npm run example:basic
```

Or in KODEON:

```bash
kodeon run src/examples/contoh-dasar.kodeon
```

### Advanced Example

Run the advanced example:

```bash
npm run example:advanced
```

Or in KODEON:

```bash
kodeon run src/examples/contoh-lanjutan.kodeon
```

## API Reference

### Main Classes

-   `VoiceGesture` - Main entry point for the framework
-   `IntiVoiceGesture` - Core engine for voice/gesture processing
-   `PengenalanSuara` - Voice recognition component
-   `PengenalanGerakan` - Gesture recognition component
-   `PengendaliPerangkat` - Device controller component
-   `SistemPerintah` - Command system component

### Utility Classes

-   `LoggerVoiceGesture` - Logging utility
-   `KonverterSuara` - Voice conversion utility
-   `PengenalGestur` - Gesture recognition utility
-   `PenghubungPerangkat` - Device connection utility

## Testing

Run tests:

```bash
npm test
```

Or in KODEON:

```bash
kodeon test src/tests/*.test.kodeon
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License

## Support

For support, please open an issue on our GitHub repository or contact the KODEON team.
