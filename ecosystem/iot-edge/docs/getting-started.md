# Getting Started with KODEON IoT/Edge Integration

This guide will help you get started with creating Internet of Things and Edge Computing applications using KODEON's natural language programming framework.

## Prerequisites

-   KODEON development environment installed
-   Basic understanding of KODEON syntax (dual language support for Indonesian/English)
-   IoT hardware (sensors, actuators, microcontrollers) or compatible simulator

## Installation

The IoT/Edge Integration component is part of the KODEON ecosystem and is included by default. No additional installation is required.

## Creating Your First IoT Application

### 1. Import the Framework

```kodeon
// Import the IoT framework
impor IoT
```

### 2. Initialize IoT Environment

```kodeon
// Create IoT instance
buat iot = IoT("iot")

// Connect to IoT network
iot.hubungkan("jaringan_wifi_utama")
```

### 3. Create and Configure Devices

```kodeon
// Create a device
buat perangkat = Perangkat("DEV_001", "sensor_node")
perangkat.aktifkan()
iot.tambah_perangkat(perangkat)

// Add sensors to device
buat sensor_suhu = Sensor("SENS_001", "suhu", "°C")
perangkat.tambah_sensor(sensor_suhu)
```

### 4. Read Sensor Data

```kodeon
// Read sensor data
buat data_sensor = perangkat.baca_sensor()
```

### 5. Send Data to Network

```kodeon
// Send data to network
iot.kirim_data(data_sensor, "server_cloud")
```

## IoT Device Types

KODEON supports different types of IoT devices:

### Sensor Nodes

```kodeon
buat perangkat = Perangkat("SENSOR_001", "sensor_node")
```

### Actuator Nodes

```kodeon
buat perangkat = Perangkat("ACTUATOR_001", "actuator_node")
```

### Edge Computing Nodes

```kodeon
buat perangkat = Perangkat("EDGE_001", "edge_node")
```

### Gateway Devices

```kodeon
buat perangkat = Perangkat("GATEWAY_001", "gateway")
```

## Sensor Management

### Creating Sensors

```kodeon
// Create temperature sensor
buat sensor_suhu = Sensor("TEMP_001", "suhu", "°C")

// Create humidity sensor
buat sensor_kelembaban = Sensor("HUM_001", "kelembaban", "%")

// Create light sensor
buat sensor_cahaya = Sensor("LIGHT_001", "cahaya", "lux")
```

### Reading Sensor Data

```kodeon
// Read single sensor
buat nilai = sensor_suhu.baca()

// Read all sensors from device
buat semua_data = perangkat.baca_sensor()
```

### Calibrating Sensors

```kodeon
// Calibrate sensor
sensor_suhu.kalibrasi(25.0, 24.8) // Reference: 25.0°C, Measured: 24.8°C
```

## Actuator Control

### Creating Actuators

```kodeon
// Create relay actuator
buat relay = Aktuator("RELAY_001", "relay")

// Create LED actuator
buat led = Aktuator("LED_001", "led")

// Create motor actuator
buat motor = Aktuator("MOTOR_001", "motor")
```

### Controlling Actuators

```kodeon
// Turn on actuator
relay.kendalikan({ tindakan: "hidupkan", nilai: 100 })

// Turn off actuator
relay.kendalikan({ tindakan: "matikan" })

// Set actuator value
led.kendalikan({ tindakan: "atur", nilai: 50 }) // 50% brightness

// Blink actuator
relay.kendalikan({ tindakan: "berkedip", durasi: 1000, interval: 500 })
```

## Network Management

### Creating Networks

```kodeon
// Create WiFi network
buat wifi = Jaringan("wifi", "192.168.1.1")

// Create Ethernet network
buat ethernet = Jaringan("ethernet", "10.0.0.1")
```

### Connecting to Networks

```kodeon
// Connect to WiFi network
wifi.hubungkan({ password: "wifi_password" })

// Connect device to network
wifi.hubungkan_perangkat(perangkat)
```

### Network Configuration

```kodeon
// Configure network parameters
wifi.atur_parameter({
    data_rate: 54000000, // 54 Mbps
    latensi: 5, // 5 ms
    keamanan: "wpa2",
    ssid: "IoT_Network"
})
```

## Data Processing

### Creating Data Processors

```kodeon
// Create filter processor
buat pemroses = PemrosesData("filter")
pemroses.atur_parameter({ tipe_filter: "rata_rata", ukuran_jendela: 5 })

// Create aggregation processor
buat agregator = PemrosesData("agregasi")
agregator.atur_parameter({ tipe_agregat: "rata_rata", interval: 60 })
```

### Processing Data

```kodeon
// Process sensor data
buat data_diproses = pemroses.proses(data_sensor)
```

## Communication Protocols

### MQTT Communication

```kodeon
// Create MQTT communication module
buat mqtt = Komunikasi("mqtt")
mqtt.hubungkan("mqtt.broker.local", { username: "user", password: "pass" })

// Publish message
mqtt.terbitkan("sensor/temperature", { nilai: 25.5, unit: "°C" })

// Subscribe to topic
mqtt.berlangganan("commands", fungsi(pesan, topik) {
    tampilkan("Perintah diterima: " + pesan)
})
```

### HTTP Communication

```kodeon
// Create HTTP communication module
buat http = Komunikasi("http")

// Send HTTP request
buat respons = http.kirim_http("POST", "https://api.example.com/data", data)
```

## Security

### Creating Security Modules

```kodeon
// Create TLS security module
buat keamanan = Keamanan("tls")
keamanan.konfigurasi({ level: "tinggi" })
```

### Securing Data

```kodeon
// Secure data
buat data_diamankan = keamanan.amankan(data_rahasia)

// Validate data
buat validasi = keamanan.validasi(data_diamankan)
```

### Authentication and Authorization

```kodeon
// Authenticate device
buat autentikasi = keamanan.autentikasi_perangkat("DEVICE_001", "device_password")

// Authorize access
buat otorisasi = keamanan.otorisasi("read_sensor", "DEVICE_001")
```

## Edge Computing

### Edge Node Setup

```kodeon
// Create edge computing instance
buat edge = IoT("edge")
edge.hubungkan("local_network")

// Create edge node
buat edge_node = Perangkat("EDGE_001", "edge_node")
edge.tambah_perangkat(edge_node)
```

### Local Data Processing

```kodeon
// Process data locally on edge node
buat data_diproses = edge.proses_data(data_sensor)
```

### Local Communication

```kodeon
// Set up local communication
buat komunikasi_lokal = edge.tambah_komunikasi("websocket")
komunikasi_lokal.hubungkan("ws://localhost:8080")
```

## Advanced Features

### Device Health Monitoring

```kodeon
// Check device health
buat kesehatan = perangkat.periksa_kesehatan()
jika bukan kesehatan.sehat {
    tampilkan("Masalah perangkat: " + kesehatan.masalah.gabung(", "))
}
```

### Network Quality Assessment

```kodeon
// Check network quality
buat kualitas = wifi.periksa_kualitas()
tampilkan("Kualitas jaringan: " + kualitas.kualitas)
```

### Batch Operations

```kodeon
// Process multiple sensors
buat sensor_array = [sensor1, sensor2, sensor3]
buat data_batch = Sensor.buat_array(sensor_array)
```

## Next Steps

1. Explore the [examples](../examples/) directory for more comprehensive usage examples
2. Check the [API Reference](api-reference.md) for detailed documentation of all classes and methods
3. Learn about [Advanced Features](advanced-features.md) like real-time processing and distributed computing
4. Review the [Best Practices](best-practices.md) for optimal IoT/Edge performance

## Troubleshooting

### Common Issues

1. **Connection problems**: Ensure network credentials are correct and devices are properly configured
2. **Sensor calibration**: Verify sensor readings with reference instruments
3. **Communication errors**: Check network connectivity and broker availability
4. **Security issues**: Ensure certificates and keys are properly configured

### Getting Help

-   Check the [KODEON Documentation](../../docs/)
-   Visit the [Community Forum](../../community/)
-   File issues on the [GitHub Repository](../../.github/)

## Further Reading

-   [API Reference](api-reference.md)
-   [Advanced Features](advanced-features.md)
-   [Performance Optimization](performance.md)
-   [Deployment Guide](deployment.md)
