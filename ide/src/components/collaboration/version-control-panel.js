// Version Control Panel Component for KODEON IDE
class VersionControlPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentRepository = null;
        this.repositories = [];
        this.branches = [];
        this.commits = [];
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;

        // Load repository data
        await this.loadRepositoryData();

        // Render the component
        this.render();

        console.log("Version control panel initialized");
    }

    async loadRepositoryData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the collaboration system
            // For now, we'll simulate repository data
            this.repositories = [
                {
                    id: "repo-1",
                    projectId: "project-1",
                    name: "project-alpha",
                    url: "https://github.com/team/project-alpha.git",
                    provider: "github",
                    branches: ["main", "feature-auth", "bugfix-login"],
                    currentBranch: "main",
                    lastSync: new Date().toISOString(),
                    settings: {
                        autoSync: true,
                        commitMessageTemplate: "KODEON: {message}",
                        pushOnCommit: false,
                    },
                },
            ];

            // Set current repository
            this.currentRepository = this.repositories[0];

            // Load branches for current repository
            this.branches = [
                {
                    id: "branch-main",
                    repoId: "repo-1",
                    name: "main",
                    commit: "abc123",
                    lastCommitAt: new Date().toISOString(),
                    protected: true,
                },
                {
                    id: "branch-feature",
                    repoId: "repo-1",
                    name: "feature-auth",
                    commit: "def456",
                    lastCommitAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    protected: false,
                },
                {
                    id: "branch-bugfix",
                    repoId: "repo-1",
                    name: "bugfix-login",
                    commit: "ghi789",
                    lastCommitAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    protected: false,
                },
            ];

            // Load commit history
            this.commits = [
                {
                    id: "commit-abc123",
                    repoId: "repo-1",
                    message: "Initial commit",
                    author: "user-admin",
                    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    files: ["main.kodeon"],
                },
                {
                    id: "commit-def456",
                    repoId: "repo-1",
                    message: "Add authentication feature",
                    author: "user-developer1",
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    files: ["auth.kodeon", "utils.kodeon"],
                },
                {
                    id: "commit-ghi789",
                    repoId: "repo-1",
                    message: "Fix login validation bug",
                    author: "user-developer2",
                    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    files: ["login.kodeon"],
                },
            ];
        } catch (error) {
            console.error("Error loading repository data:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the version control panel
        const panelElement = document.createElement("div");
        panelElement.className = "version-control-panel";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Version Control</h3>
        <div class="repo-actions">
          <button id="sync-repo-btn" class="btn btn-secondary">Sync</button>
          <button id="create-branch-btn" class="btn btn-primary">New Branch</button>
        </div>
      </div>
      ${
          this.currentRepository
              ? `
        <div class="repository-info">
          <div class="repo-details">
            <h4>${this.currentRepository.name}</h4>
            <p class="repo-url">${
                this.currentRepository.url || "Local repository"
            }</p>
          </div>
          <div class="repo-status">
            <div class="status-item">
              <span class="status-label">Current Branch:</span>
              <span class="status-value branch-current">${
                  this.currentRepository.currentBranch
              }</span>
            </div>
            <div class="status-item">
              <span class="status-label">Last Sync:</span>
              <span class="status-value">${new Date(
                  this.currentRepository.lastSync
              ).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div class="vcs-content">
          <div class="branches-section">
            <h5>Branches</h5>
            <div class="branches-list">
              ${this.renderBranches()}
            </div>
          </div>
          <div class="commits-section">
            <h5>Commit History</h5>
            <div class="commits-list">
              ${this.renderCommits()}
            </div>
          </div>
        </div>
        <div class="vcs-actions">
          <button id="commit-changes-btn" class="btn btn-primary">Commit Changes</button>
          <button id="create-pr-btn" class="btn btn-secondary">Create Pull Request</button>
        </div>
      `
              : `
        <div class="no-repository">
          <p>No repository found. Initialize a repository to get started.</p>
          <button id="init-repo-btn" class="btn btn-primary">Initialize Repository</button>
        </div>
      `
      }
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    renderBranches() {
        if (!this.branches || this.branches.length === 0) {
            return '<p class="no-branches">No branches found.</p>';
        }

        return this.branches
            .map(
                (branch) => `
      <div class="branch-item ${
          this.currentRepository &&
          this.currentRepository.currentBranch === branch.name
              ? "active"
              : ""
      }"
           data-branch-name="${branch.name}">
        <div class="branch-info">
          <span class="branch-name">${branch.name}</span>
          ${
              branch.protected
                  ? '<span class="branch-protected">Protected</span>'
                  : ""
          }
        </div>
        <div class="branch-meta">
          <span class="meta-item">${new Date(
              branch.lastCommitAt
          ).toLocaleDateString()}</span>
        </div>
      </div>
    `
            )
            .join("");
    }

    renderCommits() {
        if (!this.commits || this.commits.length === 0) {
            return '<p class="no-commits">No commits found.</p>';
        }

        return this.commits
            .map(
                (commit) => `
      <div class="commit-item" data-commit-id="${commit.id}">
        <div class="commit-header">
          <span class="commit-message">${commit.message}</span>
          <span class="commit-author">${commit.author}</span>
        </div>
        <div class="commit-meta">
          <span class="commit-date">${new Date(
              commit.timestamp
          ).toLocaleString()}</span>
          <span class="commit-id">${commit.id.substring(0, 7)}</span>
        </div>
        ${
            commit.files && commit.files.length > 0
                ? `
          <div class="commit-files">
            <span class="files-label">Files:</span>
            <span class="files-list">${commit.files.join(", ")}</span>
          </div>
        `
                : ""
        }
      </div>
    `
            )
            .join("");
    }

    attachEventListeners() {
        const initRepoBtn = document.getElementById("init-repo-btn");
        if (initRepoBtn) {
            initRepoBtn.addEventListener("click", () => {
                this.showInitRepoForm();
            });
        }

        const syncRepoBtn = document.getElementById("sync-repo-btn");
        if (syncRepoBtn) {
            syncRepoBtn.addEventListener("click", () => {
                this.syncRepository();
            });
        }

        const createBranchBtn = document.getElementById("create-branch-btn");
        if (createBranchBtn) {
            createBranchBtn.addEventListener("click", () => {
                this.showCreateBranchForm();
            });
        }

        const commitChangesBtn = document.getElementById("commit-changes-btn");
        if (commitChangesBtn) {
            commitChangesBtn.addEventListener("click", () => {
                this.showCommitForm();
            });
        }

        const createPrBtn = document.getElementById("create-pr-btn");
        if (createPrBtn) {
            createPrBtn.addEventListener("click", () => {
                this.showCreatePullRequestForm();
            });
        }

        // Add click listeners to branch items
        const branchItems = document.querySelectorAll(".branch-item");
        branchItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                const branchName = item.getAttribute("data-branch-name");
                this.switchBranch(branchName);
            });
        });
    }

    showInitRepoForm() {
        // Create a modal for repository initialization
        const modal = document.createElement("div");
        modal.className = "vcs-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Initialize Repository</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="init-repo-form">
            <div class="form-group">
              <label for="repo-name">Repository Name</label>
              <input type="text" id="repo-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="repo-provider">Provider</label>
              <select id="repo-provider" class="form-control">
                <option value="local">Local</option>
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="bitbucket">Bitbucket</option>
              </select>
            </div>
            <div class="form-group">
              <label for="repo-url">Repository URL (optional)</label>
              <input type="text" id="repo-url" class="form-control" placeholder="https://github.com/user/repo.git">
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="auto-sync" checked> Auto-sync with remote
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Initialize Repository</button>
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
        const form = modal.querySelector("#init-repo-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.initRepository();
            closeHandler();
        });
    }

    async initRepository() {
        const name = document.getElementById("repo-name").value;
        const provider = document.getElementById("repo-provider").value;
        const url = document.getElementById("repo-url").value;
        const autoSync = document.getElementById("auto-sync").checked;

        // In a real implementation, this would call the collaboration system
        const newRepo = {
            id: `repo-${Date.now()}`,
            projectId: "project-1",
            name: name,
            url: url || null,
            provider: provider,
            branches: ["main"],
            currentBranch: "main",
            lastSync: new Date().toISOString(),
            settings: {
                autoSync: autoSync,
                commitMessageTemplate: "KODEON: {message}",
                pushOnCommit: false,
            },
        };

        this.repositories.push(newRepo);
        this.currentRepository = newRepo;

        // Add main branch
        const mainBranch = {
            id: `branch-${newRepo.id}-main`,
            repoId: newRepo.id,
            name: "main",
            commit: null,
            lastCommitAt: new Date().toISOString(),
            protected: true,
        };

        this.branches = [mainBranch];
        this.commits = [];

        this.render();

        console.log("Repository initialized:", newRepo);
    }

    async syncRepository() {
        if (!this.currentRepository) return;

        // In a real implementation, this would call the collaboration system
        this.currentRepository.lastSync = new Date().toISOString();
        this.render();

        console.log(`Repository ${this.currentRepository.name} synced`);
        alert("Repository synced successfully");
    }

    showCreateBranchForm() {
        if (!this.currentRepository) return;

        // Create a modal for branch creation
        const modal = document.createElement("div");
        modal.className = "vcs-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Create New Branch</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="create-branch-form">
            <div class="form-group">
              <label for="branch-name">Branch Name</label>
              <input type="text" id="branch-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="source-branch">Source Branch</label>
              <select id="source-branch" class="form-control">
                ${this.branches
                    .map(
                        (branch) =>
                            `<option value="${branch.name}" ${
                                branch.name ===
                                this.currentRepository.currentBranch
                                    ? "selected"
                                    : ""
                            }>${branch.name}</option>`
                    )
                    .join("")}
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Branch</button>
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
        const form = modal.querySelector("#create-branch-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.createBranch();
            closeHandler();
        });
    }

    async createBranch() {
        const branchName = document.getElementById("branch-name").value;
        const sourceBranch = document.getElementById("source-branch").value;

        // In a real implementation, this would call the collaboration system
        const newBranch = {
            id: `branch-${this.currentRepository.id}-${branchName.replace(
                /\//g,
                "-"
            )}`,
            repoId: this.currentRepository.id,
            name: branchName,
            commit: null, // Would be set to source branch commit
            lastCommitAt: new Date().toISOString(),
            protected: false,
        };

        this.branches.push(newBranch);
        this.currentRepository.branches.push(branchName);

        this.render();

        console.log(`Branch ${branchName} created from ${sourceBranch}`);
        alert(`Branch ${branchName} created successfully`);
    }

    async switchBranch(branchName) {
        if (!this.currentRepository) return;

        // In a real implementation, this would call the collaboration system
        this.currentRepository.currentBranch = branchName;
        this.render();

        console.log(`Switched to branch: ${branchName}`);
        alert(`Switched to branch: ${branchName}`);
    }

    showCommitForm() {
        if (!this.currentRepository) return;

        // Create a modal for committing changes
        const modal = document.createElement("div");
        modal.className = "vcs-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Commit Changes</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="commit-form">
            <div class="form-group">
              <label for="commit-message">Commit Message</label>
              <textarea id="commit-message" class="form-control" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="push-commit" ${
                    this.currentRepository.settings.pushOnCommit
                        ? "checked"
                        : ""
                }>
                Push to remote after commit
              </label>
            </div>
            <div class="changed-files">
              <h5>Changed Files</h5>
              <div class="file-item">
                <label>
                  <input type="checkbox" checked> main.kodeon
                </label>
              </div>
              <div class="file-item">
                <label>
                  <input type="checkbox" checked> auth.kodeon
                </label>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Commit</button>
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
        const form = modal.querySelector("#commit-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.commitChanges();
            closeHandler();
        });
    }

    async commitChanges() {
        const message = document.getElementById("commit-message").value;
        const pushCommit = document.getElementById("push-commit").checked;

        // In a real implementation, this would call the collaboration system
        const newCommit = {
            id: `commit-${Date.now()}`,
            repoId: this.currentRepository.id,
            message: message,
            author: "current-user", // Would be actual user ID
            timestamp: new Date().toISOString(),
            files: ["main.kodeon", "auth.kodeon"], // Would be actual changed files
        };

        this.commits.unshift(newCommit); // Add to beginning of array
        this.currentRepository.lastSync = new Date().toISOString();

        // Update branch commit reference
        const currentBranch = this.branches.find(
            (b) =>
                b.repoId === this.currentRepository.id &&
                b.name === this.currentRepository.currentBranch
        );

        if (currentBranch) {
            currentBranch.commit = newCommit.id;
            currentBranch.lastCommitAt = new Date().toISOString();
        }

        this.render();

        console.log("Changes committed:", newCommit);
        alert("Changes committed successfully");

        if (pushCommit && this.currentRepository.url) {
            console.log("Pushing to remote repository...");
            alert("Changes pushed to remote repository");
        }
    }

    showCreatePullRequestForm() {
        if (!this.currentRepository) return;

        // Create a modal for creating a pull request
        const modal = document.createElement("div");
        modal.className = "vcs-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Create Pull Request</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="create-pr-form">
            <div class="form-group">
              <label for="pr-title">Title</label>
              <input type="text" id="pr-title" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="pr-description">Description</label>
              <textarea id="pr-description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="source-branch-pr">Source Branch</label>
              <select id="source-branch-pr" class="form-control">
                ${this.branches
                    .filter((b) => b.name !== "main")
                    .map(
                        (branch) =>
                            `<option value="${branch.name}">${branch.name}</option>`
                    )
                    .join("")}
              </select>
            </div>
            <div class="form-group">
              <label for="target-branch-pr">Target Branch</label>
              <select id="target-branch-pr" class="form-control">
                <option value="main">main</option>
              </select>
            </div>
            <div class="form-group">
              <label for="pr-reviewers">Reviewers (comma separated user IDs)</label>
              <input type="text" id="pr-reviewers" class="form-control" placeholder="user1, user2">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Pull Request</button>
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
        const form = modal.querySelector("#create-pr-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.createPullRequest();
            closeHandler();
        });
    }

    async createPullRequest() {
        const title = document.getElementById("pr-title").value;
        const description = document.getElementById("pr-description").value;
        const sourceBranch = document.getElementById("source-branch-pr").value;
        const targetBranch = document.getElementById("target-branch-pr").value;
        const reviewersInput = document.getElementById("pr-reviewers").value;

        const reviewers = reviewersInput
            ? reviewersInput.split(",").map((r) => r.trim())
            : [];

        // In a real implementation, this would call the collaboration system
        const pullRequest = {
            id: `pr-${Date.now()}`,
            repoId: this.currentRepository.id,
            title: title,
            description: description,
            sourceBranch: sourceBranch,
            targetBranch: targetBranch,
            author: "current-user", // Would be actual user ID
            status: "open",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            reviewers: reviewers,
        };

        console.log("Pull request created:", pullRequest);
        alert("Pull request created successfully");
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.currentRepository = null;
        this.repositories = [];
        this.branches = [];
        this.commits = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .version-control-panel {
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

  .repo-actions {
    display: flex;
    gap: 10px;
  }

  .repository-info {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 20px;
  }

  .repo-details h4 {
    margin: 0 0 5px 0;
    color: #333;
  }

  .repo-url {
    margin: 0;
    color: #666;
    font-size: 0.9em;
  }

  .repo-status {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .status-label {
    font-weight: bold;
    color: #555;
  }

  .status-value {
    color: #333;
  }

  .branch-current {
    color: #007bff;
    font-weight: bold;
  }

  .vcs-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .vcs-content {
      grid-template-columns: 1fr;
    }
  }

  .branches-section, .commits-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  .branches-section h5, .commits-section h5 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .branch-item {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 12px 15px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .branch-item:hover {
    background-color: #e9ecef;
  }

  .branch-item.active {
    background-color: #d1ecf1;
    border-left: 3px solid #007bff;
  }

  .branch-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .branch-name {
    font-weight: bold;
    color: #333;
  }

  .branch-protected {
    background-color: #ffc107;
    color: #212529;
    font-size: 0.7em;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .branch-meta .meta-item {
    font-size: 0.8em;
    color: #888;
  }

  .commit-item {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 15px;
  }

  .commit-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .commit-message {
    font-weight: bold;
    color: #333;
  }

  .commit-author {
    color: #007bff;
    font-size: 0.9em;
  }

  .commit-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 0.8em;
    color: #888;
  }

  .commit-id {
    font-family: monospace;
  }

  .commit-files {
    font-size: 0.8em;
    color: #666;
  }

  .files-label {
    font-weight: bold;
  }

  .files-list {
    color: #333;
  }

  .vcs-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .no-repository {
    text-align: center;
    padding: 40px 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .no-repository p {
    color: #888;
    margin-bottom: 20px;
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

  .vcs-modal {
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

  .changed-files {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }

  .changed-files h5 {
    margin: 0 0 10px 0;
    color: #333;
  }

  .file-item {
    margin-bottom: 8px;
  }

  .file-item label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
`;

document.head.appendChild(style);

module.exports = VersionControlPanel;
