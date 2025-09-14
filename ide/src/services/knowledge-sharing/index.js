// Knowledge Sharing System Service for KODEON IDE
class KnowledgeSharingService {
    constructor() {
        this.isInitialized = false;
        this.documents = new Map();
        this.questions = new Map();
        this.projects = new Map();
        this.mentors = new Map();
        this.mentees = new Map();
    }

    async initialize() {
        try {
            // Initialize data structures
            this.documents = new Map();
            this.questions = new Map();
            this.projects = new Map();
            this.mentors = new Map();
            this.mentees = new Map();

            // Load sample data for demonstration
            this.loadSampleData();

            this.isInitialized = true;
            console.log("Knowledge Sharing System initialized");
            return true;
        } catch (error) {
            console.error(
                "Error initializing Knowledge Sharing System:",
                error
            );
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    loadSampleData() {
        // Sample documentation
        this.documents.set("doc-1", {
            id: "doc-1",
            title: "Getting Started with KODEON",
            content:
                "This guide will help you get started with KODEON programming language.",
            author: "user-1",
            createdAt: "2023-01-01T10:00:00Z",
            updatedAt: "2023-01-01T10:00:00Z",
            version: 1,
            tags: ["beginner", "tutorial"],
        });

        // Sample questions
        this.questions.set("q-1", {
            id: "q-1",
            title: "How to handle arrays in KODEON?",
            content:
                "I'm trying to create and manipulate arrays in KODEON but I'm not sure about the syntax.",
            author: "user-2",
            createdAt: "2023-01-02T14:30:00Z",
            tags: ["arrays", "syntax"],
            answers: [
                {
                    id: "a-1",
                    content:
                        "In KODEON, you can create arrays using the [] syntax. For example: myArray = [1, 2, 3, 4]",
                    author: "user-3",
                    createdAt: "2023-01-02T15:00:00Z",
                    upvotes: 5,
                    isAccepted: true,
                },
            ],
        });

        // Sample projects
        this.projects.set("proj-1", {
            id: "proj-1",
            name: "Todo List Application",
            description: "A simple todo list application built with KODEON",
            author: "user-4",
            createdAt: "2023-01-03T09:15:00Z",
            tags: ["web", "beginner"],
            downloads: 42,
            rating: 4.5,
        });
    }

    // Documentation Platform Methods
    async createDocument(documentData) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const documentId = `doc-${Date.now()}`;
        const document = {
            id: documentId,
            ...documentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
        };

        this.documents.set(documentId, document);
        return document;
    }

    async getDocument(documentId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        return this.documents.get(documentId) || null;
    }

    async updateDocument(documentId, updates) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const document = this.documents.get(documentId);
        if (!document) {
            throw new Error(`Document not found: ${documentId}`);
        }

        const updatedDocument = {
            ...document,
            ...updates,
            updatedAt: new Date().toISOString(),
            version: document.version + 1,
        };

        this.documents.set(documentId, updatedDocument);
        return updatedDocument;
    }

    async deleteDocument(documentId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        return this.documents.delete(documentId);
    }

    async searchDocuments(query, tags = []) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const results = [];
        for (const [id, document] of this.documents) {
            const matchesQuery = query
                ? document.title.toLowerCase().includes(query.toLowerCase()) ||
                  document.content.toLowerCase().includes(query.toLowerCase())
                : true;

            const matchesTags =
                tags.length > 0
                    ? tags.some((tag) => document.tags.includes(tag))
                    : true;

            if (matchesQuery && matchesTags) {
                results.push(document);
            }
        }

        return results;
    }

    // Q&A Platform Methods
    async createQuestion(questionData) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const questionId = `q-${Date.now()}`;
        const question = {
            id: questionId,
            ...questionData,
            createdAt: new Date().toISOString(),
            answers: [],
        };

        this.questions.set(questionId, question);
        return question;
    }

    async getQuestion(questionId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        return this.questions.get(questionId) || null;
    }

    async addAnswer(questionId, answerData) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const question = this.questions.get(questionId);
        if (!question) {
            throw new Error(`Question not found: ${questionId}`);
        }

        const answerId = `a-${Date.now()}`;
        const answer = {
            id: answerId,
            ...answerData,
            createdAt: new Date().toISOString(),
            upvotes: 0,
        };

        question.answers.push(answer);
        this.questions.set(questionId, question);
        return answer;
    }

    async searchQuestions(query, tags = []) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const results = [];
        for (const [id, question] of this.questions) {
            const matchesQuery = query
                ? question.title.toLowerCase().includes(query.toLowerCase()) ||
                  question.content.toLowerCase().includes(query.toLowerCase())
                : true;

            const matchesTags =
                tags.length > 0
                    ? tags.some((tag) => question.tags.includes(tag))
                    : true;

            if (matchesQuery && matchesTags) {
                results.push(question);
            }
        }

        return results;
    }

    async upvoteAnswer(questionId, answerId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const question = this.questions.get(questionId);
        if (!question) {
            throw new Error(`Question not found: ${questionId}`);
        }

        const answer = question.answers.find((a) => a.id === answerId);
        if (!answer) {
            throw new Error(`Answer not found: ${answerId}`);
        }

        answer.upvotes += 1;
        this.questions.set(questionId, question);
        return answer;
    }

    async acceptAnswer(questionId, answerId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const question = this.questions.get(questionId);
        if (!question) {
            throw new Error(`Question not found: ${questionId}`);
        }

        // Mark previous accepted answer as unaccepted
        question.answers.forEach((answer) => {
            if (answer.isAccepted) {
                answer.isAccepted = false;
            }
        });

        const answer = question.answers.find((a) => a.id === answerId);
        if (!answer) {
            throw new Error(`Answer not found: ${answerId}`);
        }

        answer.isAccepted = true;
        this.questions.set(questionId, question);
        return answer;
    }

    // Project Sharing Methods
    async createProject(projectData) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const projectId = `proj-${Date.now()}`;
        const project = {
            id: projectId,
            ...projectData,
            createdAt: new Date().toISOString(),
            downloads: 0,
            rating: 0,
        };

        this.projects.set(projectId, project);
        return project;
    }

    async getProject(projectId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        return this.projects.get(projectId) || null;
    }

    async searchProjects(query, tags = []) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const results = [];
        for (const [id, project] of this.projects) {
            const matchesQuery = query
                ? project.name.toLowerCase().includes(query.toLowerCase()) ||
                  project.description
                      .toLowerCase()
                      .includes(query.toLowerCase())
                : true;

            const matchesTags =
                tags.length > 0
                    ? tags.some((tag) => project.tags.includes(tag))
                    : true;

            if (matchesQuery && matchesTags) {
                results.push(project);
            }
        }

        return results;
    }

    async downloadProject(projectId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const project = this.projects.get(projectId);
        if (!project) {
            throw new Error(`Project not found: ${projectId}`);
        }

        project.downloads += 1;
        this.projects.set(projectId, project);
        return project;
    }

    async rateProject(projectId, rating) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const project = this.projects.get(projectId);
        if (!project) {
            throw new Error(`Project not found: ${projectId}`);
        }

        // In a real implementation, we would calculate average rating
        // For now, we'll just set the rating
        project.rating = rating;
        this.projects.set(projectId, project);
        return project;
    }

    // Mentorship Methods
    async registerMentor(mentorData) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const mentorId = `mentor-${Date.now()}`;
        const mentor = {
            id: mentorId,
            ...mentorData,
            registeredAt: new Date().toISOString(),
        };

        this.mentors.set(mentorId, mentor);
        return mentor;
    }

    async registerMentee(menteeData) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const menteeId = `mentee-${Date.now()}`;
        const mentee = {
            id: menteeId,
            ...menteeData,
            registeredAt: new Date().toISOString(),
        };

        this.mentees.set(menteeId, mentee);
        return mentee;
    }

    async findMentorsForMentee(menteeId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const mentee = this.mentees.get(menteeId);
        if (!mentee) {
            throw new Error(`Mentee not found: ${menteeId}`);
        }

        // In a real implementation, we would match based on skills, interests, etc.
        // For now, we'll return all mentors
        const mentors = [];
        for (const [id, mentor] of this.mentors) {
            mentors.push(mentor);
        }

        return mentors;
    }

    async requestMentorship(menteeId, mentorId) {
        if (!this.isReady()) {
            throw new Error("Knowledge Sharing System not initialized");
        }

        const mentee = this.mentees.get(menteeId);
        if (!mentee) {
            throw new Error(`Mentee not found: ${menteeId}`);
        }

        const mentor = this.mentors.get(mentorId);
        if (!mentor) {
            throw new Error(`Mentor not found: ${mentorId}`);
        }

        // In a real implementation, we would send a request to the mentor
        // For now, we'll simulate acceptance
        return {
            menteeId,
            mentorId,
            status: "accepted",
            requestedAt: new Date().toISOString(),
        };
    }
}

module.exports = new KnowledgeSharingService();
