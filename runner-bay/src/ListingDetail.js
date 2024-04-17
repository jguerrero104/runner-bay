import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ListingDetail.css';

const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const { listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3001/listings/${listingId}`);
        if (!response.ok) {
          throw new Error(`Listing not found: ${response.status}`);
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        setError(`Failed to fetch listing: ${error.message}`);
        console.error('Error fetching listing detail:', error);
      }
    };

    fetchListing();
  }, [listingId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listing) {
    return <div>Loading...</div>;
  }

  // Render your listing details here
  return (
    <div className="container my-5">
        <div className="card listing-detail-container">
            <img src={`http://localhost:3001/uploads/${listing.image_url.replace(/\\/g, '/')}`} alt={listing.title} className="card-img-top listing-detail-image" />
            <div className="card-body">
                <h1 className="card-title listing-detail-title">{listing.title}</h1>
                <p className="card-text listing-detail-price">${listing.price}</p>
                <p className="card-text listing-detail-info"><strong>Location:</strong> {listing.location}</p>
                <p className="card-text listing-detail-description">{listing.description}</p>
                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-info">Contact Seller</button>
                    <button className="btn btn-danger">Report Listing</button>
                    <button className="btn btn-warning">Report User</button>
                </div>
            </div>
            <div className="card-footer listing-detail-footer">
                Posted on: {new Date(listing.postDate).toLocaleDateString()}
            </div>
        </div>
    </div>
);
};

export default ListingDetail;
