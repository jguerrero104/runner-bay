import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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
      </Navbar>
      {children}
      <footer className="App-footer" style={{backgroundColor:'#343a40', color: 'white' }}>
        <p>© 2024 RunnerBay for UTSA Students</p>
      </footer>
    </>
  );
}
export default Layout;
