// components/CategoryTree.js
export default function CategoryTree({ categories }) {
    const renderTree = (categories, level = 0) => {
      return (
        <ul style={{ paddingLeft: level * 20 }}>
          {categories.map((category) => (
            <li key={category.id}>
              <span>{category.name}</span>
              {category.subcategories && category.subcategories.length > 0 &&
                renderTree(category.subcategories, level + 1)}
            </li>
          ))}
        </ul>
      );
    };
  
    const topLevelCategories = categories.filter((cat) => !cat.parent);
  
    return (
      <div>
        <h2>Category Hierarchy</h2>
        {renderTree(topLevelCategories)}
      </div>
    );
  }
  