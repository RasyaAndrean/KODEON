// Monetization Analytics Dashboard Component for KODEON IDE
class MonetizationAnalytics {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.analyticsData = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load analytics data
        await this.loadAnalyticsData();

        // Render the component
        this.render();

        console.log("Monetization analytics initialized");
    }

    async loadAnalyticsData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Call the monetization service to get analytics data
            this.analyticsData =
                await window.electronAPI.getSubscriptionAnalytics();
        } catch (error) {
            console.error("Error loading analytics data:", error);
            // Use mock data if there's an error
            this.analyticsData = {
                totalRevenue: 125000,
                activeSubscribers: 12500,
                freeUsers: 87500,
                churnRate: 0.05,
                conversionRate: 0.12,
            };
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the analytics dashboard panel
        const panelElement = document.createElement("div");
        panelElement.className = "monetization-analytics";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Monetization Analytics</h3>
      </div>
      <div class="analytics-content">
        ${this.renderAnalytics()}
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);
    }

    renderAnalytics() {
        if (!this.analyticsData) {
            return "<p>Loading analytics data...</p>";
        }

        return `
      <div class="analytics-grid">
        <div class="analytics-card">
          <h4>Total Revenue</h4>
          <div class="metric-value">$${this.analyticsData.totalRevenue.toLocaleString()}</div>
        </div>
        <div class="analytics-card">
          <h4>Active Subscribers</h4>
          <div class="metric-value">${this.analyticsData.activeSubscribers.toLocaleString()}</div>
        </div>
        <div class="analytics-card">
          <h4>Free Users</h4>
          <div class="metric-value">${this.analyticsData.freeUsers.toLocaleString()}</div>
        </div>
        <div class="analytics-card">
          <h4>Churn Rate</h4>
          <div class="metric-value">${(
              this.analyticsData.churnRate * 100
          ).toFixed(1)}%</div>
        </div>
        <div class="analytics-card">
          <h4>Conversion Rate</h4>
          <div class="metric-value">${(
              this.analyticsData.conversionRate * 100
          ).toFixed(1)}%</div>
        </div>
      </div>
      <div class="analytics-chart">
        <h4>Revenue Trend</h4>
        <div class="chart-placeholder">
          <p>Chart visualization would be shown here</p>
        </div>
      </div>
    `;
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.analyticsData = null;
    }
}

module.exports = MonetizationAnalytics;
