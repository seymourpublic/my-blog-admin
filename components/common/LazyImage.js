// components/common/LazyImage.js
import React from 'react';
import PropTypes from 'prop-types';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { OptimizedImage } from '../ui/OptimizedImage';

// Lazy loading image component
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '/images/placeholder.jpg',
  className,
  style,
  ...props 
}) => {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <div ref={targetRef} className={className} style={style}>
      {hasIntersected ? (
        <OptimizedImage
          src={src}
          alt={alt}
          {...props}
        />
      ) : (
        <img
          src={placeholder}
          alt={alt}
          style={{
            width: '100%',
            height: 'auto',
            filter: 'blur(5px)',
            transition: 'filter 0.3s ease',
          }}
        />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};