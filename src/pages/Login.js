import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const notyf = new Notyf();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (email && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const authenticate = (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      notyf.error('Invalid Email');
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    })
    .then(data => {
      if (data.access) {
        notyf.success('Login successful');
        localStorage.setItem('token', data.access);
        retrieveUserDetails(data.access);
        window.dispatchEvent(new Event('tokenChange'));
        setEmail('');
        setPassword('');
      }
    })
    .catch(error => {
      if (error.message === "No Email found") {
        notyf.error('Email does not exist');
      } else if (error.message === "Email and password do not match") {
        notyf.error('Incorrect email or password');
      } else {
        notyf.error('Login failed. Please try again.');
      }
    });
  };

  function retrieveUserDetails(token) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setUser({
        id: data._id,
        isAdmin: data.isAdmin
      });
    })
    .catch(error => {
      notyf.error('Failed to retrieve user details');
      console.error('Error:', error);
    });
  }

  return (
    user.id !== null ?
    <Navigate to="/products" />
    :
    <Container className="mt-5 pt-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <h1 className="text-center mb-4" style={{ color: '#2C3E50', fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, letterSpacing: '1px' }}>Log In</h1>
      <div className="col-md-6 offset-md-3">
        <Card className="border-0" style={{ borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <Card.Body>
            <Form onSubmit={authenticate}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                />
              </Form.Group>

              <div className="bg-light mx-n3 p-3 mt-4" style={{ 
                marginLeft: '-1rem', 
                marginRight: '-1rem', 
                marginBottom: '-1rem',
                borderTop: '1px solid #dee2e6',
                borderBottomLeftRadius: 'calc(0.375rem - 1px)',
                borderBottomRightRadius: 'calc(0.375rem - 1px)'
              }}>
                <Button 
                  variant="link"
                  type="submit"
                  disabled={isButtonDisabled}
                  className="add-to-cart-btn"
                  style={{
                    width: '100%',
                    borderRadius: 6,
                    background: '#0c4798',
                    color: '#fff',
                    fontWeight: 600,
                    fontFamily: "'Roboto', sans-serif",
                    letterSpacing: '0.5px',
                    fontSize: '1rem',
                    border: 'none',
                    boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        <div className="text-center mt-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
          Don't have an account yet? <Link to="/register" style={{ color: '#0c4798', fontWeight: 600 }}>Click here</Link> to register.
        </div>
      </div>
      <style>
        {`
          .add-to-cart-btn {
            background: #0c4798 !important;
            color: #fff !important;
            border: none !important;
            min-width: 140px;
            max-width: 160px;
            font-weight: 600;
            letter-spacing: 0.5px;
            border-radius: 6px;
            box-shadow: 0 6px 18px rgba(69,210,250,0.13);
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
            font-size: 1rem;
            padding: 8px 0;
            font-family: 'Roboto', sans-serif;
            margin: 0 auto;
            display: block;
            text-align: center;
            text-decoration: none !important;
          }
          .add-to-cart-btn:hover, .add-to-cart-btn:focus {
            background: #08306b !important;
            color: #fff !important;
            box-shadow: 0 8px 24px rgba(69,210,250,0.18);
            transform: scale(1.06);
            text-decoration: none !important;
          }
          .card {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07) !important;
          }
        `}
      </style>
    </Container>
  );
};

export default Login;