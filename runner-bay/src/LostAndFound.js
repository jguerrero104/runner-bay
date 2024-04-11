import React, { useState, useEffect } from 'react';
import LostAndFoundCard from './LostAndFoundCard';
import { Link } from 'react-router-dom';

const LostAndFound = () => {
    const [lostAndFounds, setLostAndFounds] = useState([]);

    useEffect(() => {
        // Fetch lostAndFounds from the backend
        const fetchLostAndFounds = async () => {
            try {
                const response = await fetch('http://localhost:3001/lostAndFounds'); // Adjust the URL to match your backend endpoint
                const data = await response.json();
                setLostAndFounds(data);
            } catch (error) {
                console.error('Error fetching lostAndFounds:', error);
            }
        };

        fetchLostAndFounds();
    }, []);

    return (
      <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center">
              <h1>Lost And Found</h1>
              <Link to="/create-lostAndFound" className="btn btn-primary">Add Lost Item</Link>
          </div>
          <div className="row">
              {lostAndFounds.map(lostAndFound => (
                  <LostAndFoundCard key={lostAndFound.lostAndFoundId} lostAndFound={lostAndFound} />
              ))}
          </div>
      </div>
  );
};
export default LostAndFound;