import React, { useState, useEffect } from 'react';
import '../style/SearchPage.css';

const SearchPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsResponse = await fetch("http://localhost:5000/api/tags");
        if (!tagsResponse.ok) {
          throw new Error("Error fetching tags data");
        }
        const tagsData = await tagsResponse.json();
        const tagsSet = new Set(tagsData.map(item => item.Tag));

        tagsSet.delete("AthleticSerious");
        tagsSet.delete("AthleticNonSerious");
        tagsSet.delete("NULL");

        setTags([...tagsSet]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      const updatedTags = new Set(prevSelectedTags);
      if (updatedTags.has(tag)) {
        updatedTags.delete(tag); // Deselect tag
      } else {
        updatedTags.add(tag); // Select tag
      }
      return updatedTags;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="search-page">
      <h1>Search by Tags</h1>
      <div className="checkbox-container">
        {tags.map((tag) => (
          <div key={tag}>
            <label>
              <input type="checkbox" checked={selectedTags.has(tag)} onChange={() => handleCheckboxChange(tag)} />
              {tag}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
