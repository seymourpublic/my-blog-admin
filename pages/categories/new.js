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

  // Update both name and auto-generated slug simultaneously
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
          // If 'none' is selected, pass null; otherwise, pass the selected category ID.
          parentId: parentId === 'none' ? null : parentId,
        },
      });
      // Redirect to the categories management page after successful creation.
      router.push('/categories');
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  if (loadingCats) return <Layout><p>Loading categories...</p></Layout>;
  if (errorCats) return <Layout><p>Error loading categories.</p></Layout>;

  return (
    <Layout>
      <h1>Create New Category</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={handleNameChange}
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
          <label>Description:</label><br />
          <textarea
            placeholder="A brief description of the category"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Parent Category (optional):</label><br />
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="none">None</option>
            {dataCats.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={loading}>
            Create Category
          </button>
          {error && (
            <p style={{ color: 'red' }}>Error: {error.message}</p>
          )}
        </div>
      </form>
    </Layout>
  );
}
