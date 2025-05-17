import React, { useState, useEffect, useContext } from 'react';
import { Form, Container, Card } from 'react-bootstrap';
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
    <Container className="mt-5">
      <h1 className="text-center mb-4">Register</h1>
      <div className="col-md-6 offset-md-3">
        <Card className="p-4" style={{ borderRadius: 0 }}>
          <Form onSubmit={registerUser}>
            <Form.Group className="mb-3">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your First Name"
                value={firstName}
                onChange={handleNameChange(setFirstName)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Last Name"
                value={lastName}
                onChange={handleNameChange(setLastName)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile Number:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your 11 digit mobile number"
                value={mobileNo}
                onChange={e => setMobileNo(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Verify Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Verify your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
              <button 
                type="submit" 
                className={`btn ${isActive ? 'btn-primary' : 'btn-danger'}`}
                disabled={!isActive}
                style={{
                  textAlign: 'left',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  width: 'auto',
                  display: 'inline-block',
                  borderRadius: 0
                }}
              >
                {isActive ? 'Register' : 'Please enter your registration details'}
              </button>
            </div>

            
          </Form>
        </Card>
        <div className="text-center">
          Already have an account? <Link to="/login">Click here</Link> to log in.
        </div>
      </div>
    </Container>
  );
};

export default Register;
