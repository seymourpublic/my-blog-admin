// apollo-client.js
// This file sets up the Apollo Client for GraphQL queries and mutations.
// It uses the Apollo Client library to create a client instance with a specified URI and cache.
// The client instance is exported for use in other parts of the application.
// Import necessary modules from Apollo Client library

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql/v1',
});

const authLink = setContext((_, { headers }) => {
//auth
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
