// Extension Model
class Extension {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.description = data.description || "";
        this.version = data.version || "1.0.0";
        this.author = data.author || "";
        this.category = data.category || "Other";
        this.tags = data.tags || [];
        this.price = data.price || 0;
        this.rating = data.rating || 0;
        this.downloads = data.downloads || 0;
        this.screenshots = data.screenshots || [];
        this.dependencies = data.dependencies || [];
        this.compatibility = data.compatibility || [];
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.isActive = data.isActive || true;
        this.isFeatured = data.isFeatured || false;
    }

    // Validate extension data
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push("Extension name is required");
        }

        if (!this.description || this.description.trim().length === 0) {
            errors.push("Extension description is required");
        }

        if (this.price < 0) {
            errors.push("Price cannot be negative");
        }

        if (this.rating < 0 || this.rating > 5) {
            errors.push("Rating must be between 0 and 5");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    // Convert to plain object
    toObject() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            version: this.version,
            author: this.author,
            category: this.category,
            tags: this.tags,
            price: this.price,
            rating: this.rating,
            downloads: this.downloads,
            screenshots: this.screenshots,
            dependencies: this.dependencies,
            compatibility: this.compatibility,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isActive: this.isActive,
            isFeatured: this.isFeatured,
        };
    }

    // Update extension data
    update(data) {
        Object.keys(data).forEach((key) => {
            if (key !== "id" && key !== "createdAt") {
                this[key] = data[key];
            }
        });
        this.updatedAt = new Date();
    }
}

module.exports = Extension;
