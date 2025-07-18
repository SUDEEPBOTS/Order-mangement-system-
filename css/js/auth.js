// auth.js - Fixed Authentication System

// Initialize application data
function initializeAppData() {
    if (!localStorage.getItem('appData')) {
        localStorage.setItem('appData', JSON.stringify({
            users: [
                { 
                    username: "sudeep1998", 
                    name: "Sudeep",
                    email: "sudeep@example.com",
                    phone: "+911234567890",
                    age: 25,
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                },
                { 
                    username: "abss123", 
                    name: "Abhishek",
                    email: "abhishek@example.com",
                    phone: "+919876543210",
                    age: 28,
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                }
            ],
            allOrders: []
        }));
    }
}

// Utility functions
function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
}

// Main authentication functions
function handleLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const appData = JSON.parse(localStorage.getItem('appData'));
            
            // Find user in both default and created accounts
            const user = appData.users.find(u => u.username === username);
            
            if (user) {
                // Store user data consistently
                localStorage.setItem('currentUser', JSON.stringify({
                    username: user.username,
                    name: user.name
                }));
                
                // Update last login
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('appData', JSON.stringify(appData));
                
                window.location.href = 'dashboard.html';
            } else {
                showAlert('Invalid username. Please try again.');
            }
        });
    }
}

function handleAccountCreation() {
    const createAccountForm = document.getElementById('createAccountForm');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newUser = {
                username: document.getElementById('newUsername').value.trim(),
                name: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                age: parseInt(document.getElementById('age').value),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            const appData = JSON.parse(localStorage.getItem('appData'));
            
            // Check if username exists
            if (appData.users.some(u => u.username === newUser.username)) {
                showAlert('Username already exists');
                return;
            }
            
            // Add new user
            appData.users.push(newUser);
            localStorage.setItem('appData', JSON.stringify(appData));
            
            // Login the new user
            localStorage.setItem('currentUser', JSON.stringify({
                username: newUser.username,
                name: newUser.name
            }));
            
            showAlert('Account created successfully!', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        });
    }
}

function handleLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        showAlert('Logged out successfully', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initializeAppData();
    
    // Redirect if already logged in
    if (localStorage.getItem('currentUser') && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    handleLogin();
    handleAccountCreation();
    handleLogout();
});
