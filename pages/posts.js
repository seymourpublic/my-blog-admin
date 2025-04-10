// pages/posts.js
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import PostsTable from '../components/PostsTable';
import Link from 'next/link';

const GET_POSTS = gql`
  query GetPosts($filter: PostFilter) {
    filteredPosts(filter: $filter) {
      id
      title
      publishedAt
      status
      updatedAt
      categories {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export default function PostsPage() {
  // Store filter criteria in this state object
  const [filter, setFilter] = useState({});

  // Query the filtered posts
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { filter }
  });

  // Refetch posts whenever the filter state changes
  useEffect(() => {
    refetch({ filter });
  }, [filter, refetch]);

  // Track selected posts for bulk actions
  const [selectedPosts, setSelectedPosts] = useState([]);

  const toggleSelectPost = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const handleBulkSelectChange = (isSelected) => {
    if (isSelected && data?.filteredPosts) {
      setSelectedPosts(data.filteredPosts.map((post) => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  if (loading)
    return (
      <Layout>
        <p style={styles.loadingText}>Loading posts...</p>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <p style={styles.errorText}>Error loading posts.</p>
      </Layout>
    );

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Posts Management</h1>
        <div style={styles.buttonGroup}>
          <Link href="/posts/new" style={styles.link}>
            <button style={styles.primaryButton}>Create New Post</button>
          </Link>
        </div>
        <div style={styles.card}>
          {/* Pass filter data from the FilterBar to update our filter state */}
          <FilterBar onFilter={(filters) => setFilter(filters)} />
        </div>
        <div style={styles.card}>
          <PostsTable
            posts={data.filteredPosts}
            selectedPosts={selectedPosts}
            onBulkActionChange={handleBulkSelectChange}
            toggleSelectPost={toggleSelectPost}
          />
        </div>
        {selectedPosts.length > 0 && (
          <div style={styles.bulkActions}>
            <p>{selectedPosts.length} posts selected</p>
            <button style={styles.bulkButton}>Delete Selected</button>
            <button style={styles.bulkButton}>Update Selected</button>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "sans-serif",
    color: "#333"
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1.5rem",
    fontWeight: "600"
  },
  buttonGroup: {
    textAlign: "right",
    marginBottom: "1rem"
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer"
  },
  link: {
    textDecoration: "none"
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "2rem"
  },
  bulkActions: {
    textAlign: "center",
    marginTop: "1rem"
  },
  bulkButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#e00",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    margin: "0 0.5rem",
    cursor: "pointer"
  },
  loadingText: {
    textAlign: "center",
    color: "#555"
  },
  errorText: {
    textAlign: "center",
    color: "red"
  }
};
