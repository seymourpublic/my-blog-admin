// components/DashboardOverview.js
import { useQuery, gql } from '@apollo/client';

const GET_SUMMARY = gql`
  query GetSummary {
    postsSummary {
      totalPosts
      drafts
      published
      pending
    }
    recentPosts {
      id
      title
      publishedAt
    }
  }
`;

export default function DashboardOverview() {
  const { loading, error, data } = useQuery(GET_SUMMARY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard data.</p>;

  const { totalPosts, drafts, published, pending } = data.postsSummary;
  const recentPosts = data.recentPosts;

  return (
    <div>
      <h2>Overview</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h3>Total Posts</h3>
          <p>{totalPosts}</p>
        </div>
        <div>
          <h3>Drafts</h3>
          <p>{drafts}</p>
        </div>
        <div>
          <h3>Published</h3>
          <p>{published}</p>
        </div>
        <div>
          <h3>Pending Reviews</h3>
          <p>{pending}</p>
        </div>
      </div>
      <h3>Recent Activity</h3>
      <ul>
        {recentPosts.map((post) => (
          <li key={post.id}>
            {post.title} – {new Date(post.publishedAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
