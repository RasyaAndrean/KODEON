// Training & Certification Services Component for KODEON IDE
class TrainingCertification {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.userAccount = null;
        this.certifications = [];
        this.courses = [];
    }

    async initialize() {
        this.isInitialized = true;

        // Load user data, certifications, and courses
        await this.loadUserData();
        await this.loadCertifications();
        await this.loadCourses();

        // Render the component
        this.render();

        console.log("Training & certification component initialized");
    }

    destroy() {
        this.isInitialized = false;
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }
        console.log("Training & certification component destroyed");
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

    async loadCertifications() {
        try {
            // In a real implementation, this would call the monetization service
            // For now, we'll use mock data
            this.certifications = [
                {
                    id: "cert-001",
                    name: "KODEON Fundamentals",
                    issuer: "KODEON Academy",
                    issuedDate: "2025-06-15T10:30:00Z",
                    expiryDate: "2028-06-15T10:30:00Z",
                    status: "active",
                    score: 92,
                    certificateUrl: "#",
                },
                {
                    id: "cert-002",
                    name: "Advanced KODEON Programming",
                    issuer: "KODEON Academy",
                    issuedDate: "2025-08-20T14:15:00Z",
                    expiryDate: "2028-08-20T14:15:00Z",
                    status: "active",
                    score: 87,
                    certificateUrl: "#",
                },
            ];
        } catch (error) {
            console.error("Error loading certifications:", error);
            this.certifications = [];
        }
    }

    async loadCourses() {
        try {
            // In a real implementation, this would call the monetization service
            // For now, we'll use mock data
            this.courses = [
                {
                    id: "course-001",
                    name: "KODEON for Beginners",
                    description:
                        "Learn the basics of KODEON programming language",
                    duration: "8 hours",
                    level: "Beginner",
                    progress: 100,
                    status: "completed",
                    nextCourse: "course-002",
                },
                {
                    id: "course-002",
                    name: "Intermediate KODEON",
                    description: "Build more complex applications with KODEON",
                    duration: "12 hours",
                    level: "Intermediate",
                    progress: 75,
                    status: "in-progress",
                    nextCourse: "course-003",
                },
                {
                    id: "course-003",
                    name: "Advanced KODEON Patterns",
                    description: "Master design patterns and advanced concepts",
                    duration: "16 hours",
                    level: "Advanced",
                    progress: 0,
                    status: "not-started",
                    nextCourse: null,
                },
                {
                    id: "course-004",
                    name: "KODEON for Web Development",
                    description: "Build web applications with KODEON",
                    duration: "10 hours",
                    level: "Intermediate",
                    progress: 0,
                    status: "not-started",
                    nextCourse: null,
                },
            ];
        } catch (error) {
            console.error("Error loading courses:", error);
            this.courses = [];
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="training-certification-container">
                <div class="training-header">
                    <h2>Training & Certification</h2>
                    <div class="header-actions">
                        <button id="view-certifications-btn" class="btn btn-secondary">My Certifications</button>
                        <button id="browse-courses-btn" class="btn btn-primary">Browse Courses</button>
                    </div>
                </div>

                <div class="training-content">
                    <div class="certifications-section">
                        <h3>My Certifications</h3>
                        <div id="certifications-list" class="certifications-list">
                            ${this.renderCertificationsList()}
                        </div>
                    </div>

                    <div class="courses-section">
                        <h3>My Learning Path</h3>
                        <div id="courses-list" class="courses-list">
                            ${this.renderCoursesList()}
                        </div>
                    </div>

                    <div class="training-info">
                        <div class="training-packages">
                            <h3>Training Service Packages</h3>
                            <div class="package-card">
                                <h4>On-site Training Workshops</h4>
                                <p>Hands-on workshops at your location</p>
                                <p>Custom curriculum development</p>
                                <p>Expert instructors</p>
                                <p class="price">From $500/day</p>
                            </div>

                            <div class="package-card highlighted">
                                <h4>Custom Curriculum Development</h4>
                                <p>Tailored training programs for your team</p>
                                <p>Industry-specific examples</p>
                                <p>Progress tracking and reporting</p>
                                <p class="price">From $2000/project</p>
                            </div>

                            <div class="package-card">
                                <h4>Certification Exam Administration</h4>
                                <p>Official KODEON certification exams</p>
                                <p>Proctored testing environment</p>
                                <p>Detailed performance reports</p>
                                <p class="price">From $100/exam</p>
                            </div>

                            <div class="package-card">
                                <h4>Team Assessment & Skill Gap Analysis</h4>
                                <p>Comprehensive team skill evaluation</p>
                                <p>Personalized learning recommendations</p>
                                <p>ROI tracking and metrics</p>
                                <p class="price">From $1500/assessment</p>
                            </div>
                        </div>

                        <div class="certification-process">
                            <h3>Certification Process</h3>
                            <div class="process-steps">
                                <div class="step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h4>Enroll in Certification Program</h4>
                                        <p>Select your certification track</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h4>Complete Required Training</h4>
                                        <p>Finish courses and hands-on labs</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h4>Take Certification Exam</h4>
                                        <p>Pass the official certification exam</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <h4>Receive Certification</h4>
                                        <p>Get your official certificate and badge</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="course-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Course Details</h3>
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            <div id="course-details-content"></div>
                        </div>
                    </div>
                </div>

                <div id="certification-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Certification Details</h3>
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            <div id="certification-details-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderCertificationsList() {
        if (this.certifications.length === 0) {
            return '<p class="no-certifications">You have no certifications yet.</p>';
        }

        return this.certifications
            .map(
                (cert) => `
            <div class="certification-item" data-cert-id="${cert.id}">
                <div class="certification-header">
                    <h4>${cert.name}</h4>
                    <span class="certification-status ${cert.status}">${
                    cert.status
                }</span>
                </div>
                <div class="certification-details">
                    <p>Issuer: ${cert.issuer}</p>
                    <p>Score: ${cert.score}/100</p>
                    <p>Issued: ${new Date(
                        cert.issuedDate
                    ).toLocaleDateString()}</p>
                    <p>Expires: ${new Date(
                        cert.expiryDate
                    ).toLocaleDateString()}</p>
                </div>
                <div class="certification-actions">
                    <button class="btn btn-small btn-secondary view-cert-btn" data-cert-id="${
                        cert.id
                    }">View Certificate</button>
                </div>
            </div>
        `
            )
            .join("");
    }

    renderCoursesList() {
        if (this.courses.length === 0) {
            return '<p class="no-courses">You have no courses in your learning path.</p>';
        }

        return this.courses
            .map(
                (course) => `
            <div class="course-item" data-course-id="${course.id}">
                <div class="course-header">
                    <h4>${course.name}</h4>
                    <span class="course-status ${
                        course.status
                    }">${course.status.replace("-", " ")}</span>
                </div>
                <div class="course-details">
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span class="course-duration">Duration: ${
                            course.duration
                        }</span>
                        <span class="course-level">Level: ${course.level}</span>
                    </div>
                    ${
                        course.progress > 0
                            ? `
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <span class="progress-text">${course.progress}% complete</span>
                    </div>
                    `
                            : ""
                    }
                </div>
                <div class="course-actions">
                    <button class="btn btn-small btn-primary view-course-btn" data-course-id="${
                        course.id
                    }">
                        ${
                            course.status === "not-started"
                                ? "Start Course"
                                : course.status === "in-progress"
                                ? "Continue"
                                : "Review"
                        }
                    </button>
                </div>
            </div>
        `
            )
            .join("");
    }

    attachEventListeners() {
        // View certifications button
        const viewCertificationsBtn = document.getElementById(
            "view-certifications-btn"
        );
        if (viewCertificationsBtn) {
            viewCertificationsBtn.addEventListener("click", () => {
                document
                    .querySelector(".certifications-section")
                    .scrollIntoView({ behavior: "smooth" });
            });
        }

        // Browse courses button
        const browseCoursesBtn = document.getElementById("browse-courses-btn");
        if (browseCoursesBtn) {
            browseCoursesBtn.addEventListener("click", () => {
                document
                    .querySelector(".courses-section")
                    .scrollIntoView({ behavior: "smooth" });
            });
        }

        // Close modals
        const closeButtons = document.querySelectorAll(".modal .close");
        closeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const modal = button.closest(".modal");
                if (modal) {
                    modal.style.display = "none";
                }
            });
        });

        // View course buttons
        const viewCourseButtons = document.querySelectorAll(".view-course-btn");
        viewCourseButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const courseId = e.target.getAttribute("data-course-id");
                this.showCourseDetails(courseId);
            });
        });

        // View certificate buttons
        const viewCertButtons = document.querySelectorAll(".view-cert-btn");
        viewCertButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const certId = e.target.getAttribute("data-cert-id");
                this.showCertificationDetails(certId);
            });
        });

        // Course item clicks
        const courseItems = document.querySelectorAll(".course-item");
        courseItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                // Only trigger if not clicking on a button
                if (!e.target.classList.contains("btn")) {
                    const courseId = item.getAttribute("data-course-id");
                    this.showCourseDetails(courseId);
                }
            });
        });

        // Certification item clicks
        const certItems = document.querySelectorAll(".certification-item");
        certItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                // Only trigger if not clicking on a button
                if (!e.target.classList.contains("btn")) {
                    const certId = item.getAttribute("data-cert-id");
                    this.showCertificationDetails(certId);
                }
            });
        });
    }

    showCourseDetails(courseId) {
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) return;

        const content = document.getElementById("course-details-content");
        if (content) {
            content.innerHTML = `
                <div class="course-detail">
                    <h3>${course.name}</h3>
                    <p class="course-description">${course.description}</p>

                    <div class="course-detail-meta">
                        <div class="meta-item">
                            <strong>Duration:</strong> ${course.duration}
                        </div>
                        <div class="meta-item">
                            <strong>Level:</strong> ${course.level}
                        </div>
                        <div class="meta-item">
                            <strong>Status:</strong> <span class="course-status ${
                                course.status
                            }">${course.status.replace("-", " ")}</span>
                        </div>
                        ${
                            course.progress > 0
                                ? `
                        <div class="meta-item">
                            <strong>Progress:</strong> ${course.progress}%
                        </div>
                        `
                                : ""
                        }
                    </div>

                    ${
                        course.progress > 0
                            ? `
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                    `
                            : ""
                    }

                    <div class="course-actions-detail">
                        <button class="btn btn-primary start-course-btn" data-course-id="${
                            course.id
                        }">
                            ${
                                course.status === "not-started"
                                    ? "Start Course"
                                    : course.status === "in-progress"
                                    ? "Continue Course"
                                    : "Review Course"
                            }
                        </button>
                        ${
                            course.nextCourse
                                ? `
                        <button class="btn btn-secondary next-course-btn" data-course-id="${course.nextCourse}">
                            Next Course
                        </button>
                        `
                                : ""
                        }
                    </div>

                    <div class="course-outline">
                        <h4>Course Outline</h4>
                        <ul>
                            <li>Introduction to ${course.name}</li>
                            <li>Core Concepts and Principles</li>
                            <li>Hands-on Exercises</li>
                            <li>Real-world Projects</li>
                            <li>Assessment and Certification</li>
                        </ul>
                    </div>
                </div>
            `;

            // Attach event listeners for detail buttons
            const startCourseBtn = content.querySelector(".start-course-btn");
            if (startCourseBtn) {
                startCourseBtn.addEventListener("click", (e) => {
                    const courseId = e.target.getAttribute("data-course-id");
                    this.startCourse(courseId);
                });
            }

            const nextCourseBtn = content.querySelector(".next-course-btn");
            if (nextCourseBtn) {
                nextCourseBtn.addEventListener("click", (e) => {
                    const courseId = e.target.getAttribute("data-course-id");
                    this.showCourseDetails(courseId);
                    document.getElementById("course-modal").style.display =
                        "none";
                });
            }
        }

        const modal = document.getElementById("course-modal");
        if (modal) {
            modal.style.display = "block";
        }
    }

    showCertificationDetails(certId) {
        const cert = this.certifications.find((c) => c.id === certId);
        if (!cert) return;

        const content = document.getElementById(
            "certification-details-content"
        );
        if (content) {
            content.innerHTML = `
                <div class="certification-detail">
                    <h3>${cert.name}</h3>
                    <p class="certification-issuer">Issued by ${cert.issuer}</p>

                    <div class="certification-detail-meta">
                        <div class="meta-item">
                            <strong>Status:</strong> <span class="certification-status ${
                                cert.status
                            }">${cert.status}</span>
                        </div>
                        <div class="meta-item">
                            <strong>Score:</strong> ${cert.score}/100
                        </div>
                        <div class="meta-item">
                            <strong>Issued Date:</strong> ${new Date(
                                cert.issuedDate
                            ).toLocaleDateString()}
                        </div>
                        <div class="meta-item">
                            <strong>Expiry Date:</strong> ${new Date(
                                cert.expiryDate
                            ).toLocaleDateString()}
                        </div>
                    </div>

                    <div class="certification-badge">
                        <div class="badge">
                            <div class="badge-icon">🏆</div>
                            <div class="badge-text">KODEON Certified</div>
                        </div>
                    </div>

                    <div class="certification-actions-detail">
                        <button class="btn btn-primary download-cert-btn" data-cert-id="${
                            cert.id
                        }">
                            Download Certificate
                        </button>
                        <button class="btn btn-secondary share-cert-btn" data-cert-id="${
                            cert.id
                        }">
                            Share Certificate
                        </button>
                    </div>

                    <div class="certification-info">
                        <h4>About this Certification</h4>
                        <p>This certification validates your proficiency in ${
                            cert.name
                        }, demonstrating your ability to apply advanced concepts and best practices in real-world scenarios.</p>

                        <h4>Skills Validated</h4>
                        <ul>
                            <li>Core language syntax and semantics</li>
                            <li>Advanced programming patterns</li>
                            <li>Debugging and optimization techniques</li>
                            <li>Best practices and coding standards</li>
                        </ul>
                    </div>
                </div>
            `;

            // Attach event listeners for detail buttons
            const downloadCertBtn = content.querySelector(".download-cert-btn");
            if (downloadCertBtn) {
                downloadCertBtn.addEventListener("click", (e) => {
                    const certId = e.target.getAttribute("data-cert-id");
                    this.downloadCertificate(certId);
                });
            }

            const shareCertBtn = content.querySelector(".share-cert-btn");
            if (shareCertBtn) {
                shareCertBtn.addEventListener("click", (e) => {
                    const certId = e.target.getAttribute("data-cert-id");
                    this.shareCertificate(certId);
                });
            }
        }

        const modal = document.getElementById("certification-modal");
        if (modal) {
            modal.style.display = "block";
        }
    }

    startCourse(courseId) {
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) return;

        // In a real implementation, this would start the course
        console.log("Starting course:", course.name);
        alert(
            `Starting course: ${course.name}\n\nYou will be redirected to the course content.`
        );

        // Close the modal
        document.getElementById("course-modal").style.display = "none";
    }

    downloadCertificate(certId) {
        const cert = this.certifications.find((c) => c.id === certId);
        if (!cert) return;

        // In a real implementation, this would download the certificate
        console.log("Downloading certificate:", cert.name);
        alert(
            `Downloading certificate: ${cert.name}\n\nIn a real implementation, this would download your official certificate.`
        );
    }

    shareCertificate(certId) {
        const cert = this.certifications.find((c) => c.id === certId);
        if (!cert) return;

        // In a real implementation, this would share the certificate
        console.log("Sharing certificate:", cert.name);
        alert(
            `Sharing certificate: ${cert.name}\n\nIn a real implementation, this would allow you to share your certificate on social media or via email.`
        );
    }
}

module.exports = TrainingCertification;
