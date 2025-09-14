// Q&A Panel Component for KODEON IDE
class QAPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentQuestion = null;
        this.questions = [];
        this.isInitialized = false;
        this.currentUser = {
            id: "user-1",
            name: "Current User",
            reputation: 150,
        };
    }

    async initialize() {
        this.isInitialized = true;

        // Load questions
        await this.loadQuestions();

        // Render the component
        this.render();

        console.log("Q&A panel initialized");
    }

    async loadQuestions() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the knowledge sharing service
            // For now, we'll simulate questions
            this.questions = [
                {
                    id: "q-1",
                    title: "How to handle arrays in KODEON?",
                    content:
                        "I'm trying to create and manipulate arrays in KODEON but I'm not sure about the syntax.",
                    author: "New Developer",
                    authorReputation: 25,
                    createdAt: "2023-01-02T14:30:00Z",
                    tags: ["arrays", "syntax"],
                    answers: [
                        {
                            id: "a-1",
                            content:
                                "In KODEON, you can create arrays using the [] syntax. For example: myArray = [1, 2, 3, 4]",
                            author: "Experienced Developer",
                            authorReputation: 500,
                            createdAt: "2023-01-02T15:00:00Z",
                            upvotes: 5,
                            isAccepted: true,
                        },
                    ],
                },
                {
                    id: "q-2",
                    title: "What's the best way to handle errors in KODEON?",
                    content:
                        "I'm looking for guidance on error handling best practices in KODEON.",
                    author: "Intermediate Developer",
                    authorReputation: 120,
                    createdAt: "2023-01-03T09:15:00Z",
                    tags: ["error-handling", "best-practices"],
                    answers: [],
                },
                {
                    id: "q-3",
                    title: "How to create a web server with KODEON?",
                    content:
                        "I want to build a simple web server using KODEON. What libraries should I use?",
                    author: "Web Developer",
                    authorReputation: 300,
                    createdAt: "2023-01-04T16:45:00Z",
                    tags: ["web", "server"],
                    answers: [
                        {
                            id: "a-2",
                            content:
                                "You can use the web module in KODEON's standard library to create web servers. Check the documentation for examples.",
                            author: "Community Moderator",
                            authorReputation: 1200,
                            createdAt: "2023-01-04T17:20:00Z",
                            upvotes: 3,
                            isAccepted: false,
                        },
                    ],
                },
            ];

            // Set current question
            this.currentQuestion = this.questions[0];
        } catch (error) {
            console.error("Error loading questions:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the Q&A panel
        const panelElement = document.createElement("div");
        panelElement.className = "qa-panel";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Q&A Forum</h3>
        <div class="user-reputation">
          <span>Your Reputation: <strong>${
              this.currentUser.reputation
          }</strong></span>
          <button id="ask-question-btn" class="btn btn-primary">Ask Question</button>
        </div>
      </div>
      <div class="search-bar">
        <input type="text" id="qa-search" placeholder="Search questions...">
        <button id="search-qa-btn" class="btn btn-secondary">Search</button>
      </div>
      <div class="questions-list">
        ${this.renderQuestions()}
      </div>
      ${
          this.currentQuestion
              ? `
        <div class="current-question">
          <h4>${this.currentQuestion.title}</h4>
          <div class="question-meta">
            <span>Asked by ${this.currentQuestion.author} (${
                    this.currentQuestion.authorReputation
                } rep)</span>
            <span>${new Date(
                this.currentQuestion.createdAt
            ).toLocaleDateString()}</span>
          </div>
          <div class="question-content">
            <p>${this.currentQuestion.content}</p>
          </div>
          <div class="question-tags">
            ${this.currentQuestion.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("")}
          </div>
          <div class="answers-section">
            <h5>Answers (${this.currentQuestion.answers.length})</h5>
            ${
                this.currentQuestion.answers.length > 0
                    ? `
              <div class="answers-list">
                ${this.renderAnswers(this.currentQuestion.answers)}
              </div>
            `
                    : '<p class="no-answers">No answers yet. Be the first to answer!</p>'
            }
            <div class="answer-form">
              <h5>Your Answer</h5>
              <textarea id="answer-content" class="form-control" rows="5" placeholder="Write your answer here..."></textarea>
              <button id="submit-answer-btn" class="btn btn-primary">Post Answer</button>
            </div>
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

    renderQuestions() {
        if (!this.questions || this.questions.length === 0) {
            return '<p class="no-questions">No questions found. Be the first to ask!</p>';
        }

        return this.questions
            .map(
                (question) => `
      <div class="question-item ${
          this.currentQuestion && this.currentQuestion.id === question.id
              ? "active"
              : ""
      }"
           data-question-id="${question.id}">
        <div class="question-info">
          <h5>${question.title}</h5>
          <div class="question-meta">
            <span>by ${question.author} (${
                    question.authorReputation
                } rep)</span>
            <span>${new Date(question.createdAt).toLocaleDateString()}</span>
            <span>${question.answers.length} answers</span>
          </div>
        </div>
        <div class="question-tags">
          ${question.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
        </div>
      </div>
    `
            )
            .join("");
    }

    renderAnswers(answers) {
        return answers
            .map(
                (answer) => `
      <div class="answer-item ${
          answer.isAccepted ? "accepted" : ""
      }" data-answer-id="${answer.id}">
        <div class="answer-content">
          <p>${answer.content}</p>
        </div>
        <div class="answer-meta">
          <span>Answered by ${answer.author} (${
                    answer.authorReputation
                } rep)</span>
          <span>${new Date(answer.createdAt).toLocaleDateString()}</span>
          <div class="answer-actions">
            <button class="upvote-btn" data-answer-id="${answer.id}">👍 ${
                    answer.upvotes
                }</button>
            ${
                !answer.isAccepted
                    ? `<button class="accept-btn" data-answer-id="${answer.id}">Accept</button>`
                    : '<span class="accepted-label">Accepted Answer</span>'
            }
          </div>
        </div>
      </div>
    `
            )
            .join("");
    }

    attachEventListeners() {
        const askQuestionBtn = document.getElementById("ask-question-btn");
        if (askQuestionBtn) {
            askQuestionBtn.addEventListener("click", () => {
                this.showAskQuestionForm();
            });
        }

        const searchQABtn = document.getElementById("search-qa-btn");
        if (searchQABtn) {
            searchQABtn.addEventListener("click", () => {
                this.searchQuestions();
            });
        }

        const submitAnswerBtn = document.getElementById("submit-answer-btn");
        if (submitAnswerBtn) {
            submitAnswerBtn.addEventListener("click", () => {
                this.submitAnswer();
            });
        }

        // Add click listeners to question items
        const questionItems = document.querySelectorAll(".question-item");
        questionItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                const questionId = item.getAttribute("data-question-id");
                this.switchQuestion(questionId);
            });
        });

        // Add click listeners to upvote buttons
        const upvoteBtns = document.querySelectorAll(".upvote-btn");
        upvoteBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const answerId = btn.getAttribute("data-answer-id");
                this.upvoteAnswer(answerId);
            });
        });

        // Add click listeners to accept buttons
        const acceptBtns = document.querySelectorAll(".accept-btn");
        acceptBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const answerId = btn.getAttribute("data-answer-id");
                this.acceptAnswer(answerId);
            });
        });
    }

    showAskQuestionForm() {
        // Create a modal for asking a question
        const modal = document.createElement("div");
        modal.className = "qa-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ask a Question</h4>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="ask-question-form">
            <div class="form-group">
              <label for="question-title">Title</label>
              <input type="text" id="question-title" class="form-control" placeholder="Summarize your question in one sentence" required>
            </div>
            <div class="form-group">
              <label for="question-content">Question Details</label>
              <textarea id="question-content" class="form-control" rows="8" placeholder="Provide detailed information about your question. Include any relevant code snippets." required></textarea>
            </div>
            <div class="form-group">
              <label for="question-tags">Tags (comma separated)</label>
              <input type="text" id="question-tags" class="form-control" placeholder="arrays, syntax, web, etc.">
            </div>
            <div class="reputation-info">
              <p>Asking a question costs 5 reputation points. You currently have ${this.currentUser.reputation} reputation points.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Post Question</button>
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
        const form = modal.querySelector("#ask-question-form");

        const closeHandler = () => {
            document.body.removeChild(modal);
        };

        closeModal.addEventListener("click", closeHandler);
        cancelBtn.addEventListener("click", closeHandler);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.askQuestion();
            closeHandler();
        });
    }

    async askQuestion() {
        const title = document.getElementById("question-title").value;
        const content = document.getElementById("question-content").value;
        const tagsInput = document.getElementById("question-tags").value;
        const tags = tagsInput
            ? tagsInput.split(",").map((tag) => tag.trim())
            : [];

        // Check if user has enough reputation
        if (this.currentUser.reputation < 5) {
            alert("You need at least 5 reputation points to ask a question.");
            return;
        }

        // In a real implementation, this would call the knowledge sharing service
        const newQuestion = {
            id: `q-${Date.now()}`,
            title: title,
            content: content,
            author: this.currentUser.name,
            authorReputation: this.currentUser.reputation,
            createdAt: new Date().toISOString(),
            tags: tags,
            answers: [],
        };

        this.questions.push(newQuestion);
        this.currentQuestion = newQuestion;

        // Deduct reputation for asking question
        this.currentUser.reputation -= 5;

        this.render();

        console.log("New question asked:", newQuestion);
    }

    async searchQuestions() {
        const query = document.getElementById("qa-search").value;

        // In a real implementation, this would call the knowledge sharing service
        // For now, we'll filter the existing questions
        if (query) {
            this.questions = this.questions.filter(
                (q) =>
                    q.title.toLowerCase().includes(query.toLowerCase()) ||
                    q.content.toLowerCase().includes(query.toLowerCase()) ||
                    q.tags.some((tag) =>
                        tag.toLowerCase().includes(query.toLowerCase())
                    )
            );
        } else {
            // Reload all questions
            await this.loadQuestions();
        }

        this.render();
    }

    async submitAnswer() {
        if (!this.currentQuestion) return;

        const content = document.getElementById("answer-content").value;
        if (!content.trim()) {
            alert("Please enter an answer before submitting.");
            return;
        }

        // In a real implementation, this would call the knowledge sharing service
        const newAnswer = {
            id: `a-${Date.now()}`,
            content: content,
            author: this.currentUser.name,
            authorReputation: this.currentUser.reputation,
            createdAt: new Date().toISOString(),
            upvotes: 0,
            isAccepted: false,
        };

        this.currentQuestion.answers.push(newAnswer);
        this.render();

        // Clear the answer textarea
        document.getElementById("answer-content").value = "";

        console.log("New answer submitted:", newAnswer);
    }

    async upvoteAnswer(answerId) {
        if (!this.currentQuestion) return;

        const answer = this.currentQuestion.answers.find(
            (a) => a.id === answerId
        );
        if (answer) {
            // Check if user is trying to upvote their own answer
            if (answer.author === this.currentUser.name) {
                alert("You cannot upvote your own answer.");
                return;
            }

            answer.upvotes += 1;

            // Award reputation to answer author
            // In a real implementation, this would be handled by the service
            this.render();
            console.log("Answer upvoted:", answerId);
        }
    }

    async acceptAnswer(answerId) {
        if (!this.currentQuestion) return;

        // Check if current user is the question author
        if (this.currentQuestion.author !== this.currentUser.name) {
            alert("Only the question author can accept an answer.");
            return;
        }

        // Mark previous accepted answer as unaccepted
        this.currentQuestion.answers.forEach((answer) => {
            if (answer.isAccepted) {
                answer.isAccepted = false;
            }
        });

        const answer = this.currentQuestion.answers.find(
            (a) => a.id === answerId
        );
        if (answer) {
            answer.isAccepted = true;

            // Award reputation for accepted answer
            // In a real implementation, this would be handled by the service
            this.render();
            console.log("Answer accepted:", answerId);
        }
    }

    async switchQuestion(questionId) {
        const question = this.questions.find((q) => q.id === questionId);
        if (question) {
            this.currentQuestion = question;
            this.render();

            // In a real implementation, this would update the knowledge sharing service
            console.log(`Switched to question: ${question.title}`);
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.currentQuestion = null;
        this.questions = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .qa-panel {
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

  .user-reputation {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .user-reputation span {
    font-weight: bold;
    color: #007bff;
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

  .questions-list {
    margin-bottom: 30px;
  }

  .question-item {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
  }

  .question-item:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }

  .question-item.active {
    border-left: 4px solid #007bff;
    background-color: #f8f9fa;
  }

  .question-info h5 {
    margin: 0 0 5px 0;
    color: #333;
  }

  .question-meta {
    display: flex;
    gap: 15px;
    font-size: 0.8em;
    color: #666;
    margin-bottom: 10px;
  }

  .question-tags {
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

  .current-question {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }

  .current-question h4 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .question-content {
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .question-content p {
    margin: 0 0 15px 0;
  }

  .answers-section h5 {
    margin: 20px 0 15px 0;
    color: #333;
  }

  .answer-item {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    border-left: 4px solid #007bff;
  }

  .answer-item.accepted {
    background-color: #d4edda;
    border-left: 4px solid #28a745;
  }

  .answer-content {
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .answer-content p {
    margin: 0 0 10px 0;
  }

  .answer-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8em;
    color: #666;
  }

  .answer-actions {
    display: flex;
    gap: 10px;
  }

  .upvote-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #007bff;
    font-weight: bold;
  }

  .accept-btn {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 0.8em;
  }

  .accepted-label {
    color: #28a745;
    font-weight: bold;
    font-size: 0.8em;
  }

  .answer-form {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }

  .answer-form textarea {
    width: 100%;
    margin-bottom: 10px;
  }

  .no-questions, .no-answers {
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

  .qa-modal {
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

  .reputation-info {
    background-color: #e9ecef;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 0.9em;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
`;

document.head.appendChild(style);

module.exports = QAPanel;
