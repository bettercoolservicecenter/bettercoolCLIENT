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
  'Window Type Air-con - Cleaning': {
    '1.0 to 1.5Hp': 300,
    '2Hp to 2.5Hp': 350,
  },
  'Wall Mounted Split Type Air-con - Cleaning': {
    '1Hp to 2.5Hp': 700,
  },
  'Floor Mounted Split Type Air-con - Cleaning': {
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
  const [transportationAllowance, setTransportationAllowance] = useState(0);
  const [pullOutDeliveryAllowance, setPullOutDeliveryAllowance] = useState(0);
  const [extraKm, setExtraKm] = useState(0);
  const [outOfCoverageKm, setOutOfCoverageKm] = useState(0);
  const [selectedTransportation, setSelectedTransportation] = useState('');
  const [selectedPullOut, setSelectedPullOut] = useState('');
  const [isOutOfCoverage, setIsOutOfCoverage] = useState(false);
  const [outsideCoverageKm, setOutsideCoverageKm] = useState(0);
  const [repairType, setRepairType] = useState('');
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

  const handleRepairTypeChange = (e) => {
    const type = e.target.value;
    setRepairType(type);
    
    // Update total price based on the selected repair type
    if (selectedSize === '1Hp to 2Hp') {
      setTotalPrice(type === 'minor' ? 500 : 700);
    } else if (selectedSize === '2.5 to 4Hp') {
      setTotalPrice(type === 'minor' ? 800 : 1200);
    }
  };

  const handleTransportationChange = (e) => {
    const { value, checked } = e.target;

    if (value === "10") { // Out of coverage area
      setIsOutOfCoverage(checked);
      setSelectedTransportation(checked ? "10" : ""); // Set selected transportation based on checkbox
      setTransportationAllowance(checked ? 200 : 0); // Set allowance for out of coverage
    } else if (value === "200") { // City transportation allowance
      setSelectedTransportation(checked ? "200" : ""); // Set selected transportation
      setTransportationAllowance(checked ? 200 : 0); // Set allowance for city transportation
    }
  };

  const handlePullOutChange = (e) => {
    const value = e.target.value;
    setSelectedPullOut(value);
    
    // Reset pull-out delivery allowance
    setPullOutDeliveryAllowance(0);
    
    // Set the allowance based on the selected option
    if (value === "600") {
      setPullOutDeliveryAllowance(600); // Add 600 for within service coverage
    } else if (value === "10") {
      setPullOutDeliveryAllowance(600); // Add 600 for outside coverage area
    }
  };

  const handleExtraKmChange = (e) => {
    const km = parseInt(e.target.value) || 0;
    setExtraKm(km);
  };

  const handleOutOfCoverageKmChange = (e) => {
    const km = parseInt(e.target.value) || 0;
    setOutOfCoverageKm(km);
  };

  const handleBookNow = async () => {
    // Remove the validation for transportation allowance
    // if (!selectedTransportation) {
    //   notyf.error('Please select at least one transportation allowance option.');
    //   return;
    // }
    
    // You can keep the validation for pull-out delivery allowance if needed
    if (!selectedPullOut) {
      notyf.error('Please select at least one pull-out and delivery allowance option.');
      return;
    }
    
    setShowInputModal(true); // Show the input modal
  };

  const handleConfirmBooking = async () => {
    const serviceTotal = totalPrice; // Assuming totalPrice is the service price

    // Calculate the total including allowances
    const totalWithAllowances = serviceTotal + transportationAllowance + pullOutDeliveryAllowance + (extraKm * 10) + (outsideCoverageKm * 10);

    const bookingData = {
      email,
      totalPrice: totalWithAllowances, // Set totalPrice to include allowances
      name,
      phoneNumber,
      serviceType: selectedService,
      size: selectedSize,
      serviceTotal, // Include service total if needed separately
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
          const newTotalPrice = existingTotalPrice + totalWithAllowances; // Calculate new total price

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
              serviceTotal, // Include service total if needed
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

  const totalWithExtras = totalPrice + transportationAllowance + pullOutDeliveryAllowance + (extraKm * 10) + (outsideCoverageKm * 10);

  const resetForm = () => {
    setSelectedService('');
    setSelectedSize('');
    setTotalPrice(0);
    setShowInputModal(false);
    setName('');
    setEmail('');
    setPhoneNumber('');
    setTransportationAllowance(0);
    setPullOutDeliveryAllowance(0);
    setExtraKm(0);
    setOutOfCoverageKm(0);
    setSelectedTransportation('');
    setSelectedPullOut('');
    setIsOutOfCoverage(false);
    setOutsideCoverageKm(0);
    setRepairType('');
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

            {selectedService === 'Repair/Parts Replacement' && selectedSize && (
              <Form.Group>
                <Form.Label>Select Repair Type</Form.Label>
                <Form.Check
                  type="radio"
                  label="Minor"
                  value="minor"
                  checked={repairType === 'minor'}
                  onChange={handleRepairTypeChange}
                />
                <Form.Check
                  type="radio"
                  label="Major"
                  value="major"
                  checked={repairType === 'major'}
                  onChange={handleRepairTypeChange}
                />
              </Form.Group>
            )}

            {selectedService && (
              <>
                <Form.Group>
                  <Form.Label>Transportation Allowance</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="City transportation allowance (more than 6.0 kms) - P200"
                    value="200"
                    checked={selectedTransportation === "200"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransportation("200");
                        setTransportationAllowance(200);
                      } else {
                        setSelectedTransportation("");
                        setTransportationAllowance(0);
                      }
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Out of coverage area (13.0-27.0 km) - P200"
                    value="10"
                    checked={isOutOfCoverage}
                    onChange={(e) => {
                      handleTransportationChange(e);
                      if (e.target.checked) {
                        setTransportationAllowance(200); // Automatically add 200 for out of coverage
                      } else {
                        setTransportationAllowance(0); // Reset allowance if unchecked
                      }
                    }}
                  />
                  {isOutOfCoverage && (
                    <Form.Group>
                      <Form.Label>Enter KM for Out of Coverage Area</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter extra km"
                        onChange={handleOutOfCoverageKmChange}
                      />
                    </Form.Group>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Pull-out and Delivery Allowance</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Within service coverage (P600)"
                    value="600"
                    checked={selectedPullOut === "600"}
                    onChange={handlePullOutChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Outside coverage area (P10/km)"
                    value="10"
                    checked={selectedPullOut === "10"}
                    onChange={handlePullOutChange}
                  />
                  {selectedPullOut === "10" && ( // Show input field only if outside coverage is selected
                    <Form.Group>
                      <Form.Label>Enter KM for Outside Coverage Area</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter extra km"
                        onChange={(e) => {
                          const km = parseInt(e.target.value) || 0;
                          setOutsideCoverageKm(km); // Set the outside coverage km
                        }}
                      />
                    </Form.Group>
                  )}
                </Form.Group>
              </>
            )}

            {totalWithExtras > 0 && (
              <Row className="mt-3">
                <Col>
                  <h4 style={{ color: 'black', fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>Total:</h4>
                  <h4 style={{ color: '#ff8c00', fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>₱{totalWithExtras}</h4>
                </Col>
              </Row>
            )}

            <Button
              variant="primary"
              onClick={handleBookNow}
              disabled={!totalWithExtras}
              className="mt-3"
              style={{
                borderRadius: 6,
                minWidth: 140,
                maxWidth: 160,
                width: '100%',
                fontWeight: 600,
                letterSpacing: '0.5px',
                boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
                fontSize: '1rem',
                padding: '8px 0',
                fontFamily: 'Roboto, sans-serif',
                background: '#0c4798',
                color: '#fff',
                border: 'none',
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
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

            {/* Clear Button */}
            <Button
              variant="secondary"
              onClick={resetForm}
              className="mt-3 clear-service-btn"
              style={{
                marginLeft: '10px',
                borderRadius: 6,
                background: '#fff',
                color: '#0c4798',
                border: '1px solid #0c4798',
                fontWeight: 600,
                fontFamily: "'Roboto', sans-serif",
                padding: '7px 16px',
                minWidth: 140,
                maxWidth: 160,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
              }}
            >
              Clear
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
