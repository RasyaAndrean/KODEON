// Marketplace Component for KODEON IDE
class Marketplace {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.extensions = [];
        this.categories = [];
    }

    async initialize() {
        this.isInitialized = true;

        // Load user data and marketplace items
        await this.loadUserData();
        await this.loadMarketplaceData();

        // Render the component
        this.render();

        console.log("Marketplace component initialized");
    }

    async loadUserData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Get user account from the monetization service
            this.userAccount = await window.electronAPI.getUserAccount();
        } catch (error) {
            console.error("Error loading user data:", error);
            // Use mock data if there's an error
            this.userAccount = {
                id: "user-123",
                email: "user@example.com",
                name: "KODEON Developer",
                subscription: {
                    planId: "pro",
                    status: "active",
                },
            };
        }
    }

    async loadMarketplaceData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Fetch data from the marketplace API
            const extensionsResponse =
                await window.electronAPI.getMarketplaceExtensions();
            const categoriesResponse =
                await window.electronAPI.getMarketplaceCategories();

            if (extensionsResponse.success) {
                this.extensions = extensionsResponse.data;
            } else {
                // Fallback to mock data if API fails
                console.warn(
                    "Failed to load extensions from API, using mock data"
                );
                this.extensions = this.getMockExtensions();
            }

            if (categoriesResponse.success) {
                this.categories = categoriesResponse.data.map(
                    (cat) => cat.name
                );
            } else {
                // Fallback to mock data if API fails
                console.warn(
                    "Failed to load categories from API, using mock data"
                );
                this.categories = this.getMockCategories();
            }
        } catch (error) {
            console.error("Error loading marketplace data:", error);
            // Fallback to mock data if API fails
            this.extensions = this.getMockExtensions();
            this.categories = this.getMockCategories();
        }
    }

    getMockExtensions() {
        return [
            {
                id: "theme-dark-pro",
                name: "Dark Pro Theme",
                author: "KODEON Team",
                category: "Themes",
                description:
                    "Professional dark theme with enhanced syntax highlighting",
                price: 0,
                rating: 4.8,
                downloads: 15420,
                version: "1.2.3",
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%23007bff"><rect width="24" height="24" fill="%231e1e1e"/><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
            },
            {
                id: "plugin-git-tools",
                name: "Git Tools Pro",
                author: "DevTools Inc",
                category: "Plugins",
                description:
                    "Advanced Git integration with visual diff and merge tools",
                price: 19.99,
                rating: 4.6,
                downloads: 8750,
                version: "2.1.0",
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.79 8.21 11.38.6.11.82-.26.82-.58v-2.04c-3.34.73-4.03-1.42-4.03-1.42-.54-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.24.96-.27 1.98-.4 3.01-.41.01.01.02.02.03.03.01-.01.02-.02.03-.03 1.03.01 2.05.14 3.01.41 2.29-1.56 3.29-1.24 3.29-1.24.67 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.63-2.81 5.65-5.48 5.95.43.37.81 1.1.81 2.23v3.31c0 .32.22.69.82.58C20.57 21.79 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>',
            },
            {
                id: "snippet-js-utils",
                name: "JavaScript Utilities",
                author: "CodeMaster",
                category: "Snippets",
                description:
                    "Collection of useful JavaScript utility functions and snippets",
                price: 0,
                rating: 4.9,
                downloads: 22300,
                version: "1.5.2",
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%23007bff"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM11 7h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/></svg>',
            },
            {
                id: "template-web-app",
                name: "Web App Template",
                author: "KODEON Team",
                category: "Templates",
                description:
                    "Complete template for building modern web applications",
                price: 29.99,
                rating: 4.7,
                downloads: 5620,
                version: "3.0.1",
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
            },
            {
                id: "tool-debugger",
                name: "Advanced Debugger",
                author: "DebugTools Co",
                category: "Tools",
                description:
                    "Powerful debugging tool with memory profiling and performance analysis",
                price: 49.99,
                rating: 4.5,
                downloads: 3210,
                version: "1.8.4",
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            },
            {
                id: "lib-data-structures",
                name: "Data Structures Library",
                author: "AlgoMaster",
                category: "Libraries",
                description:
                    "Comprehensive library of data structures and algorithms",
                price: 0,
                rating: 4.8,
                downloads: 18750,
                version: "2.3.0",
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%23007bff"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>',
            },
        ];
    }

    getMockCategories() {
        return [
            "Themes",
            "Plugins",
            "Snippets",
            "Templates",
            "Tools",
            "Libraries",
        ];
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the marketplace panel
        const panelElement = document.createElement("div");
        panelElement.className = "marketplace";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Marketplace</h3>
        <div class="marketplace-search">
          <input type="text" id="marketplace-search" class="form-control" placeholder="Search extensions...">
          <button id="search-btn" class="btn btn-primary">Search</button>
        </div>
      </div>
      <div class="marketplace-content">
        <div class="categories">
          <h4>Categories</h4>
          <ul>
            <li><a href="#" class="category-link active" data-category="all">All</a></li>
            ${this.categories
                .map(
                    (category) => `
              <li><a href="#" class="category-link" data-category="${category.toLowerCase()}">${category}</a></li>
            `
                )
                .join("")}
          </ul>
        </div>
        <div class="extensions-grid">
          <h4>Featured Extensions</h4>
          <div class="extensions-list">
            ${this.renderExtensions()}
          </div>
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    renderExtensions(extensions = this.extensions) {
        return extensions
            .map(
                (extension) => `
      <div class="extension-card" data-extension-id="${extension.id}">
        <div class="extension-image">
          <img src="${extension.image}" alt="${extension.name}">
        </div>
        <div class="extension-info">
          <h5>${extension.name}</h5>
          <p class="extension-author">by ${extension.author}</p>
          <p class="extension-description">${extension.description}</p>
          <div class="extension-meta">
            <div class="extension-rating">
              <span class="rating-stars">${"★".repeat(
                  Math.floor(extension.rating)
              )}${"☆".repeat(5 - Math.floor(extension.rating))}</span>
              <span class="rating-value">${extension.rating}</span>
            </div>
            <div class="extension-downloads">
              <span>${extension.downloads.toLocaleString()} downloads</span>
            </div>
          </div>
          <div class="extension-actions">
            <div class="extension-price">
              ${
                  extension.price === 0
                      ? '<span class="price free">Free</span>'
                      : `<span class="price">$${extension.price.toFixed(
                            2
                        )}</span>`
              }
            </div>
            <button class="btn btn-primary install-btn" data-extension-id="${
                extension.id
            }">
              ${
                  this.isExtensionInstalled(extension.id)
                      ? "Installed"
                      : "Install"
              }
            </button>
          </div>
        </div>
      </div>
    `
            )
            .join("");
    }

    isExtensionInstalled(extensionId) {
        // Check if extension is installed for the current user
        if (this.userAccount && this.userAccount.installedExtensions) {
            return this.userAccount.installedExtensions.includes(extensionId);
        }
        // For now, we'll return false for all extensions
        return false;
    }

    attachEventListeners() {
        const searchInput = document.getElementById("marketplace-search");
        const searchBtn = document.getElementById("search-btn");
        const categoryLinks = document.querySelectorAll(".category-link");
        const installButtons = document.querySelectorAll(".install-btn");

        searchBtn.addEventListener("click", () => {
            this.searchExtensions();
        });

        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.searchExtensions();
            }
        });

        categoryLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const category = link.getAttribute("data-category");
                this.filterByCategory(category);
            });
        });

        installButtons.forEach((button) => {
            button.addEventListener("click", async (e) => {
                const extensionId = button.getAttribute("data-extension-id");
                await this.installExtension(extensionId);
            });
        });
    }

    searchExtensions() {
        const searchTerm = document
            .getElementById("marketplace-search")
            .value.toLowerCase();

        if (!searchTerm) {
            // If search term is empty, show all extensions
            this.renderExtensions();
            return;
        }

        const filteredExtensions = this.extensions.filter(
            (extension) =>
                extension.name.toLowerCase().includes(searchTerm) ||
                extension.description.toLowerCase().includes(searchTerm) ||
                extension.author.toLowerCase().includes(searchTerm) ||
                extension.category.toLowerCase().includes(searchTerm)
        );

        const extensionsList = document.querySelector(".extensions-list");
        extensionsList.innerHTML = this.renderExtensions(filteredExtensions);

        // Reattach event listeners for new buttons
        this.attachEventListeners();
    }

    filterByCategory(category) {
        // Update active category link
        document.querySelectorAll(".category-link").forEach((link) => {
            link.classList.remove("active");
        });
        document
            .querySelector(`.category-link[data-category="${category}"]`)
            .classList.add("active");

        if (category === "all") {
            // Show all extensions
            const extensionsList = document.querySelector(".extensions-list");
            extensionsList.innerHTML = this.renderExtensions();
        } else {
            // Filter extensions by category
            const filteredExtensions = this.extensions.filter(
                (extension) => extension.category.toLowerCase() === category
            );

            const extensionsList = document.querySelector(".extensions-list");
            extensionsList.innerHTML =
                this.renderExtensions(filteredExtensions);
        }

        // Reattach event listeners for new buttons
        this.attachEventListeners();
    }

    async installExtension(extensionId) {
        const extension = this.extensions.find((ext) => ext.id === extensionId);
        if (!extension) return;

        try {
            // Check if user can install this extension based on their plan
            if (extension.price > 0) {
                const isAvailable = await window.electronAPI.isFeatureAvailable(
                    "marketplace-paid"
                );
                if (!isAvailable) {
                    alert(
                        "This extension requires a Pro plan. Please upgrade to install paid extensions."
                    );
                    return;
                }
            }

            // Call the API to install the extension
            const response =
                await window.electronAPI.installMarketplaceExtension(
                    extensionId
                );

            if (response.success) {
                // Show installation success
                console.log(
                    `Extension ${extension.name} installed successfully`
                );

                // Update UI to show installed state
                const installBtn = document.querySelector(
                    `.install-btn[data-extension-id="${extensionId}"]`
                );
                if (installBtn) {
                    installBtn.textContent = "Installed";
                    installBtn.disabled = true;
                    installBtn.classList.remove("btn-primary");
                    installBtn.classList.add("btn-secondary");
                }

                // Update user account data
                await this.loadUserData();
            } else {
                alert(
                    `Error installing extension: ${
                        response.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            console.error("Error installing extension:", error);
            alert("Error installing extension. Please try again.");
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.userAccount = null;
        this.extensions = [];
        this.categories = [];
    }
}

module.exports = Marketplace;
