// src/components/FeaturedClubs.js
import React from 'react';
import '../style/FeaturedClubs.css'; // Styling for the component

const FeaturedClubs = () => {
  const clubs = [
    {
      name: 'Outdoor Rec',
      description: 'Outdoor Rec organizes weekend trips, rents gear, and supports adventures for the PLU community.',
      imgSrc: '/assets/community.png', 
    },
    {
      name: 'PLU Young Life',
      description: 'Young Life creates community, fun, and explores the Christian faith.',
      imgSrc: '/assets/eco-club.jpg', 
    },
    {
      name: 'Math Club',
      description: 'PLU Math Club is a space to explore and play with a wide variety of mathematical ideas!',
      imgSrc: '/assets/math_club.jpg',
    },
  ];

  return (
    <div className="featured-clubs">
      <h2>Featured Clubs</h2>
      <div className="club-list">
        {clubs.map((club, index) => (
          <div key={index} className="club-card">
            <img src={club.imgSrc} alt={club.name} className="club-img" />
            <div className="club-info">
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <button className="learn-more-btn">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedClubs;
