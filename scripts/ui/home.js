/* ============================================================
   SULGI Portfolio · home.js
   Index page: header sticky, back-to-top, nav highlight (AOS: aos-init.js in head)
   ============================================================ */
(function () {
    function bindStickyHeader() {
        const header = document.getElementById('header');
        if (!header) return;
        const apply = () => {
            const scrolled = window.scrollY > 4;
            header.classList.toggle('is-sticky', scrolled);
            header.classList.toggle('is-scrolled', scrolled);
        };
        apply();
        window.addEventListener('scroll', apply, { passive: true });
    }

    function bindMenuToggle() {
        const header = document.getElementById('header');
        const toggle = header && header.querySelector('.header-menu-toggle');
        if (!header || !toggle) return;

        toggle.addEventListener('click', () => {
            const open = header.classList.toggle('menu-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });

        header.querySelectorAll('.main-nav a').forEach(a => {
            a.addEventListener('click', () => {
                header.classList.remove('menu-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
            });
        });
    }

    function bindBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        const apply = () => btn.classList.toggle('is-visible', window.scrollY > 480);
        apply();
        window.addEventListener('scroll', apply, { passive: true });
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function bindActiveNav() {
        const links = document.querySelectorAll('.main-nav a[href^="#"]');
        if (!links.length) return;

        const sections = Array.from(links)
            .map(a => document.querySelector(a.getAttribute('href')))
            .filter(Boolean);
        if (!sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(link => {
                        const match = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('is-active', match);
                        link.classList.toggle('active', match);
                    });
                }
            });
        }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });

        sections.forEach(s => observer.observe(s));
    }

    function bindSmoothAnchor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top, behavior: 'smooth' });
                if (typeof AOS !== 'undefined') {
                    window.setTimeout(() => AOS.refresh(), 700);
                }
            });
        });
    }

    function init() {
        bindStickyHeader();
        bindMenuToggle();
        bindBackToTop();
        bindActiveNav();
        bindSmoothAnchor();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
