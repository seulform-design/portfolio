(function () {
    const slider = document.querySelector('.index-slider');
    if (!slider) return;

    const viewport = slider.querySelector('.index-viewport');
    const track = slider.querySelector('.index-track');
    const cards = Array.from(track.querySelectorAll('.index-card')).filter((c) => !c.hidden);
    const prevBtn = slider.querySelector('[data-dir="prev"]');
    const nextBtn = slider.querySelector('[data-dir="next"]');
    const currentEl = slider.querySelector('.index-current');
    const totalEl = slider.querySelector('.index-total');
    const dotsWrap = slider.querySelector('.index-dots');
    const progressBar = slider.querySelector('.index-progress-bar');

    if (!viewport || !track || cards.length === 0) return;

    const AUTOPLAY_MS = parseInt(slider.dataset.autoplay, 10) || 0;
    const PAD = (n) => String(n).padStart(2, '0');

    let perView = 3;
    let currentPage = 0;
    let totalPages = 1;
    let autoTimer = null;
    let progressStart = 0;
    let isPaused = false;

    function getPerView() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 1024) return 2;
        return 3;
    }

    function getGap() {
        const cs = getComputedStyle(track);
        return parseFloat(cs.columnGap || cs.gap) || 0;
    }

    function getCardWidth() {
        const vw = viewport.clientWidth;
        const gap = getGap();
        return (vw - gap * (perView - 1)) / perView;
    }

    function applyCardWidth() {
        const cw = getCardWidth();
        cards.forEach(c => { c.style.flex = `0 0 ${cw}px`; });
    }

    function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'index-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Page ${i + 1} of ${totalPages}`);
            dot.dataset.page = i;
            dot.addEventListener('click', () => goTo(i, true));
            dotsWrap.appendChild(dot);
        }
    }

    function update() {
        const cw = getCardWidth();
        const gap = getGap();
        const offset = currentPage * perView * (cw + gap);
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;

        if (currentEl) currentEl.textContent = PAD(currentPage + 1);
        if (totalEl) totalEl.textContent = PAD(totalPages);

        if (dotsWrap) {
            dotsWrap.querySelectorAll('.index-dot').forEach((d, i) => {
                d.classList.toggle('is-active', i === currentPage);
            });
        }

        cards.forEach((c, i) => {
            const pageIdx = Math.floor(i / perView);
            c.classList.toggle('is-active', pageIdx === currentPage);
        });
    }

    function goTo(page, fromUser) {
        currentPage = ((page % totalPages) + totalPages) % totalPages;
        update();
        if (fromUser) restartAutoplay();
        else resetProgress();
    }

    function next(fromUser) { goTo(currentPage + 1, fromUser); }
    function prev(fromUser) { goTo(currentPage - 1, fromUser); }

    function startAutoplay() {
        if (!AUTOPLAY_MS || totalPages <= 1) return;
        stopAutoplay();
        progressStart = performance.now();
        autoTimer = setInterval(() => { if (!isPaused) next(false); }, AUTOPLAY_MS);
        animateProgress();
    }

    function stopAutoplay() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        if (progressBar) progressBar.style.transform = 'scaleX(0)';
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    function resetProgress() {
        progressStart = performance.now();
    }

    function animateProgress() {
        if (!progressBar) return;
        const tick = (now) => {
            if (!autoTimer) return;
            if (isPaused) {
                progressStart = now - (parseFloat(progressBar.dataset.elapsed || 0));
                requestAnimationFrame(tick);
                return;
            }
            const elapsed = (now - progressStart) % AUTOPLAY_MS;
            const ratio = Math.min(elapsed / AUTOPLAY_MS, 1);
            progressBar.style.transform = `scaleX(${ratio})`;
            progressBar.dataset.elapsed = elapsed;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    function recompute() {
        const newPv = getPerView();
        const oldPv = perView;
        perView = newPv;
        totalPages = Math.max(1, Math.ceil(cards.length / perView));
        if (currentPage > totalPages - 1) currentPage = totalPages - 1;
        applyCardWidth();
        buildDots();
        update();
        if (newPv !== oldPv) restartAutoplay();
    }

    // Bind events
    if (prevBtn) prevBtn.addEventListener('click', () => prev(true));
    if (nextBtn) nextBtn.addEventListener('click', () => next(true));

    // Pause on hover / focus
    slider.addEventListener('mouseenter', () => { isPaused = true; });
    slider.addEventListener('mouseleave', () => { isPaused = false; progressStart = performance.now() - (parseFloat(progressBar?.dataset.elapsed) || 0); });
    slider.addEventListener('focusin', () => { isPaused = true; });
    slider.addEventListener('focusout', () => { isPaused = false; });

    // Touch swipe
    let touchStartX = 0;
    let touchDeltaX = 0;
    let touching = false;
    viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
        touching = true;
        isPaused = true;
    }, { passive: true });
    viewport.addEventListener('touchmove', (e) => {
        if (!touching) return;
        touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    viewport.addEventListener('touchend', () => {
        if (!touching) return;
        if (Math.abs(touchDeltaX) > 50) {
            if (touchDeltaX < 0) next(true); else prev(true);
        }
        touching = false;
        isPaused = false;
    });

    // Resize
    let resizeRAF = null;
    window.addEventListener('resize', () => {
        if (resizeRAF) cancelAnimationFrame(resizeRAF);
        resizeRAF = requestAnimationFrame(recompute);
    });

    // Init
    perView = getPerView();
    totalPages = Math.max(1, Math.ceil(cards.length / perView));
    applyCardWidth();
    buildDots();
    update();
    startAutoplay();
})();
