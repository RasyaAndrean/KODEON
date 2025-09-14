// Referral Program Component for KODEON IDE
class ReferralProgramComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.referralStats = null;
        this.referralInfo = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load user data and referral stats
        await this.loadUserData();

        // Render the component
        this.render();

        console.log("Referral program component initialized");
    }

    async loadUserData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // Get user account from the monetization service
            this.userAccount = await window.electronAPI.getUserAccount();

            // Get referral stats
            // In a real implementation, this would call a referral service
            this.referralStats = {
                totalReferrals: 3,
                successfulReferrals: 2,
                pendingReferrals: 1,
                totalRewards: 20, // $20 in credits
                referralCode: `REF${this.userAccount.id.slice(-4)}${Date.now()
                    .toString()
                    .slice(-4)}`,
            };

            // Generate referral link
            this.referralInfo = {
                referralCode: this.referralStats.referralCode,
                referralLink: `https://kodeon.ide/signup?ref=${this.referralStats.referralCode}`,
            };
        } catch (error) {
            console.error("Error loading user data:", error);
            // Use mock data if there's an error
            this.userAccount = {
                id: "user-123",
                email: "user@example.com",
                name: "KODEON Developer",
            };

            this.referralStats = {
                totalReferrals: 3,
                successfulReferrals: 2,
                pendingReferrals: 1,
                totalRewards: 20,
                referralCode: "REF12345678",
            };

            this.referralInfo = {
                referralCode: "REF12345678",
                referralLink: "https://kodeon.ide/signup?ref=REF12345678",
            };
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the referral program panel
        const panelElement = document.createElement("div");
        panelElement.className = "referral-program";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Referral Program</h3>
      </div>
      <div class="referral-content">
        <div class="referral-stats">
          <h4>Your Referral Stats</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${this.referralStats.totalReferrals}</div>
              <div class="stat-label">Total Referrals</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${this.referralStats.successfulReferrals}</div>
              <div class="stat-label">Successful</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${this.referralStats.pendingReferrals}</div>
              <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">$${this.referralStats.totalRewards}</div>
              <div class="stat-label">Rewards Earned</div>
            </div>
          </div>
        </div>
        <div class="referral-invite">
          <h4>Invite Friends</h4>
          <p>Share your referral link and earn $10 for each friend who subscribes to a Pro plan.</p>
          <div class="referral-link-container">
            <input type="text" id="referral-link" class="form-control" value="${this.referralInfo.referralLink}" readonly>
            <button id="copy-referral-link" class="btn btn-primary">Copy Link</button>
          </div>
          <div class="social-share">
            <p>Or share via:</p>
            <div class="share-buttons">
              <button class="btn btn-secondary share-btn" data-platform="email">Email</button>
              <button class="btn btn-secondary share-btn" data-platform="twitter">Twitter</button>
              <button class="btn btn-secondary share-btn" data-platform="facebook">Facebook</button>
            </div>
          </div>
        </div>
        <div class="referral-terms">
          <h4>Program Terms</h4>
          <ul>
            <li>Earn $10 credit for each friend who subscribes to a Pro plan</li>
            <li>Rewards are credited to your account within 24 hours</li>
            <li>No limit on the number of referrals</li>
            <li>Referral credits can be used toward any subscription plan</li>
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
        const copyBtn = document.getElementById("copy-referral-link");
        const shareButtons = document.querySelectorAll(".share-btn");

        copyBtn.addEventListener("click", () => {
            this.copyReferralLink();
        });

        shareButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const platform = button.getAttribute("data-platform");
                this.shareReferralLink(platform);
            });
        });
    }

    async copyReferralLink() {
        const referralLinkInput = document.getElementById("referral-link");

        try {
            // Copy to clipboard
            await navigator.clipboard.writeText(referralLinkInput.value);

            // Show success message
            const copyBtn = document.getElementById("copy-referral-link");
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";

            // Reset button text after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);

            console.log("Referral link copied to clipboard");
        } catch (error) {
            console.error("Error copying referral link:", error);
            alert("Error copying referral link. Please try again.");
        }
    }

    shareReferralLink(platform) {
        const referralLink = document.getElementById("referral-link").value;
        const message =
            "Check out KODEON IDE - a programming language for everyone!";

        switch (platform) {
            case "email":
                window.location.href = `mailto:?subject=Check out KODEON IDE&body=${encodeURIComponent(
                    message + "\n\n" + referralLink
                )}`;
                break;
            case "twitter":
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        message
                    )}&url=${encodeURIComponent(referralLink)}`,
                    "_blank"
                );
                break;
            case "facebook":
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        referralLink
                    )}&quote=${encodeURIComponent(message)}`,
                    "_blank"
                );
                break;
            default:
                console.log("Unknown sharing platform:", platform);
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.userAccount = null;
        this.referralStats = null;
        this.referralInfo = null;
    }
}

module.exports = ReferralProgramComponent;
