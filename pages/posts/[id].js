// pages/posts/[id].js
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Layout from '../../components/Layout';

const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      content
      publishedAt
      updatedAt
      categories {
        id
        name
      }
      status
    }
  }
`;

export default function ViewPost() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id, // Skip query if id is not ready
  });

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p>Error loading post.</p>
      </Layout>
    );
  }

  const post = data?.post;

  // New safe check
  if (!post) {
    return (
      <Layout>
        <p>No post found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>View Post</h1>
      <h2>{post.title}</h2>
      <p><strong>Published At:</strong> {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : '-'}</p>
      <p><strong>Status:</strong> {post.status}</p>
      <p><strong>Category:</strong> {post.categories?.[0]?.name || 'None'}</p>
    
      <hr />
      <div>
        <strong>Content:</strong>
        <p>{post.content}</p>
      </div>
    </Layout>
  );
}
