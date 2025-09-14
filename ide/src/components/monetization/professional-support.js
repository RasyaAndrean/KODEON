// Professional Support Component for KODEON IDE
class ProfessionalSupport {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.supportTickets = [];
    }

    async initialize() {
        this.isInitialized = true;

        // Load user data and support tickets
        await this.loadUserData();
        await this.loadSupportTickets();

        // Render the component
        this.render();

        console.log("Professional support component initialized");
    }

    destroy() {
        this.isInitialized = false;
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }
        console.log("Professional support component destroyed");
    }

    async loadUserData() {
        try {
            this.userAccount = await window.electronAPI.getUserAccount();
        } catch (error) {
            console.error("Error loading user data:", error);
            // Use mock data for demonstration
            this.userAccount = {
                id: "user-123",
                email: "user@example.com",
                name: "KODEON Developer",
                subscription: {
                    planId: "pro",
                    status: "active",
                },
            };
        }
    }

    async loadSupportTickets() {
        try {
            // In a real implementation, this would call the monetization service
            // For now, we'll use mock data
            this.supportTickets = [
                {
                    id: "ticket-001",
                    subject: "Issue with debugging tools",
                    status: "open",
                    priority: "high",
                    createdAt: "2025-09-10T10:30:00Z",
                    lastUpdated: "2025-09-12T14:20:00Z",
                    messages: [
                        {
                            id: "msg-001",
                            sender: "user",
                            content:
                                "I'm having trouble with the debugging tools in the Pro version.",
                            timestamp: "2025-09-10T10:30:00Z",
                        },
                        {
                            id: "msg-002",
                            sender: "support",
                            content:
                                "Thank you for reaching out. Could you provide more details about the issue?",
                            timestamp: "2025-09-10T11:15:00Z",
                        },
                    ],
                },
                {
                    id: "ticket-002",
                    subject: "Feature request: Custom themes",
                    status: "resolved",
                    priority: "medium",
                    createdAt: "2025-09-05T09:15:00Z",
                    lastUpdated: "2025-09-08T16:45:00Z",
                    messages: [
                        {
                            id: "msg-003",
                            sender: "user",
                            content:
                                "It would be great to have more custom theme options in the IDE.",
                            timestamp: "2025-09-05T09:15:00Z",
                        },
                        {
                            id: "msg-004",
                            sender: "support",
                            content:
                                "Thank you for the suggestion. We've added this to our feature roadmap.",
                            timestamp: "2025-09-08T16:45:00Z",
                        },
                    ],
                },
            ];
        } catch (error) {
            console.error("Error loading support tickets:", error);
            this.supportTickets = [];
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="professional-support-container">
                <div class="support-header">
                    <h2>Professional Support</h2>
                    <button id="new-ticket-btn" class="btn btn-primary">New Support Ticket</button>
                </div>

                <div class="support-content">
                    <div class="tickets-section">
                        <h3>Your Support Tickets</h3>
                        <div id="tickets-list" class="tickets-list">
                            ${this.renderTicketsList()}
                        </div>
                    </div>

                    <div class="support-info">
                        <div class="support-plans">
                            <h3>Support Plans</h3>
                            <div class="plan-card">
                                <h4>Basic Support</h4>
                                <p>Community forums and documentation</p>
                                <p>Response time: 2-3 business days</p>
                                <p class="price">Free with all plans</p>
                            </div>

                            <div class="plan-card highlighted">
                                <h4>Priority Support</h4>
                                <p>Email and chat support</p>
                                <p>Response time: 4-8 hours</p>
                                <p>Priority bug fixes</p>
                                <p class="price">$100/hour</p>
                                ${
                                    this.userAccount.subscription.planId ===
                                        "pro" ||
                                    this.userAccount.subscription.planId ===
                                        "team"
                                        ? '<p class="plan-status">Included with your plan</p>'
                                        : '<button class="btn btn-secondary upgrade-btn">Upgrade to Access</button>'
                                }
                            </div>

                            <div class="plan-card">
                                <h4>24/7 Dedicated Support</h4>
                                <p>Phone, email, and chat support</p>
                                <p>Response time: 1-2 hours</p>
                                <p>Dedicated support engineer</p>
                                <p>SLA with 99.9% uptime guarantee</p>
                                <p class="price">$300/hour</p>
                                ${
                                    this.userAccount.subscription.planId ===
                                    "team"
                                        ? '<p class="plan-status">Included with your plan</p>'
                                        : '<button class="btn btn-secondary upgrade-btn">Upgrade to Access</button>'
                                }
                            </div>
                        </div>

                        <div class="support-resources">
                            <h3>Support Resources</h3>
                            <ul>
                                <li><a href="#" class="resource-link">Documentation</a></li>
                                <li><a href="#" class="resource-link">Knowledge Base</a></li>
                                <li><a href="#" class="resource-link">Video Tutorials</a></li>
                                <li><a href="#" class="resource-link">Community Forums</a></li>
                                <li><a href="#" class="resource-link">Release Notes</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div id="ticket-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Create New Support Ticket</h3>
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            <form id="ticket-form">
                                <div class="form-group">
                                    <label for="ticket-subject">Subject</label>
                                    <input type="text" id="ticket-subject" class="form-control" required>
                                </div>

                                <div class="form-group">
                                    <label for="ticket-priority">Priority</label>
                                    <select id="ticket-priority" class="form-control">
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="ticket-description">Description</label>
                                    <textarea id="ticket-description" class="form-control" rows="5" required></textarea>
                                </div>

                                <div class="form-actions">
                                    <button type="button" id="cancel-ticket-btn" class="btn btn-secondary">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Submit Ticket</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderTicketsList() {
        if (this.supportTickets.length === 0) {
            return '<p class="no-tickets">You have no support tickets yet.</p>';
        }

        return this.supportTickets
            .map(
                (ticket) => `
            <div class="ticket-item" data-ticket-id="${ticket.id}">
                <div class="ticket-header">
                    <h4>${ticket.subject}</h4>
                    <span class="ticket-status ${ticket.status}">${
                    ticket.status
                }</span>
                </div>
                <div class="ticket-details">
                    <span class="ticket-priority ${ticket.priority}">${
                    ticket.priority
                }</span>
                    <span class="ticket-date">Created: ${new Date(
                        ticket.createdAt
                    ).toLocaleDateString()}</span>
                </div>
            </div>
        `
            )
            .join("");
    }

    attachEventListeners() {
        // New ticket button
        const newTicketBtn = document.getElementById("new-ticket-btn");
        if (newTicketBtn) {
            newTicketBtn.addEventListener("click", () => {
                this.showNewTicketModal();
            });
        }

        // Close modal
        const closeBtn = document.querySelector("#ticket-modal .close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                this.hideNewTicketModal();
            });
        }

        // Cancel ticket button
        const cancelTicketBtn = document.getElementById("cancel-ticket-btn");
        if (cancelTicketBtn) {
            cancelTicketBtn.addEventListener("click", () => {
                this.hideNewTicketModal();
            });
        }

        // Ticket form submission
        const ticketForm = document.getElementById("ticket-form");
        if (ticketForm) {
            ticketForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.submitTicket();
            });
        }

        // Ticket item clicks
        const ticketItems = document.querySelectorAll(".ticket-item");
        ticketItems.forEach((item) => {
            item.addEventListener("click", () => {
                const ticketId = item.getAttribute("data-ticket-id");
                this.showTicketDetails(ticketId);
            });
        });

        // Upgrade buttons
        const upgradeButtons = document.querySelectorAll(".upgrade-btn");
        upgradeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // In a real implementation, this would open the upgrade panel
                alert("Upgrade functionality would be implemented here");
            });
        });
    }

    showNewTicketModal() {
        const modal = document.getElementById("ticket-modal");
        if (modal) {
            modal.style.display = "block";
        }
    }

    hideNewTicketModal() {
        const modal = document.getElementById("ticket-modal");
        if (modal) {
            modal.style.display = "none";
        }

        // Clear form
        const ticketForm = document.getElementById("ticket-form");
        if (ticketForm) {
            ticketForm.reset();
        }
    }

    async submitTicket() {
        const subject = document.getElementById("ticket-subject").value;
        const priority = document.getElementById("ticket-priority").value;
        const description = document.getElementById("ticket-description").value;

        // In a real implementation, this would call the monetization service
        console.log("Submitting ticket:", { subject, priority, description });

        // Show success message
        alert(
            "Support ticket submitted successfully! Our team will respond within 24 hours."
        );

        // Hide modal and reset form
        this.hideNewTicketModal();

        // Refresh tickets list
        await this.loadSupportTickets();
        const ticketsList = document.getElementById("tickets-list");
        if (ticketsList) {
            ticketsList.innerHTML = this.renderTicketsList();
            this.attachEventListeners();
        }
    }

    showTicketDetails(ticketId) {
        const ticket = this.supportTickets.find((t) => t.id === ticketId);
        if (!ticket) return;

        // Create modal for ticket details
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "ticket-details-modal";
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${ticket.subject}</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="ticket-info">
                        <div class="ticket-meta">
                            <span class="ticket-status ${ticket.status}">${
            ticket.status
        }</span>
                            <span class="ticket-priority ${ticket.priority}">${
            ticket.priority
        }</span>
                            <span>Created: ${new Date(
                                ticket.createdAt
                            ).toLocaleString()}</span>
                            <span>Last updated: ${new Date(
                                ticket.lastUpdated
                            ).toLocaleString()}</span>
                        </div>

                        <div class="ticket-messages">
                            ${ticket.messages
                                .map(
                                    (message) => `
                                <div class="message ${message.sender}">
                                    <div class="message-header">
                                        <strong>${
                                            message.sender === "user"
                                                ? this.userAccount.name
                                                : "Support Team"
                                        }</strong>
                                        <span>${new Date(
                                            message.timestamp
                                        ).toLocaleString()}</span>
                                    </div>
                                    <div class="message-content">
                                        ${message.content}
                                    </div>
                                </div>
                            `
                                )
                                .join("")}
                        </div>

                        <div class="reply-form">
                            <h4>Reply</h4>
                            <textarea id="reply-message" class="form-control" rows="3" placeholder="Type your reply here..."></textarea>
                            <button id="send-reply-btn" class="btn btn-primary">Send Reply</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = "block";

        // Attach event listeners for the details modal
        const closeBtn = modal.querySelector(".close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                document.body.removeChild(modal);
            });
        }

        const sendReplyBtn = document.getElementById("send-reply-btn");
        if (sendReplyBtn) {
            sendReplyBtn.addEventListener("click", () => {
                const replyMessage =
                    document.getElementById("reply-message").value;
                if (replyMessage.trim()) {
                    // In a real implementation, this would send the reply
                    console.log("Sending reply:", replyMessage);
                    alert("Reply sent successfully!");
                    document.body.removeChild(modal);
                }
            });
        }
    }
}

module.exports = ProfessionalSupport;
