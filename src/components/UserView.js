import { Container, Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function UserView({ productsData = [] }) {
  const [productName, setProductName] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('10000');

  // Removed products state since we are displaying blank cards
  useEffect(() => {
    // No need to set products since we are displaying blank cards
  }, [productsData]);

  const handlePriceChange = (setter, value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    setter(numericValue);
  };

  const incrementPrice = (setter, currentValue) => {
    const newValue = parseFloat(currentValue || 0) + 1000;
    setter(newValue.toString());
  };

  const decrementPrice = (setter, currentValue) => {
    const newValue = Math.max(0, parseFloat(currentValue || 0) - 1000);
    setter(newValue.toString());
  };

  const handleSearchByName = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-name/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: productName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Filter out inactive products
      const activeProducts = Array.isArray(data) ? data.filter(product => product.isActive) : [];
      // No need to set products since we are displaying blank cards
    } catch (error) {
      console.error('Error searching products:', error);
      // No need to set products since we are displaying blank cards
    }
  };

  const handleSearchByPrice = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-price/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          minPrice: parseFloat(minPrice) || 0,
          maxPrice: parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Filter out inactive products
      const activeProducts = Array.isArray(data) ? data.filter(product => product.isActive) : [];
      // No need to set products since we are displaying blank cards
    } catch (error) {
      console.error('Error searching by price:', error);
      // No need to set products since we are displaying blank cards
    }
  };

  const handleClear = () => {
    setProductName('');
    setMinPrice('0');
    setMaxPrice('100000');
    // No need to set products since we are displaying blank cards
  };

  const priceInputStyle = {
    borderRadius: 0,
    textAlign: 'left',
    width: '60px' // Reduced width to make it half the size
  };

  const priceButtonStyle = {
    borderRadius: 0,
    width: '38px',
    height: '38px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    border: 'none'
  };

  const searchButtonStyle = {
     borderRadius: 0
  };

  // Updated accordion style with more top margin to accommodate navbar expansion
  const accordionStyle = {
    marginTop: '2rem',
    marginBottom: '1.5rem',
    transition: 'margin-top 0.3s ease'
  };
  
  // Custom styles to remove blue outline on accordion and fix spacing
  const customAccordionStyles = `
    .accordion-button:focus {
      box-shadow: none !important;
      border-color: rgba(0,0,0,.125) !important;
    }
    .accordion-button:not(.collapsed) {
      color: #212529;
      background-color: #f8f9fa;
      box-shadow: none;
    }
    .accordion-body {
      padding-top: 0.5rem !important;
    }
    .accordion-button {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
  `;
  
  // Add these custom styles
  const customStyles = {
    container: {
      maxWidth: '100%',
      padding: '0 15px' // Keep standard container padding
    },
    productRow: {
      margin: '0 -15px' // Negative margin to offset card padding
    },
    accordionContainer: {
      padding: '0',
      maxWidth: 'calc(100% - 30px)', // Account for the padding of the cards
      margin: '0 auto'
    }
  };

  return (
    <Container style={customStyles.container} className="mt-5">
      <style>{customAccordionStyles}</style>
      <Row>
        <Col xs={12}>
          <div style={customStyles.accordionContainer}>
            <Accordion className="mb-4" style={accordionStyle}>
              <Accordion.Item eventKey="0" className="border">
                <Accordion.Header>
                  <span className="fw-bold">Product Search</span>
                </Accordion.Header>
                <Accordion.Body>
                  <Form className="compact-form">
                    {/* Product Name field */}
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-1 small">Product Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        size="sm"
                      />
                    </Form.Group>
                    
                    {/* Search by Name button on a single line */}
                    <div className="mb-3">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={handleSearchByName}
                        style={searchButtonStyle}
                      >
                        Search by Name
                      </Button>
                    </div>

                    {/* Price Range section - both fields side by side on the left */}
                    <div className="d-flex mb-3" style={{ maxWidth: '400px' }}>
                      <div className="me-3">
                        <Form.Label className="mb-1 small">Min Price:</Form.Label>
                        <div className="d-flex">
                          <Button 
                            style={{...priceButtonStyle, height: '31px'}}
                            onClick={() => decrementPrice(setMinPrice, minPrice)}
                            size="sm"
                          >
                            -
                          </Button>
                          <Form.Control
                            type="text"
                            value={minPrice}
                            onChange={(e) => handlePriceChange(setMinPrice, e.target.value)}
                            style={{...priceInputStyle, height: '31px'}}
                            size="sm"
                          />
                          <Button 
                            style={{...priceButtonStyle, height: '31px'}}
                            onClick={() => incrementPrice(setMinPrice, minPrice)}
                            size="sm"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Form.Label className="mb-1 small">Max Price:</Form.Label>
                        <div className="d-flex">
                          <Button 
                            style={{...priceButtonStyle, height: '31px'}}
                            onClick={() => decrementPrice(setMaxPrice, maxPrice)}
                            size="sm"
                          >
                            -
                          </Button>
                          <Form.Control
                            type="text"
                            value={maxPrice}
                            onChange={(e) => handlePriceChange(setMaxPrice, e.target.value)}
                            style={{...priceInputStyle, height: '31px'}}
                            size="sm"
                          />
                          <Button 
                            style={{...priceButtonStyle, height: '31px'}}
                            onClick={() => incrementPrice(setMaxPrice, maxPrice)}
                            size="sm"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Search by Price and Clear buttons */}
                    <div className="d-flex mt-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={handleSearchByPrice}
                        style={searchButtonStyle}
                        className="me-2"
                      >
                        Search by Price
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={handleClear}
                        style={searchButtonStyle}
                      >
                        Clear
                      </Button>
                    </div>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <h2 style={{ fontFamily: 'Roboto', fontWeight: 'bold', textTransform: 'uppercase' }} className="text-center mb-4">
            CATEGORIES
          </h2>
        </Col>
      </Row>
      
      <Row style={customStyles.productRow}>
        {/* Display 3 blank cards */}
        {[...Array(3)].map((_, index) => (
          <Col xs={12} md={6} lg={4} key={index} className="mb-4">
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}
            >
              <img 
                src="https://via.placeholder.com/150" // Placeholder image
                alt="Placeholder"
                style={{ display: 'block', margin: '0 auto 10px auto' }} // Center the image
              />
              <p style={{ fontWeight: 'bold', margin: '10px 0' }}>Product Name {index + 1}</p> {/* Bold name */}
              <p style={{ margin: '10px 0' }}>Description goes here</p> {/* Centered description */}
              <Button 
                variant="link" 
                style={{
                  padding: '8px 14px',
                  border: '1px solid transparent',
                  color: '#0e368c',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  transition: 'all 0.3s ease',
                  boxShadow: 'none',
                  fontWeight: 'normal',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '1px solid #0e368c';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={() => {
                  console.log('View more clicked');
                }}
              >
                View More
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
