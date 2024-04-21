import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button, Modal} from 'react-bootstrap';
import './Requests.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const Requests = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [buyerPhone, setBuyerPhone] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('pending');

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            setError('');
            const response = await fetch('http://localhost:3001/requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            } else {
                setError('Failed to fetch requests.');
                console.error('Failed to fetch requests');
            }
            setIsLoading(false);
        };

        fetchRequests();
    }, [token]);

    const handleAccept = async (requestId) => {
        const response = await fetch(`http://localhost:3001/requests/${requestId}/accept`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ listingStatus: selectedStatus }) // Send selected status
        });

        if (response.ok) {
            const data = await response.json();
            setBuyerPhone(data.buyerPhone); // Store buyer phone number in state
            setShowModal(true); // Show the modal
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Failed to accept contact request.');
        }
    }; 

    const handleDecline = async (requestId) => {
        const response = await fetch(`http://localhost:3001/requests/${requestId}/decline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Contact request declined.');
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Failed to decline contact request.');
        }
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
    };

    return (
        <div className="requests-container">
            <h1>Contact Requests</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : requests.length > 0 ? (
                requests.map(request => (
                    <div className="request-card" key={request.request_id}>
                    <div className="request-header">Contact Request</div>
                    <div className="request-item"><strong>Listing:</strong> {request.listing_title}</div>
                    <div className="request-item"><strong>From User:</strong> {request.buyer_username}</div>
                    <div className="request-message"><strong>Message:</strong> {request.message}</div>
                    <div className="request-item"><strong>Submitted On:</strong> {new Date(request.created_at).toLocaleDateString()}</div>
                    <div className="request-action-buttons">
                        <DropdownButton id="dropdown-basic-button" title="Set Status" onSelect={handleStatusChange}>
                            <Dropdown.Item eventKey="active">Active</Dropdown.Item>
                            <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                            <Dropdown.Item eventKey="sold">Sold</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="success" onClick={() => handleAccept(request.request_id)}>Accept</Button>
                        <Button variant="danger" onClick={() => handleDecline(request.request_id)}>Decline</Button>
                    </div>
                        {request.image_url && (
                            <img src={`http://localhost:3001/uploads/${request.image_url}`} alt="Listing" className="request-image" />
                        )}
                    </div>
                ))
            ) : <p>No requests found.</p>}
                 <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Contact Request Accepted</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>The buyer's phone number is: {buyerPhone}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
    );
};

export default Requests;
