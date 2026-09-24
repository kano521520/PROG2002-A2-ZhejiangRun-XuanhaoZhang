document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api';
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    const detailContainer = document.getElementById('event-detail-container');
    const eventIdInput = document.getElementById('event-id');
    const regForm = document.getElementById('registration-form');
    const responseMsg = document.getElementById('form-response');

    if (!eventId) {
        detailContainer.innerHTML = '<p class="error-msg">No event ID provided. Please return to the homepage.</p>';
        if (regForm) regForm.style.display = 'none';
        return;
    }

    if (eventIdInput) {
        eventIdInput.value = eventId;
    }

    // Fetch single event details
    fetch(`${API_BASE_URL}/events/${eventId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Event not found or server error.');
            }
            return response.json();
        })
        .then(event => {
            detailContainer.innerHTML = `
                <img src="${event.image_url}" alt="${event.title}" class="detail-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80';" />
                <div class="detail-content">
                    <span class="badge">${event.category_name || 'Charity Run'}</span>
                    <h2>${event.title}</h2>
                    <p><strong>📍 Location:</strong> ${event.location}</p>
                    <p><strong>📅 Date:</strong> ${event.date}</p>
                    <p class="description">Join us for the ${event.title} in ${event.location}! All registration fees and funds raised will go directly towards local community charity projects in Zhejiang Province.</p>
                </div>
            `;
        })
        .catch(err => {
            console.error('Error fetching event details:', err);
            detailContainer.innerHTML = `<p class="error-msg">Failed to load event details: ${err.message}</p>`;
            if (regForm) regForm.style.display = 'none';
        });

    // Handle registration form submission
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('full-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const quantity = parseInt(document.getElementById('quantity').value, 10);

            if (!fullName || !email) {
                showResponse('Please fill in all required fields.', 'error');
                return;
            }

            const payload = {
                event_id: parseInt(eventId, 10),
                full_name: fullName,
                email: email,
                phone: phone,
                quantity: quantity
            };

            const submitBtn = document.getElementById('btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            fetch(`${API_BASE_URL}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(result => {
                if (result.status === 201) {
                    showResponse(`✅ ${result.body.message} Registration ID: #${result.body.registration_id}`, 'success');
                    regForm.reset();
                    if (eventIdInput) eventIdInput.value = eventId;
                } else {
                    showResponse(`❌ ${result.body.error || 'Registration failed.'}`, 'error');
                }
            })
            .catch(err => {
                console.error('Registration API error:', err);
                showResponse('❌ Unable to connect to the server. Please ensure backend is running.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register Now';
            });
        });
    }

    function showResponse(msg, type) {
        responseMsg.textContent = msg;
        responseMsg.className = `form-response-msg ${type}`;
    }
});