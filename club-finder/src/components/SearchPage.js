import React, { useState } from 'react';
import '../style/SearchPage.css';

function SearchPage() {
  const [tags, setTags] = useState([]); // To store selected tags
  const [clubs, setClubs] = useState([]); // To store the fetched clubs
  const [error, setError] = useState(null); // To handle errors
  const [loading, setLoading] = useState(false); // To handle loading state

  // Predefined tags list for selection (you can modify this)
  const availableTags = [
    "Athletic", "Art", "Theatre", "Science", "Technology", "Community", "Health", "Business"
  ];

  // Handle changes in selected tags
  const handleTagChange = (event) => {
    const selectedTag = event.target.value;
    setTags((prevTags) =>
      prevTags.includes(selectedTag)
        ? prevTags.filter((tag) => tag !== selectedTag)
        : [...prevTags, selectedTag]
    );
  };

  // Function to fetch clubs based on selected tags
  const fetchClubs = async () => {
    if (tags.length === 0) {
      setError("Please select at least one tag.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/tags-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }), // Send selected tags to the backend
      });

      if (!response.ok) {
        throw new Error("Error fetching clubs.");
      }

      const data = await response.json();
      setClubs(data); // Set clubs based on the response
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render the tags checkboxes
  const renderTags = () => {
    return availableTags.map((tag) => (
      <label key={tag}>
        <input
          type="checkbox"
          value={tag}
          checked={tags.includes(tag)}
          onChange={handleTagChange}
        />
        {tag}
      </label>
    ));
  };

  // Render the clubs list
  const renderClubs = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (clubs.length === 0) {
      return <div>No clubs found with the selected tags.</div>;
    }

    return (
      <div className="clubs-list">
        {clubs.map((club) => (
          <div key={club.ClubID} className="club-item">
            <h3>{club.ClubName}</h3>
            <p>{club.Description || "No description available."}</p>
            <p>
              <strong>Club President:</strong> {club.ClubPresident}
            </p>
            <p>
              <strong>Contact:</strong>{' '}
              <a href={`mailto:${club.PresidentEmail}`}>{club.PresidentEmail}</a>
            </p>
            <p>
              <strong>Website:</strong>{' '}
              <a href={club.Website} target="_blank" rel="noopener noreferrer">
                {club.Website}
              </a>
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-page">
      <h1>Search for Clubs</h1>

      <div className="tags-selection">
        <h3>Select Tags to Filter Clubs</h3>
        {renderTags()}
        <br />
        <button onClick={fetchClubs}>Search</button>
      </div>

      <div className="clubs-list-container">
        {renderClubs()}
      </div>
    </div>
  );
}

export default SearchPage;
