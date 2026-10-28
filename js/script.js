
// StudentHub Practical 4 - JavaScript Interactivity

document.addEventListener("DOMContentLoaded", () => {
    // 1. Light/Dark Theme with localStorage
    const themeToggle = document.getElementById("theme-toggle");

    function applyTheme(theme) {
        document.body.classList.toggle("dark-theme", theme === "dark");

        themeToggle.textContent =
            theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
        );
    }

    const savedTheme = localStorage.getItem("studenthub-theme");
    applyTheme(savedTheme === "dark" ? "dark" : "light");

    themeToggle.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("dark-theme")
            ? "light"
            : "dark";

        applyTheme(newTheme);
        localStorage.setItem("studenthub-theme", newTheme);
        showNotification(`${newTheme === "dark" ? "Dark" : "Light"} theme enabled.`);
    });

    // 2. Hamburger Navigation
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("main-navigation");

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // 3. Notification Banner
    const notification = document.getElementById("notification-banner");
    const notificationMessage = document.getElementById("notification-message");

    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.hidden = false;
    }

    document.getElementById("notification-close").addEventListener("click", () => {
        notification.hidden = true;
    });

    // Example notification on page load
    showNotification("Welcome to StudentHub!");

    // 4. Event Slider
    const events = [
        {
            title: "Web Development Workshop",
            description: "Learn HTML, CSS and JavaScript through practical activities."
        },
        {
            title: "Campus Hackathon",
            description: "Collaborate with other students to build creative solutions."
        },
        {
            title: "Technical Seminar",
            description: "Explore new technology trends with fellow students."
        }
    ];

    let currentSlide = 0;

    const slideTitle = document.getElementById("slide-title");
    const slideDescription = document.getElementById("slide-description");
    const slideNumber = document.getElementById("slide-number");

    function renderSlide() {
        slideTitle.textContent = events[currentSlide].title;
        slideDescription.textContent = events[currentSlide].description;
        slideNumber.textContent =
            `Event ${currentSlide + 1} of ${events.length}`;
    }

    document.getElementById("previous-slide").addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + events.length) % events.length;
        renderSlide();
    });

    document.getElementById("next-slide").addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % events.length;
        renderSlide();
    });

    // 5. Modal Popup
    const modal = document.getElementById("event-modal");
    const modalDescription = document.getElementById("modal-description");
    const openModal = document.getElementById("open-modal");
    const closeModal = document.getElementById("close-modal");
    const modalOk = document.getElementById("modal-ok");

    function showModal() {
        modalDescription.textContent =
            `${events[currentSlide].title}: ${events[currentSlide].description}`;

        modal.hidden = false;
        closeModal.focus();
    }

    function hideModal() {
        modal.hidden = true;
        openModal.focus();
    }

    openModal.addEventListener("click", showModal);
    closeModal.addEventListener("click", hideModal);
    modalOk.addEventListener("click", hideModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) hideModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            hideModal();
        }
    });

    // 6. Collapsible FAQ
    document.querySelectorAll(".faq-question").forEach((button) => {
        button.addEventListener("click", () => {
            const answerId = button.getAttribute("aria-controls");
            const answer = document.getElementById(answerId);
            const willOpen = answer.hidden;

            answer.hidden = !willOpen;
            button.setAttribute("aria-expanded", String(willOpen));
        });
    });

    renderSlide();
});
