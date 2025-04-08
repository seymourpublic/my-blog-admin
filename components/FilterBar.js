// components/FilterBar.js
import { useState } from 'react';

export default function FilterBar({ onFilter }) {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('');

  const handleFilter = () => {
    onFilter({ searchText, status, dateFrom, dateTo, category });
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
      <input
        type="date"
        placeholder="From date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
      />
      <input
        type="date"
        placeholder="To date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category ID"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
}
