const Navigation = {
    init: function () {
        this.bindSmoothScrolling();
        this.bindActiveNavLink();
    },

    bindSmoothScrolling: function () {
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = document.getElementById('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    if (typeof AOS !== 'undefined') {
                        window.setTimeout(() => AOS.refresh(), 700);
                    }
                }

                const mobileNav = document.getElementById('mobile-nav');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (mobileNav && mobileToggle && mobileNav.classList.contains('is-open')) {
                    mobileNav.classList.remove('is-open');
                    mobileNav.setAttribute('aria-hidden', 'true');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    },

    bindActiveNavLink: function () {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.main-nav a[href^="#"], .mobile-nav a[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
} else {
    Navigation.init();
}