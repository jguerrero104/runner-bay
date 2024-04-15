import React from 'react';
import './LostAndFoundCard.css'; // Import the CSS file

const LostAndFoundCard = ({ lostAndFound }) => {
    const { itemName, description, location, image_url, reportDate } = lostAndFound;
    const formattedImageUrl = image_url.replace(/\\/g, '/');

    return (
        <div className="col-md-4 mb-4">
            <div className="card lostAndFound-card">
                <img src={`http://localhost:3001/uploads/${formattedImageUrl}`} alt={itemName} />
                <div className="card-body">
                    <h5 className="card-title">{itemName}</h5>
                    <p className="card-text">{description}</p>
                    <p className="card-text"><strong>Location:</strong> {location}</p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Reported on: {new Date(reportDate).toLocaleDateString()}</small>
                </div>
            </div>
        </div>
    );
};
export default LostAndFoundCard;
