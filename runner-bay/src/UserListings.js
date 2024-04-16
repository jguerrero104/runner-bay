import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ListingCard from './ListingCard'; 

function UserListings({ userId }) {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state

    useEffect(() => {
        const fetchUserListings = async () => {
            const token = localStorage.getItem('token'); 
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            try {
                const response = await fetch('http://localhost:3001/profile/listings', { headers });
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setListings(data);
            } catch (error) {
                console.error('Error fetching user listings:', error);
            } finally {
                setIsLoading(false); // Set loading to false when the fetch is complete
            }
        };

        fetchUserListings();
    }, [userId]);

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center">Your Listings</h2>
                </Col>
            </Row>
            {isLoading ? (
                // Display loading message while fetching data
                <Row>
                    <Col md={12}>
                        <h4 className="text-center">Loading...</h4>
                    </Col>
                </Row>
            ) : (
                <Row xs={1} md={3} className="g-4">
                    {listings.length > 0 ? (
                        listings.map(listing => (
                            <ListingCard key={listing.listingId} listing={listing} />
                        ))
                    ) : (
                        <Col md={12}>
                            <h4 className="text-center">No listings yet...</h4>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
}

export default UserListings;
