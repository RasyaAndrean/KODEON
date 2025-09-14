// User Model for Marketplace
class User {
    constructor(data) {
        this.id = data.id || null;
        this.username = data.username || "";
        this.email = data.email || "";
        this.firstName = data.firstName || "";
        this.lastName = data.lastName || "";
        this.avatar = data.avatar || "";
        this.subscription = data.subscription || {
            planId: "free",
            status: "active",
            expiresAt: null,
        };
        this.installedExtensions = data.installedExtensions || [];
        this.purchasedExtensions = data.purchasedExtensions || [];
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.lastLoginAt = data.lastLoginAt || new Date();
    }

    // Check if user has a paid subscription
    isProUser() {
        return (
            this.subscription.planId === "pro" &&
            this.subscription.status === "active"
        );
    }

    // Check if user can install a paid extension
    canInstallPaidExtension() {
        return this.isProUser();
    }

    // Add extension to installed list
    installExtension(extensionId) {
        if (!this.installedExtensions.includes(extensionId)) {
            this.installedExtensions.push(extensionId);
            this.updatedAt = new Date();
        }
    }

    // Remove extension from installed list
    uninstallExtension(extensionId) {
        const index = this.installedExtensions.indexOf(extensionId);
        if (index > -1) {
            this.installedExtensions.splice(index, 1);
            this.updatedAt = new Date();
        }
    }

    // Add extension to purchased list
    purchaseExtension(extensionId) {
        if (!this.purchasedExtensions.includes(extensionId)) {
            this.purchasedExtensions.push(extensionId);
            this.updatedAt = new Date();
        }
    }

    // Check if user has purchased an extension
    hasPurchasedExtension(extensionId) {
        return this.purchasedExtensions.includes(extensionId);
    }

    // Check if user has installed an extension
    hasInstalledExtension(extensionId) {
        return this.installedExtensions.includes(extensionId);
    }

    // Convert to plain object
    toObject() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            avatar: this.avatar,
            subscription: this.subscription,
            installedExtensions: this.installedExtensions,
            purchasedExtensions: this.purchasedExtensions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            lastLoginAt: this.lastLoginAt,
        };
    }

    // Update user data
    update(data) {
        Object.keys(data).forEach((key) => {
            if (key !== "id" && key !== "createdAt") {
                this[key] = data[key];
            }
        });
        this.updatedAt = new Date();
    }
}

module.exports = User;
