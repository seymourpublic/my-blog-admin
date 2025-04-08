// pages/categories.js
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import CategoryTree from '../components/CategoryTree';
import TagList from '../components/TagList';
import Link from 'next/link';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      parent {
        id
        name
      }
      subcategories {
        id
        name
      }
    }
  }
`;

const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
    }
  }
`;

export default function CategoriesPage() {
  const { loading: loadingCats, error: errorCats, data: dataCats } = useQuery(GET_CATEGORIES);
  const { loading: loadingTags, error: errorTags, data: dataTags } = useQuery(GET_TAGS);

  if (loadingCats || loadingTags)
    return (
      <Layout>
        <p style={styles.loadingText}>Loading categories and tags...</p>
      </Layout>
    );
  if (errorCats || errorTags)
    return (
      <Layout>
        <p style={styles.errorText}>Error loading categories or tags.</p>
      </Layout>
    );

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Category & Tag Management</h1>
        <div style={styles.buttonGroup}>
          <Link href="/categories/new" style={styles.link}>
            <button style={styles.button}>Create New Category</button>
          </Link>
        </div>
        <div style={styles.card}>
          <CategoryTree categories={dataCats.categories} />
        </div>
        
       
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'sans-serif'
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '1rem',
    fontWeight: '600',
    color: '#333'
  },
  subHeading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontWeight: '500',
    color: '#333',
    textAlign: 'center'
  },
  card: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  divider: {
    height: '1px',
    backgroundColor: '#ececec',
    margin: '2rem 0'
  },
  buttonGroup: {
    textAlign: 'right',
    marginBottom: '1rem'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  link: {
    textDecoration: 'none'
  },
  loadingText: {
    textAlign: 'center',
    color: '#555'
  },
  errorText: {
    textAlign: 'center',
    color: 'red'
  }
};
