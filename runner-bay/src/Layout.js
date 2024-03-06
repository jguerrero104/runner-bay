import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';

const Layout = ({children}) => {
    return(
        <>
         <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">RunnerBay</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#listings">Listings</Nav.Link>
          <Nav.Link href="#news">News</Nav.Link>
          <Nav.Link href="#about">About</Nav.Link>
        </Nav>
        <Dropdown>
          <Dropdown.Toggle variant="dark">
            Profile
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item href="#profile">View Profile</Dropdown.Item>
            <Dropdown.Item href="#settings">Settings</Dropdown.Item>
            <Dropdown.Item href="#logout">Logout</Dropdown.Item>
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
