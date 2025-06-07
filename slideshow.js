  class StudentSlideshow {
            constructor() {
                this.students = [];
                this.currentSlide = 0;
                this.slideInterval = null;
                this.autoSlideDelay = 5000; // 5 seconds
                
                this.slideWrapper = document.getElementById('slideWrapper');
                this.indicatorsContainer = document.getElementById('slideIndicators');
                this.loadingMessage = document.getElementById('loadingMessage');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                
                this.init();
            }

            async init() {
                try {
                    await this.loadStudentData();
                    this.renderSlideshow();
                    this.setupEventListeners();
                    this.startAutoSlide();
                } catch (error) {
                    this.showError('Failed to load student data');
                    console.error('Slideshow initialization error:', error);
                }
            }

            async loadStudentData() {
                try {
                    const response = await fetch('students_data.json');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    this.students = await response.json();
                    
                    // Process the data to match our slideshow format
                    this.students = this.students.map(student => ({
                        name: student.name,
                        imageUrl: student.imageUrl || 'https://via.placeholder.com/200x200?text=No+Image',
                        percentage: student.percentage || 'N/A',
                        batchYear: student.batchYear || `Batch ${student.gradYear}` || 'Unknown Batch'
                    }));
                    
                } catch (error) {
                    console.error('Error loading student data:', error);
                    // Fallback to sample data if JSON file is not found
                    console.warn('Using fallback sample data');
                    this.students = [
                        {
                            "name": "Sample Student 1",
                            "imageUrl": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
                            "percentage": "95.6%",
                            "batchYear": "Batch 2026"
                        },
                        {
                            "name": "Sample Student 2",
                            "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
                            "percentage": "92.4%",
                            "batchYear": "Batch 2025"
                        }
                    ];
                }
            }

            renderSlideshow() {
                if (this.students.length === 0) {
                    this.slideWrapper.innerHTML = '<div class="error-message">No student data available</div>';
                    return;
                }

                // Clear existing content
                this.slideWrapper.innerHTML = '';
                this.indicatorsContainer.innerHTML = '';

                // Create slides
                this.students.forEach((student, index) => {
                    const slide = this.createSlide(student, index);
                    this.slideWrapper.appendChild(slide);
                });

                // Create indicators
                this.students.forEach((_, index) => {
                    const indicator = this.createIndicator(index);
                    this.indicatorsContainer.appendChild(indicator);
                });

                // Show first slide
                this.showSlide(0);
            }

            createSlide(student, index) {
                const slide = document.createElement('div');
                slide.className = 'student-slide';
                slide.innerHTML = `
                    <div class="student-card">
                        <img src="${student.imageUrl}" alt="${student.name}" class="student-photo" loading="lazy">
                        <div class="student-info">
                            <h3>${student.name}</h3>
                            <div class="percentage">${student.percentage}</div>
                            <div class="batch">${student.batchYear}</div>
                        </div>
                    </div>
                `;
                return slide;
            }

            createIndicator(index) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                });
                return indicator;
            }

            showSlide(index) {
                const slides = this.slideWrapper.querySelectorAll('.student-slide');
                const indicators = this.indicatorsContainer.querySelectorAll('.indicator');

                // Remove active classes
                slides.forEach(slide => {
                    slide.classList.remove('active', 'prev');
                });
                indicators.forEach(indicator => {
                    indicator.classList.remove('active');
                });

                // Add prev class to current slide before changing
                if (slides[this.currentSlide]) {
                    slides[this.currentSlide].classList.add('prev');
                }

                // Update current slide index
                this.currentSlide = index;

                // Add active classes
                if (slides[this.currentSlide]) {
                    setTimeout(() => {
                        slides[this.currentSlide].classList.add('active');
                    }, 50);
                }
                
                if (indicators[this.currentSlide]) {
                    indicators[this.currentSlide].classList.add('active');
                }
            }

            goToSlide(index) {
                if (index >= 0 && index < this.students.length) {
                    this.showSlide(index);
                    this.resetAutoSlide();
                }
            }

            nextSlide() {
                const nextIndex = (this.currentSlide + 1) % this.students.length;
                this.showSlide(nextIndex);
            }

            prevSlide() {
                const prevIndex = (this.currentSlide - 1 + this.students.length) % this.students.length;
                this.showSlide(prevIndex);
            }

            startAutoSlide() {
                this.slideInterval = setInterval(() => {
                    this.nextSlide();
                }, this.autoSlideDelay);
            }

            stopAutoSlide() {
                if (this.slideInterval) {
                    clearInterval(this.slideInterval);
                    this.slideInterval = null;
                }
            }

            resetAutoSlide() {
                this.stopAutoSlide();
                this.startAutoSlide();
            }

            setupEventListeners() {
                // Navigation buttons
                this.prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                    this.resetAutoSlide();
                });

                this.nextBtn.addEventListener('click', () => {
                    this.nextSlide();
                    this.resetAutoSlide();
                });

                // Pause on hover
                this.slideWrapper.addEventListener('mouseenter', () => {
                    this.stopAutoSlide();
                });

                this.slideWrapper.addEventListener('mouseleave', () => {
                    this.startAutoSlide();
                });

                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        this.prevSlide();
                        this.resetAutoSlide();
                    } else if (e.key === 'ArrowRight') {
                        this.nextSlide();
                        this.resetAutoSlide();
                    }
                });

                // Touch/swipe support
                let startX = 0;
                let endX = 0;

                this.slideWrapper.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });

                this.slideWrapper.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    const diff = startX - endX;

                    if (Math.abs(diff) > 50) { // Minimum swipe distance
                        if (diff > 0) {
                            this.nextSlide(); // Swipe left - next slide
                        } else {
                            this.prevSlide(); // Swipe right - previous slide
                        }
                        this.resetAutoSlide();
                    }
                });
            }

            showError(message) {
                this.slideWrapper.innerHTML = `<div class="error-message">${message}</div>`;
            }
        }

        // Initialize slideshow when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new StudentSlideshow();
        });
