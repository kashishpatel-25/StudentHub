
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".register-card form");

    if (!form) return;

    // Use our custom messages instead of browser popup messages.
    form.noValidate = true;

    const fields = [
        "firstName", "lastName", "email", "mobile",
        "studentId", "semester", "year", "course",
        "password", "confirmPassword"
    ];

    // Create an error message element if one is missing.
    function getErrorElement(id) {
        let error = document.getElementById(id + "-error");

        if (!error) {
            error = document.createElement("span");
            error.id = id + "-error";
            error.className = "error-message";
            error.setAttribute("aria-live", "polite");

            const field = document.getElementById(id);
            if (field) {
                field.insertAdjacentElement("afterend", error);
            }
        }

        return error;
    }

    const successMessage = document.createElement("p");
    successMessage.id = "form-success";
    successMessage.setAttribute("role", "status");
    successMessage.style.color = "#15803d";
    successMessage.style.marginTop = "16px";
    successMessage.style.textAlign = "center";
    form.appendChild(successMessage);

    // Regular expressions for validation.
    const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialRegex = /[^A-Za-z0-9]/;

    function showError(id, message) {
        const field = document.getElementById(id);
        const error = getErrorElement(id);

        error.textContent = message;

        if (field) {
            field.setAttribute("aria-invalid", "true");
        }
    }

    function clearError(id) {
        const field = document.getElementById(id);
        const error = getErrorElement(id);

        error.textContent = "";

        if (field) {
            field.setAttribute("aria-invalid", "false");
        }
    }

    function validateField(id) {
        const field = document.getElementById(id);
        if (!field) return true;

        const value = field.value.trim();
        let message = "";

        switch (id) {
            case "firstName":
            case "lastName":
                if (!value) {
                    message = "This field is required.";
                } else if (!nameRegex.test(value)) {
                    message = "Use letters, spaces, apostrophes or hyphens only.";
                }
                break;

            case "email":
                if (!value) {
                    message = "Email address is required.";
                } else if (!emailRegex.test(value)) {
                    message = "Enter a valid email address.";
                }
                break;

            case "mobile":
                if (!value) {
                    message = "Mobile number is required.";
                } else if (!mobileRegex.test(value)) {
                    message = "Enter a valid 10-digit Indian mobile number.";
                }
                break;

            case "studentId":
                if (!value) {
                    message = "Student ID is required.";
                }
                break;

            case "semester":
            case "year":
                if (!value) {
                    message = "Please select an option.";
                }
                break;

            case "course":
                if (!value) {
                    message = "Course or department is required.";
                }
                break;

            case "password":
                if (!field.value) {
                    message = "Password is required.";
                } else if (field.value.length < 8) {
                    message = "Password must contain at least 8 characters.";
                } else if (
                    !upperRegex.test(field.value) ||
                    !lowerRegex.test(field.value) ||
                    !digitRegex.test(field.value) ||
                    !specialRegex.test(field.value)
                ) {
                    message =
                        "Include uppercase, lowercase, a number and a special character.";
                }
                break;

            case "confirmPassword":
                if (!field.value) {
                    message = "Please confirm your password.";
                } else if (
                    field.value !==
                    document.getElementById("password").value
                ) {
                    message = "Passwords do not match.";
                }
                break;
        }

        if (message) {
            showError(id, message);
            return false;
        }

        clearError(id);
        return true;
    }

    // Password strength meter.
    function updatePasswordStrength() {
        const password = document.getElementById("password").value;
        const bar = document.getElementById("strength-bar");
        const text = document.getElementById("strength-text");

        if (!bar || !text) return;

        if (!password) {
            bar.style.width = "0%";
            text.textContent = "Password strength: Not entered";
            return;
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (upperRegex.test(password)) score++;
        if (lowerRegex.test(password)) score++;
        if (digitRegex.test(password)) score++;
        if (specialRegex.test(password)) score++;

        const labels = [
            "Weak", "Weak", "Fair", "Medium", "Strong", "Strong"
        ];

        const colors = [
            "#dc2626", "#dc2626", "#ea580c",
            "#ca8a04", "#16a34a", "#15803d"
        ];

        bar.style.width = (score * 20) + "%";
        bar.style.backgroundColor = colors[score];
        text.textContent = "Password strength: " + labels[score];
    }

    // Gender validation.
    function validateGender() {
        const selected = form.querySelector(
            'input[name="gender"]:checked'
        );

        const error = getErrorElement("gender");

        if (!selected) {
            error.textContent = "Please select a gender option.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    // Terms acceptance validation.
    function validateTerms() {
        const checkbox = document.getElementById("terms");
        const error = getErrorElement("terms");

        if (!checkbox.checked) {
            error.textContent =
                "You must accept the terms and conditions.";
            checkbox.setAttribute("aria-invalid", "true");
            return false;
        }

        error.textContent = "";
        checkbox.setAttribute("aria-invalid", "false");
        return true;
    }

    // Real-time validation while typing or changing selections.
    fields.forEach(function (id) {
        const field = document.getElementById(id);
        if (!field) return;

        field.addEventListener("input", function () {
            validateField(id);
            successMessage.textContent = "";

            if (id === "password") {
                updatePasswordStrength();

                const confirm = document.getElementById("confirmPassword");
                if (confirm.value) validateField("confirmPassword");
            }

            if (id === "confirmPassword") {
                validateField("confirmPassword");
            }
        });

        field.addEventListener("change", function () {
            validateField(id);
        });
    });

    form.querySelectorAll('input[name="gender"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
            validateGender();
        });
    });

    document.getElementById("terms").addEventListener("change", function () {
        validateTerms();
    });

    // Validate everything when the form is submitted.
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        successMessage.textContent = "";

        let isValid = true;
        let firstInvalidField = null;

        fields.forEach(function (id) {
            if (!validateField(id)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = document.getElementById(id);
                }
            }
        });

        if (!validateGender()) {
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = form.querySelector(
                    'input[name="gender"]'
                );
            }
        }

        if (!validateTerms()) {
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = document.getElementById("terms");
            }
        }

        if (!isValid) {
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }

        successMessage.textContent =
            "Registration form validated successfully!";

        // No database submission is performed.
    });

    updatePasswordStrength();
});

