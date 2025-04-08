// components/PostsTable.js
import Link from 'next/link';

export default function PostsTable({ posts, onBulkActionChange, selectedPosts, toggleSelectPost }) {
  return (
    <table border="1" cellPadding="5" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              onChange={(e) => onBulkActionChange(e.target.checked)}
            />
          </th>
          <th>Title</th>
          <th>Publication Date</th>
          <th>Category</th>
          <th>Status</th>
          <th>Tags</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedPosts.includes(post.id)}
                onChange={() => toggleSelectPost(post.id)}
              />
            </td>
            <td>{post.title}</td>
            <td>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}</td>
            <td>{post.categories && post.categories.map((c) => c.name).join(', ')}</td>
            <td>{post.status}</td>
            <td>{post.tags && post.tags.map((t) => t.name).join(', ')}</td>
            <td>
              <Link href={`/posts/${post.id}`}><button>Edit</button></Link>
              <button onClick={() => { /* Implement delete action */ }}>Delete</button>
              <button onClick={() => { /* Implement view action */ }}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
