/**
 * Compiler Service for KODEON Mobile IDE
 * Handles compilation of KODEON code using the remote compiler API
 */

import { compiler } from "../config/mobile.config";

class CompilerService {
    constructor() {
        this.apiUrl = compiler.apiUrl;
        this.timeout = compiler.timeout;
    }

    /**
     * Compile KODEON code
     * @param {string} code - The KODEON code to compile
     * @param {string} fileName - The name of the file being compiled
     * @returns {Promise<Object>} Compilation result
     */
    async compileCode(code, fileName = "main.kodeon") {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/compile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    fileName,
                    language: "kodeon",
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `Compilation failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("Compilation timed out");
            }
            throw new Error(`Compilation error: ${error.message}`);
        }
    }

    /**
     * Run compiled KODEON code
     * @param {string} code - The KODEON code to run
     * @param {Object} input - Input data for the program (if any)
     * @returns {Promise<Object>} Execution result
     */
    async runCode(code, input = null) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    input,
                    language: "kodeon",
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `Execution failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("Execution timed out");
            }
            throw new Error(`Execution error: ${error.message}`);
        }
    }

    /**
     * Check code for syntax errors without compiling
     * @param {string} code - The KODEON code to check
     * @returns {Promise<Object>} Syntax check result
     */
    async checkSyntax(code) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/syntax-check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    language: "kodeon",
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `Syntax check failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("Syntax check timed out");
            }
            throw new Error(`Syntax check error: ${error.message}`);
        }
    }

    /**
     * Format KODEON code
     * @param {string} code - The KODEON code to format
     * @returns {Promise<Object>} Formatted code result
     */
    async formatCode(code) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout
            );

            const response = await fetch(`${this.apiUrl}/format`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    language: "kodeon",
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `Formatting failed with status ${response.status}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("Formatting timed out");
            }
            throw new Error(`Formatting error: ${error.message}`);
        }
    }
}

export default new CompilerService();
