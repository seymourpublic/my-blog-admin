// components/Layout.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { FaHome, FaListAlt, FaFolder, FaPlus, FaTag, FaBars, FaTimes, FaUser, FaCog } from 'react-icons/fa';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function Layout({ children, userName = 'Admin' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigationItems = [
    {
      href: '/',
      icon: FaHome,
      label: 'Dashboard',
      badge: null,
    },
    {
      href: '/posts',
      icon: FaListAlt,
      label: 'Posts',
      badge: null,
    },
    {
      href: '/categories',
      icon: FaFolder,
      label: 'Categories & Tags',
      badge: null,
    },
    {
      href: '/posts/new',
      icon: FaPlus,
      label: 'New Post',
      badge: 'primary',
    },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      {isMobile && (
        <header style={styles.mobileHeader}>
          <button
            onClick={toggleSidebar}
            style={styles.menuButton}
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
          <h1 style={styles.mobileTitle}>VersaBlog Admin</h1>
          <div style={styles.headerActions}>
            <button style={styles.userButton} aria-label="User menu">
              <FaUser />
            </button>
          </div>
        </header>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          ...(isMobile ? {
            ...styles.mobileSidebar,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          } : {}),
        }}
      >
        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <h2 style={styles.logoText}>VersaBlog</h2>
            <span style={styles.logoSubtext}>Admin</span>
          </div>
          {isMobile && (
            <button
              onClick={closeSidebar}
              style={styles.closeButton}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={styles.navigation}>
          <div style={styles.navSection}>
            <span style={styles.navSectionTitle}>Main</span>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.navItem,
                    ...(isActive ? styles.activeNavItem : {}),
                  }}
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <Icon style={styles.navIcon} />
                  <span style={styles.navLabel}>{item.label}</span>
                  {item.badge === 'primary' && (
                    <span style={styles.primaryBadge}>New</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div style={styles.navSection}>
            <span style={styles.navSectionTitle}>Settings</span>
            <Link
              href="/settings"
              style={{
                ...styles.navItem,
                ...(isActivePath('/settings') ? styles.activeNavItem : {}),
              }}
              onClick={isMobile ? closeSidebar : undefined}
            >
              <FaCog style={styles.navIcon} />
              <span style={styles.navLabel}>Settings</span>
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div style={styles.userProfile}>
          <div style={styles.userAvatar}>
            <FaUser />
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{userName}</div>
            <div style={styles.userRole}>Administrator</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        ...(isMobile ? styles.mobileMain : {}),
      }}>
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  userName: PropTypes.string,
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    backgroundColor: '#f8fafc',
  },
  mobileHeader: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem',
    zIndex: 1000,
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    color: '#64748b',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  mobileTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  userButton: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: '#64748b',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#1e293b',
    color: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1000,
  },
  mobileSidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    transition: 'transform 0.3s ease',
  },
  sidebarHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: 0,
    color: '#f1f5f9',
  },
  logoSubtext: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontWeight: '500',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  navigation: {
    flex: 1,
    padding: '1rem 0',
    overflow: 'auto',
  },
  navSection: {
    marginBottom: '2rem',
  },
  navSectionTitle: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '0 1.5rem',
    marginBottom: '0.75rem',
    display: 'block',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    color: '#cbd5e1',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  activeNavItem: {
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  navIcon: {
    fontSize: '1.125rem',
    marginRight: '0.75rem',
    flexShrink: 0,
  },
  navLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    flex: 1,
  },
  primaryBadge: {
    backgroundColor: '#10b981',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
  },
  userProfile: {
    padding: '1.5rem',
    borderTop: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    backgroundColor: '#475569',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    color: '#94a3b8',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#f1f5f9',
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  mobileMain: {
    marginTop: '60px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '2rem',
  },
};

// Add hover effects with CSS-in-JS
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .nav-item:hover:not(.active-nav-item) {
      background-color: #334155 !important;
      color: #f1f5f9 !important;
    }
  `;
  document.head.appendChild(style);
}