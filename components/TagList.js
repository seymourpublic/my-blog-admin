// components/TagList.js
export default function TagList({ tags }) {
    return (
      <div>
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>{tag.name}</li>
          ))}
        </ul>
      </div>
    );
  }
  