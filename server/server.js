const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

const PAGES_FILE = path.join(__dirname, 'pages.json');
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

// Ensure files exist
if (!fs.existsSync(PAGES_FILE)) fs.writeFileSync(PAGES_FILE, JSON.stringify([]));
if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));

// API Endpoints
app.get('/api/pages', (req, res) => {
    try {
        const data = fs.readFileSync(PAGES_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading pages:', err);
        res.status(500).json({ error: 'Failed to load pages' });
    }
});

app.post('/api/pages', (req, res) => {
    try {
        const pages = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));
        const newPage = { id: Date.now(), ...req.body };
        pages.push(newPage);
        fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
        res.status(201).json(newPage);
    } catch (err) {
        console.error('Error saving page:', err);
        res.status(500).json({ error: 'Failed to save page' });
    }
});

app.post('/api/bookings', (req, res) => {
    try {
        const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
        const newBooking = { id: Date.now(), ...req.body };
        bookings.push(newBooking);
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
        res.status(201).json({ message: 'Booking successful!' });
    } catch (err) {
        console.error('Error saving booking:', err);
        res.status(500).json({ error: 'Failed to save booking' });
    }
});

app.get('/api/bookings-list', (req, res) => {
    try {
        const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading bookings:', err);
        res.status(500).json({ error: 'Failed to load bookings' });
    }
});

// Serve dynamic pages
app.get('/pages/:id', (req, res) => {
    try {
        const pages = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));
        const page = pages.find(p => p.id == req.params.id);
        if (!page) return res.status(404).send('Page not found');

        const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${page.title} | ExoticDrive</title>
        <link rel="stylesheet" href="../styles/main.css">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
        <style>
            :root { color-scheme: dark; }
            .blog-container { max-width: 900px; margin: 0 auto; padding: 100px 20px; }
            .blog-header { margin-bottom: 50px; }
            .blog-content { line-height: 1.8; font-size: 1.1rem; color: #ccc; }
            .blog-content h2, .blog-content h3 { color: var(--accent-color); margin-top: 40px; margin-bottom: 20px; }
            .blog-content p { margin-bottom: 20px; }
            .back-link { display: inline-block; margin-bottom: 30px; color: var(--accent-color); text-decoration: none; font-weight: 700; }
            .mini-booking { background: var(--card-bg); border: 1px solid var(--glass-border); padding: 40px; border-radius: 20px; margin-top: 80px; }
            .price-tag { font-size: 1.5rem; color: var(--accent-color); font-weight: 700; margin-bottom: 20px; display: block; }
        </style>
    </head>
    <body>
        <div class="blog-container">
            <a href="/#home" class="back-link">&larr; BACK TO FLEET</a>
            <div class="blog-header">
                <h1 style="font-size: 3.5rem; margin-bottom: 20px;">${page.title}</h1>
                <span class="price-tag">Starting from ${page.price || '$500'}</span>
            </div>
            
            <div class="blog-content">
                ${page.content}
            </div>

            <section id="reserve" class="mini-booking">
                <h2 style="margin-bottom: 20px;">Quick Reserve for this Route</h2>
                <p style="margin-bottom: 30px; color: #888;">Specify your details to book a premium ride for this destination.</p>
                <form id="blog-booking-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <input type="text" id="b-name" placeholder="Your Name" required style="padding: 12px; background: #111; border: 1px solid #333; color: #fff; border-radius: 5px;">
                        <input type="email" id="b-email" placeholder="Your Email" required style="padding: 12px; background: #111; border: 1px solid #333; color: #fff; border-radius: 5px;">
                        <input type="date" id="b-date" required style="padding: 12px; background: #111; border: 1px solid #333; color: #fff; border-radius: 5px;">
                        <button type="submit" class="btn" style="border: none; cursor: pointer;">Book Now</button>
                    </div>
                </form>
                <div id="b-message" style="margin-top: 20px; text-align: center; display: none; color: var(--accent-color);"></div>
            </section>
        </div>

        <script>
            document.getElementById('blog-booking-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    name: document.getElementById('b-name').value,
                    email: document.getElementById('b-email').value,
                    date: document.getElementById('b-date').value,
                    car: 'Route Special - ${page.title}',
                    source: 'Blog Page'
                };

                const res = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    const msg = document.getElementById('b-message');
                    msg.textContent = 'Booking Confirmed! Our travel concierge will contact you.';
                    msg.style.display = 'block';
                    e.target.reset();
                }
            });
        </script>
    </body>
    </html>
    `;
        res.send(template);
    } catch (err) {
        console.error('Error rendering page:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/pages/:id', (req, res) => {
    try {
        let pages = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));
        pages = pages.filter(p => p.id != req.params.id);
        fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
        res.json({ message: 'Page deleted successfully' });
    } catch (err) {
        console.error('Error deleting page:', err);
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
