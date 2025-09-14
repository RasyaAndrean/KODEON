/**
 * AI Assistant Service for KODEON Mobile IDE
 * Integrates with the KODEON AI assistant API for code suggestions and assistance
 */

import { ai } from "../config/mobile.config";

class AIAssistantService {
    constructor() {
        this.apiUrl = ai.apiUrl;
        this.timeout = ai.timeout;
        this.maxTokens = ai.maxTokens;
    }

    /**
     * Get code completion suggestions
     * @param {string} code - The current code
     * @param {number} cursorPosition - Current cursor position in the code
     * @returns {Promise<Object>} Code completion suggestions
     */
    async getCodeCompletion(code, cursorPosition) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/completion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    cursorPosition,
                    maxTokens: this.maxTokens,
                    language: "kodeon",
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `AI completion failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("AI completion request timed out");
            }
            throw new Error(`AI completion error: ${error.message}`);
        }
    }

    /**
     * Get code refactoring suggestions
     * @param {string} code - The code to refactor
     * @returns {Promise<Object>} Refactoring suggestions
     */
    async getRefactoringSuggestions(code) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/refactor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    language: "kodeon",
                    maxTokens: this.maxTokens,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `AI refactoring failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("AI refactoring request timed out");
            }
            throw new Error(`AI refactoring error: ${error.message}`);
        }
    }

    /**
     * Explain code functionality
     * @param {string} code - The code to explain
     * @returns {Promise<Object>} Code explanation
     */
    async explainCode(code) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/explain`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    language: "kodeon",
                    maxTokens: this.maxTokens,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `AI explanation failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("AI explanation request timed out");
            }
            throw new Error(`AI explanation error: ${error.message}`);
        }
    }

    /**
     * Find potential bugs in code
     * @param {string} code - The code to analyze
     * @returns {Promise<Object>} Bug detection results
     */
    async findBugs(code) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/bug-detection`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    language: "kodeon",
                    maxTokens: this.maxTokens,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `AI bug detection failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("AI bug detection request timed out");
            }
            throw new Error(`AI bug detection error: ${error.message}`);
        }
    }

    /**
     * Optimize code performance
     * @param {string} code - The code to optimize
     * @returns {Promise<Object>} Optimization suggestions
     */
    async optimizeCode(code) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/optimize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    language: "kodeon",
                    maxTokens: this.maxTokens,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `AI optimization failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("AI optimization request timed out");
            }
            throw new Error(`AI optimization error: ${error.message}`);
        }
    }
}

export default new AIAssistantService();
