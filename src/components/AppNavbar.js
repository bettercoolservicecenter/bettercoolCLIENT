import React, { useContext, useRef, useState, useEffect } from 'react';
import { Container, Nav, Navbar, Accordion, Card } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa'; // Import the cart icon and magnifying glass icon
import UserContext from '../context/UserContext';

export default function AppNavbar({ cartItemCount, onSearch }) { // Accept cartItemCount and onSearch as props
  const { user, setUser } = useContext(UserContext);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleRef = useRef(null); // Define the navbarToggleRef
  const suggestionsRef = useRef(null); // Ref for suggestions container
  const [expanded, setExpanded] = useState({}); // State to manage accordion

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: query })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => {
          console.log('Fetched suggestions:', data); // Log the fetched suggestions
          setSuggestions(data); // Update suggestions with the fetched data
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]); // Clear suggestions if the query is empty
    }
  };

  // Handle clicks outside the suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]); // Collapse suggestions when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchClick = (productName) => {
    setSearchQuery(productName); // Set the search query
    // Navigate to the products page with the search query
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: productName }) // Send the product name in the request body
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the data returned from the server
        console.log('Search results:', data);
        // You can navigate to the product page or update the state as needed
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  const toggleAccordion = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navbarStyle = {
    backgroundColor: '#ffffff',
    padding: '0', // Ensure no padding
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    width: '100%',
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
    top: '0.8rem',
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

  const searchTextStyle = {
    fontSize: '0.8rem',
    color: '#555', // Optional: Change color to your preference
    marginTop: '0.5rem', // Space between the search bar and the text
  };

  return (
    <div style={{ width: '100vw', overflowX: 'hidden', margin: 0, padding: 0 }}>
      <Navbar
        style={navbarStyle}
        variant="light"
        className="ps-0 navbar-shadow"
        expand="lg"
        onToggle={setNavbarOpen}
        expanded={navbarOpen}
      >
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
          <Navbar.Toggle ref={navbarToggleRef} aria-controls="basic-navbar-nav" /> {/* <-- Add this line */}
          <Navbar.Collapse id="basic-navbar-nav">
            

            {/* Search Bar */}
            <form onSubmit={(e) => { e.preventDefault(); onSearch(searchQuery); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ position: 'relative', width: '81%' }}> {/* Wrap input and icon in a relative container */}
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  style={{
                    padding: '0.5rem',
                    marginTop: '0.5rem',
                    marginBottom: '0.1rem',
                    backgroundColor: '#f0f0f0',
                    width: '100%', // Full width of the container
                    fontSize: '0.75rem',
                    fontFamily: 'Arial, sans-serif',
                    border: 'none',
                    borderRadius: '0',
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  autoComplete="off"
                  onChange={(e) => handleSearch(e.target.value)} // Update search query on input change
                />
                <Link 
                  to={`/products/${searchQuery}`} // Navigate to the products page with the search query
                  style={{
                    position: 'absolute',
                    right: '0.1rem',
                    top: '58%',
                    transform: 'translateY(-50%)', // Center the icon vertically
                    cursor: 'pointer',
                    color: 'white', // Set the icon color to match the cart icon
                    backgroundColor: '#0e3e8e',              
                    padding: '0.2rem',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',              
                    width: '2rem',
                    height: '2.1rem',
                    textAlign: 'center'
                  }}
                  onClick={() => {
                    if (searchQuery) {
                      setSuggestions([]); // Clear suggestions before navigating
                    }
                  }}
                >
                  <FaSearch size={20} /> {/* Magnifying glass icon */}
                </Link>
              </div>
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div ref={suggestionsRef} style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  width: '63%', // Keep the width as you prefer
                  zIndex: 1000,
                  marginTop: '2.6rem', // Keep the margin as you prefer
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {suggestions.map((suggestion, index) => (
                    <Link 
                      key={index} 
                      to={`/products/${suggestion._id}`} // Navigate to the product preview page
                      style={{
                        display: 'block',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        color: '#555',
                        fontSize: '0.75rem',
                        fontFamily: 'Arial, sans-serif',
                        transition: 'background-color 0.3s',
                        textDecoration: 'none'
                      }}
                      onClick={() => {
                        setSearchQuery(suggestion.name); // Set the search query to the selected suggestion
                        setSuggestions([]); // Clear suggestions after selection
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cbeef5'} // Change background on hover
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'} // Reset background on mouse leave
                    >
                      {suggestion.name} {/* Adjust based on your data structure */}
                    </Link>
                  ))}
                </div>
              )}
              {/* Search Text Below the Search Bar as Links */}
              <div style={{ ...searchTextStyle, marginTop: '0.1rem', textAlign: 'left', width: '80%' }}>
                <Link 
                  to="/products"
                  state={{ searchCategory: 'Air Conditioner' }}
                  style={{ marginRight: '10px', color: 'black', cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'blue'}
                  onMouseLeave={e => e.target.style.color = 'black'}
                >
                  Air Conditioner
                </Link>
                <Link 
                  to="/products"
                  state={{ searchCategory: 'Refrigerator' }}
                  style={{ marginRight: '10px', color: 'black', cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'blue'}
                  onMouseLeave={e => e.target.style.color = 'black'}
                >
                  Refrigerator
                </Link>
                <Link 
                  to="/products"
                  state={{ searchCategory: 'Washing Machine' }}
                  style={{ marginRight: '10px', color: 'black', cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'blue'}
                  onMouseLeave={e => e.target.style.color = 'black'}
                >
                  Washing Machine
                </Link>
                <Link 
                  to="/services"
                  style={{ color: 'black', cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'blue'}
                  onMouseLeave={e => e.target.style.color = 'black'}
                >
                  Book a Service
                </Link>
              </div>
            </form>

            <Nav style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              {user && user.id !== null ? (
                <>
                  {!user.isAdmin && (
                    <>
                      <Nav.Link as={NavLink} to="/bookings" style={linkStyle} onClick={closeNavbar}>Bookings</Nav.Link>
                      <Nav.Link as={NavLink} to="/profile" style={linkStyle} onClick={closeNavbar}>Profile</Nav.Link>
                    </>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}> {/* Prevent wrapping */}
                    {user.isAdmin && (
                      <Nav.Link as={NavLink} to="/products" style={linkStyle} onClick={closeNavbar}>
                        {window.innerWidth < 768 ? 'Admin' : 'Admin Dashboard'}
                      </Nav.Link>
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
                  </div>
                </>
              ) : (
                null
              )}
              <Nav.Link as={NavLink} to="/cart" style={{ display: 'flex', alignItems: 'center', marginRight: '10px', position: 'relative' }}>
                <FaShoppingCart className="cart-icon" style={cartIconStyle} />
                {cartItemCount > 0 && (
                  (window.innerWidth >= 992 || navbarOpen) && (
                    <span className="cart-item-count">{cartItemCount}</span>
                  )
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
