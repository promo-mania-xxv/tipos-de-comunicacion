document.addEventListener('DOMContentLoaded', () => {
    const presentation = document.getElementById('presentation');
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;

    // Optimize initial state
    function initializePresentation() {
        // Ensure first slide is active
        slides[0].classList.add('active');
        updateProgressBar();
        setupParticles();
    }

    // Simple particles effect
    function setupParticles() {
        const particlesContainer = document.getElementById('particles');
        const numParticles = window.innerWidth < 768 ? 50 : 100;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(52, 152, 219, 0.3);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 5}s infinite alternate;
            `;
            particlesContainer.appendChild(particle);
        }

        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                from { transform: translateY(0); }
                to { transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = (currentSlide / (slides.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Navigation functions
    function nextSlide() {
        changeSlide(currentSlide + 1);
    }

    function prevSlide() {
        changeSlide(currentSlide - 1);
    }

    function goToSlide(index) {
        changeSlide(index);
    }

    function changeSlide(newIndex) {
        // Prevent out of bounds navigation
        if (newIndex < 0 || newIndex >= slides.length) return;

        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        navDots[currentSlide].classList.remove('active');

        // Add active class to new slide
        slides[newIndex].classList.add('active');
        navDots[newIndex].classList.add('active');

        // Update current slide
        currentSlide = newIndex;

        // Update progress bar
        updateProgressBar();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Swipe navigation for mobile
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;

        if (Math.abs(diffX) > 50) {
            // Swipe left
            if (diffX > 0) {
                nextSlide();
            } 
            // Swipe right
            else {
                prevSlide();
            }
        }
    });

    // Expose functions globally for HTML onclick events
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Initialize presentation
    initializePresentation();
});

// Performance and accessibility optimizations
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        // Reposition or adjust particles if needed
        const particlesContainer = document.getElementById('particles');
        particlesContainer.innerHTML = ''; // Clear existing particles
        setupParticles();
    }, 250);
});