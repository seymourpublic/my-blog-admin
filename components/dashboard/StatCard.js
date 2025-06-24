export const StatCard = ({ title, value, color, icon, onClick, loading = false }) => {
  if (loading) {
    return (
      <div style={{ ...statStyles.card, backgroundColor: color }}>
        <div style={statStyles.skeletonTitle} />
        <div style={statStyles.skeletonValue} />
      </div>
    );
  }

  return (
    <div
      style={{
        ...statStyles.card,
        backgroundColor: color,
        ...(onClick ? statStyles.clickable : {}),
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div style={statStyles.cardHeader}>
        <h3 style={statStyles.title}>{title}</h3>
        {icon && <div style={statStyles.icon}>{icon}</div>}
      </div>
      <p style={statStyles.value}>{value}</p>
    </div>
  );
};

const statStyles = {
  card: {
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  clickable: {
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  icon: {
    opacity: 0.7,
    fontSize: '1.2rem',
  },
  value: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 1,
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
