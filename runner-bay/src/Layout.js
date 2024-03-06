import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

const Layout = ({children}) => {
    return(
        <>
        <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">RunnerBay</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/listings">Listings</Nav.Link>
          <Nav.Link as={Link} to="/news">News</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav>
        <Dropdown>
          <Dropdown.Toggle variant="dark">
            Profile
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item as={Link} to="/profile">View Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
      {children}
      <footer className="App-footer" style={{backgroundColor:'#343a40', color: 'white' }}>
        <p>© 2024 RunnerBay for UTSA Students</p>
      </footer>
    </>
  );
}
export default Layout;
