// Customer Support Component for KODEON IDE
class CustomerSupport {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load user account data
        await this.loadUserAccount();

        // Render the component
        this.render();

        console.log("Customer support initialized");
    }

    async loadUserAccount() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Get user account from the monetization service
            this.userAccount = await window.electronAPI.getUserAccount();
        } catch (error) {
            console.error("Error loading user account:", error);
            // Use mock data if there's an error
            this.userAccount = {
                id: "user-123",
                email: "user@example.com",
                name: "KODEON Developer",
                subscription: {
                    planId: "free",
                    status: "active",
                },
            };
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the customer support panel
        const panelElement = document.createElement("div");
        panelElement.className = "customer-support";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Customer Support</h3>
      </div>
      <div class="support-content">
        <div class="support-info">
          <h4>Account Information</h4>
          <p><strong>Name:</strong> ${this.userAccount.name}</p>
          <p><strong>Email:</strong> ${this.userAccount.email}</p>
          <p><strong>Subscription Plan:</strong> ${this.getPlanName()}</p>
          <p><strong>Subscription Status:</strong> <span class="status ${
              this.userAccount.subscription.status
          }">${this.userAccount.subscription.status}</span></p>
        </div>
        <div class="support-form">
          <h4>Contact Support</h4>
          <form id="support-form">
            <div class="form-group">
              <label for="support-subject">Subject</label>
              <input type="text" id="support-subject" class="form-control" placeholder="Brief description of your issue" required>
            </div>
            <div class="form-group">
              <label for="support-category">Category</label>
              <select id="support-category" class="form-control" required>
                <option value="">Select a category</option>
                <option value="billing">Billing/Payment</option>
                <option value="subscription">Subscription</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="support-message">Message</label>
              <textarea id="support-message" class="form-control" rows="5" placeholder="Please describe your issue in detail" required></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Submit Request</button>
            </div>
          </form>
        </div>
        <div class="support-resources">
          <h4>Helpful Resources</h4>
          <ul>
            <li><a href="#" class="support-link" data-resource="billing-faq">Billing FAQ</a></li>
            <li><a href="#" class="support-link" data-resource="subscription-guide">Subscription Guide</a></li>
            <li><a href="#" class="support-link" data-resource="feature-list">Feature List</a></li>
            <li><a href="#" class="support-link" data-resource="troubleshooting">Troubleshooting</a></li>
          </ul>
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    getPlanName() {
        const planNames = {
            free: "Free Plan",
            pro: "Pro Plan",
            team: "Team Plan",
        };
        return (
            planNames[this.userAccount.subscription.planId] || "Unknown Plan"
        );
    }

    attachEventListeners() {
        const form = document.getElementById("support-form");
        const supportLinks = document.querySelectorAll(".support-link");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await this.submitSupportRequest();
        });

        supportLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const resource = link.getAttribute("data-resource");
                this.showResource(resource);
            });
        });
    }

    async submitSupportRequest() {
        const subject = document.getElementById("support-subject").value;
        const category = document.getElementById("support-category").value;
        const message = document.getElementById("support-message").value;

        try {
            // In a real implementation, this would send the request to a support system
            console.log("Submitting support request:", {
                subject,
                category,
                message,
            });

            // Show success message
            alert(
                "Your support request has been submitted. We will get back to you soon."
            );

            // Reset form
            document.getElementById("support-form").reset();
        } catch (error) {
            console.error("Error submitting support request:", error);
            alert("Error submitting support request. Please try again.");
        }
    }

    showResource(resource) {
        const resources = {
            "billing-faq": "Billing FAQ content would be shown here.",
            "subscription-guide":
                "Subscription guide content would be shown here.",
            "feature-list": "Feature list content would be shown here.",
            troubleshooting: "Troubleshooting content would be shown here.",
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
    }
}

module.exports = CustomerSupport;
