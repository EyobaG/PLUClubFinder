import React from 'react';
import '../style/Footer.css'; // Ensure CSS includes grid styling

function Footer() {
  return (
    <div className="footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h3>PLU Club Finder</h3>
          <p>&copy; {new Date().getFullYear()} | All rights reserved.</p>
        </div>
        <div className="footer-section">
          <h3>Contact Information</h3>
          <p><strong>Clubs and Organizations</strong></p>
          <p>Phone: 253-535-7200</p>
          <p>Email: <a href="mailto:engage@plu.edu">engage@plu.edu</a></p>
        </div>
        <div className="footer-section">
          <h3>Office Hours</h3>
          <p>Mon-Fri: 8:00 am - 5:00 pm</p>
          <p>Closed: Daily 12:00-1:00 pm</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
