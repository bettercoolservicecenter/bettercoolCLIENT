import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Notyf } from 'notyf';

const Bookings = () => {
  const { email } = useParams(); // Get email from URL parameters
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const notyf = new Notyf();

  useEffect(() => {
    fetchBookings();
  }, [email]); // Fetch bookings whenever the email changes

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/my-bookings/${email}`);
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings);
        await fetchProductDetails(data.bookings);
      } else {
        notyf.error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      notyf.error('An error occurred while fetching bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductDetails = async (bookings) => {
    try {
      const productIds = new Set();
      bookings.forEach(booking => {
        booking.productsBooked.forEach(product => {
          productIds.add(product.productId);
        });
      });

      const productDetails = {};
      await Promise.all(
        Array.from(productIds).map(async (productId) => {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
          const data = await response.json();
          productDetails[productId] = {
            name: data.name,
            price: data.price
          };
        })
      );
      setProducts(productDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
      notyf.error('An error occurred while fetching product details');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Handle invalid date
    }
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/cancel/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (response.ok) {
        notyf.success('Booking canceled successfully');
        fetchBookings(); // Refresh the bookings after canceling
      } else {
        notyf.error(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      notyf.error('An error occurred while canceling the booking');
    }
  };

  if (isLoading) {
    return (
      <Container className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading...</h2>
      </Container>
    );
  }

  // Filter out completed and canceled bookings
  const filteredBookings = bookings.filter(booking => 
    booking.status !== 'Completed' && booking.status !== 'Canceled'
  );

  if (!filteredBookings || filteredBookings.length === 0) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <p className="h4 mb-4">No bookings made yet! <Link to="/products">Start booking</Link>.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <h4 className="text-center" style={{ color: '#222', fontSize: '1.5rem', fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600, letterSpacing: '1px', marginTop: '8rem' }}>Booking History</h4>
      {filteredBookings.map((booking, index) => (
        <Card key={booking._id} className="mb-4" style={{ borderRadius: 0, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <Card.Header
            style={{
              backgroundColor: '#fff',
              color: '#222',
              borderRadius: 0,
              border: 'none',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            Booking #{index + 1} - {formatDate(booking.orderedOn)}
          </Card.Header>
          <Card.Body style={{ fontFamily: "'Roboto', sans-serif" }}>
            <div style={{ color: '#666' }}>
              <strong>Items:</strong>
              <ul style={{ listStyleType: 'circle', paddingLeft: '20px', color: '#666' }}>
                {booking.productsBooked.map((product) => {
                  const productPrice = products[product.productId]?.price || 0;
                  const subtotal = productPrice * product.quantity;

                  return (
                    <li key={product._id}>
                      <Link
                        to={`/products/${product.productId}`}
                        style={{
                          color: '#0d6efd',
                          textDecoration: 'underline',
                          marginBottom: '8px',
                          display: 'inline-block',
                          borderRadius: 0,
                          fontWeight: 500,
                          fontFamily: "'Roboto', sans-serif"
                        }}
                      >
                        {products[product.productId]?.name || 'Loading...'}
                      </Link>
                      <div style={{ color: '#666', marginTop: '4px' }}>
                        <span> - Quantity: {product.quantity}</span>
                        <span style={{ marginLeft: '10px' }}> - Price: ₱{productPrice}</span>
                        <div style={{ marginTop: '4px' }}>
                          <strong>Subtotal:</strong> ₱{subtotal.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <strong>Service Type:</strong> {booking.serviceType || 'N/A'}<br />
              <strong>Size:</strong> {booking.size || 'N/A'}<br />
              <strong>Service Total:</strong> ₱{booking.serviceTotal || '0.00'}<br />
              <strong style={{ color: '#666' }}>Total Price:</strong> <span style={{ color: 'orange' }}>₱{booking.totalPrice}</span><br />
              <strong>Status:</strong> {booking.status || 'Pending'}
            </div>
            <div className="mt-3">
              {booking.status !== 'Canceled' && booking.status !== 'Completed' && (
                <>
                  <Button
                    variant="link"
                    className="clear-cart-btn"
                    onClick={() => cancelBooking(booking._id)}
                    style={{
                      borderRadius: 6,
                      background: '#fff',
                      color: '#0c4798',
                      border: '1px solid #0c4798',
                      fontWeight: 600,
                      fontFamily: "'Roboto', sans-serif",
                      padding: '8px 16px',
                      fontSize: '1rem',
                      transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
                    }}
                  >
                    Cancel Booking
                  </Button>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    You can call us or walk-in at our store to confirm the booking.
                  </p>
                  <a
                    href={`tel:+639389831877`}
                    className="add-to-cart-btn"
                    style={{
                      borderRadius: 6,
                      minWidth: 120,
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      fontSize: '1rem',
                      padding: '8px 16px',
                      fontFamily: 'Roboto, sans-serif',
                      background: '#0c4798',
                      color: '#fff',
                      border: 'none',
                      transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                      display: 'inline-block',
                      textAlign: 'center',
                      textDecoration: 'none',
                      marginTop: 8
                    }}
                  >
                    Call Now
                  </a>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
      <style>
        {`
          .clear-cart-btn {
            background: #fff !important;
            color: #0c4798 !important;
            border: 1px solid #0c4798 !important;
            font-weight: 600;
            font-family: 'Roboto', sans-serif;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 1rem;
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
          .add-to-cart-btn {
            background: #0c4798 !important;
            color: #fff !important;
            border: none !important;
            min-width: 120px;
            font-weight: 600;
            letter-spacing: 0.5px;
            border-radius: 6px;
            box-shadow: 0 6px 18px rgba(69,210,250,0.13);
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
            font-size: 1rem;
            padding: 8px 16px;
            font-family: 'Roboto', sans-serif;
            display: inline-block;
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
          .card {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07) !important;
          }
          .card-header {
            background-color: #fff !important;
            border-radius: 0 !important;
            border: none !important;
            color: #222 !important;
            font-family: 'Roboto', sans-serif !important;
          }
          .card-body {
            font-family: 'Roboto', sans-serif !important;
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8f9fa; /* Light background color */
          }
          .loading-spinner {
            border: 8px solid #f3f3f3; /* Light grey */
            border-top: 8px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite; /* Animation */
            margin-bottom: 20px; /* Space between spinner and text */
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h2 {
            font-family: 'Roboto', sans-serif;
            color: #222; /* Dark text color */
            font-weight: 600;
          }
        `}
      </style>
    </Container>
  );
};

export default Bookings;
