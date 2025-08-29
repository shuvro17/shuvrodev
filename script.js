document.addEventListener("DOMContentLoaded", () => {
    // --- Element Selection ---
    const body = document.body;
    const darkModeToggle = document.getElementById("darkModeToggle");
    const tabs = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const contactForm = document.getElementById('contact-form');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const publicationImages = document.querySelectorAll('.pub-image');

    // --- Helper function to update particle colors ---
    const updateParticlesColor = () => {
        const isDarkMode = body.classList.contains("dark-mode");
        const newColor = isDarkMode ? "#FFFFFF" : "#0d6efd";
        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0 && pJSDom[0].pJS.particles) {
            const pJS = pJSDom[0].pJS;
            pJS.particles.color.value = newColor;
            pJS.particles.line_linked.color = newColor;
            pJS.particles.array.forEach(particle => { particle.color.value = newColor; });
            pJS.fn.particlesDraw();
        }
    };
    
    // --- Initialize Tab Switching ---
    if (tabs.length > 0 && tabContents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener("click", (event) => {
                event.preventDefault();
                tabs.forEach(item => item.classList.remove("active"));
                tabContents.forEach(content => content.classList.remove("active"));
                tab.classList.add("active");
                const activeContent = document.getElementById(tab.dataset.tab);
                if (activeContent) {
                    activeContent.classList.add("active");
                }
            });
        });
    } else {
        console.warn("Tab elements not found. Tab switching functionality is disabled.");
    }

    // --- Initialize Lightbox ---
    if (lightbox && lightboxImg && publicationImages.length > 0) {
        const openLightbox = (imgElement) => {
            lightboxImg.src = imgElement.src;
            lightbox.classList.add('active');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
        };

        publicationImages.forEach(img => {
            img.addEventListener('click', () => openLightbox(img));
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    } else {
        console.warn("Lightbox or publication image elements not found. Lightbox functionality is disabled.");
    }

    // --- Initialize Dark Mode ---
    if (darkModeToggle) {
        const setTheme = (theme) => {
            if (theme === "dark") {
                body.classList.add("dark-mode");
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.remove("dark-mode");
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            localStorage.setItem("theme", theme);
            updateParticlesColor();
        };

        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);

        darkModeToggle.addEventListener("click", () => {
            const currentTheme = localStorage.getItem("theme");
            setTheme(currentTheme === "dark" ? "light" : "dark");
        });
    } else {
        console.warn("Dark mode toggle button not found. Dark mode functionality is disabled.");
    }

    // --- Initialize Particle.js ---
    if (typeof particlesJS === 'function') {
        const particleConfig = {
            particles: { number: { value: 60, density: { enable: true, value_area: 800 } }, color: { value: "#0d6efd" }, shape: { type: "circle" }, opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } }, size: { value: 3, random: true }, line_linked: { enable: true, distance: 150, color: "#0d6efd", opacity: 0.3, width: 1 }, move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "bounce" } },
            interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true }, modes: { grab: { distance: 140, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } } },
            retina_detect: true
        };
        particlesJS("particles-js", particleConfig);
        updateParticlesColor(); // Set initial particle color
    } else {
        console.warn("particles.js library not found. Background animation is disabled.");
    }

    // --- Initialize Contact Form ---
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) {
            console.error("The #form-status element is missing in your HTML. Form messages will not be displayed.");
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const scriptURL = 'https://script.google.com/macros/s/AKfycbx_b2byvl6r4NWe5nE7PEPT_IwY0kgY46IN8kTIWbacbU9hacZ2OMho-tGTTUY1jpqc/exec';
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.btn-submit');

            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            if (formStatus) formStatus.textContent = '';

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        if (formStatus) {
                            formStatus.textContent = 'Message sent successfully!';
                            formStatus.style.color = 'green';
                        }
                        contactForm.reset();
                    } else { throw new Error(data.error || 'An unknown error occurred.'); }
                })
                .catch(error => {
                    if (formStatus) {
                        formStatus.textContent = 'Oops! Something went wrong.';
                        formStatus.style.color = 'red';
                    }
                    console.error('Error!', error.message);
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                });
        });
    }
});

