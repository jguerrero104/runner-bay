import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { isLoggedIn, logout } = useAuth(); // Use logout from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">RunnerBay</Navbar.Brand>
        <Nav className="mr-auto">
          {/* Marketplace Dropdown */}
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="marketplace-dropdown">
              Marketplace
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Item as={Link} to="/listings">Listings</Dropdown.Item>
              <Dropdown.Item as={Link} to="/requests">Requests</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Link as={Link} to="/news">News</Nav.Link>
          <Nav.Link as={Link} to="/lostandfound">Lost & Found</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav>

        <Nav>
          {isLoggedIn ? (
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="profile-dropdown">
                Profile
              </Dropdown.Toggle>
              <Dropdown.Menu variant="dark">
                <Dropdown.Item as={Link} to="/profile">View Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar>
      {children}
      <footer className="App-footer">
        <p>© 2024 RunnerBay for UTSA Students</p>
      </footer>
    </div>
  );
}

export default Layout;
