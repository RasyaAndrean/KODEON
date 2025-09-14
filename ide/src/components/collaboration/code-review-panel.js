// Code Review Panel Component for KODEON IDE
class CodeReviewPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentReview = null;
        this.reviews = [];
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;

        // Load reviews
        await this.loadReviews();

        // Render the component
        this.render();

        console.log("Code review panel initialized");
    }

    async loadReviews() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the collaboration system
            // For now, we'll simulate reviews
            this.reviews = [
                {
                    id: "review-1",
                    projectId: "project-1",
                    title: "Authentication Feature Review",
                    description:
                        "Review of the new authentication implementation",
                    author: "user-admin",
                    reviewers: ["user-developer1", "user-developer2"],
                    status: "pending",
                    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                    comments: 3,
                    files: ["main.kodeon", "auth.kodeon"],
                },
                {
                    id: "review-2",
                    projectId: "project-1",
                    title: "UI Component Refactor",
                    description: "Review of refactored UI components",
                    author: "user-developer1",
                    reviewers: ["user-admin"],
                    status: "approved",
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
                    comments: 1,
                    files: ["ui-components.kodeon"],
                },
            ];

            // Set current review
            this.currentReview = this.reviews[0];
        } catch (error) {
            console.error("Error loading reviews:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the code review panel
        const panelElement = document.createElement("div");
        panelElement.className = "code-review-panel";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Code Reviews</h3>
        <button id="create-review-btn" class="btn btn-primary">Create Review</button>
      </div>
      <div class="reviews-list">
        ${this.renderReviews()}
      </div>
      ${
          this.currentReview
              ? `
        <div class="current-review">
          <h4>${this.currentReview.title}</h4>
          <div class="review-details">
            <div class="detail-item">
              <span class="detail-label">Status:</span>
              <span class="detail-value status-${this.currentReview.status}">${
                    this.currentReview.status
                }</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Author:</span>
              <span class="detail-value">${this.currentReview.author}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Reviewers:</span>
              <span class="detail-value">${this.currentReview.reviewers.join(
                  ", "
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Files:</span>
              <span class="detail-value">${this.currentReview.files.join(
                  ", "
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Comments:</span>
              <span class="detail-value">${this.currentReview.comments}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Created:</span>
              <span class="detail-value">${new Date(
                  this.currentReview.createdAt
              ).toLocaleDateString()}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Updated:</span>
              <span class="detail-value">${new Date(
                  this.currentReview.updatedAt
              ).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="review-description">
            <h5>Description</h5>
            <p>${
                this.currentReview.description || "No description provided"
            }</p>
          </div>
          <div class="review-actions">
            <button id="view-comments-btn" class="btn btn-secondary">View Comments</button>
            <button id="add-reviewer-btn" class="btn btn-secondary">Add Reviewer</button>
            ${
                this.currentReview.status === "pending"
                    ? `
              <button id="approve-review-btn" class="btn btn-success">Approve</button>
              <button id="request-changes-btn" class="btn btn-warning">Request Changes</button>
            `
                    : ""
            }
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

    renderReviews() {
        if (!this.reviews || this.reviews.length === 0) {
            return '<p class="no-reviews">No code reviews found. Create your first review!</p>';
        }

        return this.reviews
            .map(
                (review) => `
      <div class="review-item ${
          this.currentReview && this.currentReview.id === review.id
              ? "active"
              : ""
      }"
           data-review-id="${review.id}">
        <div class="review-info">
          <h5>${review.title}</h5>
          <p>${review.description || "No description"}</p>
        </div>
        <div class="review-meta">
          <span class="meta-item status-${review.status}">${
                    review.status
                }</span>
          <span class="meta-item">${review.comments} comments</span>
          <span class="meta-item">${new Date(
              review.updatedAt
          ).toLocaleDateString()}</span>
        </div>
      </div>
    `
            )
            .join("");
    }

    attachEventListeners() {
        const createReviewBtn = document.getElementById("create-review-btn");
        if (createReviewBtn) {
            createReviewBtn.addEventListener("click", () => {
                this.showCreateReviewForm();
            });
        }

        const viewCommentsBtn = document.getElementById("view-comments-btn");
        if (viewCommentsBtn) {
            viewCommentsBtn.addEventListener("click", () => {
                this.showCommentsModal();
            });
        }

        const addReviewerBtn = document.getElementById("add-reviewer-btn");
        if (addReviewerBtn) {
            addReviewerBtn.addEventListener("click", () => {
                this.showAddReviewerForm();
            });
        }

        const approveReviewBtn = document.getElementById("approve-review-btn");
        if (approveReviewBtn) {
            approveReviewBtn.addEventListener("click", () => {
                this.updateReviewStatus("approved");
            });
        }

        const requestChangesBtn = document.getElementById(
            "request-changes-btn"
        );
        if (requestChangesBtn) {
            requestChangesBtn.addEventListener("click", () => {
                this.updateReviewStatus("requested_changes");
            });
        }

        // Add click listeners to review items
        const reviewItems = document.querySelectorAll(".review-item");
        reviewItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                const reviewId = item.getAttribute("data-review-id");
                this.switchReview(reviewId);
            });
        });
    }

    showCreateReviewForm() {
        // Create a modal for review creation
        const modal = document.createElement("div");
        modal.className = "review-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Create New Code Review</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="create-review-form">
            <div class="form-group">
              <label for="review-title">Review Title</label>
              <input type="text" id="review-title" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="review-description">Description</label>
              <textarea id="review-description" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="review-files">Files to Review (comma separated)</label>
              <input type="text" id="review-files" class="form-control" placeholder="file1.kodeon, file2.kodeon">
            </div>
            <div class="form-group">
              <label for="review-reviewers">Reviewers (comma separated user IDs)</label>
              <input type="text" id="review-reviewers" class="form-control" placeholder="user1, user2">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Review</button>
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
        const form = modal.querySelector("#create-review-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.createReview();
            closeHandler();
        });
    }

    async createReview() {
        const title = document.getElementById("review-title").value;
        const description = document.getElementById("review-description").value;
        const filesInput = document.getElementById("review-files").value;
        const reviewersInput =
            document.getElementById("review-reviewers").value;

        const files = filesInput
            ? filesInput.split(",").map((f) => f.trim())
            : [];
        const reviewers = reviewersInput
            ? reviewersInput.split(",").map((r) => r.trim())
            : [];

        // In a real implementation, this would call the collaboration system
        const newReview = {
            id: `review-${Date.now()}`,
            projectId: "project-1",
            title: title,
            description: description,
            author: "current-user", // Would be actual user ID
            reviewers: reviewers,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: 0,
            files: files,
        };

        this.reviews.push(newReview);
        this.currentReview = newReview;
        this.render();

        console.log("New review created:", newReview);
    }

    showCommentsModal() {
        if (!this.currentReview) return;

        // Create a modal for viewing comments
        const modal = document.createElement("div");
        modal.className = "review-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Comments for "${this.currentReview.title}"</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="comments-section">
            <div class="comment-item">
              <div class="comment-header">
                <span class="comment-author">user-developer1</span>
                <span class="comment-date">${new Date(
                    Date.now() - 3600000
                ).toLocaleString()}</span>
              </div>
              <div class="comment-content">
                <p>Consider adding error handling for this function</p>
              </div>
              <div class="comment-replies">
                <div class="reply-item">
                  <div class="reply-header">
                    <span class="reply-author">user-admin</span>
                    <span class="reply-date">${new Date(
                        Date.now() - 1800000
                    ).toLocaleString()}</span>
                  </div>
                  <div class="reply-content">
                    <p>Good point, I'll add a try-catch block</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="add-comment-form">
            <h5>Add Comment</h5>
            <form id="add-comment-form">
              <div class="form-group">
                <label for="comment-content">Comment</label>
                <textarea id="comment-content" class="form-control" required></textarea>
              </div>
              <div class="form-group">
                <label for="comment-file">File (optional)</label>
                <select id="comment-file" class="form-control">
                  <option value="">Select a file</option>
                  ${this.currentReview.files
                      .map((file) => `<option value="${file}">${file}</option>`)
                      .join("")}
                </select>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Add Comment</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Add event listeners for modal
        const closeModal = modal.querySelector(".close-modal");
        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);

        // Add event listener for comment form
        const commentForm = modal.querySelector("#add-comment-form");
        if (commentForm) {
            commentForm.addEventListener("submit", (e) => {
                e.preventDefault();
                // In a real implementation, this would add the comment
                alert("Comment added successfully");
                closeHandler();
            });
        }
    }

    showAddReviewerForm() {
        if (!this.currentReview) return;

        // Create a modal for adding reviewers
        const modal = document.createElement("div");
        modal.className = "review-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Add Reviewer to "${this.currentReview.title}"</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="add-reviewer-form">
            <div class="form-group">
              <label for="reviewer-id">Reviewer User ID</label>
              <input type="text" id="reviewer-id" class="form-control" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Add Reviewer</button>
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
        const form = modal.querySelector("#add-reviewer-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.addReviewer();
            closeHandler();
        });
    }

    async addReviewer() {
        const reviewerId = document.getElementById("reviewer-id").value;

        // In a real implementation, this would call the collaboration system
        if (
            this.currentReview &&
            !this.currentReview.reviewers.includes(reviewerId)
        ) {
            this.currentReview.reviewers.push(reviewerId);
            this.currentReview.updatedAt = new Date().toISOString();
            this.render();

            console.log(
                `Added reviewer ${reviewerId} to review ${this.currentReview.id}`
            );
            alert(`Reviewer ${reviewerId} added successfully`);
        }
    }

    async updateReviewStatus(newStatus) {
        if (!this.currentReview) return;

        // In a real implementation, this would call the collaboration system
        this.currentReview.status = newStatus;
        this.currentReview.updatedAt = new Date().toISOString();
        this.render();

        console.log(`Updated review status to ${newStatus}`);
        alert(`Review status updated to ${newStatus}`);
    }

    async switchReview(reviewId) {
        const review = this.reviews.find((r) => r.id === reviewId);
        if (review) {
            this.currentReview = review;
            this.render();

            // In a real implementation, this would update the collaboration system
            console.log(`Switched to review: ${review.title}`);
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.currentReview = null;
        this.reviews = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .code-review-panel {
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

  .reviews-list {
    margin-bottom: 30px;
  }

  .review-item {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
  }

  .review-item:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }

  .review-item.active {
    border-left: 4px solid #007bff;
    background-color: #f8f9fa;
  }

  .review-info h5 {
    margin: 0 0 5px 0;
    color: #333;
  }

  .review-info p {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 0.9em;
  }

  .review-meta {
    display: flex;
    gap: 15px;
  }

  .meta-item {
    font-size: 0.8em;
    color: #888;
  }

  .status-pending {
    color: #ffc107;
    font-weight: bold;
  }

  .status-approved {
    color: #28a745;
    font-weight: bold;
  }

  .status-rejected {
    color: #dc3545;
    font-weight: bold;
  }

  .status-requested_changes {
    color: #fd7e14;
    font-weight: bold;
  }

  .current-review {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  .current-review h4 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .review-details {
    margin-bottom: 20px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .detail-label {
    font-weight: bold;
    color: #555;
  }

  .detail-value {
    color: #333;
  }

  .review-description {
    margin-bottom: 20px;
  }

  .review-description h5 {
    margin: 0 0 10px 0;
    color: #333;
  }

  .review-description p {
    margin: 0;
    color: #666;
  }

  .review-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .no-reviews {
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

  .btn-success {
    background-color: #28a745;
    color: white;
  }

  .btn-success:hover {
    background-color: #218838;
  }

  .btn-warning {
    background-color: #ffc107;
    color: #212529;
  }

  .btn-warning:hover {
    background-color: #e0a800;
  }

  .review-modal {
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

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .comments-section {
    margin-bottom: 20px;
  }

  .comment-item {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 15px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .comment-author {
    font-weight: bold;
    color: #007bff;
  }

  .comment-date {
    color: #888;
    font-size: 0.9em;
  }

  .comment-content p {
    margin: 0;
    color: #333;
  }

  .comment-replies {
    margin-top: 15px;
    padding-left: 20px;
    border-left: 2px solid #dee2e6;
  }

  .reply-item {
    background-color: white;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .reply-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .reply-author {
    font-weight: bold;
    color: #28a745;
  }

  .reply-date {
    color: #888;
    font-size: 0.8em;
  }

  .reply-content p {
    margin: 0;
    color: #333;
  }

  .add-comment-form {
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
`;

document.head.appendChild(style);

module.exports = CodeReviewPanel;
