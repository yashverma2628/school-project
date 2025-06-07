
    
        // Make sure DOM is fully loaded before executing scripts
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM fully loaded and parsed');
            
            // Initialize slideshow
            showSlide(currentSlideIndex);
            
            // Add animation observers
            initializeAnimations();
        });

        // Function to redirect to different pages
        function redirectToPage(pageName) {
            console.log('Redirecting to:', pageName);
            try {
                window.location.href = pageName;
            } catch (error) {
                console.error('Error redirecting to page:', error);
                // Fallback method
                window.location.assign(pageName);
            }
        }

        // Specific function for gallery navigation (more robust)
        function navigateToGallery() {
            console.log('Navigate to gallery clicked');
            try {
                // Multiple fallback methods
                if (window.location.href) {
                    window.location.href = 'gallery.html';
                } else if (window.location.assign) {
                    window.location.assign('gallery.html');
                } else {
                    window.location = 'gallery.html';
                }
            } catch (error) {
                console.error('Error navigating to gallery:', error);
                alert('Unable to navigate to gallery. Please check if gallery.html exists.');
            }
        }

        // Function to scroll to sections
        function scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }

        // Function to open social media links
        function openSocialMedia(platform) {
            const urls = {
                'facebook': 'https://facebook.com/smpn1cibadak', // Replace with actual URL
                'instagram': 'https://instagram.com/smpn1cibadak', // Replace with actual URL
                'youtube': 'https://youtube.com/smpn1cibadak' // Replace with actual URL
            };
            window.open(urls[platform], '_blank');
        }

        // Function to open gallery modal (you can customize this)
        function openGalleryModal(galleryType) {
            // This can redirect to a specific gallery page or open a modal
            redirectToPage(`gallery-${galleryType}.html`);
        }

        // Initialize animations
        function initializeAnimations() {
            // Add animation on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);

            // Observe all elements that should animate
            document.querySelectorAll('.feature-card, .news-card, .gallery-item, .principal-card').forEach(el => {
                observer.observe(el);
            });
        }

        // Slideshow functionality
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.student-slide');
        const indicators = document.querySelectorAll('.indicator');
        const totalSlides = slides.length;

        // Auto-slide functionality
        let slideInterval = setInterval(nextSlide, 10000);

        function showSlide(index) {
            if (slides.length === 0) return; // Safety check
            
            // Hide all slides
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i < index) {
                    slide.classList.add('prev');
                }
            });

            // Show current slide
            slides[index].classList.add('active');

            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            showSlide(currentSlideIndex);
        }

        function prevSlide() {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentSlideIndex);
        }

        function changeSlide(direction) {
            clearInterval(slideInterval);
            if (direction === 1) {
                nextSlide();
            } else {
                prevSlide();
            }
            slideInterval = setInterval(nextSlide, 10000);
        }

        function currentSlide(index) {
            clearInterval(slideInterval);
            currentSlideIndex = index - 1;
            showSlide(currentSlideIndex);
            slideInterval = setInterval(nextSlide, 10000);
        }

        // Pause auto-slide on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            slideshowContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 10000);
            });
        } 
    
