// components/dashboard/DashboardOverview.js
import React, { Suspense, lazy } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { DashboardHeader, StatCard, RecentActivity, QuickActions } from './DashboardComponents';
import { LoadingWrapper, DashboardStatsSkeleton } from '../ui/LoadingComponents';
import { GET_SUMMARY } from '../../graphql/queries';

// Lazy load heavy components for code splitting
const AnalyticsChart = lazy(() => import('./AnalyticsChart'));
const NotificationsPanel = lazy(() => import('./NotificationsPanel'));

export default function DashboardOverview({ userName, lastLoginTime }) {
  const { 
    loading, 
    error, 
    data,
    refetch 
  } = useQuery(GET_SUMMARY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const handleStatCardClick = (type) => {
    // Navigate to filtered view
    switch (type) {
      case 'drafts':
        window.location.href = '/posts?status=draft';
        break;
      case 'published':
        window.location.href = '/posts?status=published';
        break;
      case 'pending':
        window.location.href = '/posts?status=pending';
        break;
      default:
        window.location.href = '/posts';
    }
  };

  const handlePostClick = (post) => {
    window.location.href = `/posts/${post.id}`;
  };

  return (
    <div style={styles.container}>
      <DashboardHeader 
        userName={userName} 
        lastLoginTime={lastLoginTime} 
      />

      <LoadingWrapper
        loading={loading && !data}
        error={error}
        retryFunction={() => refetch()}
        loadingComponent={<DashboardStatsSkeleton />}
      >
        {data && (
          <>
            {/* Stats Overview */}
            <div style={styles.statsGrid}>
              <StatCard
                title="Total Posts"
                value={data.postsSummary.totalPosts}
                color="#fef3f2"
                icon="📝"
                onClick={() => handleStatCardClick('all')}
              />
              <StatCard
                title="Drafts"
                value={data.postsSummary.drafts}
                color="#fffbeb"
                icon="✏️"
                onClick={() => handleStatCardClick('drafts')}
              />
              <StatCard
                title="Published"
                value={data.postsSummary.published}
                color="#f0fdf4"
                icon="✅"
                onClick={() => handleStatCardClick('published')}
              />
              <StatCard
                title="Pending Review"
                value={data.postsSummary.pending}
                color="#f0f9ff"
                icon="⏳"
                onClick={() => handleStatCardClick('pending')}
              />
            </div>

            {/* Main Content Grid */}
            <div style={styles.contentGrid}>
              {/* Recent Activity */}
              <div style={styles.activitySection}>
                <RecentActivity
                  posts={data.recentPosts}
                  loading={loading}
                  onPostClick={handlePostClick}
                />
              </div>

              {/* Sidebar */}
              <div style={styles.sidebar}>
                {/* Quick Actions */}
                <QuickActions />

                {/* Lazy-loaded Analytics Chart */}
                <Suspense fallback={<div style={styles.chartSkeleton}>Loading analytics...</div>}>
                  <AnalyticsChart />
                </Suspense>

                {/* Lazy-loaded Notifications */}
                <Suspense fallback={<div style={styles.notificationsSkeleton}>Loading notifications...</div>}>
                  <NotificationsPanel />
                </Suspense>
              </div>
            </div>
          </>
        )}
      </LoadingWrapper>
    </div>
  );
}

DashboardOverview.propTypes = {
  userName: PropTypes.string,
  lastLoginTime: PropTypes.string,
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#111827',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  activitySection: {
    minHeight: '400px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  chartSkeleton: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280',
    border: '1px dashed #d1d5db',
  },
  notificationsSkeleton: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '1.5rem',
    textAlign: 'center',
    color: '#6b7280',
    border: '1px dashed #d1d5db',
  },
};
