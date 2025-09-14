# KODEON Web Framework

The KODEON Web Framework is a modern, lightweight web application framework designed specifically for the KODEON programming language. It provides developers with a simple yet powerful way to build web applications using KODEON's natural language syntax.

## Features

- **Simple Routing**: Intuitive route definitions with parameter support
- **Middleware System**: Extensible middleware for request processing
- **Template Engine**: Built-in template engine with KODEON syntax support
- **Database Integration**: ORM-like database access layer
- **Static File Serving**: Built-in static file server
- **Session Management**: Built-in session handling
- **Security Features**: CSRF protection, XSS prevention, and more
- **JSON Support**: Native JSON request/response handling
- **WebSockets**: Real-time communication support
- **Testing Framework**: Built-in testing utilities

## Directory Structure

```
web/
├── src/                # Framework source code
│   ├── core/           # Core framework components
│   ├── http/           # HTTP handling components
│   ├── middleware/     # Middleware functions
│   ├── templates/      # Template engine
│   ├── database/       # Database integration
│   └── utils/          # Utility functions
├── examples/           # Example applications
├── docs/               # Documentation
├── tests/              # Test suite
└── package.json        # Package configuration
```

## Installation

To use the KODEON Web Framework in your project:

```kodeon
impor "web" sebagai web

fungsi utama():
    buat aplikasi = web.buat_aplikasi()
    
    // Definisikan rute
    aplikasi.dapatkan("/", fungsi(permintaan, respons):
        kembalikan respons.kirim("Halo Dunia!")
    )
    
    // Jalankan server
    aplikasi.dengarkan(3000, fungsi():
        tampilkan("Server berjalan di port 3000")
    )
```

## Core Components

### Application (`src/core/application.kodeon`)

The main application class that handles routing, middleware, and server lifecycle.

### Router (`src/core/router.kodeon`)

Handles route registration and matching.

### Request (`src/http/request.kodeon`)

Represents an HTTP request with utility methods.

### Response (`src/http/response.kodeon`)

Represents an HTTP response with utility methods.

### Middleware (`src/middleware/`)

Collection of built-in middleware functions.

### Template Engine (`src/templates/`)

Built-in template engine for rendering views.

### Database (`src/database/`)

Database integration layer with ORM-like features.

## Examples

Check the [examples/](examples/) directory for sample applications demonstrating various features:

- Basic web server
- REST API
- Template rendering
- Database integration
- Middleware usage
- WebSocket communication

## API Reference

### Application Methods

- `buat_aplikasi()` - Create a new web application instance
- `dapatkan(rute, handler)` - Register a GET route
- `kirim(rute, handler)` - Register a POST route
- `perbarui(rute, handler)` - Register a PUT route
- `hapus(rute, handler)` - Register a DELETE route
- `gunakan(middleware)` - Register middleware
- `dengarkan(port, callback)` - Start the HTTP server

### Request Methods

- `permintaan.tubuh` - Request body
- `permintaan.query` - Query parameters
- `permintaan.parameter` - Route parameters
- `permintaan.header(nama)` - Get request header
- `permintaan.metode` - HTTP method

### Response Methods

- `respons.kirim(data)` - Send response
- `respons.json(data)` - Send JSON response
- `respons.status(kode)` - Set status code
- `respons.header(nama, nilai)` - Set response header
- `respons.render(template, data)` - Render template

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.