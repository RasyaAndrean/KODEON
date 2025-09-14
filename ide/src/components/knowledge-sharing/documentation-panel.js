// Documentation Panel Component for KODEON IDE
class DocumentationPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentDocument = null;
        this.documents = [];
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;

        // Load documents
        await this.loadDocuments();

        // Render the component
        this.render();

        console.log("Documentation panel initialized");
    }

    async loadDocuments() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the knowledge sharing service
            // For now, we'll simulate documents
            this.documents = [
                {
                    id: "doc-1",
                    title: "Getting Started with KODEON",
                    author: "KODEON Team",
                    createdAt: "2023-01-01T10:00:00Z",
                    updatedAt: "2023-01-01T10:00:00Z",
                    tags: ["beginner", "tutorial"],
                    versions: [
                        {
                            id: "v1",
                            version: 1,
                            content: "Initial version of the document",
                            author: "KODEON Team",
                            createdAt: "2023-01-01T10:00:00Z",
                        },
                    ],
                },
                {
                    id: "doc-2",
                    title: "Advanced Concurrency Patterns",
                    author: "Community Contributor",
                    createdAt: "2023-01-05T14:30:00Z",
                    updatedAt: "2023-01-06T09:15:00Z",
                    tags: ["advanced", "concurrency"],
                    versions: [
                        {
                            id: "v1",
                            version: 1,
                            content: "Initial version of the document",
                            author: "Community Contributor",
                            createdAt: "2023-01-05T14:30:00Z",
                        },
                        {
                            id: "v2",
                            version: 2,
                            content: "Updated version with more examples",
                            author: "Community Contributor",
                            createdAt: "2023-01-06T09:15:00Z",
                        },
                    ],
                },
                {
                    id: "doc-3",
                    title: "Web Development with KODEON",
                    author: "KODEON Team",
                    createdAt: "2023-01-10T11:20:00Z",
                    updatedAt: "2023-01-10T11:20:00Z",
                    tags: ["web", "frontend"],
                    versions: [
                        {
                            id: "v1",
                            version: 1,
                            content: "Initial version of the document",
                            author: "KODEON Team",
                            createdAt: "2023-01-10T11:20:00Z",
                        },
                    ],
                },
            ];

            // Set current document
            this.currentDocument = this.documents[0];
        } catch (error) {
            console.error("Error loading documents:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the documentation panel
        const panelElement = document.createElement("div");
        panelElement.className = "documentation-panel";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Documentation</h3>
        <button id="create-doc-btn" class="btn btn-primary">Create Document</button>
      </div>
      <div class="search-bar">
        <input type="text" id="doc-search" placeholder="Search documentation...">
        <button id="search-doc-btn" class="btn btn-secondary">Search</button>
      </div>
      <div class="documents-list">
        ${this.renderDocuments()}
      </div>
      ${
          this.currentDocument
              ? `
        <div class="current-document">
          <h4>${this.currentDocument.title}</h4>
          <div class="document-meta">
            <span>Author: ${this.currentDocument.author}</span>
            <span>Updated: ${new Date(
                this.currentDocument.updatedAt
            ).toLocaleDateString()}</span>
            ${
                this.currentDocument.versions &&
                this.currentDocument.versions.length > 1
                    ? `<span>Versions: ${this.currentDocument.versions.length}</span>`
                    : ""
            }
          </div>
          ${
              this.currentDocument.versions &&
              this.currentDocument.versions.length > 1
                  ? `
            <div class="version-control">
              <label for="version-select">Version:</label>
              <select id="version-select">
                ${this.currentDocument.versions
                    .map(
                        (version) =>
                            `<option value="${version.id}">v${
                                version.version
                            } - ${new Date(
                                version.createdAt
                            ).toLocaleDateString()}</option>`
                    )
                    .join("")}
              </select>
              <button id="compare-versions-btn" class="btn btn-secondary">Compare</button>
            </div>
          `
                  : ""
          }
          <div class="document-content">
            <p>This is the content of the documentation document. In a real implementation, this would show the full content of the document.</p>
            <p>KODEON documentation uses a wiki-style format that allows community members to contribute and improve content over time.</p>
          </div>
          <div class="document-actions">
            <button id="edit-doc-btn" class="btn btn-secondary">Edit Document</button>
            <button id="delete-doc-btn" class="btn btn-danger">Delete Document</button>
            ${
                this.currentDocument.versions &&
                this.currentDocument.versions.length > 1
                    ? '<button id="view-history-btn" class="btn btn-secondary">View History</button>'
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

    renderDocuments() {
        if (!this.documents || this.documents.length === 0) {
            return '<p class="no-documents">No documents found. Create your first document!</p>';
        }

        return this.documents
            .map(
                (document) => `
      <div class="document-item ${
          this.currentDocument && this.currentDocument.id === document.id
              ? "active"
              : ""
      }"
           data-document-id="${document.id}">
        <div class="document-info">
          <h5>${document.title}</h5>
          <div class="document-meta">
            <span>by ${document.author}</span>
            <span>${new Date(document.updatedAt).toLocaleDateString()}</span>
            ${
                document.versions && document.versions.length > 1
                    ? `<span>${document.versions.length} versions</span>`
                    : ""
            }
          </div>
        </div>
        <div class="document-tags">
          ${document.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
        </div>
      </div>
    `
            )
            .join("");
    }

    attachEventListeners() {
        const createDocBtn = document.getElementById("create-doc-btn");
        if (createDocBtn) {
            createDocBtn.addEventListener("click", () => {
                this.showCreateDocumentForm();
            });
        }

        const searchDocBtn = document.getElementById("search-doc-btn");
        if (searchDocBtn) {
            searchDocBtn.addEventListener("click", () => {
                this.searchDocuments();
            });
        }

        const editDocBtn = document.getElementById("edit-doc-btn");
        if (editDocBtn) {
            editDocBtn.addEventListener("click", () => {
                this.showEditDocumentForm();
            });
        }

        const deleteDocBtn = document.getElementById("delete-doc-btn");
        if (deleteDocBtn) {
            deleteDocBtn.addEventListener("click", () => {
                this.deleteDocument();
            });
        }

        const viewHistoryBtn = document.getElementById("view-history-btn");
        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener("click", () => {
                this.showDocumentHistory();
            });
        }

        const versionSelect = document.getElementById("version-select");
        if (versionSelect) {
            versionSelect.addEventListener("change", () => {
                this.switchVersion(versionSelect.value);
            });
        }

        const compareVersionsBtn = document.getElementById(
            "compare-versions-btn"
        );
        if (compareVersionsBtn) {
            compareVersionsBtn.addEventListener("click", () => {
                this.compareVersions();
            });
        }

        // Add click listeners to document items
        const documentItems = document.querySelectorAll(".document-item");
        documentItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                const documentId = item.getAttribute("data-document-id");
                this.switchDocument(documentId);
            });
        });
    }

    showCreateDocumentForm() {
        // Create a modal for document creation
        const modal = document.createElement("div");
        modal.className = "documentation-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Create New Document</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="create-document-form">
            <div class="form-group">
              <label for="document-title">Title</label>
              <input type="text" id="document-title" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="document-content">Content</label>
              <textarea id="document-content" class="form-control" rows="10"></textarea>
            </div>
            <div class="form-group">
              <label for="document-tags">Tags (comma separated)</label>
              <input type="text" id="document-tags" class="form-control" placeholder="beginner, tutorial, web">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Document</button>
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
        const form = modal.querySelector("#create-document-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.createDocument();
            closeHandler();
        });
    }

    async createDocument() {
        const title = document.getElementById("document-title").value;
        const content = document.getElementById("document-content").value;
        const tagsInput = document.getElementById("document-tags").value;
        const tags = tagsInput
            ? tagsInput.split(",").map((tag) => tag.trim())
            : [];

        // In a real implementation, this would call the knowledge sharing service
        const newDocument = {
            id: `doc-${Date.now()}`,
            title: title,
            content: content,
            author: "Current User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: tags,
            versions: [
                {
                    id: `v-${Date.now()}`,
                    version: 1,
                    content: content,
                    author: "Current User",
                    createdAt: new Date().toISOString(),
                },
            ],
        };

        this.documents.push(newDocument);
        this.currentDocument = newDocument;
        this.render();

        console.log("New document created:", newDocument);
    }

    async searchDocuments() {
        const query = document.getElementById("doc-search").value;

        // In a real implementation, this would call the knowledge sharing service
        // For now, we'll filter the existing documents
        if (query) {
            this.documents = this.documents.filter(
                (doc) =>
                    doc.title.toLowerCase().includes(query.toLowerCase()) ||
                    doc.tags.some((tag) =>
                        tag.toLowerCase().includes(query.toLowerCase())
                    )
            );
        } else {
            // Reload all documents
            await this.loadDocuments();
        }

        this.render();
    }

    showEditDocumentForm() {
        if (!this.currentDocument) return;

        // Create a modal for document editing
        const modal = document.createElement("div");
        modal.className = "documentation-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Edit Document</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="edit-document-form">
            <div class="form-group">
              <label for="edit-document-title">Title</label>
              <input type="text" id="edit-document-title" class="form-control" value="${
                  this.currentDocument.title
              }" required>
            </div>
            <div class="form-group">
              <label for="edit-document-content">Content</label>
              <textarea id="edit-document-content" class="form-control" rows="10">This is the content of the documentation document. In a real implementation, this would show the full content of the document.

KODEON documentation uses a wiki-style format that allows community members to contribute and improve content over time.</textarea>
            </div>
            <div class="form-group">
              <label for="edit-document-tags">Tags (comma separated)</label>
              <input type="text" id="edit-document-tags" class="form-control" value="${this.currentDocument.tags.join(
                  ", "
              )}" placeholder="beginner, tutorial, web">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Changes</button>
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
        const form = modal.querySelector("#edit-document-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.editDocument();
            closeHandler();
        });
    }

    async editDocument() {
        if (!this.currentDocument) return;

        const title = document.getElementById("edit-document-title").value;
        const content = document.getElementById("edit-document-content").value;
        const tagsInput = document.getElementById("edit-document-tags").value;
        const tags = tagsInput
            ? tagsInput.split(",").map((tag) => tag.trim())
            : [];

        // Create a new version
        const newVersion = {
            id: `v-${Date.now()}`,
            version: this.currentDocument.versions.length + 1,
            content: content,
            author: "Current User",
            createdAt: new Date().toISOString(),
        };

        // Update the current document
        this.currentDocument.title = title;
        this.currentDocument.content = content;
        this.currentDocument.tags = tags;
        this.currentDocument.updatedAt = new Date().toISOString();
        this.currentDocument.versions.push(newVersion);

        this.render();

        console.log("Document updated:", this.currentDocument);
    }

    async deleteDocument() {
        if (!this.currentDocument) return;

        if (confirm("Are you sure you want to delete this document?")) {
            // In a real implementation, this would call the knowledge sharing service
            this.documents = this.documents.filter(
                (doc) => doc.id !== this.currentDocument.id
            );
            this.currentDocument =
                this.documents.length > 0 ? this.documents[0] : null;
            this.render();

            console.log("Document deleted");
        }
    }

    async switchDocument(documentId) {
        const document = this.documents.find((d) => d.id === documentId);
        if (document) {
            this.currentDocument = document;
            this.render();

            // In a real implementation, this would update the knowledge sharing service
            console.log(`Switched to document: ${document.title}`);
        }
    }

    async switchVersion(versionId) {
        if (!this.currentDocument) return;

        const version = this.currentDocument.versions.find(
            (v) => v.id === versionId
        );
        if (version) {
            // In a real implementation, this would update the displayed content to match the selected version
            console.log(`Switched to version: ${versionId}`);
        }
    }

    showDocumentHistory() {
        if (!this.currentDocument || !this.currentDocument.versions) return;

        // Create a modal for document history
        const modal = document.createElement("div");
        modal.className = "documentation-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Document History: ${this.currentDocument.title}</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="history-list">
            ${this.currentDocument.versions
                .map(
                    (version) => `
              <div class="history-item">
                <div class="history-info">
                  <h5>Version ${version.version}</h5>
                  <p>Author: ${version.author}</p>
                  <p>Date: ${new Date(version.createdAt).toLocaleString()}</p>
                </div>
                <div class="history-actions">
                  <button class="btn btn-secondary view-version-btn" data-version-id="${
                      version.id
                  }">View</button>
                </div>
              </div>
            `
                )
                .join("")}
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

        // Add click listeners to view version buttons
        const viewVersionBtns = modal.querySelectorAll(".view-version-btn");
        viewVersionBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const versionId = btn.getAttribute("data-version-id");
                this.viewVersion(versionId);
                closeHandler();
            });
        });
    }

    viewVersion(versionId) {
        if (!this.currentDocument) return;

        const version = this.currentDocument.versions.find(
            (v) => v.id === versionId
        );
        if (version) {
            // In a real implementation, this would display the content of the selected version
            alert(`Viewing version ${version.version} of ${
                this.currentDocument.title
            }

Author: ${version.author}
Date: ${new Date(version.createdAt).toLocaleString()}

Content:
${version.content}`);
        }
    }

    compareVersions() {
        if (
            !this.currentDocument ||
            !this.currentDocument.versions ||
            this.currentDocument.versions.length < 2
        )
            return;

        // In a real implementation, this would show a comparison between versions
        alert(
            "In a real implementation, this would show a comparison between versions of the document."
        );
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.currentDocument = null;
        this.documents = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .documentation-panel {
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

  .documents-list {
    margin-bottom: 30px;
  }

  .document-item {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
  }

  .document-item:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }

  .document-item.active {
    border-left: 4px solid #007bff;
    background-color: #f8f9fa;
  }

  .document-info h5 {
    margin: 0 0 5px 0;
    color: #333;
  }

  .document-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #666;
    margin-bottom: 10px;
  }

  .document-tags {
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

  .current-document {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  .current-document h4 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .document-content {
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .document-content p {
    margin: 0 0 15px 0;
  }

  .document-actions {
    display: flex;
    gap: 10px;
  }

  .version-control {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }

  .version-control label {
    font-weight: bold;
    color: #555;
  }

  .version-control select {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .history-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }

  .history-item:last-child {
    border-bottom: none;
  }

  .history-info h5 {
    margin: 0 0 5px 0;
    color: #333;
  }

  .history-info p {
    margin: 0 0 3px 0;
    font-size: 0.9em;
    color: #666;
  }

  .no-documents {
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

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background-color: #c82333;
  }

  .documentation-modal {
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
`;

document.head.appendChild(style);

module.exports = DocumentationPanel;
