// Learning Path Visualization Component for KODEON IDE
class LearningPathComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentPath = null;
        this.userId = null;
        this.isInitialized = false;
    }

    async initialize(userId) {
        this.userId = userId;
        this.isInitialized = true;

        // Load current learning path
        await this.loadCurrentPath();

        // Render the component
        this.render();

        console.log("Learning path component initialized");
    }

    async loadCurrentPath() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the learning system
            // For now, we'll simulate a path
            this.currentPath = {
                id: "path-12345",
                title: "Beginner to Intermediate Programming",
                description: "Path from basic syntax to intermediate concepts",
                completionPercentage: 25,
                currentStep: 2,
                totalSteps: 8,
                steps: [
                    {
                        id: "step-1",
                        title: "Introduction to KODEON",
                        type: "tutorial",
                        completed: true,
                        completionDate: "2023-01-01T10:30:00Z",
                    },
                    {
                        id: "step-2",
                        title: "Variables and Data Types",
                        type: "tutorial",
                        completed: true,
                        completionDate: "2023-01-02T11:45:00Z",
                    },
                    {
                        id: "step-3",
                        title: "Functions in KODEON",
                        type: "tutorial",
                        completed: false,
                        estimatedTime: 60, // minutes
                    },
                    {
                        id: "step-4",
                        title: "Control Flow",
                        type: "tutorial",
                        completed: false,
                        estimatedTime: 60,
                    },
                    {
                        id: "step-5",
                        title: "Hello World Challenge",
                        type: "challenge",
                        completed: false,
                        estimatedTime: 15,
                    },
                    {
                        id: "step-6",
                        title: "Calculator Challenge",
                        type: "challenge",
                        completed: false,
                        estimatedTime: 45,
                    },
                    {
                        id: "step-7",
                        title: "Data Structures",
                        type: "tutorial",
                        completed: false,
                        estimatedTime: 90,
                    },
                    {
                        id: "step-8",
                        title: "To-Do List Challenge",
                        type: "challenge",
                        completed: false,
                        estimatedTime: 90,
                    },
                ],
            };
        } catch (error) {
            console.error("Error loading current path:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        if (!this.currentPath) {
            container.innerHTML =
                "<p>No learning path available. Start by taking a skill assessment.</p>";
            return;
        }

        // Create the learning path visualization
        const pathElement = document.createElement("div");
        pathElement.className = "learning-path";
        pathElement.innerHTML = `
      <div class="path-header">
        <h3>${this.currentPath.title}</h3>
        <p>${this.currentPath.description}</p>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${
                this.currentPath.completionPercentage
            }%"></div>
          </div>
          <div class="progress-text">${
              this.currentPath.completionPercentage
          }% Complete</div>
        </div>
      </div>
      <div class="path-steps">
        ${this.renderSteps()}
      </div>
      <div class="path-actions">
        <button id="next-step-btn" class="btn btn-primary">Continue to Next Step</button>
        <button id="view-all-paths-btn" class="btn btn-secondary">View All Paths</button>
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(pathElement);

        // Add event listeners
        this.attachEventListeners();
    }

    renderSteps() {
        if (!this.currentPath || !this.currentPath.steps) {
            return "<p>No steps available</p>";
        }

        return this.currentPath.steps
            .map((step, index) => {
                const isCurrent = index === this.currentPath.currentStep;
                const isCompleted = step.completed;
                const statusClass = isCompleted
                    ? "completed"
                    : isCurrent
                    ? "current"
                    : "pending";
                const statusIcon = isCompleted ? "✓" : isCurrent ? "→" : "○";

                return `
        <div class="path-step ${statusClass}" data-step-id="${step.id}">
          <div class="step-indicator">
            <span class="step-status">${statusIcon}</span>
          </div>
          <div class="step-content">
            <div class="step-title">${step.title}</div>
            <div class="step-type">${step.type}</div>
            ${
                step.estimatedTime
                    ? `<div class="step-time">${step.estimatedTime} min</div>`
                    : ""
            }
            ${
                step.completionDate
                    ? `<div class="step-date">Completed: ${new Date(
                          step.completionDate
                      ).toLocaleDateString()}</div>`
                    : ""
            }
          </div>
        </div>
      `;
            })
            .join("");
    }

    attachEventListeners() {
        const nextStepBtn = document.getElementById("next-step-btn");
        if (nextStepBtn) {
            nextStepBtn.addEventListener("click", () => {
                this.continueToNextStep();
            });
        }

        const viewAllPathsBtn = document.getElementById("view-all-paths-btn");
        if (viewAllPathsBtn) {
            viewAllPathsBtn.addEventListener("click", () => {
                this.viewAllPaths();
            });
        }

        // Add click listeners to steps
        const steps = document.querySelectorAll(".path-step");
        steps.forEach((step) => {
            step.addEventListener("click", (e) => {
                const stepId = step.getAttribute("data-step-id");
                this.navigateToStep(stepId);
            });
        });
    }

    continueToNextStep() {
        if (!this.currentPath) return;

        // Find the next incomplete step
        const nextStep = this.currentPath.steps.find((step) => !step.completed);
        if (nextStep) {
            this.navigateToStep(nextStep.id);
        } else {
            // All steps completed
            alert("Congratulations! You have completed this learning path.");
        }
    }

    navigateToStep(stepId) {
        // In a real implementation, this would navigate to the specific tutorial or challenge
        const step = this.currentPath.steps.find((s) => s.id === stepId);
        if (step) {
            alert(`Navigating to: ${step.title}\nType: ${step.type}`);
            // Here you would actually navigate to the tutorial or challenge
        }
    }

    viewAllPaths() {
        // In a real implementation, this would show all available learning paths
        alert("Viewing all learning paths");
        // Here you would display a modal or navigate to the paths page
    }

    async updatePathProgress(stepId, progress) {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        // Update the local path data
        const step = this.currentPath.steps.find((s) => s.id === stepId);
        if (step) {
            step.userProgress = progress;
            if (progress >= 100) {
                step.completed = true;
                step.completionDate = new Date().toISOString();
            }

            // Update overall completion
            const completedSteps = this.currentPath.steps.filter(
                (s) => s.completed
            ).length;
            this.currentPath.completionPercentage = Math.round(
                (completedSteps / this.currentPath.totalSteps) * 100
            );
            this.currentPath.currentStep = Math.min(
                this.currentPath.currentStep + 1,
                this.currentPath.totalSteps - 1
            );

            // Re-render the component
            this.render();

            // In a real implementation, you would also update the backend
            try {
                // await window.electronAPI.updatePathProgress(this.userId, stepId, progress);
                console.log(
                    `Progress updated for step ${stepId}: ${progress}%`
                );
            } catch (error) {
                console.error("Error updating path progress:", error);
            }
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.currentPath = null;
        this.userId = null;
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .learning-path {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .path-header h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.5em;
  }

  .path-header p {
    margin: 0 0 20px 0;
    color: #666;
  }

  .progress-container {
    margin-bottom: 20px;
  }

  .progress-bar {
    width: 100%;
    height: 12px;
    background-color: #e9ecef;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 8px;
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

  .path-steps {
    margin-bottom: 20px;
  }

  .path-step {
    display: flex;
    align-items: center;
    padding: 15px;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .path-step:hover {
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }

  .path-step.completed {
    background-color: #d4edda;
    border-left: 4px solid #28a745;
  }

  .path-step.current {
    background-color: #cce5ff;
    border-left: 4px solid #007bff;
  }

  .path-step.pending {
    background-color: #fff;
    border-left: 4px solid #ddd;
  }

  .step-indicator {
    margin-right: 15px;
  }

  .step-status {
    font-size: 1.2em;
    font-weight: bold;
  }

  .completed .step-status {
    color: #28a745;
  }

  .current .step-status {
    color: #007bff;
  }

  .pending .step-status {
    color: #ccc;
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
  }

  .step-type {
    font-size: 0.85em;
    color: #666;
    margin-bottom: 3px;
  }

  .step-time {
    font-size: 0.8em;
    color: #888;
    margin-bottom: 3px;
  }

  .step-date {
    font-size: 0.8em;
    color: #888;
  }

  .path-actions {
    display: flex;
    gap: 10px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
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
`;

document.head.appendChild(style);

module.exports = LearningPathComponent;
