import React from 'react';
import '../style/SearchPage.css';

const SearchPage = () => {
    return (
        <div className="search-page">
            <h1>Search by Tags</h1>
            <input type="text" className="search-input" placeholder="Enter a tag..." />
            <button className="search-btn">Search</button>
        </div>
    );
};

export default SearchPage;