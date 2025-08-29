document.addEventListener("DOMContentLoaded", () => {
    // --- Element Selection ---
    // Select all necessary elements from the DOM once.
    const body = document.body;
    const darkModeToggle = document.getElementById("darkModeToggle");
    const tabs = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const contactForm = document.getElementById('contact-form');

    // --- Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener("click", (event) => {
            event.preventDefault();
            // Deactivate all tabs and content.
            tabs.forEach(item => item.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            // Activate the clicked tab and its content.
            tab.classList.add("active");
            const activeContent = document.getElementById(tab.dataset.tab);
            if (activeContent) {
                activeContent.classList.add("active");
            }
        });
    });

    // --- Dark Mode Logic ---
    const updateParticlesColor = () => {
        const isDarkMode = body.classList.contains("dark-mode");
        const newColor = isDarkMode ? "#FFFFFF" : "#0d6efd";
        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0 && pJSDom[0].pJS.particles) {
            const pJS = pJSDom[0].pJS;
            pJS.particles.color.value = newColor;
            pJS.particles.line_linked.color = newColor;
            pJS.particles.array.forEach(particle => {
                particle.color.value = newColor;
            });
            pJS.fn.particlesDraw();
        }
    };

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

    // Load saved theme on page load.
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    darkModeToggle.addEventListener("click", () => {
        const currentTheme = localStorage.getItem("theme");
        setTheme(currentTheme === "dark" ? "light" : "dark");
    });

    // --- Particle.js Initialization ---
    const particleConfig = {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#0d6efd" },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#0d6efd", opacity: 0.3, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "bounce" }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    };
    particlesJS("particles-js", particleConfig);


    // --- Contact Form Submission Logic ---
    // Ensure the contact form element exists before adding an event listener.
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission.

            const scriptURL = 'https://script.google.com/macros/s/AKfycbwN31HI_--Mh7qtCAlanceTqxe9neFymWcYkvmwodc_L_5JjGw9CiYXAx66kVlA5ok/exec'; // The URL you copied from Google.
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.btn-submit');
            const formStatus = document.getElementById('form-status');

            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            formStatus.textContent = '';

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        formStatus.textContent = 'Message sent successfully!';
                        formStatus.style.color = 'green';
                        contactForm.reset(); // Clear the form.
                    } else {
                        throw new Error(data.error || 'An unknown error occurred.');
                    }
                })
                .catch(error => {
                    formStatus.textContent = 'Oops! Something went wrong.';
                    formStatus.style.color = 'red';
                    console.error('Error!', error.message);
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                });
        });
    }
});