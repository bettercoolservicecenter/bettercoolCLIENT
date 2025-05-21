import { useState, useEffect, useContext } from 'react';
import { 
  Table, 
  Container, 
  Modal, 
  Form, 
  Button,
  Card,
  Collapse 
} from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../context/UserContext';
import { Link } from 'react-router-dom';

const DescriptionModal = ({ show, handleClose, description }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product Description</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );


export default function AdminDashboard({ productsData, fetchData }) {
  const { user } = useContext(UserContext);
  const notyf = new Notyf();
  
  const [products, setProducts] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [allBookings, setAllBookings] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [showDescription, setShowDescription] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    if (!Array.isArray(productsData)) return;
    const productArr = productsData.map(product => ({
      ...product,
      isActive: product.isActive === 'true' || product.isActive === true
    }));
    setProducts(productArr);
  }, [productsData]);

  useEffect(() => {
    if (newProduct.name && 
        newProduct.description && 
        newProduct.price && 
        !isNaN(newProduct.price)) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [newProduct]);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/all-bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      console.log('API Response:', data); // Log the response

      if (response.ok) {
        setAllBookings(data.bookings); // Assuming data.bookings is the correct structure
      } else {
        notyf.error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      notyf.error('An error occurred while fetching bookings');
    }
  };

  useEffect(() => {
    if (showBookings) {
      fetchAllBookings();
    }
  }, [showBookings]);

  const toggleUserBookings = (userEmail) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userEmail]: !prev[userEmail]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const toggleView = () => {
    if (!showBookings) {
      fetchAllBookings();
    }
    setShowBookings(!showBookings);
  };

  const handleShowDescription = (description) => {
      setSelectedDescription(description);
      setShowDescription(true);
    };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.isAdmin) {
      notyf.error('You must be an admin to add a product');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      notyf.error('You need to be logged in as an admin');
      return;
    }

    const productData = {
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      imageUrl: newProduct.imageUrl // Add imageUrl to the product data
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (response.ok) {
        notyf.success('Product added successfully');
        handleClose();
        fetchData();
      } else {
        if (data.message === 'Product already exists') {
          notyf.error('Product already exists');
        } else {
          notyf.error('Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error while adding the product:', error);
      notyf.error('An error occurred while adding the product');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewProduct({
      name: '',
      description: '',
      price: ''
    });
  };

  const handleShow = () => setShowModal(true);

  

    

     const tableStyles = {
         container: {
           padding: '20px',
           maxWidth: '1200px',
           margin: '0 auto',
           fontFamily: "'Roboto', sans-serif"
         },
         header: {
           textAlign: 'center',
           marginBottom: '30px'
         },
         title: {
           fontSize: '28px',
           fontWeight: '600',
           color: '#222',
           marginBottom: '20px',
           fontFamily: "'Poppins', 'Roboto', sans-serif",
           letterSpacing: '1px'
         },
         buttonGroup: {
           marginBottom: '30px',
           display: 'flex',
           justifyContent: 'center'
         },
         headerButton: {
           borderRadius: 6,
           fontFamily: "'Roboto', sans-serif",
           fontWeight: 600,
           background: '#0c4798',
           color: '#fff',
           border: 'none',
           marginRight: 10,
           minWidth: 140,
           maxWidth: 160,
           letterSpacing: '0.5px',
           fontSize: '1rem',
           boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
           transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
         },
         table: {
           backgroundColor: '#fff',
           borderRadius: '8px',
           boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
           fontFamily: "'Roboto', sans-serif"
         },
         tableHeader: {
           backgroundColor: '#373a3c',
           color: '#fff',
           fontWeight: '600',
           fontFamily: "'Roboto', sans-serif"
         },
         actionButton: {
           width: '100px',
           borderRadius: 6,
           display: 'block',
           marginBottom: '5px',
           textAlign: 'center',
           fontFamily: "'Roboto', sans-serif",
           fontWeight: 600,
           background: '#0c4798',
           color: '#fff',
           border: 'none',
           letterSpacing: '0.5px',
           fontSize: '1rem',
           boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
           transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
         },
         actionButtonContainer: {
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           padding: '0 10px'
         },
         price: {
           fontWeight: '600',
           color: '#ff8c00',
           fontFamily: "'Roboto', sans-serif"
         },
         modal: {
           content: {
             padding: '20px',
             fontFamily: "'Roboto', sans-serif"
           },
           footer: {
             borderTop: '1px solid #dee2e6',
             padding: '1rem'
           }
         }
       };

       

         
      const handleUpdateClick = (product) => {
          setProductToUpdate({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl || '' // Add this line
          });
          setShowUpdateModal(true);
        };

        const handleUpdateClose = () => {
          setShowUpdateModal(false);
          setProductToUpdate({
            _id: '',
            name: '',
            description: '',
            price: ''
          });
        };

        const handleUpdateSubmit = async (e) => {
          e.preventDefault();

          // Validate data
          if (!productToUpdate.name || !productToUpdate.description || !productToUpdate.price) {
            notyf.error('All fields are required');
            return;
          }

          const numericPrice = parseFloat(productToUpdate.price);
          if (isNaN(numericPrice) || numericPrice <= 0) {
            notyf.error('Price must be a valid positive number');
            return;
          }

          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productToUpdate._id}/update`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                name: productToUpdate.name,
                description: productToUpdate.description,
                price: numericPrice,
                imageUrl: productToUpdate.imageUrl
              })
            });

            const data = await response.json();
            if (response.ok) {
              // Update the local state immediately with all fields including imageUrl
              setProducts(products.map(product => 
                product._id === productToUpdate._id 
                  ? {
                      ...product,
                      name: productToUpdate.name,
                      description: productToUpdate.description,
                      price: numericPrice,
                      imageUrl: productToUpdate.imageUrl
                    }
                  : product
              ));
              
              notyf.success('Product updated successfully');
              handleUpdateClose();
              // No need to fetch data again as we've already updated the state
            } else {
              notyf.error(data.message || 'Failed to update product');
            }
          } catch (error) {
            console.error('Error updating product:', error);
            notyf.error('An error occurred while updating the product');
          }
        };

        const handleArchive = async (productId, currentStatus) => {
          try {
            // If product is currently active, we archive it, otherwise we activate it
            const endpoint = currentStatus ? 'archive' : 'activate';
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/${endpoint}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            const data = await response.json();
            if (response.ok) {
              notyf.success(currentStatus ? 'Product archived successfully' : 'Product activated successfully');
              fetchData();
            } else {
              notyf.error(data.message || 'Operation failed');
            }
          } catch (error) {
            console.error('Error toggling product status:', error);
            notyf.error('An error occurred');
          }
        };

        const confirmBooking = async (bookingId) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/confirm/${bookingId}`, {
                    method: 'PATCH', // Assuming you use PATCH to update the booking status
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    notyf.success('Booking confirmed successfully');
                    fetchAllBookings(); // Refresh the bookings after confirming
                } else {
                    notyf.error(data.message || 'Failed to confirm booking');
                }
            } catch (error) {
                console.error('Error confirming booking:', error);
                notyf.error('An error occurred while confirming the booking');
            }
        };

        const completeBooking = async (bookingId) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/complete/${bookingId}`, {
                    method: 'PATCH', // Assuming you use PATCH to update the booking status
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    notyf.success('Booking completed successfully');
                    fetchAllBookings(); // Refresh the bookings after completing
                } else {
                    notyf.error(data.message || 'Failed to complete booking');
                }
            } catch (error) {
                console.error('Error completing booking:', error);
                notyf.error('An error occurred while completing the booking');
            }
        };

        const filteredBookings = Object.entries(allBookings).filter(([userEmail]) =>
            userEmail.toLowerCase().includes(searchEmail.toLowerCase())
        );

      return (
        <>
          <Container style={tableStyles.container} className='pt-5 mt-5'>
            <div style={tableStyles.header}>
              <h1 style={tableStyles.title}>Admin Dashboard</h1>
              <div style={tableStyles.buttonGroup}>
                <Button 
                  variant="primary" 
                  onClick={handleShow}
                  style={tableStyles.headerButton}
                  onMouseUp={e => e.currentTarget.blur()}
                >
                  Add New Product
                </Button>
                <Button 
                  variant={showBookings ? "danger" : "success"}
                  style={tableStyles.headerButton}
                  onClick={toggleView}
                  onMouseUp={e => e.currentTarget.blur()}
                >
                  {showBookings ? 'Show Product Details' : 'Show User Bookings'}
                </Button>
              </div>
              {showBookings && (
                <Form.Control
                  type="text"
                  placeholder="Search by email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />
              )}
            </div>

            {showBookings ? (
              <div className="mt-4">
                {filteredBookings.map(([userEmail, userBookings]) => (
                  <Card key={userEmail} className="mb-3">
                    <Card.Header
                      className="text-white"
                      style={{ 
                        backgroundColor: '#373a3c', 
                        cursor: 'pointer',
                        borderRadius: 0
                      }}
                      onClick={() => toggleUserBookings(userEmail)}
                    >
                      Bookings for: {userEmail}
                    </Card.Header>
                    <Collapse in={expandedUsers[userEmail]}>
                      <Card.Body>
                        {userBookings.map((booking) => {
                          const subtotal = booking.productsBooked.reduce((total, product) => total + product.subtotal, 0);
                          const serviceTotal = booking.serviceTotal || 0; // Assuming serviceTotal is part of the booking object

                          const total = subtotal + serviceTotal; // Calculate the total

                          return (
                            <div key={booking._id} className="mb-3">
                              <div className="mb-2">
                                Booked on {formatDate(booking.orderedOn)}:
                              </div>
                              <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                                {booking.productsBooked.map((product) => (
                                  <li key={product._id}>
                                    Quantity: {product.quantity}
                                    <div style={{ color: '#666' }}>
                                      Subtotal: ₱{product.subtotal}
                                    </div>
                                    <div style={{ color: '#666' }}>
                                      Product Name: <Link to={`/products/${product.productId}`} style={{ color: '#0d6efd', textDecoration: 'underline' }}>
                                        {product.name}
                                      </Link>
                                    </div>
                                    <div style={{ color: '#666', marginLeft: '20px' }}>
                                      Service Type: {booking.serviceType || 'N/A'}<br />
                                      Size: {booking.size || 'N/A'}<br />
                                      Service Total: ₱{serviceTotal || '0.00'}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                Total: ₱{total} {/* Display the combined total */}
                              </div>
                              <div>
                                Status: <strong>{booking.status}</strong>
                              </div>
                            </div>
                          );
                        })}
                      </Card.Body>
                    </Collapse>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <Table bordered responsive style={tableStyles.table}>
                  <thead>
                    <tr>
                      <th style={{width: '25%', color: '#222', backgroundColor: 'transparent'}}>Name</th>
                      <th className="d-none d-lg-table-cell" style={{width: '45%', color: '#222', backgroundColor: 'transparent'}}>Description</th>
                      <th className="d-lg-none d-sm-none" style={{width: '15%', textAlign: 'center', color: '#222', backgroundColor: 'transparent'}}>View</th>
                      <th style={{width: '25%', textAlign: 'center', color: '#222', backgroundColor: 'transparent'}}>Price</th>
                      <th className="d-none d-sm-table-cell" style={{width: '25%', textAlign: 'center', color: '#222', backgroundColor: 'transparent'}}>Availability</th>
                      <th className="d-none d-sm-table-cell" style={{width: '25%', textAlign: 'center', color: '#222', backgroundColor: 'transparent'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          {product.name}

                          {product.imageUrl ? (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              margin: '10px 0',
                              width: '100%'
                            }}>
                              <img 
                                src={product.imageUrl}
                                alt={product.name}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  maxHeight: '200px',
                                  objectFit: 'contain',
                                  backgroundColor: 'white'
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg";
                                }}
                              />
                            </div>
                          ) : (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              margin: '10px 0',
                              width: '100%'
                            }}>
                              <img 
                                src="https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg"
                                alt="Product placeholder"
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  maxHeight: '200px',
                                  objectFit: 'contain',
                                  backgroundColor: 'white'
                                }}
                              />
                            </div>
                          )}
                         
                           



                              
                          {/* Description button for tablet view only */}
                          <div className="d-none d-sm-block d-lg-none" style={{ marginTop: '5px' }}>
                              <Button 
                                variant="success" 
                                size="sm" 
                                onClick={() => handleShowDescription(product.description)}
                                style={{ borderRadius: '0' }}
                              >
                                Description
                              </Button>
                            </div>
                          {/* Availability for mobile view only */}
                          <div className="d-sm-none" style={{ marginTop: '5px' }}>
                            <span className={`text-${product.isActive ? 'success' : 'danger'}`}>
                              {product.isActive ? 'Available' : 'Unavailable'}
                            </span>
                            <div style={{ marginTop: '5px' }}>
                              <Button  
                                variant="success" 
                                size="sm" 
                                onClick={() => handleShowDescription(product.description)}
                                style={{ borderRadius: '0' }}
                              >
                                Description
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-lg-table-cell">{product.description}</td>
                        <td style={{textAlign: 'center', ...tableStyles.price}}>
                          ₱{product.price}
                        </td>
                        <td className="d-none d-sm-table-cell" style={{textAlign: 'center'}}>
                          <span className={`text-${product.isActive ? 'success' : 'danger'}`}>
                            {product.isActive ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="d-none d-sm-table-cell" style={{width: '120px'}}>
                          <div style={tableStyles.actionButtonContainer}>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              style={tableStyles.actionButton}
                              onClick={() => handleUpdateClick(product)}
                            >
                              Update
                            </Button>
                            <Button 
                              variant={product.isActive ? "outline-primary" : "success"}
                              size="sm"
                              className={product.isActive ? "disable-btn" : ""}
                              style={{
                                borderRadius: 6,
                                display: 'block',
                                marginBottom: '5px',
                                textAlign: 'center',
                                fontFamily: "'Roboto', sans-serif",
                                fontWeight: 600,
                                background: product.isActive ? '#fff' : '#0c4798',
                                color: product.isActive ? '#0c4798' : '#fff',
                                border: product.isActive ? '1.5px solid #0c4798' : 'none',
                                letterSpacing: '0.5px',
                                fontSize: '1rem',
                                boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
                                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                                minWidth: 100,
                                padding: '4px 16px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              onClick={() => handleArchive(product._id, product.isActive)}
                            >
                              {product.isActive ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </td>
                        <td className="d-sm-none">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <Button 
                              style={{ borderRadius: '0' }}
                              variant="primary" 
                              size="sm" 
                              onClick={() => handleUpdateClick(product)}
                            >
                              Update
                            </Button>
                            <Button 
                              variant={product.isActive ? "outline-primary" : "success"}
                              size="sm"
                              className={product.isActive ? "disable-btn" : ""}
                              style={{
                                borderRadius: 6,
                                display: 'block',
                                marginBottom: '5px',
                                textAlign: 'center',
                                fontFamily: "'Roboto', sans-serif",
                                fontWeight: 600,
                                background: product.isActive ? '#fff' : '#0c4798',
                                color: product.isActive ? '#0c4798' : '#fff',
                                border: product.isActive ? '1.5px solid #0c4798' : 'none',
                                letterSpacing: '0.5px',
                                fontSize: '1rem',
                                boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
                                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                                minWidth: 100,
                                padding: '4px 16px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              onClick={() => handleArchive(product._id, product.isActive)}
                            >
                              {product.isActive ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Description Modal */}
                <DescriptionModal 
                  show={showDescription}
                  handleClose={() => setShowDescription(false)}
                  description={selectedDescription}
                />
              </>
            )}
          </Container>

          {/* Update Modal */}
          <Modal show={showUpdateModal} onHide={handleUpdateClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleUpdateSubmit}>
              <Modal.Body style={tableStyles.modal.content}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={productToUpdate.name}
                    onChange={(e) => setProductToUpdate({...productToUpdate, name: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    value={productToUpdate.description}
                    onChange={(e) => setProductToUpdate({...productToUpdate, description: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    value={productToUpdate.price}
                    onChange={(e) => setProductToUpdate({
                      ...productToUpdate, 
                      price: e.target.value
                    })}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Product Image Link</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image URL for product thumbnail"
                    value={productToUpdate.imageUrl}
                    onChange={(e) => setProductToUpdate({
                      ...productToUpdate, 
                      imageUrl: e.target.value
                    })}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer style={tableStyles.modal.footer}>
                <Button variant="secondary" onClick={handleUpdateClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Update Product
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Add Product Modal */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body style={tableStyles.modal.content}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Product Image Link</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image URL for product thumbnail"
                    value={newProduct.imageUrl || ''}
                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer style={tableStyles.modal.footer}>
                <Button variant="dark" onClick={handleClose} style={{borderRadius: '0'}}>
                  Close
                </Button>
                <Button
                  style={{borderRadius: '0'}}
                  className="bg-success"
                  variant={isSubmitDisabled ? "danger" : "primary"}
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  Add Product
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Add this style block at the end of your component's return (before the closing fragment or Container) */}
          <>
            <style>
              {`
                .btn, .btn-primary, .btn-success, .btn-danger, .btn-dark {
                  font-family: 'Roboto', sans-serif !important;
                  font-weight: 600 !important;
                  border-radius: 6px !important;
                  letter-spacing: 0.5px !important;
                  font-size: 1rem !important;
                  transition: all 0.3s cubic-bezier(.4,2,.6,1) !important;
                }
                .btn-primary, .btn-success, .btn-danger, .btn-dark {
                  background: #0c4798 !important;
                  color: #fff !important;
                  border: none !important;
                  box-shadow: 0 6px 18px rgba(69,210,250,0.13) !important;
                }
                .btn-primary:hover, .btn-success:hover, .btn-danger:hover, .btn-dark:hover,
                .btn-primary:focus, .btn-success:focus, .btn-danger:focus, .btn-dark:focus {
                  background: #08306b !important;
                  color: #fff !important;
                  box-shadow: 0 8px 24px rgba(69,210,250,0.18) !important;
                  transform: scale(1.06);
                  text-decoration: none !important;
                }
                .disable-btn {
                  background: #fff !important;
                  color: #0c4798 !important;
                  border: 1.5px solid #0c4798 !important;
                  font-weight: 600;
                  font-family: 'Roboto', sans-serif;
                  border-radius: 6px;
                  padding: 4px 16px !important;
                  transition: all 0.3s cubic-bezier(.4,2,.6,1);
                  text-decoration: none !important;
                }
                .disable-btn:hover, .disable-btn:focus {
                  background: #0c4798 !important;
                  color: #fff !important;
                  border: 1.5px solid #0c4798 !important;
                  box-shadow: 0 2px 8px rgba(69,210,250,0.13);
                  transform: scale(1.08);
                  text-decoration: none !important;
                }
                .card, .modal-content {
                  border: none !important;
                  border-radius: 0 !important;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.07) !important;
                  font-family: 'Roboto', sans-serif !important;
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
                table, th, td {
                  font-family: 'Roboto', sans-serif !important;
                  color: #222 !important;
                }
              `}
            </style>
          </>
        </>
      );
    }
