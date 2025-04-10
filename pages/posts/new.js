// pages/posts/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import Layout from '../../components/Layout';
import ImageUploader from '../../components/ImageUploader';



const handleUploadComplete = (url) => {
  console.log("Uploaded image URL:", url);
  setImageUrl(url);
};

// Query to fetch all available categories (if you want to assign categories to posts)
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

// Mutation for creating a new post. It now accepts a "slug" and an optional "categories" array.
const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!,
    $content: String!,
    $slug: String!,
    $status: String,
    $categories: [ID!]
  ) {
    createPost(
      title: $title,
      content: $content,
      slug: $slug,
      status: $status,
      categories: $categories
    ) {
      id
      title
      slug
      categories {
        id
        name
      }
    }
  }
`;

// Helper function to generate a slug from a given text.
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewPost() {
  const router = useRouter();

  // Form states for the post details.
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  // Optional: track selected categories for the post.
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch all categories to allow assigning them to the post.
  const { loading: loadingCats, error: errorCats, data: dataCats } = useQuery(GET_CATEGORIES);

  const [createPost, { loading, error }] = useMutation(CREATE_POST);

  // Update title and simultaneously auto-generate slug.
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  // Toggle category selection with a checkbox.
  const handleCategoryChange = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        variables: {
          title,
          content,
          slug,
          status,
          categories: selectedCategories.length > 0 ? selectedCategories : null,
        },
      });
      // Redirect back to the posts management page after successful creation.
      router.push('/posts');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <Layout>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create New Post</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={handleTitleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Slug (auto-generated):</label>
            <input
              type="text"
              placeholder="Auto-generated slug"
              value={slug}
              readOnly
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Content:</label>
            <textarea
              placeholder="Post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              style={styles.textarea}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.select}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          {/* Optional: Category Selection */}
          <div style={{ ...styles.formGroup, ...styles.categoryCard }}>
            <h3 style={styles.subHeading}>Select Categories (optional)</h3>
            {loadingCats ? (
              <p style={styles.smallText}>Loading categories...</p>
            ) : errorCats ? (
              <p style={styles.errorText}>Error loading categories.</p>
            ) : (
              dataCats.categories.map((cat) => (
                <div key={cat.id} style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    style={styles.checkbox}
                  />
                  <label style={styles.checkboxLabel}>{cat.name}</label>
                </div>
              ))
            )}
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" disabled={loading} style={styles.button}>
              Create Post
            </button>
            {error && <p style={styles.errorText}>Error: {error.message}</p>}
          </div>
        </form>
      </div>
    </Layout>
  );
}

const styles = {
  card: {
    maxWidth: "700px",
    margin: "2rem auto",
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "600",
    color: "#333",
  },
  formGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#555",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    resize: "vertical",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    backgroundColor: "#fff",
  },
  categoryCard: {
    border: "1px solid #e0e0e0",
    padding: "1rem",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
  subHeading: {
    fontSize: "1.25rem",
    marginBottom: "1rem",
    color: "#333",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  checkbox: {
    marginRight: "0.5rem",
  },
  checkboxLabel: {
    fontSize: "0.95rem",
    color: "#555",
  },
  buttonContainer: {
    textAlign: "right",
    marginTop: "1.5rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginTop: "1rem",
    textAlign: "center",
  },
  smallText: {
    fontSize: "0.9rem",
    color: "#777",
  },
};
