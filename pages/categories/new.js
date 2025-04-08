// pages/categories/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, gql } from '@apollo/client';
import Layout from '../../components/Layout';

// Query to fetch all available categories for the dropdown
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

// Mutation for creating a new category
const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $slug: String!, $description: String, $parentId: ID) {
    createCategory(name: $name, slug: $slug, description: $description, parentId: $parentId) {
      id
      name
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

export default function NewCategory() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  // Default value for parent category: 'none' means no parent category selected.
  const [parentId, setParentId] = useState('none');

  // Fetch existing categories for the parent dropdown
  const { loading: loadingCats, error: errorCats, data: dataCats } = useQuery(GET_CATEGORIES);

  const [createCategory, { loading, error }] = useMutation(CREATE_CATEGORY);

  // Auto-generate slug as soon as the user enters the name.
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory({
        variables: {
          name,
          slug,
          description,
          parentId: parentId === 'none' ? null : parentId,
        },
      });
      router.push('/categories');
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  if (loadingCats)
    return (
      <Layout>
        <p style={styles.loadingText}>Loading categories...</p>
      </Layout>
    );
  if (errorCats)
    return (
      <Layout>
        <p style={styles.errorText}>Error loading categories.</p>
      </Layout>
    );

  return (
    <Layout>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create New Category</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={handleNameChange}
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
            <label style={styles.label}>Description:</label>
            <textarea
              placeholder="A brief description of the category"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={styles.textarea}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Parent Category (optional):</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              style={styles.select}
            >
              <option value="none">None</option>
              {dataCats.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" disabled={loading} style={styles.button}>
              Create Category
            </button>
            {error && (
              <p style={styles.errorText}>Error: {error.message}</p>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}

const styles = {
  card: {
    maxWidth: '600px',
    margin: '2rem auto',
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
    resize: 'vertical',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: '1.5rem',
    textAlign: 'right',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    marginTop: '1rem',
    color: 'red',
  },
};
