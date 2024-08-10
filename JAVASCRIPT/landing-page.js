let cursorX = window.innerWidth; // Initialize to full width for full redacted view
let ticking = false;

function isMobileOrTablet() {
    return window.innerWidth <= 1024;
}

function updateClipPath(percentage) {
    const redacted = document.getElementById('redacted');
    const unredacted = document.getElementById('unredacted');

    redacted.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0% 100%)`;
    unredacted.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
}

function animate() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const screenWidth = window.innerWidth;
            const percentage = (cursorX / screenWidth) * 100;
            updateClipPath(percentage);
            ticking = false;
        });
        ticking = true;
    }
}

function handleSlider() {
    const slider = document.getElementById('camera-slider');
    cursorX = (slider.value / 100) * window.innerWidth;
    animate();
}

function handleMouseMove(event) {
    if (!isMobileOrTablet()) {
        cursorX = event.clientX;
        animate();
    }
}

function handleTouchMove(event) {
    if (isMobileOrTablet()) {
        event.preventDefault();
        const touch = event.touches[0];
        cursorX = touch.clientX;
        updateSlider(cursorX);
        animate();
    }
}

function updateSlider(cursorX) {
    const slider = document.getElementById('camera-slider');
    const percentage = (cursorX / window.innerWidth) * 100;
    slider.value = percentage;
}

function handleResize() {
    const slider = document.getElementById('camera-slider');
    const sliderContainer = document.getElementById('camera-slider-container');
    if (isMobileOrTablet()) {
        sliderContainer.style.display = 'block';
        // Set slider to 100 for full redacted view
        slider.value = 100;
        cursorX = window.innerWidth;
    } else {
        sliderContainer.style.display = 'none';
        cursorX = window.innerWidth; // Set to full width for desktop as well
    }
    animate();
}

function initializeFullRedacted() {
    cursorX = window.innerWidth;
    const slider = document.getElementById('camera-slider');
    if (slider) {
        slider.value = 100; // Set slider to maximum
    }
    updateClipPath(100); // Update clip path to show full redacted view
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('camera-slider');
    slider.addEventListener('input', handleSlider);
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('resize', handleResize);
    
    initializeFullRedacted(); // Initialize with full redacted view
    handleResize(); // Initial setup
});