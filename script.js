// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Load saved locations from localStorage
    loadLocations();
    
    // Submit Location
    const submitLocationBtn = document.getElementById('submitLocationBtn');
    if (submitLocationBtn) {
        submitLocationBtn.addEventListener('click', function() {
            const locationName = document.getElementById('locName').value.trim();
            const area = document.getElementById('locArea').value.trim();
            const person = document.getElementById('suggestedPerson').value.trim();
            
            if (!locationName || !area) {
                showMessage('locationMessage', 'Please enter location name and area!', 'error');
                return;
            }
            
            const newLocation = {
                id: Date.now(),
                name: locationName,
                area: area,
                suggestedBy: person || 'Anonymous Student',
                date: new Date().toLocaleDateString()
            };
            
            // Get existing locations
            let locations = JSON.parse(localStorage.getItem('oceanLocations') || '[]');
            locations.push(newLocation);
            localStorage.setItem('oceanLocations', JSON.stringify(locations));
            
            // Clear form
            document.getElementById('locName').value = '';
            document.getElementById('locArea').value = '';
            document.getElementById('suggestedPerson').value = '';
            
            showMessage('locationMessage', 'Location suggested successfully! Thank you for your contribution.', 'success');
            loadLocations();
        });
    }
    
    // Submit Volunteer
    const submitVolunteerBtn = document.getElementById('submitVolunteerBtn');
    if (submitVolunteerBtn) {
        submitVolunteerBtn.addEventListener('click', function() {
            const name = document.getElementById('volName').value.trim();
            const email = document.getElementById('volEmail').value.trim();
            const location = document.getElementById('volLocation').value.trim();
            const reason = document.getElementById('volReason').value.trim();
            
            if (!name || !email || !location) {
                showMessage('volunteerMessage', 'Please fill in all required fields (Name, Email, Location)!', 'error');
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                showMessage('volunteerMessage', 'Please enter a valid email address!', 'error');
                return;
            }
            
            // Save volunteer to localStorage
            const volunteer = {
                id: Date.now(),
                name: name,
                email: email,
                location: location,
                reason: reason || 'Wants to help protect oceans',
                date: new Date().toLocaleDateString()
            };
            
            let volunteers = JSON.parse(localStorage.getItem('oceanVolunteers') || '[]');
            volunteers.push(volunteer);
            localStorage.setItem('oceanVolunteers', JSON.stringify(volunteers));
            
            // Clear form
            document.getElementById('volName').value = '';
            document.getElementById('volEmail').value = '';
            document.getElementById('volLocation').value = '';
            document.getElementById('volReason').value = '';
            
            showMessage('volunteerMessage', `Thank you ${name}! You've joined the ocean conservation mission. We'll contact you soon.`, 'success');
        });
    }
    
    // Initialize sample locations if empty
    function loadLocations() {
        let locations = JSON.parse(localStorage.getItem('oceanLocations') || '[]');
        
        // Add sample locations if empty
        if (locations.length === 0) {
            locations = [
                {
                    id: 1,
                    name: "Juhu Beach",
                    area: "Mumbai, Maharashtra",
                    suggestedBy: "Student Council",
                    date: "2026-05-15"
                },
                {
                    id: 2,
                    name: "Marina Beach",
                    area: "Chennai, Tamil Nadu",
                    suggestedBy: "Eco Club",
                    date: "2026-05-22"
                },
                {
                    id: 3,
                    name: "Baga Beach",
                    area: "Goa",
                    suggestedBy: "Volunteer Network",
                    date: "2026-06-05"
                },
                {
                    id: 4,
                    name: "Puri Beach",
                    area: "Odisha",
                    suggestedBy: "Local Students",
                    date: "2026-06-12"
                },
                {
                    id: 5,
                    name: "Kovalam Beach",
                    area: "Kerala",
                    suggestedBy: "Environmental Club",
                    date: "2026-06-20"
                }
            ];
            localStorage.setItem('oceanLocations', JSON.stringify(locations));
        }
        
        // Display locations
        const locationsGrid = document.getElementById('locationsGrid');
        if (locationsGrid) {
            if (locations.length === 0) {
                locationsGrid.innerHTML = '<p style="text-align:center;">No locations yet. Be the first to suggest a cleanup spot!</p>';
                return;
            }
            
            locationsGrid.innerHTML = locations.map(loc => `
                <div class="location-card">
                    <i class="fas fa-map-pin" style="color:#ff7043; font-size:1.5rem;"></i>
                    <h3>${escapeHtml(loc.name)}</h3>
                    <p><i class="fas fa-location-dot"></i> ${escapeHtml(loc.area)}</p>
                    <p><i class="fas fa-user"></i> Suggested by: ${escapeHtml(loc.suggestedBy)}</p>
                    <p><i class="fas fa-calendar"></i> ${loc.date}</p>
                    <button class="btn-volunteer-location" data-location="${escapeHtml(loc.name)}" style="margin-top:0.8rem; background:#0277bd; color:white; border:none; padding:0.5rem 1rem; border-radius:2rem; cursor:pointer;"><i class="fas fa-hands-helping"></i> Volunteer for this Camp</button>
                </div>
            `).join('');
            
            // Add event listeners to volunteer buttons
            document.querySelectorAll('.btn-volunteer-location').forEach(btn => {
                btn.addEventListener('click', function() {
                    const locationName = this.getAttribute('data-location');
                    document.getElementById('volLocation').value = locationName;
                    document.getElementById('volunteer').scrollIntoView({ behavior: 'smooth' });
                    showMessage('volunteerMessage', `Great! You want to volunteer at ${locationName}. Please fill the form above.`, 'success');
                });
            });
        }
    }
    
    // Helper function to show messages
    function showMessage(elementId, message, type) {
        const msgDiv = document.getElementById(elementId);
        if (msgDiv) {
            msgDiv.innerHTML = `<div style="padding: 0.8rem; border-radius: 0.8rem; background: ${type === 'success' ? '#c8e6c9' : '#ffcdd2'}; color: ${type === 'success' ? '#2e7d32' : '#c62828'};">${message}</div>`;
            setTimeout(() => {
                msgDiv.innerHTML = '';
            }, 5000);
        }
    }
    
    // Helper to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Animate dolphin on scroll
    let lastScrollY = 0;
    window.addEventListener('scroll', function() {
        const dolphin = document.querySelector('.dolphin-container');
        if (dolphin) {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScrollY) {
                dolphin.style.animation = 'swimDolphin 15s ease-in-out infinite';
            }
            lastScrollY = currentScroll;
        }
    });
    
    // Display total volunteers count
    function updateVolunteerCount() {
        const volunteers = JSON.parse(localStorage.getItem('oceanVolunteers') || '[]');
        const countSpan = document.getElementById('volunteerCount');
        if (countSpan) {
            countSpan.textContent = volunteers.length;
        }
    }
    updateVolunteerCount();
});