// Mentorship Panel Component for KODEON IDE
class MentorshipPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentUser = null;
        this.mentors = [];
        this.mentees = [];
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;

        // Load mentorship data
        await this.loadMentorshipData();

        // Render the component
        this.render();

        console.log("Mentorship panel initialized");
    }

    async loadMentorshipData() {
        if (!this.isInitialized) {
            throw new Error("Component not initialized");
        }

        try {
            // In a real implementation, this would call the knowledge sharing service
            // For now, we'll simulate mentorship data
            this.currentUser = {
                id: "user-1",
                name: "Current User",
                role: "mentee", // or 'mentor'
                skills: ["beginner", "web-development"],
                interests: ["concurrency", "data-science"],
            };

            this.mentors = [
                {
                    id: "mentor-1",
                    name: "Alex Johnson",
                    expertise: ["web-development", "concurrency"],
                    experience: "5+ years",
                    bio: "Senior developer with expertise in web technologies and concurrent programming.",
                    rating: 4.8,
                    menteesCount: 12,
                },
                {
                    id: "mentor-2",
                    name: "Maria Garcia",
                    expertise: ["data-science", "machine-learning"],
                    experience: "8+ years",
                    bio: "Data scientist with experience in machine learning and statistical analysis.",
                    rating: 4.9,
                    menteesCount: 8,
                },
                {
                    id: "mentor-3",
                    name: "David Chen",
                    expertise: [
                        "system-programming",
                        "performance-optimization",
                    ],
                    experience: "10+ years",
                    bio: "Systems programmer with expertise in performance optimization and low-level programming.",
                    rating: 4.7,
                    menteesCount: 15,
                },
            ];

            this.mentees = [
                {
                    id: "mentee-1",
                    name: "Sam Wilson",
                    skills: ["beginner"],
                    interests: ["web-development"],
                    goals: "Learn to build web applications",
                },
                {
                    id: "mentee-2",
                    name: "Priya Sharma",
                    skills: ["intermediate"],
                    interests: ["data-science"],
                    goals: "Improve data analysis skills",
                },
            ];
        } catch (error) {
            console.error("Error loading mentorship data:", error);
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        // Create the mentorship panel
        const panelElement = document.createElement("div");
        panelElement.className = "mentorship-panel";
        panelElement.innerHTML = `
      <div class="panel-header">
        <h3>Mentorship Program</h3>
        ${
            this.currentUser.role === "mentee"
                ? '<button id="find-mentor-btn" class="btn btn-primary">Find a Mentor</button>'
                : '<button id="find-mentee-btn" class="btn btn-primary">Find a Mentee</button>'
        }
      </div>
      <div class="user-role">
        <p>You are currently registered as a <strong>${
            this.currentUser.role
        }</strong></p>
        ${
            this.currentUser.role === "mentee"
                ? '<button id="become-mentor-btn" class="btn btn-secondary">Become a Mentor</button>'
                : '<button id="become-mentee-btn" class="btn btn-secondary">Become a Mentee</button>'
        }
      </div>
      <div class="mentorship-content">
        ${
            this.currentUser.role === "mentee"
                ? this.renderMenteeView()
                : this.renderMentorView()
        }
      </div>
    `;

        container.innerHTML = "";
        container.appendChild(panelElement);

        // Add event listeners
        this.attachEventListeners();
    }

    renderMenteeView() {
        return `
      <div class="mentee-view">
        <h4>Find a Mentor</h4>
        <div class="search-bar">
          <input type="text" id="mentor-search" placeholder="Search mentors by expertise...">
          <button id="search-mentor-btn" class="btn btn-secondary">Search</button>
        </div>
        <div class="mentors-list">
          <h5>Recommended Mentors</h5>
          ${this.renderMentors()}
        </div>
        <div class="my-mentors">
          <h5>My Mentors</h5>
          <p>You currently don't have any mentors. Find a mentor to get started!</p>
        </div>
      </div>
    `;
    }

    renderMentorView() {
        return `
      <div class="mentor-view">
        <h4>Find a Mentee</h4>
        <div class="search-bar">
          <input type="text" id="mentee-search" placeholder="Search mentees by interests...">
          <button id="search-mentee-btn" class="btn btn-secondary">Search</button>
        </div>
        <div class="mentees-list">
          <h5>Recommended Mentees</h5>
          ${this.renderMentees()}
        </div>
        <div class="my-mentees">
          <h5>My Mentees</h5>
          <p>You currently don't have any mentees. Find a mentee to get started!</p>
        </div>
      </div>
    `;
    }

    renderMentors() {
        if (!this.mentors || this.mentors.length === 0) {
            return '<p class="no-mentors">No mentors found.</p>';
        }

        return this.mentors
            .map(
                (mentor) => `
      <div class="mentor-item" data-mentor-id="${mentor.id}">
        <div class="mentor-info">
          <h5>${mentor.name}</h5>
          <p class="mentor-expertise">${mentor.expertise.join(", ")}</p>
          <p class="mentor-bio">${mentor.bio}</p>
        </div>
        <div class="mentor-stats">
          <div class="stat">
            <span class="stat-label">Experience:</span>
            <span class="stat-value">${mentor.experience}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Rating:</span>
            <span class="stat-value">${this.renderRating(mentor.rating)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Mentees:</span>
            <span class="stat-value">${mentor.menteesCount}</span>
          </div>
        </div>
        <div class="mentor-actions">
          <button class="btn btn-primary request-mentorship-btn" data-mentor-id="${
              mentor.id
          }">Request Mentorship</button>
        </div>
      </div>
    `
            )
            .join("");
    }

    renderMentees() {
        if (!this.mentees || this.mentees.length === 0) {
            return '<p class="no-mentees">No mentees found.</p>';
        }

        return this.mentees
            .map(
                (mentee) => `
      <div class="mentee-item" data-mentee-id="${mentee.id}">
        <div class="mentee-info">
          <h5>${mentee.name}</h5>
          <p class="mentee-skills"><strong>Skills:</strong> ${mentee.skills.join(
              ", "
          )}</p>
          <p class="mentee-interests"><strong>Interests:</strong> ${mentee.interests.join(
              ", "
          )}</p>
          <p class="mentee-goals"><strong>Goals:</strong> ${mentee.goals}</p>
        </div>
        <div class="mentee-actions">
          <button class="btn btn-primary request-menteeship-btn" data-mentee-id="${
              mentee.id
          }">Offer Mentorship</button>
        </div>
      </div>
    `
            )
            .join("");
    }

    renderRating(rating) {
        // Render star rating
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let stars = "";
        for (let i = 0; i < fullStars; i++) {
            stars += "★";
        }
        if (halfStar) {
            stars += "☆"; // Half star representation
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += "☆";
        }

        return `${stars} (${rating})`;
    }

    attachEventListeners() {
        const findMentorBtn = document.getElementById("find-mentor-btn");
        if (findMentorBtn) {
            findMentorBtn.addEventListener("click", () => {
                this.showFindMentorView();
            });
        }

        const findMenteeBtn = document.getElementById("find-mentee-btn");
        if (findMenteeBtn) {
            findMenteeBtn.addEventListener("click", () => {
                this.showFindMenteeView();
            });
        }

        const becomeMentorBtn = document.getElementById("become-mentor-btn");
        if (becomeMentorBtn) {
            becomeMentorBtn.addEventListener("click", () => {
                this.becomeMentor();
            });
        }

        const becomeMenteeBtn = document.getElementById("become-mentee-btn");
        if (becomeMenteeBtn) {
            becomeMenteeBtn.addEventListener("click", () => {
                this.becomeMentee();
            });
        }

        const searchMentorBtn = document.getElementById("search-mentor-btn");
        if (searchMentorBtn) {
            searchMentorBtn.addEventListener("click", () => {
                this.searchMentors();
            });
        }

        const searchMenteeBtn = document.getElementById("search-mentee-btn");
        if (searchMenteeBtn) {
            searchMenteeBtn.addEventListener("click", () => {
                this.searchMentees();
            });
        }

        // Add click listeners to request mentorship buttons
        const requestMentorshipBtns = document.querySelectorAll(
            ".request-mentorship-btn"
        );
        requestMentorshipBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const mentorId = btn.getAttribute("data-mentor-id");
                this.requestMentorship(mentorId);
            });
        });

        // Add click listeners to request menteeship buttons
        const requestMenteeshipBtns = document.querySelectorAll(
            ".request-menteeship-btn"
        );
        requestMenteeshipBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const menteeId = btn.getAttribute("data-mentee-id");
                this.offerMentorship(menteeId);
            });
        });
    }

    showFindMentorView() {
        // This would show a detailed view for finding mentors
        alert(
            "In a real implementation, this would show a detailed view for finding mentors."
        );
    }

    showFindMenteeView() {
        // This would show a detailed view for finding mentees
        alert(
            "In a real implementation, this would show a detailed view for finding mentees."
        );
    }

    async becomeMentor() {
        // In a real implementation, this would call the knowledge sharing service
        this.currentUser.role = "mentor";
        this.render();
        console.log("User became a mentor");
    }

    async becomeMentee() {
        // In a real implementation, this would call the knowledge sharing service
        this.currentUser.role = "mentee";
        this.render();
        console.log("User became a mentee");
    }

    async searchMentors() {
        const query = document.getElementById("mentor-search").value;

        // In a real implementation, this would call the knowledge sharing service
        // For now, we'll filter the existing mentors
        if (query) {
            this.mentors = this.mentors.filter(
                (mentor) =>
                    mentor.name.toLowerCase().includes(query.toLowerCase()) ||
                    mentor.expertise.some((exp) =>
                        exp.toLowerCase().includes(query.toLowerCase())
                    )
            );
        } else {
            // Reload all mentors
            await this.loadMentorshipData();
        }

        this.render();
    }

    async searchMentees() {
        const query = document.getElementById("mentee-search").value;

        // In a real implementation, this would call the knowledge sharing service
        // For now, we'll filter the existing mentees
        if (query) {
            this.mentees = this.mentees.filter(
                (mentee) =>
                    mentee.name.toLowerCase().includes(query.toLowerCase()) ||
                    mentee.interests.some((interest) =>
                        interest.toLowerCase().includes(query.toLowerCase())
                    )
            );
        } else {
            // Reload all mentees
            await this.loadMentorshipData();
        }

        this.render();
    }

    async requestMentorship(mentorId) {
        // In a real implementation, this would call the knowledge sharing service
        const mentor = this.mentors.find((m) => m.id === mentorId);
        if (mentor) {
            alert(
                `Mentorship request sent to ${mentor.name}.\n\nIn a real implementation, this would send a request to the mentor.`
            );
            console.log("Mentorship requested from:", mentorId);
        }
    }

    async offerMentorship(menteeId) {
        // In a real implementation, this would call the knowledge sharing service
        const mentee = this.mentees.find((m) => m.id === menteeId);
        if (mentee) {
            alert(
                `Mentorship offer sent to ${mentee.name}.\n\nIn a real implementation, this would send an offer to the mentee.`
            );
            console.log("Mentorship offered to:", menteeId);
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }

        this.isInitialized = false;
        this.currentUser = null;
        this.mentors = [];
        this.mentees = [];
    }
}

// Add CSS styles
const style = document.createElement("style");
style.textContent = `
  .mentorship-panel {
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

  .user-role {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-role p {
    margin: 0;
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

  .mentors-list, .mentees-list, .my-mentors {
    margin-bottom: 30px;
  }

  .mentors-list h5, .mentees-list h5, .my-mentors h5 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .mentor-item, .mentee-item {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 15px;
  }

  .mentor-info h5, .mentee-info h5 {
    margin: 0 0 10px 0;
    color: #333;
  }

  .mentor-expertise, .mentee-skills, .mentee-interests, .mentee-goals {
    margin: 0 0 10px 0;
    font-size: 0.9em;
    color: #666;
  }

  .mentor-bio {
    margin: 0 0 15px 0;
    font-size: 0.9em;
    color: #555;
    line-height: 1.4;
  }

  .mentor-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }

  .stat {
    display: flex;
    gap: 5px;
  }

  .stat-label {
    font-weight: bold;
    color: #555;
  }

  .stat-value {
    color: #333;
  }

  .mentor-actions, .mentee-actions {
    padding-top: 15px;
    border-top: 1px solid #eee;
  }

  .no-mentors, .no-mentees {
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
`;

document.head.appendChild(style);

module.exports = MentorshipPanel;
