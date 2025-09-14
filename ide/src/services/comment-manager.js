// Comment and Review Manager for KODEON IDE
class CommentManager {
    constructor() {
        this.comments = new Map(); // Store comments
        this.reviews = new Map(); // Store review requests
        this.notifications = new Map(); // Store notifications
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize data structures
            this.comments = new Map();
            this.reviews = new Map();
            this.notifications = new Map();

            // Create sample data for demonstration
            this.createSampleData();

            console.log("Comment manager initialized");

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error("Error initializing comment manager:", error);
            return false;
        }
    }

    createSampleData() {
        // Create sample comments
        const sampleComment = {
            id: "comment-1",
            projectId: "project-1",
            fileId: "file-main.kodeon",
            lineNumber: 15,
            content: "Consider adding error handling for this function",
            author: "user-developer1",
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            resolved: false,
            resolvedBy: null,
            resolvedAt: null,
            replies: [
                {
                    id: "reply-1",
                    content: "Good point, I'll add a try-catch block",
                    author: "user-admin",
                    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                },
            ],
        };

        this.comments.set(sampleComment.id, sampleComment);

        // Create sample review
        const sampleReview = {
            id: "review-1",
            projectId: "project-1",
            title: "Authentication Feature Review",
            description: "Review of the new authentication implementation",
            author: "user-admin",
            reviewers: ["user-developer1", "user-developer2"],
            status: "pending",
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            comments: ["comment-1"],
            files: ["file-main.kodeon"],
        };

        this.reviews.set(sampleReview.id, sampleReview);
    }

    isReady() {
        return this.isInitialized;
    }

    async createComment(projectId, fileId, commentData) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        // Validate comment data
        if (!commentData.content) {
            throw new Error("Comment content is required");
        }

        if (commentData.lineNumber === undefined) {
            throw new Error("Line number is required");
        }

        const commentId = `comment-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const comment = {
            id: commentId,
            projectId: projectId,
            fileId: fileId,
            lineNumber: commentData.lineNumber,
            content: commentData.content,
            author: commentData.author,
            createdAt: new Date().toISOString(),
            resolved: false,
            resolvedBy: null,
            resolvedAt: null,
            replies: [],
        };

        this.comments.set(commentId, comment);

        // Notify relevant users
        this.notifyUsers(projectId, "comment-created", { comment });

        return comment;
    }

    async getComment(commentId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        return this.comments.get(commentId) || null;
    }

    async getFileComments(projectId, fileId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const fileComments = [];
        for (const [id, comment] of this.comments) {
            if (comment.projectId === projectId && comment.fileId === fileId) {
                fileComments.push(comment);
            }
        }

        return fileComments;
    }

    async getProjectComments(projectId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const projectComments = [];
        for (const [id, comment] of this.comments) {
            if (comment.projectId === projectId) {
                projectComments.push(comment);
            }
        }

        return projectComments;
    }

    async updateComment(commentId, userId, updates) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const comment = this.comments.get(commentId);
        if (!comment) {
            throw new Error(`Comment not found: ${commentId}`);
        }

        // Check if user is authorized to update comment
        if (comment.author !== userId) {
            throw new Error("Only the comment author can update the comment");
        }

        // Apply updates
        const updatedComment = {
            ...comment,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        this.comments.set(commentId, updatedComment);

        // Notify relevant users
        this.notifyUsers(comment.projectId, "comment-updated", {
            comment: updatedComment,
        });

        return updatedComment;
    }

    async deleteComment(commentId, userId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const comment = this.comments.get(commentId);
        if (!comment) {
            throw new Error(`Comment not found: ${commentId}`);
        }

        // Check if user is authorized to delete comment
        if (comment.author !== userId) {
            throw new Error("Only the comment author can delete the comment");
        }

        // Delete comment
        this.comments.delete(commentId);

        // Notify relevant users
        this.notifyUsers(comment.projectId, "comment-deleted", { commentId });

        return true;
    }

    async addReply(commentId, replyData) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const comment = this.comments.get(commentId);
        if (!comment) {
            throw new Error(`Comment not found: ${commentId}`);
        }

        // Validate reply data
        if (!replyData.content) {
            throw new Error("Reply content is required");
        }

        const reply = {
            id: `reply-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`,
            content: replyData.content,
            author: replyData.author,
            createdAt: new Date().toISOString(),
        };

        comment.replies.push(reply);
        comment.updatedAt = new Date().toISOString();

        this.comments.set(commentId, comment);

        // Notify relevant users
        this.notifyUsers(comment.projectId, "reply-added", {
            commentId,
            reply,
        });

        return reply;
    }

    async resolveComment(commentId, userId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const comment = this.comments.get(commentId);
        if (!comment) {
            throw new Error(`Comment not found: ${commentId}`);
        }

        // Mark comment as resolved
        comment.resolved = true;
        comment.resolvedBy = userId;
        comment.resolvedAt = new Date().toISOString();
        comment.updatedAt = new Date().toISOString();

        this.comments.set(commentId, comment);

        // Notify relevant users
        this.notifyUsers(comment.projectId, "comment-resolved", {
            commentId,
            resolvedBy: userId,
        });

        return comment;
    }

    async unresolveComment(commentId, userId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const comment = this.comments.get(commentId);
        if (!comment) {
            throw new Error(`Comment not found: ${commentId}`);
        }

        // Mark comment as unresolved
        comment.resolved = false;
        comment.resolvedBy = null;
        comment.resolvedAt = null;
        comment.updatedAt = new Date().toISOString();

        this.comments.set(commentId, comment);

        // Notify relevant users
        this.notifyUsers(comment.projectId, "comment-unresolved", {
            commentId,
        });

        return comment;
    }

    async createReview(projectId, reviewData) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        // Validate review data
        if (!reviewData.title) {
            throw new Error("Review title is required");
        }

        if (!reviewData.author) {
            throw new Error("Review author is required");
        }

        const reviewId = `review-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const review = {
            id: reviewId,
            projectId: projectId,
            title: reviewData.title,
            description: reviewData.description || "",
            author: reviewData.author,
            reviewers: reviewData.reviewers || [],
            status: "pending", // pending, approved, rejected, requested_changes
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
            files: reviewData.files || [],
        };

        this.reviews.set(reviewId, review);

        // Notify reviewers
        this.notifyReviewers(reviewId, "review-requested", { review });

        return review;
    }

    async getReview(reviewId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        return this.reviews.get(reviewId) || null;
    }

    async getProjectReviews(projectId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const projectReviews = [];
        for (const [id, review] of this.reviews) {
            if (review.projectId === projectId) {
                projectReviews.push(review);
            }
        }

        return projectReviews;
    }

    async getUserReviews(userId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const userReviews = [];
        for (const [id, review] of this.reviews) {
            if (review.author === userId || review.reviewers.includes(userId)) {
                userReviews.push(review);
            }
        }

        return userReviews;
    }

    async updateReviewStatus(reviewId, userId, newStatus, comment = "") {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const review = this.reviews.get(reviewId);
        if (!review) {
            throw new Error(`Review not found: ${reviewId}`);
        }

        // Check if user is authorized to update review status
        if (userId !== review.author && !review.reviewers.includes(userId)) {
            throw new Error("User is not authorized to update this review");
        }

        // Update status
        review.status = newStatus;
        review.updatedAt = new Date().toISOString();

        // If there's a comment, add it as a reply to the review
        if (comment) {
            // In a real implementation, we might want to create a special type of comment for review status updates
            console.log(
                `Review ${reviewId} status updated to ${newStatus} with comment: ${comment}`
            );
        }

        this.reviews.set(reviewId, review);

        // Notify relevant users
        this.notifyReviewers(reviewId, "review-status-updated", {
            reviewId,
            status: newStatus,
            updatedBy: userId,
        });

        return review;
    }

    async addCommentToReview(reviewId, commentId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const review = this.reviews.get(reviewId);
        if (!review) {
            throw new Error(`Review not found: ${reviewId}`);
        }

        const comment = this.comments.get(commentId);
        if (!comment) {
            throw new Error(`Comment not found: ${commentId}`);
        }

        // Add comment to review if not already present
        if (!review.comments.includes(commentId)) {
            review.comments.push(commentId);
            review.updatedAt = new Date().toISOString();
            this.reviews.set(reviewId, review);
        }

        return review;
    }

    async removeCommentFromReview(reviewId, commentId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const review = this.reviews.get(reviewId);
        if (!review) {
            throw new Error(`Review not found: ${reviewId}`);
        }

        // Remove comment from review
        review.comments = review.comments.filter((id) => id !== commentId);
        review.updatedAt = new Date().toISOString();

        this.reviews.set(reviewId, review);

        return review;
    }

    async addReviewer(reviewId, reviewerId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const review = this.reviews.get(reviewId);
        if (!review) {
            throw new Error(`Review not found: ${reviewId}`);
        }

        // Add reviewer if not already present
        if (!review.reviewers.includes(reviewerId)) {
            review.reviewers.push(reviewerId);
            review.updatedAt = new Date().toISOString();
            this.reviews.set(reviewId, review);

            // Notify new reviewer
            this.notifyUser(reviewerId, "added-as-reviewer", { reviewId });
        }

        return review;
    }

    async removeReviewer(reviewId, reviewerId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const review = this.reviews.get(reviewId);
        if (!review) {
            throw new Error(`Review not found: ${reviewId}`);
        }

        // Remove reviewer
        review.reviewers = review.reviewers.filter((id) => id !== reviewerId);
        review.updatedAt = new Date().toISOString();

        this.reviews.set(reviewId, review);

        // Notify removed reviewer
        this.notifyUser(reviewerId, "removed-as-reviewer", { reviewId });

        return review;
    }

    async createNotification(userId, notificationData) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const notificationId = `notif-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const notification = {
            id: notificationId,
            userId: userId,
            type: notificationData.type,
            message: notificationData.message,
            relatedId: notificationData.relatedId, // ID of related comment, review, etc.
            relatedType: notificationData.relatedType, // 'comment', 'review', etc.
            read: false,
            createdAt: new Date().toISOString(),
        };

        // Store notification
        if (!this.notifications.has(userId)) {
            this.notifications.set(userId, []);
        }
        this.notifications.get(userId).push(notification);

        return notification;
    }

    async getUserNotifications(userId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        return this.notifications.get(userId) || [];
    }

    async markNotificationAsRead(notificationId, userId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const userNotifications = this.notifications.get(userId) || [];
        const notification = userNotifications.find(
            (notif) => notif.id === notificationId
        );

        if (notification) {
            notification.read = true;
            this.notifications.set(userId, userNotifications);
        }

        return notification;
    }

    async markAllNotificationsAsRead(userId) {
        if (!this.isReady()) {
            throw new Error("Comment manager not initialized");
        }

        const userNotifications = this.notifications.get(userId) || [];
        userNotifications.forEach((notification) => {
            notification.read = true;
        });

        this.notifications.set(userId, userNotifications);

        return true;
    }

    notifyUsers(projectId, eventType, data) {
        // In a real implementation, this would send messages to connected clients
        // For now, we'll just log the notification
        console.log(`[COMMENT] ${eventType} in project ${projectId}:`, data);

        // Simulate sending to clients
        // In a real implementation, this would use WebSocket or similar technology
        // this.websocketServer.to(projectId).emit(eventType, data);
    }

    notifyReviewers(reviewId, eventType, data) {
        // In a real implementation, this would send messages to review participants
        // For now, we'll just log the notification
        console.log(`[REVIEW] ${eventType} for review ${reviewId}:`, data);
    }

    notifyUser(userId, eventType, data) {
        // In a real implementation, this would send a message to a specific user
        // For now, we'll just log the notification
        console.log(`[USER] ${eventType} for user ${userId}:`, data);
    }
}

module.exports = CommentManager;
