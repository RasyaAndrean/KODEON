// Marketplace Controller
const MarketplaceService = require("../services/marketplace.service");
const config = require("../config/marketplace.config");

class MarketplaceController {
    constructor() {
        this.service = new MarketplaceService(config);
    }

    // Initialize the controller
    async initialize() {
        console.log("Initializing marketplace controller...");
        await this.service.initialize();
        console.log("Marketplace controller initialized");
    }

    // Get all extensions
    async getExtensions(req, res) {
        try {
            const extensions = await this.service.getExtensions();
            res.json({
                success: true,
                data: extensions.map((ext) => ext.toObject()),
            });
        } catch (error) {
            console.error("Error in getExtensions:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch extensions",
            });
        }
    }

    // Get extension by ID
    async getExtensionById(req, res) {
        try {
            const { id } = req.params;
            const extension = await this.service.getExtensionById(id);

            if (extension) {
                res.json({
                    success: true,
                    data: extension.toObject(),
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: "Extension not found",
                });
            }
        } catch (error) {
            console.error("Error in getExtensionById:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch extension",
            });
        }
    }

    // Get extensions by category
    async getExtensionsByCategory(req, res) {
        try {
            const { category } = req.params;
            const extensions = await this.service.getExtensionsByCategory(
                category
            );
            res.json({
                success: true,
                data: extensions.map((ext) => ext.toObject()),
            });
        } catch (error) {
            console.error("Error in getExtensionsByCategory:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch extensions by category",
            });
        }
    }

    // Search extensions
    async searchExtensions(req, res) {
        try {
            const { query } = req.query;
            const extensions = await this.service.searchExtensions(query);
            res.json({
                success: true,
                data: extensions.map((ext) => ext.toObject()),
            });
        } catch (error) {
            console.error("Error in searchExtensions:", error);
            res.status(500).json({
                success: false,
                error: "Failed to search extensions",
            });
        }
    }

    // Get all categories
    async getCategories(req, res) {
        try {
            const categories = await this.service.getCategories();
            res.json({
                success: true,
                data: categories.map((cat) => cat.toObject()),
            });
        } catch (error) {
            console.error("Error in getCategories:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch categories",
            });
        }
    }

    // Get user account
    async getUserAccount(req, res) {
        try {
            const user = await this.service.getUserAccount();
            res.json({
                success: true,
                data: user.toObject(),
            });
        } catch (error) {
            console.error("Error in getUserAccount:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch user account",
            });
        }
    }

    // Install extension
    async installExtension(req, res) {
        try {
            const { userId, extensionId } = req.body;

            // Check if user can install paid extensions
            const canInstall = await this.service.canInstallPaidExtension(
                userId
            );
            if (!canInstall) {
                return res.status(403).json({
                    success: false,
                    error: "User cannot install paid extensions. Please upgrade to Pro plan.",
                });
            }

            const result = await this.service.installExtension(
                userId,
                extensionId
            );
            res.json(result);
        } catch (error) {
            console.error("Error in installExtension:", error);
            res.status(500).json({
                success: false,
                error: "Failed to install extension",
            });
        }
    }

    // Uninstall extension
    async uninstallExtension(req, res) {
        try {
            const { userId, extensionId } = req.body;
            const result = await this.service.uninstallExtension(
                userId,
                extensionId
            );
            res.json(result);
        } catch (error) {
            console.error("Error in uninstallExtension:", error);
            res.status(500).json({
                success: false,
                error: "Failed to uninstall extension",
            });
        }
    }

    // Purchase extension
    async purchaseExtension(req, res) {
        try {
            const { userId, extensionId } = req.body;
            const result = await this.service.purchaseExtension(
                userId,
                extensionId
            );
            res.json(result);
        } catch (error) {
            console.error("Error in purchaseExtension:", error);
            res.status(500).json({
                success: false,
                error: "Failed to purchase extension",
            });
        }
    }

    // Get featured extensions
    async getFeaturedExtensions(req, res) {
        try {
            const extensions = await this.service.getFeaturedExtensions();
            res.json({
                success: true,
                data: extensions.map((ext) => ext.toObject()),
            });
        } catch (error) {
            console.error("Error in getFeaturedExtensions:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch featured extensions",
            });
        }
    }

    // Get popular extensions
    async getPopularExtensions(req, res) {
        try {
            const { limit } = req.query;
            const extensions = await this.service.getPopularExtensions(
                parseInt(limit) || 10
            );
            res.json({
                success: true,
                data: extensions.map((ext) => ext.toObject()),
            });
        } catch (error) {
            console.error("Error in getPopularExtensions:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch popular extensions",
            });
        }
    }

    // Get newest extensions
    async getNewestExtensions(req, res) {
        try {
            const { limit } = req.query;
            const extensions = await this.service.getNewestExtensions(
                parseInt(limit) || 10
            );
            res.json({
                success: true,
                data: extensions.map((ext) => ext.toObject()),
            });
        } catch (error) {
            console.error("Error in getNewestExtensions:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch newest extensions",
            });
        }
    }
}

module.exports = MarketplaceController;
