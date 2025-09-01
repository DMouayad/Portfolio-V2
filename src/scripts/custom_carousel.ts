
function initializeCarousel() {
    const carousels = document.querySelectorAll<HTMLElement>('.custom-carousel');

    carousels.forEach(carousel => {
        const viewport = carousel.querySelector<HTMLElement>('.carousel-viewport');
        if (!viewport) return;

        const slidesCount = parseInt(carousel.getAttribute('slides-count') || '0');
        if (slidesCount <= 1) {
            const arrows = carousel.querySelector('.carousel-arrows');
            if (arrows) arrows.remove();
            const dots = carousel.querySelector('.carousel-dots');
            if (dots) dots.remove();
            return;
        }

        const carouselId = carousel.id;
        const isArabic = document.documentElement.lang === 'ar';

        const prevBtn = carousel.querySelector<HTMLButtonElement>('.prev-slide-btn');
        const nextBtn = carousel.querySelector<HTMLButtonElement>('.next-slide-btn');

        let isDragging = false;
        let startX: number;
        let scrollLeft: number;

        const getSlideIndex = (): number => {
            const slideWidth = viewport.scrollWidth / slidesCount;
            if (slideWidth === 0) return 0;
            // For RTL, the scrollLeft can be negative and fractional
            if (isArabic) {
                return Math.round(Math.abs(viewport.scrollLeft) / slideWidth);
            }
            return Math.round(viewport.scrollLeft / slideWidth);
        };

        const updateControls = (index: number) => {
            const dotValue = carouselId + "_" + (index);
            const radio = carousel.querySelector<HTMLInputElement>(`.controls__dot[value="${dotValue}"]`);
            if (radio && !radio.checked) {
                radio.checked = true;
            }

            if (prevBtn && nextBtn) {
                prevBtn.disabled = index === 0;
                nextBtn.disabled = index >= slidesCount - 1;
            }
        };

        const goToSlide = (index: number, behavior: ScrollBehavior = 'smooth') => {
            const slideWidth = viewport.scrollWidth / slidesCount;
            if (isNaN(slideWidth) || slideWidth === 0) return;

            // In RTL, we scroll to a negative value
            const left = isArabic ? -index * slideWidth : index * slideWidth;

            viewport.scrollTo({
                left: left,
                behavior: behavior
            });
        };

        let scrollEndTimer: any;
        viewport.addEventListener('scroll', () => {
            if (isDragging) return;
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                const currentIndex = getSlideIndex();
                updateControls(currentIndex);
            }, 150);
        });

        const pointerDown = (e: PointerEvent) => {
            isDragging = true;
            startX = e.pageX - viewport.offsetLeft;
            scrollLeft = viewport.scrollLeft;
            viewport.style.scrollBehavior = 'auto';
            viewport.style.cursor = 'grabbing';
        };

        const pointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - viewport.offsetLeft;
            const walk = (x - startX);
            viewport.scrollLeft = scrollLeft - walk;
        };

        const pointerUp = () => {
            if (!isDragging) return;
            isDragging = false;
            viewport.style.scrollBehavior = 'smooth';
            viewport.style.cursor = 'grab';

            const slideWidth = viewport.scrollWidth / slidesCount;
            if (slideWidth === 0) return;

            const scrollDiff = viewport.scrollLeft - scrollLeft;

            let currentIndex = getSlideIndex();
            const dragThreshold = slideWidth / 4;

            // This logic needs to be RTL aware
            if (isArabic) {
                if (scrollDiff < -dragThreshold && currentIndex < slidesCount - 1) {
                    currentIndex++;
                } else if (scrollDiff > dragThreshold && currentIndex > 0) {
                    currentIndex--;
                }
            } else {
                if (scrollDiff > dragThreshold && currentIndex < slidesCount - 1) {
                    currentIndex++;
                } else if (scrollDiff < -dragThreshold && currentIndex > 0) {
                    currentIndex--;
                }
            }

            goToSlide(currentIndex);
        };

        viewport.addEventListener('pointerdown', pointerDown);
        viewport.addEventListener('pointermove', pointerMove);
        viewport.addEventListener('pointerup', pointerUp);
        viewport.addEventListener('pointerleave', pointerUp);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = getSlideIndex() - 1;
                goToSlide(newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = getSlideIndex() + 1;
                goToSlide(newIndex);
            });
        }

        const radioControls = carousel.querySelectorAll<HTMLInputElement>('.controls__dot');
        radioControls.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target.checked) {
                    const slideId = target.value.split('_')[1];
                    const index = parseInt(slideId);
                    if (isNaN(index)) {
                        console.error('ERROR: could not determine new slideId')
                        return;
                    }
                    goToSlide(index);
                }
            });
        });

        const observer = new ResizeObserver(() => {
            // Use a non-smooth behavior on resize to avoid weird scrolling effects
            const currentIndex = getSlideIndex();
            goToSlide(currentIndex, 'auto');
        });
        observer.observe(viewport);

        updateControls(0);
        viewport.style.cursor = 'grab';
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCarousel);
} else {
    initializeCarousel();
}
