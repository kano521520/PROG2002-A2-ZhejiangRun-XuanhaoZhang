/**
 * REST API Base Endpoint Configuration (Pointing to XuanhaoZhangA2-api service)
 */
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fallback image URI used when event record contains no valid image link.
 */
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80';

/**
 * Global state variable tracking active category filter selection.
 */
let selectedCategoryId = '';

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchEvents();
});

/**
 * Validates and resolves event image URLs.
 * @param {string} dbImageUrl - Raw image URL string from database entity
 * @returns {string} Sanitized valid image URL
 */
function resolveEventImage(dbImageUrl) {
    if (dbImageUrl && typeof dbImageUrl === 'string' && dbImageUrl.trim().startsWith('http')) {
        return dbImageUrl.trim();
    }
    return DEFAULT_FALLBACK_IMAGE;
}

/**
 * Requests categories and populates both filter buttons and form dropdown menu.
 */
function fetchCategories() {
    fetch(`${API_BASE_URL}/categories`)
        .then(res => res.json())
        .then(categories => {
            // Populate category filter buttons
            const container = document.getElementById('category-buttons');
            let html = `
                <button class="cat-btn ${selectedCategoryId === '' ? 'active' : ''}" onclick="filterByCategory('')">
                    🌟 All Categories
                </button>
            `;
            html += categories.map(cat => `
                <button class="cat-btn ${selectedCategoryId == cat.category_id ? 'active' : ''}" onclick="filterByCategory(${cat.category_id})">
                    ${cat.category_name}
                </button>
            `).join('');
            container.innerHTML = html;

            // Populate event creation form select dropdown options
            const formSelect = document.getElementById('event-category');
            if (formSelect) {
                formSelect.innerHTML = categories.map(cat => 
                    `<option value="${cat.category_id}">${cat.category_name}</option>`
                ).join('');
            }
        })
        .catch(err => console.error('Error fetching categories:', err));
}

/**
 * Queries events dataset matching parameters and updates DOM event cards.
 * @param {string|number} categoryId - Filter category ID
 * @param {string} location - Search query location string
 * @param {string} date - Search query date string
 */
function fetchEvents(categoryId = '', location = '', date = '') {
    let url = `${API_BASE_URL}/events`;
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId);
    if (location) params.append('location', location);
    if (date) params.append('date', date);

    if (params.toString()) {
        url = `${API_BASE_URL}/events/search?${params.toString()}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(events => {
            const container = document.getElementById('event-list');
            if (!events || events.length === 0) {
                container.innerHTML = `
                    <div class="no-events">
                        <p>🌱 No charity events found matching the specified parameters.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = events.map(event => {
                const formattedDate = event.date ? event.date.split('T')[0] : 'TBD';
                const eventImg = resolveEventImage(event.image_url);

                return `
                    <div class="event-card">
                        <div class="card-image-wrapper">
                            <img src="${eventImg}" alt="${event.title}" class="card-img" style="max-width:100%; height:auto;" />
                            <span class="category-badge">${event.category_name}</span>
                        </div>
                        <div class="card-content">
                            <h3 class="event-title">${event.title}</h3>
                            <div class="event-info">
                                <p>📍 <strong>Location:</strong> ${event.location}</p>
                                <p>📅 <strong>Date:</strong> ${formattedDate}</p>
                            </div>
                            <a href="details.html?id=${event.event_id}" class="btn-details">View Details →</a>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(err => console.error('Error fetching events list:', err));
}

/* ==================== FORM & IMAGE SELECTION HANDLERS ==================== */

/**
 * Toggles custom URL input field visibility based on user dropdown selection.
 * @param {HTMLSelectElement} selectElement - Dropdown element
 */
function toggleCustomUrlInput(selectElement) {
    const customInput = document.getElementById('custom-image-url');
    if (selectElement.value === 'custom') {
        customInput.style.display = 'block';
        customInput.required = true;
    } else {
        customInput.style.display = 'none';
        customInput.required = false;
        customInput.value = '';
    }
}

/**
 * Resolves final image URL string before submission payload construction.
 * @returns {string} Evaluated image URL for database persistence
 */
function getSelectedImageUrl() {
    const selectElement = document.getElementById('event-image-select');
    if (selectElement.value === 'custom') {
        return document.getElementById('custom-image-url').value.trim();
    }
    return selectElement.value;
}

/**
 * Handles creation form submission and refreshes the event collection list dynamically.
 * @param {Event} e - Form submit event
 */
function handleCreateEvent(e) {
    e.preventDefault();

    const payload = {
        title: document.getElementById('event-title').value.trim(),
        category_id: parseInt(document.getElementById('event-category').value, 10),
        location: document.getElementById('event-location').value.trim(),
        date: document.getElementById('event-date').value,
        image_url: getSelectedImageUrl()
    };

    fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
    })
    .then(data => {
        alert('Event created successfully!');
        document.getElementById('event-form').reset();
        document.getElementById('custom-image-url').style.display = 'none';
        fetchEvents(selectedCategoryId);
    })
    .catch(err => console.error('Failed to create event entity:', err));
}

/* ==================== SEARCH & FILTER HANDLERS ==================== */

function filterByCategory(categoryId) {
    selectedCategoryId = categoryId;
    fetchCategories();
    const location = document.getElementById('search-location').value.trim();
    const date = document.getElementById('search-date').value;
    fetchEvents(selectedCategoryId, location, date);
}

function handleSearch() {
    const location = document.getElementById('search-location').value.trim();
    const date = document.getElementById('search-date').value;
    fetchEvents(selectedCategoryId, location, date);
}

function clearSearch() {
    selectedCategoryId = '';
    document.getElementById('search-location').value = '';
    document.getElementById('search-date').value = '';
    fetchCategories();
    fetchEvents();
}