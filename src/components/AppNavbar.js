import React, { useContext, useRef } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon
import UserContext from '../context/UserContext';

export default function AppNavbar({ cartItemCount }) { // Accept cartItemCount as a prop
  const { user, setUser } = useContext(UserContext);
  const navbarToggleRef = useRef(null); // Define the navbarToggleRef

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      id: null,
      isAdmin: false
    });
  };

  // Function to close navbar when a link is clicked
  const closeNavbar = () => {
    // Bootstrap lg breakpoint is 992px, so this covers both mobile and tablet
    if (window.innerWidth < 992 && navbarToggleRef.current && !navbarToggleRef.current.classList.contains('collapsed')) {
      navbarToggleRef.current.click();
    }
  };

  const navbarStyle = {
    backgroundColor: '#ffffff',
    padding: '0', // Ensure no padding
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const linkStyle = {
    color: '#000000',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
  };

  const cartIconStyle = {
    color: '#0e3e8e',
    position: 'relative',
    marginLeft: '1rem',
    marginTop: '-0.1rem',
    marginRight: '1rem', // Adjust as needed
    height: '1.5rem',
    width: '1.5rem'
  };

  const itemCountStyle = {
    position: 'absolute',
    top: '1px',
    right: '1.5rem',
    backgroundColor: '#11b0d2',
    color: 'white',
    borderRadius: '50%',
    padding: '0.1rem 0.3rem',
    fontSize: '0.5rem',
    height: '1rem',
    width: '1rem',
    textAlign: 'center'
  };

  const hamburgerLineStyle = {
    width: '100%',
    height: '2px',
    backgroundColor: 'black', // Change to your desired color
    display: 'block',
    position: 'absolute',
    borderRadius: '3px',
    transition: 'all .3s ease-in-out'
  };

  return (
    <div style={{ width: '100vw', overflowX: 'hidden', margin: 0, padding: 0 }}>

<Navbar style={navbarStyle} variant="light" className="ps-0">
  <Container fluid>



        <Navbar.Brand as={NavLink} to="/" onClick={closeNavbar} style={{ display: 'flex', alignItems: 'center', marginLeft: '1.5rem' }}>
          <img
            src="https://i.ibb.co/whPN0QF7/logoimage.png" // Logo URL
            alt="Logo"
            className="navbar-logo" // Add class for styling
            style={{ height: '2rem', width: 'auto', borderRadius: '50%' }} // Adjust height to match
          />
          <img
            src="https://i.ibb.co/mCYR76K9/logotext.png" // New image URL
            alt="Logo Text"
            className="navbar-logo" // Add class for styling
            style={{ height: '2rem', width: 'auto'}} // Same height and margin for spacing
          />
        </Navbar.Brand>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && user.isAdmin ? (
              <Nav.Link as={NavLink} to="/products" style={linkStyle} onClick={closeNavbar}>
                {window.innerWidth < 768 ? 'Admin' : 'Admin Dashboard'}
              </Nav.Link>
            ) : null}
          </Nav>

          <Nav style={{ display: 'flex', alignItems: 'center' }}>
            {user && user.id !== null ? (
              <>
                {!user.isAdmin && (
                  <>
                    <Nav.Link as={NavLink} to="/bookings" style={linkStyle} onClick={closeNavbar}>Bookings</Nav.Link>
                    <Nav.Link as={NavLink} to="/profile" style={linkStyle} onClick={closeNavbar}>Profile</Nav.Link>
                  </>
                )}
                <Nav.Link 
                  as={NavLink} 
                  to="/logout" 
                  onClick={(e) => {
                    closeNavbar();
                    handleLogout();
                  }} 
                  style={linkStyle}
                >
                  {window.innerWidth < 768 ? 'Out' : 'Log Out'}
                </Nav.Link>
              </>
            ) : (
              null
            )}
            <Nav.Link as={NavLink} to="/cart" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              <FaShoppingCart className="cart-icon" style={cartIconStyle} />
              {cartItemCount > 0 && (
                <span style={itemCountStyle}>{cartItemCount}</span>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  );
}
