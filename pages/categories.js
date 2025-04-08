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
    return <Layout><p>Loading categories and tags...</p></Layout>;
  if (errorCats || errorTags)
    return <Layout><p>Error loading categories or tags.</p></Layout>;

  return (
    <Layout>
      <h1>Category & Tag Management</h1>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/categories/new"><button>Create New Category</button></Link>
      </div>
      <CategoryTree categories={dataCats.categories} />
      <hr />
      <h2>Tags</h2>
      <TagList tags={dataTags.tags} />
      <div>
        <Link href="/tags/new"><button>Create New Tag</button></Link>
      </div>
    </Layout>
  );
}
