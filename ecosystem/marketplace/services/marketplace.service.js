// Marketplace Service
const Database = require("../utils/database");
const Extension = require("../models/extension.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");

class MarketplaceService {
    constructor(config) {
        this.config = config;
        this.db = new Database(config.database);
    }

    // Initialize the service
    async initialize() {
        console.log("Initializing marketplace service...");
        await this.db.initialize();
        console.log("Marketplace service initialized");
    }

    // Check if service is ready
    isReady() {
        return this.db.isConnected();
    }

    // Get all extensions
    async getExtensions() {
        try {
            const extensionsData = await this.db.query(
                "SELECT * FROM extensions WHERE isActive = true"
            );
            return extensionsData.map((ext) => new Extension(ext));
        } catch (error) {
            console.error("Error fetching extensions:", error);
            throw error;
        }
    }

    // Get extension by ID
    async getExtensionById(extensionId) {
        try {
            const extensionsData = await this.db.query(
                "SELECT * FROM extensions WHERE id = ? AND isActive = true",
                [extensionId]
            );
            if (extensionsData.length > 0) {
                return new Extension(extensionsData[0]);
            }
            return null;
        } catch (error) {
            console.error("Error fetching extension:", error);
            throw error;
        }
    }

    // Get extensions by category
    async getExtensionsByCategory(category) {
        try {
            const extensionsData = await this.db.query(
                "SELECT * FROM extensions WHERE category = ? AND isActive = true",
                [category]
            );
            return extensionsData.map((ext) => new Extension(ext));
        } catch (error) {
            console.error("Error fetching extensions by category:", error);
            throw error;
        }
    }

    // Search extensions
    async searchExtensions(query) {
        try {
            // In a real implementation, this would be a proper search query
            const extensionsData = await this.db.query(
                "SELECT * FROM extensions WHERE isActive = true"
            );

            // Filter based on search query
            const filteredExtensions = extensionsData.filter((ext) => {
                const searchableText = `${ext.name} ${ext.description} ${
                    ext.author
                } ${ext.tags.join(" ")}`.toLowerCase();
                return searchableText.includes(query.toLowerCase());
            });

            return filteredExtensions.map((ext) => new Extension(ext));
        } catch (error) {
            console.error("Error searching extensions:", error);
            throw error;
        }
    }

    // Get all categories
    async getCategories() {
        try {
            const categoriesData = await this.db.query(
                "SELECT * FROM categories WHERE isActive = true ORDER BY sortOrder"
            );
            return categoriesData.map((cat) => new Category(cat));
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }

    // Get user account
    async getUserAccount() {
        try {
            const usersData = await this.db.query(
                "SELECT * FROM users WHERE id = ?",
                ["user-123"]
            );
            if (usersData.length > 0) {
                return new User(usersData[0]);
            }

            // Return default user if not found
            return new User({
                id: "user-123",
                username: "kodeon_dev",
                email: "user@example.com",
                firstName: "KODEON",
                lastName: "Developer",
                subscription: {
                    planId: "pro",
                    status: "active",
                },
            });
        } catch (error) {
            console.error("Error fetching user account:", error);
            throw error;
        }
    }

    // Install extension for user
    async installExtension(userId, extensionId) {
        try {
            // In a real implementation, this would update the database
            console.log(
                `Installing extension ${extensionId} for user ${userId}`
            );
            return {
                success: true,
                message: "Extension installed successfully",
            };
        } catch (error) {
            console.error("Error installing extension:", error);
            throw error;
        }
    }

    // Uninstall extension for user
    async uninstallExtension(userId, extensionId) {
        try {
            // In a real implementation, this would update the database
            console.log(
                `Uninstalling extension ${extensionId} for user ${userId}`
            );
            return {
                success: true,
                message: "Extension uninstalled successfully",
            };
        } catch (error) {
            console.error("Error uninstalling extension:", error);
            throw error;
        }
    }

    // Check if user can install paid extension
    async canInstallPaidExtension(userId) {
        try {
            const user = await this.getUserAccount();
            return user.canInstallPaidExtension();
        } catch (error) {
            console.error("Error checking user permissions:", error);
            throw error;
        }
    }

    // Purchase extension
    async purchaseExtension(userId, extensionId) {
        try {
            // In a real implementation, this would process payment and update database
            console.log(
                `Processing purchase of extension ${extensionId} for user ${userId}`
            );
            return {
                success: true,
                message: "Extension purchased successfully",
            };
        } catch (error) {
            console.error("Error purchasing extension:", error);
            throw error;
        }
    }

    // Get featured extensions
    async getFeaturedExtensions() {
        try {
            const extensionsData = await this.db.query(
                "SELECT * FROM extensions WHERE isFeatured = true AND isActive = true LIMIT 10"
            );
            return extensionsData.map((ext) => new Extension(ext));
        } catch (error) {
            console.error("Error fetching featured extensions:", error);
            throw error;
        }
    }

    // Get popular extensions
    async getPopularExtensions(limit = 10) {
        try {
            const extensionsData = await this.db.query(
                "SELECT * FROM extensions WHERE isActive = true ORDER BY downloads DESC LIMIT ?",
                [limit]
            );
            return extensionsData.map((ext) => new Extension(ext));
        } catch (error) {
            console.error("Error fetching popular extensions:", error);
            throw error;
        }
    }

    // Get newest extensions
    async getNewestExtensions(limit = 10) {
        try {
            const extensionsData = await this.db.query(
                "SELECT * FROM extensions WHERE isActive = true ORDER BY createdAt DESC LIMIT ?",
                [limit]
            );
            return extensionsData.map((ext) => new Extension(ext));
        } catch (error) {
            console.error("Error fetching newest extensions:", error);
            throw error;
        }
    }

    // Update extension download count
    async incrementDownloadCount(extensionId) {
        try {
            // In a real implementation, this would update the database
            console.log(
                `Incrementing download count for extension ${extensionId}`
            );
            return { success: true };
        } catch (error) {
            console.error("Error incrementing download count:", error);
            throw error;
        }
    }
}

module.exports = MarketplaceService;
