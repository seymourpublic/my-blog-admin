// components/CategoryTree.js
export default function CategoryTree({ categories }) {
    // Recursive function to render the category tree.
    const renderTree = (categories, level = 0) => {
      return (
        <ul style={{ ...styles.list, paddingLeft: level * 20 }}>
          {categories.map((category) => (
            <li key={category.id} style={styles.listItem}>
              <span style={styles.categoryName}>{category.name}</span>
              {category.subcategories &&
                category.subcategories.length > 0 &&
                renderTree(category.subcategories, level + 1)}
            </li>
          ))}
        </ul>
      );
    };
  
    const topLevelCategories = categories.filter((cat) => !cat.parent);
  
    return (
      <div style={styles.card}>
        <h2 style={styles.heading}>Category Hierarchy</h2>
        {topLevelCategories.length > 0 ? (
          renderTree(topLevelCategories)
        ) : (
          <p style={styles.noData}>No categories available.</p>
        )}
      </div>
    );
  }
  
  const styles = {
    card: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "1.5rem",
      maxWidth: "600px",
      margin: "1rem auto",
      fontFamily: "sans-serif",
      color: "#333",
    },
    heading: {
      marginBottom: "1rem",
      fontSize: "1.5rem",
      fontWeight: "600",
      textAlign: "center",
    },
    list: {
      listStyleType: "none",
      margin: 0,
      padding: 0,
    },
    listItem: {
      marginBottom: "1rem",
      padding: "0.5rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "4px",
      border: "1px solid #ececec",
    },
    categoryName: {
      fontSize: "1rem",
      fontWeight: "500",
    },
    noData: {
      textAlign: "center",
      color: "#999",
      fontStyle: "italic",
    },
  };
  