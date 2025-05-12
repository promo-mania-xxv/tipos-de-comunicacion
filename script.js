document.addEventListener('DOMContentLoaded', () => {
    const presentation = document.getElementById('presentation');
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progressText');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    // Initialize presentation
    function initializePresentation() {
        slides[0].classList.add('active');
        updateProgress();
        setupParticles();
        setupEventListeners();
    }

    // Optimized particles system
    function setupParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        
        // Clear existing particles
        particlesContainer.innerHTML = '';
        
        // Create particles with better performance
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and animation
            particle.style.cssText = `
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 4}s infinite alternate ease-in-out;
                opacity: ${0.2 + Math.random() * 0.3};
                transform: scale(${0.5 + Math.random() * 1.5});
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0) translateX(0); }
                100% { transform: translateY(${window.innerHeight * 0.1}px) translateX(${Math.random() > 0.5 ? '-' : ''}${window.innerWidth * 0.05}px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Update progress bar and text
    function updateProgress() {
        const progress = (currentSlide / (slides.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${currentSlide + 1}/${slides.length}`;
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

        // Update progress
        updateProgress();
    }

    // Event listeners setup
    function setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Touch events for mobile swipe
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        
        // Mouse wheel for desktop
        window.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Keyboard navigation handler
    function handleKeyDown(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prevSlide();
        }
    }

    // Touch start handler
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
    }

    // Touch move handler
    function handleTouchMove(e) {
        if (!isSwiping) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        // Calculate differences
        const diffX = touchStartX - touchX;
        const diffY = touchStartY - touchY;
        
        // Only prevent default if horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) {
            e.preventDefault();
        }
    }

    // Touch end handler
    function handleTouchEnd(e) {
        if (!isSwiping) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Check if it's a horizontal swipe (not vertical scroll)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isSwiping = false;
    }

    // Mouse wheel handler
    function handleWheel(e) {
        // Prevent default only for vertical scrolling to avoid page jump
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            
            if (e.deltaY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Handle window resize
    function handleResize() {
        // Debounce resize events
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            setupParticles();
        }, 200);
    }

    // Expose functions globally for HTML onclick events
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Initialize event listeners
    window.addEventListener('resize', handleResize);

    // Initialize presentation
    initializePresentation();
});