// components/DashboardOverview.js - Enhanced version using your working GraphQL
import { useQuery, gql } from '@apollo/client';
import React, { Suspense, lazy } from 'react';

// Your existing working GraphQL query
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

// Lazy load analytics and notifications (with fallbacks)
const AnalyticsChart = lazy(() => 
  import('./dashboard/AnalyticsChart').catch(() => ({ default: () => <SimpleAnalytics /> }))
);
const NotificationsPanel = lazy(() => 
  import('./dashboard/NotificationsPanel').catch(() => ({ default: () => <SimpleNotifications /> }))
);

// Enhanced Dashboard Header
const DashboardHeader = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={headerStyles.container}>
      <h1 style={headerStyles.title}>
        {getGreeting()}{userName ? `, ${userName}` : ''}!
      </h1>
      <p style={headerStyles.subtitle}>
        Here's what's happening with your blog today
      </p>
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, color, icon, onClick, loading = false }) => {
  if (loading) {
    return (
      <div style={{ ...statStyles.card, backgroundColor: color }}>
        <div style={statStyles.skeleton}>
          <div style={statStyles.skeletonTitle} />
          <div style={statStyles.skeletonValue} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...statStyles.card,
        background: color,
        ...(onClick ? statStyles.clickable : {}),
      }}
      onClick={onClick}
      className="stat-card"
    >
      <div style={statStyles.cardHeader}>
        <h3 style={statStyles.title}>{title}</h3>
        {icon && (
          <div style={statStyles.iconContainer}>
            <span style={statStyles.icon}>{icon}</span>
          </div>
        )}
      </div>
      <p style={statStyles.value}>{value}</p>
      <div style={statStyles.trendIndicator}>
        <span style={statStyles.trendText}>View details →</span>
      </div>
    </div>
  );
};

// Enhanced Recent Activity Component
const RecentActivity = ({ posts, loading, onPostClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div style={activityStyles.container}>
        <h2 style={activityStyles.title}>Recent Activity</h2>
        <div style={activityStyles.list}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={activityStyles.skeletonItem}>
              <div style={activityStyles.skeletonTitle} />
              <div style={activityStyles.skeletonMeta} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div style={activityStyles.container}>
        <h2 style={activityStyles.title}>Recent Activity</h2>
        <div style={activityStyles.emptyState}>
          <div style={activityStyles.emptyIcon}>📝</div>
          <p style={activityStyles.emptyText}>No recent posts found</p>
          <p style={activityStyles.emptySubtext}>Start creating content to see activity here</p>
        </div>
      </div>
    );
  }

  return (
    <div style={activityStyles.container}>
      <div style={activityStyles.header}>
        <h2 style={activityStyles.title}>Recent Activity</h2>
        <span style={activityStyles.badge}>{posts.length} posts</span>
      </div>
      
      <div style={activityStyles.list}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={activityStyles.item}
            onClick={() => onPostClick?.(post)}
            className="activity-item"
          >
            <div style={activityStyles.itemContent}>
              <div style={activityStyles.itemHeader}>
                <h4 style={activityStyles.itemTitle}>{post.title}</h4>
                <div style={activityStyles.statusBadge}>
                  {post.publishedAt ? 'Published' : 'Draft'}
                </div>
              </div>
              <div style={activityStyles.itemMeta}>
                <span style={activityStyles.itemDate}>
                  Updated {formatDate(post.updatedAt)}
                </span>
                {post.publishedAt && (
                  <span style={activityStyles.publishDate}>
                    Published {formatDate(post.publishedAt)}
                  </span>
                )}
              </div>
            </div>
            <div style={activityStyles.itemArrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Analytics Fallback (in case the lazy component fails)
const SimpleAnalytics = () => {
  const data = [
    { month: 'Jan', count: 8 },
    { month: 'Feb', count: 12 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 10 },
    { month: 'May', count: 18 },
  ];

  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <div style={analyticsStyles.container}>
      <h3 style={analyticsStyles.title}>Posts Per Month</h3>
      <div style={analyticsStyles.chart}>
        {data.map((item, index) => (
          <div key={index} style={analyticsStyles.barContainer}>
            <div style={analyticsStyles.barLabel}>{item.month}</div>
            <div 
              style={{
                ...analyticsStyles.bar,
                height: `${(item.count / maxCount) * 100}%`,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index],
              }}
            />
            <div style={analyticsStyles.barValue}>{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Notifications Fallback
const SimpleNotifications = () => {
  const notifications = [
    { id: 1, icon: '💬', message: 'New comment on your latest post', time: '2 hours ago' },
    { id: 2, icon: '📊', message: 'Weekly report is ready', time: '1 day ago' },
    { id: 3, icon: '🎉', message: 'You reached 1000 page views!', time: '3 days ago' }
  ];

  return (
    <div style={notificationsStyles.container}>
      <h3 style={notificationsStyles.title}>Recent Notifications</h3>
      <div style={notificationsStyles.list}>
        {notifications.map((notification) => (
          <div key={notification.id} style={notificationsStyles.item}>
            <span style={notificationsStyles.icon}>{notification.icon}</span>
            <div>
              <p style={notificationsStyles.message}>{notification.message}</p>
              <span style={notificationsStyles.time}>{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Skeleton Components
const ChartSkeleton = () => (
  <div style={skeletonStyles.container}>
    <div style={skeletonStyles.title} />
    <div style={skeletonStyles.chart}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={skeletonStyles.bar} />
      ))}
    </div>
  </div>
);

const NotificationsSkeleton = () => (
  <div style={skeletonStyles.container}>
    <div style={skeletonStyles.title} />
    <div style={skeletonStyles.notifications}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={skeletonStyles.notification} />
      ))}
    </div>
  </div>
);

// Main Enhanced DashboardOverview Component
export default function DashboardOverview() {
  const { loading, error, data, refetch } = useQuery(GET_SUMMARY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const handleStatCardClick = (type) => {
    console.log(`Navigate to ${type} posts`);
    // Add your navigation logic here
  };

  const handlePostClick = (post) => {
    console.log('Navigate to post:', post.title);
    // Add your navigation logic here
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading && !data) {
    return (
      <div style={styles.container}>
        <DashboardHeader />
        <div style={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCard
              key={i}
              title="Loading..."
              value="..."
              color="#f3f4f6"
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={errorStyles.container}>
        <h2 style={errorStyles.title}>Unable to load dashboard</h2>
        <p style={errorStyles.message}>{error.message}</p>
        <button onClick={handleRetry} style={errorStyles.button}>
          Try Again
        </button>
      </div>
    );
  }

  const { totalPosts, drafts, published, pending } = data?.postsSummary || {};
  const recentPosts = data?.recentPosts || [];

  return (
    <div style={styles.container}>
      {/* Enhanced Header */}
      <DashboardHeader />

      {/* Enhanced Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Total Posts"
          value={totalPosts || 0}
          color="linear-gradient(135deg, #fef3f2, #fee2e2)"
          icon="📝"
          onClick={() => handleStatCardClick('all')}
        />
        <StatCard
          title="Drafts"
          value={drafts || 0}
          color="linear-gradient(135deg, #fffbeb, #fef3c7)"
          icon="✏️"
          onClick={() => handleStatCardClick('draft')}
        />
        <StatCard
          title="Published"
          value={published || 0}
          color="linear-gradient(135deg, #f0fdf4, #dcfce7)"
          icon="✅"
          onClick={() => handleStatCardClick('published')}
        />
        <StatCard
          title="Pending"
          value={pending || 0}
          color="linear-gradient(135deg, #f0f9ff, #dbeafe)"
          icon="⏳"
          onClick={() => handleStatCardClick('pending')}
        />
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Enhanced Recent Activity */}
        <div style={styles.activitySection}>
          <RecentActivity
            posts={recentPosts}
            loading={loading}
            onPostClick={handlePostClick}
          />
        </div>

        {/* Sidebar with Lazy-loaded Components */}
        <div style={styles.sidebar}>
          <Suspense fallback={<ChartSkeleton />}>
            <AnalyticsChart />
          </Suspense>

          <Suspense fallback={<NotificationsSkeleton />}>
            <NotificationsPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    color: '#111827',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
    marginBottom: '2rem',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  activitySection: {
    minHeight: '400px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
};

const headerStyles = {
  container: {
    marginBottom: '2rem',
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    color: '#1f2937',
  },
  subtitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '1rem',
  },
};

const statStyles = {
  card: {
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  clickable: {
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '1.5rem',
  },
  value: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  trendIndicator: {
    opacity: 0.7,
  },
  trendText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  skeleton: {
    animation: 'pulse 2s infinite',
  },
  skeletonTitle: {
    width: '60%',
    height: '14px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '4px',
    marginBottom: '12px',
  },
  skeletonValue: {
    width: '40%',
    height: '32px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '4px',
  },
};

const activityStyles = {
  container: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f3f4f6',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  item: {
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: '#fafafa',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  itemTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: 1.4,
    flex: 1,
    marginRight: '1rem',
  },
  statusBadge: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '12px',
    fontWeight: '500',
    flexShrink: 0,
  },
  itemMeta: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  publishDate: {
    fontSize: '0.875rem',
    color: '#10b981',
    fontWeight: '500',
  },
  itemArrow: {
    fontSize: '1.2rem',
    color: '#9ca3af',
    marginLeft: '1rem',
    transition: 'transform 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: '500',
    margin: '0 0 0.5rem 0',
    color: '#374151',
  },
  emptySubtext: {
    fontSize: '0.875rem',
    margin: 0,
    color: '#9ca3af',
  },
  skeletonItem: {
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #f3f4f6',
    backgroundColor: '#fafafa',
    animation: 'pulse 2s infinite',
  },
  skeletonTitle: {
    width: '70%',
    height: '16px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  skeletonMeta: {
    width: '40%',
    height: '12px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
  },
};

const analyticsStyles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f3f4f6',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 1rem 0',
  },
  chart: {
    display: 'flex',
    alignItems: 'end',
    gap: '0.75rem',
    height: '120px',
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
  },
  barValue: {
    fontSize: '0.75rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    color: '#374151',
  },
};

const notificationsStyles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f3f4f6',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 1rem 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f3f4f6',
  },
  icon: {
    fontSize: '1.125rem',
  },
  message: {
    fontSize: '0.875rem',
    color: '#374151',
    margin: '0 0 0.25rem 0',
  },
  time: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
};

const skeletonStyles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f3f4f6',
  },
  title: {
    width: '60%',
    height: '20px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    marginBottom: '1rem',
    animation: 'pulse 2s infinite',
  },
  chart: {
    display: 'flex',
    alignItems: 'end',
    gap: '0.5rem',
    height: '100px',
  },
  bar: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    height: '60%',
    animation: 'pulse 2s infinite',
  },
  notifications: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  notification: {
    width: '100%',
    height: '40px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    animation: 'pulse 2s infinite',
  },
};

const errorStyles = {
  container: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#fef2f2',
    borderRadius: '16px',
    border: '1px solid #fecaca',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#dc2626',
    margin: '0 0 1rem 0',
  },
  message: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0 0 2rem 0',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};