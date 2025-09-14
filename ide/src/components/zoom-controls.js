// Zoom Controls Component for KODEON IDE
class ZoomControls {
    constructor() {
        this.currentZoomLevel = 1.0;
        this.init();
    }

    init() {
        // Zoom controls could be added to the status bar or preferences
    }

    setZoomLevel(zoomLevel) {
        this.currentZoomLevel = zoomLevel;
        // Apply zoom level to the document
        document.body.style.zoom = zoomLevel;
    }

    zoomIn() {
        this.currentZoomLevel += 0.1;
        this.setZoomLevel(this.currentZoomLevel);
        // Save to preferences
        window.electronAPI.updatePreferences({
            zoomLevel: this.currentZoomLevel,
        });
    }

    zoomOut() {
        this.currentZoomLevel -= 0.1;
        this.setZoomLevel(this.currentZoomLevel);
        // Save to preferences
        window.electronAPI.updatePreferences({
            zoomLevel: this.currentZoomLevel,
        });
    }

    resetZoom() {
        this.currentZoomLevel = 1.0;
        this.setZoomLevel(this.currentZoomLevel);
        // Save to preferences
        window.electronAPI.updatePreferences({
            zoomLevel: this.currentZoomLevel,
        });
    }
}

module.exports = ZoomControls;
