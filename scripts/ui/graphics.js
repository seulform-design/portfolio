(function () {
    const filterBtns = document.querySelectorAll('.gfx-filter-btn');
    const cards = document.querySelectorAll('.gfx-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
})();
