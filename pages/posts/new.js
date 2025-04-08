import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import Layout from '../../components/Layout';

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
  // Optional: track selected categories for the post
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

  // Toggle category selection, if categories are used.
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
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={handleTitleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Slug (auto-generated):</label><br />
          <input
            type="text"
            placeholder="Auto-generated slug"
            value={slug}
            readOnly
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Content:</label><br />
          <textarea
            placeholder="Post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
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
        {/* Optional: Categories selection if posts can be categorized */}
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>Select Categories (optional)</h3>
          {loadingCats ? (
            <p>Loading categories...</p>
          ) : errorCats ? (
            <p>Error loading categories.</p>
          ) : (
            dataCats.categories.map((cat) => (
              <div key={cat.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                  />
                  {cat.name}
                </label>
              </div>
            ))
          )}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={loading}>
            Create Post
          </button>
          {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        </div>
      </form>
    </Layout>
  );
}
