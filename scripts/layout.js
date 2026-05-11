const Layout = {
    init: function () {
        this.loadPartials();
    },
    loadPartials: function () {
        const partials = [
            { id: 'header', path: '_header.html' },
            { id: 'footer', path: '_footer.html' }
        ];

        partials.forEach(async ({ id, path }) => {
            const element = document.getElementById(id);
            if (!element) return;

            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Failed to load partial: ${path}`);
                element.innerHTML = await response.text();
            } catch (error) {
                console.error(error);
                element.innerHTML = `<p class="error-msg">Error loading ${id}.</p>`;
            }
        });
    }
};

Layout.init();