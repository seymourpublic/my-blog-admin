// components/dashboard/DashboardHeader.js
import React from 'react';
import PropTypes from 'prop-types';

export const DashboardHeader = ({ userName, lastLoginTime }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.content}>
        <h1 style={headerStyles.title}>
          {getGreeting()}{userName ? `, ${userName}` : ''}!
        </h1>
        <p style={headerStyles.subtitle}>
          Heres whats happening with your blog today
        </p>
        {lastLoginTime && (
          <p style={headerStyles.lastLogin}>
            Last login: {new Date(lastLoginTime).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

DashboardHeader.propTypes = {
  userName: PropTypes.string,
  lastLoginTime: PropTypes.string,
};

const headerStyles = {
  container: {
    marginBottom: '2rem',
  },
  content: {
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    color: '#1f2937',
  },
  subtitle: {
    margin: '0 0 0.25rem 0',
    color: '#6b7280',
    fontSize: '1rem',
  },
  lastLogin: {
    margin: 0,
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
};
