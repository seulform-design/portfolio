/* ============================================================
   Portfolio · mockup-v2.js
   - .mv-screen 안의 iframe을 부모 박스에 cover-fit
   - CSS variable(--scale, --w, --h) 갱신 → CSS transform 처리
   - ResizeObserver 기반, 디바운스, 폰트 로드 후 재계산
   ============================================================ */
(function () {
    function fit(iframe) {
        const screen = iframe.parentElement;
        if (!screen) return;

        const w = parseInt(iframe.dataset.w, 10) || 1280;
        const h = parseInt(iframe.dataset.h, 10) || 800;

        const sw = Math.round(screen.clientWidth);
        const sh = Math.round(screen.clientHeight);
        if (sw === 0 || sh === 0) return;

        if (iframe._lw === sw && iframe._lh === sh) return;
        iframe._lw = sw;
        iframe._lh = sh;

        const scale = Math.max(sw / w, sh / h);

        iframe.style.setProperty('--w', w + 'px');
        iframe.style.setProperty('--h', h + 'px');
        iframe.style.setProperty('--scale', scale);
    }

    function debounce(fn, wait) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(fn, wait);
        };
    }

    function bind(iframe) {
        const screen = iframe.parentElement;

        const ready = () => screen.classList.add('is-ready');
        if (iframe.complete) ready();
        iframe.addEventListener('load', ready, { once: true });

        const fitOnce = () => fit(iframe);
        const fitDeb = debounce(fitOnce, 60);

        fitOnce();

        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(fitDeb);
            ro.observe(screen);
        }

        requestAnimationFrame(fitOnce);
        setTimeout(fitOnce, 120);
        setTimeout(fitOnce, 500);
    }

    /* ----- Detail injection (glare, notch, island, etc.) ----- */
    function inject(device) {
        const screen = device.querySelector('.mv-screen');
        if (!screen) return;

        // Common: glass glare layer (모든 screen 공통)
        if (!screen.querySelector('.mv-glare')) {
            const g = document.createElement('div');
            g.className = 'mv-glare';
            screen.prepend(g);
        }

        // Desktop: MacBook 노치 + 키보드 베이스
        if (device.classList.contains('mv-desktop')) {
            if (!device.querySelector('.mv-notch')) {
                const n = document.createElement('div');
                n.className = 'mv-notch';
                device.prepend(n);
            }
            if (!device.querySelector('.mv-base')) {
                const b = document.createElement('div');
                b.className = 'mv-base';
                device.appendChild(b);
            }
        }

        // Tablet: iPad 카메라
        if (device.classList.contains('mv-tablet')) {
            if (!device.querySelector('.mv-cam')) {
                const c = document.createElement('div');
                c.className = 'mv-cam';
                device.prepend(c);
            }
        }

        // Mobile: Dynamic Island (screen 내부)
        if (device.classList.contains('mv-mobile')) {
            if (!screen.querySelector('.mv-island')) {
                const i = document.createElement('div');
                i.className = 'mv-island';
                screen.appendChild(i);
            }
        }
    }

    /* ----- Deferred load: data-src → src on viewport approach ----- */
    function hydrateDeferred() {
        const deferred = document.querySelectorAll('.mv-screen iframe[data-src]:not([src])');
        if (!deferred.length) return [];

        if (!('IntersectionObserver' in window)) {
            deferred.forEach(f => { f.src = f.dataset.src; });
            return Array.from(deferred);
        }

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const f = entry.target;
                if (!f.src && f.dataset.src) {
                    f.src = f.dataset.src;
                    bind(f);
                }
                obs.unobserve(f);
            });
        }, { rootMargin: '400px 0px', threshold: 0.01 });

        deferred.forEach(f => io.observe(f));
        return [];
    }

    function init() {
        document.querySelectorAll('.mv-device').forEach(inject);

        const eager = document.querySelectorAll('.mv-screen iframe[src]');
        eager.forEach(bind);

        hydrateDeferred();

        const allIframes = () => document.querySelectorAll('.mv-screen iframe[src]');
        const resizeAll = debounce(() => allIframes().forEach(fit), 80);
        window.addEventListener('resize', resizeAll, { passive: true });

        if (document.fonts?.ready) {
            document.fonts.ready.then(() => allIframes().forEach(fit));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
