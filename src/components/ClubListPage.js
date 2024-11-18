import React from 'react';
import './style/ClubListPage.css';

const ClubListPage = () => {
    const sampleClubs = ["Drama Club", "Chess Club", "Coding Club", "Photography Club"];

    return (
        <div className="club-list-page">
            <h1>List of Clubs</h1>
            <ul className="club-list">
                {sampleClubs.map((club, index) => (
                    <li key={index}>{club}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClubListPage;