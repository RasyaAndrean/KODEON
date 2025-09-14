# Getting Started with KODEON AR/VR Integration

This guide will help you get started with creating AR/VR applications using KODEON's natural language programming framework.

## Prerequisites

-   KODEON development environment installed
-   Basic understanding of KODEON syntax (dual language support for Indonesian/English)
-   AR/VR hardware (optional for development, required for deployment)

## Installation

The AR/VR Integration component is part of the KODEON ecosystem and is included by default. No additional installation is required.

## Creating Your First AR Application

### 1. Import the Framework

```kodeon
// Import the AR/VR framework
impor ARVR
```

### 2. Initialize AR Environment

```kodeon
// Create AR instance
buat ar = ARVR("ar")

// Initialize with configuration
buat konfigurasi = {
    resolusi: { lebar: 1920, tinggi: 1080 },
    pencahayaan: { tipe: "lingkungan", intensitas: 0.8 }
}

ar.inisialisasi_lingkungan(konfigurasi)
```

### 3. Create a 3D Scene

```kodeon
// Add a 3D scene
buat pemandangan = Pemandangan3D("Pemandangan AR Saya")
ar.tambah_pemandangan(pemandangan)
```

### 4. Add 3D Objects

```kodeon
// Add a 3D object
buat kubus = Objek3D("Kubus", geometri_kubus(), material_dasar())
kubus.atur_posisi(0, 0, -5)
ar.tambah_objek(kubus)
```

### 5. Render the Scene

```kodeon
// Render the scene
ar.render()
```

## Creating Your First VR Application

### 1. Import the Framework

```kodeon
// Import the AR/VR framework
impor ARVR
```

### 2. Initialize VR Environment

```kodeon
// Create VR instance
buat vr = ARVR("vr")

// Initialize with configuration
buat konfigurasi = {
    resolusi: { lebar: 2160, tinggi: 2160 }, // Per eye for HMD
    pencahayaan: { tipe: "arah", arah: { x: 0, y: -1, z: -1 }, intensitas: 1.0 }
}

vr.inisialisasi_lingkungan(konfigurasi)
```

### 3. Create a 3D Scene

```kodeon
// Add a 3D scene
buat pemandangan = Pemandangan3D("Pemandangan VR Saya")
pemandangan.atur_latar_belakang("#333366")
vr.tambah_pemandangan(pemandangan)
```

### 4. Add 3D Objects

```kodeon
// Add multiple 3D objects
buat bola = Objek3D("Bola", geometri_bola(), material_berkilau())
bola.atur_posisi(-2, 0, -5)
vr.tambah_objek(bola)

buat kerucut = Objek3D("Kerucut", geometri_kerucut(), material_berwarna("#ff5500"))
kerucut.atur_posisi(2, 0, -5)
vr.tambah_objek(kerucut)
```

### 5. Render the Scene

```kodeon
// Render the scene
vr.render()
```

## Adding Interactivity

### Motion Detection

```kodeon
// Enable motion detection
buat deteksi_gerak = ar.aktifkan_deteksi_gerak()
deteksi_gerak.atur_callback(fungsi(gerakan, intensitas) {
    tampilkan("Gerakan terdeteksi dengan intensitas: " + intensitas)
    // Move object based on motion
    kubus.atur_posisi(kubus.posisi.x + gerakan.x * 0.1, kubus.posisi.y + gerakan.y * 0.1, kubus.posisi.z)
})
```

### Hand Tracking

```kodeon
// Enable hand tracking
buat pelacakan_tangan = ar.aktifkan_pelacakan_tangan()
pelacakan_tangan.atur_callback(fungsi(tangan) {
    tampilkan("Tangan terdeteksi: " + tangan.panjang + " tangan")
    jika tangan.panjang > 0 {
        // Get gesture and react
        buat gestur = pelacakan_tangan.dapatkan_gestur(tangan[0])
        tampilkan("Gestur terdeteksi: " + gestur)
    }
})
```

### Voice Recognition

```kodeon
// Enable voice recognition
buat pengenalan_suara = vr.aktifkan_pengenalan_suara()
pengenalan_suara.atur_bahasa("id-ID")
pengenalan_suara.daftarkan_perintah("pindah ke kanan", fungsi() {
    bola.atur_posisi(bola.posisi.x + 1, bola.posisi.y, bola.posisi.z)
    kembalikan "Bola dipindahkan ke kanan"
})

pengenalan_suara.daftarkan_perintah("tingkatkan ukuran", fungsi() {
    bola.atur_skala(bola.skala.x * 1.2, bola.skala.y * 1.2, bola.skala.z * 1.2)
    kembalikan "Ukuran bola ditingkatkan"
})

pengenalan_suara.atur_callback(fungsi(perintah, hasil) {
    tampilkan("Perintah suara dieksekusi: " + perintah + " -> " + hasil)
})
```

## Animation Loop

```kodeon
// Animation loop
buat sudut = 0
buat animasi = fungsi() {
    // Rotate object
    objek.atur_rotasi(sudut, sudut * 0.5, sudut * 0.2)
    sudut = sudut + 0.05

    // Update AR system
    ar.perbarui()

    // Render frame
    ar.render()

    // Continue animation
    jika sudut < Math.PI * 4 {
        // In real implementation: requestAnimationFrame(animasi)
    }
}

// Start animation
animasi()
```

## Next Steps

1. Explore the [examples](../examples/) directory for more comprehensive usage examples
2. Check the [API Reference](api-reference.md) for detailed documentation of all classes and methods
3. Learn about [Advanced Features](advanced-features.md) like custom shaders and physics integration
4. Review the [Best Practices](best-practices.md) for optimal performance

## Troubleshooting

### Common Issues

1. **Camera not working**: Ensure you have proper permissions and camera access
2. **Performance issues**: Optimize 3D models and reduce polygon count
3. **Tracking problems**: Ensure good lighting conditions for hand tracking

### Getting Help

-   Check the [KODEON Documentation](../../docs/)
-   Visit the [Community Forum](../../community/)
-   File issues on the [GitHub Repository](../../.github/)

## Further Reading

-   [API Reference](api-reference.md)
-   [Advanced Features](advanced-features.md)
-   [Performance Optimization](performance.md)
-   [Deployment Guide](deployment.md)
