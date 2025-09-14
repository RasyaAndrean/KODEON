// Billing History Component for KODEON IDE
class BillingHistory {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.billingHistory = [];
    }

    async initialize() {
        this.isInitialized = true;

        // Load billing history data
        await this.loadBillingHistory();

        // Render the component
        this.render();

        console.log("Billing history initialized");
    }

    async loadBillingHistory() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the monetization service
            // For now, we'll simulate the data
            this.billingHistory = [
                {
                    id: "txn-001",
                    date: "2025-01-15",
                    description: "Pro Plan Subscription",
                    amount: 9.99,
                    status: "completed",
                },
                {
                    id: "txn-002",
                    date: "2025-02-15",
                    description: "Pro Plan Subscription",
                    amount: 9.99,
                    status: "completed",
                },
                {
                    id: "txn-003",
                    date: "2025-03-15",
                    description: "Pro Plan Subscription",
                    amount: 9.99,
                    status: "completed",
                },
            ];
        } catch (error) {
            console.error("Error loading billing history:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the billing history panel
        const panelElement = document.createElement("div");
        panelElement.className = "billing-history";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Billing History</h3>
      </div>
      <div class="billing-history-content">
        ${this.renderBillingHistory()}
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);
    }

    renderBillingHistory() {
        if (this.billingHistory.length === 0) {
            return "<p>No billing history found.</p>";
        }

        return `
      <table class="billing-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${this.billingHistory
              .map(
                  (transaction) => `
            <tr>
              <td>${transaction.date}</td>
              <td>${transaction.description}</td>
              <td>$${transaction.amount.toFixed(2)}</td>
              <td><span class="status ${transaction.status}">${
                      transaction.status
                  }</span></td>
            </tr>
          `
              )
              .join("")}
        </tbody>
      </table>
    `;
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.billingHistory = [];
    }
}

module.exports = BillingHistory;
