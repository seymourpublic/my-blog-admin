// pages/index.js - Enhanced version that matches your working pattern
import Layout from '../components/Layout';
import DashboardOverview from '../components/DashboardOverview';
import Link from 'next/link';
import { useState } from 'react';

// Enhanced Quick Actions Component (no external dependencies)
const EnhancedQuickActions = () => {
  const [hoveredAction, setHoveredAction] = useState(null);

  const actions = [
    {
      href: '/posts/new',
      title: 'Create New Post',
      description: 'Start writing and sharing your ideas',
      icon: '✍️',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    },
    {
      href: '/categories/new',
      title: 'Create New Category',
      description: 'Organize your content better',
      icon: '📁',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
      href: '/posts',
      title: 'Manage Posts',
      description: 'Edit and organize existing content',
      icon: '📝',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    {
      href: '/analytics',
      title: 'View Analytics',
      description: 'Track your blog performance',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    },
  ];

  return (
    <div style={quickActionsStyles.container}>
      <div style={quickActionsStyles.header}>
        <h2 style={quickActionsStyles.title}>Quick Actions</h2>
        <p style={quickActionsStyles.subtitle}>
          Jump into the most common tasks
        </p>
      </div>
      
      <div style={quickActionsStyles.grid}>
        {actions.map((action, index) => (
          <Link 
            key={index}
            href={action.href} 
            style={{
              ...quickActionsStyles.actionCard,
              background: hoveredAction === index ? action.gradient : '#fff',
              color: hoveredAction === index ? '#fff' : '#1f2937',
              transform: hoveredAction === index ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hoveredAction === index 
                ? '0 20px 40px rgba(0,0,0,0.15)' 
                : '0 4px 20px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={() => setHoveredAction(index)}
            onMouseLeave={() => setHoveredAction(null)}
          >
            <div style={quickActionsStyles.iconContainer}>
              <span 
                style={{
                  ...quickActionsStyles.icon,
                  backgroundColor: hoveredAction === index 
                    ? 'rgba(255,255,255,0.2)' 
                    : '#f8fafc',
                }}
              >
                {action.icon}
              </span>
            </div>
            
            <div style={quickActionsStyles.content}>
              <h3 style={quickActionsStyles.actionTitle}>
                {action.title}
              </h3>
              <p style={{
                ...quickActionsStyles.actionDescription,
                color: hoveredAction === index ? 'rgba(255,255,255,0.9)' : '#6b7280',
              }}>
                {action.description}
              </p>
            </div>
            
            <div style={{
              ...quickActionsStyles.arrow,
              color: hoveredAction === index ? '#fff' : '#9ca3af',
            }}>
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Enhanced Welcome Banner
const WelcomeBanner = () => {
  return (
    <div style={bannerStyles.container}>
      <div style={bannerStyles.content}>
        <div style={bannerStyles.textSection}>
          <h1 style={bannerStyles.title}>Welcome to VersaBlog Admin</h1>
          <p style={bannerStyles.description}>
            Manage your content, track performance, and grow your audience with our powerful dashboard.
          </p>
        </div>
        <div style={bannerStyles.illustration}>
          <div style={bannerStyles.illustrationCircle}>📊</div>
        </div>
      </div>
    </div>
  );
};

// Main Enhanced Dashboard Page
export default function DashboardHome() {
  return (
    <Layout>
      <div style={styles.container}>
        {/* Enhanced Welcome Banner */}
        <WelcomeBanner />
        
        {/* Your existing working DashboardOverview with GraphQL */}
        <DashboardOverview />
        
        {/* Enhanced Quick Actions */}
        <EnhancedQuickActions />
        
        {/* Additional Insights Section */}
        <div style={styles.insightsSection}>
          <div style={styles.insightCard}>
            <div style={styles.insightIcon}>💡</div>
            <div style={styles.insightContent}>
              <h3 style={styles.insightTitle}>Pro Tip</h3>
              <p style={styles.insightText}>
                Use categories to organize your content and make it easier for readers to find what they are looking for.
              </p>
            </div>
          </div>
          
          <div style={styles.insightCard}>
            <div style={styles.insightIcon}>🚀</div>
            <div style={styles.insightContent}>
              <h3 style={styles.insightTitle}>Getting Started</h3>
              <p style={styles.insightText}>
                New to blogging? Start by creating your first post and organizing it with relevant categories and tags.
              </p>
            </div>
          </div>
          
          <div style={styles.insightCard}>
            <div style={styles.insightIcon}>📈</div>
            <div style={styles.insightContent}>
              <h3 style={styles.insightTitle}>Growth Tip</h3>
              <p style={styles.insightText}>
                Monitor your analytics regularly to understand what content resonates most with your audience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    color: "#333",
  },
  insightsSection: {
    marginTop: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f3f4f6',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    transition: 'all 0.3s ease',
  },
  insightIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    color: '#1f2937',
  },
  insightText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: 1.5,
  },
};

const quickActionsStyles = {
  container: {
    marginTop: '2rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f3f4f6',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #e5e7eb',
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    marginRight: '1rem',
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    fontSize: '1.5rem',
    transition: 'all 0.3s ease',
  },
  content: {
    flex: 1,
  },
  actionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    lineHeight: 1.2,
  },
  actionDescription: {
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: 1.4,
  },
  arrow: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginLeft: '1rem',
    transition: 'all 0.3s ease',
  },
};

const bannerStyles = {
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '2rem',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  textSection: {
    flex: 1,
    maxWidth: '600px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
    lineHeight: 1.2,
  },
  description: {
    fontSize: '1.1rem',
    margin: 0,
    opacity: 0.9,
    lineHeight: 1.6,
  },
  illustration: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '2rem',
  },
  illustrationCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    backdropFilter: 'blur(10px)',
  },
};