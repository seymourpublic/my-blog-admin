export const RecentActivity = ({ posts = [], loading = false, onPostClick }) => {
  if (loading) {
    return (
      <div style={activityStyles.container}>
        <h2 style={activityStyles.title}>Recent Activity</h2>
        <div style={activityStyles.list}>
          {Array.from({ length: 3 }).map((_, index) => (
            <ActivityItemSkeleton key={index} />
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
          <p>No recent posts found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={activityStyles.container}>
      <h2 style={activityStyles.title}>Recent Activity</h2>
      <div style={activityStyles.list}>
        {posts.map((post) => (
          <ActivityItem
            key={post.id}
            post={post}
            onClick={() => onPostClick?.(post)}
          />
        ))}
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ post, onClick }) => {
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

  return (
    <div
      style={{
        ...activityStyles.item,
        ...(onClick ? activityStyles.clickableItem : {}),
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div style={activityStyles.itemContent}>
        <h4 style={activityStyles.itemTitle}>{post.title}</h4>
        <div style={activityStyles.itemMeta}>
          <span style={activityStyles.itemDate}>
            {formatDate(post.updatedAt)}
          </span>
          {post.publishedAt && (
            <span style={activityStyles.itemStatus}>Published</span>
          )}
        </div>
      </div>
      {onClick && (
        <div style={activityStyles.itemArrow}>→</div>
      )}
    </div>
  );
};

// Activity Item Skeleton
const ActivityItemSkeleton = () => (
  <div style={activityStyles.item}>
    <div style={activityStyles.itemContent}>
      <div style={activityStyles.skeletonTitle} />
      <div style={activityStyles.skeletonMeta} />
    </div>
  </div>
);

const activityStyles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px dashed #d1d5db',
  },
  item: {
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clickableItem: {
    cursor: 'pointer',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: 1.4,
  },
  itemMeta: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  itemStatus: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '12px',
    fontWeight: '500',
  },
  itemArrow: {
    fontSize: '1.2rem',
    color: '#9ca3af',
    marginLeft: '1rem',
  },
  skeletonTitle: {
    width: '70%',
    height: '16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  skeletonMeta: {
    width: '40%',
    height: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
  },
};