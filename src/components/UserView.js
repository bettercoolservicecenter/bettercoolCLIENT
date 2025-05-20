import { Container, Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function UserView({ productsData = [] }) {
  const location = useLocation();
  const [productName, setProductName] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('10000');
  const [products, setProducts] = useState(productsData);
  const [isSticky, setIsSticky] = useState(false);
  const [accordionHeight, setAccordionHeight] = useState(0);
  const [accordionTop, setAccordionTop] = useState(0);
  const [pendingNavbarScroll, setPendingNavbarScroll] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [accordionActiveKey, setAccordionActiveKey] = useState(null); // Collapsed by default
  const accordionRef = useRef(null);
  const allProductsRef = useRef(null); // Add this ref

  useEffect(() => {
    setProducts(productsData);
  }, [productsData]);

  useEffect(() => {
    // Store the original top position of the accordion
    if (accordionRef.current) {
      setAccordionTop(accordionRef.current.getBoundingClientRect().top + window.scrollY);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 65; // match your fixed navbar height
      if (!accordionRef.current) return;

      // Only measure height when not sticky
      if (!isSticky) {
        setAccordionHeight(accordionRef.current.offsetHeight);
      }

      if (window.scrollY + navbarHeight >= accordionTop) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [accordionTop, isSticky]);

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

  // Scroll to All Products section
  const scrollToAllProducts = () => {
    setTimeout(() => {
      if (allProductsRef.current) {
        const navbarHeight = 65;
        // Add more spacing below the sticky accordion
        const extraSpacing = 48; // Increase this value for more space (was 24)
        const offset = isSticky ? (navbarHeight + accordionHeight + extraSpacing) : (navbarHeight + extraSpacing);
        const top = allProductsRef.current.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 200); // Slightly longer delay for reliability
  };

  // Modified handleSearchByName to accept a name and scroll
  const handleSearchByName = async (name = productName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-name/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const activeProducts = Array.isArray(data) ? data.filter(product => product.isActive) : [];
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleSearchByPrice = () => {
    filterProducts(productName, selectedBrand, minPrice, maxPrice);
  };

  const filterProducts = async (category, brand, min, max) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category || undefined,
          brand: brand || undefined,
          minPrice: min ? parseFloat(min) : undefined,
          maxPrice: max ? parseFloat(max) : undefined
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data.filter(product => product.isActive) : []);
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  };

  const handleClear = () => {
    setProductName('');
    setSelectedBrand('');
    setMinPrice('0');
    setMaxPrice('100000');
    setProducts(productsData);
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
      padding: '0 15px',
      marginTop: '6rem' // Add this line to match Home.js top margin
    },
    productRow: {
      margin: '0 -15px'
    },
    accordionContainer: {
      padding: '0',
      maxWidth: 'calc(100% - 30px)',
      margin: '0 auto'
    }
  };

  // This effect runs when the page loads or when navigation state changes
  useEffect(() => {
    if (location.state && location.state.searchCategory) {
      handleSearchByName(location.state.searchCategory);
      setPendingNavbarScroll(true);
    }
    // eslint-disable-next-line
  }, [location.state]);

  // This effect will scroll after products are updated from a navbar search
  useEffect(() => {
    if (pendingNavbarScroll) {
      scrollToAllProducts();
      setPendingNavbarScroll(false);
    }
  }, [products, pendingNavbarScroll]);

  // Brand list
  const brands = [
    'Eurotek', 'Condura', 'Haier', 'Fujidenzo', 'Whirlpool',
    'Maytag', 'Tecnogas', 'Samsung', 'Exatech', 'Polarstar'
  ];

  // Brand search handler
  const handleBrandSearch = async (brand) => {
    setSelectedBrand(brand);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-name/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: brand })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const activeProducts = Array.isArray(data) ? data.filter(product => product.isActive) : [];
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error searching products by brand:', error);
    }
  };

  // Collapse accordion when it becomes sticky
  useEffect(() => {
    if (isSticky) {
      setAccordionActiveKey(null); // Collapse
    }
  }, [isSticky]);

  // Filter products on parameter change
  useEffect(() => {
    filterProducts(productName, selectedBrand);
    // eslint-disable-next-line
  }, [productName, selectedBrand]);

  return (
    <Container style={customStyles.container}>
      <h2 style={{ fontFamily: 'Roboto', fontWeight: 'bold', textTransform: 'uppercase' }} className="text-center mb-4">
        CATEGORIES
      </h2>
      <Row style={customStyles.productRow}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
            .premium-card {
              background: linear-gradient(135deg, #f8fafc 60%, #e8eaf6 100%);
              border-radius: 0;
              box-shadow: 0 8px 32px 0 rgba(30,60,120,0.18), 0 4px 24px rgba(69,210,250,0.13);
              border: none;
              transition: 
                box-shadow 0.35s cubic-bezier(.4,2,.6,1),
                transform 0.35s cubic-bezier(.4,2,.6,1),
                background 0.35s;
            }
            .premium-card:hover {
              box-shadow: 0 20px 56px 0 rgba(69,210,250,0.22), 0 8px 32px rgba(30,60,120,0.18);
              transform: translateY(-8px) scale(1.025);
              background: linear-gradient(135deg, #f8fafc 40%, #e8faff 100%);
            }
            .premium-card-img {
              transition: transform 0.35s cubic-bezier(.4,2,.6,1), filter 0.3s;
              border-radius: 0;
              box-shadow: none;
              max-height: 320px; /* Increased for more height */
              width: 95%;        /* Almost full width of the card */
              object-fit: contain;
              margin-bottom: 10px;
              margin-left: auto;
              margin-right: auto;
              display: block;
            }
            .premium-card:hover .premium-card-img {
              transform: scale(1.06) rotate(-1deg);
              filter: brightness(1.08) saturate(1.1);
              box-shadow: none;
            }
            .premium-title {
              font-family: 'Poppins', 'Roboto', sans-serif;
              font-weight: 600;
              color: #0c4798;
              letter-spacing: 1px;
              margin: 10px 0 4px 0;
            }
            .premium-desc {
              margin: 8px 0;
              color: #444;
              font-weight: 400;
              font-size: 0.95rem; /* Reduced text size */
            }
            .premium-accent {
              font-weight: 700;
              letter-spacing: 1px;
              color: #0c4798;
            }
            .premium-viewmore-btn {
              padding: 6px 0;
              min-width: 90px;
              max-width: 110px;
              width: 100%;
              font-size: 0.95rem;
              border: 1px solid #0c4798;
              color: #0c4798;
              text-decoration: none;
              border-radius: 6px;
              transition: all 0.3s cubic-bezier(.4,2,.6,1);
              font-weight: 600;
              letter-spacing: 0.5px;
              background: rgba(255,255,255,0.85);
              box-shadow: 0 2px 8px rgba(69,210,250,0.07);
              margin: 0 auto;
            }
            .premium-viewmore-btn:hover, .premium-viewmore-btn:focus {
              background: #0c4798;
              color: #fff !important;
              border: none;
              box-shadow: 0 6px 18px rgba(69,210,250,0.13);
              transform: scale(1.06);
            }
            .premium-viewmore-btn:hover .premium-accent,
            .premium-viewmore-btn:focus .premium-accent {
              color: #fff !important;
            }
          `}
        </style>
        {/* Card 1: Air Conditioner */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <div
            className="premium-card"
            style={{
              padding: '20px 16px 16px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={() => {
              handleSearchByName('Air Conditioner');
              scrollToAllProducts();
            }}
          >
            <img 
              src="https://i.ibb.co/R4ZsKHqs/can-you-generate-an-image-of-a-air-conditioner-in-a-room-with-sky-blue-ambient-it-should-feel-luxur.jpg"
              alt="Air Conditioner"
              className="premium-card-img"
              style={{ display: 'block', margin: '0 auto', maxHeight: 320, width: '95%', objectFit: 'contain' }} 
            />
            <p className="premium-title">Air Conditioner</p>
            <p className="premium-desc">Stay cool with our latest air conditioners.</p>
            <Button 
              variant="link" 
              className="premium-viewmore-btn"
              onClick={e => {
                e.stopPropagation();
                handleSearchByName('Air Conditioner');
                scrollToAllProducts();
              }}
              onMouseUp={e => e.currentTarget.blur()} // <-- Add this line
            >
              <span className="premium-accent">View More</span>
            </Button>
          </div>
        </Col>

        {/* Card 2: Refrigerator */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <div
            className="premium-card"
            style={{
              padding: '20px 16px 16px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={() => {
              handleSearchByName('Refrigerator');
              scrollToAllProducts();
            }}
          >
            <img 
              src="https://i.ibb.co/082ZRtw/can-you-generate-an-image-of-a-refrigerator-in-a-room-with-sky-blue-ambient-it-should-feel-luxuriou.jpg"
              alt="Refrigerator"
              className="premium-card-img"
              style={{ display: 'block', margin: '0 auto', maxHeight: 320, width: '95%', objectFit: 'contain' }} 
            />
            <p className="premium-title">Refrigerator</p>
            <p className="premium-desc">Keep your food fresh and cool.</p>
            <Button 
              variant="link" 
              className="premium-viewmore-btn"
              onClick={e => {
                e.stopPropagation();
                handleSearchByName('Refrigerator');
                scrollToAllProducts();
              }}
              onMouseUp={e => e.currentTarget.blur()}
            >
              <span className="premium-accent">View More</span>
            </Button>
          </div>
        </Col>

        {/* Card 3: Washing Machine */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <div
            className="premium-card"
            style={{
              padding: '20px 16px 16px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={() => {
              handleSearchByName('Washing Machine');
              scrollToAllProducts();
            }}
          >
            <img 
              src="https://i.ibb.co/YBXyMtQk/can-you-generate-an-image-of-a-washing-machine-in-a-room-with-sky-blue-ambient-it-should-feel-luxur.jpg"
              alt="Washing Machine"
              className="premium-card-img"
              style={{ display: 'block', margin: '0 auto', maxHeight: 320, width: '95%', objectFit: 'contain' }} 
            />
            <p className="premium-title">Washing Machine</p>
            <p className="premium-desc">Efficient and powerful cleaning.</p>
            <Button 
              variant="link" 
              className="premium-viewmore-btn"
              onClick={e => {
                e.stopPropagation();
                handleSearchByName('Washing Machine');
                scrollToAllProducts();
              }}
              onMouseUp={e => e.currentTarget.blur()}
            >
              <span className="premium-accent">View More</span>
            </Button>
          </div>
        </Col>
      </Row>

      {/* Accordion goes here */}
      <style>
        {`
          @media (min-width: 992px) {
            .sticky-accordion {
              position: sticky;
              top: 70px; /* Slightly more than navbar height */
              z-index: 900; /* Lower than navbar z-index */
            }
          }
        `}
      </style>
      <>
        {/* Sticky Accordion Placeholder */}
        <div style={{ height: isSticky ? accordionHeight : 0 }} />

        <div
          ref={accordionRef}
          style={{
            ...customStyles.accordionContainer,
            padding: 0, // Always no padding for both static and sticky
            margin: '0 auto', // Always center
            position: isSticky ? 'fixed' : 'static',
            top: isSticky ? 65 : 'auto',
            left: isSticky ? '50%' : undefined,
            transform: isSticky ? 'translateX(-50%)' : undefined,
            zIndex: 900,
            width: '600px', // Always fixed width for both
            maxWidth: '95vw',
            background: '#fff', // Always white background
            boxShadow: '0 8px 32px 0 rgba(30,60,120,0.18), 0 4px 24px rgba(69,210,250,0.13)', // Always shadow
            minHeight: 'auto',
            height: 'auto',
            overflow: 'visible'
          }}
        >
          <style>{customAccordionStyles}</style>
          <Accordion
            activeKey={accordionActiveKey}
            onSelect={setAccordionActiveKey}
            className={isSticky ? '' : 'mb-4'}
            style={{
              margin: isSticky ? 0 : '2rem 0 1.5rem 0',
              padding: isSticky ? 0 : undefined,
              minHeight: isSticky ? 'auto' : undefined,
              height: isSticky ? 'auto' : undefined,
              overflow: isSticky ? 'visible' : undefined
            }}
          >
            <Accordion.Item eventKey="0" className="border">
              <Accordion.Header>
                <span className="fw-bold">Filter</span>
              </Accordion.Header>
              <Accordion.Body>
                <Form className="compact-form">
                  {/* Categories Radio Buttons */}
                  <Form.Group className="mb-3">
                    <Form.Label className="mb-1 small">Categories:</Form.Label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {['Air Conditioner', 'Refrigerator', 'Washing Machine'].map((category) => (
                        <Form.Check
                          key={category}
                          inline
                          type="radio"
                          label={category}
                          name="categoryRadios"
                          id={`category-radio-${category}`}
                          checked={productName === category}
                          onChange={() => setProductName(category)} // for category
                          style={{ marginRight: '8px', marginBottom: '4px' }}
                        />
                      ))}
                    </div>
                  </Form.Group>

                  {/* Brands Radio Buttons */}
                  <Form.Group className="mb-3">
                    <Form.Label className="mb-1 small">Brands:</Form.Label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {brands.map((brand) => (
                        <Form.Check
                          key={brand}
                          inline
                          type="radio"
                          label={brand}
                          name="brandRadios"
                          id={`brand-radio-${brand}`}
                          checked={selectedBrand === brand}
                          onChange={() => setSelectedBrand(brand)}  // for brand
                          style={{ marginRight: '8px', marginBottom: '4px' }}
                        />
                      ))}
                    </div>
                  </Form.Group>
                  
                  {/* Search by Name button on a single line */}
                  

                  {/* Price Range section - both fields side by side on the left */}
                  <div className="d-flex mb-3 justify-content-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <div className="me-3">
                      <Form.Label className="mb-1 small">Min Price:</Form.Label>
                      <div className="d-flex">
                        <Button
                          className="price-adjust-btn"
                          style={{
                            ...priceButtonStyle,
                            height: '31px'
                          }}
                          onClick={() => decrementPrice(setMinPrice, minPrice)}
                          size="sm"
                        >
                          -
                        </Button>
                        <Form.Control
                          type="text"
                          value={minPrice}
                          onChange={(e) => handlePriceChange(setMinPrice, e.target.value)}
                          style={{ ...priceInputStyle, height: '31px', width: '72px', textAlign: 'center' }}
                          size="sm"
                          placeholder="0"
                        />
                        <Button
                          className="price-adjust-btn"
                          style={{
                            ...priceButtonStyle,
                            height: '31px'
                          }}
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
                          className="price-adjust-btn"
                          style={{
                            ...priceButtonStyle,
                            height: '31px'
                          }}
                          onClick={() => decrementPrice(setMaxPrice, maxPrice)}
                          size="sm"
                        >
                          -
                        </Button>
                        <Form.Control
                          type="text"
                          value={maxPrice}
                          onChange={(e) => handlePriceChange(setMaxPrice, e.target.value)}
                          style={{ ...priceInputStyle, height: '31px', width: '72px', textAlign: 'center' }}
                          size="sm"
                          placeholder="0"
                        />
                        <Button
                          className="price-adjust-btn"
                          style={{
                            ...priceButtonStyle,
                            height: '31px'
                          }}
                          onClick={() => incrementPrice(setMaxPrice, maxPrice)}
                          size="sm"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Filter by Price and Clear buttons - single line, centered */}
                  <div className="d-flex mt-2 justify-content-center" style={{ maxWidth: 360, margin: '0 auto' }}>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleClear}
                      style={{
                        ...searchButtonStyle,
                        border: '1px solid #0c4798',
                        color: '#0c4798',
                        background: 'rgba(255,255,255,0.85)',
                        minWidth: 90,
                        maxWidth: 110,
                        width: '100%',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(69,210,250,0.07)',
                        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                        marginRight: 12
                      }}
                      className="premium-viewmore-btn"
                    >
                      <span className="premium-accent">Clear</span>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleSearchByPrice}
                      style={{
                        ...searchButtonStyle,
                        background: '#0c4798',
                        color: '#fff',
                        border: 'none',
                        minWidth: 140,
                        maxWidth: 160,
                        width: '100%',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        borderRadius: 6,
                        boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
                        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
                      }}
                      className="premium-viewmore-btn"
                    >
                      <span className="premium-accent" style={{ color: '#fff' }}>Filter by Price</span>
                    </Button>
                  </div>
                  <style>
                  {`
                  .premium-viewmore-btn:hover, .premium-viewmore-btn:focus {
                    background: #0c4798 !important;
                    color: #fff !important;
                    border: none !important;
                    box-shadow: 0 6px 18px rgba(69,210,250,0.13);
                    transform: scale(1.06);
                  }
                  .premium-viewmore-btn:hover .premium-accent,
                  .premium-viewmore-btn:focus .premium-accent {
                    color: #fff !important;
                  }
                  `}
                  </style>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </>

      {/* All Products */}
      <h2
        ref={allProductsRef}
        style={{ fontFamily: 'Roboto', fontWeight: 'bold', textTransform: 'uppercase' }}
        className="text-center mb-4"
      >
        All Products
      </h2>
      <Row style={customStyles.productRow}>
        {products.map(product => (
          <Col xs={12} md={6} lg={4} key={product._id} className="mb-4">
            <ProductCard productProp={product} />
          </Col>
        ))}
      </Row>

      <style>
        {`
          .price-adjust-btn {
            border: 1px solid #0c4798 !important;
            color: #0c4798 !important;
            background: rgba(255,255,255,0.85) !important;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
          }
          .price-adjust-btn:hover, .price-adjust-btn:focus {
            background: #0c4798 !important;
            color: #fff !important;
            border: 1px solid #0c4798 !important;
            box-shadow: 0 2px 8px rgba(69,210,250,0.13);
            transform: scale(1.08);
          }
        `}
      </style>
    </Container>
  );
}
