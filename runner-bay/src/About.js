import React from 'react';
import './About.css'; // Make sure to import the CSS file

function About() {
  return (
    <div className="about-container">
      <div className="about-content"> {/* This div wraps the content with padding and background */}
        <img src="/logo.png" alt="RunnerBay Logo" className="about-logo" />
        <h1>About RunnerBay</h1>
        <p>
          RunnerBay is a platform for UTSA students to buy and sell items and stay updated on the latest news and events on campus.
          It provides a platform for students to connect with each other and share information about events and items for sale.
        </p>
        <div className="team-credits">
          <h2>Team Credits</h2>
          <ul>
            <li>Jose Guerrero</li>
            <li>Julian A Legere</li>
            <li>Jesus Alberto Pinales</li>
            <li>Bianca L Perez</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
