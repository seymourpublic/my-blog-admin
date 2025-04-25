import { useState } from 'react';

export default function CategoryTree({ categories }) {
  // State to track expanded categories
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Recursive function to render the category tree
  const renderTree = (categories, level = 0) => {
    if (!categories || categories.length === 0) return null;
    
    return (
      <ul className={`pl-${level * 4} list-none m-0 p-0`}>
        {categories.map((category) => {
          const hasSubcategories = category.subcategories?.length > 0;
          const isExpanded = expandedCategories[category.id];
          
          return (
            <li key={category.id} className="mb-2 relative">
              <div className="p-3 bg-gray-50 rounded flex items-center justify-between border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                <span className="font-medium text-gray-800">{category.name}</span>
                
                {hasSubcategories && (
                  <button 
                    onClick={() => toggleCategory(category.id)}
                    className="ml-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded flex items-center transition-colors duration-200"
                  >
                    {isExpanded ? 
                      <span className="flex items-center">Hide <ChevronUp className="ml-1 w-3 h-3" /></span> : 
                      <span className="flex items-center">Show <ChevronDown className="ml-1 w-3 h-3" /></span>
                    }
                  </button>
                )}
              </div>
              
              {hasSubcategories && isExpanded && renderTree(category.subcategories, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  // Filter top-level categories
  const topLevelCategories = categories?.filter((cat) => !cat.parent) || [];
  const hasCategories = topLevelCategories.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto my-4 font-sans text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Category Hierarchy</h2>
        {hasCategories && (
          <button 
            onClick={() => {
              // Get all category IDs
              const allCategoryIds = {};
              const collectIds = (cats) => {
                cats.forEach(cat => {
                  allCategoryIds[cat.id] = false;
                  if (cat.subcategories?.length) collectIds(cat.subcategories);
                });
              };
              collectIds(categories);
              
              // Toggle: if any are expanded, collapse all; otherwise expand all
              const anyExpanded = Object.values(expandedCategories).some(Boolean);
              setExpandedCategories(anyExpanded ? {} : allCategoryIds);
            }}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors duration-200"
          >
            {Object.values(expandedCategories).some(Boolean) ? 'Collapse All' : 'Expand All'}
          </button>
        )}
      </div>
      
      {hasCategories ? (
        <div className="overflow-auto max-h-96">
          {renderTree(topLevelCategories)}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic py-8">No categories available.</p>
      )}
    </div>
  );
}

// Simple icon components
const ChevronDown = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);