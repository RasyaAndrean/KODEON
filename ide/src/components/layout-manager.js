// Layout Manager Component for KODEON IDE
class LayoutManager {
    constructor() {
        this.layouts = {};
        this.currentLayout = "default";
        this.init();
    }

    init() {
        // Add event listener to layout selector button
        const layoutSelectorBtn = document.getElementById("layout-selector");
        if (layoutSelectorBtn) {
            layoutSelectorBtn.addEventListener("click", () => {
                this.showLayoutManager();
            });
        }
    }

    setLayouts(layouts) {
        this.layouts = layouts;
    }

    setCurrentLayout(layoutName) {
        this.currentLayout = layoutName;
        const layoutSelectorBtn = document.getElementById("layout-selector");
        if (layoutSelectorBtn) {
            layoutSelectorBtn.textContent = `Layout: ${
                layoutName.charAt(0).toUpperCase() + layoutName.slice(1)
            }`;
        }
    }

    showLayoutManager() {
        // Create layout manager dropdown
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "layout-manager-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Select Layout</div>
          <span class="close">&times;</span>
        </div>
        <div class="form-group">
          <label class="form-label">Available Layouts</label>
          <select class="form-control" id="layout-dropdown">
            ${Object.keys(this.layouts)
                .map(
                    (layoutName) =>
                        `<option value="${layoutName}" ${
                            layoutName === this.currentLayout ? "selected" : ""
                        }>
                ${this.layouts[layoutName].name}
              </option>`
                )
                .join("")}
          </select>
        </div>
        <div class="form-group">
          <button class="btn" id="apply-layout">Apply</button>
          <button class="btn btn-secondary" id="close-layout-manager">Close</button>
        </div>
      </div>
    `;

        // Add to document
        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector(".close");
        const closeManagerBtn = modal.querySelector("#close-layout-manager");
        const applyBtn = modal.querySelector("#apply-layout");
        const layoutDropdown = modal.querySelector("#layout-dropdown");

        closeBtn.addEventListener("click", () => {
            document.body.removeChild(modal);
        });

        closeManagerBtn.addEventListener("click", () => {
            document.body.removeChild(modal);
        });

        applyBtn.addEventListener("click", () => {
            const selectedLayout = layoutDropdown.value;
            this.applyLayout(selectedLayout);
            document.body.removeChild(modal);
        });
    }

    applyLayout(layoutName) {
        // This would call the renderer to apply the layout
        window.electronAPI.applyLayout(layoutName);
        this.setCurrentLayout(layoutName);
    }
}

module.exports = LayoutManager;
