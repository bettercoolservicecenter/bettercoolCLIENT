import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import ResetPassword from '../components/ResetPassword';

export default function Profile() {
  const [details, setDetails] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const notyf = new Notyf();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setDetails(data);
      } else {
        notyf.error(data.message || 'Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      notyf.error('An error occurred while fetching user details');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="card" style={{ borderRadius: '0' }}>
            <div 
              className="card-header text-center text-white py-2" 
              style={{ backgroundColor: '#373a3c', borderRadius: '0' }}
            >
              <h4 className="mb-0" style={{ fontSize: '1.5rem' }}>Profile</h4>
            </div>
            <div className="card-body">
              {details && (
                <>
                  <div className="mb-4">
                    <strong>{details.firstName} {details.lastName}</strong>
                  </div>
                  <hr />
                  <div className="mt-4">
                    <strong>Contacts</strong>
                  </div>
                  <ul>
                    <li>Email: {details.email}</li>
                    <li>Mobile No: {details.mobileNo}</li>
                  </ul>
                  <div className="mt-4">
                    <Button 
                      variant="danger"
                      style={{ borderRadius: 0 }}
                      onClick={() => setShowResetPassword(true)}
                    >
                      Reset Password
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <ResetPassword 
        show={showResetPassword} 
        onHide={() => setShowResetPassword(false)}
      />
    </Container>
  );
}
