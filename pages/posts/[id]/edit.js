// pages/posts/[id]/edit.js
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';

// Fetch one post
const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      content
      status
      publishedAt
      categories {
        id
        name
      }
    }
  }
`;

// Suppose we have a general updatePost mutation
const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String, $status: String) {
    updatePost(id: $id, title: $title, content: $content, status: $status) {
      id
      title
      content
      status
      updatedAt
    }
  }
`;

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id
  });

  const [updatePost, { loading: updating, error: updateError }] = useMutation(UPDATE_POST);

  // Local state for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    if (data && data.post) {
      setTitle(data.post.title);
      setContent(data.post.content);
      setStatus(data.post.status);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost({
        variables: {
          id,
          title,
          content,
          status
        }
      });
      // After successful update, redirect or show success message
      router.push('/posts');
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  if (loading) return <Layout><p>Loading post data...</p></Layout>;
  if (error) return <Layout><p>Error loading post.</p></Layout>;

  return (
    <Layout>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Content:</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Status:</label><br />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <br />
        <button type="submit" disabled={updating}>Update Post</button>
        {updateError && <p style={{ color: 'red' }}>Error: {updateError.message}</p>}
      </form>
    </Layout>
  );
}
