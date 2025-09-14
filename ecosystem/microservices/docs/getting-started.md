# Getting Started with KODEON Microservices Integration

This guide will help you get started with creating microservices applications using KODEON's natural language programming framework.

## Prerequisites

-   KODEON development environment installed
-   Basic understanding of KODEON syntax (dual language support for Indonesian/English)
-   Knowledge of microservices concepts and architecture

## Installation

The Microservices Integration component is part of the KODEON ecosystem and is included by default. No additional installation is required.

## Creating Your First Microservices Application

### 1. Import the Framework

```kodeon
// Import the Microservices framework
impor Microservices
```

### 2. Initialize Microservices Environment

```kodeon
// Create Microservices instance
buat ms = Microservices("microservices")

// Initialize microservices environment
ms.inisialisasi_lingkungan({
    lingkungan: "development",
    registry: "local"
})
```

### 3. Create and Configure Services

```kodeon
// Create service
buat userService = Layanan("user-service", "1.0.0", "/api/users")
userService.aktifkan()
ms.tambah_layanan(userService)
```

### 4. Create APIs

```kodeon
// Create API
buat userAPI = API("user-api", "v1", "/api/users")
userAPI.tambah_endpoint("GET", "/", fungsi(req) {
    kembalikan {
        status: 200,
        data: { pesan: "Daftar pengguna" }
    }
})

ms.tambah_api(userAPI)
```

### 5. Set up Service Registry

```kodeon
// Create service registry
buat registry = Registry("main-registry")
registry.daftarkan_layanan(userService, "localhost", 3001)
ms.tambah_registry(registry)
```

## Service Management

### Creating Services

```kodeon
// Create user service
buat userService = Layanan("user-service", "1.0.0", "/api/users")

// Create order service
buat orderService = Layanan("order-service", "1.0.0", "/api/orders")

// Create payment service
buat paymentService = Layanihan("payment-service", "1.0.0", "/api/payments")
```

### Configuring Services

```kodeon
// Set service configuration
userService.atur_konfigurasi({
    database: "mongodb://localhost:27017/users",
    port: 3001
})

// Add dependencies
orderService.tambah_dependensi(userService)
orderService.tambah_dependensi(paymentService)
```

### Service Activation

```kodeon
// Activate services
userService.aktifkan()
orderService.aktifkan()
paymentService.aktifkan()
```

## API Management

### Creating APIs

```kodeon
// Create REST API
buat api = API("main-api", "v1", "/api")

// Add endpoints
api.tambah_endpoint("GET", "/users", fungsi(req) {
    // Handle GET /users
})

api.tambah_endpoint("POST", "/users", fungsi(req) {
    // Handle POST /users
})

api.tambah_endpoint("GET", "/users/:id", fungsi(req) {
    // Handle GET /users/:id
})
```

### Adding Middleware

```kodeon
// Add global middleware
api.tambah_middleware(fungsi(req) {
    tampilkan("Request received: " + req.method + " " + req.path)
    kembalikan { status: 200 }
})

// Add endpoint-specific middleware
api.endpoints[0].middleware.tambah(fungsi(req) {
    // Authentication middleware
    jika bukan req.headers.authorization {
        kembalikan { status: 401, data: { pesan: "Unauthorized" } }
    }
    kembalikan { status: 200 }
})
```

### Rate Limiting

```kodeon
// Set rate limit
api.atur_rate_limit(1000, 3600000) // 1000 requests per hour
```

## Service Registry and Discovery

### Creating Registry

```kodeon
// Create service registry
buat registry = Registry("service-registry")

// Register services
registry.daftarkan_layanan(userService, "localhost", 3001)
registry.daftarkan_layanan(orderService, "localhost", 3002)
```

### Service Discovery

```kodeon
// Create service discovery
buat discovery = PenemuanLayanan("registry")
discovery.atur_registry(registry)

// Discover services
buat services = discovery.temukan("user-service")
```

### Heartbeat Management

```kodeon
// Send heartbeats
registry.kirim_heartbeat(instanceId)

// Check service health
registry.lakukan_cek_kesehatan("user-service")
```

## API Gateway

### Creating Gateway

```kodeon
// Create API gateway
buat gateway = Gateway("main-gateway", "localhost", 8080)

// Add routes
gateway.tambah_route("/api/users", userService)
gateway.tambah_route("/api/orders", orderService)
```

### Load Balancing

```kodeon
// Add load balancer
buat loadBalancer = PenyeimbangBeban("round_robin")
gateway.atur_load_balancer(loadBalancer)
```

### Middleware

```kodeon
// Add global middleware
gateway.tambah_middleware(fungsi(req) {
    // Logging middleware
    tampilkan("Request: " + req.method + " " + req.path)
    kembalikan { status: 200 }
})
```

## Load Balancing

### Creating Load Balancer

```kodeon
// Create load balancer
buat lb = PenyeimbangBeban("least_connections")
```

### Load Balancing Algorithms

```kodeon
// Round Robin
buat lb1 = PenyeimbangBeban("round_robin")

// Least Connections
buat lb2 = PenyeimbangBeban("least_connections")

// Weighted Round Robin
buat lb3 = PenyeimbangBeban("weighted_round_robin")
```

### Selecting Instances

```kodeon
// Select instance
buat instance = lb.pilih_instansi(serviceInstances)
```

## Security

### Creating Security Module

```kodeon
// Create security module
buat security = Keamanan("jwt")
security.konfigurasi({ kunci_rahasia: "secret_key" })
```

### Authentication Methods

```kodeon
// JWT Authentication
buat security = Keamanan("jwt")

// OAuth Authentication
buat security = Keamanan("oauth")

// API Key Authentication
buat security = Keamanan("api_key")

// TLS Security
buat security = Keamanan("tls")
```

### Token Management

```kodeon
// Generate JWT token
buat token = security.hasilkan_token_jwt(payload, expiration)

// Revoke token
security.cabut_token(token)

// Validate request
buat validasi = security.validasi(request)
```

## Monitoring

### Creating Monitoring Module

```kodeon
// Create monitoring module
buat monitoring = Monitoring("metrics")
```

### Recording Metrics

```kodeon
// Record metric
monitoring.catat_metrik("response_time", 150, { service: "user-service" })

// Record log
monitoring.catat_log("info", "Service started", { service: "user-service" })

// Record trace
monitoring.catat_trace("trace-123", {
    name: "database-query",
    duration: 45
})
```

### Alerts

```kodeon
// Add alert
monitoring.tambah_alert("response_time", ">", 1000, "High response time")

// Check statistics
buat stats = monitoring.hitung_statistik("response_time")
```

### Health Reports

```kodeon
// Generate health report
buat report = monitoring.hasilkan_laporan_kesehatan()

// Export Prometheus metrics
buat prometheus = monitoring.ekspor_prometheus()
```

## Advanced Features

### Service Communication

```kodeon
// Service calling another service
buat response = userService.tangani_permintaan({
    method: "GET",
    path: "/users/123"
})
```

### Service Scaling

```kodeon
// Scale service
userService.skalakan(3) // Scale to 3 instances
```

### Service Updates

```kodeon
// Update service
userService.perbarui("1.1.0", { newConfig: "value" })
```

### Health Checks

```kodeon
// Check service health
buat health = userService.periksa_kesehatan()
```

## Next Steps

1. Explore the [examples](../examples/) directory for more comprehensive usage examples
2. Check the [API Reference](api-reference.md) for detailed documentation of all classes and methods
3. Learn about [Advanced Features](advanced-features.md) like distributed tracing and circuit breakers
4. Review the [Best Practices](best-practices.md) for optimal microservices architecture

## Troubleshooting

### Common Issues

1. **Service discovery problems**: Ensure registry is properly configured and services are registered
2. **Load balancing issues**: Check load balancer configuration and instance health
3. **Security errors**: Verify authentication tokens and security configurations
4. **Performance problems**: Monitor metrics and optimize service configurations

### Getting Help

-   Check the [KODEON Documentation](../../docs/)
-   Visit the [Community Forum](../../community/)
-   File issues on the [GitHub Repository](../../.github/)

## Further Reading

-   [API Reference](api-reference.md)
-   [Advanced Features](advanced-features.md)
-   [Performance Optimization](performance.md)
-   [Deployment Guide](deployment.md)
