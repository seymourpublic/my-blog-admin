// pages/tags/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import Layout from '../../components/Layout';

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
      <div style={styles.card}>
        <h1 style={styles.heading}>Create New Tag</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              placeholder="Tag name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" disabled={loading} style={styles.button}>
              Create Tag
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
    maxWidth: '500px',
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
  errorText: {
    textAlign: 'center',
    marginTop: '1rem',
    color: 'red',
  },
};
