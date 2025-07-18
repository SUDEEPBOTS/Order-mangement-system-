// auth.js - Complete Authentication System

// Initialize application data structure
if (!localStorage.getItem('appData')) {
    localStorage.setItem('appData', JSON.stringify({
        users: [
            { 
                username: "sudeep1998", 
                name: "Sudeep",
                createdAt: new Date().toISOString()
            },
            { 
                username: "abss123", 
                name: "Abhishek",
                createdAt: new Date().toISOString()
            }
        ],
        allOrders: [] // Global order history
    }));
}

document.addEventListener('DOMContentLoaded', function() {
    // Auto-redirect if already logged in
    if (localStorage.getItem('currentUser') && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const appData = JSON.parse(localStorage.getItem('appData'));
            
            // Find user
            const user = appData.users.find(u => u.username === username);
            
            if (user) {
                // Store only username in currentUser for security
                localStorage.setItem('currentUser', username);
                
                // Update last login time
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('appData', JSON.stringify(appData));
                
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username. Only "sudeep1998" and "abss123" are valid.');
            }
        });
    }

    // Logout Functionality
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Dashboard User Display
    if (window.location.pathname.endsWith('dashboard.html')) {
        const username = localStorage.getItem('currentUser');
        const appData = JSON.parse(localStorage.getItem('appData'));
        
        if (!username) {
            window.location.href = 'index.html';
            return;
        }

        const user = appData.users.find(u => u.username === username);
        if (user) {
            // Display user info
            document.getElementById('userName').textContent = user.name;
            
            // Calculate order stats
            const userOrders = appData.allOrders.filter(order => order.username === username);
            const todayOrders = userOrders.filter(order => {
                return new Date(order.createdAt).toDateString() === new Date().toDateString();
            }).length;
            
            document.getElementById('todayOrders').textContent = todayOrders;
            document.getElementById('totalOrders').textContent = userOrders.length;
        } else {
            window.location.href = 'index.html';
        }
    }
});
