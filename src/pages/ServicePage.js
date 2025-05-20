import React, { useState } from 'react';
import { Container, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';

const services = {
  'Unit Installation': {
    '1Hp to 2Hp': 6500,
    '2.5 to 4Hp': 7500,
  },
  'Excess on 10 Feet - Wire and Tube': {
    '1Hp to 1.5Hp': 300,
    '2.5Hp to 4Hp': 350,
  },
  'Window Type Air-con': {
    '1.0 to 1.5Hp': 300,
    '2Hp to 2.5Hp': 350,
  },
  'Wall Mounted Split Type Air-con': {
    '1Hp to 2.5Hp': 700,
  },
  'Floor Mounted Split Type Air-con': {
    '3Toner': 800,
    '5Toner': 1200,
  },
  'Check-Up/Minor Adjustment': {
    '1.0Hp to 2Hp': 300,
    '2.5Hp to 4Hp': 350,
  },
  'Repair/Parts Replacement': {
    '1Hp to 2Hp': 700,
    '2.5 to 4Hp': 1200,
  },
  'System Reprocess': {
    '1Hp to 2.5Hp': 3500,
    '3Toner': 4500,
    '5Toner': 6500,
  },
  'Dismantling, Pump-Down, and Re-installation': {
    '1Hp to 2.5Hp': 2500,
    '3Toner': 3500,
    '5Toner': 4500,
  },
};

const ServicePage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showInputModal, setShowInputModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const notyf = new Notyf();

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setSelectedSize('');
    setTotalPrice(0);
  };

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);
    const price = services[selectedService][size];
    setTotalPrice(price);
  };

  const handleBookNow = async () => {
    setShowInputModal(true); // Show the input modal
  };

  const handleConfirmBooking = async () => {
    const serviceTotal = totalPrice; // Assuming totalPrice is the service price

    const bookingData = {
      email,
      totalPrice: serviceTotal, // Set totalPrice to serviceTotal directly
      name,
      phoneNumber,
      serviceType: selectedService,
      size: selectedSize,
      serviceTotal, // Include service total
    };

    try {
      // Check for existing bookings
      const existingResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/my-bookings/${email}`);
      const existingData = await existingResponse.json();

      if (existingResponse.ok) {
        let existingTotalPrice = 0; // Initialize existingTotalPrice
        let existingBooking = null; // Initialize existingBooking

        if (existingData.bookings.length > 0) {
          existingBooking = existingData.bookings[0]; // Define existingBooking here
          existingTotalPrice = existingBooking.totalPrice; // Set existingTotalPrice from the existing booking

          if (existingBooking.serviceType && existingBooking.size) {
            notyf.error('You cannot book again while you have a pending or confirmed booking.');
            navigate(`/bookings/${email}`);
            return;
          }
        }

        // If there is an existing booking, update it
        if (existingBooking) {
          const newTotalPrice = existingTotalPrice + serviceTotal; // Calculate new total price

          const response = await fetch(`http://localhost:4000/bookings/update/${existingBooking._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serviceType: selectedService,
              size: selectedSize,
              totalPrice: newTotalPrice, // Update total price
              productsBooked: existingBooking.productsBooked || [], // Retain existing products
              serviceTotal, // Include service total
            }),
          });

          if (response.ok) {
            notyf.success('Booking updated successfully!');
            navigate(`/bookings/${email}`);
          } else {
            const errorData = await response.json();
            notyf.error(errorData.message || 'Failed to update booking');
          }
        } else {
          // If no existing booking, create a new booking
          const response = await fetch(`http://localhost:4000/bookings/book-now/${email}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData), // Use bookingData directly
          });

          if (response.ok) {
            notyf.success('Service booked successfully!');
            navigate(`/bookings/${email}`);
          } else {
            const errorData = await response.json();
            notyf.error(errorData.message || 'Failed to book service');
          }
        }
      } else {
        notyf.error('Failed to fetch existing bookings');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      notyf.error('An error occurred while processing your booking');
    }

    setShowInputModal(false); // Close the input modal
  };

  return (
    <Container style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <Card.Title className='text-center' style={{ color: 'black', fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>Book a Service</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>Select Service Type</Form.Label>
              {Object.keys(services).map((service) => (
                <Form.Check
                  key={service}
                  type="radio"
                  label={service}
                  value={service}
                  checked={selectedService === service}
                  onChange={handleServiceChange}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                />
              ))}
            </Form.Group>

            {selectedService && (
              <Form.Group>
                <Form.Label>Select Size</Form.Label>
                <Form.Control as="select" onChange={handleSizeChange} value={selectedSize} style={{ fontFamily: "'Roboto', sans-serif" }}>
                  <option value="">Select size</option>
                  {Object.keys(services[selectedService]).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            {totalPrice > 0 && (
              <Row className="mt-3">
                <Col>
                  <h4 style={{ color: 'black', fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>Total:</h4>
                  <h4 style={{ color: '#ff8c00', fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>₱{totalPrice}</h4>
                </Col>
              </Row>
            )}

            <Button
              variant="primary"
              onClick={handleBookNow}
              disabled={!totalPrice}
              className="mt-3"
              style={{
                borderRadius: 6,
                background: '#0c4798',
                color: '#fff',
                border: 'none',
                fontFamily: "'Roboto', sans-serif",
                padding: '8px 16px',
                minWidth: '140px',
                maxWidth: '160px',
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#08306b'; // Darker shade on hover
                e.currentTarget.style.transform = 'scale(1.05)'; // Slightly enlarge on hover
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#0c4798'; // Reset to original color
                e.currentTarget.style.transform = 'scale(1)'; // Reset size
              }}
            >
              Book Now
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Input Modal for User Details */}
      <Modal show={showInputModal} onHide={() => setShowInputModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                autoComplete="tel"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInputModal(false)} style={{
            borderRadius: 6,
            background: '#fff',
            color: '#0c4798',
            border: '1px solid #0c4798',
            fontWeight: 600,
            fontFamily: "'Roboto', sans-serif",
            padding: '8px 16px',
            minWidth: '140px',
            maxWidth: '160px',
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#0c4798'; // Change background on hover
            e.currentTarget.style.color = '#fff'; // Change text color on hover
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#fff'; // Reset background
            e.currentTarget.style.color = '#0c4798'; // Reset text color
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmBooking} style={{
            borderRadius: 6,
            background: '#0c4798',
            color: '#fff',
            border: 'none',
            fontFamily: "'Roboto', sans-serif",
            padding: '8px 16px',
            minWidth: '140px',
            maxWidth: '160px',
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#08306b'; // Darker shade on hover
            e.currentTarget.style.transform = 'scale(1.05)'; // Slightly enlarge on hover
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#0c4798'; // Reset to original color
            e.currentTarget.style.transform = 'scale(1)'; // Reset size
          }}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServicePage;
