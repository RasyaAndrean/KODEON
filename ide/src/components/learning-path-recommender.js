// Learning Path Recommender Component for KODEON IDE
class LearningPathRecommenderComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.userId = null;
        this.userData = null;
        this.recommendations = [];
        this.isInitialized = false;
    }

    async initialize(userId) {
        this.userId = userId;
        this.isInitialized = true;

        // Load user data and generate recommendations
        await this.loadUserData();
        this.generateRecommendations();

        // Render the component
        this.render();

        console.log("Learning path recommender component initialized");
    }

    async loadUserData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the learning system
            // For now, we'll simulate user data
            this.userData = {
                metrics: {
                    linesOfCode: 1250,
                    programsRun: 42,
                    functionsCreated: 28,
                    loopPrograms: 15,
                    classesDefined: 8,
                    debugSessions: 12,
                    tutorialsCompleted: 7,
                    challengesCompleted: 5,
                    goalsSet: 4,
                    goalsAchieved: 2,
                    sessionCount: 35,
                    totalSessionTime: 1200, // in minutes
                    lastActivity: new Date().toISOString(),
                    streakDays: 5,
                    longestStreak: 8,
                    skillLevel: "Intermediate",
                    pathsStarted: 2,
                    pathsCompleted: 1,
                    // Retention metrics
                    dailyLoginStreak: 5,
                    weeklyActiveDays: 4,
                    monthlyActiveDays: 15,
                    retentionRate: 85, // Percentage
                    engagementScore: 78, // 0-100 scale
                    featureAdoption: 65, // Percentage of features used
                },
                skillProgression: [
                    { skill: "syntax", level: 85 },
                    { skill: "functions", level: 75 },
                    { skill: "controlFlow", level: 70 },
                    { skill: "dataStructures", level: 60 },
                    { skill: "oop", level: 55 },
                    { skill: "debugging", level: 65 },
                    { skill: "problemSolving", level: 70 },
                ],
                completedTutorials: [
                    "introduction-to-kodeon",
                    "variables-and-data-types",
                    "control-flow",
                    "functions-basics",
                    "arrays-and-loops",
                    "objects-and-classes",
                ],
                completedChallenges: [
                    "hello-world",
                    "calculator",
                    "number-guessing-game",
                ],
                currentGoals: [
                    {
                        id: 1,
                        title: "Complete 10 tutorials",
                        description:
                            "Finish 10 coding tutorials to strengthen your foundation",
                        target: 10,
                        current: 7,
                        unit: "tutorials",
                        deadline: "2023-02-15",
                        status: "in-progress",
                        category: "learning",
                    },
                    {
                        id: 2,
                        title: "Write 2000 lines of code",
                        description:
                            "Build your coding muscle memory by writing more code",
                        target: 2000,
                        current: 1250,
                        unit: "lines",
                        deadline: "2023-02-28",
                        status: "in-progress",
                        category: "practice",
                    },
                ],
            };
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    generateRecommendations() {
        if (!this.userData) return;

        // Generate personalized learning path recommendations based on user data
        this.recommendations = [];

        // Recommendation 1: Based on skill gaps
        const skillGaps = this.userData.skillProgression.filter(
            (skill) => skill.level < 70
        );
        if (skillGaps.length > 0) {
            const weakestSkill = skillGaps.reduce(
                (min, skill) => (skill.level < min.level ? skill : min),
                skillGaps[0]
            );

            this.recommendations.push({
                id: 1,
                title: `Strengthen Your ${weakestSkill.skill} Skills`,
                description: `Based on your progress, focusing on ${weakestSkill.skill} will help you become a more well-rounded programmer.`,
                type: "skill-development",
                priority: "high",
                estimatedTime: "2-3 hours",
                nextSteps: [
                    `Review ${weakestSkill.skill} concepts`,
                    `Complete 2-3 related tutorials`,
                    `Solve 1-2 challenges applying these concepts`,
                ],
                resources: [
                    {
                        type: "tutorial",
                        title: `${weakestSkill.skill} Fundamentals`,
                        id: `tutorial-${weakestSkill.skill}-1`,
                    },
                    {
                        type: "tutorial",
                        title: `Advanced ${weakestSkill.skill}`,
                        id: `tutorial-${weakestSkill.skill}-2`,
                    },
                    {
                        type: "challenge",
                        title: `${weakestSkill.skill} Practice Challenge`,
                        id: `challenge-${weakestSkill.skill}-1`,
                    },
                ],
            });
        }

        // Recommendation 2: Based on completed content
        const tutorialsCompleted = this.userData.metrics.tutorialsCompleted;
        if (tutorialsCompleted >= 5) {
            this.recommendations.push({
                id: 2,
                title: "Apply Your Knowledge",
                description:
                    "You've completed several tutorials. Now it's time to apply what you've learned in practical projects.",
                type: "application",
                priority: "high",
                estimatedTime: "3-5 hours",
                nextSteps: [
                    "Start a small project using your current skills",
                    "Focus on solving real-world problems",
                    "Share your project with the community",
                ],
                resources: [
                    {
                        type: "project",
                        title: "Personal Portfolio Website",
                        id: "project-portfolio",
                    },
                    {
                        type: "project",
                        title: "Task Manager Application",
                        id: "project-task-manager",
                    },
                    {
                        type: "project",
                        title: "Simple Game",
                        id: "project-game",
                    },
                ],
            });
        }

        // Recommendation 3: Based on goals
        const activeGoals = this.userData.currentGoals.filter(
            (goal) => goal.status === "in-progress"
        );
        if (activeGoals.length > 0) {
            this.recommendations.push({
                id: 3,
                title: "Goal-Focused Learning Path",
                description:
                    "Continue working toward your active goals to maintain momentum and build consistency.",
                type: "goal-oriented",
                priority: "medium",
                estimatedTime: "1-2 hours",
                nextSteps: [
                    ...activeGoals.map((goal) => `Work on: ${goal.title}`),
                ],
                resources: [
                    ...activeGoals.map((goal) => ({
                        type: "goal",
                        title: goal.title,
                        id: `goal-${goal.id}`,
                    })),
                ],
            });
        }

        // Recommendation 4: Exploration
        this.recommendations.push({
            id: 4,
            title: "Explore New Horizons",
            description:
                "Expand your knowledge by exploring advanced topics and new areas of programming.",
            type: "exploration",
            priority: "low",
            estimatedTime: "2-4 hours",
            nextSteps: [
                "Learn about algorithms and data structures",
                "Explore web development with KODEON",
                "Dive into object-oriented programming patterns",
            ],
            resources: [
                {
                    type: "tutorial",
                    title: "Introduction to Algorithms",
                    id: "tutorial-algorithms-1",
                },
                {
                    type: "tutorial",
                    title: "Web Development Basics",
                    id: "tutorial-web-dev-1",
                },
                {
                    type: "tutorial",
                    title: "Design Patterns in KODEON",
                    id: "tutorial-patterns-1",
                },
            ],
        });
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the recommendations display
        const recommendationsElement = document.createElement("div");
        recommendationsElement.className = "learning-path-recommender";
        recommendationsElement.innerHTML = `
      <div class="dashboard-header">
        <h3>Personalized Learning Path</h3>
        <div class="dashboard-actions">
          <button id="refresh-recommendations-btn" class="btn btn-secondary">Refresh</button>
        </div>
      </div>
      <div class="dashboard-content">
        <div class="recommendations-intro">
          <p>Based on your progress and goals, we've created a personalized learning path to help you continue growing as a programmer.</p>
        </div>
        <div class="recommendations-list">
          ${this.recommendations
              .map(
                  (rec) => `
            <div class="recommendation-card ${rec.priority}">
              <div class="recommendation-header">
                <h4>${rec.title}</h4>
                <span class="priority-tag ${rec.priority}">${
                      rec.priority
                  }</span>
              </div>
              <div class="recommendation-content">
                <p class="recommendation-description">${rec.description}</p>
                <div class="recommendation-details">
                  <div class="detail-item">
                    <strong>Estimated Time:</strong> ${rec.estimatedTime}
                  </div>
                  <div class="detail-item">
                    <strong>Next Steps:</strong>
                    <ul>
                      ${rec.nextSteps
                          .map((step) => `<li>${step}</li>`)
                          .join("")}
                    </ul>
                  </div>
                  <div class="detail-item">
                    <strong>Recommended Resources:</strong>
                    <div class="resources-grid">
                      ${rec.resources
                          .map(
                              (resource) => `
                        <div class="resource-card" data-type="${
                            resource.type
                        }" data-id="${resource.id}">
                          <div class="resource-icon">
                            ${
                                resource.type === "tutorial"
                                    ? "📚"
                                    : resource.type === "challenge"
                                    ? "🏆"
                                    : resource.type === "project"
                                    ? "🚀"
                                    : resource.type === "goal"
                                    ? "🎯"
                                    : "📖"
                            }
                          </div>
                          <div class="resource-title">${resource.title}</div>
                        </div>
                      `
                          )
                          .join("")}
                    </div>
                  </div>
                </div>
              </div>
              <div class="recommendation-actions">
                <button class="btn btn-primary start-learning-btn" data-rec-id="${
                    rec.id
                }">Start Learning</button>
              </div>
            </div>
          `
              )
              .join("")}
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(recommendationsElement);

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const refreshBtn = document.getElementById(
            "refresh-recommendations-btn"
        );
        if (refreshBtn) {
            refreshBtn.addEventListener("click", () => {
                this.refreshData();
            });
        }

        // Add event listeners for start learning buttons
        const startLearningBtns = document.querySelectorAll(
            ".start-learning-btn"
        );
        startLearningBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const recId = parseInt(e.target.getAttribute("data-rec-id"));
                this.startLearningPath(recId);
            });
        });

        // Add event listeners for resource cards
        const resourceCards = document.querySelectorAll(".resource-card");
        resourceCards.forEach((card) => {
            card.addEventListener("click", (e) => {
                const type = e.currentTarget.getAttribute("data-type");
                const id = e.currentTarget.getAttribute("data-id");
                this.openResource(type, id);
            });
        });
    }

    startLearningPath(recId) {
        const recommendation = this.recommendations.find(
            (rec) => rec.id === recId
        );
        if (!recommendation) return;

        // In a real implementation, this would start the learning path
        // For now, we'll just show a notification
        this.showNotification(
            `Starting learning path: ${recommendation.title}`,
            "success"
        );
    }

    openResource(type, id) {
        // In a real implementation, this would open the resource
        // For now, we'll just show a notification
        this.showNotification(`Opening ${type} with ID: ${id}`, "info");
    }

    async refreshData() {
        // Show loading state
        const refreshBtn = document.getElementById(
            "refresh-recommendations-btn"
        );
        const originalText = refreshBtn.textContent;
        refreshBtn.textContent = "Refreshing...";
        refreshBtn.disabled = true;

        try {
            // Reload data
            await this.loadUserData();
            this.generateRecommendations();

            // Re-render the recommendations
            this.render();

            // Show success message
            this.showNotification(
                "Recommendations refreshed successfully!",
                "success"
            );
        } catch (error) {
            console.error("Error refreshing recommendations:", error);
            this.showNotification("Error refreshing recommendations", "error");
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
        this.userData = null;
        this.recommendations = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .learning-path-recommender {
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

  .recommendations-intro {
    background-color: #e7f3ff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
  }

  .recommendations-intro p {
    margin: 0;
    color: #333;
    font-size: 1.1em;
  }

  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .recommendation-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    border-left: 4px solid #007bff;
  }

  .recommendation-card.high {
    border-left-color: #dc3545;
  }

  .recommendation-card.medium {
    border-left-color: #ffc107;
  }

  .recommendation-card.low {
    border-left-color: #28a745;
  }

  .recommendation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .recommendation-header h4 {
    margin: 0;
    color: #333;
  }

  .priority-tag {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
    text-transform: uppercase;
  }

  .priority-tag.high {
    background-color: #f8d7da;
    color: #721c24;
  }

  .priority-tag.medium {
    background-color: #fff3cd;
    color: #856404;
  }

  .priority-tag.low {
    background-color: #d4edda;
    color: #155724;
  }

  .recommendation-description {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 20px;
  }

  .recommendation-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .detail-item {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .detail-item:last-child {
    border-bottom: none;
  }

  .detail-item strong {
    color: #333;
    margin-bottom: 5px;
    display: block;
  }

  .detail-item ul {
    margin: 10px 0 0 20px;
    padding: 0;
  }

  .detail-item li {
    margin-bottom: 5px;
    color: #666;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 10px;
  }

  .resource-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .resource-card:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .resource-icon {
    font-size: 1.5em;
    margin-bottom: 10px;
  }

  .resource-title {
    text-align: center;
    font-size: 0.9em;
    color: #333;
  }

  .recommendation-actions {
    margin-top: 20px;
    text-align: right;
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

module.exports = LearningPathRecommenderComponent;
