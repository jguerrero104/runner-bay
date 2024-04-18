import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ListingDetail.css';


const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [liked, setLiked] = useState(null);  // State to track like status
  const [error, setError] = useState(null);
  const { listingId } = useParams();
  console.log("Listing ID from URL:", listingId);

  useEffect(() => {
    async function fetchData() {
        try {
            // Fetch listing details
            const listingResponse = await fetch(`http://localhost:3001/listings/${listingId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!listingResponse.ok) throw new Error('Failed to fetch listing details.');
            const listingData = await listingResponse.json();
            setListing(listingData);

            // Check if the listing is liked by the user
            const likeResponse = await fetch(`http://localhost:3001/listings/${listingId}/is-liked`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!likeResponse.ok) throw new Error('Failed to check like status.');
            const likeData = await likeResponse.json();
            setLiked(likeData.liked);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        }
    }

    fetchData();
}, [listingId]);

  const toggleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${listingId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`  // Ensure the token is saved in localStorage
        }
      });
      if (!response.ok) {
        throw new Error('Failed to toggle like status');
      }
      const data = await response.json();
      setLiked(data.liked);  // Update like status based on the response
    } catch (error) {
      console.error('Error toggling like status:', error);
      alert('Failed to toggle like status.');
    }
  };

  const deleteListing = async () => {
    try {
        const response = await fetch(`http://localhost:3001/listings/${listingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete listing');
        }
        alert('Listing deleted successfully');
        // Redirect or update UI here
    } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing.');
    }
};


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
                <button className="btn btn-custom btn-info-custom">Contact Seller</button>
                <button onClick={toggleLike} className={`btn btn-custom ${liked ? 'btn-success' : 'btn-outline-success-custom'}`}>{liked ? 'Unlike' : 'Like'}</button>
                <button className="btn btn-custom btn-danger-custom">Report Listing</button>
                <button className="btn btn-custom btn-warning-custom">Report User</button>
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