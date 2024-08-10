const MOBILE_IMAGE_WIDTH_PERCENTAGE = 0.85;
let cursorX, containerRect, isLandscape;

const isMobileOrTablet = () => window.innerWidth <= 1024;
const isLandscapeMode = () => window.innerWidth > window.innerHeight;

const updateClipPath = (percentage) => {
    const clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0% 100%)`;
    document.getElementById('redacted').style.clipPath = clipPath;
    document.getElementById('unredacted').style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
};

const animate = () => {
    const width = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
    const percentage = Math.min(100, Math.max(0, (cursorX / width) * 100));
    updateClipPath(percentage);
};

const updateCursorPosition = (clientX, isTouchEvent = false) => {
    if (isMobileOrTablet() && isTouchEvent) {
        const imageWidth = containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE;
        const imageLeft = (containerRect.width - imageWidth) / 2;
        cursorX = Math.max(0, Math.min(clientX - containerRect.left - imageLeft, imageWidth));
    } else if (!isMobileOrTablet()) {
        cursorX = Math.max(0, Math.min(clientX - containerRect.left, containerRect.width));
    }
    updateSlider();
    animate();
};

const updateSlider = () => {
    const width = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
    const percentage = (cursorX / width) * 100;
    document.getElementById('camera-slider').value = Math.min(100, Math.max(0, percentage));
};

const handleResize = () => {
    containerRect = document.getElementById('container').getBoundingClientRect();
    isLandscape = isLandscapeMode();
    const sliderContainer = document.getElementById('camera-slider-container');
    sliderContainer.style.display = isMobileOrTablet() ? 'block' : 'none';
    cursorX = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
    updateSlider();
    animate();
};

const initializeFullRedacted = () => {
    handleResize();
    updateClipPath(100);
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const slider = document.getElementById('camera-slider');

    slider.addEventListener('input', () => {
        const width = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
        cursorX = (slider.value / 100) * width;
        animate();
    });

    container.addEventListener('mousemove', (e) => !isMobileOrTablet() && updateCursorPosition(e.clientX));
    container.addEventListener('touchstart', (e) => isMobileOrTablet() && updateCursorPosition(e.touches[0].clientX, true));
    container.addEventListener('touchmove', (e) => {
        if (isMobileOrTablet()) {
            e.preventDefault();
            updateCursorPosition(e.touches[0].clientX, true);
        }
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    initializeFullRedacted();
});