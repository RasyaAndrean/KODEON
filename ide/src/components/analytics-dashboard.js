// Analytics Dashboard Component for KODEON IDE
class AnalyticsDashboardComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.userId = null;
        this.userData = null;
        this.isInitialized = false;
    }

    async initialize(userId) {
        this.userId = userId;
        this.isInitialized = true;

        // Load user analytics data
        await this.loadAnalyticsData();

        // Render the component
        this.render();

        console.log("Analytics dashboard component initialized");
    }

    async loadAnalyticsData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the learning system
            // For now, we'll simulate analytics data
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
                dailyActivity: {
                    "2023-01-20": {
                        activities: 3,
                        linesOfCode: 150,
                        sessionTime: 45,
                    },
                    "2023-01-21": {
                        activities: 2,
                        linesOfCode: 80,
                        sessionTime: 30,
                    },
                    "2023-01-22": {
                        activities: 4,
                        linesOfCode: 220,
                        sessionTime: 60,
                    },
                    "2023-01-23": {
                        activities: 1,
                        linesOfCode: 50,
                        sessionTime: 20,
                    },
                    "2023-01-24": {
                        activities: 5,
                        linesOfCode: 300,
                        sessionTime: 90,
                    },
                    "2023-01-25": {
                        activities: 3,
                        linesOfCode: 180,
                        sessionTime: 50,
                    },
                    "2023-01-26": {
                        activities: 2,
                        linesOfCode: 100,
                        sessionTime: 35,
                    },
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
                insights: {
                    mostActiveDay: "2023-01-24",
                    learningPace: "Steady learner",
                    skillGaps: [
                        {
                            skill: "dataStructures",
                            currentLevel: 60,
                            recommendation:
                                "Focus on data structures exercises",
                        },
                        {
                            skill: "oop",
                            currentLevel: 55,
                            recommendation:
                                "Practice object-oriented programming concepts",
                        },
                    ],
                    recommendations: [
                        {
                            type: "achievement",
                            message:
                                "Great consistency! You have a 5-day coding streak.",
                            priority: "high",
                        },
                        {
                            type: "milestone",
                            message:
                                "You have written over 1000 lines of code!",
                            priority: "high",
                        },
                        {
                            type: "suggestion",
                            message:
                                "Try completing more challenges to apply your knowledge.",
                            priority: "medium",
                        },
                        {
                            type: "retention",
                            message:
                                "Keep your daily streak! You're close to unlocking the next achievement.",
                            priority: "high",
                        },
                        {
                            type: "engagement",
                            message:
                                "Your engagement score is high. Try exploring new features to keep learning.",
                            priority: "medium",
                        },
                    ],
                },
                comparison: {
                    linesOfCode: {
                        user: 1250,
                        community: 500,
                        comparison: "above",
                    },
                    tutorialsCompleted: {
                        user: 7,
                        community: 3,
                        comparison: "above",
                    },
                    challengesCompleted: {
                        user: 5,
                        community: 2,
                        comparison: "above",
                    },
                    streakDays: { user: 5, community: 3, comparison: "above" },
                    retentionRate: {
                        user: 85,
                        community: 65,
                        comparison: "above",
                    },
                    engagementScore: {
                        user: 78,
                        community: 60,
                        comparison: "above",
                    },
                },
                // Add goals data
                goals: [
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
                    {
                        id: 3,
                        title: "Complete 3 advanced challenges",
                        description:
                            "Test your skills with complex programming challenges",
                        target: 3,
                        current: 1,
                        unit: "challenges",
                        deadline: "2023-03-10",
                        status: "in-progress",
                        category: "challenge",
                    },
                    {
                        id: 4,
                        title: "Maintain 7-day streak",
                        description:
                            "Code every day for a week to build a strong habit",
                        target: 7,
                        current: 5,
                        unit: "days",
                        deadline: "2023-01-30",
                        status: "in-progress",
                        category: "habit",
                    },
                ],
            };
        } catch (error) {
            console.error("Error loading analytics data:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the analytics dashboard
        const dashboardElement = document.createElement("div");
        dashboardElement.className = "analytics-dashboard";
        dashboardElement.innerHTML = `
      <div class="dashboard-header">
        <h3>Learning Analytics</h3>
        <div class="dashboard-actions">
          <button id="refresh-btn" class="btn btn-secondary">Refresh Data</button>
          <button id="export-btn" class="btn btn-primary">Export Data</button>
        </div>
      </div>
      <div class="dashboard-content">
        <div class="dashboard-grid">
          <div class="dashboard-section">
            <h4>Overview</h4>
            ${this.renderOverview()}
          </div>
          <div class="dashboard-section">
            <h4>Retention Metrics</h4>
            ${this.renderRetentionMetrics()}
          </div>
          <div class="dashboard-section">
            <h4>Skill Progression</h4>
            ${this.renderSkillProgression()}
          </div>
          <div class="dashboard-section">
            <h4>Activity Trends</h4>
            ${this.renderActivityTrends()}
          </div>
          <div class="dashboard-section">
            <h4>Learning Goals</h4>
            ${this.renderGoals()}
          </div>
          <div class="dashboard-section">
            <h4>Learning Insights</h4>
            ${this.renderInsights()}
          </div>
          <div class="dashboard-section">
            <h4>Community Comparison</h4>
            ${this.renderComparison()}
          </div>
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(dashboardElement);

        // Add event listeners
        this.attachEventListeners();

        // Render charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.renderCharts();
        }, 100);
    }

    renderOverview() {
        if (!this.userData) return "<p>No data available</p>";

        const metrics = this.userData.metrics;
        const totalHours = Math.round(metrics.totalSessionTime / 60);

        return `
      <div class="overview-grid">
        <div class="metric-card">
          <div class="metric-value">${metrics.linesOfCode}</div>
          <div class="metric-label">Lines of Code</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${metrics.tutorialsCompleted}</div>
          <div class="metric-label">Tutorials Completed</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${metrics.challengesCompleted}</div>
          <div class="metric-label">Challenges Completed</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${totalHours}h</div>
          <div class="metric-label">Total Coding Time</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${metrics.streakDays}</div>
          <div class="metric-label">Current Streak</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${metrics.skillLevel}</div>
          <div class="metric-label">Skill Level</div>
        </div>
      </div>
    `;
    }

    renderRetentionMetrics() {
        if (!this.userData) return "<p>No data available</p>";

        const metrics = this.userData.metrics;

        // Calculate progress percentages for visual indicators
        const streakProgress = Math.min(
            100,
            (metrics.dailyLoginStreak / 7) * 100
        );
        const weeklyProgress = Math.min(
            100,
            (metrics.weeklyActiveDays / 7) * 100
        );
        const monthlyProgress = Math.min(
            100,
            (metrics.monthlyActiveDays / 30) * 100
        );

        return `
      <div class="retention-metrics-container">
        <div class="metric-card">
          <div class="metric-title">Daily Streak</div>
          <div class="metric-value">${metrics.dailyLoginStreak} days</div>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${streakProgress}%"></div>
            </div>
            <div class="progress-label">7 days goal</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-title">Weekly Activity</div>
          <div class="metric-value">${metrics.weeklyActiveDays}/7 days</div>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${weeklyProgress}%"></div>
            </div>
            <div class="progress-label">This week</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-title">Monthly Activity</div>
          <div class="metric-value">${metrics.monthlyActiveDays}/30 days</div>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${monthlyProgress}%"></div>
            </div>
            <div class="progress-label">This month</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-title">Retention Rate</div>
          <div class="metric-value">${metrics.retentionRate}%</div>
          <div class="metric-description">User retention over time</div>
        </div>

        <div class="metric-card">
          <div class="metric-title">Engagement Score</div>
          <div class="metric-value">${metrics.engagementScore}/100</div>
          <div class="metric-description">Overall platform engagement</div>
        </div>

        <div class="metric-card">
          <div class="metric-title">Feature Adoption</div>
          <div class="metric-value">${metrics.featureAdoption}%</div>
          <div class="metric-description">Features explored</div>
        </div>
      </div>
    `;
    }

    renderSkillProgression() {
        if (!this.userData || !this.userData.skillProgression) {
            return "<p>No skill data available</p>";
        }

        const skills = this.userData.skillProgression;

        return `
      <div class="skills-container">
        ${skills
            .map(
                (skill) => `
          <div class="skill-bar">
            <div class="skill-label">${skill.skill}</div>
            <div class="skill-progress-container">
              <div class="skill-progress-bar">
                <div class="skill-progress-fill" style="width: ${skill.level}%" data-level="${skill.level}"></div>
              </div>
              <div class="skill-level">${skill.level}%</div>
            </div>
          </div>
        `
            )
            .join("")}
      </div>
    `;
    }

    renderActivityTrends() {
        if (!this.userData || !this.userData.dailyActivity) {
            return "<p>No activity data available</p>";
        }

        // Get the last 7 days of activity
        const dates = Object.keys(this.userData.dailyActivity).slice(-7);
        const activityData = dates.map(
            (date) => this.userData.dailyActivity[date]
        );

        return `
      <div class="activity-chart-container">
        <canvas id="activity-chart" width="400" height="200"></canvas>
      </div>
      <div class="activity-summary">
        <div class="summary-item">
          <div class="summary-value">${dates.length}</div>
          <div class="summary-label">Active Days</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${activityData.reduce(
              (sum, day) => sum + day.linesOfCode,
              0
          )}</div>
          <div class="summary-label">Lines Written</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${Math.round(
              activityData.reduce((sum, day) => sum + day.sessionTime, 0) / 60
          )}h</div>
          <div class="summary-label">Coding Time</div>
        </div>
      </div>
    `;
    }

    renderInsights() {
        if (!this.userData || !this.userData.insights) {
            return "<p>No insights available</p>";
        }

        const insights = this.userData.insights;
        const metrics = this.userData.metrics;

        // Add retention-focused insight
        const retentionInsights = [
            {
                type: "retention",
                message: `Your ${metrics.dailyLoginStreak}-day streak shows great commitment!`,
                priority: "high",
                icon: "🔥",
            },
            {
                type: "engagement",
                message: `Your engagement score of ${
                    metrics.engagementScore
                }/100 is ${
                    metrics.engagementScore >= 70 ? "excellent" : "good"
                }. Keep exploring!`,
                priority: "medium",
                icon: "🚀",
            },
        ];

        const allRecommendations = [
            ...insights.recommendations,
            ...retentionInsights,
        ];

        return `
      <div class="insights-container">
        <div class="insight-card highlight">
          <div class="insight-icon">⭐</div>
          <div class="insight-content">
            <div class="insight-title">Learning Pace</div>
            <div class="insight-description">${insights.learningPace}</div>
          </div>
        </div>
        ${allRecommendations
            .map(
                (rec) => `
          <div class="insight-card ${rec.priority}">
            <div class="insight-icon">${
                rec.type === "achievement"
                    ? "🏆"
                    : rec.type === "milestone"
                    ? "🎯"
                    : rec.type === "retention"
                    ? "🔥"
                    : rec.type === "engagement"
                    ? rec.icon
                    : "💡"
            }</div>
            <div class="insight-content">
              <div class="insight-title">${
                  rec.type.charAt(0).toUpperCase() + rec.type.slice(1)
              }</div>
              <div class="insight-description">${rec.message}</div>
            </div>
          </div>
        `
            )
            .join("")}
        ${
            insights.skillGaps.length > 0
                ? `
          <div class="insight-card improvement">
            <div class="insight-icon">📈</div>
            <div class="insight-content">
              <div class="insight-title">Skill Gaps</div>
              <div class="insight-description">
                ${insights.skillGaps
                    .map((gap) => `${gap.skill}: ${gap.recommendation}`)
                    .join("<br>")}
              </div>
            </div>
          </div>
        `
                : ""
        }
      </div>
    `;
    }

    renderComparison() {
        if (!this.userData || !this.userData.comparison) {
            return "<p>No comparison data available</p>";
        }

        const comparison = this.userData.comparison;

        return `
      <div class="comparison-container">
        ${Object.keys(comparison)
            .map((metric) => {
                const data = comparison[metric];
                const isAbove = data.comparison === "above";
                const icon = isAbove ? "📈" : "📊";
                const comparisonText = isAbove ? "Above" : "Below";
                const comparisonClass = isAbove ? "above" : "below";

                return `
            <div class="comparison-item">
              <div class="comparison-icon">${icon}</div>
              <div class="comparison-content">
                <div class="comparison-metric">${metric
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}</div>
                <div class="comparison-values">
                  <span class="user-value">${data.user}</span>
                  <span class="vs">vs</span>
                  <span class="community-value">${data.community}</span>
                </div>
                <div class="comparison-status ${comparisonClass}">${comparisonText} average</div>
              </div>
            </div>
          `;
            })
            .join("")}
      </div>
    `;
    }

    renderGoals() {
        if (!this.userData || !this.userData.goals) {
            return "<p>No goals available</p>";
        }

        const goals = this.userData.goals;

        return `
      <div class="goals-container">
        <div class="goals-header">
          <h5>Your Learning Goals</h5>
          <button id="add-goal-btn" class="btn btn-secondary btn-sm">Add Goal</button>
        </div>
        ${goals
            .map(
                (goal) => `
          <div class="goal-card ${goal.status}">
            <div class="goal-content">
              <div class="goal-title">${goal.title}</div>
              <div class="goal-description">${goal.description}</div>
              <div class="goal-progress">
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${
                        (goal.current / goal.target) * 100
                    }%"></div>
                  </div>
                  <div class="progress-text">${goal.current}/${goal.target} ${
                    goal.unit
                }</div>
                </div>
                <div class="goal-deadline">Due: ${new Date(
                    goal.deadline
                ).toLocaleDateString()}</div>
              </div>
            </div>
            <div class="goal-actions">
              <button class="btn btn-primary btn-sm" data-goal-id="${
                  goal.id
              }">Update Progress</button>
            </div>
          </div>
        `
            )
            .join("")}
      </div>
    `;
    }

    renderCharts() {
        // Render activity chart using Chart.js if available
        const activityChartCanvas = document.getElementById("activity-chart");
        if (activityChartCanvas && typeof Chart !== "undefined") {
            const ctx = activityChartCanvas.getContext("2d");

            // Get the last 7 days of activity
            const dates = Object.keys(this.userData.dailyActivity).slice(-7);
            const activityData = dates.map(
                (date) => this.userData.dailyActivity[date]
            );

            new Chart(ctx, {
                type: "line",
                data: {
                    labels: dates.map((date) =>
                        new Date(date).toLocaleDateString("en-US", {
                            weekday: "short",
                        })
                    ),
                    datasets: [
                        {
                            label: "Lines of Code",
                            data: activityData.map((day) => day.linesOfCode),
                            borderColor: "#007bff",
                            backgroundColor: "rgba(0, 123, 255, 0.1)",
                            tension: 0.3,
                            fill: true,
                        },
                        {
                            label: "Activities",
                            data: activityData.map((day) => day.activities),
                            borderColor: "#28a745",
                            backgroundColor: "rgba(40, 167, 69, 0.1)",
                            tension: 0.3,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }

    attachEventListeners() {
        const refreshBtn = document.getElementById("refresh-btn");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", () => {
                this.refreshData();
            });
        }

        const exportBtn = document.getElementById("export-btn");
        if (exportBtn) {
            exportBtn.addEventListener("click", () => {
                this.exportData();
            });
        }

        // Add goal button event listener
        const addGoalBtn = document.getElementById("add-goal-btn");
        if (addGoalBtn) {
            addGoalBtn.addEventListener("click", () => {
                this.showAddGoalDialog();
            });
        }

        // Add event listeners for update progress buttons
        const updateProgressBtns = document.querySelectorAll("[data-goal-id]");
        updateProgressBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const goalId = parseInt(e.target.getAttribute("data-goal-id"));
                this.showUpdateProgressDialog(goalId);
            });
        });
    }

    showAddGoalDialog() {
        // Create modal dialog for adding a new goal
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Add New Goal</h4>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="add-goal-form">
            <div class="form-group">
              <label for="goal-title">Goal Title</label>
              <input type="text" id="goal-title" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="goal-description">Description</label>
              <textarea id="goal-description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="goal-target">Target</label>
              <input type="number" id="goal-target" class="form-control" min="1" required>
            </div>
            <div class="form-group">
              <label for="goal-unit">Unit</label>
              <input type="text" id="goal-unit" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="goal-deadline">Deadline</label>
              <input type="date" id="goal-deadline" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="goal-category">Category</label>
              <select id="goal-category" class="form-control">
                <option value="learning">Learning</option>
                <option value="practice">Practice</option>
                <option value="challenge">Challenge</option>
                <option value="habit">Habit</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancel-goal">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Goal</button>
            </div>
          </form>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector(".close");
        const cancelBtn = document.getElementById("cancel-goal");
        const form = document.getElementById("add-goal-form");

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.addGoal();
            closeModal();
        });
    }

    addGoal() {
        // Get form values
        const title = document.getElementById("goal-title").value;
        const description = document.getElementById("goal-description").value;
        const target = parseInt(document.getElementById("goal-target").value);
        const unit = document.getElementById("goal-unit").value;
        const deadline = document.getElementById("goal-deadline").value;
        const category = document.getElementById("goal-category").value;

        // Create new goal object
        const newGoal = {
            id: this.userData.goals.length + 1,
            title,
            description,
            target,
            current: 0,
            unit,
            deadline,
            status: "in-progress",
            category,
        };

        // Add to goals array
        this.userData.goals.push(newGoal);

        // Re-render the goals section
        this.render();

        // Show success message
        this.showNotification("Goal added successfully!", "success");
    }

    showUpdateProgressDialog(goalId) {
        const goal = this.userData.goals.find((g) => g.id === goalId);
        if (!goal) return;

        // Create modal dialog for updating progress
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Update Progress: ${goal.title}</h4>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="update-progress-form">
            <div class="form-group">
              <label for="current-progress">Current Progress</label>
              <input type="number" id="current-progress" class="form-control"
                     min="0" max="${goal.target}" value="${
            goal.current
        }" required>
              <div class="form-text">${goal.current}/${goal.target} ${
            goal.unit
        }</div>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${
                    (goal.current / goal.target) * 100
                }%"></div>
              </div>
              <div class="progress-text">${Math.round(
                  (goal.current / goal.target) * 100
              )}% Complete</div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancel-progress">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Progress</button>
            </div>
          </form>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector(".close");
        const cancelBtn = document.getElementById("cancel-progress");
        const form = document.getElementById("update-progress-form");

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.updateGoalProgress(goalId);
            closeModal();
        });
    }

    updateGoalProgress(goalId) {
        const goal = this.userData.goals.find((g) => g.id === goalId);
        if (!goal) return;

        // Get new progress value
        const newProgress = parseInt(
            document.getElementById("current-progress").value
        );

        // Update goal
        goal.current = newProgress;

        // Check if goal is completed
        if (goal.current >= goal.target) {
            goal.status = "completed";
            this.showNotification(
                `Congratulations! You've completed your goal: ${goal.title}`,
                "success"
            );
        }

        // Re-render the goals section
        this.render();

        // Show success message
        this.showNotification("Progress updated successfully!", "success");
    }

    async refreshData() {
        // Show loading state
        const refreshBtn = document.getElementById("refresh-btn");
        const originalText = refreshBtn.textContent;
        refreshBtn.textContent = "Refreshing...";
        refreshBtn.disabled = true;

        try {
            // Reload data
            await this.loadAnalyticsData();

            // Re-render the dashboard
            this.render();

            // Show success message
            this.showNotification("Data refreshed successfully!", "success");
        } catch (error) {
            console.error("Error refreshing data:", error);
            this.showNotification("Error refreshing data", "error");
        } finally {
            // Restore button state
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;
        }
    }

    async exportData() {
        try {
            // In a real implementation, this would call the learning system to export data
            // For now, we'll simulate a download
            const dataStr = JSON.stringify(this.userData, null, 2);
            const dataUri =
                "data:application/json;charset=utf-8," +
                encodeURIComponent(dataStr);

            const exportFileDefaultName = `kodeon-analytics-${
                new Date().toISOString().split("T")[0]
            }.json`;

            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();

            this.showNotification("Data exported successfully!", "success");
        } catch (error) {
            console.error("Error exporting data:", error);
            this.showNotification("Error exporting data", "error");
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
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .analytics-dashboard {
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

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .dashboard-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  .dashboard-section h4 {
    margin: 0 0 15px 0;
    color: #555;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  }

  .metric-card {
    text-align: center;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 6px;
  }

  .metric-value {
    font-size: 1.5em;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 5px;
  }

  .metric-label {
    font-size: 0.9em;
    color: #666;
  }

  .skills-container {
    margin-top: 10px;
  }

  .skill-bar {
    margin-bottom: 15px;
  }

  .skill-label {
    font-size: 0.9em;
    color: #555;
    margin-bottom: 5px;
  }

  .skill-progress-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .skill-progress-bar {
    flex: 1;
    height: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
  }

  .skill-progress-fill {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease;
  }

  .skill-level {
    font-size: 0.8em;
    color: #666;
    min-width: 35px;
    text-align: right;
  }

  .activity-chart-container {
    height: 200px;
    margin-bottom: 20px;
  }

  .activity-summary {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .summary-item {
    padding: 10px;
  }

  .summary-value {
    font-size: 1.2em;
    font-weight: bold;
    color: #007bff;
  }

  .summary-label {
    font-size: 0.8em;
    color: #666;
  }

  .insights-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .insight-card {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 6px;
    background-color: #f8f9fa;
  }

  .insight-card.highlight {
    background-color: #e7f3ff;
    border-left: 4px solid #007bff;
  }

  .insight-card.high {
    background-color: #d4edda;
    border-left: 4px solid #28a745;
  }

  .insight-card.medium {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
  }

  .insight-card.improvement {
    background-color: #f8d7da;
    border-left: 4px solid #dc3545;
  }

  .insight-icon {
    font-size: 1.5em;
    margin-right: 15px;
  }

  .insight-content {
    flex: 1;
  }

  .insight-title {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  .insight-description {
    font-size: 0.9em;
    color: #666;
  }

  .comparison-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .comparison-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 6px;
    background-color: #f8f9fa;
  }

  .comparison-icon {
    font-size: 1.5em;
    margin-right: 15px;
  }

  .comparison-content {
    flex: 1;
  }

  .comparison-metric {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  .comparison-values {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }

  .user-value {
    font-weight: bold;
    color: #007bff;
  }

  .vs {
    color: #888;
    font-size: 0.9em;
  }

  .community-value {
    color: #666;
  }

  .comparison-status {
    font-size: 0.8em;
    padding: 3px 6px;
    border-radius: 3px;
    display: inline-block;
  }

  .comparison-status.above {
    background-color: #d4edda;
    color: #155724;
  }

  .comparison-status.below {
    background-color: #f8d7da;
    color: #721c24;
  }

  .retention-metrics-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .retention-metrics-container .metric-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .metric-title {
    font-size: 0.85em;
    color: #666;
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 1.2em;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 10px;
  }

  .metric-description {
    font-size: 0.8em;
    color: #888;
  }

  .progress-container {
    margin-top: 10px;
  }

  .progress-bar {
    height: 6px;
    background-color: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 5px;
  }

  .progress-fill {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease;
  }

  .progress-label {
    font-size: 0.7em;
    color: #888;
  }

  .goals-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .goals-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .goals-header h5 {
    margin: 0;
    color: #333;
  }

  .goal-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .goal-card.in-progress {
    border-left: 4px solid #007bff;
  }

  .goal-card.completed {
    border-left: 4px solid #28a745;
    opacity: 0.8;
  }

  .goal-title {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  .goal-description {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 10px;
  }

  .goal-progress {
    margin-bottom: 10px;
  }

  .goal-deadline {
    font-size: 0.8em;
    color: #888;
  }

  .goal-actions {
    text-align: right;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 0.8em;
  }

  /* Modal Styles */
  .modal {
    display: block;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 0;
    border: none;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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

  .close {
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover {
    color: #000;
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

  .form-text {
    font-size: 0.8em;
    color: #888;
    margin-top: 5px;
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

// Add Chart.js if not already available
if (typeof Chart === "undefined") {
    const chartScript = document.createElement("script");
    chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
    chartScript.onload = function () {
        // Re-render charts if dashboard is already initialized
        if (
            window.analyticsDashboard &&
            typeof window.analyticsDashboard.renderCharts === "function"
        ) {
            window.analyticsDashboard.renderCharts();
        }
    };
    document.head.appendChild(chartScript);
}

module.exports = AnalyticsDashboardComponent;
