# Memulai dengan KODEON Voice/Gesture

Panduan ini akan membantu Anda memulai dengan komponen Voice/Gesture di KODEON.

## Prasyarat

Sebelum memulai, pastikan Anda telah:

1. Menginstal KODEON versi terbaru
2. Memahami dasar-dasar pemrograman KODEON
3. Memiliki perangkat input (mikrofon dan kamera) yang berfungsi

## Instalasi

### Menggunakan KODEON Package Manager

```bash
kpm install voice-gesture
```

### Menggunakan npm

```bash
npm install @kodeon/voice-gesture
```

## Konfigurasi Awal

### 1. Impor Komponen

```kodeon
impor VoiceGesture dari '@kodeon/voice-gesture'
```

### 2. Inisialisasi Framework

```kodeon
buat voiceGesture = VoiceGesture()

voiceGesture.inisialisasi_voice_gesture({
  bahasa: "indonesia",
  perangkat_suara: "default",
  perangkat_gestur: "kamera"
})
```

## Penggunaan Dasar

### Mendaftarkan Perintah Suara

```kodeon
// Mendaftarkan perintah suara sederhana
voiceGesture.daftar_perintah_suara("halo", fungsi() {
  tampilkan("Halo! Ada yang bisa saya bantu?")
})

// Mendaftarkan perintah suara dengan parameter
voiceGesture.daftar_perintah_suara("buka aplikasi", fungsi(namaAplikasi) {
  tampilkan("Membuka aplikasi: " + namaAplikasi)
})
```

### Mendaftarkan Perintah Gestur

```kodeon
// Mendaftarkan gestur sederhana
voiceGesture.daftar_perintah_gerakan("tangan_terbuka", fungsi() {
  tampilkan("Gestur dikenali: Tangan terbuka")
})

// Mendaftarkan gestur kompleks
voiceGesture.daftar_perintah_gerakan("gerak_ke_kiri", fungsi() {
  // Logika untuk berpindah ke tab sebelumnya
  tampilkan("Berpindah ke tab sebelumnya")
})
```

### Memulai Pengenalan

```kodeon
// Memulai pengenalan suara
voiceGesture.mulai_pengenalan_suara()

// Memulai pengenalan gestur
voiceGesture.mulai_pengenalan_gerakan()
```

## Contoh Penggunaan

### Contoh Sederhana

```kodeon
// Impor komponen yang diperlukan
impor VoiceGesture dari '@kodeon/voice-gesture'

// Inisialisasi
buat vg = VoiceGesture()
vg.inisialisasi_voice_gesture({ bahasa: "indonesia" })

// Daftarkan perintah
vg.daftar_perintah_suara("waktu", fungsi() {
  buat sekarang = new Date()
  tampilkan("Waktu saat ini: " + sekarang.toLocaleTimeString())
})

vg.daftar_perintah_gerakan("kepalkan_tangan", fungsi() {
  tampilkan("Aplikasi akan ditutup")
  vg.hentikan()
})

// Mulai pengenalan
vg.mulai_pengenalan_suara()
vg.mulai_pengenalan_gerakan()

// Loop utama
fungsi utama() {
  vg.perbarui()
}

// Jalankan aplikasi
utama()
```

## Konfigurasi Lanjutan

### Mengatur Sensitivitas

```kodeon
// Untuk pengenalan suara
buat pengenalanSuara = PengenalanSuara()
pengenalanSuara.atur_sensitivitas(0.9) // Rentang 0.0 - 1.0

// Untuk pengenalan gestur
buat pengenalanGestur = PengenalanGerakan()
pengenalanGestur.atur_sensitivitas(0.85)
```

### Menghubungkan Perangkat

```kodeon
buat penghubung = PenghubungPerangkat()
penghubung.inisialisasi_penghubung()

// Hubungkan ke perangkat
penghubung.hubungkan_perangkat("192.168.1.100", "wifi", "SmartTV")
```

## Penanganan Kesalahan

```kodeon
coba {
  voiceGesture.inisialisasi_voice_gesture(konfigurasi)
} tangkap(error) {
  tampilkan("Gagal menginisialisasi: " + error)
}

// Memeriksa status sebelum operasi
jika voiceGesture.terhubung {
  voiceGesture.mulai_pengenalan_suara()
} lain {
  tampilkan("Framework belum diinisialisasi")
}
```

## Best Practices

1. **Selalu inisialisasi** framework sebelum digunakan
2. **Periksa status** koneksi sebelum menjalankan operasi
3. **Gunakan penanganan kesalahan** yang tepat
4. **Bersihkan sumber daya** dengan memanggil fungsi hentikan()
5. **Gunakan logging** untuk debugging dan monitoring

## Troubleshooting

### Masalah Umum

1. **Pengenalan suara tidak bekerja**

    - Periksa koneksi mikrofon
    - Pastikan izin mikrofon diberikan
    - Cek level sensitivitas

2. **Pengenalan gestur tidak akurat**

    - Pastikan pencahayaan cukup
    - Periksa kualitas kamera
    - Sesuaikan sensitivitas gestur

3. **Perangkat tidak terhubung**
    - Verifikasi alamat dan protokol
    - Pastikan perangkat dalam jangkauan
    - Cek firewall dan pengaturan jaringan

### Logging untuk Debugging

```kodeon
buat logger = LoggerVoiceGesture()
logger.atur_tingkat_log("info")
logger.info("Debug message", { data: "additional info" })
```

## Sumber Daya Tambahan

-   [Dokumentasi API Lengkap](api.md)
-   [Contoh Implementasi](../src/examples/)
-   [Pengujian Unit](../src/tests/)
-   [Komunitas KODEON](../../community/)

## Dukungan

Untuk bantuan lebih lanjut, kunjungi:

-   Forum komunitas KODEON
-   Dokumentasi resmi
-   Saluran Discord resmi
