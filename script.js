// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Carousel Functionality
let currentSlide = {};

function initializeCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
        currentSlide[carouselId] = 0;
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        const totalSlides = carouselItems.length;

        // Set initial position
        carousel.scrollLeft = 0;

        // Auto-scroll functionality
        setInterval(() => {
            if (!carousel.matches(':hover')) {
                currentSlide[carouselId] = (currentSlide[carouselId] + 1) % Math.ceil(totalSlides / getVisibleSlides(carouselId));
                updateCarousel(carouselId);
            }
        }, 5000);
    }
}

function getVisibleSlides(carouselId) {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) return 1;
    if (screenWidth < 768) return 1;
    return 3;
}

function updateCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const visibleSlides = getVisibleSlides(carouselId);
    const itemWidth = carouselItems[0].offsetWidth + 16; // 16px gap
    const scrollAmount = currentSlide[carouselId] * itemWidth * visibleSlides;

    carousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function nextSlide(carouselId) {
    const carousel = document.getElementById(carouselId);
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const visibleSlides = getVisibleSlides(carouselId);
    const maxSlide = Math.ceil(carouselItems.length / visibleSlides) - 1;

    currentSlide[carouselId] = (currentSlide[carouselId] + 1) > maxSlide ? 0 : currentSlide[carouselId] + 1;
    updateCarousel(carouselId);
}

function prevSlide(carouselId) {
    const carousel = document.getElementById(carouselId);
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const visibleSlides = getVisibleSlides(carouselId);
    const maxSlide = Math.ceil(carouselItems.length / visibleSlides) - 1;

    currentSlide[carouselId] = (currentSlide[carouselId] - 1) < 0 ? maxSlide : currentSlide[carouselId] - 1;
    updateCarousel(carouselId);
}

// Initialize all carousels
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel('tech-carousel');
    initializeCarousel('news-carousel');
    initializeCarousel('world-carousel');
    initializeCarousel('education-carousel');
    initializeCarousel('lifestyle-carousel');
    initializeCarousel('sports-carousel');
});

// Scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.style.backgroundColor = 'rgba(26, 26, 26, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
        header.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// Carousel touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelectorAll('.carousel').forEach(carousel => {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(carousel);
    });
});

function handleSwipe(carousel) {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        const carouselId = carousel.id;
        if (swipeDistance > 0) {
            prevSlide(carouselId);
        } else {
            nextSlide(carouselId);
        }
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe carousel sections for animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.category-section').forEach(section => {
        observer.observe(section);
    });
});

// Keyboard navigation for carousels
document.addEventListener('keydown', (e) => {
    const activeCarousel = document.querySelector('.carousel:hover');
    if (activeCarousel) {
        const carouselId = activeCarousel.id;
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide(carouselId);
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide(carouselId);
                break;
        }
    }
});

// Loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Initialize carousel positions after images load
    setTimeout(() => {
        document.querySelectorAll('.carousel').forEach(carousel => {
            carousel.scrollLeft = 0;
        });
    }, 1000);
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Failed to load image:', this.src);
    });
});

// Performance optimization: Lazy loading for carousels
const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const carousel = entry.target;
            initializeCarousel(carousel.id);
            carouselObserver.unobserve(carousel);
        }
    });
}, { threshold: 0.1 });

// Observe carousels for lazy initialization
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        carouselObserver.observe(carousel);
    });
});

// Add loading class styles
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) .carousel-item {
        opacity: 0;
        transform: translateY(20px);
    }

    .loaded .carousel-item {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);
