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
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showInputModal, setShowInputModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transportationAllowance, setTransportationAllowance] = useState(0);
  const [pullOutDeliveryAllowance, setPullOutDeliveryAllowance] = useState(0);
  const [outOfCoverageKm, setOutOfCoverageKm] = useState(0);
  const [extraKm, setExtraKm] = useState(0);
  const [selectedTransportation, setSelectedTransportation] = useState('');
  const [selectedPullOut, setSelectedPullOut] = useState('');
  const [isOutOfCoverage, setIsOutOfCoverage] = useState(false);
  const [outsideCoverageKm, setOutsideCoverageKm] = useState(0);
  const [repairType, setRepairType] = useState('');
  const notyf = new Notyf();

  // Define state variables
  const [existingProducts, setExistingProducts] = useState([]); // Initialize with an empty array
  const [selectedService, setSelectedService] = useState(''); // Initialize with an empty string
  const [selectedSize, setSelectedSize] = useState(''); // Initialize with an empty string
  const [totalServiceCost, setTotalServiceCost] = useState(0); // Initialize with 0

  const handleServiceChange = (e) => {
    const service = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedServices((prev) => [...prev, service]);
      console.log('Selected Services:', [...selectedServices, service]); // Debugging line
    } else {
      setSelectedServices((prev) => prev.filter((s) => s !== service));
      console.log('Selected Services after unchecking:', selectedServices); // Debugging line
    }
    setTotalPrice(0); // Reset total price when services change
  };

  const handleSizeChange = (service, e) => {
    const size = e.target.value;
    const price = services[service][size];

    // Update the selected size for the specific service
    setSelectedSizes((prev) => ({
      ...prev,
      [service]: size,
    }));

    // Recalculate total price
    const newTotalPrice = Object.keys(selectedSizes).reduce((total, service) => {
      const size = selectedSizes[service];
      return total + (size ? services[service][size] : 0);
    }, 0) + (price || 0); // Add the new size price if selected

    setTotalPrice(newTotalPrice);
    console.log('New Total Price:', newTotalPrice); // Debugging line
  };

  const handleRepairTypeChange = (e) => {
    const type = e.target.value;
    setRepairType(type);
    
    // Update total price based on the selected repair type
    if (selectedSizes['Repair/Parts Replacement'] === '1Hp to 2Hp') {
      setTotalPrice(type === 'minor' ? 500 : 700);
    } else if (selectedSizes['Repair/Parts Replacement'] === '2.5 to 4Hp') {
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

  const incrementOutOfCoverageKm = () => {
    setOutOfCoverageKm(prev => prev + 1);
  };

  const decrementOutOfCoverageKm = () => {
    setOutOfCoverageKm(prev => (prev > 0 ? prev - 1 : 0));
  };

  const incrementExtraKm = () => {
    setExtraKm(prev => prev + 1);
  };

  const decrementExtraKm = () => {
    setExtraKm(prev => (prev > 0 ? prev - 1 : 0));
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
    // Calculate the total service cost based on selected services and sizes
    const totalServiceCost = Object.keys(selectedSizes).reduce((total, service) => {
        const size = selectedSizes[service];
        return total + (size ? services[service][size] : 0);
    }, 0);

    // Add allowances to the total service cost
    const finalServiceTotal = totalServiceCost + transportationAllowance + pullOutDeliveryAllowance + (outOfCoverageKm * 10) + (extraKm * 10);

    const bookingData = {
        email,
        name,
        phoneNumber,
        productsBooked: existingProducts.length > 0 ? existingProducts : [], // Ensure this is populated correctly
        serviceType: selectedServices.join(', '), // Join selected services with a comma
        size: Object.values(selectedSizes).join(', '), // Join selected sizes with a comma
        serviceTotal: finalServiceTotal || 0, // Use the updated total service cost
    };

    console.log('Booking Data:', bookingData); // Debugging line

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/book-now`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        if (response.ok) {
            const data = await response.json();
            notyf.success(data.message);
            navigate(`/bookings/${email}`);
        } else {
            const errorData = await response.json();
            notyf.error(errorData.message || 'Failed to book service');
        }
    } catch (error) {
        console.error('Error during booking:', error);
        notyf.error('An error occurred while processing your booking');
    }

    setShowInputModal(false); // Close the input modal
  };

  const totalWithExtras = totalPrice + transportationAllowance + pullOutDeliveryAllowance + (extraKm * 10) + (outOfCoverageKm * 10);

  const resetForm = () => {
    setSelectedServices([]);
    setSelectedSizes({});
    setTotalPrice(0);
    setShowInputModal(false);
    setName('');
    setEmail('');
    setPhoneNumber('');
    setTransportationAllowance(0);
    setPullOutDeliveryAllowance(0);
    setOutOfCoverageKm(0);
    setExtraKm(0);
    setSelectedTransportation('');
    setSelectedPullOut('');
    setIsOutOfCoverage(false);
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
                  type="checkbox"
                  label={service}
                  value={service}
                  checked={selectedServices.includes(service)}
                  onChange={handleServiceChange}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                />
              ))}
            </Form.Group>

            {selectedServices.map((service) => (
              <Form.Group key={service}>
                <Form.Label>Select Size for {service}</Form.Label>
                <Form.Control as="select" onChange={(e) => handleSizeChange(service, e)} style={{ fontFamily: "'Roboto', sans-serif" }}>
                  <option value="">Select size</option>
                  {Object.keys(services[service]).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            ))}

            {selectedServices.includes('Repair/Parts Replacement') && (
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

            {/* Always visible Transportation Allowance */}
            <Form.Group>
              <Form.Label>Transportation Allowance</Form.Label>
              <Form.Check
                type="radio"
                label="Within service coverage (more than 6 km) - P100"
                value="100"
                checked={selectedTransportation === "100"}
                onChange={(e) => {
                  setSelectedTransportation("100");
                  setTransportationAllowance(100); // Set allowance to 100
                }}
              />
              <Form.Check
                type="radio"
                label="City transportation allowance (more than 6.0 kms) - P200"
                value="200"
                checked={selectedTransportation === "200"}
                onChange={(e) => {
                  setSelectedTransportation("200");
                  setTransportationAllowance(200); // Set allowance to 200
                }}
              />
              <Form.Check
                type="checkbox"
                label="Out of coverage area (13.0-27.0 km) - P200, P10/km"
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button className='product-qty-btn' variant="secondary" style={{ marginLeft: '0', width: '40px', height: '40px', fontFamily: "'Roboto', sans-serif", borderRadius: '0', lineHeight: '1', background: '#fff', color: '#0c4798', border: '1px solid #0c4798' }} onClick={decrementOutOfCoverageKm}>-</Button>
                <span style={{ margin: '0 10px' }}>{outOfCoverageKm}</span>
                <Button className='product-qty-btn' variant="secondary" style={{ marginLeft: '0', width: '40px', height: '40px', fontFamily: "'Roboto', sans-serif", borderRadius: '0', lineHeight: '1', background: '#fff', color: '#0c4798', border: '1px solid #0c4798' }} onClick={incrementOutOfCoverageKm}>+</Button>
              </div>
            </Form.Group>

            {/* Always visible Pull-out and Delivery Allowance */}
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button className='product-qty-btn' style={{ marginLeft: '0', width: '40px', height: '40px', fontFamily: "'Roboto', sans-serif", borderRadius: '0', lineHeight: '1', background: '#fff', color: '#0c4798', border: '1px solid #0c4798' }} onClick={decrementExtraKm}>-</Button>
                <span style={{ margin: '0 10px' }}>{extraKm}</span>
                <Button className='product-qty-btn' style={{ marginLeft: '0', width: '40px', height: '40px', fontFamily: "'Roboto', sans-serif", borderRadius: '0', lineHeight: '1', background: '#fff', color: '#0c4798', border: '1px solid #0c4798' }} onClick={incrementExtraKm}>+</Button>
              </div>
            </Form.Group>

            {/* Total Calculation */}
            {totalWithExtras > 0 && (
              <Row className="mt-3">
                <Col>
                  <h4 style={{ color: 'black', fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>Total:</h4>
                  <h4 style={{ color: '#ff8c00', fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>₱{totalWithExtras}</h4>
                </Col>
              </Row>
            )}

            {/* Book Now Button */}
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
