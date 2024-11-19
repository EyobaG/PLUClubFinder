import React from 'react';
import '../style/Footer.css'; // Optional: Add CSS for the footer styling

function Footer() {
  return (
    <div className="footer">
      <p>&copy; {new Date().getFullYear()} PLU Club Finder | All rights reserved.</p>
    </div>
  );
}

export default Footer;