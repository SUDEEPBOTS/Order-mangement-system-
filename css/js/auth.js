// auth.js - Complete Authentication System with Account Creation

// Initialize application data structure
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
            allOrders: [] // Global order history
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

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
}

function validateUsername(username) {
    const re = /^[a-zA-Z0-9_]{4,20}$/;
    return re.test(username);
}

// Main authentication functions
function handleAutoRedirect() {
    if (localStorage.getItem('currentUser') && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
        return true;
    }
    return false;
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password')?.value; // For future password support
            const appData = JSON.parse(localStorage.getItem('appData'));
            
            // Find user
            const user = appData.users.find(u => u.username === username);
            
            if (user) {
                // Show loading state
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                submitBtn.disabled = true;
                
                // Store user session
                localStorage.setItem('currentUser', JSON.stringify({
                    username: user.username,
                    name: user.name
                }));
                
                // Update last login time
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('appData', JSON.stringify(appData));
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showAlert('Invalid username. Please try again or create a new account.');
                document.getElementById('username').classList.add('input-error');
            }
        });
    }
}

function setupAccountCreation() {
    const createAccountForm = document.getElementById('createAccountForm');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('fullName').value.trim(),
                age: parseInt(document.getElementById('age').value),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                username: document.getElementById('newUsername').value.trim(),
                createdAt: new Date().toISOString()
            };
            
            // Validation
            if (!formData.name || formData.name.length < 3) {
                showAlert('Please enter a valid name (min 3 characters)');
                return;
            }
            
            if (!formData.age || formData.age < 13 || formData.age > 120) {
                showAlert('Please enter a valid age between 13 and 120');
                return;
            }
            
            if (!validateEmail(formData.email)) {
                showAlert('Please enter a valid email address');
                return;
            }
            
            if (!validatePhone(formData.phone)) {
                showAlert('Please enter a valid phone number');
                return;
            }
            
            if (!validateUsername(formData.username)) {
                showAlert('Username must be 4-20 characters (letters, numbers, underscores)');
                return;
            }
            
            const appData = JSON.parse(localStorage.getItem('appData'));
            
            // Check if username exists
            if (appData.users.some(u => u.username === formData.username)) {
                showAlert('Username already taken. Please choose another.');
                return;
            }
            
            // Check if email exists
            if (appData.users.some(u => u.email === formData.email)) {
                showAlert('Email already registered. Please use another email.');
                return;
            }
            
            // Show loading state
            const submitBtn = createAccountForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Add new user
            appData.users.push(formData);
            localStorage.setItem('appData', JSON.stringify(appData));
            
            // Auto-login the new user
            setTimeout(() => {
                localStorage.setItem('currentUser', JSON.stringify({
                    username: formData.username,
                    name: formData.name
                }));
                
                showAlert('Account created successfully! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 1000);
        });
    }
}

function setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        showAlert('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

function displayDashboardInfo() {
    if (window.location.pathname.endsWith('dashboard.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser?.username) {
            window.location.href = 'index.html';
            return;
        }

        const appData = JSON.parse(localStorage.getItem('appData'));
        const user = appData.users.find(u => u.username === currentUser.username);
        
        if (user) {
            // Display user info
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userSince').textContent = new Date(user.createdAt).toLocaleDateString();
            
            // Calculate order stats
            const userOrders = appData.allOrders.filter(order => order.username === currentUser.username);
            const todayOrders = userOrders.filter(order => {
                return new Date(order.createdAt).toDateString() === new Date().toDateString();
            });
            
            document.getElementById('todayOrders').textContent = todayOrders.length;
            document.getElementById('totalOrders').textContent = userOrders.length;
            
            // Update last login display
            if (user.lastLogin) {
                document.getElementById('lastLogin').textContent = new Date(user.lastLogin).toLocaleString();
            }
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAppData();
    
    if (!handleAutoRedirect()) {
        setupLoginForm();
        setupAccountCreation();
        setupLogout();
        displayDashboardInfo();
    }
    
    // Add input validation listeners
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
        });
    });
});
