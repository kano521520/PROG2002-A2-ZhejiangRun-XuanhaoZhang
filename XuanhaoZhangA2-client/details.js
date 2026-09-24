const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    const container = document.getElementById('event-detail-container');
    if (!container) {
        console.error('Error: Container element #event-detail-container not found.');
        return;
    }

    if (!eventId) {
        container.innerHTML = '<p style="color: red; font-size: 1.2em;">Error: Missing event ID parameter in URL. Please return to Home page and click "View Details".</p>';
        return;
    }

    fetchEventDetails(eventId, container);
});

function resolveEventImage(dbImageUrl) {
    if (dbImageUrl && typeof dbImageUrl === 'string' && dbImageUrl.trim().startsWith('http')) {
        return dbImageUrl.trim();
    }
    return DEFAULT_FALLBACK_IMAGE;
}

function fetchEventDetails(id, container) {
    fetch(`${API_BASE_URL}/events/${id}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load event.`);
            return res.json();
        })
        .then(event => {
            const eventImg = resolveEventImage(event.image_url);
            const formattedDate = event.date ? event.date.split('T')[0] : 'TBD';

            container.innerHTML = `
                <div class="detail-card" style="max-width: 800px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${eventImg}" alt="${event.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px;" />
                    <h1 style="margin-top: 20px; color: #333;">${event.title}</h1>
                    <p style="font-size: 1.1em; color: #555;">🏷️ <strong>Category:</strong> ${event.category_name}</p>
                    <p style="font-size: 1.1em; color: #555;">📍 <strong>Location:</strong> ${event.location}</p>
                    <p style="font-size: 1.1em; color: #555;">📅 <strong>Date:</strong> ${formattedDate}</p>
                </div>
            `;
        })
        .catch(err => {
            console.error('Error fetching event details:', err);
            container.innerHTML = `<p style="color: red; font-size: 1.2em;">Failed to load event details. Please verify that node server is running on http://localhost:3000.</p>`;
        });
}