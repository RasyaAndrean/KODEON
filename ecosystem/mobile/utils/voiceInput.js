/**
 * Voice Input Utility for KODEON Mobile IDE
 * Handles voice recognition for code dictation
 */

import Voice from "@react-native-voice/voice";
import { PermissionsAndroid, Platform } from "react-native";

class VoiceInputHandler {
    constructor() {
        this.isListening = false;
        this.recognitionCallback = null;
        this.errorCallback = null;

        // Initialize voice recognition events
        Voice.onSpeechStart = this.onSpeechStart.bind(this);
        Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechError = this.onSpeechError.bind(this);
    }

    /**
     * Request microphone permission
     * @returns {Promise<boolean>} Permission granted status
     */
    async requestMicrophonePermission() {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: "Microphone Permission",
                        message:
                            "KODEON Mobile IDE needs access to your microphone for voice input.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // iOS permissions are handled differently
    }

    /**
     * Start voice recognition
     * @param {Function} onResult - Callback for recognition results
     * @param {Function} onError - Callback for recognition errors
     */
    async startListening(onResult, onError) {
        try {
            const hasPermission = await this.requestMicrophonePermission();
            if (!hasPermission) {
                throw new Error("Microphone permission not granted");
            }

            this.recognitionCallback = onResult;
            this.errorCallback = onError;

            await Voice.start("en-US");
            this.isListening = true;
        } catch (error) {
            if (this.errorCallback) {
                this.errorCallback(error);
            }
            throw error;
        }
    }

    /**
     * Stop voice recognition
     */
    async stopListening() {
        try {
            await Voice.stop();
            this.isListening = false;
        } catch (error) {
            console.error("Error stopping voice recognition:", error);
        }
    }

    /**
     * Cancel voice recognition
     */
    async cancelListening() {
        try {
            await Voice.cancel();
            this.isListening = false;
        } catch (error) {
            console.error("Error canceling voice recognition:", error);
        }
    }

    /**
     * Check if voice recognition is currently active
     * @returns {boolean} Listening status
     */
    isListening() {
        return this.isListening;
    }

    /**
     * Process voice input for code dictation
     * @param {string} text - Recognized speech text
     * @returns {string} Processed code text
     */
    processVoiceInput(text) {
        // Convert spoken words to code syntax
        // This is a simplified implementation - a real one would be more sophisticated
        let code = text;

        // Replace common spoken phrases with code syntax
        code = code.replace(/\bfunction\s+(\w+)\b/g, "function $1()");
        code = code.replace(/\bif\s+([\w\s]+)\s+then\b/g, "if ($1) {");
        code = code.replace(/\bfor\s+loop\b/g, "for (let i = 0; i < ; i++) {");
        code = code.replace(/\bprint\s+(.+)\b/g, 'print("$1");');
        code = code.replace(/\bopen\s+bracket\b/g, "{");
        code = code.replace(/\bclose\s+bracket\b/g, "}");
        code = code.replace(/\bopen\s+paren\b/g, "(");
        code = code.replace(/\bclose\s+paren\b/g, ")");
        code = code.replace(/\bnew\s+line\b/g, "\n");
        code = code.replace(/\btab\s+in\b/g, "  ");

        return code;
    }

    // Voice recognition event handlers
    onSpeechStart(e) {
        console.log("Speech started");
    }

    onSpeechRecognized(e) {
        console.log("Speech recognized");
    }

    onSpeechResults(e) {
        if (this.recognitionCallback && e.value && e.value.length > 0) {
            const processedText = this.processVoiceInput(e.value[0]);
            this.recognitionCallback(processedText);
        }
    }

    onSpeechError(e) {
        console.error("Speech recognition error:", e);
        if (this.errorCallback) {
            this.errorCallback(e.error);
        }
    }

    /**
     * Destroy voice recognition instance
     */
    destroy() {
        Voice.destroy().then(Voice.removeAllListeners);
    }
}

export default new VoiceInputHandler();
