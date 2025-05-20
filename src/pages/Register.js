import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  const buttonStyle = {
      backgroundColor: isActive ? '#198754' : '#ff6b6b',
      color: 'white',
      textAlign: 'left',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      width: '100%',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    };

    
 

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      mobileNo.length === 11 &&
      password === confirmPassword &&
      email.includes('@')
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  const handleNameChange = (setter) => (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setter(value);
    }
  };

  function registerUser(e) {
        e.preventDefault();

        if (!email.includes('@')) {
          notyf.error('Invalid Email');
          return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobileNo: mobileNo,
            password: password
          })
        })
        .then(async response => {
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
          }
          
          return data;
        })
        .then(data => {
          if (data.message === "Registered Successfully") {
            notyf.success({
              message: 'Registration Successful! Redirecting to login...',
              duration: 2000,
              dismissible: false
            });
            
            setFirstName("");
            setLastName("");
            setEmail("");
            setMobileNo("");
            setPassword("");
            setConfirmPassword("");
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        })
        .catch(error => {
          notyf.error({
            message: error.message,
            duration: 2000,
            dismissible: true
          });
        });
    }

  if (user.id !== null) {
    return <Navigate to="/courses" />;
  }

  return (
    <Container className="mt-5 py-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <h1 className="text-center mb-4" style={{ color: '#2C3E50', fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, letterSpacing: '1px' }}>Register</h1>
      <div className="col-md-6 offset-md-3">
        <Card className="p-4 border-0" style={{ borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <Form onSubmit={registerUser}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>First Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your First Name"
                value={firstName}
                onChange={handleNameChange(setFirstName)}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>Last Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Last Name"
                value={lastName}
                onChange={handleNameChange(setLastName)}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>Mobile Number:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your 11 digit mobile number"
                value={mobileNo}
                onChange={e => setMobileNo(e.target.value)}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "'Roboto', sans-serif" }}>Verify Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Verify your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </Form.Group>

            <div className="bg-light mx-n4 p-3" style={{
              marginLeft: '-1.5rem',
              marginRight: '-1.5rem',
              marginBottom: '-1.5rem',
              borderTop: '1px solid #dee2e6',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}>
              <Button
                type="submit"
                className="add-to-cart-btn"
                disabled={!isActive}
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
                Register
              </Button>
            </div>
          </Form>
        </Card>
        <div className="text-center mt-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
          Already have an account? <Link to="/login" style={{ color: '#0c4798', fontWeight: 600 }}>Click here</Link> to log in.
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

export default Register;
