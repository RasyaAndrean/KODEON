# Referensi API Voice/Gesture KODEON

Dokumentasi lengkap untuk API Voice/Gesture dalam KODEON.

## Kelas Utama

### VoiceGesture

Kelas utama untuk framework Voice/Gesture.

#### Konstruktor

```kodeon
VoiceGesture()
```

#### Metode

##### inisialisasi_voice_gesture(konfigurasi)

Menginisialisasi framework voice/gesture dengan konfigurasi yang diberikan.

**Parameter:**

-   `konfigurasi` (Object): Objek konfigurasi
    -   `bahasa` (String): Bahasa untuk pengenalan suara ("indonesia" atau "english")
    -   `perangkat_suara` (String): Perangkat input suara
    -   `perangkat_gestur` (String): Perangkat input gestur

**Return:** Boolean - Berhasil atau tidak

##### hentikan()

Mematikan dan membersihkan framework voice/gesture.

**Return:** void

##### mulai_pengenalan_suara()

Memulai proses pengenalan suara.

**Return:** Boolean - Berhasil atau tidak

##### hentikan_pengenalan_suara()

Menghentikan proses pengenalan suara.

**Return:** Boolean - Berhasil atau tidak

##### mulai_pengenalan_gerakan()

Memulai proses pengenalan gerakan.

**Return:** Boolean - Berhasil atau tidak

##### hentikan_pengenalan_gerakan()

Menghentikan proses pengenalan gerakan.

**Return:** Boolean - Berhasil atau tidak

##### daftar_perintah_suara(perintah, fungsi)

Mendaftarkan perintah suara baru.

**Parameter:**

-   `perintah` (String): Teks perintah suara
-   `fungsi` (Function): Fungsi yang akan dijalankan saat perintah dikenali

**Return:** Boolean - Berhasil atau tidak

##### daftar_perintah_gerakan(gerakan, fungsi)

Mendaftarkan perintah gerakan baru.

**Parameter:**

-   `gerakan` (String): Nama gerakan
-   `fungsi` (Function): Fungsi yang akan dijalankan saat gerakan dikenali

**Return:** Boolean - Berhasil atau tidak

### IntiVoiceGesture

Mesin inti untuk pemrosesan voice/gesture.

#### Konstruktor

```kodeon
IntiVoiceGesture()
```

#### Metode

##### inisialisasi(konfigurasi)

Menginisialisasi mesin inti dengan konfigurasi.

##### hentikan()

Mematikan mesin inti.

##### mulai_pengenalan_suara()

Memulai pengenalan suara.

##### hentikan_pengenalan_suara()

Menghentikan pengenalan suara.

##### mulai_pengenalan_gerakan()

Memulai pengenalan gerakan.

##### hentikan_pengenalan_gerakan()

Menghentikan pengenalan gerakan.

##### daftar_perintah_suara(perintah, fungsi)

Mendaftarkan perintah suara.

##### daftar_perintah_gerakan(gerakan, fungsi)

Mendaftarkan perintah gerakan.

##### proses_perintah_suara(perintah)

Memproses perintah suara yang diterima.

##### proses_perintah_gerakan(gerakan)

Memproses gerakan yang diterima.

## Komponen

### PengenalanSuara

Komponen untuk pengenalan perintah suara.

#### Konstruktor

```kodeon
PengenalanSuara(opsi)
```

#### Metode

-   `inisialisasi_pengenalan(konfigurasi)`
-   `mulai()`
-   `hentikan()`
-   `daftar_perintah(perintah, fungsi_callback)`
-   `proses_input_suara(input_teks)`
-   `atur_bahasa(bahasa)`
-   `atur_sensitivitas(nilai)`
-   `dapatkan_status()`

### PengenalanGerakan

Komponen untuk pengenalan gerakan.

#### Konstruktor

```kodeon
PengenalanGerakan(opsi)
```

#### Metode

-   `inisialisasi_pengenalan(konfigurasi)`
-   `mulai()`
-   `hentikan()`
-   `daftar_gestur(nama_gestur, fungsi_callback)`
-   `proses_input_gestur(data_gestur)`
-   `atur_perangkat(perangkat)`
-   `atur_sensitivitas(nilai)`
-   `dapatkan_status()`

### PengendaliPerangkat

Komponen untuk mengontrol perangkat.

#### Konstruktor

```kodeon
PengendaliPerangkat(opsi)
```

#### Metode

-   `inisialisasi_kontroler()`
-   `hubungkan_perangkat(perangkat, alamat)`
-   `putuskan_perangkat(id_perangkat)`
-   `kirim_perintah(id_perangkat, perintah, parameter)`
-   `dapatkan_perangkat_terhubung()`
-   `dapatkan_perintah_didukung()`
-   `atur_mode(mode)`

### SistemPerintah

Komponen untuk manajemen perintah.

#### Konstruktor

```kodeon
SistemPerintah(opsi)
```

#### Metode

-   `inisialisasi_sistem()`
-   `daftar_perintah(nama, deskripsi, fungsi_eksekusi, jenis)`
-   `eksekusi_perintah(nama_perintah, parameter)`
-   `dapatkan_perintah(nama)`
-   `dapatkan_perintah_berdasarkan_jenis(jenis)`
-   `dapatkan_riwayat(limit)`
-   `dapatkan_statistik()`
-   `hapus_perintah(nama_perintah)`

## Utilitas

### LoggerVoiceGesture

Utilitas untuk logging aktivitas voice/gesture.

#### Konstruktor

```kodeon
LoggerVoiceGesture(opsi)
```

#### Metode

-   `info(pesan, data)`
-   `peringatan(pesan, data)`
-   `error(pesan, data)`
-   `log_perintah_suara(perintah, hasil)`
-   `log_perintah_gestur(gestur, hasil)`
-   `log_interaksi_perangkat(perangkat, aksi, hasil)`
-   `dapatkan_log(limit)`
-   `dapatkan_log_berdasarkan_tipe(tipe, limit)`
-   `hapus_log()`
-   `atur_tingkat_log(tingkat)`
-   `dapatkan_status()`
-   `aktifkan()`
-   `nonaktifkan()`

### KonverterSuara

Utilitas untuk konversi suara-teks dan teks-suara.

#### Konstruktor

```kodeon
KonverterSuara(opsi)
```

#### Metode

-   `inisialisasi_konverter()`
-   `konversi_ke_teks(data_suara)`
-   `konversi_ke_suara(teks)`
-   `atur_bahasa(bahasa)`
-   `atur_kualitas(kualitas)`
-   `dapatkan_status()`

### PengenalGestur

Utilitas untuk pengenalan gestur lanjutan.

#### Konstruktor

```kodeon
PengenalGestur(opsi)
```

#### Metode

-   `inisialisasi_pengenal()`
-   `kenali_gestur(data_input)`
-   `dapatkan_gestur_dikenal()`
-   `tambah_gestur_kustom(nama_gestur)`
-   `hapus_gestur(nama_gestur)`
-   `atur_perangkat(perangkat)`
-   `dapatkan_status()`

### PenghubungPerangkat

Utilitas untuk koneksi perangkat.

#### Konstruktor

```kodeon
PenghubungPerangkat(opsi)
```

#### Metode

-   `inisialisasi_penghubung()`
-   `hubungkan_perangkat(alamat, tipe_koneksi, nama_perangkat)`
-   `putuskan_perangkat(id_perangkat)`
-   `dapatkan_perangkat_terhubung()`
-   `dapatkan_semua_perangkat()`
-   `kirim_data(id_perangkat, data)`
-   `terima_data(id_perangkat)`
-   `dapatkan_status()`

## Contoh

### Penggunaan Dasar API

```kodeon
// Inisialisasi
buat inti = IntiVoiceGesture()
inti.inisialisasi({
  bahasa: "indonesia",
  perangkat_suara: "default",
  perangkat_gestur: "kamera"
})

// Mendaftarkan perintah
inti.daftar_perintah_suara("halo dunia", fungsi() {
  tampilkan("Halo Dunia!")
})

inti.daftar_perintah_gerakan("tangan_terbuka", fungsi() {
  tampilkan("Gestur dikenali!")
})

// Memulai pengenalan
inti.mulai_pengenalan_suara()
inti.mulai_pengenalan_gerakan()
```

## Tipe Data

### Konfigurasi VoiceGesture

```javascript
{
  bahasa: String,           // "indonesia" | "english"
  perangkat_suara: String,  // Nama perangkat input suara
  perangkat_gestur: String, // Nama perangkat input gestur
  mode: String,             // "normal" | "presentasi" | "game"
  sensitivitas: Number      // 0.0 - 1.0
}
```

### Objek Status

```javascript
{
  aktif: Boolean,
  bahasa: String,
  perangkat_suara: String,
  perangkat_gestur: String,
  total_perintah_suara: Number,
  total_perintah_gestur: Number
}
```

## Event

Framework ini tidak menggunakan sistem event tradisional, namun Anda dapat mengimplementasi callback dalam fungsi yang didaftarkan untuk menangani berbagai kondisi.

## Kesalahan dan Exception

Fungsi-fungsi dalam API ini dapat melempar kesalahan dalam kondisi tertentu:

-   Framework belum diinisialisasi
-   Perangkat tidak tersedia
-   Parameter tidak valid
-   Kesalahan koneksi perangkat

Selalu gunakan blok `coba...tangkap` untuk menangani kesalahan yang mungkin terjadi.
