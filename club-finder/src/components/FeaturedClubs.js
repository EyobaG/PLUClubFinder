// src/components/FeaturedClubs.js
import React from 'react';
import '../style/FeaturedClubs.css'; // Styling for the component
import communityImage from '../assets/community.png';
import young from '../assets/young.jpg';
import grean from '../assets/grean.png';

const FeaturedClubs = () => {
  const clubs = [
    {
      name: 'Outdoor Rec',
      description: 'Outdoor Rec organizes weekend trips, rents gear, and supports adventures for the PLU community.',
      imgSrc: communityImage, 
      clubLink: 'https://www.plu.edu/recreations/outdoor-rec/'
    },
    {
      name: 'PLU Young Life',
      description: 'Young Life creates community, fun, and explores the Christian faith.',
      imgSrc: young, 
      clubLink: 'http://ylcollegetacoma.younglife.org'
    },
    {
      name: 'GREAN Club',
      description: 'GREAN Club promotes enviornmental awareness and action on campus',
      imgSrc: grean,
      clubLink: 'https://www.instagram.com/plugrean?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
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
              <a href={club.clubLink}><button className="learn-more-btn">Learn More</button></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedClubs;
