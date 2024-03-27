import React, { useState } from 'react';
import { Container, Row, Col, Button, Image, ListGroup } from 'react-bootstrap';
import ProfilePic from './assets/images/Default_pfp.png'; //DELETE LATER, should be pulled from user database
import AccountInfo from './AccountInfo'; // Component with account details
import UserListings from './UserListings'; // Component with user's listings
import SavedListings from './SavedListings'; // Component with saved listings
import './assets/css/Profile.css';

function Profile() {
  const [user, setUser] = useState({ //Replace these with user's actual info
    name: 'Your Name',
    username: 'username',
    email: 'email@example.com',
    profilePic: ProfilePic,
  });

  const [activeSection, setActiveSection] = useState('account'); // Default to 'account'

  const handleEditPicture = () => {
    console.log('Edit picture clicked');
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return <AccountInfo email={user.email} />;
      case 'listings':
        return <UserListings />;
      case 'saved':
        return <SavedListings onBack={() => setActiveSection('account')} />;
      default:
        return null;
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-start">
        <Col xs={12} md={4} className="profile-container">
          <div className="d-flex flex-column align-items-center profile-header">
            <div className="d-flex align-items-start mb-2">
              <Image src={user.profilePic} roundedCircle className="profile-image me-3" />
              <div>
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-username">{user.username}</p>
              </div>
            </div>
            <Button onClick={handleEditPicture} className="edit-button">Edit Photo</Button>
          </div>
          <ListGroup className="profile-listgroup mt-3">
    <ListGroup.Item 
      action 
      active={activeSection === 'account'} 
      onClick={() => handleSectionClick('account')}
    >
      Account
    </ListGroup.Item>
    <ListGroup.Item 
      action 
      active={activeSection === 'listings'} 
      onClick={() => handleSectionClick('listings')}
    >
      Your Listings
    </ListGroup.Item>
    <ListGroup.Item 
      action 
      active={activeSection === 'saved'} 
      onClick={() => handleSectionClick('saved')}
    >
      Saved Listings
    </ListGroup.Item>
  </ListGroup>
        </Col>
        <Col xs={12} md={8} className="content-area">
          {renderSection()}
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
