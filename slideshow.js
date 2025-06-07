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
                    this.showLoadingMessage();
                    await this.loadStudentData();
                    this.hideLoadingMessage();
                    this.renderSlideshow();
                    this.setupEventListeners();
                    this.startAutoSlide();
                    
                    console.log(`Slideshow initialized with ${this.students.length} students`);
                } catch (error) {
                    this.showError('Failed to load student data: ' + error.message);
                    console.error('Slideshow initialization error:', error);
                }
            }

            showLoadingMessage() {
                if (this.loadingMessage) {
                    this.loadingMessage.style.display = 'flex';
                }
            }

            hideLoadingMessage() {
                if (this.loadingMessage) {
                    this.loadingMessage.style.display = 'none';
                }
            }

            async loadStudentData() {
                try {
                    console.log('Loading student data from students_data.json...');
                    const response = await fetch('students_data.json');
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Raw data loaded:', data);
                    
                    // Handle both array and object formats
                    if (Array.isArray(data)) {
                        this.students = data;
                    } else if (data.students && Array.isArray(data.students)) {
                        this.students = data.students;
                    } else {
                        throw new Error('Invalid data format - expected array of students');
                    }
                    
                    // Process and validate the data according to your JSON structure
                    this.students = this.students.map((student, index) => {
                        if (!student || typeof student !== 'object') {
                            console.warn(`Invalid student data at index ${index}:`, student);
                            return null;
                        }
                        
                        // Handle your specific JSON structure
                        let batchYear = student.batchYear;
                        if (!batchYear && student.gradYear) {
                            batchYear = `Batch ${student.gradYear}`;
                        }
                        if (!batchYear) {
                            batchYear = 'Unknown Batch';
                        }
                        
                        return {
                            name: student.name || `Student ${index + 1}`,
                            imageUrl: student.imageUrl || 'https://via.placeholder.com/200x200?text=No+Image',
                            percentage: student.percentage || 'N/A',
                            batchYear: batchYear
                        };
                    }).filter(student => student !== null); // Remove invalid entries
                    
                    console.log(`Processed ${this.students.length} valid students:`, this.students);
                    
                    if (this.students.length === 0) {
                        throw new Error('No valid student data found');
                    }
                    
                } catch (error) {
                    console.error('Error loading student data:', error);
                    console.warn('Using fallback sample data');
                    
                    // Updated fallback data matching your JSON structure
                    this.students = [
                        {
                            name: "Alice Smith",
                            imageUrl: "https://github.com/yashverma2628/school-project/blob/main/Snapchat-416427894.jpg?raw=true",
                            percentage: "95.6%",
                            batchYear: "Batch 2026"
                        },
                        {
                            name: "Bob Johnson", 
                            imageUrl: "https://via.placeholder.com/200x200?text=Bob+Johnson",
                            percentage: "92.4%",
                            batchYear: "Batch 2025"
                        },
                        {
                            name: "yt",
                            imageUrl: "https://github.com/yashverma2628/school-project/blob/main/images/1749318136457_school%20%20achievements.png?raw=true",
                            percentage: "69%",
                            batchYear: "Batch 2026"
                        },
                        {
                            name: "eoruwieri",
                            imageUrl: "https://github.com/yashverma2628/school-project/blob/main/images/1749319469821_school%20emoji.png?raw=true",
                            percentage: "88%",
                            batchYear: "Batch 2026"
                        }
                    ];
                }
            }

            renderSlideshow() {
                console.log(`Rendering slideshow with ${this.students.length} students`);
                
                if (this.students.length === 0) {
                    this.slideWrapper.innerHTML = '<div class="error-message">No student data available</div>';
                    return;
                }

                // Clear existing content
                this.slideWrapper.innerHTML = '';
                this.indicatorsContainer.innerHTML = '';

                // Create slides container
                const slidesContainer = document.createElement('div');
                slidesContainer.className = 'slides-container';
                slidesContainer.style.width = `${this.students.length * 100}%`;

                // Create slides
                this.students.forEach((student, index) => {
                    console.log(`Creating slide ${index + 1} for:`, student.name);
                    const slide = this.createSlide(student, index);
                    slidesContainer.appendChild(slide);
                });

                this.slideWrapper.appendChild(slidesContainer);

                // Create indicators
                this.students.forEach((_, index) => {
                    const indicator = this.createIndicator(index);
                    this.indicatorsContainer.appendChild(indicator);
                });

                // Show first slide
                this.showSlide(0);
                console.log('Slideshow rendering complete');
            }

            createSlide(student, index) {
                const slide = document.createElement('div');
                slide.className = 'student-slide';
                slide.style.width = `${100 / this.students.length}%`;
                
                // Handle image loading errors
                const imageUrl = student.imageUrl;
                const fallbackImage = 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(student.name.charAt(0));
                
                slide.innerHTML = `
                    <div class="student-card">
                        <img src="${imageUrl}" 
                             alt="${student.name}" 
                             class="student-photo" 
                             loading="lazy"
                             onerror="this.src='${fallbackImage}'">
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
                indicator.setAttribute('data-slide', index);
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                });
                return indicator;
            }

            showSlide(index) {
                const slidesContainer = this.slideWrapper.querySelector('.slides-container');
                const indicators = this.indicatorsContainer.querySelectorAll('.indicator');

                if (!slidesContainer) {
                    console.error('Slides container not found');
                    return;
                }

                // Ensure index is within bounds
                if (index < 0) {
                    index = this.students.length - 1;
                } else if (index >= this.students.length) {
                    index = 0;
                }

                // Update current slide index
                this.currentSlide = index;

                // Move slides container
                const translateX = -index * (100 / this.students.length);
                slidesContainer.style.transform = `translateX(${translateX}%)`;

                // Update indicators
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });

                console.log(`Showing slide ${index + 1} of ${this.students.length}`);
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
                if (this.students.length <= 1) return;
                
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
                if (this.prevBtn) {
                    this.prevBtn.addEventListener('click', () => {
                        this.prevSlide();
                        this.resetAutoSlide();
                    });
                }

                if (this.nextBtn) {
                    this.nextBtn.addEventListener('click', () => {
                        this.nextSlide();
                        this.resetAutoSlide();
                    });
                }

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
                    this.stopAutoSlide();
                });

                this.slideWrapper.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    const diff = startX - endX;

                    if (Math.abs(diff) > 50) {
                        if (diff > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    }
                    this.resetAutoSlide();
                });
            }

            showError(message) {
                this.slideWrapper.innerHTML = `<div class="error-message">${message}</div>`;
                console.error('Slideshow error:', message);
            }
        }

        // Initialize slideshow when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const slideshow = new StudentSlideshow();
            window.slideshow = slideshow;
        });
