// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Order Form Submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const towerNumber = document.getElementById('towerNumber').value;
            const flatNumber = document.getElementById('flatNumber').value;
            const orderDetails = document.getElementById('orderDetails').value;
            
            // Generate tracking number
            const trackingNumber = 'TRK-' + Math.floor(100000 + Math.random() * 900000);
            
            // Create new order
            const newOrder = {
                towerNumber: towerNumber,
                flatNumber: flatNumber,
                orderDetails: orderDetails,
                trackingNumber: trackingNumber,
                status: 'In Progress',
                createdAt: new Date().toISOString(),
                startTime: new Date().getTime(),
                duration: null
            };
            
            // Update user data
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.orders.push(newOrder);
            
            // Update users list
            let users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.accountNumber === currentUser.accountNumber);
            users[userIndex] = currentUser;
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Show timer
            document.getElementById('orderForm').classList.add('hidden');
            document.getElementById('orderTimer').classList.remove('hidden');
            document.getElementById('trackingNumber').textContent = trackingNumber;
            
            // Start timer
            startOrderTimer(newOrder.startTime);
        });
    }
    
    // Complete Order Button
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const lastOrder = currentUser.orders[currentUser.orders.length - 1];
            
            // Calculate duration in seconds
            const endTime = new Date().getTime();
            const duration = Math.floor((endTime - lastOrder.startTime) / 1000);
            
            // Update order status
            lastOrder.status = 'Delivered';
            lastOrder.duration = formatDuration(duration);
            
            // Update users list
            let users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.accountNumber === currentUser.accountNumber);
            users[userIndex] = currentUser;
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            alert('Order marked as delivered successfully!');
            window.location.href = 'dashboard.html';
        });
    }
    
    // Order History Page
    if (window.location.pathname.endsWith('order-history.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const orderHistoryTable = document.getElementById('orderHistoryTable').getElementsByTagName('tbody')[0];
        
        // Display all orders by default
        displayOrders(currentUser.orders);
        
        // Filter functionality
        const filterDate = document.getElementById('filterDate');
        filterDate.addEventListener('change', function() {
            const filterValue = this.value;
            let filteredOrders = [];
            
            if (filterValue === 'all') {
                filteredOrders = currentUser.orders;
            } else {
                const now = new Date();
                filteredOrders = currentUser.orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    
                    if (filterValue === 'today') {
                        return orderDate.toDateString() === now.toDateString();
                    } else if (filterValue === 'week') {
                        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                        return orderDate >= startOfWeek;
                    } else if (filterValue === 'month') {
                        return orderDate.getMonth() === now.getMonth() && 
                               orderDate.getFullYear() === now.getFullYear();
                    }
                    return true;
                });
            }
            
            displayOrders(filteredOrders);
        });
        
        function displayOrders(orders) {
            orderHistoryTable.innerHTML = '';
            
            if (orders.length === 0) {
                const row = orderHistoryTable.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 5;
                cell.textContent = 'No orders found';
                cell.style.textAlign = 'center';
                return;
            }
            
            orders.forEach(order => {
                const row = orderHistoryTable.insertRow();
                
                const date = new Date(order.createdAt);
                const dateCell = row.insertCell(0);
                dateCell.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                
                const trackingCell = row.insertCell(1);
                trackingCell.textContent = order.trackingNumber;
                
                const addressCell = row.insertCell(2);
                addressCell.textContent = `${order.towerNumber}/${order.flatNumber}`;
                
                const durationCell = row.insertCell(3);
                durationCell.textContent = order.duration || 'N/A';
                
                const statusCell = row.insertCell(4);
                statusCell.textContent = order.status;
                statusCell.className = order.status.toLowerCase().replace(' ', '-');
            });
        }
    }
});

function startOrderTimer(startTime) {
    const timerElement = document.querySelector('.timer');
    
    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000); // in seconds
        
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Clear interval when leaving the page
    window.addEventListener('beforeunload', function() {
        clearInterval(timerInterval);
    });
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
}
