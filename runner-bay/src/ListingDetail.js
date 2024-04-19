import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ListingDetail.css';
import { useAuth } from './AuthContext';


const ListingDetail = () => {
  const {id: userId, token, role} = useAuth();
  const [listing, setListing] = useState(null);
  const [liked, setLiked] = useState(null);  // State to track like status
  const [error, setError] = useState(null);
  const { listingId } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const isAdmin = role === 'admin';  // Determine if the user is an admin
  console.log("Listing ID from URL:", listingId);

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const listingResponse = await fetch(`http://localhost:3001/listings/${listingId}`, { headers });
        if (!listingResponse.ok) throw new Error('Failed to fetch listing details.');
        const listingData = await listingResponse.json();
        setListing(listingData);
        setIsOwner(listingData.sellerId === userId);

        if (token) {
          const likeResponse = await fetch(`http://localhost:3001/listings/${listingId}/is-liked`, { headers });
          if (!likeResponse.ok) throw new Error('Failed to check like status.');
          const likeData = await likeResponse.json();
          setLiked(likeData.liked);
        } else {
          setLiked(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    }

    fetchData();
  }, [listingId, token, userId]); // Include userId in the dependency array

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
        // Redirect to another page, e.g., home or listings page
        window.location.href = '/listings';  // Adjust as necessary for your routing setup
    } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing.');
    }
};

const contactSeller = async () => {
  try {
      const response = await fetch(`http://localhost:3001/listings/${listingId}/contact`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: 'Hi, I am interested in your listing. Can we exchange contact details?' }) // Customize message as needed
      });
      if (!response.ok) throw new Error('Failed to send contact request.');
      const data = await response.json();
      alert(data.message); // Show success message
  } catch (error) {
      console.error('Error contacting seller:', error);
      alert('Failed to contact seller. Please try again later.');
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
                <button className="btn btn-custom btn-info-custom" onClick={contactSeller}>Contact Seller</button>
                <button onClick={toggleLike} className={`btn btn-custom ${liked ? 'btn-success' : 'btn-outline-success-custom'}`}>{liked ? 'Unlike' : 'Like'}</button>
                <button className="btn btn-custom btn-danger-custom">Report Listing</button>
                <button className="btn btn-custom btn-warning-custom">Report User</button>
                { (isOwner || isAdmin) && <button onClick={deleteListing} className="btn btn-danger">Delete Listing</button> }
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