// slideshow.js

document.addEventListener('DOMContentLoaded', async () => {
    // Path to your students_data.json file (relative to index.html)
    const studentsDataUrl = 'students_data.json';
    const slidesWrapper = document.getElementById('student-slideshow-wrapper');
    const indicatorsContainer = document.getElementById('slide-indicators-container');

    // Make sure these elements exist in your index.html
    if (!slidesWrapper || !indicatorsContainer) {
        console.error("Slideshow containers not found. Please ensure 'student-slideshow-wrapper' and 'slide-indicators-container' IDs exist in index.html.");
        return;
    }

    let students = []; // Global array to store student data
    let currentSlideIndex = 0;
    let slideInterval; // For auto-slide functionality
    const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

    // --- Function to fetch and render student data ---
    async function loadStudentsAndRenderSlideshow() {
        try {
            const response = await fetch(studentsDataUrl);
            if (!response.ok) {
                // If the file doesn't exist or there's an error, log it.
                // For a new setup, students_data.json might not exist yet.
                console.warn(`Could not load students_data.json from ${studentsDataUrl}. Status: ${response.status}`);
                // You might want to display a message to the user or show a default empty state
                slidesWrapper.innerHTML = '<p style="text-align: center; color: #555;">No student data found. Please use the editor to add students.</p>';
                return;
            }
            students = await response.json();
            renderSlideshow(students);
            startAutoSlide(); // Start auto-sliding only if data is loaded
        } catch (error) {
            console.error("Error loading or parsing student data:", error);
            slidesWrapper.innerHTML = '<p style="text-align: center; color: red;">Error loading student data. Please check console for details.</p>';
        }
    }

    // --- Function to dynamically render slides and indicators ---
    function renderSlideshow(studentsData) {
        slidesWrapper.innerHTML = ''; // Clear existing slides
        indicatorsContainer.innerHTML = ''; // Clear existing indicators

        if (studentsData.length === 0) {
            slidesWrapper.innerHTML = '<p style="text-align: center; color: #555;">No students to display.</p>';
            return;
        }

        studentsData.forEach((student, index) => {
            // Create slide element
            const slide = document.createElement('div');
            slide.classList.add('student-slide');
            if (index === 0) {
                slide.classList.add('active'); // First slide is active by default
            }

            // Populate slide content (customize this based on your student data structure)
            slide.innerHTML = `
                <img src="${student.imageUrl || 'path/to/default-avatar.png'}" alt="${student.name}'s image" class="student-image">
                <h3>${student.name}</h3>
                <p>${student.description || 'No description provided.'}</p>
                <div class="student-details">
                    ${student.major ? `<p><strong>Major:</strong> ${student.major}</p>` : ''}
                    ${student.gradYear ? `<p><strong>Graduation Year:</strong> ${student.gradYear}</p>` : ''}
                    ${student.hobbies ? `<p><strong>Hobbies:</strong> ${student.hobbies.join(', ')}</p>` : ''}
                    ${student.email ? `<p><strong>Email:</strong> <a href="mailto:${student.email}">${student.email}</a></p>` : ''}
                    ${student.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${student.linkedin}" target="_blank">Profile</a></p>` : ''}
                </div>
            `;
            slidesWrapper.appendChild(slide);

            // Create indicator element
            const indicator = document.createElement('span');
            indicator.classList.add('slide-indicator');
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.dataset.slideIndex = index; // Store index for navigation
            indicator.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            indicatorsContainer.appendChild(indicator);
        });

        // Add navigation buttons if you want them (optional)
        addNavigationButtons();
    }

    // --- Function to show a specific slide ---
    function showSlide(index) {
        const slides = document.querySelectorAll('.student-slide');
        const indicators = document.querySelectorAll('.slide-indicator');

        // Ensure index wraps around for continuous slideshow
        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }

        // Deactivate all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Activate the current slide and indicator
        slides[currentSlideIndex].classList.add('active');
        indicators[currentSlideIndex].classList.add('active');
    }

    // --- Function to go to a specific slide and update state ---
    function goToSlide(index) {
        showSlide(index);
    }

    // --- Function to go to the next slide ---
    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }

    // --- Function to go to the previous slide ---
    function prevSlide() {
        showSlide(currentSlideIndex - 1);
    }

    // --- Auto-slide functionality ---
    function startAutoSlide() {
        clearInterval(slideInterval); // Clear any existing interval
        slideInterval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    }

    function resetAutoSlide() {
        startAutoSlide(); // Restart the timer
    }

    // --- Add navigation buttons (optional, you'll need HTML for these) ---
    function addNavigationButtons() {
        // You might want to add buttons in your HTML and get references to them here
        // Example:
        // const prevBtn = document.getElementById('prev-slide-btn');
        // const nextBtn = document.getElementById('next-slide-btn');

        // if (prevBtn) {
        //     prevBtn.addEventListener('click', () => {
        //         prevSlide();
        //         resetAutoSlide();
        //     });
        // }
        // if (nextBtn) {
        //     nextBtn.addEventListener('click', () => {
        //         nextSlide();
        //         resetAutoSlide();
        //     });
        // }

        // For now, let's assume you'll manually add them or add a simple example
        // (This part can be integrated into your HTML or dynamically created here)
    }

    // --- Initial load ---
    loadStudentsAndRenderSlideshow();
});
