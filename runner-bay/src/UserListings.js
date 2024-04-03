import React from 'react';
import './assets/css/Profile.css';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

function UserListings({ onBack }) {
    const fakeListings = [
        { id: 1, title: 'Fujifilm Digital Camera', description: 'Fujifilm FinePix J38 Digital Camera' },
        { id: 2, title: 'Compact Mini Fridge', description: 'Like-new mini fridge perfect for dorms. ' },
        { id: 3, title: 'TI-84 Plus Calculator', description: 'Pre-owned graphing calculator' },
        { id: 4, title: 'UTSA T-Shirt', description: "Size M UTSA t-shirt"},
      ];
    
      return (
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center">Your Listings</h2>
            </Col>
          </Row>
          <Row xs={1} md={3} className="g-4">
            {fakeListings.map(listing => (
              <Col key={listing.id} className="d-flex align-items-stretch">
                <Card className="custom-card h-100">
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>{listing.title}</Card.Title>
                    <Card.Text>{listing.description}</Card.Text>
                    <Button variant="primary">View Details</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      );
    }

export default UserListings;
