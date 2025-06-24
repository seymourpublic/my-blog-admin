// apollo-client.js
// This file sets up the Apollo Client for GraphQL queries and mutations.
// It uses the Apollo Client library to create a client instance with a specified URI and cache.
// The client instance is exported for use in other parts of the application.
// Import necessary modules from Apollo Client library

// apollo-client.js - Enhanced with error handling
// apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// HTTP Link
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql/v1',
});

// Auth Link (if you need authentication)
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

// Enhanced Cache Configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Cache posts with pagination
        posts: {
          keyArgs: ['filter', 'search'],
          merge(existing = { nodes: [], pageInfo: {} }, incoming) {
            return {
              ...incoming,
              nodes: [...existing.nodes, ...incoming.nodes],
              pageInfo: incoming.pageInfo,
            };
          },
        },
        // Cache categories
        categories: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        // Cache tags
        tags: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        // Cache dashboard summary with short TTL
        postsSummary: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Post: {
      fields: {
        // Handle post image optimization
        featuredImage: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

// Create Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;