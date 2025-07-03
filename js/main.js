// Instagram Clone - Main JavaScript

// Form validation and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initFormValidation();
    
    // Initialize phone carousel if on landing page
    initPhoneCarousel();
    
    // Initialize Facebook login simulation
    initFacebookLogin();
});

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form-input');
        const submitBtn = form.querySelector('.btn-primary');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateInput(input);
                updateSubmitButton(form);
            });
            
            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(form);
        });
        
        // Initial button state
        updateSubmitButton(form);
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    // Remove existing error messages
    removeErrorMessage(input);
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is empty
    if (!value) {
        return true; // Don't show error for empty fields until form submission
    }
    
    // Email validation
    if (type === 'email' || name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Username validation
    if (name === 'username') {
        const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
        if (!usernameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Username can only contain letters, numbers, periods, and underscores.';
        } else if (value.length < 1) {
            isValid = false;
            errorMessage = 'Username is too short.';
        }
    }
    
    // Password validation
    if (type === 'password') {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters.';
        }
    }
    
    // Full name validation
    if (name === 'fullname') {
        if (value.length < 1) {
            isValid = false;
            errorMessage = 'Please enter your full name.';
        }
    }
    
    // Show error message if invalid
    if (!isValid) {
        showErrorMessage(input, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(input, message) {
    removeErrorMessage(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ed4956';
}

function removeErrorMessage(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

function updateSubmitButton(form) {
    const inputs = form.querySelectorAll('.form-input');
    const submitBtn = form.querySelector('.btn-primary');
    
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });
    
    if (allFilled) {
        submitBtn.disabled = false;
        submitBtn.style.background = '#0095f6';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.background = '#b2dffc';
    }
}

function handleFormSubmit(form) {
    const inputs = form.querySelectorAll('.form-input');
    let isFormValid = true;
    
    // Validate all inputs
    inputs.forEach(input => {
        const isValid = validateInput(input);
        if (!isValid || !input.value.trim()) {
            isFormValid = false;
            if (!input.value.trim()) {
                showErrorMessage(input, 'This field is required.');
            }
        }
    });
    
    if (isFormValid) {
        // Simulate form submission
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Loading...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        setTimeout(() => {
            // Simulate successful submission
            alert('Form submitted successfully! (This is a demo)');
            
            // Reset form
            form.reset();
            updateSubmitButton(form);
            form.classList.remove('loading');
            submitBtn.textContent = originalText;
        }, 2000);
    }
}

// Phone carousel for landing page
function initPhoneCarousel() {
    const phoneScreens = document.querySelectorAll('.phone-screen');
    
    if (phoneScreens.length === 0) return;
    
    let currentIndex = 0;
    
    // Set first screen as active
    if (phoneScreens[0]) {
        phoneScreens[0].classList.add('active');
    }
    
    // Rotate screens every 4 seconds
    setInterval(() => {
        // Remove active class from current screen
        if (phoneScreens[currentIndex]) {
            phoneScreens[currentIndex].classList.remove('active');
        }
        
        // Move to next screen
        currentIndex = (currentIndex + 1) % phoneScreens.length;
        
        // Add active class to new screen
        if (phoneScreens[currentIndex]) {
            phoneScreens[currentIndex].classList.add('active');
        }
    }, 4000);
}

// Facebook login simulation
function initFacebookLogin() {
    const facebookBtns = document.querySelectorAll('.btn-facebook, .facebook-login');
    
    facebookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Simulate Facebook login popup
            const originalText = btn.textContent || btn.innerHTML;
            btn.textContent = 'Connecting...';
            btn.disabled = true;
            
            setTimeout(() => {
                alert('Facebook login simulation - This is a demo');
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    });
}

// Smooth scrolling for anchor links
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

// Show/hide password functionality
function togglePassword(button) {
    const input = button.previousElementSibling;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    button.textContent = type === 'password' ? 'Show' : 'Hide';
}

// Input focus animation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });
});

// Simulate loading states
function simulateLoading(element, duration = 2000) {
    element.classList.add('loading');
    
    setTimeout(() => {
        element.classList.remove('loading');
    }, duration);
}

// Handle app download clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.download-btn')) {
        e.preventDefault();
        alert('This would redirect to the app store in a real application.');
    }
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-1px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Link hover effects
    const links = document.querySelectorAll('.auth-link, .footer-link');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    });
});

// Handle responsive navigation
function handleResize() {
    const width = window.innerWidth;
    
    // Adjust layout based on screen size
    if (width <= 768) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

// Add loading animation for page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0.8';
});