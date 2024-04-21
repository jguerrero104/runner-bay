import React from 'react';
import './ListingCard.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
    const { title, location, postDate, image_url, price, status, listingId } = listing;
    const formattedImageUrl = image_url.replace(/\\/g, '/');

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return 'text-warning'; // Bootstrap class for yellow text
            case 'sold':
                return 'text-danger'; // Bootstrap class for red text
            default:
                return 'text-success'; // Bootstrap class for green text
        }
    };

    return (
        <div className="col-md-4 mb-4">
            <Link to={`/listings/${listingId}`} className="text-decoration-none">  
                <div className="card listing-card">
                    <img src={`http://localhost:3001/uploads/${formattedImageUrl}`} alt={title} className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text"><strong>Location:</strong> {location}</p>
                        <p className="card-text"><strong>Price:</strong> ${price}</p>
                        <p className={`card-text ${getStatusStyle(status)}`}><strong>Status:</strong> {status}</p>
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
