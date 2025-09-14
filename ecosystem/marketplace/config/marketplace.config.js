// Marketplace Configuration
module.exports = {
    // API Configuration
    api: {
        baseUrl: "https://api.kodeon.id/marketplace",
        version: "v1",
        timeout: 10000,
    },

    // Database Configuration
    database: {
        host: "localhost",
        port: 5432,
        name: "kodeon_marketplace",
        user: "marketplace_user",
        password: "marketplace_password",
    },

    // Storage Configuration
    storage: {
        extensionsPath: "./extensions",
        themesPath: "./themes",
        screenshotsPath: "./screenshots",
    },

    // Payment Configuration
    payment: {
        provider: "stripe",
        currency: "USD",
        taxRate: 0.1,
    },

    // Security Configuration
    security: {
        jwtSecret: "marketplace_jwt_secret",
        encryptionKey: "marketplace_encryption_key",
    },

    // Cache Configuration
    cache: {
        ttl: 300, // 5 minutes
        maxSize: 1000,
    },
};
