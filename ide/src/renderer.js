// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// Import required modules
const LearningPathComponent = require("./components/learning-path");
const GoalsDashboardComponent = require("./components/goals-dashboard");
const AnalyticsDashboardComponent = require("./components/analytics-dashboard");
const WorkspacesPanelComponent = require("./components/collaboration/workspaces-panel");
const CodeReviewPanelComponent = require("./components/collaboration/code-review-panel");
const VersionControlPanelComponent = require("./components/collaboration/version-control-panel");
const {
    DocumentationPanel,
    QAPanel,
    ProjectsPanel,
    MentorshipPanel,
} = require("./components/knowledge-sharing");
const featureGating = require("./utils/feature-gating");
const usageTracking = require("./utils/usage-tracking");
const subscriptionReminder = require("./utils/subscription-reminder");
const trialManager = require("./utils/trial-manager");

// Initialize Monaco Editor
require.config({ paths: { vs: "node_modules/monaco-editor/min/vs" } });
require(["vs/editor/editor.main"], async function () {
    // Define KODEON language
    monaco.languages.register({ id: "kodeon" });

    // Define KODEON language configuration
    monaco.languages.setLanguageConfiguration("kodeon", {
        comments: {
            lineComment: "//",
        },
        brackets: [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"],
        ],
        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
        surroundingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
    });

    // Define KODEON language syntax highlighting
    monaco.languages.setMonarchTokensProvider("kodeon", {
        keywords: [
            "buat",
            "create",
            "jika",
            "if",
            "fungsi",
            "function",
            "kelas",
            "class",
            "tampilkan",
            "show",
            "kembalikan",
            "return",
            "selama",
            "while",
            "untuk",
            "for",
            "dalam",
            "in",
            "dan",
            "and",
            "atau",
            "or",
            "bukan",
            "not",
            "benar",
            "true",
            "salah",
            "false",
            "nol",
            "null",
            "tidak_ada",
            "none",
            "impor",
            "import",
            "dari",
            "from",
            "sebagai",
            "as",
            "coba",
            "try",
            "tangkap",
            "catch",
            "lempar",
            "throw",
            "baru",
            "new",
            "ini",
            "this",
            "turunan",
            "extends",
            "konstruktor",
            "constructor",
        ],
        operators: [
            "=",
            ">",
            "<",
            "!",
            "~",
            "?",
            ":",
            "==",
            "<=",
            ">=",
            "!=",
            "&&",
            "||",
            "++",
            "--",
            "+",
            "-",
            "*",
            "/",
            "&",
            "|",
            "^",
            "%",
            "<<",
            ">>",
            ">>>",
            "+=",
            "-=",
            "*=",
            "/=",
            "&=",
            "|=",
            "^=",
            "%=",
            "<<=",
            ">>=",
            ">>>=",
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
            root: [
                [
                    /[a-zA-Z_$][\w$]*/,
                    {
                        cases: {
                            "@keywords": "keyword",
                            "@default": "identifier",
                        },
                    },
                ],
                { include: "@whitespace" },
                [/[{}()\[\]]/, "@brackets"],
                [/[<>](?!@symbols)/, "@brackets"],
                [
                    /@symbols/,
                    {
                        cases: {
                            "@operators": "operator",
                            "@default": "",
                        },
                    },
                ],
                [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
                [/\d+/, "number"],
                [/[;,.]/, "delimiter"],
                [/"([^"\\]|\\.)*$/, "string.invalid"],
                [/'([^'\\]|\\.)*$/, "string.invalid"],
                [/"/, "string", "@string_double"],
                [/'/, "string", "@string_single"],
            ],
            whitespace: [
                [/[ \t\r\n]+/, "white"],
                [/\/\*/, "comment", "@comment"],
                [/\/\//, "comment"],
            ],
            comment: [
                [/[^\/*]+/, "comment"],
                [/\*\//, "comment", "@pop"],
                [/[\/*]/, "comment"],
            ],
            string_double: [
                [/[^\\"]+/, "string"],
                [/\\./, "string.escape.invalid"],
                [/"/, "string", "@pop"],
            ],
            string_single: [
                [/[^\\']+/, "string"],
                [/\\./, "string.escape.invalid"],
                [/'/, "string", "@pop"],
            ],
        },
    });

    // Initialize feature gating
    await featureGating.initialize();

    // Initialize usage tracking
    await usageTracking.initialize();

    // Initialize subscription reminder
    await subscriptionReminder.initialize();

    // Initialize trial manager
    await trialManager.initialize();

    // Define KODEON language completion items
    monaco.languages.registerCompletionItemProvider("kodeon", {
        provideCompletionItems: async function (model, position) {
            // Check if AI code assistance is available (Pro feature)
            const isAvailable = await featureGating.isFeatureAvailable(
                "ai-code-assistance"
            );

            if (!isAvailable) {
                // Return empty suggestions for free users
                return { suggestions: [] };
            }

            // Track AI assistance usage
            await usageTracking.incrementUsage("aiAssistance");

            // Get current context
            const code = model.getValue();
            const context = {
                code: code,
                position: position,
                language: "kodeon",
            };

            try {
                // Get suggestions from AI service
                const response = await window.electronAPI.getCodeSuggestions(
                    context
                );

                if (response.suggestions && response.suggestions.length > 0) {
                    return {
                        suggestions: response.suggestions.map((suggestion) => ({
                            label: suggestion.label,
                            kind:
                                monaco.languages.CompletionItemKind[
                                    suggestion.kind
                                ] ||
                                monaco.languages.CompletionItemKind.Function,
                            insertText: suggestion.insertText,
                            detail: suggestion.detail,
                            sortText: suggestion.score
                                ? String(1000 - suggestion.score)
                                : "0", // Higher score = lower sort number
                        })),
                    };
                }
            } catch (error) {
                console.error("Error getting code suggestions:", error);
            }
        },
    });

    // Create the editor
    const editor = monaco.editor.create(document.getElementById("editor"), {
        value: "// Welcome to KODEON IDE\n// Write your code here\n\n",
        language: "kodeon",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: {
            enabled: true,
        },
    });

    // Store reference to editor
    window.editor = editor;

    // Handle file operations
    window.electronAPI.onNewFile(() => {
        editor.setValue("");
    });

    window.electronAPI.onOpenFile((_, content) => {
        editor.setValue(content);
    });

    window.electronAPI.onSaveFile((_, content) => {
        // File saving is handled in main process
    });

    // Handle run button
    document.getElementById("run-btn").addEventListener("click", async () => {
        const code = editor.getValue();

        // Track progress
        try {
            await window.electronAPI.trackProgress("user-123", {
                type: "program_run",
            });
        } catch (error) {
            console.error("Error tracking progress:", error);
        }

        // In a real implementation, this would run the code
        alert("Running code:\n\n" + code);
    });

    // Handle debug button
    document.getElementById("debug-btn").addEventListener("click", () => {
        const code = editor.getValue();
        // In a real implementation, this would start debugging
        alert("Debugging code:\n\n" + code);
    });

    // Handle AI Assistant button
    document
        .getElementById("ai-assistant-btn")
        .addEventListener("click", () => {
            document.getElementById("ai-assistant-modal").style.display =
                "block";
        });

    // Handle AI Assistant close button
    document
        .querySelector("#ai-assistant-modal .close")
        .addEventListener("click", () => {
            document.getElementById("ai-assistant-modal").style.display =
                "none";
        });

    // Handle tab switching
    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and panes
            document
                .querySelectorAll(".tab")
                .forEach((t) => t.classList.remove("active"));
            document
                .querySelectorAll(".tab-pane")
                .forEach((p) => p.classList.remove("active"));

            // Add active class to clicked tab
            tab.classList.add("active");

            // Show corresponding pane
            const tabName = tab.getAttribute("data-tab");
            document.getElementById(`${tabName}-tab`).classList.add("active");
        });
    });

    // Handle AI Assistant process button
    document
        .getElementById("ai-process-btn")
        .addEventListener("click", async () => {
            // Check if advanced AI assistance is available (Pro feature)
            const isAvailable = await featureGating.isFeatureAvailable(
                "ai-code-assistance"
            );

            if (!isAvailable) {
                featureGating.showUpgradeMessage("ai-code-assistance");
                return;
            }

            // Track AI assistance usage
            await usageTracking.incrementUsage("aiAssistance");

            const input = document.getElementById("ai-input").value;

            try {
                const response = await window.electronAPI.parseNaturalLanguage(
                    input
                );

                if (response.error) {
                    document.getElementById("ai-output").textContent =
                        "Error: " + response.error;
                } else {
                    document.getElementById("ai-output").textContent =
                        response.generatedCode || "No code generated";
                }
            } catch (error) {
                console.error("Error processing natural language:", error);
                document.getElementById("ai-output").textContent =
                    "Error: " + error.message;
            }
        });

    // Handle AI Assistant complex request button
    document
        .getElementById("ai-complex-btn")
        .addEventListener("click", async () => {
            // Check if advanced AI assistance is available (Pro feature)
            const isAvailable = await featureGating.isFeatureAvailable(
                "ai-code-assistance"
            );

            if (!isAvailable) {
                featureGating.showUpgradeMessage("ai-code-assistance");
                return;
            }

            // Track AI assistance usage
            await usageTracking.incrementUsage("aiAssistance");

            const input = document.getElementById("ai-input").value;

            try {
                const response = await window.electronAPI.parseComplexRequest(
                    input
                );

                if (response.error) {
                    document.getElementById("ai-output").textContent =
                        "Error: " + response.error;
                } else {
                    let output = response.generatedCode || "No code generated";

                    if (response.steps && response.steps.length > 0) {
                        output = "Steps to implement:\n";
                        response.steps.forEach((step, index) => {
                            output += `${index + 1}. ${step.description}\n`;
                        });
                        output +=
                            "\nGenerated code:\n" +
                            (response.generatedCode || "");
                    }

                    document.getElementById("ai-output").textContent = output;
                }
            } catch (error) {
                console.error("Error processing complex request:", error);
                document.getElementById("ai-output").textContent =
                    "Error: " + error.message;
            }
        });

    // Handle AI Assistant analyze button
    document
        .getElementById("ai-analyze-btn")
        .addEventListener("click", async () => {
            // Check if advanced AI assistance is available (Pro feature)
            const isAvailable = await featureGating.isFeatureAvailable(
                "ai-code-assistance"
            );

            if (!isAvailable) {
                featureGating.showUpgradeMessage("ai-code-assistance");
                return;
            }

            // Track AI assistance usage
            await usageTracking.incrementUsage("aiAssistance");

            const code = editor.getValue();

            try {
                // Analyze code quality
                const qualityResponse =
                    await window.electronAPI.analyzeCodeQuality(code);

                // Get refactoring suggestions
                const refactoringResponse =
                    await window.electronAPI.getRefactoringSuggestions(code);

                // Scan for security issues
                const securityResponse =
                    await window.electronAPI.scanForSecurityIssues(code);

                // Display results in a structured format
                let output = `<div class="quality-score quality-${
                    qualityResponse.overallQuality >= 70
                        ? "high"
                        : qualityResponse.overallQuality >= 40
                        ? "medium"
                        : "low"
                }">
                    Overall Code Quality: ${qualityResponse.overallQuality}/100
                </div>`;

                // Quality Issues Section
                if (
                    qualityResponse.issues &&
                    qualityResponse.issues.length > 0
                ) {
                    output += `<div class="analysis-section">
                        <h3>_quality Issues</h3>`;
                    for (const issue of qualityResponse.issues) {
                        const priorityClass =
                            issue.priority === "high"
                                ? "issue-high"
                                : issue.priority === "medium"
                                ? "issue-medium"
                                : "issue-low";
                        output += `<div class="issue-item ${priorityClass}">
                            <strong>${issue.message}</strong>
                            ${
                                issue.location?.line
                                    ? `<br>Line: ${issue.location.line}`
                                    : ""
                            }
                        </div>`;
                    }
                    output += `</div>`;
                } else {
                    output += `<div class="analysis-section">
                        <h3>_quality Issues</h3>
                        <p>No quality issues found.</p>
                    </div>`;
                }

                // Refactoring Suggestions Section
                if (refactoringResponse && refactoringResponse.length > 0) {
                    output += `<div class="analysis-section">
                        <h3>Refactoring Suggestions</h3>`;
                    for (const suggestion of refactoringResponse) {
                        output += `<div class="suggestion-item">
                            <h4>${suggestion.message}</h4>
                            <p>${
                                suggestion.suggestion ||
                                "No specific suggestion provided"
                            }</p>
                            ${
                                suggestion.location?.line
                                    ? `<p><em>Line: ${suggestion.location.line}</em></p>`
                                    : ""
                            }
                        </div>`;
                    }
                    output += `</div>`;
                } else {
                    output += `<div class="analysis-section">
                        <h3>Refactoring Suggestions</h3>
                        <p>No refactoring suggestions.</p>
                    </div>`;
                }

                // Security Issues Section
                if (securityResponse && securityResponse.length > 0) {
                    output += `<div class="analysis-section">
                        <h3>Security Issues</h3>`;
                    for (const issue of securityResponse) {
                        output += `<div class="security-item">
                            <h4>${issue.message}</h4>
                            <p>${
                                issue.suggestion ||
                                "No specific suggestion provided"
                            }</p>
                            ${
                                issue.location?.line
                                    ? `<p><em>Line: ${issue.location.line}</em></p>`
                                    : ""
                            }
                        </div>`;
                    }
                    output += `</div>`;
                } else {
                    output += `<div class="analysis-section">
                        <h3>Security Issues</h3>
                        <p>No security issues found.</p>
                    </div>`;
                }

                document.getElementById("analysis-output").innerHTML = output;
            } catch (error) {
                console.error("Error analyzing code:", error);
                document.getElementById(
                    "analysis-output"
                ).innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });

    // Handle AI Assistant documentation button
    document
        .getElementById("ai-doc-btn")
        .addEventListener("click", async () => {
            // Check if advanced AI assistance is available (Pro feature)
            const isAvailable = await featureGating.isFeatureAvailable(
                "ai-code-assistance"
            );

            if (!isAvailable) {
                featureGating.showUpgradeMessage("ai-code-assistance");
                return;
            }

            // Track AI assistance usage
            await usageTracking.incrementUsage("aiAssistance");

            const code = editor.getValue();

            try {
                const response =
                    await window.electronAPI.generateDocumentationForCode(code);

                if (response.error) {
                    document.getElementById(
                        "docs-output"
                    ).innerHTML = `<p>Error: ${response.error}</p>`;
                } else {
                    document.getElementById("docs-output").innerHTML = `<pre>${
                        response || "No documentation generated"
                    }</pre>`;
                }
            } catch (error) {
                console.error("Error generating documentation:", error);
                document.getElementById(
                    "docs-output"
                ).innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });

    // Handle AI Assistant improve button
    document
        .getElementById("ai-improve-btn")
        .addEventListener("click", async () => {
            // Check if advanced AI assistance is available (Pro feature)
            const isAvailable = await featureGating.isFeatureAvailable(
                "ai-code-assistance"
            );

            if (!isAvailable) {
                featureGating.showUpgradeMessage("ai-code-assistance");
                return;
            }

            // Track AI assistance usage
            await usageTracking.incrementUsage("aiAssistance");

            const code = editor.getValue();

            try {
                // First, get refactoring suggestions
                const refactoringResponse =
                    await window.electronAPI.getRefactoringSuggestions(code);

                // Then, improve code with suggestions
                const response =
                    await window.electronAPI.improveCodeWithSuggestions(
                        code,
                        refactoringResponse
                    );

                if (response.error) {
                    document.getElementById(
                        "improve-output"
                    ).innerHTML = `<p>Error: ${response.error}</p>`;
                } else {
                    // Display suggestions in the improve output
                    let output = `<div class="analysis-section">
                        <h3>Applied Improvements</h3>
                        <p>Code has been analyzed and improved based on suggestions.</p>
                    </div>`;

                    if (refactoringResponse && refactoringResponse.length > 0) {
                        output += `<div class="analysis-section">
                            <h3>Refactoring Suggestions Applied</h3>`;
                        for (const suggestion of refactoringResponse) {
                            output += `<div class="suggestion-item">
                                <h4>${suggestion.message}</h4>
                                <p>${
                                    suggestion.suggestion ||
                                    "No specific suggestion provided"
                                }</p>
                            </div>`;
                        }
                        output += `</div>`;
                    }

                    document.getElementById("improve-output").innerHTML =
                        output;
                }
            } catch (error) {
                console.error("Error improving code:", error);
                document.getElementById(
                    "improve-output"
                ).innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });

    // Handle menu events
    window.electronAPI.onMenuNewFile(() => {
        editor.setValue("");
    });

    window.electronAPI.onMenuOpenFile((_, content) => {
        editor.setValue(content);
    });

    window.electronAPI.onMenuSaveFile(() => {
        const content = editor.getValue();
        // Send to main process to save
        window.electronAPI.saveFile(content);
    });

    window.electronAPI.onMenuSaveFileAs(() => {
        const content = editor.getValue();
        // Send to main process to save as
        window.electronAPI.saveFileAs(content);
    });

    window.electronAPI.onMenuAiAssistant(() => {
        document.getElementById("ai-assistant-modal").style.display = "block";
    });

    window.electronAPI.onMenuDebugProgram(() => {
        const code = editor.getValue();
        // In a real implementation, this would start debugging
        alert("Debugging code:\n\n" + code);
    });

    window.electronAPI.onMenuRunProgram(() => {
        const code = editor.getValue();

        // Track progress
        try {
            window.electronAPI.trackProgress("user-123", {
                type: "program_run",
            });
        } catch (error) {
            console.error("Error tracking progress:", error);
        }

        // In a real implementation, this would run the code
        alert("Running code:\n\n" + code);
    });

    window.electronAPI.onMenuSkillAssessment(() => {
        showSkillAssessment();
    });

    window.electronAPI.onMenuLearningPaths(() => {
        showLearningPaths();
    });

    window.electronAPI.onMenuGoalsDashboard(() => {
        showGoalsDashboard();
    });

    window.electronAPI.onMenuAnalyticsDashboard(() => {
        showAnalyticsDashboard();
    });

    window.electronAPI.onMenuDocumentation(() => {
        alert("Documentation would be shown here");
    });

    window.electronAPI.onMenuTutorials(() => {
        alert("Tutorials would be shown here");
    });

    window.electronAPI.onMenuAbout(() => {
        alert("KODEON IDE v1.0\nA programming language for everyone");
    });

    // Handle collaboration menu events
    window.electronAPI.onMenuWorkspaces(() => {
        showWorkspacesPanel();
    });

    window.electronAPI.onMenuCodeReview(() => {
        showCodeReviewPanel();
    });

    window.electronAPI.onMenuVersionControl(() => {
        showVersionControlPanel();
    });

    // Handle knowledge sharing menu events
    window.electronAPI.onMenuDocumentationPlatform(() => {
        showDocumentationPanel();
    });

    window.electronAPI.onMenuQaPlatform(() => {
        showQAPanel();
    });

    window.electronAPI.onMenuProjectSharing(() => {
        showProjectsPanel();
    });

    window.electronAPI.onMenuMentorshipMatching(() => {
        showMentorshipPanel();
    });

    // Handle knowledge sharing menu events
    window.electronAPI.onMenuDocumentationPlatform(() => {
        showDocumentationPanel();
    });

    window.electronAPI.onMenuQaPlatform(() => {
        showQAPanel();
    });

    window.electronAPI.onMenuProjectSharing(() => {
        showProjectsPanel();
    });

    window.electronAPI.onMenuMentorshipMatching(() => {
        showMentorshipPanel();
    });

    // Handle monetization menu events
    window.electronAPI.onMenuSubscriptionManagement(() => {
        showSubscriptionManagement();
    });

    window.electronAPI.onMenuBillingHistory(() => {
        showBillingHistory();
    });

    window.electronAPI.onMenuUpgradePro(() => {
        showUpgradePro();
    });

    window.electronAPI.onMenuMonetizationAnalytics(() => {
        showMonetizationAnalytics();
    });

    window.electronAPI.onMenuPlanComparison(() => {
        showPlanComparison();
    });

    window.electronAPI.onMenuCustomerSupport(() => {
        showCustomerSupport();
    });

    window.electronAPI.onMenuProfessionalSupport(() => {
        showProfessionalSupport();
    });

    window.electronAPI.onMenuCustomDevelopment(() => {
        showCustomDevelopment();
    });

    window.electronAPI.onMenuTrainingCertification(() => {
        showTrainingCertification();
    });

    window.electronAPI.onMenuReferralProgram(() => {
        showReferralProgram();
    });

    window.electronAPI.onMenuAffiliateDashboard(() => {
        showAffiliateDashboard();
    });

    window.electronAPI.onMenuEducationalLicensing(() => {
        showEducationalLicensing();
    });

    window.electronAPI.onMenuMarketplace(() => {
        showMarketplace();
    });

    // Show skill assessment modal
    async function showSkillAssessment() {
        // Create skill assessment modal
        const modal = document.createElement("div");
        modal.id = "skill-assessment-modal";
        modal.className = "modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Skill Assessment</div>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <p>Write some code to assess your skill level:</p>
          <div id="assessment-editor" style="height: 300px; border: 1px solid #ccc;"></div>
          <div class="form-group">
            <button class="btn" id="assess-btn">Assess My Skills</button>
          </div>
          <div id="assessment-results"></div>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Create assessment editor
        const assessmentEditor = monaco.editor.create(
            document.getElementById("assessment-editor"),
            {
                value: "// Write some code to demonstrate your skills\n\n",
                language: "kodeon",
                theme: "vs-dark",
                automaticLayout: true,
            }
        );

        // Add event listeners
        modal.querySelector(".close").addEventListener("click", () => {
            document.body.removeChild(modal);
            assessmentEditor.dispose();
        });

        document
            .getElementById("assess-btn")
            .addEventListener("click", async () => {
                const code = assessmentEditor.getValue();

                try {
                    const response = await window.electronAPI.assessSkillLevel([
                        code,
                    ]);

                    if (response.error) {
                        document.getElementById(
                            "assessment-results"
                        ).innerHTML = `<p>Error: ${response.error}</p>`;
                    } else {
                        document.getElementById(
                            "assessment-results"
                        ).innerHTML = `
            <h3>Skill Assessment Results</h3>
            <p><strong>Overall Skill Level:</strong> ${
                response.overallSkill.level
            } (${response.overallSkill.score}/100)</p>
            <h4>Detailed Breakdown:</h4>
            <ul>
              <li>Syntax: ${Math.round(
                  response.overallSkill.breakdown.syntax
              )}/100</li>
              <li>Control Flow: ${Math.round(
                  response.overallSkill.breakdown.controlFlow
              )}/100</li>
              <li>Functions: ${Math.round(
                  response.overallSkill.breakdown.functions
              )}/100</li>
              <li>Data Structures: ${Math.round(
                  response.overallSkill.breakdown.dataStructures
              )}/100</li>
              <li>OOP: ${Math.round(
                  response.overallSkill.breakdown.oop
              )}/100</li>
              <li>Error Handling: ${Math.round(
                  response.overallSkill.breakdown.errorHandling
              )}/100</li>
              <li>Modules: ${Math.round(
                  response.overallSkill.breakdown.modules
              )}/100</li>
            </ul>
            <h4>Recommendations:</h4>
            <ul>
              ${response.recommendations
                  .map((rec) => `<li>${rec.title}: ${rec.description}</li>`)
                  .join("")}
            </ul>
          `;
                    }
                } catch (error) {
                    console.error("Error assessing skill level:", error);
                    document.getElementById(
                        "assessment-results"
                    ).innerHTML = `<p>Error: ${error.message}</p>`;
                }
            });

        // Show modal
        modal.style.display = "block";
    }

    // Show learning paths
    function showLearningPaths() {
        // Create learning paths container
        const container = document.createElement("div");
        container.id = "learning-paths-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Learning Paths</h2>
        <button id="close-paths-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="learning-paths-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize learning path component
        const learningPathComponent = new LearningPathComponent(
            "learning-paths-content"
        );
        learningPathComponent.initialize("user-123");

        // Add close button event listener
        document
            .getElementById("close-paths-btn")
            .addEventListener("click", () => {
                learningPathComponent.destroy();
                showEditor();
            });
    }

    // Show goals dashboard
    function showGoalsDashboard() {
        // Create goals dashboard container
        const container = document.createElement("div");
        container.id = "goals-dashboard-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Goals Dashboard</h2>
        <button id="close-goals-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="goals-dashboard-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize goals dashboard component
        const goalsDashboardComponent = new GoalsDashboardComponent(
            "goals-dashboard-content"
        );
        goalsDashboardComponent.initialize("user-123");

        // Add close button event listener
        document
            .getElementById("close-goals-btn")
            .addEventListener("click", () => {
                goalsDashboardComponent.destroy();
                showEditor();
            });
    }

    // Show analytics dashboard
    function showAnalyticsDashboard() {
        // Create analytics dashboard container
        const container = document.createElement("div");
        container.id = "analytics-dashboard-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Analytics Dashboard</h2>
        <button id="close-analytics-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="analytics-dashboard-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize analytics dashboard component
        const analyticsDashboardComponent = new AnalyticsDashboardComponent(
            "analytics-dashboard-content"
        );
        analyticsDashboardComponent.initialize("user-123");

        // Store reference for chart rendering
        window.analyticsDashboard = analyticsDashboardComponent;

        // Add close button event listener
        document
            .getElementById("close-analytics-btn")
            .addEventListener("click", () => {
                analyticsDashboardComponent.destroy();
                delete window.analyticsDashboard;
                showEditor();
            });
    }

    // Show workspaces panel
    function showWorkspacesPanel() {
        // Create workspaces panel container
        const container = document.createElement("div");
        container.id = "workspaces-panel-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Workspaces</h2>
        <button id="close-workspaces-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="workspaces-panel-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize workspaces panel component
        const workspacesPanelComponent = new WorkspacesPanelComponent(
            "workspaces-panel-content"
        );
        workspacesPanelComponent.initialize();

        // Add close button event listener
        document
            .getElementById("close-workspaces-btn")
            .addEventListener("click", () => {
                workspacesPanelComponent.destroy();
                showEditor();
            });
    }

    // Show code review panel
    function showCodeReviewPanel() {
        // Create code review panel container
        const container = document.createElement("div");
        container.id = "code-review-panel-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Code Review</h2>
        <button id="close-code-review-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="code-review-panel-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize code review panel component
        const codeReviewPanelComponent = new CodeReviewPanelComponent(
            "code-review-panel-content"
        );
        codeReviewPanelComponent.initialize();

        // Add close button event listener
        document
            .getElementById("close-code-review-btn")
            .addEventListener("click", () => {
                codeReviewPanelComponent.destroy();
                showEditor();
            });
    }

    // Show version control panel
    function showVersionControlPanel() {
        // Create version control panel container
        const container = document.createElement("div");
        container.id = "version-control-panel-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Version Control</h2>
        <button id="close-version-control-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="version-control-panel-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize version control panel component
        const versionControlPanelComponent = new VersionControlPanelComponent(
            "version-control-panel-content"
        );
        versionControlPanelComponent.initialize();

        // Add close button event listener
        document
            .getElementById("close-version-control-btn")
            .addEventListener("click", () => {
                versionControlPanelComponent.destroy();
                showEditor();
            });
    }

    // Show documentation panel
    function showDocumentationPanel() {
        // Create documentation panel container
        const container = document.createElement("div");
        container.id = "documentation-panel-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Documentation</h2>
        <button id="close-documentation-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="documentation-panel-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize documentation panel component
        const documentationPanelComponent = new DocumentationPanel(
            "documentation-panel-content"
        );
        documentationPanelComponent.initialize();

        // Add close button event listener
        document
            .getElementById("close-documentation-btn")
            .addEventListener("click", () => {
                documentationPanelComponent.destroy();
                showEditor();
            });
    }

    // Show Q&A panel
    function showQAPanel() {
        // Create Q&A panel container
        const container = document.createElement("div");
        container.id = "qa-panel-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Q&A Platform</h2>
        <button id="close-qa-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="qa-panel-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize Q&A panel component
        const qaPanelComponent = new QAPanel("qa-panel-content");
        qaPanelComponent.initialize();

        // Add close button event listener
        document
            .getElementById("close-qa-btn")
            .addEventListener("click", () => {
                qaPanelComponent.destroy();
                showEditor();
            });
    }

    // Show projects panel
    function showProjectsPanel() {
        // Create projects panel container
        const container = document.createElement("div");
        container.id = "projects-panel-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Project Sharing</h2>
        <button id="close-projects-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="projects-panel-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize projects panel component
        const projectsPanelComponent = new ProjectsPanel(
            "projects-panel-content"
        );
        projectsPanelComponent.initialize();

        // Add close button event listener
        document
            .getElementById("close-projects-btn")
            .addEventListener("click", () => {
                projectsPanelComponent.destroy();
                showEditor();
            });
    }

    // Show mentorship panel
    function showMentorshipPanel() {
        // Create mentorship panel container
        const container = document.createElement("div");
        container.id = "mentorship-panel-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Mentorship Matching</h2>
        <button id="close-mentorship-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="mentorship-panel-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize mentorship panel component
        const mentorshipPanelComponent = new MentorshipPanel(
            "mentorship-panel-content"
        );
        mentorshipPanelComponent.initialize();

        // Add close button event listener
        document
            .getElementById("close-mentorship-btn")
            .addEventListener("click", () => {
                mentorshipPanelComponent.destroy();
                showEditor();
            });
    }

    // Show editor
    function showEditor() {
        document.getElementById("main-content").innerHTML = `
      <div id="editor" style="height: 100%;"></div>
      <div id="ai-assistant-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">AI Assistant</div>
            <span class="close">&times;</span>
          </div>
          <div class="form-group">
            <label class="form-label">Describe what you want to do:</label>
            <textarea class="form-control" id="ai-input" rows="3" placeholder="e.g., Create a function that adds two numbers, or Show me how to loop through a list"></textarea>
          </div>
          <div class="form-group">
            <button class="btn" id="ai-process-btn">Generate Code</button>
          </div>
          <div class="form-group">
            <label class="form-label">Generated Code:</label>
            <div id="ai-output">Your generated code will appear here...</div>
          </div>
        </div>
      </div>
    `;

        // Recreate the editor
        const editor = monaco.editor.create(document.getElementById("editor"), {
            value: window.editor
                ? window.editor.getValue()
                : "// Welcome to KODEON IDE\n// Write your code here\n\n",
            language: "kodeon",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: {
                enabled: true,
            },
        });

        window.editor = editor;

        // Re-attach event listeners
        document
            .getElementById("ai-assistant-btn")
            .addEventListener("click", () => {
                document.getElementById("ai-assistant-modal").style.display =
                    "block";
            });

        document
            .querySelector("#ai-assistant-modal .close")
            .addEventListener("click", () => {
                document.getElementById("ai-assistant-modal").style.display =
                    "none";
            });

        document
            .getElementById("ai-process-btn")
            .addEventListener("click", async () => {
                const input = document.getElementById("ai-input").value;

                try {
                    const response =
                        await window.electronAPI.parseNaturalLanguage(input);

                    if (response.error) {
                        document.getElementById("ai-output").textContent =
                            "Error: " + response.error;
                    } else {
                        document.getElementById("ai-output").textContent =
                            response.generatedCode || "No code generated";
                    }
                } catch (error) {
                    console.error("Error processing natural language:", error);
                    document.getElementById("ai-output").textContent =
                        "Error: " + error.message;
                }
            });
    }

    // Show subscription management panel
    function showSubscriptionManagement() {
        // Create subscription management container
        const container = document.createElement("div");
        container.id = "subscription-management-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Subscription Management</h2>
        <button id="close-subscription-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="subscription-management-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize subscription manager component
        const SubscriptionManager = require("./components/monetization/subscription-manager");
        const subscriptionManager = new SubscriptionManager(
            "subscription-management-content"
        );
        subscriptionManager.initialize();

        // Add close button event listener
        document
            .getElementById("close-subscription-btn")
            .addEventListener("click", () => {
                subscriptionManager.destroy();
                showEditor();
            });
    }

    // Show billing history panel
    function showBillingHistory() {
        // Create billing history container
        const container = document.createElement("div");
        container.id = "billing-history-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Billing History</h2>
        <button id="close-billing-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="billing-history-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize billing history component
        const BillingHistory = require("./components/monetization/billing-history");
        const billingHistory = new BillingHistory("billing-history-content");
        billingHistory.initialize();

        // Add close button event listener
        document
            .getElementById("close-billing-btn")
            .addEventListener("click", () => {
                billingHistory.destroy();
                showEditor();
            });
    }

    // Show upgrade to pro panel
    function showUpgradePro() {
        // Create upgrade pro container
        const container = document.createElement("div");
        container.id = "upgrade-pro-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Upgrade to Pro</h2>
        <button id="close-upgrade-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="upgrade-pro-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize upgrade pro component
        const UpgradePro = require("./components/monetization/upgrade-pro");
        const upgradePro = new UpgradePro("upgrade-pro-content");
        upgradePro.initialize();

        // Add close button event listener
        document
            .getElementById("close-upgrade-btn")
            .addEventListener("click", () => {
                upgradePro.destroy();
                showEditor();
            });
    }

    // Show monetization analytics panel
    function showMonetizationAnalytics() {
        // Create monetization analytics container
        const container = document.createElement("div");
        container.id = "monetization-analytics-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Monetization Analytics</h2>
        <button id="close-analytics-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="monetization-analytics-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize monetization analytics component
        const MonetizationAnalytics = require("./components/monetization/analytics-dashboard");
        const monetizationAnalytics = new MonetizationAnalytics(
            "monetization-analytics-content"
        );
        monetizationAnalytics.initialize();

        // Add close button event listener
        document
            .getElementById("close-analytics-btn")
            .addEventListener("click", () => {
                monetizationAnalytics.destroy();
                showEditor();
            });
    }

    // Show plan comparison panel
    function showPlanComparison() {
        // Create plan comparison container
        const container = document.createElement("div");
        container.id = "plan-comparison-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Plan Comparison</h2>
        <button id="close-comparison-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="plan-comparison-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize plan comparison component
        const PlanComparison = require("./components/monetization/plan-comparison");
        const planComparison = new PlanComparison("plan-comparison-content");
        planComparison.initialize();

        // Add close button event listener
        document
            .getElementById("close-comparison-btn")
            .addEventListener("click", () => {
                planComparison.destroy();
                showEditor();
            });
    }

    // Show customer support panel
    function showCustomerSupport() {
        // Create customer support container
        const container = document.createElement("div");
        container.id = "customer-support-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Customer Support</h2>
        <button id="close-support-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="customer-support-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize customer support component
        const CustomerSupport = require("./components/monetization/customer-support");
        const customerSupport = new CustomerSupport("customer-support-content");
        customerSupport.initialize();

        // Add close button event listener
        document
            .getElementById("close-support-btn")
            .addEventListener("click", () => {
                customerSupport.destroy();
                showEditor();
            });
    }

    // Show professional support panel
    function showProfessionalSupport() {
        // Create professional support container
        const container = document.createElement("div");
        container.id = "professional-support-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Professional Support</h2>
        <button id="close-professional-support-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="professional-support-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize professional support component
        const ProfessionalSupport = require("./components/monetization/professional-support");
        const professionalSupport = new ProfessionalSupport(
            "professional-support-content"
        );
        professionalSupport.initialize();

        // Add close button event listener
        document
            .getElementById("close-professional-support-btn")
            .addEventListener("click", () => {
                professionalSupport.destroy();
                showEditor();
            });
    }

    // Show custom development panel
    function showCustomDevelopment() {
        // Create custom development container
        const container = document.createElement("div");
        container.id = "custom-development-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Custom Development Services</h2>
        <button id="close-custom-development-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="custom-development-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize custom development component
        const CustomDevelopment = require("./components/monetization/custom-development");
        const customDevelopment = new CustomDevelopment(
            "custom-development-content"
        );
        customDevelopment.initialize();

        // Add close button event listener
        document
            .getElementById("close-custom-development-btn")
            .addEventListener("click", () => {
                customDevelopment.destroy();
                showEditor();
            });
    }

    // Show training and certification panel
    function showTrainingCertification() {
        // Create training and certification container
        const container = document.createElement("div");
        container.id = "training-certification-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Training & Certification</h2>
        <button id="close-training-certification-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="training-certification-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize training and certification component
        const TrainingCertification = require("./components/monetization/training-certification");
        const trainingCertification = new TrainingCertification(
            "training-certification-content"
        );
        trainingCertification.initialize();

        // Add close button event listener
        document
            .getElementById("close-training-certification-btn")
            .addEventListener("click", () => {
                trainingCertification.destroy();
                showEditor();
            });
    }

    // Show referral program panel
    function showReferralProgram() {
        // Create referral program container
        const container = document.createElement("div");
        container.id = "referral-program-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Referral Program</h2>
        <button id="close-referral-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="referral-program-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize referral program component
        const ReferralProgramComponent = require("./components/monetization/referral-program");
        const referralProgram = new ReferralProgramComponent(
            "referral-program-content"
        );
        referralProgram.initialize();

        // Add close button event listener
        document
            .getElementById("close-referral-btn")
            .addEventListener("click", () => {
                referralProgram.destroy();
                showEditor();
            });
    }

    // Show affiliate dashboard panel
    function showAffiliateDashboard() {
        // Create affiliate dashboard container
        const container = document.createElement("div");
        container.id = "affiliate-dashboard-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Affiliate Dashboard</h2>
        <button id="close-affiliate-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="affiliate-dashboard-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize affiliate dashboard component
        const AffiliateDashboard = require("./components/monetization/affiliate-dashboard");
        const affiliateDashboard = new AffiliateDashboard(
            "affiliate-dashboard-content"
        );
        affiliateDashboard.initialize();

        // Add close button event listener
        document
            .getElementById("close-affiliate-btn")
            .addEventListener("click", () => {
                affiliateDashboard.destroy();
                showEditor();
            });
    }

    // Show educational licensing panel
    function showEducationalLicensing() {
        // Create educational licensing container
        const container = document.createElement("div");
        container.id = "educational-licensing-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Educational Licensing</h2>
        <button id="close-licensing-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="educational-licensing-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize educational licensing component
        const EducationalLicensing = require("./components/monetization/educational-licensing");
        const educationalLicensing = new EducationalLicensing(
            "educational-licensing-content"
        );
        educationalLicensing.initialize();

        // Add close button event listener
        document
            .getElementById("close-licensing-btn")
            .addEventListener("click", () => {
                educationalLicensing.destroy();
                showEditor();
            });
    }

    // Show marketplace panel
    function showMarketplace() {
        // Create marketplace container
        const container = document.createElement("div");
        container.id = "marketplace-container";
        container.innerHTML = `
      <div class="panel-header">
        <h2>Marketplace</h2>
        <button id="close-marketplace-btn" class="btn btn-secondary">Close</button>
      </div>
      <div id="marketplace-content"></div>
    `;

        // Add to main content area
        document.getElementById("main-content").innerHTML = "";
        document.getElementById("main-content").appendChild(container);

        // Initialize marketplace component
        const Marketplace = require("./components/monetization/marketplace");
        const marketplace = new Marketplace("marketplace-content");
        marketplace.initialize();

        // Add close button event listener
        document
            .getElementById("close-marketplace-btn")
            .addEventListener("click", () => {
                marketplace.destroy();
                showEditor();
            });
    }
});
