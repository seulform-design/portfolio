/* ============================================================
   SULGI Portfolio · case-study.js
   Subpage interactions: progress bar, back-to-top, scroll polish
   ============================================================ */
(function () {
    const progressBar = document.getElementById('caseProgress');
    const backToTop = document.getElementById('backToTop');

    function updateScrollUI() {
        const scrolled = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = docHeight > 0 ? scrolled / docHeight : 0;

        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
        }

        if (backToTop) {
            backToTop.classList.toggle('is-visible', scrolled > 480);
        }
    }

    function smoothBackToTop() {
        if (!backToTop) return;
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function init() {
        updateScrollUI();
        window.addEventListener('scroll', updateScrollUI, { passive: true });
        smoothBackToTop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
