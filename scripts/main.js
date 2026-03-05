document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('rental-form');
    const formMessage = document.getElementById('form-message');
    const navLinks = document.getElementById('nav-links');

    // Environment Check - removed for GitHub Pages compatibility
    console.log('Loading destination pages...');

    // Static blog data for GitHub Pages
    const staticPages = [
        {
            id: 101,
            title: "Delhi to Jaipur: A Royal Expedition",
            price: "$1,200 (Inclusive of Luxury Fleet)",
            image: "assets/jaipur.jpg"
        },
        {
            id: 102,
            title: "Delhi to Haridwar: Divine Luxury",
            price: "$800 (One-Way Luxury Transfer)",
            image: "assets/haridwar.jpg"
        },
        {
            id: 103,
            title: "Delhi to Rishikesh: The Ultimate Adventure",
            price: "$950 (All-Terrain Luxury)",
            image: "assets/rishikesh.jpg"
        },
        {
            id: 104,
            title: "Delhi to Shimla: Majestic Mountain Vistas",
            price: "$1,500 (Executive Mountain Package)",
            image: "assets/shimla.jpg"
        },
        {
            id: 105,
            title: "Delhi to Agra: The Fast Track to Love",
            price: "$1,100 (Express Tour)",
            image: "assets/agra.jpg"
        }
    ];

    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = ''; // Clear loading message

        staticPages.forEach(page => {
            const card = document.createElement('div');
            card.className = 'car-card';

            card.innerHTML = `
                <div class="car-image">
                    <img src="${page.image}" alt="${page.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="car-info">
                    <h3>${page.title}</h3>
                    <p>${page.price}</p>
                    <a href="pages/${page.id}.html" class="price" style="text-decoration: none;">Read More &rarr;</a>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    }

    // Handle Booking Form Submission (static version for GitHub Pages)
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            car: document.getElementById('car').value,
            date: document.getElementById('date').value
        };

        // For GitHub Pages, show success message since we can't run backend
        formMessage.textContent = 'Booking request received! Our luxury concierge will contact you within 24 hours to confirm your reservation.';
        formMessage.style.display = 'block';
        formMessage.style.color = '#d4af37';
        bookingForm.reset();

        // Log the booking data (in a real deployment, this would be sent to your backend)
        console.log('Booking data:', formData);
    });

    // Soft scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
