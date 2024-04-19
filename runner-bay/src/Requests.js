import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, ListGroup, Button } from 'react-bootstrap';


const Requests = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('You must be logged in to view requests.');
            return;
        }

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
            }
            setIsLoading(false);
        };

        fetchRequests();
    }, [token]);

    return (
        <div>
            <h1>Contact Requests</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : requests.length > 0 ? (
                requests.map(request => (
                    <Card className="mb-3" key={request.request_id}>
                        <Card.Header>Contact Request</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>Listing:</strong> {request.listing_title}</ListGroup.Item>
                            <ListGroup.Item><strong>From User:</strong> {request.buyer_username}</ListGroup.Item>
                            <ListGroup.Item><strong>Message:</strong> {request.message}</ListGroup.Item>
                            <ListGroup.Item><strong>Submitted On:</strong> {new Date(request.created_at).toLocaleDateString()}</ListGroup.Item>
                            <ListGroup.Item>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Button variant="success">Accept</Button>
                                    <Button variant="danger">Decline</Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                        <Card.Img variant="bottom" src={`http://localhost:3001/uploads/${request.image_url}`} alt="Listing" />
                    </Card>
                ))
            ) : <p>No requests found.</p>}
        </div>
    );
};

export default Requests;
