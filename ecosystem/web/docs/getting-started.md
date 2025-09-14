# Getting Started with KODEON Web Framework

This guide will help you get started with the KODEON Web Framework, a modern web application framework designed specifically for the KODEON programming language.

## Installation

To use the KODEON Web Framework in your project, simply import it:

```kodeon
impor "web" sebagai web
```

## Creating Your First Application

Here's a simple "Hello World" application:

```kodeon
// Import the web framework
impor "web" sebagai web

// Create a new web application
buat aplikasi = web.buat_aplikasi()

// Define a route
aplikasi.dapatkan("/", fungsi(permintaan, respons):
    respons.kirim("Halo Dunia!")
)

// Start the server
aplikasi.dengarkan(3000, fungsi():
    tampilkan("Server berjalan di port 3000")
)
```

## Routing

The KODEON Web Framework supports various HTTP methods:

### Basic Routes

```kodeon
// GET route
aplikasi.dapatkan("/users", fungsi(permintaan, respons):
    respons.json({ pesan: "Dapatkan semua pengguna" })
)

// POST route
aplikasi.kirim("/users", fungsi(permintaan, respons):
    respons.status(201).json({ pesan: "Pengguna dibuat" })
)

// PUT route
aplikasi.perbarui("/users/:id", fungsi(permintaan, respons):
    respons.json({ pesan: "Pengguna diperbarui" })
)

// DELETE route
aplikasi.hapus("/users/:id", fungsi(permintaan, respons):
    respons.json({ pesan: "Pengguna dihapus" })
)
```

### Route Parameters

You can define route parameters using colons:

```kodeon
aplikasi.dapatkan("/users/:id", fungsi(permintaan, respons):
    buat id = permintaan.parameter("id")
    respons.json({ id_pengguna: id })
)
```

## Middleware

Middleware functions are executed before the route handler. You can add middleware using the `gunakan` method:

```kodeon
// Built-in middleware
aplikasi.gunakan(web.logger)  // Logs requests
aplikasi.gunakan(web.cors)    // Handles CORS

// Custom middleware
fungsi middleware_kustom(permintaan, respons):
    tampilkan("Middleware dijalankan")
    // Continue to next middleware/route handler

aplikasi.gunakan(middleware_kustom)
```

## Handling Requests and Responses

### Request Object

The request object contains information about the incoming HTTP request:

```kodeon
aplikasi.kirim("/api/data", fungsi(permintaan, respons):
    // Access request data
    buat metode = permintaan.metode
    buat jalur = permintaan.jalur
    buat query_params = permintaan.query
    buat body = permintaan.tubuh
    
    // Access specific headers
    buat user_agent = permintaan.header("User-Agent")
    
    respons.json({ diterima: benar })
)
```

### Response Object

The response object is used to send data back to the client:

```kodeon
aplikasi.dapatkan("/api/response", fungsi(permintaan, respons):
    // Send plain text
    respons.kirim("Halo!")
    
    // Send JSON
    respons.json({ pesan: "Halo!", data: [1, 2, 3] })
    
    // Set status code
    respons.status(404).kirim("Tidak ditemukan")
    
    // Set headers
    respons.header("X-Custom-Header", "nilai").kirim("Data")
    
    // Redirect
    respons.arahkan("/home")
)
```

## Template Rendering

The framework includes a simple template engine:

```kodeon
aplikasi.dapatkan("/halaman", fungsi(permintaan, respons):
    respons.render("halaman_utama", {
        judul: "Selamat Datang",
        konten: "Ini adalah halaman utama aplikasi kami"
    })
)
```

## Database Integration

For database operations, you can use the built-in ORM:

```kodeon
// Create a model
kelas UserModel meluas web.database.Model:
    fungsi inisialisasi():
        induk.inisialisasi("users")

// Use the model
buat User = UserModel()
buat semua_pengguna = User.semua()
```

## Running Your Application

To run your KODEON web application:

```bash
kodeon nama_aplikasi.kodeon
```

## Next Steps

- Check out the [examples](../examples/) directory for more complex applications
- Read the [API Reference](api-reference.md) for detailed information about all available methods
- Learn about [middleware](middleware.md) to extend your application's functionality
- Explore [database integration](database.md) for persistent data storage