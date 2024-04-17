import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "./AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold login error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message); // Set the error message to be displayed
      // Do not navigate away from the login page
    }
  };

  return (
    <Container className="login-container">
      <Row className="login-row">
        <Col md={6} className="mx-auto">
          <Form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="login-button">
              Login
            </Button>
          </Form>
          <div className="link-container">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
