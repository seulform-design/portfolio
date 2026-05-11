const app = {
    init: function () {
        // UI Modules
        Header.init();
        Navigation.init();

        // Core Modules
        // Renderer.renderProjects(Data.projects); // Disabled for UX Rebuild Asymmetric Layout
    }
};

// Boot the app
document.addEventListener('DOMContentLoaded', () => app.init());