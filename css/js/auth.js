// Authentication Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('currentUser')) {
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const accountNumber = document.getElementById('accountNumber').value;
            
            // Check if account exists
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.accountNumber === accountNumber);
            
            if (user) {
                // Login successful
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Account not found. Please check your account number or create a new account.');
            }
        });
    }
    
    // Create Account Link
    const createAccountLink = document.getElementById('createAccount');
    if (createAccountLink) {
        createAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Generate random account number
            const accountNumber = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Create new user
            const newUser = {
                accountNumber: accountNumber,
                name: `User-${accountNumber}`,
                orders: [],
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto-login
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href = 'dashboard.html';
        });
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Display user info on dashboard
    if (window.location.pathname.endsWith('dashboard.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.getElementById('userName').textContent = currentUser.name;
            
            // Calculate today's orders and total orders
            const today = new Date().toISOString().split('T')[0];
            const todayOrders = currentUser.orders.filter(order => 
                order.createdAt.includes(today)).length;
            const totalOrders = currentUser.orders.length;
            
            document.getElementById('todayOrders').textContent = todayOrders;
            document.getElementById('totalOrders').textContent = totalOrders;
        }
    }
    
    // Navigation buttons
    const newOrderBtn = document.getElementById('newOrderBtn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', function() {
            window.location.href = 'new-order.html';
        });
    }
    
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', function() {
            window.location.href = 'order-history.html';
        });
    }
});
