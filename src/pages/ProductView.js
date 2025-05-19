import { useState, useEffect, useContext } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import UserContext from '../context/UserContext';
import AddToCart from '../components/AddToCart';

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

  const handleAddToCart = () => {
    console.log('Adding to cart:', { product, quantity });
  };

  if (!product) {
    return <Container>Loading...</Container>;
  }

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

  return (
    <Container className="mt-5">
      <div className="card" style={{ borderRadius: '0' }}>
        <div 
          className="card-header text-center text-white py-2" 
          style={{ backgroundColor: '#373a3c', borderRadius: '0' }}
        >
          <h4 className="mb-0" style={{ fontSize: '1.5rem' }}>{product.name}</h4>
        </div>
        <div className="card-body">
          <Row>
            {/* Image Column - 1/3 of the column for desktop */}
            <Col xs={12} md={4} className="d-flex justify-content-center mb-4">
              <img
                src={product.imageUrl || "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg"}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  backgroundColor: 'white'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg";
                }}
              />
            </Col>

            {/* Details Column - 2/3 of the column for desktop */}
            <Col xs={12} md={8}>
              <p className="card-text">{product.description}</p>
              
              <div className="mt-3">
                <div className="d-flex align-items-center mb-3">
                  <label className="me-3">Price: </label>
                  <span className="h5 mb-0" style={{ color: '#ff8c00' }}>₱{product.price}</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <label className="me-3">Quantity: </label>
                  <div className="d-flex align-items-center" style={{ width: '150px' }}>
                    <Button 
                      onClick={() => handleQuantityChange('decrease')}
                      className="text-white"
                      style={{ 
                        borderRadius: '0',
                        backgroundColor: '#373a3c',
                        borderColor: '#373a3c',
                        marginRight: '0',
                        width: '40px',
                      }}
                    >
                      -
                    </Button>
                    <input 
                      type="text" 
                      className="form-control ps-2" 
                      value={quantity} 
                      readOnly 
                      style={{ textAlign: 'center', borderRadius: '0', width: '40px' }}
                    />
                    <Button 
                      onClick={() => handleQuantityChange('increase')}
                      className="text-white"
                      style={{ 
                        borderRadius: '0',
                        backgroundColor: '#373a3c',
                        borderColor: '#373a3c',
                        marginLeft: '0',
                        width: '40px'
                      }}
                    >
                      +
                    </Button>
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
    </Container>
  );
}
