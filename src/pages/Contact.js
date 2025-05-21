import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaFacebookMessenger, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {

    const navigate = useNavigate();

  

  const handleCall = () => {
    window.open('tel:+639389831877'); // Opens the phone dialer with the number
  };

  const handleEmail = () => {
    window.open('mailto:aqpaba@yahoo.com'); // Opens the email client with a draft
  };

  const handleMessenger = () => {
    window.open('https://m.me/100083403047450'); // Opens Facebook Messenger
  };

  const handleVisitLocation = () => {
    navigate('/about#our-location');
  };

  return (
    <div style={{
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}>
      {/* Hero Banner */}
      <div className="banner">
        {/* Banner content can go here if needed */}
      </div>
      <Row style={{ marginTop: '20px' }}>
        <Col xs={6} md={3} className='d-flex justify-content-center'>
          <Button 
            variant="primary" 
            onClick={handleCall} 
            style={buttonStyle}
          >
            <FaPhone className="icon" style={{ marginRight: '5px' }} />
            <span className="button-text">Call Now</span>
          </Button>
        </Col>
        <Col xs={6} md={3} className='d-flex justify-content-center'>
          <Button 
            variant="primary" 
            onClick={handleEmail} 
            style={buttonStyle}
          >
            <FaEnvelope className="icon" style={{ marginRight: '5px' }} />
            <span className="button-text">Email Us</span>
          </Button>
        </Col>
        <Col xs={6} md={3} className='d-flex justify-content-center'>
          <Button 
            variant="primary" 
            onClick={handleMessenger} 
            style={buttonStyle}
          >
            <FaFacebookMessenger className="icon" style={{ marginRight: '5px' }} />
            <span className="button-text">Chat with Us</span>
          </Button>
        </Col>
        <Col xs={6} md={3} className='d-flex justify-content-center'>
          <Button 
            variant="primary" 
            onClick={handleVisitLocation} 
            style={buttonStyle}
          >
            <FaMapMarkerAlt className="icon" style={{ marginRight: '5px' }} />
            <span className="button-text">Visit Us</span>
          </Button>
        </Col>
      </Row>
      <style>
        {`
          .banner {
            background-image: url("https://i.ibb.co/Z6T5Wn15/contact-us.png");
            height: 600px;
            background-size: cover;
            background-position: center;
            margin-bottom: 20px; 
            margin-top: 4rem;
          }

          @media (max-width: 768px) {
            .banner {
              height: 300px; /* Adjust height for mobile */
              margin-top: 2rem; /* Adjust margin for mobile */
            }
            .button-text {
              display: none; /* Hide text on mobile */
            }
          }

          @media (max-width: 576px) {
            .banner {
              height: 250px; /* Further adjust height for smaller screens */
            }
          }
        `}
      </style>
    </div>
  );
};

// Define button styles in a variable to avoid repetition
const buttonStyle = {
  margin: '5px',
  background: '#0c4798',
  color: '#fff',
  border: 'none',
  minWidth: '140px',
  maxWidth: '160px',
  width: '100%',
  fontWeight: 600,
  letterSpacing: '0.5px',
  borderRadius: '6px',
  boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
};

export default Contact;
