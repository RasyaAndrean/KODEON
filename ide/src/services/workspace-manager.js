// Workspace Manager for KODEON IDE
class WorkspaceManager {
    constructor() {
        this.workspaces = new Map(); // Store workspaces
        this.memberships = new Map(); // Store user memberships
        this.invitations = new Map(); // Store pending invitations
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize data structures
            this.workspaces = new Map();
            this.memberships = new Map();
            this.invitations = new Map();

            // Create sample workspaces for demonstration
            this.createSampleWorkspaces();

            console.log("Workspace manager initialized");

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error("Error initializing workspace manager:", error);
            return false;
        }
    }

    createSampleWorkspaces() {
        // Create a sample workspace
        const sampleWorkspace = {
            id: "workspace-1",
            name: "Team Alpha",
            description: "Main development team workspace",
            ownerId: "user-admin",
            members: [
                {
                    userId: "user-admin",
                    role: "owner",
                    joinedAt: new Date().toISOString(),
                    permissions: ["read", "write", "admin"],
                },
                {
                    userId: "user-developer1",
                    role: "member",
                    joinedAt: new Date().toISOString(),
                    permissions: ["read", "write"],
                },
                {
                    userId: "user-developer2",
                    role: "member",
                    joinedAt: new Date().toISOString(),
                    permissions: ["read", "write"],
                },
            ],
            projects: ["project-1", "project-2"],
            settings: {
                visibility: "private",
                invitePolicy: "members",
                autoSave: true,
                notifications: {
                    comments: true,
                    mentions: true,
                    updates: false,
                },
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.workspaces.set(sampleWorkspace.id, sampleWorkspace);

        // Create memberships map
        sampleWorkspace.members.forEach((member) => {
            if (!this.memberships.has(member.userId)) {
                this.memberships.set(member.userId, []);
            }
            this.memberships.get(member.userId).push(sampleWorkspace.id);
        });
    }

    isReady() {
        return this.isInitialized;
    }

    async createWorkspace(userId, workspaceData) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        // Validate workspace data
        if (!workspaceData.name) {
            throw new Error("Workspace name is required");
        }

        const workspaceId = `workspace-${Date.now()}`;
        const workspace = {
            id: workspaceId,
            name: workspaceData.name,
            description: workspaceData.description || "",
            ownerId: userId,
            members: [
                {
                    userId: userId,
                    role: "owner",
                    joinedAt: new Date().toISOString(),
                    permissions: ["read", "write", "admin"],
                },
            ],
            projects: workspaceData.projects || [],
            settings: {
                visibility: workspaceData.visibility || "private",
                invitePolicy: workspaceData.invitePolicy || "owner_only",
                autoSave:
                    workspaceData.autoSave !== undefined
                        ? workspaceData.autoSave
                        : true,
                notifications: workspaceData.notifications || {
                    comments: true,
                    mentions: true,
                    updates: false,
                },
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.workspaces.set(workspaceId, workspace);

        // Add to memberships
        if (!this.memberships.has(userId)) {
            this.memberships.set(userId, []);
        }
        this.memberships.get(userId).push(workspaceId);

        return workspace;
    }

    async getWorkspace(workspaceId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        return this.workspaces.get(workspaceId) || null;
    }

    async getUserWorkspaces(userId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspaceIds = this.memberships.get(userId) || [];
        const workspaces = [];

        for (const workspaceId of workspaceIds) {
            const workspace = this.workspaces.get(workspaceId);
            if (workspace) {
                workspaces.push(workspace);
            }
        }

        return workspaces;
    }

    async updateWorkspace(workspaceId, updates) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Apply updates
        const updatedWorkspace = {
            ...workspace,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        this.workspaces.set(workspaceId, updatedWorkspace);

        return updatedWorkspace;
    }

    async deleteWorkspace(workspaceId, userId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Check if user has permission to delete
        const userMembership = workspace.members.find(
            (member) => member.userId === userId
        );
        if (!userMembership || !userMembership.permissions.includes("admin")) {
            throw new Error("Insufficient permissions to delete workspace");
        }

        // Remove workspace
        this.workspaces.delete(workspaceId);

        // Remove from memberships
        workspace.members.forEach((member) => {
            const userWorkspaces = this.memberships.get(member.userId) || [];
            const updatedWorkspaces = userWorkspaces.filter(
                (id) => id !== workspaceId
            );
            this.memberships.set(member.userId, updatedWorkspaces);
        });

        return true;
    }

    async addMember(workspaceId, inviterId, inviteeId, role = "member") {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Check if inviter has permission to add members
        const inviterMembership = workspace.members.find(
            (member) => member.userId === inviterId
        );
        if (
            !inviterMembership ||
            (!inviterMembership.permissions.includes("admin") &&
                workspace.settings.invitePolicy !== "members")
        ) {
            throw new Error("Insufficient permissions to add member");
        }

        // Check if user is already a member
        const existingMember = workspace.members.find(
            (member) => member.userId === inviteeId
        );
        if (existingMember) {
            throw new Error("User is already a member of this workspace");
        }

        // Add member
        const newMember = {
            userId: inviteeId,
            role: role,
            joinedAt: new Date().toISOString(),
            permissions:
                role === "owner"
                    ? ["read", "write", "admin"]
                    : ["read", "write"],
        };

        workspace.members.push(newMember);
        workspace.updatedAt = new Date().toISOString();

        // Add to memberships
        if (!this.memberships.has(inviteeId)) {
            this.memberships.set(inviteeId, []);
        }
        this.memberships.get(inviteeId).push(workspaceId);

        // Notify about new member
        this.notifyWorkspace(workspaceId, "member-added", {
            member: newMember,
        });

        return newMember;
    }

    async removeMember(workspaceId, removerId, removeeId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Check if remover has permission to remove members
        const removerMembership = workspace.members.find(
            (member) => member.userId === removerId
        );
        if (
            !removerMembership ||
            !removerMembership.permissions.includes("admin")
        ) {
            throw new Error("Insufficient permissions to remove member");
        }

        // Check if trying to remove owner
        const removeeMembership = workspace.members.find(
            (member) => member.userId === removeeId
        );
        if (removeeMembership && removeeMembership.role === "owner") {
            throw new Error("Cannot remove workspace owner");
        }

        // Remove member
        workspace.members = workspace.members.filter(
            (member) => member.userId !== removeeId
        );
        workspace.updatedAt = new Date().toISOString();

        // Remove from memberships
        const userWorkspaces = this.memberships.get(removeeId) || [];
        const updatedWorkspaces = userWorkspaces.filter(
            (id) => id !== workspaceId
        );
        this.memberships.set(removeeId, updatedWorkspaces);

        // Notify about removed member
        this.notifyWorkspace(workspaceId, "member-removed", {
            userId: removeeId,
        });

        return true;
    }

    async updateMemberRole(workspaceId, updaterId, targetUserId, newRole) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Check if updater has permission to update roles
        const updaterMembership = workspace.members.find(
            (member) => member.userId === updaterId
        );
        if (
            !updaterMembership ||
            !updaterMembership.permissions.includes("admin")
        ) {
            throw new Error("Insufficient permissions to update member role");
        }

        // Find target member
        const memberIndex = workspace.members.findIndex(
            (member) => member.userId === targetUserId
        );
        if (memberIndex === -1) {
            throw new Error("User is not a member of this workspace");
        }

        // Update role
        workspace.members[memberIndex].role = newRole;
        workspace.members[memberIndex].permissions =
            newRole === "owner"
                ? ["read", "write", "admin"]
                : ["read", "write"];
        workspace.updatedAt = new Date().toISOString();

        // Notify about role update
        this.notifyWorkspace(workspaceId, "member-role-updated", {
            userId: targetUserId,
            role: newRole,
        });

        return workspace.members[memberIndex];
    }

    async inviteUser(workspaceId, inviterId, inviteeEmail, role = "member") {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Check if inviter has permission to invite
        const inviterMembership = workspace.members.find(
            (member) => member.userId === inviterId
        );
        if (
            !inviterMembership ||
            (!inviterMembership.permissions.includes("admin") &&
                workspace.settings.invitePolicy !== "members")
        ) {
            throw new Error("Insufficient permissions to invite user");
        }

        // Create invitation
        const invitationId = `invite-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const invitation = {
            id: invitationId,
            workspaceId: workspaceId,
            inviterId: inviterId,
            inviteeEmail: inviteeEmail,
            role: role,
            status: "pending",
            createdAt: new Date().toISOString(),
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // 7 days
        };

        this.invitations.set(invitationId, invitation);

        // Notify about invitation
        this.notifyWorkspace(workspaceId, "user-invited", { invitation });

        return invitation;
    }

    async acceptInvitation(invitationId, userId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const invitation = this.invitations.get(invitationId);
        if (!invitation) {
            throw new Error(`Invitation not found: ${invitationId}`);
        }

        if (invitation.status !== "pending") {
            throw new Error("Invitation is no longer valid");
        }

        if (new Date(invitation.expiresAt) < new Date()) {
            throw new Error("Invitation has expired");
        }

        // Add user to workspace
        await this.addMember(
            invitation.workspaceId,
            invitation.inviterId,
            userId,
            invitation.role
        );

        // Update invitation status
        invitation.status = "accepted";
        invitation.acceptedAt = new Date().toISOString();
        this.invitations.set(invitationId, invitation);

        return true;
    }

    async declineInvitation(invitationId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const invitation = this.invitations.get(invitationId);
        if (!invitation) {
            throw new Error(`Invitation not found: ${invitationId}`);
        }

        if (invitation.status !== "pending") {
            throw new Error("Invitation is no longer valid");
        }

        // Update invitation status
        invitation.status = "declined";
        invitation.declinedAt = new Date().toISOString();
        this.invitations.set(invitationId, invitation);

        return true;
    }

    async getPendingInvitations(userId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        // In a real implementation, we would match invitations by email
        // For now, we'll return all pending invitations
        const pendingInvitations = [];
        for (const [id, invitation] of this.invitations) {
            if (
                invitation.status === "pending" &&
                new Date(invitation.expiresAt) > new Date()
            ) {
                pendingInvitations.push(invitation);
            }
        }

        return pendingInvitations;
    }

    async addProject(workspaceId, userId, projectId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Check if user has permission to add projects
        const userMembership = workspace.members.find(
            (member) => member.userId === userId
        );
        if (!userMembership || !userMembership.permissions.includes("write")) {
            throw new Error("Insufficient permissions to add project");
        }

        // Check if project is already in workspace
        if (workspace.projects.includes(projectId)) {
            throw new Error("Project is already in this workspace");
        }

        // Add project
        workspace.projects.push(projectId);
        workspace.updatedAt = new Date().toISOString();

        // Notify about added project
        this.notifyWorkspace(workspaceId, "project-added", { projectId });

        return workspace;
    }

    async removeProject(workspaceId, userId, projectId) {
        if (!this.isReady()) {
            throw new Error("Workspace manager not initialized");
        }

        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace not found: ${workspaceId}`);
        }

        // Check if user has permission to remove projects
        const userMembership = workspace.members.find(
            (member) => member.userId === userId
        );
        if (!userMembership || !userMembership.permissions.includes("write")) {
            throw new Error("Insufficient permissions to remove project");
        }

        // Remove project
        workspace.projects = workspace.projects.filter(
            (id) => id !== projectId
        );
        workspace.updatedAt = new Date().toISOString();

        // Notify about removed project
        this.notifyWorkspace(workspaceId, "project-removed", { projectId });

        return workspace;
    }

    notifyWorkspace(workspaceId, eventType, data) {
        // In a real implementation, this would send messages to connected clients
        // For now, we'll just log the notification
        console.log(
            `[WORKSPACE] ${eventType} in workspace ${workspaceId}:`,
            data
        );

        // Simulate sending to clients
        // In a real implementation, this would use WebSocket or similar technology
        // this.websocketServer.to(workspaceId).emit(eventType, data);
    }
}

module.exports = WorkspaceManager;
