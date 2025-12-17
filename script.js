// Background Music Control
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;
let musicStarted = false;

if (musicToggle && bgMusic) {
    // Set initial volume (lower)
    bgMusic.volume = 0.1;
    
    // Auto-play on first user interaction anywhere on the page
    const startMusicOnInteraction = () => {
        if (!musicStarted) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicStarted = true;
                musicToggle.classList.add('playing');
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(err => {
                console.log('Audio play failed:', err);
            });
            
            // Remove listeners after first interaction
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('scroll', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
        }
    };
    
    // Listen for any user interaction
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('scroll', startMusicOnInteraction);
    document.addEventListener('keydown', startMusicOnInteraction);
    
    // Toggle button
    musicToggle.addEventListener('click', () => {
        musicStarted = true;
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('paused');
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.play().catch(err => console.log('Audio play failed:', err));
            musicToggle.classList.add('playing');
            musicToggle.classList.remove('paused');
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
}

// Binary Galaxy Background
const canvas = document.getElementById('binary-canvas');
const ctx = canvas.getContext('2d');

let mouseX = 0;
let mouseY = 0;
let particles = [];
const startTime = Date.now(); // For synchronized color shifting

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Convert HSL to RGB for color shifting
function hslToRgb(h, s, l) {
    h = h % 360;
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}

class BinaryParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.binary = Math.random() > 0.5 ? '1' : '0';
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        // Calculate color with hue rotation synchronized with CSS (60 second cycle)
        const elapsed = Date.now() - startTime;
        const cycleProgress = (elapsed % 60000) / 60000; // 0 to 1 over 60 seconds
        const hueRotation = cycleProgress * 360; // 0 to 360 degrees
        
        const baseHue = 84; // Lime green starting point
        const currentHue = (baseHue + hueRotation) % 360;
        const [r, g, b] = hslToRgb(currentHue, 100, 50);
        
        ctx.font = `${this.size * 10}px monospace`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.fillText(this.binary, this.x, this.y);
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new BinaryParticle());
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Mouse tracking
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Initialize canvas
window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    initParticles();
    animate();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Typing Animation for Hero Subtitle
const typingTexts = [
    "Computer Engineering Student",
    "Chess Player",
    "Pokemon Enthusiast",
    "Gamer",
    "Hult Prize Winner",
    "Coding Enjoyer",
    "Mood-time Graphics Designer"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const typingElement = document.getElementById('typing-text');
    
    if (!typingElement) {
        console.error('typing-text element not found');
        return;
    }
    
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        // Pause at end of text
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeText, typingSpeed);
}

// Start typing animation after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1500);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Animate stats numbers
            if (entry.target.classList.contains('stat-number')) {
                animateNumber(entry.target);
            }
            
            // Animate skill bars
            if (entry.target.closest('.skill-category')) {
                animateSkillBars(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-title, .about-text, .personality-item, .stat-card, .project-card, .achievement-card, .contact-item').forEach(el => {
    observer.observe(el);
});

// Observe skill categories for bar animations
document.querySelectorAll('.skill-category').forEach(el => {
    observer.observe(el);
});

// Animate Numbers
function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateNumber = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target;
        }
    };

    updateNumber();
}

// Animate Skill Bars
function animateSkillBars(categoryElement) {
    const skillBars = categoryElement.querySelectorAll('.skill-bar');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level + '%';
        }, index * 100);
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Height of fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.001);
    }
});

// Horizontal scroll with mouse wheel for horizontal gallery - vertical scroll at end
const horizontalGallery = document.querySelector('.horizontal-gallery');
if (horizontalGallery) {
    horizontalGallery.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const scrollLeft = horizontalGallery.scrollLeft;
            const maxScrollLeft = horizontalGallery.scrollWidth - horizontalGallery.clientWidth;
            
            // Check if at the end or beginning
            const atEnd = scrollLeft >= maxScrollLeft - 1;
            const atStart = scrollLeft <= 1;
            
            // Allow vertical scroll if at end/start and scrolling in that direction
            if ((atEnd && e.deltaY > 0) || (atStart && e.deltaY < 0)) {
                // Don't prevent default, allow page scroll
                return;
            }
            
            e.preventDefault();
            horizontalGallery.scrollLeft += e.deltaY;
        }
    });
}

// Horizontal scroll with mouse wheel for skills section - vertical scroll at end
const skillsScrollWrapper = document.querySelector('.skills-scroll-wrapper');
if (skillsScrollWrapper) {
    skillsScrollWrapper.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const scrollLeft = skillsScrollWrapper.scrollLeft;
            const maxScrollLeft = skillsScrollWrapper.scrollWidth - skillsScrollWrapper.clientWidth;
            
            const atEnd = scrollLeft >= maxScrollLeft - 1;
            const atStart = scrollLeft <= 1;
            
            if ((atEnd && e.deltaY > 0) || (atStart && e.deltaY < 0)) {
                return;
            }
            
            e.preventDefault();
            skillsScrollWrapper.scrollLeft += e.deltaY;
        }
    });
}

// Horizontal scroll with mouse wheel for achievements section - vertical scroll at end
const achievementsScrollWrapper = document.querySelector('.achievements-scroll-wrapper');
if (achievementsScrollWrapper) {
    achievementsScrollWrapper.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const scrollLeft = achievementsScrollWrapper.scrollLeft;
            const maxScrollLeft = achievementsScrollWrapper.scrollWidth - achievementsScrollWrapper.clientWidth;
            
            const atEnd = scrollLeft >= maxScrollLeft - 1;
            const atStart = scrollLeft <= 1;
            
            if ((atEnd && e.deltaY > 0) || (atStart && e.deltaY < 0)) {
                return;
            }
            
            e.preventDefault();
            achievementsScrollWrapper.scrollLeft += e.deltaY;
        }
    });
}


// Add stagger animation to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add stagger animation to personality items
const personalityItems = document.querySelectorAll('.personality-item');
personalityItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Show success message (you can replace this with actual form submission)
        const button = contactForm.querySelector('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        // Reset form
        setTimeout(() => {
            contactForm.reset();
            button.innerHTML = originalText;
            button.style.background = '';
        }, 3000);
    });
}

// Add hover effect to floating cards
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.1) rotate(10deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Scroll reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.15
});

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease-out';
    revealObserver.observe(section);
});

// Add dynamic background to sections on hover
const cards = document.querySelectorAll('.project-card, .achievement-card, .personality-item, .stat-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Lazy load animations
const lazyElements = document.querySelectorAll('.lazy-animate');
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            lazyObserver.unobserve(entry.target);
        }
    });
});

lazyElements.forEach(el => lazyObserver.observe(el));

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn, .project-link, .social-icon');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn, .project-link, .social-icon {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-menu a.active {
        color: var(--primary-color);
    }
    
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll-based animations here
    });
});

console.log('Portfolio website loaded successfully! 🚀');
