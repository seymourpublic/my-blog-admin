export const QuickActions = ({ actions = [] }) => {
  const defaultActions = [
    {
      title: 'Create New Post',
      href: '/posts/new',
      icon: '✍️',
      description: 'Start writing a new blog post',
      primary: true,
    },
    {
      title: 'Manage Categories',
      href: '/categories',
      icon: '📁',
      description: 'Organize your content',
      primary: false,
    },
    {
      title: 'View Analytics',
      href: '/analytics',
      icon: '📊',
      description: 'Check your blog performance',
      primary: false,
    },
  ];

  const actionList = actions.length > 0 ? actions : defaultActions;

  return (
    <div style={quickStyles.container}>
      <h2 style={quickStyles.title}>Quick Actions</h2>
      <div style={quickStyles.grid}>
        {actionList.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ title, href, icon, description, primary = false }) => {
  return (
    <a
      href={href}
      style={{
        ...quickStyles.card,
        ...(primary ? quickStyles.primaryCard : {}),
      }}
      className="quick-action-card"
    >
      <div style={quickStyles.cardIcon}>{icon}</div>
      <div style={quickStyles.cardContent}>
        <h3 style={quickStyles.cardTitle}>{title}</h3>
        {description && (
          <p style={quickStyles.cardDescription}>{description}</p>
        )}
      </div>
    </a>
  );
};

const quickStyles = {
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
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s ease',
    border: '1px solid #e5e7eb',
  },
  primaryCard: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: '1px solid #2563eb',
  },
  cardIcon: {
    fontSize: '1.5rem',
    marginRight: '0.75rem',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    margin: '0 0 0.25rem 0',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  cardDescription: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.8,
    lineHeight: 1.4,
  },
};