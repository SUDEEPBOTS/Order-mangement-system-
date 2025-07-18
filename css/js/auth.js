// auth.js - Fixed Login Only

// Predefined users
const predefinedUsers = [
    {
        username: "sudeep1998",
        name: "Sudeep",
        orders: []
    },
    {
        username: "abss123",
        name: "Abhishek",
        orders: []
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('currentUser')) {
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = 'dashboard.html';
        }
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            
            // Check against predefined users
            const user = predefinedUsers.find(u => u.username === username);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
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
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.getElementById('userName').textContent = currentUser.name;
            // ... rest of dashboard code ...
        } else {
            window.location.href = 'index.html';
        }
    }
});
