const DanhaPage = {
    init: function () {
        this.bindCardFocus();
    },

    bindCardFocus: function () {
        const cards = document.querySelectorAll('.danha-section .card');
        if (!cards.length) return;

        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('is-focused');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('is-focused');
            });

            card.addEventListener('focusin', () => {
                card.classList.add('is-focused');
            });

            card.addEventListener('focusout', () => {
                card.classList.remove('is-focused');
            });
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DanhaPage.init());
} else {
    DanhaPage.init();
}
