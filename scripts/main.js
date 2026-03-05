document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('rental-form');
    const formMessage = document.getElementById('form-message');
    const navLinks = document.getElementById('nav-links');

    // Environment Check
    if (window.location.protocol === 'file:') {
        alert('CRITICAL: You are opening this via file protocol. The dynamic blog and booking system REQUIRE the server. Please run "node server/server.js" and visit http://localhost:3000');
    }
    console.log('Fetching destination pages...');
    fetch('/api/pages')
        .then(res => {
            if (!res.ok) throw new Error('Server responded with ' + res.status);
            return res.json();
        })
        .then(pages => {
            console.log('Successfully loaded ' + pages.length + ' pages');
            const blogGrid = document.getElementById('blog-grid');
            if (blogGrid) {
                blogGrid.innerHTML = ''; // Clear hardcoded items
                if (pages.length === 0) {
                    blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No destinations found. Add some in the admin panel!</p>';
                }
            }

            pages.forEach(page => {
                // Add to Blog Grid
                if (blogGrid) {
                    const card = document.createElement('div');
                    card.className = 'car-card';

                    let imgPath = 'assets/jaipur.jpg';
                    const title = (page.title || '').toLowerCase();
                    if (title.includes('haridwar')) imgPath = 'assets/haridwar.jpg';
                    else if (title.includes('rishikesh')) imgPath = 'assets/rishikesh.jpg';
                    else if (title.includes('shimla')) imgPath = 'assets/shimla.jpg';
                    else if (title.includes('agra')) imgPath = 'assets/agra.jpg';

                    card.innerHTML = `
                        <div class="car-image">
                            <img src="${imgPath}" alt="${page.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="car-info">
                            <h3>${page.title}</h3>
                            <p>${page.price || 'Luxury Route'}</p>
                            <a href="/pages/${page.id}" class="price" style="text-decoration: none;">Read More &rarr;</a>
                        </div>
                    `;
                    blogGrid.appendChild(card);
                }
            });
        })
        .catch(err => {
            console.error('Failed to fetch pages:', err);
            const blogGrid = document.getElementById('blog-grid');
            if (blogGrid) {
                blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to connect to the luxury travel server. Please ensure the backend is running at http://localhost:3000</p>';
            }
        });

    // Handle Booking Form Submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            car: document.getElementById('car').value,
            date: document.getElementById('date').value
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                formMessage.textContent = 'Booking Confirmed! We will contact you shortly.';
                formMessage.style.display = 'block';
                formMessage.style.color = '#d4af37';
                bookingForm.reset();
            } else {
                formMessage.textContent = 'Something went wrong. Please try again.';
                formMessage.style.display = 'block';
                formMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Error submitting booking.';
            formMessage.style.display = 'block';
            formMessage.style.color = 'red';
        }
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
