// components/ui/LoadingComponents.js
import React from 'react';
import PropTypes from 'prop-types';

// Skeleton Loader Component
export const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = '4px' }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: '#f0f0f0',
      borderRadius,
      position: 'relative',
      overflow: 'hidden',
      animation: 'skeleton-loading 1.5s infinite ease-in-out',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        animation: 'skeleton-shine 1.5s infinite ease-in-out',
      }}
    />
  </div>
);

SkeletonLoader.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
};

// Card Skeleton
export const CardSkeleton = ({ showImage = false }) => (
  <div style={styles.cardSkeleton}>
    {showImage && (
      <SkeletonLoader width="100%" height="120px" borderRadius="8px 8px 0 0" />
    )}
    <div style={styles.cardContent}>
      <SkeletonLoader width="70%" height="24px" />
      <div style={{ marginTop: '8px' }}>
        <SkeletonLoader width="100%" height="16px" />
        <SkeletonLoader width="85%" height="16px" />
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <SkeletonLoader width="60px" height="12px" />
        <SkeletonLoader width="80px" height="12px" />
      </div>
    </div>
  </div>
);

CardSkeleton.propTypes = {
  showImage: PropTypes.bool,
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr style={styles.tableRow}>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} style={styles.tableCell}>
        <SkeletonLoader width="80%" height="16px" />
      </td>
    ))}
  </tr>
);

TableRowSkeleton.propTypes = {
  columns: PropTypes.number,
};

// Spinner Component
export const Spinner = ({ size = 24, color = '#0070f3' }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `2px solid #f3f3f3`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      display: 'inline-block',
    }}
  />
);

Spinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

// Loading State Wrapper
export const LoadingWrapper = ({ 
  loading, 
  error, 
  children, 
  loadingComponent = null,
  errorComponent = null,
  retryFunction = null 
}) => {
  if (loading) {
    return loadingComponent || (
      <div style={styles.loadingContainer}>
        <Spinner size={32} />
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return errorComponent || (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Something went wrong</p>
        <p style={styles.errorDetails}>{error.message}</p>
        {retryFunction && (
          <button onClick={retryFunction} style={styles.retryButton}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  return children;
};

LoadingWrapper.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  children: PropTypes.node.isRequired,
  loadingComponent: PropTypes.node,
  errorComponent: PropTypes.node,
  retryFunction: PropTypes.func,
};

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = () => (
  <div style={styles.statsGrid}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} style={styles.statCard}>
        <SkeletonLoader width="60%" height="16px" />
        <div style={{ marginTop: '8px' }}>
          <SkeletonLoader width="40%" height="24px" />
        </div>
      </div>
    ))}
  </div>
);

const styles = {
  cardSkeleton: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  cardContent: {
    padding: '16px',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
  },
  tableCell: {
    padding: '12px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '200px',
  },
  loadingText: {
    marginTop: '12px',
    color: '#666',
    fontSize: '14px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '200px',
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0 0 8px 0',
  },
  errorDetails: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 16px 0',
  },
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};

// CSS-in-JS keyframes (you can also add these to your global CSS)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skeleton-loading {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    @keyframes skeleton-shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}