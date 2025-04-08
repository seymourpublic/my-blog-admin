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
  // We'll store filter criteria in this state object
  const [filter, setFilter] = useState({});

  // Query the filtered posts
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { filter }
  });

  // Whenever filter state changes, we refetch with the new filter
  useEffect(() => {
    refetch({ filter });
  }, [filter, refetch]);

  // For selecting posts (bulk actions)
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

  if (loading) return <Layout><p>Loading posts...</p></Layout>;
  if (error) return <Layout><p>Error loading posts.</p></Layout>;

  return (
    <Layout>
      <h1>Posts Management</h1>
      <Link href="/posts/new"><button>Create New Post</button></Link>

      {/* Pass a function to FilterBar that updates our filter state */}
      <FilterBar onFilter={(filters) => setFilter(filters)} />

      <PostsTable
        posts={data.filteredPosts}
        selectedPosts={selectedPosts}
        onBulkActionChange={handleBulkSelectChange}
        toggleSelectPost={toggleSelectPost}
      />

      {selectedPosts.length > 0 && (
        <div>
          <p>{selectedPosts.length} posts selected</p>
          <button onClick={() => { /* Implement bulk delete */ }}>
            Delete Selected
          </button>
          <button onClick={() => { /* Implement bulk update */ }}>
            Update Selected
          </button>
        </div>
      )}
    </Layout>
  );
}
