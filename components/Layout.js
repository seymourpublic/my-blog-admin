// components/Layout.js
import Link from 'next/link';
import { FaHome, FaListAlt, FaFolder, FaPlus, FaTag } from 'react-icons/fa';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          background: '#2c2c2c',
          color: '#fff',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Logo or Project Title */}
          <div
            style={{
              marginBottom: '2rem',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            VersaBlog
          </div>
          {/* Navigation Links */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <Link
              href="/"
              style={{
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              <FaHome style={{ marginRight: '8px' }} />
              Dashboard
            </Link>
            <Link
              href="/posts"
              style={{
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              <FaListAlt style={{ marginRight: '8px' }} />
              Posts
            </Link>
            <Link
              href="/categories"
              style={{
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              <FaFolder style={{ marginRight: '8px' }} />
              Categories & Tags
            </Link>
            <Link
              href="/posts/new"
              style={{
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              <FaPlus style={{ marginRight: '8px' }} />
              Create New Post
            </Link>
            <Link
              href="/categories/new"
              style={{
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              <FaPlus style={{ marginRight: '8px' }} />
              Create New Category
            </Link>
            <Link
              href="/tags/new"
              style={{
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              <FaTag style={{ marginRight: '8px' }} />
              Create New Tag
            </Link>
          </nav>
        </div>
        {/* Footer or extra info */}
        <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} VersaBlog
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, background: '#f5f5f5', padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}
