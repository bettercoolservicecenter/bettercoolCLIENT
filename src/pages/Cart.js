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
          <Button 
            variant="primary" 
            type="submit" 
            style={{
                borderRadius: '6px',
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
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default function Cart({ setCartItemCount }) {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const notyf = new Notyf();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
    fetchCartItemCount();
  }, []);

  useEffect(() => {
    if (cart && cart.cartItems) {
      fetchProductDetails();
    }
  }, [cart]);

  const fetchCartItemCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/cart-item-count`);
      const data = await response.json();
      if (response.ok) {
        setCartItemCount(data.totalQuantity);
      }
    } catch (error) {
      console.error('Error fetching cart item count:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`);
      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
        let totalItemCount = 0;
        data.cart.cartItems.forEach(item => {
          totalItemCount += item.quantity;
        });
        setCartItemCount(totalItemCount);
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
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, newQuantity })
      });

      const data = await response.json();

      if (response.ok) {
        setCart(prevCart => ({
          ...prevCart,
          cartItems: data.updatedCart.cartItems,
          totalPrice: data.updatedCart.totalPrice
        }));
        let totalItemCount = 0;
        data.updatedCart.cartItems.forEach(item => {
          totalItemCount += item.quantity;
        });
        setCartItemCount(totalItemCount);
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
      });

      const data = await response.json();

      if (response.ok) {
        setCart(prevCart => ({
          ...prevCart,
          cartItems: data.updatedCart.cartItems,
          totalPrice: data.updatedCart.totalPrice
        }));
        let totalItemCount = 0;
        data.updatedCart.cartItems.forEach(item => {
          totalItemCount += item.quantity;
        });
        setCartItemCount(totalItemCount);
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
      });

      const data = await response.json();

      if (response.ok) {
        setCart(null);
        setCartItemCount(0);
        notyf.success('Cart cleared successfully');
      } else {
        notyf.error(data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      notyf.error('An error occurred while clearing the cart');
    }
  };

  const handleBookNow = async (guestInfo) => {
    const bookingData = {
      email: guestInfo.email,
      name: guestInfo.name,
      phoneNumber: guestInfo.phoneNumber,
      totalPrice: cart.totalPrice,
      productsBooked: cart.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      serviceType: selectedService,
      size: selectedSize,
      serviceTotal: totalPrice
    };

    try {
      // Check for existing bookings
      const existingResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/my-bookings/${bookingData.email}`);
      const existingData = await existingResponse.json();

      if (existingResponse.ok) {
        // Check if there are existing bookings
        if (existingData.bookings.length > 0) {
          const existingBooking = existingData.bookings[0]; // Assuming we are checking the first booking

          // Allow booking if the existing booking is for a product or if productsBooked is empty
          if (existingBooking.serviceType && existingBooking.size) {
            // Check if productsBooked is empty
            if (existingBooking.productsBooked.length === 0) {
              // Proceed with updating the existing booking
              const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/update/${existingBooking._id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
              });

              if (response.ok) {
                notyf.success('Product booked successfully!');
                await handleClearCart();
                navigate(`/bookings/${bookingData.email}`);
              } else {
                const errorData = await response.json();
                notyf.error(errorData.message || 'Failed to update booking');
              }
              return; // Prevent further execution
            } else {
              notyf.error('You cannot book a product while you have a pending service.');
              return; // Prevent further execution
            }
          }
        }

        // If no existing bookings, create a new booking
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/book-now/${bookingData.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        if (response.ok) {
          notyf.success('Product booked successfully!');
          await handleClearCart();
          navigate(`/bookings/${bookingData.email}`);
        } else {
          const errorData = await response.json();
          notyf.error(errorData.message || 'Failed to book product');
        }
      } else {
        notyf.error('Failed to fetch existing bookings');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      notyf.error('An error occurred while processing your booking');
    }

    setShowModal(false);
  };

  if (isLoading) {
    return (
      <Container className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading...</h2>
      </Container>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <Container className="mt-5 text-center pt-5">
        <p className="h4 mb-4" style={{ fontFamily: "'Roboto', sans-serif", color: '#222', fontWeight: 500 }}>
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

  return (
    <Container style={{ marginTop: '8rem', fontFamily: "'Roboto', sans-serif" }}>
      <div className="card" style={{ border: 'none', borderRadius: '0', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <div className="card-header text-center py-2" style={{ backgroundColor: '#fff', borderRadius: '0', border: 'none' }}>
          <h4 className="mb-0" style={{ fontSize: '1.5rem', color: '#222', fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, letterSpacing: '1px' }}>
            Your Shopping Cart
          </h4>
        </div>
        <div className="card-body p-0">
          {/* Desktop view */}
          <div className="d-none d-md-block">
            <Table responsive bordered={false} className="mb-0" style={{ fontFamily: "'Roboto', sans-serif" }}>
              <thead style={{ backgroundColor: '#f8f9fa', color: '#222', fontWeight: 600 }}>
                <tr>
                  <th style={{ border: 'none' }}>Name</th>
                  <th style={{ border: 'none' }}>Price</th>
                  <th style={{ border: 'none' }}>Quantity</th>
                  <th style={{ border: 'none' }}>Subtotal</th>
                  <th style={{ border: 'none' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item) => {
                  const product = products[item.productId] || {};
                  return (
                    <tr key={item._id} style={{ border: 'none' }}>
                      <td style={{ border: 'none', verticalAlign: 'middle' }}>
                        <Link to={`/products/${item.productId}`} style={{ color: '#0c4798', textDecoration: 'none', fontWeight: 500 }}>
                          {product.name || 'Loading...'}
                        </Link>
                      </td>
                      <td style={{ border: 'none', verticalAlign: 'middle' }}>₱{product.price || '...'}</td>
                      <td style={{ border: 'none', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="link"
                            className="product-qty-btn"
                            style={{
                              marginRight: 0,
                              width: '40px',
                              height: '40px',
                              fontFamily: "'Roboto', sans-serif",
                              borderRadius: 0,
                              lineHeight: '1'
                            }}
                            onClick={() => handleQuantityChange(item.productId, item.quantity, 'decrease')}
                            onMouseUp={e => e.currentTarget.blur()}
                          >
                            -
                          </Button>
                          <span style={{ width: 40, textAlign: 'center', display: 'inline-block' }}>{item.quantity}</span>
                          <Button
                            variant="link"
                            className="product-qty-btn"
                            style={{
                              marginLeft: 0,
                              width: '40px',
                              height: '40px',
                              fontFamily: "'Roboto', sans-serif",
                              borderRadius: 0,
                              lineHeight: '1'
                            }}
                            onClick={() => handleQuantityChange(item.productId, item.quantity, 'increase')}
                            onMouseUp={e => e.currentTarget.blur()}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td style={{ border: 'none', verticalAlign: 'middle' }}>₱{item.subtotal}</td>
                      <td style={{ border: 'none', verticalAlign: 'middle' }}>
                        <Button
                          variant="danger"
                          className="clear-cart-btn"
                          style={{
                            borderRadius: 6,
                            background: '#fff',
                            color: '#ff6b00',
                            border: '1px solid #ff6b00',
                            fontWeight: 600,
                            fontFamily: "'Roboto', sans-serif",
                            padding: '8px 16px',
                            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
                          }}
                          onClick={() => handleRemoveItem(item.productId)}
                          onMouseUp={e => e.currentTarget.blur()}
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
                <div key={item._id} className="p-3 border-bottom" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  <div className="mb-2">
                    <Link to={`/products/${item.productId}`} style={{ color: '#0c4798', textDecoration: 'none', fontWeight: 500 }}>
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
                        variant="link"
                        className="product-qty-btn"
                        style={{
                          marginRight: 0,
                          width: '40px',
                          height: '40px',
                          fontFamily: "'Roboto', sans-serif",
                          borderRadius: 0,
                          lineHeight: '1'
                        }}
                        onClick={() => handleQuantityChange(item.productId, item.quantity, 'decrease')}
                        onMouseUp={e => e.currentTarget.blur()}
                      >
                        -
                      </Button>
                      <span style={{ width: 40, textAlign: 'center', display: 'inline-block' }}>{item.quantity}</span>
                      <Button
                        variant="link"
                        className="product-qty-btn"
                        style={{
                          marginLeft: 0,
                          width: '40px',
                          height: '40px',
                          fontFamily: "'Roboto', sans-serif",
                          borderRadius: 0,
                          lineHeight: '1'
                        }}
                        onClick={() => handleQuantityChange(item.productId, item.quantity, 'increase')}
                        onMouseUp={e => e.currentTarget.blur()}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Subtotal:</strong> ₱{item.subtotal}
                  </div>
                  <div className="d-flex flex-row gap-2 align-items-center">
                    <Button
                      variant="link"
                      className="clear-cart-btn"
                      style={{
                        borderRadius: 6,
                        background: '#fff',
                        color: '#0c4798',
                        border: '1px solid #0c4798',
                        fontWeight: 600,
                        fontFamily: "'Roboto', sans-serif",
                        padding: '8px 16px',
                        minWidth: 90,
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
                      }}
                      onClick={() => handleRemoveItem(item.productId)}
                      onMouseUp={e => e.currentTarget.blur()}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Buttons below the card */}
        <div className="d-flex flex-column align-items-start mt-3">
          <h3 style={{ color: '#ff8c00', fontFamily: "'Roboto', sans-serif", fontWeight: 300, }}>Total: ₱{cart.totalPrice}</h3>
          <div className="d-flex flex-row gap-2">
            <Button
              variant="link"
              className="add-to-cart-btn"
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
              onClick={() => setShowModal(true)}
              onMouseUp={e => e.currentTarget.blur()}
            >
              Book Now
            </Button>
            <Button
              variant="link"
              className="clear-cart-btn"
              style={{
                borderRadius: 6,
                background: '#fff',
                color: '#0c4798',
                border: '1px solid #0c4798',
                fontWeight: 600,
                fontFamily: "'Roboto', sans-serif",
                padding: '8px 16px',
                minWidth: 140,
                maxWidth: 140,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
              }}
              onClick={handleClearCart}
              onMouseUp={e => e.currentTarget.blur()}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      <GuestInfoModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleSubmit={handleBookNow} 
      />

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book a Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleBookNow}>
            Book Now
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .product-qty-btn {
            border: 1px solid #0c4798 !important;
            color: #0c4798 !important;
            background: rgba(255,255,255,0.85) !important;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
            border-radius: 6px;
            text-decoration: none !important;
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
            font-family: 'Roboto', sans-serif';
            margin: 0 auto;
            display: block;
            text-align: center;
            text-decoration: none !important;
          }
          .add-to-cart-btn:hover, .add-to-cart-btn:focus {
            background: #08306b !important;
            color: #fff !important;
            box-shadow: 0 8px 24px rgba(69,210,250,0.18);
            transform: scale(1.06);
            text-decoration: none !important;
          }
          .clear-cart-btn {
            background: #fff !important;
            color: #0c4798 !important;
            border: 1px solid #0c4798 !important;
            font-weight: 600;
            font-family: 'Roboto', sans-serif;
            border-radius: 6px;
            padding: 8px 16px;
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
            text-decoration: none !important;
          }
          .clear-cart-btn:hover, .clear-cart-btn:focus {
            background: #0c4798 !important;
            color: #fff !important;
            border: 1px solid #0c4798 !important;
            box-shadow: 0 2px 8px rgba(69,210,250,0.13);
            transform: scale(1.08);
            text-decoration: none !important;
          }
        `}
      </style>
    </Container>
  );
}
