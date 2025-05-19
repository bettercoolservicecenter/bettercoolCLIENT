import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Collapse, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Notyf } from 'notyf';

export default function Bookings() {
  const { email } = useParams(); // Get email from URL parameters
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBookings, setExpandedBookings] = useState({});
  const notyf = new Notyf();

  useEffect(() => {
    fetchBookings();
  }, [email]); // Fetch bookings whenever the email changes

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/my-bookings/${email}`, {
        headers: {
          // No Authorization header for unauthenticated access
        }
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings);
        await fetchProductDetails(data.bookings);
      } else {
        notyf.error(data.message || 'Failed to fetch bookings');
      }

      console.log("Booking data received:", data);
      console.log("Has pending or confirmed:", data.hasPendingOrConfirmed);
      console.log("Bookings length:", data.bookings.length);
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

      console.log('Product IDs to fetch:', Array.from(productIds)); // Debugging line

      const productDetails = {};
      await Promise.all(
        Array.from(productIds).map(async (productId) => {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
          const data = await response.json();
          console.log(`Fetched product details for ${productId}:`, data); // Debugging line
          productDetails[productId] = data;
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

  const toggleBookingDetails = (bookingId) => {
    setExpandedBookings(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const cancelBooking = async (bookingId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/cancel/${bookingId}`, {
            method: 'PATCH', // Assuming you use PATCH to update the booking status
            headers: {
                'Content-Type': 'application/json',
                // No Authorization header for unauthenticated access
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
      <Container className="mt-5">
        <h2 className="text-center">Loading...</h2>
      </Container>
    );
  }

  // Filter out completed and canceled bookings
  const filteredBookings = bookings.filter(booking => 
    booking.status !== 'Completed' && booking.status !== 'Canceled'
  );

  if (!filteredBookings || filteredBookings.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p className="h4 mb-4">No bookings made yet! <Link to="/products">Start booking</Link>.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h4 className="text-center" style={{ color: 'black', fontSize: '1.5rem' }}>Booking History</h4>
      {filteredBookings.map((booking, index) => (
        <Card key={booking._id} className="mb-4" style={{ borderRadius: 0 }}>
          <Card.Header 
            className="text-white" 
            style={{ 
              backgroundColor: '#373a3c', 
              cursor: 'pointer', 
              borderRadius: 0 
            }}
            onClick={() => toggleBookingDetails(booking._id)}
          >
            Booking #{index + 1} - {formatDate(booking.orderedOn)} 
            <Button 
              variant="outline-light"
              size="sm"
              style={{ marginLeft: '10px', borderRadius: '5px' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleBookingDetails(booking._id);
              }}
            >
              Details
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="mb-2" style={{ color: '#666' }}><strong>Items:</strong></div>
            <ul style={{ listStyleType: 'circle', paddingLeft: '20px', color: '#666' }}>
              {booking.productsBooked.map((product) => (
                <li key={product._id}>
                  <Link 
                    to={`/products/${product.productId}`}
                    style={{ 
                      color: '#0d6efd',
                      textDecoration: 'underline',
                      marginBottom: '8px',
                      display: 'inline-block',
                      borderRadius: 0
                    }}
                  >
                    {products[product.productId]?.name || 'Loading...'}
                  </Link>
                  <span style={{ color: '#666' }}> - Quantity: {product.quantity}</span>
                  
                  <Collapse in={expandedBookings[booking._id]}>
                    <div className="mt-2 mb-3 ps-3">
                      <div style={{ color: '#666' }}>
                        Price: ₱{products[product.productId]?.price || '...'}<br/>
                        Description: {products[product.productId]?.description || 'Loading...'}
                      </div>
                    </div>
                  </Collapse>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '15px', color: '#ff6b6b' }}>
              <strong>Total:</strong> ₱{booking.totalPrice}
            </div>
            <div style={{ marginTop: '5px', color: '#666' }}>
              <strong>Status:</strong> {booking.status || 'Pending'}
            </div>
            <div className="mt-3">
              {booking.status !== 'Canceled' && booking.status !== 'Completed' && (
                <>
                  <Button 
                    variant="danger" 
                    onClick={() => cancelBooking(booking._id)} 
                    style={{ borderRadius: '0' }}
                  >
                    Cancel Booking
                  </Button>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    You can call us or walk-in at our store to confirm the booking.
                  </p>
                  <a href={`tel:+639389831877`} className="btn btn-primary btn-sm">
                    Call Now
                  </a>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
