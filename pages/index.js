// pages/index.js
import Layout from '../components/Layout';
import DashboardOverview from '../components/DashboardOverview';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <Layout>
      <h1>Dashboard Home</h1>
      <DashboardOverview />
      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <div>
          <Link href="/posts/new">
            <button>Create New Post</button>
          </Link>
          <Link href="/categories/new">
            <button>Create New Category</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
