import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ListingDetail.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const ListingDetail = () => {
  const { id: userId, token, role } = useAuth();
  const [listing, setListing] = useState(null);
  const [liked, setLiked] = useState(null);
  const [error, setError] = useState(null);
  const { listingId } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const isAdmin = role === 'admin';
  const [message, setMessage] = useState(''); // State to hold the message to the seller

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
  }, [listingId, token, userId]);

  const toggleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${listingId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to toggle like status');
      const data = await response.json();
      setLiked(data.liked);
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
      if (!response.ok) throw new Error('Failed to delete listing');
      alert('Listing deleted successfully');
      window.location.href = '/listings';
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing.');
    }
  };

  const updateListingStatus = async (status) => {
    try {
        const response = await fetch(`http://localhost:3001/listings/${listingId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update listing status.');
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error updating listing status:', error);
        alert('Failed to update listing status. Please try again later.');
    }
};

// Function to contact the seller
const contactSeller = async () => {
  try {
      const response = await fetch(`http://localhost:3001/listings/${listingId}/contact`, {
          method: 'POST',
          headers: {
              
              'Authorization': `Bearer ${token}`,
             
              'Content-Type': 'application/json'
          },
          // Include the message from the state in the request body
          body: JSON.stringify({ message })
      });

      // If the response status is not ok (not in the range 200-299), throw an error
      if (!response.ok) throw new Error('Failed to send contact request.');

      // Parse the response body as JSON
      const data = await response.json();

      // Alert the user with the message from the response
      alert(data.message);
  } catch (error) {
      // Log the error to the console
      console.error('Error contacting seller:', error);

      // Alert the user that the contact request failed
      alert('Failed to contact seller. Please try again later.');
  }
};

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="card listing-detail-container">
        <img src={`http://localhost:3001/uploads/${listing.image_url.replace(/\\/g, '/')}`} alt={listing.title} className="card-img-top listing-detail-image" />
        <div className="card-body">
          <h1 className="card-title listing-detail-title">{listing.title}</h1>
          <p className="card-text listing-detail-price">${listing.price}</p>
          <p className="card-text listing-detail-info"><strong>Location:</strong> {listing.location}</p>
          <p className="card-text listing-detail-description">{listing.description}</p>
          {isOwner || isAdmin ? (
            <DropdownButton id="dropdown-item-button" title="Change Status">
              <Dropdown.Item as="button" onClick={() => updateListingStatus('active')}>Active</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => updateListingStatus('pending')}>Pending</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => updateListingStatus('sold')}>Sold</Dropdown.Item>
            </DropdownButton>
          ) : null}
          <div className={`status-badge status-${listing.status.toLowerCase()}`}>
                {listing.status}
              </div>
          <textarea className="form-control" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message here..."></textarea>
          <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              More Options
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => alert('Report Listing Clicked')}>Report Listing</Dropdown.Item>
              <Dropdown.Item onClick={() => alert('Report User Clicked')}>Report User</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-custom btn-info-custom" onClick={contactSeller}>Contact Seller</button>
            <button onClick={toggleLike} className={`btn btn-custom ${liked ? 'btn-success' : 'btn-outline-success-custom'}`}>{liked ? 'Unlike' : 'Like'}</button>
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
