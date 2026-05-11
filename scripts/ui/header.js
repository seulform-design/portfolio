const Header = {
    init: function () {
        this.bindMobileMenuToggle();
        this.bindStickyHeader();
    },

    bindMobileMenuToggle: function () {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');

        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.addEventListener('click', () => {
                const isOpen = mobileNav.classList.toggle('is-open');
                mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
                mobileNav.setAttribute('aria-hidden', String(!isOpen));
                mobileMenuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
                document.body.classList.toggle('no-scroll', isOpen);
            });
        }
    },

    bindStickyHeader: function () {
        const header = document.getElementById('header');
        if (!header) return;

        const applyStickyState = () => {
            header.classList.toggle('is-sticky', window.scrollY > 4);
        };

        applyStickyState();
        window.addEventListener('scroll', applyStickyState, { passive: true });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Header.init());
} else {
    Header.init();
}