import React from 'react';
import './ListingCard.css'; // Import the CSS file

const ListingCard = ({ listing }) => {
    const { title, description, postDate, image_url, price } = listing;
    const formattedImageUrl = image_url.replace(/\\/g, '/');

    return (
        <div className="col-md-4 mb-4">
            <div className="card listing-card">
                <img src={`http://localhost:3001/uploads/${formattedImageUrl}`} alt={title} />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <p className="card-text"><strong>Price:</strong> ${price}</p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Posted on: {new Date(postDate).toLocaleDateString()}</small>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
