import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const AccountInfo = ({ email, phoneNumber, firstName, lastName }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    phoneNumber: phoneNumber || ''
  });

  // Populate the Edit Account Info form with the user's currently set data
  useEffect(() => {
    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: phoneNumber || ''
    });
  }, [firstName, lastName, phoneNumber]);

  // Helper function to display the user's phone number formatted
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Not set";
    const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : "Invalid number";
  };  

  // Clicking the "edit account info" button sets edit mode to true (the form is open and user can edit their information)
  const handleEditAccount = () => {
    setEditMode(true);
  };

  // Update state of the form whenever user makes changes to fields. 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form input validation
  const validateForm = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      /^\d{10}$/.test(formData.phoneNumber)
    );
  };

  // API call to update user's information in database
  const updateUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`  // Assuming the token is stored in localStorage
        },
        body: JSON.stringify({
          user_fname: formData.firstName,
          user_lname: formData.lastName,
          phone_number: formData.phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user information');
      }

      const data = await response.json();
      alert('Profile updated successfully!');
      console.log(data);  
    } catch (error) {
      console.error('Error updating user information:', error);
      alert(error.message);
    }
  };

  // Once user clicks 'save', perform API call and close the window, set edit mode to false
  const handleSave = async () => {
    if (validateForm()) {
      await updateUserInfo(); 
      setEditMode(false);
      window.location.reload();
    } else {
      alert("Please check your inputs. First name and last name cannot be empty. Phone number should be digits only.");
    }
  };

  // Form Container
  if (editMode) {
    return (
      <Container>
        <Form>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              pattern="\d{10}"
            />
          </Form.Group>
          <Button onClick={handleSave} className="mt-3">Save</Button>
        </Form>
      </Container>
    );
  }

  // Display user's email and phone number
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} className="text-center">
          <h1>Account Information</h1>
          <h4>Email: {email}</h4>
          <h4>Phone Number: {formatPhoneNumber(phoneNumber)}</h4>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="d-flex justify-content-center">
          <Button onClick={handleEditAccount} className="mt-3">Edit Account Info</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountInfo;
