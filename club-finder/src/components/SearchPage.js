import React, { useState, useEffect } from "react";
import '../style/SearchPage.css';

function SearchPage() {
  const [tags, setTags] = useState([]); // Store selected tags
  const [clubs, setClubs] = useState([]); // Store fetched clubs
  const [error, setError] = useState(null); // Store error message
  const [loading, setLoading] = useState(false); // Handle loading state
  const [isSearchClicked, setIsSearchClicked] = useState(false); // To track if search was clicked

  const availableTags = [
    "Academic", "Athletic","AthleticNonSerious","AthleticSerious", "Civic Engagement", "Creative Interest", "Dance", "Gaming", "General Interest", "Health", "Music", "Non-Performance", "Non-STEM", "Performance", 
    "Recreational", "Religious", "STEM", "Theatre"
  ];

  // Function to fetch clubs based on selected tags
  const fetchClubs = async () => {
    if (tags.length === 0) {
      setClubs([]); // Clear clubs list when no tag is selected
      setIsSearchClicked(false); // Reset search clicked state
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
      setIsSearchClicked(true); // Mark that the search button was clicked
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle tag selection changes
  const handleTagChange = (event) => {
    const selectedTag = event.target.value;

    setTags((prevTags) => {
      const newTags = prevTags.includes(selectedTag)
        ? prevTags.filter(tag => tag !== selectedTag) // Remove tag if unchecked
        : [...prevTags, selectedTag]; // Add tag if checked

      return newTags;
    });
  };

  // Run fetchClubs whenever tags change
  useEffect(() => {
    fetchClubs(); // Call fetchClubs when tags are updated
  }, [tags]); // Dependency array ensures this runs when the tags array changes

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
      return <div style={{ color: "red" }}>{error}</div>;
    }

    if (clubs.length === 0 && isSearchClicked) {
      return <div>No clubs found with the selected tags.</div>;
    }

    return (
      <div className="clubs-list">
        {clubs.map((club) => (
          <div key={club.ClubID} className="club-item">
            <h3>{club.ClubName}</h3>
            <p>{club.Description || "No description available."}</p>
            <p><strong>Club President:</strong> {club.ClubPresident}</p>
            <p><strong>Contact:</strong> <a href={`mailto:${club.PresidentEmail}`}>{club.PresidentEmail}</a></p>
            <p><strong>Website:</strong> <a href={club.Website} target="_blank" rel="noopener noreferrer">{club.Website}</a></p>
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
      </div>

      <div className="clubs-list-container">
        {tags.length === 0 && !isSearchClicked ? (
          <div style={{ color: 'gray' }}>Please select a tag to get started.</div>
        ) : (
          renderClubs()
        )}
      </div>
    </div>
  );
}

export default SearchPage;
