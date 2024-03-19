import React, { useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Layout = ({children}) => {

  // State to track if the user is logged in 
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false); // Set isLoggedIn to false on logout
    // Additional logout logic like clearing tokens
  };

    return(
        <>
        <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">RunnerBay</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/listings">Listings</Nav.Link>
          <Nav.Link as={Link} to="/news">News</Nav.Link>
          <Nav.Link as={Link} to="/lostandfound">Lost & Found</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav>

      <Nav>
        {isLoggedIn ?(
        <Dropdown>
          <Dropdown.Toggle variant="dark">
            Profile
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item as={Link} to="/profile">View Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout" onClick ={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        ) : (
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        )}
        
      </Nav>
      </Navbar>
      {children}
      <footer className="App-footer" style={{backgroundColor:'#343a40', color: 'white' }}>
        <p>© 2024 RunnerBay for UTSA Students</p>
      </footer>
    </>
  );
}
export default Layout;
