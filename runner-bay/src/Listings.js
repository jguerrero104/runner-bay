import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { Link } from 'react-router-dom';

const Listings = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        // Fetch listings from the backend
        const fetchListings = async () => {
            try {
                const response = await fetch('http://localhost:3001/listings'); // Adjust the URL to match your backend endpoint
                const data = await response.json();
                setListings(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchListings();
    }, []);

    return (
      <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center">
              <h1>Listings</h1>
              <Link to="/create-listing" className="btn btn-primary">Add Listing</Link>
          </div>
          <div className="row">
              {listings.map(listing => (
                  <ListingCard key={listing.listingId} listing={listing} />
              ))}
          </div>
      </div>
  );
};

export default Listings;
