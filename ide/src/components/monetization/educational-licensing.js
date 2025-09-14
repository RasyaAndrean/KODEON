// Educational Licensing Component for KODEON IDE
class EducationalLicensing {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.institution = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load user data
        await this.loadUserData();

        // Render the component
        this.render();

        console.log("Educational licensing component initialized");
    }

    async loadUserData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Get user account from the monetization service
            this.userAccount = await window.electronAPI.getUserAccount();

            // Check if user has educational institution access
            // In a real implementation, this would come from the server
            this.institution = {
                name: "Example University",
                type: "University",
                domain: "example.edu",
                status: "active",
                licenseType: "institutional",
                studentCount: 1250,
                facultyCount: 150,
                expirationDate: "2026-06-30",
            };
        } catch (error) {
            console.error("Error loading user data:", error);
            // Use mock data if there's an error
            this.userAccount = {
                id: "user-123",
                email: "user@example.edu",
                name: "KODEON Student",
            };

            this.institution = {
                name: "Example University",
                type: "University",
                domain: "example.edu",
                status: "active",
                licenseType: "institutional",
                studentCount: 1250,
                facultyCount: 150,
                expirationDate: "2026-06-30",
            };
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the educational licensing panel
        const panelElement = document.createElement("div");
        panelElement.className = "educational-licensing";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Educational Licensing</h3>
      </div>
      <div class="licensing-content">
        <div class="institution-info">
          <h4>Institution Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <label>Institution:</label>
              <span>${this.institution.name}</span>
            </div>
            <div class="info-item">
              <label>Type:</label>
              <span>${this.institution.type}</span>
            </div>
            <div class="info-item">
              <label>Domain:</label>
              <span>${this.institution.domain}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <span class="status ${this.institution.status}">${this.institution.status}</span>
            </div>
            <div class="info-item">
              <label>License Type:</label>
              <span>${this.institution.licenseType}</span>
            </div>
            <div class="info-item">
              <label>Expiration Date:</label>
              <span>${this.institution.expirationDate}</span>
            </div>
          </div>
        </div>
        <div class="usage-stats">
          <h4>Usage Statistics</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${this.institution.studentCount}</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${this.institution.facultyCount}</div>
              <div class="stat-label">Faculty</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">98%</div>
              <div class="stat-label">Adoption Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">4.8/5</div>
              <div class="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
        <div class="licensing-actions">
          <h4>Licensing Actions</h4>
          <div class="action-buttons">
            <button id="manage-licenses" class="btn btn-primary">Manage Licenses</button>
            <button id="view-reports" class="btn btn-secondary">View Reports</button>
            <button id="request-extension" class="btn btn-secondary">Request Extension</button>
            <button id="contact-support" class="btn btn-secondary">Contact Support</button>
          </div>
        </div>
        <div class="educational-resources">
          <h4>Educational Resources</h4>
          <ul>
            <li><a href="#" class="resource-link" data-resource="curriculum-guide">Curriculum Integration Guide</a></li>
            <li><a href="#" class="resource-link" data-resource="teaching-materials">Teaching Materials</a></li>
            <li><a href="#" class="resource-link" data-resource="student-projects">Student Project Examples</a></li>
            <li><a href="#" class="resource-link" data-resource="assessment-tools">Assessment Tools</a></li>
          </ul>
        </div>
        <div class="licensing-terms">
          <h4>Educational Licensing Terms</h4>
          <ul>
            <li>Free access for accredited educational institutions</li>
            <li>Includes all Pro features for students and faculty</li>
            <li>Annual renewal based on enrollment verification</li>
            <li>Technical support included</li>
            <li>Custom training sessions available</li>
          </ul>
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const manageLicensesBtn = document.getElementById("manage-licenses");
        const viewReportsBtn = document.getElementById("view-reports");
        const requestExtensionBtn =
            document.getElementById("request-extension");
        const contactSupportBtn = document.getElementById("contact-support");
        const resourceLinks = document.querySelectorAll(".resource-link");

        manageLicensesBtn.addEventListener("click", () => {
            this.manageLicenses();
        });

        viewReportsBtn.addEventListener("click", () => {
            this.viewReports();
        });

        requestExtensionBtn.addEventListener("click", () => {
            this.requestExtension();
        });

        contactSupportBtn.addEventListener("click", () => {
            this.contactSupport();
        });

        resourceLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const resource = link.getAttribute("data-resource");
                this.showResource(resource);
            });
        });
    }

    manageLicenses() {
        alert("License management interface would be shown here.");
    }

    viewReports() {
        alert("Usage reports would be shown here.");
    }

    requestExtension() {
        alert("Extension request form would be shown here.");
    }

    contactSupport() {
        alert("Support contact form would be shown here.");
    }

    showResource(resource) {
        const resources = {
            "curriculum-guide":
                "Curriculum integration guide would be shown here.",
            "teaching-materials": "Teaching materials would be shown here.",
            "student-projects": "Student project examples would be shown here.",
            "assessment-tools": "Assessment tools would be shown here.",
        };

        const content =
            resources[resource] || "Resource content would be shown here.";
        alert(content);
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.userAccount = null;
        this.institution = null;
    }
}

module.exports = EducationalLicensing; // Educational Licensing Component for KODEON IDE
class EducationalLicensing {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.institution = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load user data
        await this.loadUserData();

        // Render the component
        this.render();

        console.log("Educational licensing component initialized");
    }

    async loadUserData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Get user account from the monetization service
            this.userAccount = await window.electronAPI.getUserAccount();

            // Check if user has educational institution access
            // In a real implementation, this would come from the server
            this.institution = {
                name: "Example University",
                type: "University",
                domain: "example.edu",
                status: "active",
                licenseType: "institutional",
                studentCount: 1250,
                facultyCount: 150,
                expirationDate: "2026-06-30",
            };
        } catch (error) {
            console.error("Error loading user data:", error);
            // Use mock data if there's an error
            this.userAccount = {
                id: "user-123",
                email: "user@example.edu",
                name: "KODEON Student",
            };

            this.institution = {
                name: "Example University",
                type: "University",
                domain: "example.edu",
                status: "active",
                licenseType: "institutional",
                studentCount: 1250,
                facultyCount: 150,
                expirationDate: "2026-06-30",
            };
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the educational licensing panel
        const panelElement = document.createElement("div");
        panelElement.className = "educational-licensing";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Educational Licensing</h3>
      </div>
      <div class="licensing-content">
        <div class="institution-info">
          <h4>Institution Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <label>Institution:</label>
              <span>${this.institution.name}</span>
            </div>
            <div class="info-item">
              <label>Type:</label>
              <span>${this.institution.type}</span>
            </div>
            <div class="info-item">
              <label>Domain:</label>
              <span>${this.institution.domain}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <span class="status ${this.institution.status}">${this.institution.status}</span>
            </div>
            <div class="info-item">
              <label>License Type:</label>
              <span>${this.institution.licenseType}</span>
            </div>
            <div class="info-item">
              <label>Expiration Date:</label>
              <span>${this.institution.expirationDate}</span>
            </div>
          </div>
        </div>
        <div class="usage-stats">
          <h4>Usage Statistics</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${this.institution.studentCount}</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${this.institution.facultyCount}</div>
              <div class="stat-label">Faculty</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">98%</div>
              <div class="stat-label">Adoption Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">4.8/5</div>
              <div class="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
        <div class="licensing-actions">
          <h4>Licensing Actions</h4>
          <div class="action-buttons">
            <button id="manage-licenses" class="btn btn-primary">Manage Licenses</button>
            <button id="view-reports" class="btn btn-secondary">View Reports</button>
            <button id="request-extension" class="btn btn-secondary">Request Extension</button>
            <button id="contact-support" class="btn btn-secondary">Contact Support</button>
          </div>
        </div>
        <div class="educational-resources">
          <h4>Educational Resources</h4>
          <ul>
            <li><a href="#" class="resource-link" data-resource="curriculum-guide">Curriculum Integration Guide</a></li>
            <li><a href="#" class="resource-link" data-resource="teaching-materials">Teaching Materials</a></li>
            <li><a href="#" class="resource-link" data-resource="student-projects">Student Project Examples</a></li>
            <li><a href="#" class="resource-link" data-resource="assessment-tools">Assessment Tools</a></li>
          </ul>
        </div>
        <div class="licensing-terms">
          <h4>Educational Licensing Terms</h4>
          <ul>
            <li>Free access for accredited educational institutions</li>
            <li>Includes all Pro features for students and faculty</li>
            <li>Annual renewal based on enrollment verification</li>
            <li>Technical support included</li>
            <li>Custom training sessions available</li>
          </ul>
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const manageLicensesBtn = document.getElementById("manage-licenses");
        const viewReportsBtn = document.getElementById("view-reports");
        const requestExtensionBtn =
            document.getElementById("request-extension");
        const contactSupportBtn = document.getElementById("contact-support");
        const resourceLinks = document.querySelectorAll(".resource-link");

        manageLicensesBtn.addEventListener("click", () => {
            this.manageLicenses();
        });

        viewReportsBtn.addEventListener("click", () => {
            this.viewReports();
        });

        requestExtensionBtn.addEventListener("click", () => {
            this.requestExtension();
        });

        contactSupportBtn.addEventListener("click", () => {
            this.contactSupport();
        });

        resourceLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const resource = link.getAttribute("data-resource");
                this.showResource(resource);
            });
        });
    }

    manageLicenses() {
        alert("License management interface would be shown here.");
    }

    viewReports() {
        alert("Usage reports would be shown here.");
    }

    requestExtension() {
        alert("Extension request form would be shown here.");
    }

    contactSupport() {
        alert("Support contact form would be shown here.");
    }

    showResource(resource) {
        const resources = {
            "curriculum-guide":
                "Curriculum integration guide would be shown here.",
            "teaching-materials": "Teaching materials would be shown here.",
            "student-projects": "Student project examples would be shown here.",
            "assessment-tools": "Assessment tools would be shown here.",
        };

        const content =
            resources[resource] || "Resource content would be shown here.";
        alert(content);
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.userAccount = null;
        this.institution = null;
    }
}

module.exports = EducationalLicensing;
