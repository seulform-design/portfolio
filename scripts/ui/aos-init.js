/* AOS (Animate On Scroll) — shared bootstrap for portfolio pages */
(function () {
    function refresh() {
        if (typeof AOS !== 'undefined') AOS.refresh();
    }

    function init() {
        if (typeof AOS === 'undefined') return;
        AOS.init({
            duration: 800,
            once: true,
            offset: 80,
        });
        window.addEventListener('load', refresh, { once: true });
        window.addEventListener('hashchange', refresh);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
