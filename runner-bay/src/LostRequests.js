import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './LostRequests.css';

const LostRequests = () => {
    const { token } = useAuth();
    const [lostRequests, setLostRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const { lostItemId } = useParams();

    useEffect(() => {
        const fetchLostRequests = async () => {
            setIsLoading(true);
            setError('');
    
            try {
                const response = await fetch(`http://localhost:3001/lostrequests/${lostItemId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setLostRequests(data);
                } else {
                    throw new Error('Failed to fetch lost requests.');
                }
            } catch (error) {
                console.error('Error fetching lost requests:', error);
                setError('Failed to fetch lost requests. Please try again later.');
            }
    
            setIsLoading(false);
        };
    
        fetchLostRequests();
    }, [token]); 
    

    const handleAccept = async (lostRequestId) => {
        try {
            const response = await fetch(`http://localhost:3001/lostrequests/${lostRequestId}/accept`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                alert('Lost request accepted successfully.');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to accept lost request.');
            }
        } catch (error) {
            console.error('Error accepting lost request:', error);
            alert('Failed to accept lost request.');
        }
    };

    const handleDecline = async (lostRequestId) => {
        try {
            const response = await fetch(`http://localhost:3001/lostrequests/${lostRequestId}/decline`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                alert('Lost request declined successfully.');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to decline lost request.');
            }
        } catch (error) {
            console.error('Error declining lost request:', error);
            alert('Failed to decline lost request.');
        }
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
    };

    return (
        <div className="lost-requests-container">
            <h1>Lost Requests</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : lostRequests.length > 0 ? (
                lostRequests.map(lostRequest => (
                    <div className="lost-request-card" key={lostRequest.lostrequest_id}>
                        <div className="lost-request-header">Lost Request</div>
                        <div className="lost-request-item"><strong>Lost Item:</strong> {lostRequest.lost_item_name}</div>
                        <div className="lost-request-item"><strong>From User:</strong> {lostRequest.requester_username}</div>
                        <div className="lost-request-item"><strong>Status:</strong> {lostRequest.status}</div>
                        <div className="lost-request-item"><strong>Submitted On:</strong> {new Date(lostRequest.created_at).toLocaleDateString()}</div>
                        <div className="lost-request-action-buttons">
                            <Button variant="success" onClick={() => handleAccept(lostRequest.lostrequest_id)}>Accept</Button>
                            <Button variant="danger" onClick={() => handleDecline(lostRequest.lostrequest_id)}>Decline</Button>
                        </div>
                    </div>
                ))
            ) : <p>No lost requests found.</p>}
        </div>
    );
};

export default LostRequests;
