// components/common/InfiniteScroll.js
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Spinner } from '../ui/LoadingComponents';

// Infinite scroll component
export const InfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  children,
  threshold = 0.1,
  rootMargin = '100px',
}) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && isIntersecting) {
      onLoadMore();
    }
  }, [hasMore, loading, isIntersecting, onLoadMore]);

  useEffect(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  return (
    <>
      {children}
      {hasMore && (
        <div
          ref={targetRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          {loading && <Spinner size={32} />}
        </div>
      )}
    </>
  );
};

InfiniteScroll.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
};