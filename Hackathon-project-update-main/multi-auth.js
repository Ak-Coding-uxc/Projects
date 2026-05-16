// multi-auth.js - Enhanced Authentication System with Notifications

// User Database - Students, Teachers, Admins
const USER_DATABASE = {
    students: [
        { id: 'student1', email: 'rahul@student.edu', name: 'Rahul Kumar', password: 'pass123', class: 'Class 10-A' },
        { id: 'student2', email: 'priya@student.edu', name: 'Priya Singh', password: 'pass456', class: 'Class 9-B' },
        { id: 'student3', email: 'amit@student.edu', name: 'Amit Sharma', password: 'pass789', class: 'Class 10-A' }
    ],
    teachers: [
        { id: 'teacher1', email: 'anita@school.edu', name: 'Mrs. Anita Sharma', password: 'pass123', role: 'teacher', class: 'Class 10-A', subject: 'Physics' },
        { id: 'teacher2', email: 'rahul@school.edu', name: 'Mr. Rahul Verma', password: 'pass456', role: 'teacher', class: 'Class 9-B', subject: 'Mathematics' },
        { id: 'teacher3', email: 'sunita@school.edu', name: 'Mrs. Sunita Gupta', password: 'pass789', role: 'teacher', class: 'Class 8-C', subject: 'Chemistry' }
    ],
    admins: [
        { id: 'admin', email: 'admin@school.edu', name: 'Principal Admin', password: 'admin123', role: 'admin', department: 'Administration' },
        { id: 'superadmin', email: 'super@school.edu', name: 'System Administrator', password: 'super123', role: 'superadmin', department: 'IT Department' }
    ]
};

// Notification System
class NotificationManager {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('school_notifications') || '[]');
    }
    
    // Create notification
    createNotification(title, message, type, targetRole = 'all', sender = 'Admin') {
        const notification = {
            id: Date.now(),
            title: title,
            message: message,
            type: type, // info, warning, success, danger
            targetRole: targetRole, // all, student, teacher, admin
            sender: sender,
            timestamp: new Date().toISOString(),
            read: false,
            priority: type === 'danger' ? 'high' : type === 'warning' ? 'medium' : 'low'
        };
        
        this.notifications.unshift(notification);
        this.saveNotifications();
        return notification;
    }
    
    // Get notifications for specific role
    getNotificationsForRole(role) {
        return this.notifications.filter(n => 
            n.targetRole === 'all' || n.targetRole === role
        ).slice(0, 10); // Latest 10
    }
    
    // Mark as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }
    
    // Get unread count
    getUnreadCount(role) {
        return this.getNotificationsForRole(role).filter(n => !n.read).length;
    }
    
    // Save to localStorage
    saveNotifications() {
        localStorage.setItem('school_notifications', JSON.stringify(this.notifications));
    }
    
    // Clear old notifications (keep last 50)
    cleanup() {
        this.notifications = this.notifications.slice(0, 50);
        this.saveNotifications();
    }
}

// Global notification manager
const notificationManager = new NotificationManager();

// Find user by ID/email and role
function findUser(id, role) {
    const users = USER_DATABASE[role + 's'] || [];
    const query = (id || '').trim().toLowerCase();
    return users.find(user =>
        user.id.toLowerCase() === query || 
        user.email.toLowerCase() === query
    );
}

// Handle unified login
function handleUnifiedLogin(role) {
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    // Hide previous error
    errorDiv.style.display = 'none';
    
    // Find user
    const user = findUser(userId, role);
    
    if (!user || user.password !== password) {
        errorDiv.textContent = `Invalid ${role} credentials. Please check your ID/Email and password.`;
        errorDiv.style.display = 'block';
        return;
    }
    
    // Create session
    const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
        ...user,
        loginTime: new Date().toISOString()
    };
    
    // Store session
    localStorage.setItem('user_session', JSON.stringify(session));
    
    // Show loading message
    showLoginSuccess(user.name, role);
    
    // Redirect based on role after short delay
    setTimeout(() => {
        switch(role) {
            case 'student':
                window.location.href = 'student-dashboard.html';
                break;
            case 'teacher':
                window.location.href = 'teacher-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
        }
    }, 1500);
}

// Show login success message
function showLoginSuccess(name, role) {
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
        <div style="background: linear-gradient(135deg, #d4edda, #c3e6cb); color: #155724; padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #28a745; animation: slideInRight 0.3s ease;">
            <strong><i class="fas fa-check-circle"></i> Welcome ${name}!</strong><br>
            <small>Redirecting to ${role} dashboard...</small>
        </div>
    `;
    
    const form = document.getElementById('unifiedLoginForm');
    form.style.display = 'none';
    form.parentNode.appendChild(successMsg);
}

// Authentication Guard for Protected Pages
function requireAuth(allowedRoles = []) {
    const session = localStorage.getItem('user_session');
    if (!session) {
        window.location.href = 'index.html';
        return null;
    }
    
    try {
        const user = JSON.parse(session);
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            alert('Access denied. You do not have permission to view this page.');
            window.location.href = getHomePageForRole(user.role);
            return null;
        }
        return user;
    } catch {
        localStorage.removeItem('user_session');
        window.location.href = 'index.html';
        return null;
    }
}

// Get home page based on role
function getHomePageForRole(role) {
    switch(role) {
        case 'student': return 'student-dashboard.html';
        case 'teacher': return 'teacher-dashboard.html';
        case 'admin': return 'admin-dashboard.html';
        default: return 'index.html';
    }
}

// Logout function
function logout() {
    const session = localStorage.getItem('user_session');
    if (session) {
        const user = JSON.parse(session);
        console.log(`User ${user.name} logged out at ${new Date().toISOString()}`);
    }
    localStorage.removeItem('user_session');
    localStorage.removeItem('teacher_session'); // Clean old teacher sessions
    window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
    const session = localStorage.getItem('user_session');
    if (session) {
        try {
            return JSON.parse(session);
        } catch {
            localStorage.removeItem('user_session');
            return null;
        }
    }
    return null;
}

// Initialize notifications on page load
function initializeNotifications() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Create some default notifications if none exist
    if (notificationManager.notifications.length === 0) {
        // Emergency notifications
        notificationManager.createNotification(
            'Fire Drill Scheduled',
            'Fire evacuation drill tomorrow at 10:00 AM. All students and staff must participate.',
            'warning',
            'all',
            'Safety Officer'
        );
        
        notificationManager.createNotification(
            'Weather Alert',
            'Heavy rainfall expected in next 6 hours. Outdoor activities cancelled.',
            'danger',
            'all',
            'Admin'
        );
        
        notificationManager.createNotification(
            'Safety Training Complete',
            'Earthquake safety module completed successfully. Certificate available for download.',
            'success',
            'student',
            'System'
        );
        
        // Teacher specific
        notificationManager.createNotification(
            'Assessment Reminder',
            'Please review pending student assessments in Emergency Preparedness module.',
            'info',
            'teacher',
            'Academic Head'
        );
    }
}

// Broadcast notification (Admin function)
function broadcastNotification(title, message, type, targetRole) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Only admins can broadcast notifications.');
        return false;
    }
    
    const notification = notificationManager.createNotification(
        title, message, type, targetRole, user.name
    );
    
    // Show success message
    if (typeof showNotification === 'function') {
        showNotification(`Notification broadcast to ${targetRole === 'all' ? 'everyone' : targetRole + 's'}!`, 'success');
    }
    
    return notification;
}

// Show notification popup
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColors = {
        success: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
        danger: 'linear-gradient(135deg, #f8d7da, #f1b0b7)', 
        warning: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
        info: 'linear-gradient(135deg, #d1ecf1, #b8daff)'
    };
    const textColors = {
        success: '#155724',
        danger: '#721c24',
        warning: '#856404', 
        info: '#0c5460'
    };
    
    notification.innerHTML = `<strong>${message}</strong>`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColors[type] || bgColors.info};
        color: ${textColors[type] || textColors.info};
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'danger' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}

// Auto-cleanup old notifications
setInterval(() => {
    notificationManager.cleanup();
}, 24 * 60 * 60 * 1000); // Daily cleanup

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
    
    // Add fade out animation styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(20px); }
            }
        `;
        document.head.appendChild(style);
    }
});