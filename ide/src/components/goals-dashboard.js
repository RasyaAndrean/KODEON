// Goals Dashboard Component for KODEON IDE
class GoalsDashboardComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.userId = null;
        this.userGoals = [];
        this.goalTemplates = [];
        this.isInitialized = false;
    }

    async initialize(userId) {
        this.userId = userId;
        this.isInitialized = true;

        // Load user goals and templates
        await this.loadGoals();
        await this.loadTemplates();

        // Render the component
        this.render();

        console.log("Goals dashboard component initialized");
    }

    async loadGoals() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the learning system
            // For now, we'll simulate goals
            this.userGoals = [
                {
                    id: "goal-1",
                    name: "Complete 5 Tutorials",
                    description:
                        "Complete 5 programming tutorials to build foundational knowledge",
                    type: "tutorial",
                    target: 5,
                    currentProgress: 3,
                    startDate: "2023-01-01T00:00:00Z",
                    targetDate: "2023-02-01T00:00:00Z",
                    completed: false,
                    reward: "Learning Enthusiast Badge",
                },
                {
                    id: "goal-2",
                    name: "Master Functions",
                    description: "Create and use 10 functions effectively",
                    type: "skill",
                    target: 10,
                    currentProgress: 7,
                    startDate: "2023-01-15T00:00:00Z",
                    targetDate: "2023-03-01T00:00:00Z",
                    completed: false,
                    reward: "Function Master Badge",
                },
                {
                    id: "goal-3",
                    name: "Complete 3 Challenges",
                    description:
                        "Complete 3 programming challenges to apply your knowledge",
                    type: "challenge",
                    target: 3,
                    currentProgress: 3,
                    startDate: "2023-01-10T00:00:00Z",
                    targetDate: "2023-02-10T00:00:00Z",
                    completed: true,
                    completionDate: "2023-01-25T00:00:00Z",
                    reward: "Challenge Solver Badge",
                },
            ];
        } catch (error) {
            console.error("Error loading user goals:", error);
        }
    }

    async loadTemplates() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the learning system
            // For now, we'll simulate templates
            this.goalTemplates = [
                {
                    id: "complete-tutorials",
                    name: "Complete Tutorials",
                    description: "Complete a specific number of tutorials",
                    type: "tutorial",
                    defaultTarget: 5,
                    reward: "Learning Enthusiast Badge",
                },
                {
                    id: "master-functions",
                    name: "Master Functions",
                    description: "Create and use functions effectively",
                    type: "skill",
                    defaultTarget: 10,
                    reward: "Function Master Badge",
                },
                {
                    id: "complete-challenges",
                    name: "Complete Challenges",
                    description: "Complete programming challenges",
                    type: "challenge",
                    defaultTarget: 3,
                    reward: "Challenge Solver Badge",
                },
                {
                    id: "coding-streak",
                    name: "Coding Streak",
                    description:
                        "Code for a specific number of consecutive days",
                    type: "habit",
                    defaultTarget: 7,
                    reward: "Consistency Badge",
                },
                {
                    id: "syntax-mastery",
                    name: "Syntax Mastery",
                    description: "Write a specific number of lines of code",
                    type: "activity",
                    defaultTarget: 1000,
                    reward: "Syntax Master Badge",
                },
            ];
        } catch (error) {
            console.error("Error loading goal templates:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the goals dashboard
        const dashboardElement = document.createElement("div");
        dashboardElement.className = "goals-dashboard";
        dashboardElement.innerHTML = `
      <div class="dashboard-header">
        <h3>Learning Goals</h3>
        <button id="add-goal-btn" class="btn btn-primary">Add New Goal</button>
      </div>
      <div class="dashboard-content">
        <div class="goals-section">
          <h4>Active Goals</h4>
          <div class="goals-list">
            ${this.renderActiveGoals()}
          </div>
        </div>
        <div class="goals-section">
          <h4>Completed Goals</h4>
          <div class="goals-list">
            ${this.renderCompletedGoals()}
          </div>
        </div>
        <div class="goals-section">
          <h4>Goal Templates</h4>
          <div class="templates-list">
            ${this.renderGoalTemplates()}
          </div>
        </div>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(dashboardElement);

        // Add event listeners
        this.attachEventListeners();
    }

    renderActiveGoals() {
        const activeGoals = this.userGoals.filter((goal) => !goal.completed);

        if (activeGoals.length === 0) {
            return '<p class="no-goals">No active goals. Create a new goal to get started!</p>';
        }

        return activeGoals
            .map((goal) => {
                const progressPercentage = Math.round(
                    (goal.currentProgress / goal.target) * 100
                );
                const daysRemaining = this.calculateDaysRemaining(
                    goal.targetDate
                );

                return `
        <div class="goal-card active-goal" data-goal-id="${goal.id}">
          <div class="goal-header">
            <h5>${goal.name}</h5>
            <span class="goal-type ${goal.type}">${goal.type}</span>
          </div>
          <p class="goal-description">${goal.description}</p>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-text">${goal.currentProgress} / ${
                    goal.target
                } (${progressPercentage}%)</div>
          </div>
          <div class="goal-meta">
            <div class="goal-deadline">Deadline: ${new Date(
                goal.targetDate
            ).toLocaleDateString()} (${daysRemaining} days left)</div>
            <div class="goal-reward">Reward: ${goal.reward}</div>
          </div>
          <div class="goal-actions">
            <button class="btn btn-small btn-secondary update-progress-btn" data-goal-id="${
                goal.id
            }">Update Progress</button>
            <button class="btn btn-small btn-danger delete-goal-btn" data-goal-id="${
                goal.id
            }">Delete</button>
          </div>
        </div>
      `;
            })
            .join("");
    }

    renderCompletedGoals() {
        const completedGoals = this.userGoals.filter((goal) => goal.completed);

        if (completedGoals.length === 0) {
            return '<p class="no-goals">No completed goals yet.</p>';
        }

        return completedGoals
            .map((goal) => {
                return `
        <div class="goal-card completed-goal" data-goal-id="${goal.id}">
          <div class="goal-header">
            <h5>${goal.name}</h5>
            <span class="goal-type ${goal.type}">${goal.type}</span>
          </div>
          <p class="goal-description">${goal.description}</p>
          <div class="goal-completed">
            <div class="completed-badge">✓ Completed</div>
            <div class="completion-date">Completed: ${new Date(
                goal.completionDate
            ).toLocaleDateString()}</div>
          </div>
          <div class="goal-reward">Reward: ${goal.reward}</div>
        </div>
      `;
            })
            .join("");
    }

    renderGoalTemplates() {
        return this.goalTemplates
            .map((template) => {
                return `
        <div class="template-card" data-template-id="${template.id}">
          <div class="template-header">
            <h5>${template.name}</h5>
            <span class="goal-type ${template.type}">${template.type}</span>
          </div>
          <p class="template-description">${template.description}</p>
          <div class="template-details">
            <div class="template-target">Target: ${template.defaultTarget}</div>
            <div class="template-reward">Reward: ${template.reward}</div>
          </div>
          <button class="btn btn-small btn-primary create-goal-btn" data-template-id="${template.id}">Create Goal</button>
        </div>
      `;
            })
            .join("");
    }

    calculateDaysRemaining(targetDate) {
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    attachEventListeners() {
        const addGoalBtn = document.getElementById("add-goal-btn");
        if (addGoalBtn) {
            addGoalBtn.addEventListener("click", () => {
                this.showCreateGoalForm();
            });
        }

        // Add event listeners for update progress buttons
        const updateProgressBtns = document.querySelectorAll(
            ".update-progress-btn"
        );
        updateProgressBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const goalId = btn.getAttribute("data-goal-id");
                this.showUpdateProgressForm(goalId);
            });
        });

        // Add event listeners for delete goal buttons
        const deleteGoalBtns = document.querySelectorAll(".delete-goal-btn");
        deleteGoalBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const goalId = btn.getAttribute("data-goal-id");
                this.deleteGoal(goalId);
            });
        });

        // Add event listeners for create goal buttons
        const createGoalBtns = document.querySelectorAll(".create-goal-btn");
        createGoalBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const templateId = btn.getAttribute("data-template-id");
                this.createGoalFromTemplate(templateId);
            });
        });
    }

    showCreateGoalForm() {
        // Create a modal for goal creation
        const modal = document.createElement("div");
        modal.className = "goal-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Create New Goal</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="create-goal-form">
            <div class="form-group">
              <label for="goal-name">Goal Name</label>
              <input type="text" id="goal-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="goal-description">Description</label>
              <textarea id="goal-description" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="goal-type">Type</label>
              <select id="goal-type" class="form-control">
                <option value="tutorial">Tutorial</option>
                <option value="challenge">Challenge</option>
                <option value="skill">Skill</option>
                <option value="habit">Habit</option>
                <option value="activity">Activity</option>
              </select>
            </div>
            <div class="form-group">
              <label for="goal-target">Target</label>
              <input type="number" id="goal-target" class="form-control" min="1" required>
            </div>
            <div class="form-group">
              <label for="goal-deadline">Deadline</label>
              <input type="date" id="goal-deadline" class="form-control">
            </div>
            <div class="form-group">
              <label for="goal-reward">Reward</label>
              <input type="text" id="goal-reward" class="form-control">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Goal</button>
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
        const form = modal.querySelector("#create-goal-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.createCustomGoal();
            closeHandler();
        });
    }

    async createCustomGoal() {
        const name = document.getElementById("goal-name").value;
        const description = document.getElementById("goal-description").value;
        const type = document.getElementById("goal-type").value;
        const target = parseInt(document.getElementById("goal-target").value);
        const deadline = document.getElementById("goal-deadline").value;
        const reward = document.getElementById("goal-reward").value;

        // In a real implementation, this would call the learning system
        const newGoal = {
            id: `goal-${Date.now()}`,
            name: name,
            description: description,
            type: type,
            target: target,
            currentProgress: 0,
            startDate: new Date().toISOString(),
            targetDate: deadline
                ? new Date(deadline).toISOString()
                : this.calculateDefaultTargetDate(target),
            completed: false,
            reward: reward || "Achievement Unlocked!",
        };

        this.userGoals.push(newGoal);
        this.render();

        console.log("New goal created:", newGoal);
    }

    calculateDefaultTargetDate(target) {
        // Simple calculation: 1 unit per day
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + target);
        return targetDate.toISOString();
    }

    showUpdateProgressForm(goalId) {
        const goal = this.userGoals.find((g) => g.id === goalId);
        if (!goal) return;

        // Create a modal for progress update
        const modal = document.createElement("div");
        modal.className = "goal-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Update Progress: ${goal.name}</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="progress-info">
            <p>Current Progress: ${goal.currentProgress} / ${goal.target}</p>
          </div>
          <form id="update-progress-form">
            <input type="hidden" id="goal-id" value="${goalId}">
            <div class="form-group">
              <label for="new-progress">New Progress</label>
              <input type="number" id="new-progress" class="form-control" min="0" max="${goal.target}" value="${goal.currentProgress}" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Update Progress</button>
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
        const form = modal.querySelector("#update-progress-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.updateGoalProgress();
            closeHandler();
        });
    }

    async updateGoalProgress() {
        const goalId = document.getElementById("goal-id").value;
        const newProgress = parseInt(
            document.getElementById("new-progress").value
        );

        // Find and update the goal
        const goal = this.userGoals.find((g) => g.id === goalId);
        if (goal) {
            goal.currentProgress = newProgress;

            if (newProgress >= goal.target) {
                goal.completed = true;
                goal.completionDate = new Date().toISOString();
                alert(
                    `Congratulations! You've achieved your goal: ${goal.name}`
                );
            }

            this.render();

            // In a real implementation, you would also update the backend
            console.log(`Progress updated for goal ${goalId}: ${newProgress}`);
        }
    }

    async deleteGoal(goalId) {
        if (confirm("Are you sure you want to delete this goal?")) {
            this.userGoals = this.userGoals.filter(
                (goal) => goal.id !== goalId
            );
            this.render();

            // In a real implementation, you would also update the backend
            console.log(`Goal ${goalId} deleted`);
        }
    }

    async createGoalFromTemplate(templateId) {
        const template = this.goalTemplates.find((t) => t.id === templateId);
        if (!template) return;

        // Create a modal for goal creation from template
        const modal = document.createElement("div");
        modal.className = "goal-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Create Goal from Template: ${template.name}</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="template-preview">
            <p><strong>Description:</strong> ${template.description}</p>
            <p><strong>Default Target:</strong> ${template.defaultTarget}</p>
            <p><strong>Reward:</strong> ${template.reward}</p>
          </div>
          <form id="template-goal-form">
            <input type="hidden" id="template-id" value="${templateId}">
            <div class="form-group">
              <label for="custom-name">Goal Name (optional)</label>
              <input type="text" id="custom-name" class="form-control" value="${template.name}">
            </div>
            <div class="form-group">
              <label for="custom-target">Target (optional)</label>
              <input type="number" id="custom-target" class="form-control" min="1" value="${template.defaultTarget}">
            </div>
            <div class="form-group">
              <label for="custom-deadline">Deadline (optional)</label>
              <input type="date" id="custom-deadline" class="form-control">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Goal</button>
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
        const form = modal.querySelector("#template-goal-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.createGoalFromTemplateForm();
            closeHandler();
        });
    }

    async createGoalFromTemplateForm() {
        const templateId = document.getElementById("template-id").value;
        const customName = document.getElementById("custom-name").value;
        const customTarget = parseInt(
            document.getElementById("custom-target").value
        );
        const customDeadline = document.getElementById("custom-deadline").value;

        const template = this.goalTemplates.find((t) => t.id === templateId);
        if (!template) return;

        // Create goal from template
        const newGoal = {
            id: `goal-${Date.now()}`,
            name: customName || template.name,
            description: template.description,
            type: template.type,
            target: customTarget || template.defaultTarget,
            currentProgress: 0,
            startDate: new Date().toISOString(),
            targetDate: customDeadline
                ? new Date(customDeadline).toISOString()
                : this.calculateDefaultTargetDate(
                      customTarget || template.defaultTarget
                  ),
            completed: false,
            reward: template.reward,
        };

        this.userGoals.push(newGoal);
        this.render();

        console.log("New goal created from template:", newGoal);
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.userId = null;
        this.userGoals = [];
        this.goalTemplates = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .goals-dashboard {
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

  .goals-section {
    margin-bottom: 30px;
  }

  .goals-section h4 {
    margin: 0 0 15px 0;
    color: #555;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
  }

  .no-goals {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 20px;
  }

  .goal-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 15px;
  }

  .active-goal {
    border-left: 4px solid #007bff;
  }

  .completed-goal {
    border-left: 4px solid #28a745;
    opacity: 0.8;
  }

  .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .goal-header h5 {
    margin: 0;
    color: #333;
  }

  .goal-description {
    color: #666;
    margin-bottom: 15px;
  }

  .goal-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
    text-transform: uppercase;
  }

  .tutorial { background-color: #cce5ff; color: #004085; }
  .challenge { background-color: #d4edda; color: #155724; }
  .skill { background-color: #fff3cd; color: #856404; }
  .habit { background-color: #f8d7da; color: #721c24; }
  .activity { background-color: #d1ecf1; color: #0c5460; }

  .goal-progress {
    margin-bottom: 15px;
  }

  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 5px;
  }

  .progress-fill {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.9em;
    color: #666;
    text-align: right;
  }

  .goal-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 0.9em;
    color: #888;
  }

  .goal-deadline, .goal-reward {
    margin-bottom: 5px;
  }

  .goal-completed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .completed-badge {
    background-color: #28a745;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: bold;
  }

  .completion-date {
    color: #888;
    font-size: 0.9em;
  }

  .goal-actions {
    display: flex;
    gap: 10px;
  }

  .template-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 15px;
  }

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .template-header h5 {
    margin: 0;
    color: #333;
  }

  .template-description {
    color: #666;
    margin-bottom: 15px;
    font-size: 0.9em;
  }

  .template-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 0.9em;
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

  .btn-small {
    padding: 5px 10px;
    font-size: 0.85em;
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

  .goal-modal {
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

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .progress-info {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .template-preview {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
`;

document.head.appendChild(style);

module.exports = GoalsDashboardComponent;
