// pages/index.js
import Layout from '../components/Layout';
import DashboardOverview from '../components/DashboardOverview';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard Home</h1>
        <DashboardOverview />
        <div style={styles.quickActions}>
          <h2 style={styles.quickActionsTitle}>Quick Actions</h2>
          <div style={styles.buttonGroup}>
            <Link href="/posts/new" style={styles.link}>
              <button style={styles.button}>Create New Post</button>
            </Link>
            <Link href="/categories/new" style={styles.link}>
              <button style={styles.button}>Create New Category</button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "sans-serif",
    color: "#333",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "600",
    marginBottom: "2rem",
  },
  quickActions: {
    marginTop: "2rem",
    padding: "2rem",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  quickActionsTitle: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
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
  link: {
    textDecoration: "none",
  },
};
