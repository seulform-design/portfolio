document.addEventListener('DOMContentLoaded', function () {
    // 1. 프로젝트 슬라이더 컨트롤 로직
    const wrapper = document.getElementById('sliderWrapper');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dots = document.querySelectorAll('.slider-pagination .dot');
    const slides = document.querySelectorAll('.project-slide');

    if (wrapper && prevBtn && nextBtn && slides.length > 0) {
        let currentIndex = 0;

        const updateNavState = (index) => {
            const isFirst = index === 0;
            const isLast = index === slides.length - 1;

            prevBtn.disabled = isFirst;
            nextBtn.disabled = isLast;
            prevBtn.setAttribute('aria-disabled', isFirst ? 'true' : 'false');
            nextBtn.setAttribute('aria-disabled', isLast ? 'true' : 'false');
        };

        const updateDots = (index) => {
            dots.forEach((dot, i) => {
                const isActive = i === index;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
                dot.setAttribute('tabindex', isActive ? '0' : '-1');
            });
            slides.forEach((slide, i) => {
                const isActive = i === index;
                slide.classList.toggle('is-selected', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });
            updateNavState(index);
        };

        const scrollToSlide = (index) => {
            if (index < 0 || index >= slides.length) return;
            currentIndex = index;
            const slide = slides[currentIndex];
            const offset = slide.offsetLeft - wrapper.offsetLeft;
            wrapper.scrollTo({ left: offset, behavior: 'smooth' });
            updateDots(currentIndex);
        };

        nextBtn.addEventListener('click', () => { if (currentIndex < slides.length - 1) scrollToSlide(currentIndex + 1); });
        prevBtn.addEventListener('click', () => { if (currentIndex > 0) scrollToSlide(currentIndex - 1); });

        wrapper.addEventListener('scroll', () => {
            let closestIndex = 0; let minDiff = Infinity;
            slides.forEach((slide, i) => {
                const diff = Math.abs((slide.offsetLeft - wrapper.offsetLeft) - wrapper.scrollLeft);
                if (diff < minDiff) { minDiff = diff; closestIndex = i; }
            });
            if (currentIndex !== closestIndex) { currentIndex = closestIndex; updateDots(currentIndex); }
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => scrollToSlide(i));
            dot.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    scrollToSlide(Math.min(i + 1, slides.length - 1));
                } else if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    scrollToSlide(Math.max(i - 1, 0));
                } else if (event.key === 'Home') {
                    event.preventDefault();
                    scrollToSlide(0);
                } else if (event.key === 'End') {
                    event.preventDefault();
                    scrollToSlide(slides.length - 1);
                }
            });
        });

        updateDots(currentIndex);
    }

    // 2. 상단 프로그레스 바 로직
    window.addEventListener('scroll', function () {
        const scrollProgress = document.getElementById("scrollProgress");
        if (scrollProgress) {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        }
    });
});