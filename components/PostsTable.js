// components/PostsTable.js
import Link from 'next/link';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useState } from 'react';

// Mutation to delete a post
const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

// Mutation to update just the post category (or use a general updatePost mutation)
const UPDATE_POST_CATEGORY = gql`
  mutation UpdatePostCategory($postId: ID!, $categoryId: ID!) {
    updatePostCategory(postId: $postId, categoryId: $categoryId) {
      id
      categories {
        id
        name
      }
    }
  }
`;

// Query to fetch all available categories for the dropdown
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

// (Optional) Query to refetch posts after deletion.
// If your parent page uses a different GET_POSTS query, adjust accordingly.
const GET_POSTS = gql`
  query GetPosts($filter: PostFilter) {
    filteredPosts(filter: $filter) {
      id
      title
      publishedAt
      updatedAt
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

export default function PostsTable({
  posts,
  onBulkActionChange,
  selectedPosts,
  toggleSelectPost,
}) {
  const [deletePost] = useMutation(DELETE_POST);
  const [updatePostCategory] = useMutation(UPDATE_POST_CATEGORY);

  // Fetch all categories for the dropdown
  const { loading: loadingCats, error: errorCats, data: dataCats } =
    useQuery(GET_CATEGORIES);

  // Handle deleting a post using refetchQueries to update UI
  const handleDelete = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost({
          variables: { id: postId },
          refetchQueries: [{ query: GET_POSTS }],
          awaitRefetchQueries: true,
        });
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  // Handle changing the post's category
  const handleCategoryChange = async (postId, categoryId) => {
    try {
      await updatePostCategory({ variables: { postId, categoryId } });
      // Optionally refetch or let Apollo cache auto-update
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  if (loadingCats) return <p>Loading categories...</p>;
  if (errorCats) return <p>Error loading categories.</p>;

  const categories = dataCats?.categories || [];

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>
              <input
                type="checkbox"
                onChange={(e) => onBulkActionChange(e.target.checked)}
              />
            </th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Publication Date</th>
            <th style={styles.th}>Category (Editable)</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Tags</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} style={styles.tr}>
              <td style={styles.td}>
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => toggleSelectPost(post.id)}
                />
              </td>
              <td style={styles.td}>{post.title}</td>
              <td style={styles.td}>
                {post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString()
                  : "-"}
              </td>
              <td style={styles.td}>
                <select
                  style={styles.select}
                  value={post.categories?.[0]?.id || ""}
                  onChange={(e) =>
                    handleCategoryChange(post.id, e.target.value)
                  }
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </td>
              <td style={styles.td}>{post.status}</td>
              <td style={styles.td}>
                {post.tags ? post.tags.map((t) => t.name).join(", ") : ""}
              </td>
              <td style={styles.td}>
                <Link href={`/posts/${post.id}`}>
                  <button style={styles.actionButton}>View</button>
                </Link>
                <Link href={`/posts/${post.id}/edit`}>
                  <button style={styles.actionButton}>Edit</button>
                </Link>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Inline Styles */
const styles = {
  tableContainer: {
    overflowX: "auto",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: "2rem",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },
  thead: {
    background: "#f0f0f0",
  },
  th: {
    textAlign: "left",
    padding: "0.75rem",
    fontWeight: "600",
    color: "#333",
  },
  tr: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    marginBottom: "1rem",
  },
  td: {
    padding: "0.75rem",
    verticalAlign: "middle",
    borderBottom: "1px solid #ececec",
  },
  select: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
  },
  actionButton: {
    marginRight: "0.5rem",
    padding: "0.4rem 0.8rem",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  deleteButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#e00",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};
