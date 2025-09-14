// Workspaces Panel Component for KODEON IDE
class WorkspacesPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.currentWorkspace = null;
    this.workspaces = [];
    this.isInitialized = false;
  }

  async initialize() {
    this.isInitialized = true;
    
    // Load workspaces
    await this.loadWorkspaces();
    
    // Render the component
    this.render();
    
    console.log('Workspaces panel initialized');
  }

  async loadWorkspaces() {
    if (!this.isInitialized) {
      throw new Error('Component not initialized');
    }
    
    try {
      // In a real implementation, this would call the collaboration system
      // For now, we'll simulate workspaces
      this.workspaces = [
        {
          id: 'workspace-1',
          name: 'Team Alpha',
          description: 'Main development team workspace',
          members: 3,
          projects: 2,
          lastActive: '2023-01-01T10:30:00Z'
        },
        {
          id: 'workspace-2',
          name: 'Personal Projects',
          description: 'My personal coding projects',
          members: 1,
          projects: 5,
          lastActive: '2023-01-02T14:20:00Z'
        }
      ];
      
      // Set current workspace
      this.currentWorkspace = this.workspaces[0];
    } catch (error) {
      console.error('Error loading workspaces:', error);
    }
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with ID ${this.containerId} not found`);
      return;
    }
    
    // Create the workspaces panel
    const panelElement = document.createElement('div');
    panelElement.className = 'workspaces-panel';
    panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Workspaces</h3>
        <button id="create-workspace-btn" class="btn btn-primary">Create Workspace</button>
      </div>
      <div class="workspaces-list">
        ${this.renderWorkspaces()}
      </div>
      ${this.currentWorkspace ? `
        <div class="current-workspace">
          <h4>Current Workspace: ${this.currentWorkspace.name}</h4>
          <div class="workspace-details">
            <div class="detail-item">
              <span class="detail-label">Members:</span>
              <span class="detail-value">${this.currentWorkspace.members}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Projects:</span>
              <span class="detail-value">${this.currentWorkspace.projects}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Active:</span>
              <span class="detail-value">${new Date(this.currentWorkspace.lastActive).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="workspace-actions">
            <button id="invite-members-btn" class="btn btn-secondary">Invite Members</button>
            <button id="manage-projects-btn" class="btn btn-secondary">Manage Projects</button>
          </div>
        </div>
      ` : ''}
    `;
    
    container.innerHTML = '';
    container.appendChild(panelElement);
    
    // Add event listeners
    this.attachEventListeners();
  }

  renderWorkspaces() {
    if (!this.workspaces || this.workspaces.length === 0) {
      return '<p class="no-workspaces">No workspaces found. Create your first workspace!</p>';
    }
    
    return this.workspaces.map(workspace => `
      <div class="workspace-item ${this.currentWorkspace && this.currentWorkspace.id === workspace.id ? 'active' : ''}" 
           data-workspace-id="${workspace.id}">
        <div class="workspace-info">
          <h5>${workspace.name}</h5>
          <p>${workspace.description}</p>
        </div>
        <div class="workspace-meta">
          <span class="meta-item">${workspace.members} members</span>
          <span class="meta-item">${workspace.projects} projects</span>
        </div>
      </div>
    `).join('');
  }

  attachEventListeners() {
    const createWorkspaceBtn = document.getElementById('create-workspace-btn');
    if (createWorkspaceBtn) {
      createWorkspaceBtn.addEventListener('click', () => {
        this.showCreateWorkspaceForm();
      });
    }
    
    const inviteMembersBtn = document.getElementById('invite-members-btn');
    if (inviteMembersBtn) {
      inviteMembersBtn.addEventListener('click', () => {
        this.showInviteMembersForm();
      });
    }
    
    const manageProjectsBtn = document.getElementById('manage-projects-btn');
    if (manageProjectsBtn) {
      manageProjectsBtn.addEventListener('click', () => {
        this.showManageProjectsForm();
      });
    }
    
    // Add click listeners to workspace items
    const workspaceItems = document.querySelectorAll('.workspace-item');
    workspaceItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const workspaceId = item.getAttribute('data-workspace-id');
        this.switchWorkspace(workspaceId);
      });
    });
  }

  showCreateWorkspaceForm() {
    // Create a modal for workspace creation
    const modal = document.createElement('div');
    modal.className = 'workspace-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Create New Workspace</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="create-workspace-form">
            <div class="form-group">
              <label for="workspace-name">Workspace Name</label>
              <input type="text" id="workspace-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="workspace-description">Description</label>
              <textarea id="workspace-description" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="workspace-visibility">Visibility</label>
              <select id="workspace-visibility" class="form-control">
                <option value="private">Private</option>
                <option value="team">Team</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Workspace</button>
              <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for modal
    const closeModal = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('#create-workspace-form');
    
    const closeHandler = () => {
      document.body.removeChild(modal);
    };
    
    closeModal.addEventListener('click', closeHandler);
    cancelBtn.addEventListener('click', closeHandler);
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.createWorkspace();
      closeHandler();
    });
  }

  async createWorkspace() {
    const name = document.getElementById('workspace-name').value;
    const description = document.getElementById('workspace-description').value;
    const visibility = document.getElementById('workspace-visibility').value;
    
    // In a real implementation, this would call the collaboration system
    const newWorkspace = {
      id: `workspace-${Date.now()}`,
      name: name,
      description: description,
      members: 1,
      projects: 0,
      lastActive: new Date().toISOString()
    };
    
    this.workspaces.push(newWorkspace);
    this.currentWorkspace = newWorkspace;
    this.render();
    
    console.log('New workspace created:', newWorkspace);
  }

  showInviteMembersForm() {
    if (!this.currentWorkspace) return;
    
    // Create a modal for inviting members
    const modal = document.createElement('div');
    modal.className = 'workspace-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Invite Members to ${this.currentWorkspace.name}</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="invite-members-form">
            <div class="form-group">
              <label for="invite-email">Email Address</label>
              <input type="email" id="invite-email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="invite-role">Role</label>
              <select id="invite-role" class="form-control">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Send Invitation</button>
              <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for modal
    const closeModal = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('#invite-members-form');
    
    const closeHandler = () => {
      document.body.removeChild(modal);
    };
    
    closeModal.addEventListener('click', closeHandler);
    cancelBtn.addEventListener('click', closeHandler);
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.inviteMember();
      closeHandler();
    });
  }

  async inviteMember() {
    const email = document.getElementById('invite-email').value;
    const role = document.getElementById('invite-role').value;
    
    // In a real implementation, this would call the collaboration system
    console.log(`Inviting ${email} as ${role} to workspace ${this.currentWorkspace.id}`);
    
    // Update workspace member count
    this.currentWorkspace.members += 1;
    this.render();
    
    alert(`Invitation sent to ${email}`);
  }

  showManageProjectsForm() {
    if (!this.currentWorkspace) return;
    
    // Create a modal for managing projects
    const modal = document.createElement('div');
    modal.className = 'workspace-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Manage Projects in ${this.currentWorkspace.name}</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="projects-list">
            <div class="project-item">
              <div class="project-info">
                <h5>Project Alpha</h5>
                <p>Main application development</p>
              </div>
              <button class="btn btn-danger remove-project-btn" data-project-id="project-1">Remove</button>
            </div>
            <div class="project-item">
              <div class="project-info">
                <h5>Project Beta</h5>
                <p>Experimental features</p>
              </div>
              <button class="btn btn-danger remove-project-btn" data-project-id="project-2">Remove</button>
            </div>
          </div>
          <div class="form-group">
            <label for="add-project">Add Project</label>
            <select id="add-project" class="form-control">
              <option value="">Select a project to add</option>
              <option value="project-3">Project Gamma</option>
              <option value="project-4">Project Delta</option>
            </select>
          </div>
          <div class="form-actions">
            <button id="add-project-btn" class="btn btn-primary">Add Project</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for modal
    const closeModal = modal.querySelector('.close-modal');
    const closeHandler = () => {
      document.body.removeChild(modal);
    };
    
    closeModal.addEventListener('click', closeHandler);
    
    // Add event listener for add project button
    const addProjectBtn = modal.querySelector('#add-project-btn');
    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', () => {
        const projectId = document.getElementById('add-project').value;
        if (projectId) {
          this.addProject(projectId);
          closeHandler();
        }
      });
    }
    
    // Add event listeners for remove project buttons
    const removeProjectBtns = modal.querySelectorAll('.remove-project-btn');
    removeProjectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = btn.getAttribute('data-project-id');
        this.removeProject(projectId);
      });
    });
  }

  async addProject(projectId) {
    // In a real implementation, this would call the collaboration system
    console.log(`Adding project ${projectId} to workspace ${this.currentWorkspace.id}`);
    
    // Update workspace project count
    this.currentWorkspace.projects += 1;
    this.render();
    
    alert('Project added successfully');
  }

  async removeProject(projectId) {
    // In a real implementation, this would call the collaboration system
    console.log(`Removing project ${projectId} from workspace ${this.currentWorkspace.id}`);
    
    // Update workspace project count
    this.currentWorkspace.projects = Math.max(0, this.currentWorkspace.projects - 1);
    this.render();
    
    alert('Project removed successfully');
  }

  async switchWorkspace(workspaceId) {
    const workspace = this.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      this.currentWorkspace = workspace;
      this.render();
      
      // In a real implementation, this would update the collaboration system
      console.log(`Switched to workspace: ${workspace.name}`);
    }
  }

  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }
    
    this.isInitialized = false;
    this.currentWorkspace = null;
    this.workspaces = [];
  }
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
  .workspaces-panel {
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
  
  .workspaces-list {
    margin-bottom: 30px;
  }
  
  .workspace-item {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
  }
  
  .workspace-item:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
  
  .workspace-item.active {
    border-left: 4px solid #007bff;
    background-color: #f8f9fa;
  }
  
  .workspace-info h5 {
    margin: 0 0 5px 0;
    color: #333;
  }
  
  .workspace-info p {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 0.9em;
  }
  
  .workspace-meta {
    display: flex;
    gap: 15px;
  }
  
  .meta-item {
    font-size: 0.8em;
    color: #888;
  }
  
  .current-workspace {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }
  
  .current-workspace h4 {
    margin: 0 0 15px 0;
    color: #333;
  }
  
  .workspace-details {
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
  
  .workspace-actions {
    display: flex;
    gap: 10px;
  }
  
  .no-workspaces {
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
  
  .workspace-modal {
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
  
  .projects-list {
    margin-bottom: 20px;
  }
  
  .project-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .project-info h5 {
    margin: 0 0 5px 0;
    color: #333;
  }
  
  .project-info p {
    margin: 0;
    color: #666;
    font-size: 0.9em;
  }
`;

document.head.appendChild(style);

module.exports = WorkspacesPanel;