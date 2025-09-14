// Marketplace Test Suite
const MarketplaceAPI = require("../api");
const Extension = require("../models/extension.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");

// Mock console.log to reduce test output
const originalLog = console.log;
console.log = () => {};

describe("Marketplace API", () => {
    let marketplaceAPI;

    beforeAll(async () => {
        marketplaceAPI = new MarketplaceAPI();
        await marketplaceAPI.initialize();
    });

    test("should initialize successfully", () => {
        expect(marketplaceAPI.isReady()).toBe(true);
    });

    test("should fetch extensions", async () => {
        const response = await marketplaceAPI.getExtensions();
        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
    });

    test("should fetch user account", async () => {
        const response = await marketplaceAPI.getUserAccount();
        expect(response.success).toBe(true);
        expect(response.data).toHaveProperty("id");
        expect(response.data).toHaveProperty("username");
        expect(response.data).toHaveProperty("email");
    });

    test("should check feature availability", async () => {
        const isAvailable = await marketplaceAPI.isFeatureAvailable(
            "marketplace-browse"
        );
        expect(typeof isAvailable).toBe("boolean");
    });

    test("should install extension", async () => {
        const response = await marketplaceAPI.installExtension(
            "theme-dark-pro"
        );
        expect(response.success).toBe(true);
    });
});

describe("Extension Model", () => {
    test("should create extension instance", () => {
        const extensionData = {
            name: "Test Extension",
            description: "A test extension",
            version: "1.0.0",
            author: "Test Author",
            category: "Test",
            price: 0,
            rating: 4.5,
            downloads: 1000,
        };

        const extension = new Extension(extensionData);
        expect(extension.name).toBe("Test Extension");
        expect(extension.description).toBe("A test extension");
        expect(extension.version).toBe("1.0.0");
    });

    test("should validate extension data", () => {
        const validExtension = new Extension({
            name: "Valid Extension",
            description: "A valid extension",
        });

        const validation = validExtension.validate();
        expect(validation.isValid).toBe(true);
        expect(validation.errors.length).toBe(0);

        const invalidExtension = new Extension({
            name: "",
            description: "",
        });

        const invalidValidation = invalidExtension.validate();
        expect(invalidValidation.isValid).toBe(false);
        expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });
});

describe("User Model", () => {
    test("should create user instance", () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
        };

        const user = new User(userData);
        expect(user.username).toBe("testuser");
        expect(user.email).toBe("test@example.com");
        expect(user.firstName).toBe("Test");
    });

    test("should check Pro user status", () => {
        const proUser = new User({
            subscription: {
                planId: "pro",
                status: "active",
            },
        });

        const freeUser = new User({
            subscription: {
                planId: "free",
                status: "active",
            },
        });

        expect(proUser.isProUser()).toBe(true);
        expect(freeUser.isProUser()).toBe(false);
    });

    test("should manage installed extensions", () => {
        const user = new User({});
        expect(user.hasInstalledExtension("test-extension")).toBe(false);

        user.installExtension("test-extension");
        expect(user.hasInstalledExtension("test-extension")).toBe(true);

        user.uninstallExtension("test-extension");
        expect(user.hasInstalledExtension("test-extension")).toBe(false);
    });
});

describe("Category Model", () => {
    test("should create category instance", () => {
        const categoryData = {
            name: "Test Category",
            description: "A test category",
            slug: "test-category",
        };

        const category = new Category(categoryData);
        expect(category.name).toBe("Test Category");
        expect(category.description).toBe("A test category");
        expect(category.slug).toBe("test-category");
    });

    test("should validate category data", () => {
        const validCategory = new Category({
            name: "Valid Category",
            slug: "valid-category",
        });

        const validation = validCategory.validate();
        expect(validation.isValid).toBe(true);
        expect(validation.errors.length).toBe(0);

        const invalidCategory = new Category({
            name: "",
            slug: "",
        });

        const invalidValidation = invalidCategory.validate();
        expect(invalidValidation.isValid).toBe(false);
        expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });
});

// Restore console.log
console.log = originalLog;
