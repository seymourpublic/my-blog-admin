// components/DashboardOverview.js
import { useQuery, gql } from '@apollo/client';
import React from 'react';

const GET_SUMMARY = gql`
  query GetSummary {
    postsSummary {
      totalPosts
      drafts
      published
      pending
    }
    recentPosts {
      id
      title
      publishedAt
      updatedAt
    }
  }
`;

export default function DashboardOverview() {
  const { loading, error, data } = useQuery(GET_SUMMARY);

  if (loading) return <p style={styles.loadingText}>Loading dashboard data...</p>;
  if (error) return <p style={styles.errorText}>Error loading dashboard data.</p>;

  const { totalPosts, drafts, published, pending } = data.postsSummary;
  const recentPosts = data.recentPosts;

  return (
    <div style={styles.container}>
      {/* Header / Welcome */}
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome Back!</h1>
        <p style={styles.subtitle}>Here’s what’s happening with your blog today</p>
      </div>

      {/* Overview Cards */}
      <div style={styles.overviewGrid}>
        <div style={{ ...styles.statCard, background: '#FFE7E7' }}>
          <h3 style={styles.statTitle}>Total Posts</h3>
          <p style={styles.statNumber}>{totalPosts}</p>
        </div>
        <div style={{ ...styles.statCard, background: '#FFF4E7' }}>
          <h3 style={styles.statTitle}>Drafts</h3>
          <p style={styles.statNumber}>{drafts}</p>
        </div>
        <div style={{ ...styles.statCard, background: '#E7FFF3' }}>
          <h3 style={styles.statTitle}>Published</h3>
          <p style={styles.statNumber}>{published}</p>
        </div>
        <div style={{ ...styles.statCard, background: '#E7E9FF' }}>
          <h3 style={styles.statTitle}>Pending</h3>
          <p style={styles.statNumber}>{pending}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.activitySection}>
        <h2 style={styles.activityTitle}>Recent Activity</h2>
        {recentPosts.length === 0 ? (
          <p style={styles.noActivity}>No recent posts found.</p>
        ) : (
          <div style={styles.activityList}>
            {recentPosts.map((post) => (
              <div key={post.id} style={styles.activityItem}>
                <div style={styles.activityInfo}>
                  <h4 style={styles.activityPostTitle}>{post.title}</h4>
                  <p style={styles.activityDate}>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Inline Styles */
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'sans-serif',
    color: '#333',
  },
  loadingText: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '1rem',
  },
  errorText: {
    marginTop: '2rem',
    textAlign: 'center',
    color: 'red',
    fontSize: '1rem',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    color: '#666',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    borderRadius: '10px',
    padding: '1rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statTitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#555',
  },
  statNumber: {
    margin: 0,
    marginTop: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  activitySection: {
    marginTop: '2rem',
  },
  activityTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  noActivity: {
    color: '#999',
    marginLeft: '0.5rem',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  activityItem: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  activityInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  activityPostTitle: {
    margin: 0,
    fontSize: '1rem',
  },
  activityDate: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
  },
};
