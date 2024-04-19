import React from 'react';
import './LostAndFoundCard.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const LostAndFoundCard = ({ lostAndFound }) => {
    const { itemName, description, location, image_url, reportDate, itemId} = lostAndFound;
    const formattedImageUrl = image_url.replace(/\\/g, '/');

    return (
        <div className="col-md-4 mb-4">
            <Link to={`/lostAndFounds/${itemId}`} className="lostAndFound-card-link">
            <div className="card lostAndFound-card">
                <img src={`http://localhost:3001/uploads/${formattedImageUrl}`} alt={itemName} />
                <div className="lost-card-body">
                    <h5 className="lost-card-title">{itemName}</h5>
                    <p className="lost-card-text">{description}</p>
                    <p className="lost-card-text"><strong>Location:</strong> {location}</p>
                </div>
                <div className="lost-card-footer">
                    <small className="lost-text-muted">Reported on: {new Date(reportDate).toLocaleDateString()}</small>
                </div>
            </div>
            </Link> 
        </div>
    );
};
export default LostAndFoundCard;
