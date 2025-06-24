// pages/_app.js
import React, { Suspense } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from 'react-error-boundary';
import Head from 'next/head';
import PropTypes from 'prop-types';
import client from '../apollo-client';
import '../styles/globals.css';

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={errorStyles.container}>
      <div style={errorStyles.content}>
        <h2 style={errorStyles.title}>Something went wrong</h2>
        <p style={errorStyles.message}>{error.message}</p>
        <button onClick={resetErrorBoundary} style={errorStyles.button}>
          Try again
        </button>
      </div>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

// Loading Fallback Component
function AppLoadingFallback() {
  return (
    <div style={loadingStyles.container}>
      <div style={loadingStyles.spinner} />
      <p style={loadingStyles.text}>Loading VersaBlog Admin...</p>
    </div>
  );
}

// Main App Component
export default function MyApp({ Component, pageProps }) {
  const handleError = (error, errorInfo) => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Application Error:', error, errorInfo);
    
    // You can add error reporting here
    // reportError(error, errorInfo);
  };

  return (
    <>
      <Head>
        <title>VersaBlog Admin Dashboard</title>
        <meta name="description" content="Manage your VersaBlog content with ease" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
      </Head>

      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={handleError}
        onReset={() => {
          // Reset app state if needed
          window.location.reload();
        }}
      >
        <ApolloProvider client={client}>
          <Suspense fallback={<AppLoadingFallback />}>
            <Component {...pageProps} />
          </Suspense>
        </ApolloProvider>
      </ErrorBoundary>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

const errorStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f9fafb',
  },
  content: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    maxWidth: '500px',
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
    lineHeight: 1.5,
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

const loadingStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
};