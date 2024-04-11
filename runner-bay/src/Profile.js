import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, ListGroup } from 'react-bootstrap';
import DefaultProfilePic from './assets/images/Default_pfp.png'; 
import { useAuth } from './AuthContext'; // Make sure the path is correct
import AccountInfo from './AccountInfo';
import UserListings from './UserListings';
import SavedListings from './SavedListings';
import './assets/css/Profile.css';

const Profile = () => {
  const { token } = useAuth(); 
  const [user, setUser] = useState([]);
  const [activeSection, setActiveSection] = useState('account');

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        console.log('token not found');
        return;
      }
      try {
        const response = await fetch('http://localhost:3001/profile', { 
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }

        const data = await response.json();
        console.log(data);
        setUser(data); 
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, [token]); // Dependency on token; if the token changes, refetch user info

  const handleEditPicture = () => {
    console.log('Edit picture clicked');
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return user && <AccountInfo email={user.email} />;
      case 'listings':
        return <UserListings />;
      case 'saved':
        return <SavedListings onBack={() => setActiveSection('account')} />;
      default:
        return user && <AccountInfo email={user.email} />;
    }
  };


  return (
    
    <Container fluid>
      <Row className="justify-content-start">
        <Col xs={12} md={8} className="profile-container">
          <div className="d-flex flex-column align-items-center profile-header">
            <div className="d-flex align-items-start mb-2">
            <Image src={DefaultProfilePic} roundedCircle className="profile-image me-3" />
              <div>
                <h1 className="profile-name">{user.user_fname} {user.user_lname}</h1>
                <p className="profile-username">@{user.username}</p>
              </div>
            </div>
            <Button onClick={handleEditPicture} className="edit-button">Edit Profile</Button>
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
        <Col xs={12} md={6} className="content-area">
          {renderSection()}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
