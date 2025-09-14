// Affiliate Dashboard Component for KODEON IDE
class AffiliateDashboard {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.affiliateData = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load user account and affiliate data
        await this.loadUserData();
        await this.loadAffiliateData();

        // Render the component
        this.render();

        console.log("Affiliate dashboard component initialized");
    }

    destroy() {
        this.isInitialized = false;
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }
        console.log("Affiliate dashboard component destroyed");
    }

    async loadUserData() {
        try {
            // Get user account from the monetization service
            this.userAccount = await window.electronAPI.getUserAccount();
        } catch (error) {
            console.error("Error loading user data:", error);
            // Use mock data for demonstration
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

    async loadAffiliateData() {
        try {
            // In a real implementation, this would call the monetization service
            // For now, we'll use mock data
            this.affiliateData = {
                affiliateId: "aff-789",
                referralLink: "https://kodeon.io/ref/user-123",
                totalReferrals: 24,
                activeReferrals: 18,
                pendingReferrals: 6,
                totalEarnings: 420.5,
                pendingEarnings: 85.25,
                payoutHistory: [
                    {
                        id: "payout-001",
                        amount: 150.0,
                        date: "2025-08-15T10:30:00Z",
                        status: "paid",
                    },
                    {
                        id: "payout-002",
                        amount: 120.75,
                        date: "2025-07-15T10:30:00Z",
                        status: "paid",
                    },
                    {
                        id: "payout-003",
                        amount: 95.5,
                        date: "2025-06-15T10:30:00Z",
                        status: "paid",
                    },
                ],
                referralStats: {
                    proConversions: 12,
                    teamConversions: 6,
                    enterpriseConversions: 2,
                    conversionRate: 0.25,
                },
            };
        } catch (error) {
            console.error("Error loading affiliate data:", error);
            this.affiliateData = null;
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="affiliate-dashboard-container">
                <div class="dashboard-header">
                    <h2>Affiliate Dashboard</h2>
                    <button id="copy-referral-link-btn" class="btn btn-primary">Copy Referral Link</button>
                </div>

                <div class="dashboard-content">
                    <div class="affiliate-summary">
                        <div class="summary-card">
                            <h3>Total Earnings</h3>
                            <div class="summary-value">\$${
                                this.affiliateData
                                    ? this.affiliateData.totalEarnings.toFixed(
                                          2
                                      )
                                    : "0.00"
                            }</div>
                            <div class="summary-subtext">Pending: \$${
                                this.affiliateData
                                    ? this.affiliateData.pendingEarnings.toFixed(
                                          2
                                      )
                                    : "0.00"
                            }</div>
                        </div>

                        <div class="summary-card">
                            <h3>Total Referrals</h3>
                            <div class="summary-value">${
                                this.affiliateData
                                    ? this.affiliateData.totalReferrals
                                    : 0
                            }</div>
                            <div class="summary-subtext">Active: ${
                                this.affiliateData
                                    ? this.affiliateData.activeReferrals
                                    : 0
                            } | Pending: ${
            this.affiliateData ? this.affiliateData.pendingReferrals : 0
        }</div>
                        </div>

                        <div class="summary-card">
                            <h3>Conversion Rate</h3>
                            <div class="summary-value">${
                                this.affiliateData
                                    ? (
                                          this.affiliateData.referralStats
                                              .conversionRate * 100
                                      ).toFixed(1)
                                    : "0.0"
                            }%</div>
                            <div class="summary-subtext">Pro: ${
                                this.affiliateData
                                    ? this.affiliateData.referralStats
                                          .proConversions
                                    : 0
                            } | Team: ${
            this.affiliateData
                ? this.affiliateData.referralStats.teamConversions
                : 0
        }</div>
                        </div>
                    </div>

                    <div class="referral-link-section">
                        <h3>Your Referral Link</h3>
                        <div class="referral-link-container">
                            <input type="text" id="referral-link-input" class="form-control" value="${
                                this.affiliateData
                                    ? this.affiliateData.referralLink
                                    : ""
                            }" readonly>
                            <button id="copy-link-btn" class="btn btn-secondary">Copy</button>
                        </div>
                        <p class="referral-info">Share this link with friends and colleagues. Earn 20% commission on their first year subscription!</p>
                    </div>

                    <div class="dashboard-sections">
                        <div class="payout-history">
                            <h3>Payout History</h3>
                            <div id="payout-history-list" class="payout-list">
                                ${this.renderPayoutHistory()}
                            </div>
                        </div>

                        <div class="referral-stats">
                            <h3>Referral Statistics</h3>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-label">Pro Plan Conversions</div>
                                    <div class="stat-value">${
                                        this.affiliateData
                                            ? this.affiliateData.referralStats
                                                  .proConversions
                                            : 0
                                    }</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Team Plan Conversions</div>
                                    <div class="stat-value">${
                                        this.affiliateData
                                            ? this.affiliateData.referralStats
                                                  .teamConversions
                                            : 0
                                    }</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Enterprise Conversions</div>
                                    <div class="stat-value">${
                                        this.affiliateData
                                            ? this.affiliateData.referralStats
                                                  .enterpriseConversions
                                            : 0
                                    }</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Avg. Commission</div>
                                    <div class="stat-value">\$${
                                        this.affiliateData
                                            ? (
                                                  this.affiliateData
                                                      .totalEarnings /
                                                      this.affiliateData
                                                          .totalReferrals || 1
                                              ).toFixed(2)
                                            : "0.00"
                                    }</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="affiliate-resources">
                        <h3>Affiliate Resources</h3>
                        <div class="resources-grid">
                            <div class="resource-card">
                                <h4>Marketing Materials</h4>
                                <p>Banners, social media posts, and email templates</p>
                                <button class="btn btn-secondary">Download</button>
                            </div>

                            <div class="resource-card">
                                <h4>Affiliate Guide</h4>
                                <p>Best practices and tips for successful referrals</p>
                                <button class="btn btn-secondary">View Guide</button>
                            </div>

                            <div class="resource-card">
                                <h4>Performance Reports</h4>
                                <p>Detailed analytics on your referral performance</p>
                                <button class="btn btn-secondary">View Reports</button>
                            </div>

                            <div class="resource-card">
                                <h4>Support</h4>
                                <p>Get help with your affiliate activities</p>
                                <button class="btn btn-secondary">Contact Support</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderPayoutHistory() {
        if (!this.affiliateData || !this.affiliateData.payoutHistory) {
            return '<p class="no-payouts">No payout history available.</p>';
        }

        return this.affiliateData.payoutHistory
            .map(
                (payout) => `
            <div class="payout-item">
                <div class="payout-details">
                    <span class="payout-amount">\$${payout.amount.toFixed(
                        2
                    )}</span>
                    <span class="payout-date">${new Date(
                        payout.date
                    ).toLocaleDateString()}</span>
                </div>
                <span class="payout-status ${payout.status}">${
                    payout.status
                }</span>
            </div>
        `
            )
            .join("");
    }

    attachEventListeners() {
        // Copy referral link button
        const copyLinkBtn = document.getElementById("copy-link-btn");
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener("click", () => {
                this.copyReferralLink();
            });
        }

        // Copy referral link button (header)
        const copyReferralLinkBtn = document.getElementById(
            "copy-referral-link-btn"
        );
        if (copyReferralLinkBtn) {
            copyReferralLinkBtn.addEventListener("click", () => {
                this.copyReferralLink();
            });
        }

        // Resource card buttons
        const resourceButtons = document.querySelectorAll(
            ".resource-card .btn"
        );
        resourceButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const card = e.target.closest(".resource-card");
                const title = card.querySelector("h4").textContent;
                alert(`${title} functionality would be implemented here`);
            });
        });
    }

    copyReferralLink() {
        const referralLinkInput = document.getElementById(
            "referral-link-input"
        );
        if (referralLinkInput) {
            referralLinkInput.select();
            document.execCommand("copy");

            // Show confirmation
            const originalText =
                document.getElementById("copy-link-btn").textContent;
            document.getElementById("copy-link-btn").textContent = "Copied!";
            document.getElementById("copy-referral-link-btn").textContent =
                "Copied!";

            setTimeout(() => {
                document.getElementById("copy-link-btn").textContent =
                    originalText;
                document.getElementById("copy-referral-link-btn").textContent =
                    "Copy Referral Link";
            }, 2000);

            console.log("Referral link copied to clipboard");
        }
    }
}

module.exports = AffiliateDashboard;
