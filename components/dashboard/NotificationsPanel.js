// components/dashboard/NotificationsPanel.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'comment',
      message: 'New comment on "Getting Started with React"',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      type: 'system',
      message: 'Weekly backup completed successfully',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 3,
      type: 'milestone',
      message: 'Congratulations! You reached 1000 page views',
      time: '3 days ago',
      unread: false,
    },
    {
      id: 4,
      type: 'user',
      message: 'New user registered: sarah.wilson@example.com',
      time: '5 days ago',
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  return (
    <div style={notificationStyles.container}>
      <div style={notificationStyles.header}>
        <div style={notificationStyles.titleSection}>
          <h3 style={notificationStyles.title}>Notifications</h3>
          {unreadCount > 0 && (
            <span style={notificationStyles.badge}>{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={notificationStyles.markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      <div style={notificationStyles.list}>
        {notifications.length === 0 ? (
          <div style={notificationStyles.emptyState}>
            <p>No notifications</p>
            <span style={notificationStyles.emptyIcon}>🔔</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
            />
          ))
        )}
      </div>

      <div style={notificationStyles.footer}>
        <button style={notificationStyles.viewAllButton}>
          View All Notifications
        </button>
      </div>
    </div>
  );
}

const NotificationItem = ({ notification, onMarkAsRead, onRemove }) => {
  return (
    <div
      style={{
        ...notificationStyles.item,
        ...(notification.unread ? notificationStyles.unreadItem : {}),
      }}
    >
      <div style={notificationStyles.indicator}>
        {getNotificationIcon(notification.type)}
      </div>
      
      <div style={notificationStyles.content}>
        <p style={notificationStyles.message}>{notification.message}</p>
        <div style={notificationStyles.meta}>
          <span style={notificationStyles.time}>{notification.time}</span>
          <div style={notificationStyles.actions}>
            {notification.unread && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                style={notificationStyles.actionButton}
              >
                Mark read
              </button>
            )}
            <button
              onClick={() => onRemove(notification.id)}
              style={notificationStyles.removeButton}
              aria-label="Remove notification"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      
      {notification.unread && (
        <div style={notificationStyles.unreadDot} />
      )}
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    unread: PropTypes.bool.isRequired,
  }).isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

function getNotificationIcon(type) {
  const icons = {
    comment: '💬',
    system: '⚙️',
    milestone: '🎉',
    user: '👤',
    warning: '⚠️',
    success: '✅',
    error: '❌',
  };
  return icons[type] || '📢';
}

const notificationStyles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 1.5rem 1rem 1.5rem',
    borderBottom: '1px solid #f3f4f6',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  badge: {
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    minWidth: '1.25rem',
    textAlign: 'center',
  },
  markAllRead: {
    fontSize: '0.875rem',
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  },
  list: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '2rem',
    display: 'block',
    marginTop: '0.5rem',
    opacity: 0.5,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #f9fafb',
    transition: 'background-color 0.2s ease',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: '#f0f9ff',
  },
  indicator: {
    fontSize: '1.25rem',
    flexShrink: 0,
    marginTop: '0.125rem',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.875rem',
    color: '#374151',
    lineHeight: 1.4,
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  actionButton: {
    fontSize: '0.75rem',
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.125rem 0.25rem',
  },
  removeButton: {
    fontSize: '1rem',
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.125rem',
    lineHeight: 1,
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    position: 'absolute',
    top: '16px',
    right: '12px',
  },
  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #f3f4f6',
    backgroundColor: '#f9fafb',
  },
  viewAllButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};