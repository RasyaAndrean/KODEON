# KODEON IoT/Edge Integration

Natural language programming framework for Internet of Things (IoT) and Edge Computing applications in KODEON.

## Overview

The IoT/Edge Integration component provides a comprehensive framework for creating Internet of Things and Edge Computing applications using KODEON's natural language syntax. It supports both Indonesian and English programming constructs, making it accessible to a wider audience.

## Features

-   **Dual Language Support**: Write IoT/Edge applications in both Indonesian (Bahasa Indonesia) and English
-   **Cross-Platform**: Works with various IoT devices and edge computing platforms
-   **Device Management**: Comprehensive device representation and management
-   **Sensor Integration**: Support for multiple sensor types with calibration
-   **Actuator Control**: Control of various actuators with flexible commands
-   **Network Management**: Support for multiple network protocols (WiFi, Ethernet, Bluetooth, etc.)
-   **Data Processing**: Advanced data processing and filtering capabilities
-   **Communication Protocols**: Support for MQTT, HTTP, CoAP, and WebSocket
-   **Security**: Built-in security features including TLS, OAuth, and JWT
-   **Component-Based Architecture**: Modular design for easy extension and customization

## Installation

```bash
# IoT/Edge integration is part of the KODEON ecosystem
# No additional installation required
```

## Quick Start

### Basic IoT Setup

```kodeon
// Import the IoT framework
impor IoT

// Create IoT instance
buat iot = IoT("iot")

// Connect to IoT network
iot.hubungkan("jaringan_wifi_utama")

// Create a device
buat perangkat = Perangkat("DEV_001", "sensor_node")
perangkat.aktifkan()
iot.tambah_perangkat(perangkat)

// Add sensors to device
buat sensor_suhu = Sensor("SENS_001", "suhu", "°C")
perangkat.tambah_sensor(sensor_suhu)

// Read sensor data
buat data_sensor = perangkat.baca_sensor()

// Send data to network
iot.kirim_data(data_sensor, "server_cloud")
```

### Edge Computing Node

```kodeon
// Create IoT instance for edge computing
buat edge = IoT("edge")

// Connect to network
edge.hubungkan("jaringan_ethernet_lokal")

// Create edge node device
buat edge_node = Perangkat("EDGE_001", "edge_node")
edge_node.aktifkan()
edge.tambah_perangkat(edge_node)

// Add communication module
buat komunikasi = edge.tambah_komunikasi("mqtt")
komunikasi.hubungkan("mqtt.broker.local", { username: "edge_user", password: "edge_pass" })

// Subscribe to sensor data topic
komunikasi.berlangganan("sensor/data", fungsi(pesan, topik) {
    // Process received data
    buat data_diproses = edge.proses_data([pesan.nilai])

    // Publish processed data
    komunikasi.terbitkan("edge/processed", {
        sumber: pesan.id_perangkat,
        data_diproses: data_diproses[0]
    })
})
```

## Components

### Core Modules

-   `IntiIoT`: Internet of Things core functionality

### IoT Components

-   `Perangkat`: Device representation and management
-   `Sensor`: Sensor representation and management
-   `Aktuator`: Actuator representation and management
-   `Jaringan`: Network representation and management

### Utilities

-   `PemrosesData`: Data processing utilities
-   `Komunikasi`: Communication protocols
-   `Keamanan`: Security features

## API Reference

### IoT Class

Main class for creating IoT/Edge applications.

```kodeon
kelas IoT {
    fungsi inisialisasi(tipe)  // Initialize with IoT type
    fungsi hubungkan(jaringan)  // Connect to IoT network
    fungsi putuskan_koneksi()  // Disconnect from IoT network
    fungsi tambah_perangkat(perangkat)  // Add device
    fungsi tambah_sensor(sensor)  // Add sensor
    fungsi tambah_aktuator(aktuator)  // Add actuator
    fungsi tambah_pemroses_data(pemroses)  // Add data processor
    fungsi tambah_komunikasi(komunikasi)  // Add communication module
    fungsi tambah_keamanan(keamanan)  // Add security module
    fungsi proses_data(data)  // Process data
    fungsi kirim_data(data, tujuan)  // Send data
    fungsi terima_data()  // Receive data
    fungsi perbarui()  // Update loop
}
```

## Examples

Check the [examples](examples/) directory for complete usage examples:

-   [Basic Usage](examples/basic-usage.kodeon): Comprehensive example showing IoT setup
-   [Advanced Features](examples/advanced.kodeon): Advanced features like edge computing and security

## Contributing

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
