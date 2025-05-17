import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';

const GuestInfoModal = ({ show, handleClose, handleSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ name, email, phoneNumber });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Your Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const notyf = new Notyf();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart && cart.cartItems) {
      fetchProductDetails();
    }
  }, [cart]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
        // No Authorization header for unauthenticated access
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
      } else {
        notyf.error(data.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      notyf.error('An error occurred while fetching cart');
    }
  };

  const fetchProductDetails = async () => {
    try {
      const productDetails = {};
      await Promise.all(
        cart.cartItems.map(async (item) => {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`);
          const data = await response.json();
          productDetails[item.productId] = data;
        })
      );
      setProducts(productDetails);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      notyf.error('An error occurred while fetching product details');
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (productId, currentQuantity, action) => {
    let newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    
    // Don't allow quantity less than 1
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Removed Authorization header for unauthenticated access
        },
        body: JSON.stringify({
          productId,
          newQuantity
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCart(prevCart => ({
          ...prevCart,
          cartItems: data.updatedCart.cartItems,
          totalPrice: data.updatedCart.totalPrice
        }));
        notyf.success('Quantity updated successfully');
      } else {
        notyf.error(data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      notyf.error('An error occurred while updating quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
        method: 'PATCH',
        // Removed Authorization header for unauthenticated access
      });

      const data = await response.json();

      if (response.ok) {
        setCart(prevCart => ({
          ...prevCart,
          cartItems: data.updatedCart.cartItems,
          totalPrice: data.updatedCart.totalPrice
        }));
        notyf.success('Item removed from cart successfully');
      } else {
        notyf.error(data.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      notyf.error('An error occurred while removing item from cart');
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
        method: 'PUT',
        // Removed Authorization header for unauthenticated access
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
        notyf.success('Cart cleared successfully');
      } else {
        notyf.error(data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      notyf.error('An error occurred while clearing the cart');
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-5">
        <h2>Loading...</h2>
      </Container>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p className="h4 mb-4">
          Your cart is empty! <Link 
            to="/products" 
            style={{ 
              color: '#0d6efd', 
              textDecoration: 'underline', 
              fontWeight: 'bold' 
            }}
          >
            Start shopping
          </Link>.
        </p>
      </Container>
    );
  }

  const handleBookNow = async (guestInfo) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/book-now/${guestInfo.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: guestInfo.name,
          phoneNumber: guestInfo.phoneNumber,
          email: guestInfo.email,
          totalPrice: cart.totalPrice,
          productsBooked: cart.cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        notyf.success('Booking placed successfully');
        setCart(null);
        navigate(`/bookings/${guestInfo.email}`);
      } else {
        notyf.error(data.message || 'Failed to place booking');
        if (data.message === 'You already have a booking.') {
          navigate(`/bookings/${guestInfo.email}`);
        }
      }
    } catch (error) {
      console.error('Error during booking:', error);
      notyf.error('An error occurred while processing your booking');
    }
  };

  return (
    <Container className="mt-5">
      <div className="card" style={{ borderRadius: '0' }}>
        <div 
          className="card-header text-center text-white py-2" 
          style={{ backgroundColor: '#373a3c', borderRadius: '0' }}
        >
          <h4 className="mb-0" style={{ fontSize: '1.5rem' }}>Your Shopping Cart</h4>
        </div>
        <div className="card-body p-0">
          {/* Desktop view */}
          <div className="d-none d-md-block">
            <Table responsive bordered className="mb-0">
              <thead style={{ backgroundColor: '#373a3c', color: 'white' }}>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item) => {
                  const product = products[item.productId] || {};
                  return (
                    <tr key={item._id}>
                      <td>
                        <Link to={`/products/${item.productId}`} className="text-primary">
                          {product.name || 'Loading...'}
                        </Link>
                      </td>
                      <td>₱{product.price || '...'}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="dark"
                            size="sm"
                            className="me-2"
                            style={{ 
                              borderRadius: 0, 
                              width: '30px', 
                              height: '30px',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem'
                            }}
                            onClick={() => handleQuantityChange(item.productId, item.quantity, 'decrease')}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="dark"
                            size="sm"
                            className="ms-2"
                            style={{ 
                              borderRadius: 0, 
                              width: '30px', 
                              height: '30px',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem'
                            }}
                            onClick={() => handleQuantityChange(item.productId, item.quantity, 'increase')}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>₱{item.subtotal}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ borderRadius: 0 }}
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          
          {/* Mobile view */}
          <div className="d-md-none">
            {cart.cartItems.map((item) => {
              const product = products[item.productId] || {};
              return (
                <div key={item._id} className="p-3 border-bottom">
                  <div className="mb-2">
                    <Link to={`/products/${item.productId}`} className="text-primary">
                      <strong>{product.name || 'Loading...'}</strong>
                    </Link>
                  </div>
                  <div className="mb-2">
                    <strong>Price:</strong> ₱{product.price || '...'}
                  </div>
                  <div className="mb-2">
                    <strong>Quantity:</strong>
                    <div className="d-flex align-items-center mt-1">
                      <Button
                        variant="dark"
                        size="sm"
                        className="me-2"
                        style={{ 
                          borderRadius: 0, 
                          width: '30px', 
                          height: '30px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}
                        onClick={() => handleQuantityChange(item.productId, item.quantity, 'decrease')}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="dark"
                        size="sm"
                        className="ms-2"
                        style={{ 
                          borderRadius: 0, 
                          width: '30px', 
                          height: '30px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}
                        onClick={() => handleQuantityChange(item.productId, item.quantity, 'increase')}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Subtotal:</strong> ₱{item.subtotal}
                  </div>
                  <div>
                    <Button
                      variant="danger"
                      size="sm"
                      style={{ borderRadius: 0 }}
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card-footer" style={{ backgroundColor: '#f8f9fa', borderRadius: '0' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <h3 style={{ color: '#FF6B00' }}>Total: ₱{cart.totalPrice}</h3>
            <div className="d-flex flex-column d-md-block mt-3 mt-md-0">
              <Button
                variant="primary"
                className="me-md-2 mb-2 mb-md-0"
                style={{ borderRadius: 0 }}
                onClick={() => setShowModal(true)}
              >
                Book Now
              </Button>
              <Button
                variant="danger"
                style={{ borderRadius: 0 }}
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      <GuestInfoModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleSubmit={handleBookNow} 
      />
    </Container>
  );
}
