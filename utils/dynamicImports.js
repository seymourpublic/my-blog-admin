// utils/dynamicImports.js
import React from 'react';

// Simple dynamic import wrapper
export const loadComponent = async (importFn) => {
  try {
    const component = await importFn();
    return component.default || component;
  } catch (error) {
    console.error('Failed to load component:', error);
    throw error;
  }
};

// Create a lazy component with error boundary
export const createLazyComponent = (importFn, fallback = <div>Loading...</div>) => {
  const LazyComponent = React.lazy(importFn);
  
  return function WrappedLazyComponent(props) {
    return (
      <React.Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
};

// Preload a component (useful for user interactions)
export const preloadComponent = (importFn) => {
  return importFn().catch(error => {
    console.warn('Failed to preload component:', error);
  });
};
