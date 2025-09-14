// Category Model for Marketplace
class Category {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.description = data.description || "";
        this.slug = data.slug || "";
        this.parentId = data.parentId || null;
        this.icon = data.icon || "";
        this.color = data.color || "#007bff";
        this.isActive = data.isActive || true;
        this.sortOrder = data.sortOrder || 0;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    // Validate category data
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push("Category name is required");
        }

        if (!this.slug || this.slug.trim().length === 0) {
            errors.push("Category slug is required");
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
            slug: this.slug,
            parentId: this.parentId,
            icon: this.icon,
            color: this.color,
            isActive: this.isActive,
            sortOrder: this.sortOrder,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    // Update category data
    update(data) {
        Object.keys(data).forEach((key) => {
            if (key !== "id" && key !== "createdAt") {
                this[key] = data[key];
            }
        });
        this.updatedAt = new Date();
    }
}

module.exports = Category;
