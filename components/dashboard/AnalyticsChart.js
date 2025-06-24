// components/dashboard/AnalyticsChart.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ANALYTICS = gql`
  query GetAnalytics {
    analytics {
      postsPerMonth {
        month
        count
      }
      topCategories {
        category
        count
      }
      viewsPerDay {
        date
        views
      }
    }
  }
`;

export default function AnalyticsChart() {
  const { data, loading, error } = useQuery(GET_ANALYTICS, {
    errorPolicy: 'all',
  });

  // Mock data for demonstration (remove when you have real analytics)
  const mockData = {
    postsPerMonth: [
      { month: 'Jan', count: 8 },
      { month: 'Feb', count: 12 },
      { month: 'Mar', count: 15 },
      { month: 'Apr', count: 10 },
      { month: 'May', count: 18 },
    ]
  };

  const analyticsData = data?.analytics || mockData;

  if (loading) {
    return (
      <div style={chartStyles.container}>
        <h3 style={chartStyles.title}>Analytics Overview</h3>
        <div style={chartStyles.skeleton}>
          <div style={chartStyles.skeletonBar} />
          <div style={chartStyles.skeletonBar} />
          <div style={chartStyles.skeletonBar} />
          <div style={chartStyles.skeletonBar} />
          <div style={chartStyles.skeletonBar} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={chartStyles.container}>
        <h3 style={chartStyles.title}>Analytics Overview</h3>
        <div style={chartStyles.error}>
          <p>Unable to load analytics data</p>
          <button 
            style={chartStyles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...analyticsData.postsPerMonth.map(item => item.count));

  return (
    <div style={chartStyles.container}>
      <div style={chartStyles.header}>
        <h3 style={chartStyles.title}>Posts Per Month</h3>
        <span style={chartStyles.period}>Last 5 months</span>
      </div>
      
      <div style={chartStyles.content}>
        {analyticsData.postsPerMonth.map((item, index) => (
          <div key={index} style={chartStyles.barContainer}>
            <div style={chartStyles.barLabel}>{item.month}</div>
            <div 
              style={{
                ...chartStyles.bar,
                height: `${(item.count / maxCount) * 100}%`,
                backgroundColor: getBarColor(index),
              }}
              title={`${item.count} posts in ${item.month}`}
            />
            <div style={chartStyles.barValue}>{item.count}</div>
          </div>
        ))}
      </div>

      <div style={chartStyles.insights}>
        <div style={chartStyles.insight}>
          <span style={chartStyles.insightLabel}>Total Posts:</span>
          <span style={chartStyles.insightValue}>
            {analyticsData.postsPerMonth.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
        <div style={chartStyles.insight}>
          <span style={chartStyles.insightLabel}>Average:</span>
          <span style={chartStyles.insightValue}>
            {Math.round(analyticsData.postsPerMonth.reduce((sum, item) => sum + item.count, 0) / analyticsData.postsPerMonth.length)}
          </span>
        </div>
      </div>
    </div>
  );
}

function getBarColor(index) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return colors[index % colors.length];
}

const chartStyles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  period: {
    fontSize: '0.75rem',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
  },
  content: {
    display: 'flex',
    alignItems: 'end',
    gap: '0.75rem',
    height: '120px',
    marginBottom: '1rem',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  barLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  bar: {
    width: '100%',
    maxWidth: '32px',
    borderRadius: '4px 4px 0 0',
    minHeight: '8px',
    flex: 1,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  barValue: {
    fontSize: '0.75rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    color: '#374151',
  },
  insights: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6',
  },
  insight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.25rem',
  },
  insightValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  skeleton: {
    display: 'flex',
    gap: '0.75rem',
    height: '120px',
    alignItems: 'end',
  },
  skeletonBar: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    height: '60%',
    animation: 'skeleton-loading 1.5s infinite ease-in-out',
  },
  error: {
    textAlign: 'center',
    padding: '2rem 0',
    color: '#6b7280',
  },
  retryButton: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
};