// Theme Selector Component for KODEON IDE
class ThemeSelector {
    constructor() {
        this.themes = {};
        this.currentTheme = "dark";
        this.init();
    }

    init() {
        // Add event listener to theme selector button
        const themeSelectorBtn = document.getElementById("theme-selector");
        if (themeSelectorBtn) {
            themeSelectorBtn.addEventListener("click", () => {
                this.showThemeSelector();
            });
        }
    }

    setThemes(themes) {
        this.themes = themes;
    }

    setCurrentTheme(themeName) {
        this.currentTheme = themeName;
        const themeSelectorBtn = document.getElementById("theme-selector");
        if (themeSelectorBtn) {
            themeSelectorBtn.textContent = `Theme: ${
                themeName.charAt(0).toUpperCase() + themeName.slice(1)
            }`;
        }
    }

    showThemeSelector() {
        // Create theme selector dropdown
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "theme-selector-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Select Theme</div>
          <span class="close">&times;</span>
        </div>
        <div class="form-group">
          <label class="form-label">Available Themes</label>
          <select class="form-control" id="theme-dropdown">
            ${Object.keys(this.themes)
                .map(
                    (themeName) =>
                        `<option value="${themeName}" ${
                            themeName === this.currentTheme ? "selected" : ""
                        }>
                ${this.themes[themeName].name}
              </option>`
                )
                .join("")}
          </select>
        </div>
        <div class="form-group">
          <button class="btn" id="apply-theme">Apply</button>
          <button class="btn btn-secondary" id="close-theme-selector">Close</button>
        </div>
      </div>
    `;

        // Add to document
        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector(".close");
        const closeSelectorBtn = modal.querySelector("#close-theme-selector");
        const applyBtn = modal.querySelector("#apply-theme");
        const themeDropdown = modal.querySelector("#theme-dropdown");

        closeBtn.addEventListener("click", () => {
            document.body.removeChild(modal);
        });

        closeSelectorBtn.addEventListener("click", () => {
            document.body.removeChild(modal);
        });

        applyBtn.addEventListener("click", () => {
            const selectedTheme = themeDropdown.value;
            this.applyTheme(selectedTheme);
            document.body.removeChild(modal);
        });
    }

    applyTheme(themeName) {
        // This would call the renderer to apply the theme
        window.electronAPI.applyTheme(themeName);
        this.setCurrentTheme(themeName);
    }
}

module.exports = ThemeSelector;
