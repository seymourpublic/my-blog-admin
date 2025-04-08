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
      categories {
        id
        name
      }
      status
      tags {
        id
        name
      }
    }
  }
`;

export default function ViewPost() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id
  });

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (error) return <Layout><p>Error loading post.</p></Layout>;

  const post = data.post;

  return (
    <Layout>
      <h1>View Post</h1>
      <h2>{post.title}</h2>
      <p><strong>Published At:</strong> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}</p>
      <p><strong>Status:</strong> {post.status}</p>
      <p><strong>Category:</strong> {post.categories?.[0]?.name || 'None'}</p>
      <p><strong>Tags:</strong> {post.tags.map(t => t.name).join(', ')}</p>
      <hr />
      <div>
        <strong>Content:</strong>
        <p>{post.content}</p>
      </div>
    </Layout>
  );
}
