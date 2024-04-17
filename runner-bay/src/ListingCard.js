import React from 'react';
import './ListingCard.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
    const { title, location, postDate, image_url, price, listingId } = listing; // Include location and ensure to destruct listingId for use
    const formattedImageUrl = image_url.replace(/\\/g, '/');

    return (
        <div className="col-md-4 mb-4">
            <Link to={`/listings/${listingId}`} className="text-decoration-none">  
                <div className="card listing-card">
                    <img src={`http://localhost:3001/uploads/${formattedImageUrl}`} alt={title} />
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text"><strong>Location:</strong> {location}</p>  
                        <p className="card-text"><strong>Price:</strong> ${price}</p>
                    </div>
                    <div className="card-footer">
                        <small className="text-muted">Posted on: {new Date(postDate).toLocaleDateString()}</small>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ListingCard;
