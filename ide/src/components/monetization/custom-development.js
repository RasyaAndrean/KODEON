// Custom Development Services Component for KODEON IDE
class CustomDevelopment {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.projects = [];
    }

    async initialize() {
        this.isInitialized = true;

        // Load user data and projects
        await this.loadUserData();
        await this.loadProjects();

        // Render the component
        this.render();

        console.log('Custom development component initialized');
    }

    destroy() {
        this.isInitialized = false;
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
        console.log('Custom development component destroyed');
    }

    async loadUserData() {
        try {
            this.userAccount = await window.electronAPI.getUserAccount();
        } catch (error) {
            console.error('Error loading user data:', error);
            // Use mock data for demonstration
            this.userAccount = {
                id: 'user-123',
                email: 'user@example.com',
                name: 'KODEON Developer',
                subscription: {
                    planId: 'team',
                    status: 'active'
                }
            };
        }
    }

    async loadProjects() {
        try {
            // In a real implementation, this would call the monetization service
            // For now, we'll use mock data
            this.projects = [
                {
                    id: 'project-001',
                    name: 'E-commerce Platform',
                    description: 'Custom e-commerce solution with payment integration',
                    status: 'in-progress',
                    budget: 15000,
                    timeline: '3 months',
                    createdAt: '2025-08-15T10:30:00Z'
                },
                {
                    id: 'project-002',
                    name: 'Data Analytics Dashboard',
                    description: 'Real-time analytics dashboard for business intelligence',
                    status: 'completed',
                    budget: 8000,
                    timeline: '6 weeks',
                    createdAt: '2025-07-01T09:15:00Z'
                },
                {
                    id: 'project-003',
                    name: 'Mobile App Integration',
                    description: 'Mobile app integration with existing web platform',
                    status: 'pending',
                    budget: 12000,
                    timeline: '2 months',
                    createdAt: '2025-09-10T14:20:00Z'
                }
            ];
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="custom-development-container">
                <div class="development-header">
                    <h2>Custom Development Services</h2>
                    <button id="new-project-btn" class="btn btn-primary">Request Custom Development</button>
                </div>
                
                <div class="development-content">
                    <div class="projects-section">
                        <h3>Your Custom Development Projects</h3>
                        <div id="projects-list" class="projects-list">
                            ${this.renderProjectsList()}
                        </div>
                    </div>
                    
                    <div class="services-info">
                        <div class="service-packages">
                            <h3>Development Service Packages</h3>
                            <div class="package-card">
                                <h4>Language Feature Development</h4>
                                <p>Custom language features and syntax extensions</p>
                                <p>Integration with existing codebase</p>
                                <p>Performance optimization</p>
                                <p class="price">From $150/hour</p>
                            </div>
                            
                            <div class="package-card">
                                <h4>System Integration</h4>
                                <p>Integration with proprietary systems</p>
                                <p>API development and documentation</p>
                                <p>Data migration services</p>
                                <p class="price">From $150/hour</p>
                            </div>
                            
                            <div class="package-card highlighted">
                                <h4>White-label Solutions</h4>
                                <p>Fully customized KODEON implementations</p>
                                <p>Branding and UI customization</p>
                                <p>Dedicated support and maintenance</p>
                                <p class="price">From $200/hour</p>
                            </div>
                            
                            <div class="package-card">
                                <h4>Legacy System Migration</h4>
                                <p>Migration from legacy systems to KODEON</p>
                                <p>Code conversion and optimization</p>
                                <p>Training and documentation</p>
                                <p class="price">From $180/hour</p>
                            </div>
                        </div>
                        
                        <div class="development-process">
                            <h3>Our Development Process</h3>
                            <div class="process-steps">
                                <div class="step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h4>Requirements Gathering</h4>
                                        <p>Deep dive into your needs and objectives</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h4>Proposal & Estimation</h4>
                                        <p>Detailed project plan with timeline and costs</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h4>Development & Testing</h4>
                                        <p>Agile development with regular updates</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <h4>Deployment & Support</h4>
                                        <p>Production deployment and ongoing support</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="project-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Request Custom Development</h3>
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            <form id="project-form">
                                <div class="form-group">
                                    <label for="project-name">Project Name</label>
                                    <input type="text" id="project-name" class="form-control" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="project-description">Project Description</label>
                                    <textarea id="project-description" class="form-control" rows="4" required placeholder="Describe your custom development needs..."></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="project-type">Project Type</label>
                                    <select id="project-type" class="form-control">
                                        <option value="language-feature">Language Feature Development</option>
                                        <option value="integration">System Integration</option>
                                        <option value="white-label">White-label Solution</option>
                                        <option value="migration">Legacy System Migration</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="project-timeline">Expected Timeline</label>
                                    <select id="project-timeline" class="form-control">
                                        <option value="1-month">1 month</option>
                                        <option value="2-months">2 months</option>
                                        <option value="3-months">3 months</option>
                                        <option value="6-months">6 months</option>
                                        <option value="custom">Custom timeline</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="project-budget">Estimated Budget (USD)</label>
                                    <input type="number" id="project-budget" class="form-control" min="1000" step="1000" placeholder="Enter estimated budget">
                                </div>
                                
                                <div class="form-group">
                                    <label for="project-requirements">Detailed Requirements</label>
                                    <textarea id="project-requirements" class="form-control" rows="6" placeholder="Provide detailed technical requirements, constraints, and expectations..."></textarea>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" id="cancel-project-btn" class="btn btn-secondary">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderProjectsList() {
        if (this.projects.length === 0) {
            return '<p class="no-projects">You have no custom development projects yet.</p>';
        }

        return this.projects.map(project => `
            <div class="project-item" data-project-id="${project.id}">
                <div class="project-header">
                    <h4>${project.name}</h4>
                    <span class="project-status ${project.status}">${project.status}</span>
                </div>
                <div class="project-details">
                    <p>${project.description}</p>
                    <div class="project-meta">
                        <span class="project-budget">Budget: $${project.budget.toLocaleString()}</span>
                        <span class="project-timeline">Timeline: ${project.timeline}</span>
                        <span class="project-date">Created: ${new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // New project button
        const newProjectBtn = document.getElementById('new-project-btn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => {
                this.showNewProjectModal();
            });
        }

        // Close modal
        const closeBtn = document.querySelector('#project-modal .close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideNewProjectModal();
            });
        }

        // Cancel project button
        const cancelProjectBtn = document.getElementById('cancel-project-btn');
        if (cancelProjectBtn) {
            cancelProjectBtn.addEventListener('click', () => {
                this.hideNewProjectModal();
            });
        }

        // Project form submission
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitProjectRequest();
            });
        }

        // Project item clicks
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.getAttribute('data-project-id');
                this.showProjectDetails(projectId);
            });
        });
    }

    showNewProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hideNewProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Clear form
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.reset();
        }
    }

    async submitProjectRequest() {
        const name = document.getElementById('project-name').value;
        const description = document.getElementById('project-description').value;
        const type = document.getElementById('project-type').value;
        const timeline = document.getElementById('project-timeline').value;
        const budget = document.getElementById('project-budget').value;
        const requirements = document.getElementById('project-requirements').value;

        // In a real implementation, this would call the monetization service
        console.log('Submitting project request:', { name, description, type, timeline, budget, requirements });

        // Show success message
        alert('Custom development request submitted successfully! Our team will contact you within 2 business days to discuss your project.');

        // Hide modal and reset form
        this.hideNewProjectModal();

        // Refresh projects list
        await this.loadProjects();
        const projectsList = document.getElementById('projects-list');
        if (projectsList) {
            projectsList.innerHTML = this.renderProjectsList();
            this.attachEventListeners();
        }
    }

    showProjectDetails(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        // Create modal for project details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'project-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${project.name}</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="project-info">
                        <div class="project-meta-details">
                            <span class="project-status ${project.status}">${project.status}</span>
                            <span class="project-budget">Budget: $${project.budget.toLocaleString()}</span>
                            <span class="project-timeline">Timeline: ${project.timeline}</span>
                            <span>Created: ${new Date(project.createdAt).toLocaleString()}</span>
                        </div>
                        
                        <div class="project-description">
                            <h4>Description</h4>
                            <p>${project.description}</p>
                        </div>
                        
                        <div class="project-actions">
                            <button class="btn btn-primary">Contact Project Manager</button>
                            <button class="btn btn-secondary">View Progress Reports</button>
                            <button class="btn btn-secondary">Update Requirements</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Attach event listeners for the details modal
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }

        // Add event listeners for action buttons
        const actionButtons = modal.querySelectorAll('.project-actions .btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('Action functionality would be implemented here');
            });
        });
    }
}

module.exports = CustomDevelopment;