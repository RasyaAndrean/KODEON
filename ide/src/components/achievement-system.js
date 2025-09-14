// Achievement System Component for KODEON IDE
class AchievementSystemComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.userId = null;
        this.achievements = [];
        this.isInitialized = false;
    }

    async initialize(userId) {
        this.userId = userId;
        this.isInitialized = true;

        // Load user achievements
        await this.loadAchievements();

        // Render the component
        this.render();

        console.log("Achievement system component initialized");
    }

    async loadAchievements() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the learning system
            // For now, we'll simulate achievements data
            this.achievements = [
                {
                    id: 1,
                    title: "First Steps",
                    description: "Write your first line of KODEON code",
                    icon: "👶",
                    earned: true,
                    earnedDate: "2023-01-15",
                    points: 10,
                    category: "beginner",
                },
                {
                    id: 2,
                    title: "Debugger",
                    description: "Complete your first debugging session",
                    icon: "🐛",
                    earned: true,
                    earnedDate: "2023-01-18",
                    points: 25,
                    category: "debugging",
                },
                {
                    id: 3,
                    title: "Streak Master",
                    description: "Maintain a 5-day coding streak",
                    icon: "🔥",
                    earned: true,
                    earnedDate: "2023-01-24",
                    points: 50,
                    category: "commitment",
                },
                {
                    id: 4,
                    title: "Challenge Accepted",
                    description: "Complete your first programming challenge",
                    icon: "🏆",
                    earned: true,
                    earnedDate: "2023-01-20",
                    points: 30,
                    category: "challenge",
                },
                {
                    id: 5,
                    title: "Syntax Expert",
                    description: "Complete all syntax tutorials",
                    icon: "📚",
                    earned: false,
                    points: 100,
                    category: "learning",
                },
                {
                    id: 6,
                    title: "Code Ninja",
                    description: "Write 1000 lines of code",
                    icon: "🥷",
                    earned: false,
                    points: 150,
                    category: "practice",
                },
                {
                    id: 7,
                    title: "Community Builder",
                    description: "Share your first project with the community",
                    icon: "🌐",
                    earned: false,
                    points: 75,
                    category: "community",
                },
                {
                    id: 8,
                    title: "Perfectionist",
                    description: "Achieve 100% on a challenge",
                    icon: "💯",
                    earned: false,
                    points: 200,
                    category: "challenge",
                },
            ];
        } catch (error) {
            console.error("Error loading achievements:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the achievements display
        const achievementsElement = document.createElement("div");
        achievementsElement.className = "achievements-dashboard";
        achievementsElement.innerHTML = `
      <div class="dashboard-header">
        <h3>Achievements & Rewards</h3>
        <div class="dashboard-actions">
          <button id="refresh-achievements-btn" class="btn btn-secondary">Refresh</button>
        </div>
      </div>
      <div class="dashboard-content">
        <div class="achievements-summary">
          <div class="summary-card">
            <div class="summary-value">${
                this.achievements.filter((a) => a.earned).length
            }</div>
            <div class="summary-label">Achievements Earned</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${this.achievements
                .filter((a) => a.earned)
                .reduce((sum, a) => sum + a.points, 0)}</div>
            <div class="summary-label">Points Earned</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${
                this.achievements.filter((a) => !a.earned).length
            }</div>
            <div class="summary-label">Achievements Available</div>
          </div>
        </div>
        <div class="achievements-grid">
          ${this.achievements
              .map(
                  (achievement) => `
            <div class="achievement-card ${
                achievement.earned ? "earned" : "locked"
            }">
              <div class="achievement-icon">${achievement.icon}</div>
              <div class="achievement-content">
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${
                    achievement.description
                }</div>
                <div class="achievement-points">${
                    achievement.points
                } points</div>
                ${
                    achievement.earned
                        ? `<div class="achievement-earned-date">Earned: ${new Date(
                              achievement.earnedDate
                          ).toLocaleDateString()}</div>`
                        : `<div class="achievement-status">Locked</div>`
                }
              </div>
            </div>
          `
              )
              .join("")}
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(achievementsElement);

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const refreshBtn = document.getElementById("refresh-achievements-btn");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", () => {
                this.refreshData();
            });
        }
    }

    async refreshData() {
        // Show loading state
        const refreshBtn = document.getElementById("refresh-achievements-btn");
        const originalText = refreshBtn.textContent;
        refreshBtn.textContent = "Refreshing...";
        refreshBtn.disabled = true;

        try {
            // Reload data
            await this.loadAchievements();

            // Re-render the dashboard
            this.render();

            // Show success message
            this.showNotification(
                "Achievements refreshed successfully!",
                "success"
            );
        } catch (error) {
            console.error("Error refreshing achievements:", error);
            this.showNotification("Error refreshing achievements", "error");
        } finally {
            // Restore button state
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;
        }
    }

    showNotification(message, type = "info") {
        // Create notification element
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Remove after delay
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.userId = null;
        this.achievements = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .achievements-dashboard {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 20px;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .dashboard-header h3 {
    margin: 0;
    color: #333;
  }

  .dashboard-actions {
    display: flex;
    gap: 10px;
  }

  .achievements-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .summary-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    text-align: center;
  }

  .summary-value {
    font-size: 2em;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 5px;
  }

  .summary-label {
    font-size: 0.9em;
    color: #666;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .achievement-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    background-color: #f8f9fa;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .achievement-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .achievement-card.earned {
    background-color: #e7f3ff;
    border-left: 4px solid #007bff;
  }

  .achievement-card.locked {
    opacity: 0.7;
  }

  .achievement-icon {
    font-size: 2em;
    margin-right: 15px;
  }

  .achievement-content {
    flex: 1;
  }

  .achievement-title {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  .achievement-description {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 10px;
  }

  .achievement-points {
    font-size: 0.8em;
    color: #007bff;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .achievement-earned-date {
    font-size: 0.8em;
    color: #28a745;
  }

  .achievement-status {
    font-size: 0.8em;
    color: #888;
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

  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  }

  .notification.success {
    background-color: #28a745;
  }

  .notification.error {
    background-color: #dc3545;
  }

  .notification.info {
    background-color: #007bff;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

document.head.appendChild(style);

module.exports = AchievementSystemComponent;
