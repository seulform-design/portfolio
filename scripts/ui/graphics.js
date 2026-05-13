(function () {
    const tabs = document.querySelectorAll('.gfx-tab');
    const panels = document.querySelectorAll('.gfx-group');
    const groups = document.querySelector('.gfx-groups');

    if (!tabs.length || !panels.length || !groups) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('is-active')) return;
            const target = tab.dataset.tab;

            tabs.forEach(t => {
                const active = t === tab;
                t.classList.toggle('is-active', active);
                t.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            groups.classList.toggle('is-all', target === 'all');
            groups.dataset.view = target;

            panels.forEach(panel => {
                const match = target === 'all' || panel.dataset.group === target;
                panel.classList.toggle('is-active', match);
            });
        });
    });
})();
