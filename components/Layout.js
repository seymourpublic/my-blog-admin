// components/Layout.js
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <header style={{ padding: '1rem', background: '#f8f8f8' }}>
        <nav>
          <Link href="/">Dashboard</Link> |{' '}
          <Link href="/posts">Posts</Link> |{' '}
          <Link href="/categories">Categories & Tags</Link>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
      <footer style={{ padding: '1rem', background: '#f8f8f8', textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} VersaBlog Admin
      </footer>
    </div>
  );
}
