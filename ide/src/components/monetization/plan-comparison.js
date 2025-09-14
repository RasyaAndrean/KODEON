// Plan Comparison Component for KODEON IDE
class PlanComparison {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.plans = [];
    }

    async initialize() {
        this.isInitialized = true;

        // Load plan data
        await this.loadPlans();

        // Render the component
        this.render();

        console.log("Plan comparison initialized");
    }

    async loadPlans() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Get available plans from the monetization service
            this.plans = await window.electronAPI.getAvailablePlans();
        } catch (error) {
            console.error("Error loading plans:", error);
            // Use mock data if there's an error
            this.plans = [
                {
                    id: "free",
                    name: "Free Plan",
                    price: 0,
                    features: [
                        "Basic IDE features",
                        "Community support",
                        "Standard library access",
                        "Basic collaboration tools",
                    ],
                },
                {
                    id: "pro",
                    name: "Pro Plan",
                    price: 9.99,
                    period: "month",
                    features: [
                        "All Free features",
                        "Advanced debugging tools",
                        "Priority support",
                        "Premium themes",
                        "Advanced collaboration features",
                        "AI code assistance",
                        "Cloud sync",
                        "Custom domain hosting",
                    ],
                },
                {
                    id: "team",
                    name: "Team Plan",
                    price: 24.99,
                    period: "month",
                    perUser: true,
                    features: [
                        "All Pro features",
                        "Team workspaces",
                        "Admin controls",
                        "Advanced analytics",
                        "SSO integration",
                        "Dedicated account manager",
                        "Custom training sessions",
                    ],
                },
            ];
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the plan comparison panel
        const panelElement = document.createElement("div");
        panelElement.className = "plan-comparison";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Plan Comparison</h3>
      </div>
      <div class="plan-comparison-content">
        ${this.renderPlanComparison()}
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);
    }

    renderPlanComparison() {
        // Get all unique features across all plans
        const allFeatures = new Set();
        this.plans.forEach((plan) => {
            plan.features.forEach((feature) => allFeatures.add(feature));
        });

        // Convert to array and sort
        const features = Array.from(allFeatures).sort();

        return `
      <table class="plan-comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            ${this.plans
                .map(
                    (plan) => `
              <th>
                <div class="plan-header">
                  <h4>${plan.name}</h4>
                  <div class="plan-price">
                    ${
                        plan.price === 0
                            ? '<span class="price">Free</span>'
                            : `<span class="price">$${plan.price}</span><span class="period">/${plan.period}</span>`
                    }
                    ${
                        plan.perUser
                            ? '<span class="per-user">per user</span>'
                            : ""
                    }
                  </div>
                </div>
              </th>
            `
                )
                .join("")}
          </tr>
        </thead>
        <tbody>
          ${features
              .map(
                  (feature) => `
            <tr>
              <td>${feature}</td>
              ${this.plans
                  .map(
                      (plan) => `
                <td class="feature-cell">
                  ${
                      plan.features.includes(feature)
                          ? '<span class="feature-included">✓</span>'
                          : '<span class="feature-not-included">-</span>'
                  }
                </td>
              `
                  )
                  .join("")}
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
        this.plans = [];
    }
}

module.exports = PlanComparison;
