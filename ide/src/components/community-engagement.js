// Community Engagement Component for KODEON IDE
class CommunityEngagementComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.userId = null;
        this.communityData = null;
        this.isInitialized = false;
    }

    async initialize(userId) {
        this.userId = userId;
        this.isInitialized = true;

        // Load community data
        await this.loadCommunityData();

        // Render the component
        this.render();

        console.log("Community engagement component initialized");
    }

    async loadCommunityData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the community system
            // For now, we'll simulate community data
            this.communityData = {
                currentUser: {
                    id: 1,
                    username: "kodeon_user",
                    avatar: "👤",
                    level: 5,
                    points: 1250,
                    badges: [
                        "_beginner",
                        "_debugger",
                        "streak_master",
                        "challenge_accepted",
                    ],
                    joinedDate: "2023-01-15",
                },
                leaderboard: [
                    {
                        id: 1,
                        username: "kodeon_user",
                        avatar: "👤",
                        points: 1250,
                        level: 5,
                    },
                    {
                        id: 2,
                        username: "code_master",
                        avatar: "🥷",
                        points: 2100,
                        level: 8,
                    },
                    {
                        id: 3,
                        username: "debug_queen",
                        avatar: "🐛",
                        points: 1950,
                        level: 7,
                    },
                    {
                        id: 4,
                        username: "algo_wizard",
                        avatar: "🔮",
                        points: 1800,
                        level: 7,
                    },
                    {
                        id: 5,
                        username: "syntax_samurai",
                        avatar: "⚔️",
                        points: 1650,
                        level: 6,
                    },
                    {
                        id: 6,
                        username: "loop_lord",
                        avatar: "🌀",
                        points: 1500,
                        level: 6,
                    },
                    {
                        id: 7,
                        username: "function_fan",
                        avatar: "⚙️",
                        points: 1400,
                        level: 5,
                    },
                    {
                        id: 8,
                        username: "class_captain",
                        avatar: "🎓",
                        points: 1300,
                        level: 5,
                    },
                    {
                        id: 9,
                        username: "new_coder",
                        avatar: "🐣",
                        points: 800,
                        level: 3,
                    },
                    {
                        id: 10,
                        username: "learning_fast",
                        avatar: "🚀",
                        points: 650,
                        level: 2,
                    },
                ],
                recentActivity: [
                    {
                        id: 1,
                        user: { username: "code_master", avatar: "🥷" },
                        action: "completed",
                        target: "Advanced Algorithms Challenge",
                        time: "2 hours ago",
                        points: 150,
                    },
                    {
                        id: 2,
                        user: { username: "debug_queen", avatar: "🐛" },
                        action: "shared",
                        target: "Debugging Tips and Tricks",
                        time: "4 hours ago",
                        points: 75,
                    },
                    {
                        id: 3,
                        user: { username: "algo_wizard", avatar: "🔮" },
                        action: "started",
                        target: "Machine Learning Path",
                        time: "1 day ago",
                        points: 50,
                    },
                    {
                        id: 4,
                        user: { username: "syntax_samurai", avatar: "⚔️" },
                        action: "achieved",
                        target: "Syntax Expert Badge",
                        time: "1 day ago",
                        points: 100,
                    },
                    {
                        id: 5,
                        user: { username: "loop_lord", avatar: "🌀" },
                        action: "posted",
                        target: "Help with nested loops",
                        time: "2 days ago",
                        points: 25,
                    },
                ],
                discussions: [
                    {
                        id: 1,
                        title: "Best practices for debugging in KODEON",
                        author: { username: "debug_expert", avatar: "🔧" },
                        replies: 24,
                        views: 156,
                        lastActivity: "1 hour ago",
                        tags: ["debugging", "best-practices"],
                    },
                    {
                        id: 2,
                        title: "Share your first KODEON project!",
                        author: { username: "community_mod", avatar: "🌟" },
                        replies: 42,
                        views: 312,
                        lastActivity: "3 hours ago",
                        tags: ["projects", "showcase"],
                    },
                    {
                        id: 3,
                        title: "Understanding recursion concepts",
                        author: { username: "recursion_master", avatar: "🌀" },
                        replies: 18,
                        views: 98,
                        lastActivity: "5 hours ago",
                        tags: ["functions", "recursion"],
                    },
                    {
                        id: 4,
                        title: "KODEON vs other programming languages",
                        author: { username: "language_compare", avatar: "🌍" },
                        replies: 31,
                        views: 204,
                        lastActivity: "1 day ago",
                        tags: ["comparison", "discussion"],
                    },
                ],
                events: [
                    {
                        id: 1,
                        title: "Weekly Coding Challenge",
                        description:
                            "Join our weekly challenge to test your skills",
                        date: "2023-02-15",
                        time: "18:00",
                        participants: 124,
                        maxParticipants: 150,
                    },
                    {
                        id: 2,
                        title: "KODEON Community Meetup",
                        description: "Virtual meetup for KODEON enthusiasts",
                        date: "2023-02-18",
                        time: "15:00",
                        participants: 87,
                        maxParticipants: 100,
                    },
                    {
                        id: 3,
                        title: "Advanced Workshop: Data Structures",
                        description:
                            "Deep dive into data structures implementation",
                        date: "2023-02-22",
                        time: "19:00",
                        participants: 65,
                        maxParticipants: 80,
                    },
                ],
            };
        } catch (error) {
            console.error("Error loading community data:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the community engagement display
        const communityElement = document.createElement("div");
        communityElement.className = "community-engagement";
        communityElement.innerHTML = `
      <div class="dashboard-header">
        <h3>Community Engagement</h3>
        <div class="dashboard-actions">
          <button id="refresh-community-btn" class="btn btn-secondary">Refresh</button>
        </div>
      </div>
      <div class="dashboard-content">
        <div class="community-grid">
          <div class="community-section">
            <h4>Your Profile</h4>
            ${this.renderUserProfile()}
          </div>
          <div class="community-section">
            <h4>Leaderboard</h4>
            ${this.renderLeaderboard()}
          </div>
          <div class="community-section">
            <h4>Recent Activity</h4>
            ${this.renderRecentActivity()}
          </div>
          <div class="community-section">
            <h4>Discussions</h4>
            ${this.renderDiscussions()}
          </div>
          <div class="community-section">
            <h4>Upcoming Events</h4>
            ${this.renderEvents()}
          </div>
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(communityElement);

        // Add event listeners
        this.attachEventListeners();
    }

    renderUserProfile() {
        if (!this.communityData || !this.communityData.currentUser) {
            return "<p>No profile data available</p>";
        }

        const user = this.communityData.currentUser;
        const userRank =
            this.communityData.leaderboard.findIndex((u) => u.id === user.id) +
            1;

        return `
      <div class="user-profile-card">
        <div class="profile-header">
          <div class="avatar">${user.avatar}</div>
          <div class="profile-info">
            <div class="username">${user.username}</div>
            <div class="user-stats">
              <span class="level">Level ${user.level}</span>
              <span class="points">${user.points} points</span>
              <span class="rank">#${userRank} rank</span>
            </div>
          </div>
        </div>
        <div class="badges-container">
          <div class="badges-label">Badges:</div>
          <div class="badges-list">
            ${user.badges
                .map((badge) => `<span class="badge">${badge}</span>`)
                .join("")}
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-primary">Share Profile</button>
          <button class="btn btn-secondary">Edit Profile</button>
        </div>
      </div>
    `;
    }

    renderLeaderboard() {
        if (!this.communityData || !this.communityData.leaderboard) {
            return "<p>No leaderboard data available</p>";
        }

        const currentUser = this.communityData.currentUser;
        const topUsers = this.communityData.leaderboard.slice(0, 5);

        return `
      <div class="leaderboard-container">
        ${topUsers
            .map(
                (user, index) => `
          <div class="leaderboard-item ${
              user.id === currentUser.id ? "current-user" : ""
          }">
            <div class="rank">${index + 1}</div>
            <div class="user-info">
              <div class="avatar">${user.avatar}</div>
              <div class="username">${user.username}</div>
            </div>
            <div class="user-stats">
              <span class="points">${user.points}</span>
              <span class="level">Lvl ${user.level}</span>
            </div>
          </div>
        `
            )
            .join("")}
        <div class="leaderboard-footer">
          <button class="btn btn-secondary btn-sm">View Full Leaderboard</button>
        </div>
      </div>
    `;
    }

    renderRecentActivity() {
        if (!this.communityData || !this.communityData.recentActivity) {
            return "<p>No activity data available</p>";
        }

        return `
      <div class="activity-container">
        ${this.communityData.recentActivity
            .map(
                (activity) => `
          <div class="activity-item">
            <div class="activity-user">
              <div class="avatar">${activity.user.avatar}</div>
            </div>
            <div class="activity-content">
              <div class="activity-text">
                <span class="username">${activity.user.username}</span>
                <span class="action">${activity.action}</span>
                <span class="target">${activity.target}</span>
              </div>
              <div class="activity-meta">
                <span class="time">${activity.time}</span>
                <span class="points">+${activity.points} pts</span>
              </div>
            </div>
          </div>
        `
            )
            .join("")}
      </div>
    `;
    }

    renderDiscussions() {
        if (!this.communityData || !this.communityData.discussions) {
            return "<p>No discussions available</p>";
        }

        return `
      <div class="discussions-container">
        ${this.communityData.discussions
            .map(
                (discussion) => `
          <div class="discussion-card">
            <div class="discussion-title">${discussion.title}</div>
            <div class="discussion-meta">
              <div class="discussion-author">
                <span class="avatar">${discussion.author.avatar}</span>
                <span class="username">${discussion.author.username}</span>
              </div>
              <div class="discussion-stats">
                <span class="replies">${discussion.replies} replies</span>
                <span class="views">${discussion.views} views</span>
              </div>
            </div>
            <div class="discussion-tags">
              ${discussion.tags
                  .map((tag) => `<span class="tag">${tag}</span>`)
                  .join("")}
            </div>
            <div class="discussion-footer">
              <span class="last-activity">Last activity: ${
                  discussion.lastActivity
              }</span>
            </div>
          </div>
        `
            )
            .join("")}
        <div class="discussions-footer">
          <button class="btn btn-secondary btn-sm">Start New Discussion</button>
        </div>
      </div>
    `;
    }

    renderEvents() {
        if (!this.communityData || !this.communityData.events) {
            return "<p>No events available</p>";
        }

        return `
      <div class="events-container">
        ${this.communityData.events
            .map(
                (event) => `
          <div class="event-card">
            <div class="event-header">
              <div class="event-title">${event.title}</div>
              <div class="event-date">${new Date(
                  event.date
              ).toLocaleDateString()}</div>
            </div>
            <div class="event-description">${event.description}</div>
            <div class="event-details">
              <div class="event-time">${event.time}</div>
              <div class="event-participants">
                ${event.participants}/${event.maxParticipants} participants
              </div>
            </div>
            <div class="event-actions">
              <button class="btn btn-primary btn-sm join-event-btn" data-event-id="${
                  event.id
              }">Join Event</button>
            </div>
          </div>
        `
            )
            .join("")}
      </div>
    `;
    }

    attachEventListeners() {
        const refreshBtn = document.getElementById("refresh-community-btn");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", () => {
                this.refreshData();
            });
        }

        // Add event listeners for join event buttons
        const joinEventBtns = document.querySelectorAll(".join-event-btn");
        joinEventBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const eventId = parseInt(
                    e.target.getAttribute("data-event-id")
                );
                this.joinEvent(eventId);
            });
        });

        // Add event listener for view full leaderboard button
        const viewLeaderboardBtn = document.querySelector(
            ".leaderboard-footer .btn"
        );
        if (viewLeaderboardBtn) {
            viewLeaderboardBtn.addEventListener("click", () => {
                this.showFullLeaderboard();
            });
        }

        // Add event listener for start new discussion button
        const startDiscussionBtn = document.querySelector(
            ".discussions-footer .btn"
        );
        if (startDiscussionBtn) {
            startDiscussionBtn.addEventListener("click", () => {
                this.startNewDiscussion();
            });
        }
    }

    joinEvent(eventId) {
        const event = this.communityData.events.find((e) => e.id === eventId);
        if (!event) return;

        // In a real implementation, this would join the event
        // For now, we'll just show a notification
        this.showNotification(
            `You've joined the event: ${event.title}`,
            "success"
        );
    }

    showFullLeaderboard() {
        // In a real implementation, this would show the full leaderboard
        // For now, we'll just show a notification
        this.showNotification("Full leaderboard would open here", "info");
    }

    startNewDiscussion() {
        // In a real implementation, this would open a new discussion form
        // For now, we'll just show a notification
        this.showNotification("New discussion form would open here", "info");
    }

    async refreshData() {
        // Show loading state
        const refreshBtn = document.getElementById("refresh-community-btn");
        const originalText = refreshBtn.textContent;
        refreshBtn.textContent = "Refreshing...";
        refreshBtn.disabled = true;

        try {
            // Reload data
            await this.loadCommunityData();

            // Re-render the community section
            this.render();

            // Show success message
            this.showNotification(
                "Community data refreshed successfully!",
                "success"
            );
        } catch (error) {
            console.error("Error refreshing community data:", error);
            this.showNotification("Error refreshing community data", "error");
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
        this.communityData = null;
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .community-engagement {
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

  .community-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .community-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  .community-section h4 {
    margin: 0 0 15px 0;
    color: #555;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .user-profile-card {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .avatar {
    font-size: 2em;
  }

  .profile-info {
    flex: 1;
  }

  .username {
    font-size: 1.2em;
    font-weight: bold;
    color: #333;
  }

  .user-stats {
    display: flex;
    gap: 10px;
    margin-top: 5px;
  }

  .user-stats span {
    font-size: 0.9em;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .level {
    background-color: #e7f3ff;
    color: #007bff;
  }

  .points {
    background-color: #d4edda;
    color: #28a745;
  }

  .rank {
    background-color: #fff3cd;
    color: #ffc107;
  }

  .badges-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .badges-label {
    font-weight: bold;
    color: #555;
  }

  .badges-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .badge {
    background-color: #f8f9fa;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    color: #666;
  }

  .profile-actions {
    display: flex;
    gap: 10px;
  }

  .leaderboard-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 6px;
    background-color: #f8f9fa;
  }

  .leaderboard-item.current-user {
    background-color: #e7f3ff;
    border-left: 3px solid #007bff;
  }

  .rank {
    font-weight: bold;
    width: 20px;
    color: #666;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .user-stats {
    display: flex;
    gap: 10px;
  }

  .user-stats .points {
    background-color: transparent;
    color: #28a745;
    font-weight: bold;
  }

  .user-stats .level {
    background-color: transparent;
    color: #007bff;
  }

  .leaderboard-footer {
    margin-top: 10px;
    text-align: center;
  }

  .activity-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .activity-item {
    display: flex;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
    background-color: #f8f9fa;
  }

  .activity-content {
    flex: 1;
  }

  .activity-text {
    margin-bottom: 5px;
  }

  .username {
    font-weight: bold;
    color: #333;
  }

  .action {
    color: #007bff;
  }

  .target {
    color: #666;
  }

  .activity-meta {
    display: flex;
    gap: 10px;
    font-size: 0.8em;
    color: #888;
  }

  .discussions-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .discussion-card {
    padding: 15px;
    border-radius: 6px;
    background-color: #f8f9fa;
    border-left: 3px solid #007bff;
  }

  .discussion-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }

  .discussion-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .discussion-author {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .discussion-stats {
    display: flex;
    gap: 10px;
    font-size: 0.9em;
    color: #666;
  }

  .discussion-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 10px;
  }

  .tag {
    background-color: #e9ecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8em;
    color: #666;
  }

  .discussion-footer {
    font-size: 0.8em;
    color: #888;
  }

  .discussions-footer {
    margin-top: 10px;
    text-align: center;
  }

  .events-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .event-card {
    padding: 15px;
    border-radius: 6px;
    background-color: #f8f9fa;
    border-left: 3px solid #28a745;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .event-title {
    font-weight: bold;
    color: #333;
  }

  .event-date {
    font-size: 0.9em;
    color: #666;
  }

  .event-description {
    margin-bottom: 10px;
    color: #555;
  }

  .event-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 0.9em;
    color: #666;
  }

  .event-actions {
    text-align: right;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 0.8em;
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

module.exports = CommunityEngagementComponent;
