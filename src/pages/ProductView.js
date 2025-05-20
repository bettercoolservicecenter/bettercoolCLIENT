import { useState, useEffect, useContext } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom'; // <-- Add Link import
import UserContext from '../context/UserContext';
import AddToCart from '../components/AddToCart'; // <-- Add this import

// Add this above your ProductView component (or import from a shared file if needed)
const brands = [
  'Eurotek', 'Condura', 'Haier', 'Fujidenzo', 'Whirlpool',
  'Maytag', 'Tecnogas', 'Samsung', 'Exatech', 'Polarstar'
];

const categories = [
  'Washing Machine',
  'Air Conditioner',
  'Refrigerator'
];

export default function ProductView() {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
      })
      .catch(error => console.error('Error:', error));
  }, [productId]);

  const handleQuantityChange = (action) => {
    if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (action === 'increase') {
      setQuantity(quantity + 1);
    }
  };

  const renderActionButton = () => {
    // Allow all users to add to cart, regardless of login status
    return (
      <AddToCart 
        productId={productId}
        quantity={quantity}
        price={product.price}
      />
    );
  };

  if (!product) {
    return <Container>Loading...</Container>;
  }

  // Find the brand from the product name/title
  const detectedBrand = brands.find(brand =>
    product.name && product.name.toLowerCase().includes(brand.toLowerCase())
  ) || 'Unknown';

  // Add this after detectedBrand
  const detectedCategory = categories.find(category =>
    product.name && product.name.toLowerCase().includes(category.toLowerCase())
  ) || 'N/A';

  return (
    <Container style={{ marginTop: '8rem' }}>
      {/* Back to Products link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/products"
          className="back-to-products-link"
          style={{
            fontFamily: "'Roboto', sans-serif",
            color: '#222',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}
        >
          &larr; Back to Products
        </Link>
        <style>
          {`
            .back-to-products-link:hover,
            .back-to-products-link:focus {
              color: #0c4798 !important;
              text-decoration: underline;
            }
          `}
        </style>
      </div>
      <div className="card" style={{ border: 'none', borderRadius: '0', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        {/* Remove card-header, move title below image */}
        <div className="card-body" style={{ paddingTop: 0 }}>
          <Row>
            {/* Image at the top, full width on mobile, left column on desktop */}
            <Col xs={12} md={4} className="d-flex flex-column align-items-center mb-4">
              <img
                src={product.imageUrl || "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg"}
                alt={product.name}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  backgroundColor: 'white',
                  borderRadius: 0
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg";
                }}
              />
            </Col>

            {/* Details Column - 2/3 of the column for desktop */}
            <Col xs={12} md={8}>
              {/* Title above description */}
              <h4
                className="mb-2"
                style={{
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontSize: '1.5rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#222',
                  letterSpacing: '1px'
                }}
              >
                {product.name}
              </h4>
              <p className="card-text" style={{ fontFamily: "'Roboto', sans-serif", color: '#444', fontWeight: 400, fontSize: '1rem' }}>
                {product.description}
              </p>

              {/* Show Category and Brand as text below description */}
              <div className="mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                <div>
                  <label className="me-3" style={{ fontWeight: 500 }}>Category:</label>
                  <span style={{ fontWeight: 500, color: '#0c4798' }}>
                    {detectedCategory}
                  </span>
                </div>
                <div>
                  <label className="me-3" style={{ fontWeight: 500 }}>Brand:</label>
                  <span style={{ fontWeight: 500, color: '#0c4798' }}>
                    {detectedBrand}
                  </span>
                </div>
              </div>

              {/* Move price and quantity to the bottom */}
              <div className="mt-5">
                <div className="d-flex align-items-center mb-3">
                  <label className="me-3" style={{ fontFamily: "'Roboto', sans-serif" }}>Price: </label>
                  <span className="h5 mb-0" style={{ color: '#ff8c00', fontFamily: "'Roboto', sans-serif" }}>₱{product.price}</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <label className="me-3" style={{ fontFamily: "'Roboto', sans-serif" }}>Quantity: </label>
                  <div className="d-flex align-items-center" style={{ width: '150px' }}>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange('decrease')}
                      className="product-qty-btn"
                      style={{
                        marginRight: '0',
                        width: '40px',
                        height: '40px', // Match the input height
                        fontFamily: "'Roboto', sans-serif",
                        borderRadius: '0', // Remove border radius
                        lineHeight: '1'
                      }}
                      onMouseUp={e => e.currentTarget.blur()}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control ps-2"
                      value={quantity}
                      readOnly
                      style={{
                        textAlign: 'center',
                        borderRadius: '0',
                        width: '40px',
                        height: '40px', // Ensure input matches button height
                        fontFamily: "'Roboto', sans-serif"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange('increase')}
                      className="product-qty-btn"
                      style={{
                        marginLeft: '0',
                        width: '40px',
                        height: '40px', // Match the input height
                        fontFamily: "'Roboto', sans-serif",
                        borderRadius: '0', // Remove border radius
                        lineHeight: '1'
                      }}
                      onMouseUp={e => e.currentTarget.blur()}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div 
          className="card-footer" 
          style={{ backgroundColor: '#f8f9fa', borderRadius: '0' }}
        >
          {renderActionButton()}
        </div>
      </div>
      <style>
        {`
          .back-to-products-link:hover,
          .back-to-products-link:focus {
            color: #0c4798 !important;
            text-decoration: underline;
          }
          .product-qty-btn {
            border: 1px solid #0c4798 !important;
            color: #0c4798 !important;
            background: rgba(255,255,255,0.85) !important;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
            border-radius: 6px;
          }
          .product-qty-btn:hover, .product-qty-btn:focus {
            background: #0c4798 !important;
            color: #fff !important;
            border: 1px solid #0c4798 !important;
            box-shadow: 0 2px 8px rgba(69,210,250,0.13);
            transform: scale(1.08);
          }
          .add-to-cart-btn {
            background: #0c4798 !important;
            color: #fff !important;
            border: none !important;
            min-width: 140px;
            max-width: 160px;
            width: 100%;
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
          }
          .add-to-cart-btn:hover, .add-to-cart-btn:focus {
            background: #08306b !important;
            color: #fff !important;
            box-shadow: 0 8px 24px rgba(69,210,250,0.18);
            transform: scale(1.06);
          }

          /* Add this to your CSS or inside a <style> tag in AppNavbar.js */
          
        `}
      </style>
    </Container>
  );
}
