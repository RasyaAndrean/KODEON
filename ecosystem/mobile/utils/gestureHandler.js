/**
 * Gesture Handler Utility for KODEON Mobile IDE
 * Handles touch gestures for enhanced mobile interaction
 */

class GestureHandler {
    constructor() {
        this.gestureConfig = {
            // Double tap for specific actions
            doubleTap: {
                numberOfTaps: 2,
                maxDuration: 300,
            },

            // Long press for context menus
            longPress: {
                minDuration: 500,
            },

            // Swipe gestures
            swipe: {
                minDistance: 50,
                maxDeviation: 20,
                velocityThreshold: 0.3,
            },
        };
    }

    /**
     * Handle double tap gesture
     * @param {Function} callback - Function to call on double tap
     * @returns {Object} Gesture handler configuration
     */
    handleDoubleTap(callback) {
        return {
            onActivated: callback,
            numberOfTaps: this.gestureConfig.doubleTap.numberOfTaps,
            maxDurationMs: this.gestureConfig.doubleTap.maxDuration,
        };
    }

    /**
     * Handle long press gesture
     * @param {Function} callback - Function to call on long press
     * @returns {Object} Gesture handler configuration
     */
    handleLongPress(callback) {
        return {
            onActivated: callback,
            minDurationMs: this.gestureConfig.longPress.minDuration,
        };
    }

    /**
     * Handle swipe gesture
     * @param {Function} callback - Function to call on swipe
     * @returns {Object} Gesture handler configuration
     */
    handleSwipe(callback) {
        return {
            onEnded: (event) => {
                const { translationX, translationY, velocityX, velocityY } =
                    event;

                // Check if it's a horizontal swipe
                if (
                    Math.abs(translationX) >
                        this.gestureConfig.swipe.minDistance &&
                    Math.abs(translationY) <
                        this.gestureConfig.swipe.maxDeviation &&
                    Math.abs(velocityX) >
                        this.gestureConfig.swipe.velocityThreshold
                ) {
                    if (translationX > 0) {
                        callback("right");
                    } else {
                        callback("left");
                    }
                    return;
                }

                // Check if it's a vertical swipe
                if (
                    Math.abs(translationY) >
                        this.gestureConfig.swipe.minDistance &&
                    Math.abs(translationX) <
                        this.gestureConfig.swipe.maxDeviation &&
                    Math.abs(velocityY) >
                        this.gestureConfig.swipe.velocityThreshold
                ) {
                    if (translationY > 0) {
                        callback("down");
                    } else {
                        callback("up");
                    }
                }
            },
        };
    }

    /**
     * Handle pinch gesture for zooming
     * @param {Function} callback - Function to call with scale factor
     * @returns {Object} Gesture handler configuration
     */
    handlePinch(callback) {
        return {
            onActivated: (event) => {
                const { scale } = event;
                callback(scale);
            },
        };
    }

    /**
     * Handle pan gesture for dragging
     * @param {Function} callback - Function to call with drag data
     * @returns {Object} Gesture handler configuration
     */
    handlePan(callback) {
        return {
            onBegan: (event) => {
                callback({ type: "start", ...event });
            },
            onChanged: (event) => {
                callback({ type: "move", ...event });
            },
            onEnded: (event) => {
                callback({ type: "end", ...event });
            },
        };
    }
}

export default new GestureHandler();
