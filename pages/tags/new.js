// pages/tags/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import Layout from '../../components/Layout';

// Define the GraphQL mutation to create a tag.
// This mutation expects a tag name and returns the new tag's id and name.
const CREATE_TAG = gql`
  mutation CreateTag($name: String!) {
    createTag(name: $name) {
      id
      name
    }
  }
`;

export default function NewTag() {
  const router = useRouter();
  const [name, setName] = useState('');
  
  const [createTag, { loading, error }] = useMutation(CREATE_TAG);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTag({
        variables: { name }
      });
      // Redirect to the categories & tags management page after creation.
      router.push('/categories');
    } catch (err) {
      console.error('Error creating tag:', err);
    }
  };

  return (
    <Layout>
      <h1>Create New Tag</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input 
            type="text" 
            placeholder="Tag name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={loading}>
            Create Tag
          </button>
          {error && (
            <p style={{ color: 'red' }}>Error: {error.message}</p>
          )}
        </div>
      </form>
    </Layout>
  );
}
