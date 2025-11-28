document.addEventListener("DOMContentLoaded", () => {

    // ----- NAVBAR INJECTION -----
    const navbar = document.getElementById("navbar");
    if (navbar) {
        navbar.innerHTML = `
            <header>
                <div class="hamburger">&#9776;</div>
                <nav class="nav-links">
                    <ul>
                        <li><a href="index.html">Homepage</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                        <li><a href="news.html">Blog/ News</a></li>
                        <li><a href="faqs.html">FAQs</a></li>
                        <li class="Logo"><a href="index.html">Paw Haven</a></li>
                    </ul>
                </nav>
                <nav class="secondary-nav">
                    <ul>
                        <li><a href="gallery.html">Adoptable Pets</a></li>
                        <li><a href="adoption.html">Adoption Process</a></li>
                        <li><a href="donate.html">Donate</a></li>
                        <li><a href="volunteer.html">Volunteer</a></li>
                        <li><a href="stories.html">Successful Stories</a></li>
                    </ul>
                </nav>
            </header>
        `;

        const hamburger = document.querySelector(".hamburger");
        const nav1 = document.querySelector(".nav-links");
        const nav2 = document.querySelector(".secondary-nav");
        if (hamburger) {
            hamburger.addEventListener("click", () => {
                nav1.classList.toggle("active");
                nav2.classList.toggle("active");
            });
        }
    }

    // ----- ACCORDION FUNCTIONALITY -----
    const accordionButtons = document.querySelectorAll(".accordion-btn");
    accordionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const panel = btn.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
            btn.classList.toggle("active");
        });
    });

    const accordions = document.querySelectorAll(".accordion-header");
    accordions.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            document.querySelectorAll(".accordion-content").forEach(item => {
                if (item !== content) item.style.maxHeight = null;
            });
            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
        });
    });

    // ----- READ MORE / READ LESS -----
    const readMoreButtons = document.querySelectorAll(".read-more-btn");
    readMoreButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const moreText = btn.previousElementSibling.querySelector(".more-text") || btn.previousElementSibling;
            if (!moreText) return;
            if (moreText.style.display === "inline" || moreText.style.display === "block") {
                moreText.style.display = "none";
                btn.textContent = "Read More";
            } else {
                moreText.style.display = moreText.tagName === "SPAN" ? "inline" : "block";
                btn.textContent = "Read Less";
            }
        });
    });

    // ----- GENERAL MODAL FUNCTION (for homepage) -----
    function setupModal(triggerSelector, modalSelector, imgSelector, captionSelector) {
        const modal = document.querySelector(modalSelector);
        const modalImg = document.querySelector(imgSelector);
        const captionText = document.querySelector(captionSelector);
        const triggers = document.querySelectorAll(triggerSelector);
        if (!modal || !modalImg || !triggers.length) return;
        triggers.forEach(trigger => {
            trigger.addEventListener("click", () => {
                modal.style.display = "block";
                modalImg.src = trigger.src;
                const figcaption = trigger.closest("figure")?.querySelector("figcaption");
                captionText.textContent = figcaption ? figcaption.textContent : "";
            });
        });
        const closeBtn = modal.querySelector(".close");
        if (closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");
        modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
    }

    // Homepage main image modal
    setupModal("#mainImage", "#imgModal", "#expandedImg", "#caption");

    // ----- GALLERY SLIDESHOW MODAL -----
    const gallery = document.querySelector(".pet-grid");
    if (gallery) {
        const modal = document.getElementById("imgModal");
        const modalImg = document.getElementById("modalImg");
        const modalCaption = document.getElementById("modalCaption");
        const closeBtn = document.querySelector(".close");
        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

        const images = Array.from(document.querySelectorAll(".pet-card img"));
        let currentIndex = 0;

        if (images.length > 0 && modal && modalImg && modalCaption) {
            images.forEach((img, index) => {
                img.addEventListener("click", () => {
                    currentIndex = index;
                    modal.style.display = "block";
                    modalImg.src = img.src;
                    modalCaption.textContent = img.closest("figure").querySelector("figcaption").textContent;
                });
            });

            if (nextBtn) nextBtn.onclick = () => {
                currentIndex = (currentIndex + 1) % images.length;
                modalImg.src = images[currentIndex].src;
                modalCaption.textContent = images[currentIndex].closest("figure").querySelector("figcaption").textContent;
            };
            if (prevBtn) prevBtn.onclick = () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                modalImg.src = images[currentIndex].src;
                modalCaption.textContent = images[currentIndex].closest("figure").querySelector("figcaption").textContent;
            };
            if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
            modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
        }
    }

    // ----- ADOPTION FORM VALIDATION & AJAX SUBMISSION -----
    const adoptionForm = document.getElementById("adoptionForm");
    const formMessage = document.getElementById("formMessage");

    if (adoptionForm && formMessage) {
        adoptionForm.addEventListener("submit", e => {
            e.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const adoptionDate = document.getElementById("adoptionDate").value;
            const petType = document.getElementById("petType").value;
            const experience = document.getElementById("experience").value.trim();

            const phoneRegex = /^\+?\d{10,15}$/;

            if (!fullName || !email || !phone || !adoptionDate || !petType || !experience) {
                formMessage.style.color = "red";
                formMessage.textContent = "Please fill in all required fields.";
                return;
            }

            if (!phoneRegex.test(phone)) {
                formMessage.style.color = "red";
                formMessage.textContent = "Please enter a valid phone number (e.g., +271234567890).";
                return;
            }

            const formData = new FormData(adoptionForm);

            fetch(adoptionForm.action, {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.text();
            })
            .then(data => {
                formMessage.style.color = "green";
                formMessage.textContent = "Form submitted successfully!";
                adoptionForm.reset();
            })
            .catch(error => {
                console.error("Error submitting form:", error);
                formMessage.style.color = "red";
                formMessage.textContent = "There was a problem submitting your form. Please try again.";
            });
        });
    }

    // ----- DONATION FORM VALIDATION & AJAX SUBMISSION -----
    const donationForm = document.getElementById("donationForm");
    const donationMessage = document.getElementById("donationMessage");

    if (donationForm && donationMessage) {

        donationForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const amount = document.getElementById("amount").value.trim();
            const donationType = document.getElementById("donationType").value;

            const phoneRegex = /^\+?\d{10,15}$/;

            // Validation
            if (!fullName || !email || !phone || !amount || !donationType) {
                donationMessage.style.color = "red";
                donationMessage.textContent = "Please fill in all required fields.";
                return;
            }

            if (!phoneRegex.test(phone)) {
                donationMessage.style.color = "red";
                donationMessage.textContent = "Invalid phone number. Use format like +27831234567.";
                return;
            }

            if (amount < 10) {
                donationMessage.style.color = "red";
                donationMessage.textContent = "Minimum donation is R10.";
                return;
            }

            // AJAX Submission
            const formData = new FormData(donationForm);

            fetch(donationForm.action, {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error("Network error");
                return response.text();
            })
            .then(() => {
                donationMessage.style.color = "green";
                donationMessage.textContent = "Thank you! Your donation has been submitted successfully.";
                donationForm.reset();
            })
            .catch(error => {
                console.error(error);
                donationMessage.style.color = "red";
                donationMessage.textContent = "Error: Could not submit donation. Try again later.";
            });
        });
    }

    // ----- VOLUNTEER FORM VALIDATION & AJAX SUBMISSION -----
    const volunteerForm = document.getElementById("volunteerForm");
    const volunteerStatus = document.getElementById("formStatus");

    if (volunteerForm && volunteerStatus) {

        volunteerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Collect values
            const name = document.getElementById("fullName")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const phone = document.getElementById("phone")?.value.trim();
            const role = document.getElementById("role")?.value.trim();
            const motivation = document.getElementById("motivation")?.value.trim();

            // Validate values
            if (!/^[A-Za-z\s]{3,}$/.test(name)) {
                showVolunteerError("Please enter a valid name (letters only).");
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                showVolunteerError("Please enter a valid email address.");
                return;
            }

            if (!/^[0-9]{10}$/.test(phone)) {
                showVolunteerError("Phone number must be 10 digits (e.g., 0781234567).");
                return;
            }

            if (!role) {
                showVolunteerError("Please select a volunteer role.");
                return;
            }

            if (!motivation || motivation.length < 10) {
                showVolunteerError("Motivation must be at least 10 characters long.");
                return;
            }

            // Simulated AJAX Submission
            setTimeout(() => {
                showVolunteerSuccess("Your volunteer form has been submitted successfully!");
                volunteerForm.reset();
            }, 800);
        });

        function showVolunteerError(message) {
            volunteerStatus.style.display = "block";
            volunteerStatus.className = "error";
            volunteerStatus.textContent = message;
        }

        function showVolunteerSuccess(message) {
            volunteerStatus.style.display = "block";
            volunteerStatus.className = "success";
            volunteerStatus.textContent = message;
        }
    }
});