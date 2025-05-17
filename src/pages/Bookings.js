import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Collapse } from 'react-bootstrap';
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

  if (isLoading) {
    return (
      <Container className="mt-5">
        <h2 className="text-center">Loading...</h2>
      </Container>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p className="h4 mb-4">No bookings made yet! <Link to="/products">Start booking</Link>.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="card" style={{ borderRadius: '0' }}>
        <div 
          className="card-header text-center text-white py-2" 
          style={{ backgroundColor: '#373a3c', borderRadius: '0' }}
        >
          <h4 className="mb-0" style={{ fontSize: '1.5rem' }}>Order History</h4>
        </div>
        <div className="card-body">
          {bookings.map((booking, index) => (
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
                Booking #{index + 1} - Booked on: {formatDate(booking.orderedOn)} (Click for Details)
              </Card.Header>
              <Card.Body>
                <div className="mb-2">Items:</div>
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
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
                  Total: ₱{booking.totalPrice}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
