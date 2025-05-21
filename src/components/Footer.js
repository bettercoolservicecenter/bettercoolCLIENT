import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaFacebook, FaEnvelope, FaFacebookMessenger } from 'react-icons/fa'; // Import icons
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#ffffff',
    padding: '1rem 0',
    color: '#000000',
    textAlign: 'center',
  };

  const linkStyle = {
    color: '#000000',
    textDecoration: 'none',
    margin: '0 3px',
    padding: '0',
  };

  return (
    <footer style={footerStyle}>
      <Container>
        <Row>
          <Col>
            <Nav className="justify-content-center">
              <Nav.Link as={NavLink} to="/about" style={linkStyle} onClick={() => window.scrollTo(0, 0)}>
                About Us
              </Nav.Link>
              <span style={{ margin: '0 5px' }}>|</span>
              <Nav.Link as={NavLink} to="/contact" style={linkStyle} onClick={() => window.scrollTo(0, 0)}>
                Contact Us
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={{ marginTop: '10px' }}>
              <a href="https://web.facebook.com/profile.php?id=100083403047450" style={linkStyle} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <a href="mailto:aqpaba@yahoo.com" style={linkStyle}>
                <FaEnvelope size={20} />
              </a>
              <a href="https://m.me/100083403047450" style={linkStyle} target="_blank" rel="noopener noreferrer">
                <FaFacebookMessenger size={20} />
              </a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <p style={{ marginTop: '10px' }}>© 2025 Better Cool Service Center. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
