// Projects Panel Component for KODEON IDE
class ProjectsPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentProject = null;
        this.projects = [];
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;

        // Load projects
        await this.loadProjects();

        // Render the component
        this.render();

        console.log("Projects panel initialized");
    }

    async loadProjects() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the knowledge sharing service
            // For now, we'll simulate projects
            this.projects = [
                {
                    id: "proj-1",
                    name: "Todo List Application",
                    description:
                        "A simple todo list application built with KODEON",
                    author: "KODEON Team",
                    createdAt: "2023-01-03T09:15:00Z",
                    tags: ["web", "beginner"],
                    downloads: 42,
                    rating: 4.5,
                },
                {
                    id: "proj-2",
                    name: "Real-time Chat App",
                    description:
                        "A real-time chat application using KODEON concurrency features",
                    author: "Community Contributor",
                    createdAt: "2023-01-07T14:30:00Z",
                    tags: ["web", "concurrency", "advanced"],
                    downloads: 28,
                    rating: 4.8,
                },
                {
                    id: "proj-3",
                    name: "Data Visualization Dashboard",
                    description:
                        "Interactive dashboard for visualizing data with charts and graphs",
                    author: "Data Science Team",
                    createdAt: "2023-01-12T11:45:00Z",
                    tags: ["data", "visualization", "web"],
                    downloads: 15,
                    rating: 4.2,
                },
            ];

            // Set current project
            this.currentProject = this.projects[0];
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the projects panel
        const panelElement = document.createElement("div");
        panelElement.className = "projects-panel";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Community Projects</h3>
        <button id="share-project-btn" class="btn btn-primary">Share Project</button>
      </div>
      <div class="search-bar">
        <input type="text" id="projects-search" placeholder="Search projects...">
        <button id="search-projects-btn" class="btn btn-secondary">Search</button>
      </div>
      <div class="projects-list">
        ${this.renderProjects()}
      </div>
      ${
          this.currentProject
              ? `
        <div class="current-project">
          <h4>${this.currentProject.name}</h4>
          <div class="project-meta">
            <span>by ${this.currentProject.author}</span>
            <span>Published: ${new Date(
                this.currentProject.createdAt
            ).toLocaleDateString()}</span>
          </div>
          <div class="project-description">
            <p>${this.currentProject.description}</p>
          </div>
          <div class="project-tags">
            ${this.currentProject.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("")}
          </div>
          <div class="project-stats">
            <div class="stat">
              <span class="stat-label">Downloads:</span>
              <span class="stat-value">${this.currentProject.downloads}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Rating:</span>
              <span class="stat-value">${this.renderRating(
                  this.currentProject.rating
              )}</span>
            </div>
          </div>
          <div class="project-actions">
            <button id="download-project-btn" class="btn btn-primary">Download Project</button>
            <button id="rate-project-btn" class="btn btn-secondary">Rate Project</button>
          </div>
        </div>
      `
              : ""
      }
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    renderProjects() {
        if (!this.projects || this.projects.length === 0) {
            return '<p class="no-projects">No projects found. Share your first project!</p>';
        }

        return this.projects
            .map(
                (project) => `
      <div class="project-item ${
          this.currentProject && this.currentProject.id === project.id
              ? "active"
              : ""
      }"
           data-project-id="${project.id}">
        <div class="project-info">
          <h5>${project.name}</h5>
          <p>${project.description}</p>
          <div class="project-meta">
            <span>by ${project.author}</span>
            <span>${new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="project-stats">
          <div class="stat">
            <span class="stat-label">Downloads:</span>
            <span class="stat-value">${project.downloads}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Rating:</span>
            <span class="stat-value">${this.renderRating(project.rating)}</span>
          </div>
        </div>
        <div class="project-tags">
          ${project.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
        </div>
      </div>
    `
            )
            .join("");
    }

    renderRating(rating) {
        // Render star rating
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let stars = "";
        for (let i = 0; i < fullStars; i++) {
            stars += "★";
        }
        if (halfStar) {
            stars += "☆"; // Half star representation
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += "☆";
        }

        return `${stars} (${rating})`;
    }

    attachEventListeners() {
        const shareProjectBtn = document.getElementById("share-project-btn");
        if (shareProjectBtn) {
            shareProjectBtn.addEventListener("click", () => {
                this.showShareProjectForm();
            });
        }

        const searchProjectsBtn = document.getElementById(
            "search-projects-btn"
        );
        if (searchProjectsBtn) {
            searchProjectsBtn.addEventListener("click", () => {
                this.searchProjects();
            });
        }

        const downloadProjectBtn = document.getElementById(
            "download-project-btn"
        );
        if (downloadProjectBtn) {
            downloadProjectBtn.addEventListener("click", () => {
                this.downloadProject();
            });
        }

        const rateProjectBtn = document.getElementById("rate-project-btn");
        if (rateProjectBtn) {
            rateProjectBtn.addEventListener("click", () => {
                this.showRateProjectForm();
            });
        }

        // Add click listeners to project items
        const projectItems = document.querySelectorAll(".project-item");
        projectItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                const projectId = item.getAttribute("data-project-id");
                this.switchProject(projectId);
            });
        });
    }

    showShareProjectForm() {
        // Create a modal for sharing a project
        const modal = document.createElement("div");
        modal.className = "projects-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Share Your Project</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="share-project-form">
            <div class="form-group">
              <label for="project-name">Project Name</label>
              <input type="text" id="project-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="project-description">Description</label>
              <textarea id="project-description" class="form-control" rows="5" placeholder="Describe your project and what it does"></textarea>
            </div>
            <div class="form-group">
              <label for="project-tags">Tags (comma separated)</label>
              <input type="text" id="project-tags" class="form-control" placeholder="web, beginner, data, etc.">
            </div>
            <div class="form-group">
              <label for="project-files">Project Files</label>
              <input type="file" id="project-files" class="form-control" multiple>
              <small class="form-text">Select the files you want to share with your project</small>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Share Project</button>
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
        const form = modal.querySelector("#share-project-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.shareProject();
            closeHandler();
        });
    }

    async shareProject() {
        const name = document.getElementById("project-name").value;
        const description = document.getElementById(
            "project-description"
        ).value;
        const tagsInput = document.getElementById("project-tags").value;
        const tags = tagsInput
            ? tagsInput.split(",").map((tag) => tag.trim())
            : [];

        // In a real implementation, this would call the knowledge sharing service
        const newProject = {
            id: `proj-${Date.now()}`,
            name: name,
            description: description,
            author: "Current User",
            createdAt: new Date().toISOString(),
            tags: tags,
            downloads: 0,
            rating: 0,
        };

        this.projects.push(newProject);
        this.currentProject = newProject;
        this.render();

        console.log("New project shared:", newProject);
    }

    async searchProjects() {
        const query = document.getElementById("projects-search").value;

        // In a real implementation, this would call the knowledge sharing service
        // For now, we'll filter the existing projects
        if (query) {
            this.projects = this.projects.filter(
                (proj) =>
                    proj.name.toLowerCase().includes(query.toLowerCase()) ||
                    proj.description
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    proj.tags.some((tag) =>
                        tag.toLowerCase().includes(query.toLowerCase())
                    )
            );
        } else {
            // Reload all projects
            await this.loadProjects();
        }

        this.render();
    }

    async downloadProject() {
        if (!this.currentProject) return;

        // In a real implementation, this would call the knowledge sharing service
        this.currentProject.downloads += 1;
        this.render();

        // Simulate download
        alert(
            `Downloading project: ${this.currentProject.name}\n\nIn a real implementation, this would download the project files.`
        );

        console.log("Project downloaded:", this.currentProject.id);
    }

    showRateProjectForm() {
        if (!this.currentProject) return;

        // Create a modal for rating a project
        const modal = document.createElement("div");
        modal.className = "projects-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Rate Project: ${this.currentProject.name}</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="rate-project-form">
            <div class="form-group">
              <label for="project-rating">Rating (1-5 stars)</label>
              <div class="rating-input">
                <input type="radio" id="star5" name="rating" value="5">
                <label for="star5">★</label>
                <input type="radio" id="star4" name="rating" value="4">
                <label for="star4">★</label>
                <input type="radio" id="star3" name="rating" value="3">
                <label for="star3">★</label>
                <input type="radio" id="star2" name="rating" value="2">
                <label for="star2">★</label>
                <input type="radio" id="star1" name="rating" value="1">
                <label for="star1">★</label>
              </div>
            </div>
            <div class="form-group">
              <label for="rating-comment">Comment (optional)</label>
              <textarea id="rating-comment" class="form-control" rows="3" placeholder="Share your experience with this project"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Submit Rating</button>
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
        const form = modal.querySelector("#rate-project-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.rateProject();
            closeHandler();
        });
    }

    async rateProject() {
        if (!this.currentProject) return;

        const rating = document.querySelector('input[name="rating"]:checked');
        if (!rating) {
            alert("Please select a rating.");
            return;
        }

        const ratingValue = parseInt(rating.value);

        // In a real implementation, this would call the knowledge sharing service
        this.currentProject.rating = ratingValue;
        this.render();

        console.log("Project rated:", this.currentProject.id, ratingValue);
    }

    async switchProject(projectId) {
        const project = this.projects.find((p) => p.id === projectId);
        if (project) {
            this.currentProject = project;
            this.render();

            // In a real implementation, this would update the knowledge sharing service
            console.log(`Switched to project: ${project.name}`);
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.currentProject = null;
        this.projects = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .projects-panel {
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

  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .search-bar input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
  }

  .projects-list {
    margin-bottom: 30px;
  }

  .project-item {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
  }

  .project-item:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }

  .project-item.active {
    border-left: 4px solid #007bff;
    background-color: #f8f9fa;
  }

  .project-info h5 {
    margin: 0 0 5px 0;
    color: #333;
  }

  .project-info p {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 0.9em;
  }

  .project-meta {
    display: flex;
    gap: 15px;
    font-size: 0.8em;
    color: #666;
    margin-bottom: 10px;
  }

  .project-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
  }

  .stat {
    display: flex;
    gap: 5px;
  }

  .stat-label {
    font-weight: bold;
    color: #555;
  }

  .stat-value {
    color: #333;
  }

  .project-tags {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .tag {
    background-color: #e9ecef;
    color: #495057;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8em;
  }

  .current-project {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  .current-project h4 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .project-description {
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .project-description p {
    margin: 0 0 15px 0;
  }

  .project-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }

  .no-projects {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 20px;
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

  .projects-modal {
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
    max-width: 600px;
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

  .form-text {
    font-size: 0.8em;
    color: #666;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .rating-input {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  .rating-input input[type="radio"] {
    display: none;
  }

  .rating-input label {
    font-size: 2em;
    color: #ddd;
    cursor: pointer;
  }

  .rating-input label:hover,
  .rating-input label:hover ~ label,
  .rating-input input[type="radio"]:checked ~ label {
    color: #ffc107;
  }
`;

document.head.appendChild(style);

module.exports = ProjectsPanel;
