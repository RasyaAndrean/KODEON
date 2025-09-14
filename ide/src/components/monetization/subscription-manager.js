// Subscription Manager Component for KODEON IDE
class SubscriptionManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.availablePlans = [];
        this.currentSubscription = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load subscription data
        await this.loadSubscriptionData();

        // Render the component
        this.render();

        console.log("Subscription manager initialized");
    }

    async loadSubscriptionData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Call the monetization service to get real data
            this.userAccount = await window.electronAPI.getUserAccount();
            this.availablePlans = await window.electronAPI.getAvailablePlans();
            this.currentSubscription =
                await window.electronAPI.getCurrentSubscription();
        } catch (error) {
            console.error("Error loading subscription data:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the subscription manager panel
        const panelElement = document.createElement("div");
        panelElement.className = "subscription-manager";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Subscription Management</h3>
      </div>
      <div class="current-subscription">
        <h4>Current Plan: ${this.getCurrentPlanName()}</h4>
        <div class="subscription-details">
          <p>Status: <span class="status ${this.currentSubscription.status}">${
            this.currentSubscription.status
        }</span></p>
          <p>Start Date: ${this.currentSubscription.startDate}</p>
          <p>End Date: ${this.currentSubscription.endDate}</p>
        </div>
        ${
            this.currentSubscription.planId !== "free"
                ? `<button id="cancel-subscription-btn" class="btn btn-danger">Cancel Subscription</button>`
                : ""
        }
      </div>
      <div class="available-plans">
        <h4>Available Plans</h4>
        <div class="plans-grid">
          ${this.renderPlans()}
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    getCurrentPlanName() {
        const plan = this.availablePlans.find(
            (p) => p.id === this.currentSubscription.planId
        );
        return plan ? plan.name : "Unknown Plan";
    }

    renderPlans() {
        return this.availablePlans
            .map(
                (plan) => `
      <div class="plan-card ${
          plan.id === this.currentSubscription.planId ? "current" : ""
      }">
        <div class="plan-header">
          <h5>${plan.name}</h5>
          <div class="plan-price">
            ${
                plan.price === 0
                    ? '<span class="price">Free</span>'
                    : `<span class="price">$${plan.price}</span><span class="period">/${plan.period}</span>`
            }
            ${plan.perUser ? '<span class="per-user">per user</span>' : ""}
          </div>
        </div>
        <div class="plan-features">
          <ul>
            ${plan.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
        </div>
        ${
            plan.id !== this.currentSubscription.planId
                ? `<button class="btn btn-primary subscribe-btn" data-plan-id="${
                      plan.id
                  }">
            ${
                this.currentSubscription.planId === "free"
                    ? "Get Started"
                    : "Switch Plan"
            }
          </button>`
                : '<div class="current-plan-indicator">Current Plan</div>'
        }
      </div>
    `
            )
            .join("");
    }

    attachEventListeners() {
        const cancelSubscriptionBtn = document.getElementById(
            "cancel-subscription-btn"
        );
        if (cancelSubscriptionBtn) {
            cancelSubscriptionBtn.addEventListener("click", async () => {
                await this.cancelSubscription();
            });
        }

        const subscribeBtns = document.querySelectorAll(".subscribe-btn");
        subscribeBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const planId = btn.getAttribute("data-plan-id");
                this.showSubscribeForm(planId);
            });
        });
    }

    async cancelSubscription() {
        if (
            confirm(
                "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period."
            )
        ) {
            try {
                // Call the monetization service to cancel the subscription
                await window.electronAPI.cancelSubscription();
                this.currentSubscription.status = "cancelled";
                this.render();
                console.log("Subscription cancelled");
            } catch (error) {
                console.error("Error cancelling subscription:", error);
                alert("Error cancelling subscription. Please try again.");
            }
        }
    }

    showSubscribeForm(planId) {
        const plan = this.availablePlans.find((p) => p.id === planId);
        if (!plan) return;

        // Create a modal for subscription
        const modal = document.createElement("div");
        modal.className = "subscription-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Subscribe to ${plan.name}</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="subscribe-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" value="${
                  this.userAccount.email
              }" required>
            </div>
            <div class="form-group">
              <label for="card-number">Card Number</label>
              <input type="text" id="card-number" class="form-control" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="expiry-date">Expiry Date</label>
                <input type="text" id="expiry-date" class="form-control" placeholder="MM/YY" required>
              </div>
              <div class="form-group">
                <label for="cvv">CVV</label>
                <input type="text" id="cvv" class="form-control" placeholder="123" required>
              </div>
            </div>
            ${
                plan.price > 0
                    ? `
              <div class="form-group">
                <label for="coupon-code">Coupon Code (Optional)</label>
                <input type="text" id="coupon-code" class="form-control" placeholder="Enter coupon code">
              </div>
              <div class="plan-summary">
                <h5>Order Summary</h5>
                <div class="summary-item">
                  <span>${plan.name}</span>
                  <span>$${plan.price}/${plan.period}</span>
                </div>
                <div class="summary-item" id="discount-row" style="display: none;">
                  <span>Discount</span>
                  <span id="discount-amount">-$0.00</span>
                </div>
                <div class="summary-total">
                  <strong>Total</strong>
                  <strong id="total-amount">$${plan.price}/${plan.period}</strong>
                </div>
              </div>
            `
                    : ""
            }
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Subscribe</button>
              <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Add event listeners for modal
        const closeModal = modal.querySelector(".close-modal");
        const cancelBtn = modal.querySelector(".cancel-btn");
        const form = modal.querySelector("#subscribe-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        // Add coupon code validation
        const couponInput = modal.querySelector("#coupon-code");
        if (couponInput) {
            couponInput.addEventListener("blur", () => {
                this.validateCoupon(couponInput.value, plan.price);
            });
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.processSubscription(planId);
            closeHandler();
        });
    }

    async validateCoupon(code, amount) {
        if (!code) return;

        try {
            // In a real implementation, this would call a coupon service
            // For now, we'll simulate validation
            const couponInfo = {
                code: code,
                discount: 10, // 10% off for demonstration
                type: "percentage",
            };

            let discountAmount = 0;
            if (couponInfo.type === "percentage") {
                discountAmount = amount * (couponInfo.discount / 100);
            } else if (couponInfo.type === "fixed") {
                discountAmount = Math.min(couponInfo.discount, amount);
            }

            const discountedAmount = amount - discountAmount;

            // Update the UI with discount information
            const discountRow = document.getElementById("discount-row");
            const discountAmountElement =
                document.getElementById("discount-amount");
            const totalAmountElement = document.getElementById("total-amount");

            if (discountRow && discountAmountElement && totalAmountElement) {
                discountRow.style.display = "flex";
                discountAmountElement.textContent = `-$${discountAmount.toFixed(
                    2
                )}`;
                totalAmountElement.textContent = `$${discountedAmount.toFixed(
                    2
                )}/${plan.period}`;
            }
        } catch (error) {
            console.error("Error validating coupon:", error);
            // Don't show error to user, just don't apply discount
        }
    }

    async processSubscription(planId) {
        // Call the monetization service to process the subscription
        const plan = this.availablePlans.find((p) => p.id === planId);
        if (!plan) return;

        try {
            // Get payment info from form
            const cardNumber = document.getElementById("card-number").value;
            const expiryDate = document.getElementById("expiry-date").value;
            const cvv = document.getElementById("cvv").value;
            const email = document.getElementById("email").value;
            const couponCode = document.getElementById("coupon-code")?.value;

            // Validate payment information
            const paymentInfo = {
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv,
                email: email,
            };

            // Process the subscription through the monetization service
            this.currentSubscription = await window.electronAPI.subscribeToPlan(
                planId,
                paymentInfo
            );

            // Generate receipt
            const transactionData = {
                transactionId: `txn-${Date.now()}`,
                amount: plan.price,
                planName: plan.name,
                userEmail: email,
                paymentMethod: "Credit Card",
                timestamp: new Date().toISOString(),
                couponCode: couponCode,
                discountAmount: 0, // In a real implementation, this would be calculated
            };

            // In a real implementation, we would generate and send the receipt
            console.log("Transaction receipt would be generated here");

            this.render();
            console.log(`Subscribed to ${plan.name}`);
        } catch (error) {
            console.error("Error processing subscription:", error);
            alert("Error processing subscription. Please try again.");
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.userAccount = null;
        this.availablePlans = [];
        this.currentSubscription = null;
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .subscription-manager {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .panel-header h3 {
    margin: 0;
    color: #333;
  }

  .current-subscription {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 30px;
  }

  .current-subscription h4 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .subscription-details {
    margin-bottom: 20px;
  }

  .subscription-details p {
    margin: 0 0 10px 0;
  }

  .status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
  }

  .status.active {
    background-color: #d4edda;
    color: #155724;
  }

  .status.cancelled {
    background-color: #f8d7da;
    color: #721c24;
  }

  .available-plans h4 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .plan-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    border: 2px solid transparent;
  }

  .plan-card.current {
    border-color: #007bff;
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .plan-header h5 {
    margin: 0;
    color: #333;
  }

  .plan-price {
    text-align: right;
  }

  .price {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
  }

  .period {
    font-size: 0.9em;
    color: #666;
  }

  .per-user {
    font-size: 0.8em;
    color: #666;
    display: block;
  }

  .plan-features ul {
    padding-left: 20px;
    margin: 0 0 20px 0;
  }

  .plan-features li {
    margin-bottom: 8px;
    color: #555;
  }

  .current-plan-indicator {
    text-align: center;
    padding: 10px;
    background-color: #e9ecef;
    border-radius: 4px;
    font-weight: bold;
    color: #495057;
  }

  .subscription-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h4 {
    margin: 0;
    color: #333;
  }

  .close-modal {
    font-size: 1.5em;
    cursor: pointer;
    color: #888;
  }

  .close-modal:hover {
    color: #333;
  }

  .modal-body {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }

  .form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
    box-sizing: border-box;
  }

  .form-row {
    display: flex;
    gap: 15px;
  }

  .form-row .form-group {
    flex: 1;
  }

  .plan-summary {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    margin: 20px 0;
  }

  .plan-summary h5 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
    font-size: 1.1em;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s ease;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0069d9;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background-color: #c82333;
  }
`;

document.head.appendChild(style);

module.exports = SubscriptionManager;
