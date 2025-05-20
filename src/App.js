import { useState, useEffect } from 'react';

import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Profile from './pages/Profile';
import ProductView from './pages/ProductView';
import ServicePage from './pages/ServicePage';

import { UserProvider } from './context/UserContext';
import 'notyf/notyf.min.css';
import Cart from './pages/Cart';
import Bookings from './pages/Bookings';
import './index.css'; // Adjust the path as necessary

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  function unsetUser() {
    localStorage.clear();
    setUser({
      id: null,
      isAdmin: null
    });
  }

  const fetchCartItemCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/cart-item-count`, {
        headers: {
          // Include any necessary headers, such as authorization if needed
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCartItemCount(data.totalQuantity); // Update the cart item count
      }
    } catch (error) {
      console.error('Error fetching cart item count:', error);
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Invalid token');
        }
        return res.json();
      })
      .then(data => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });
      })
      .catch(() => {
        unsetUser();
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Function to update cart item count
  const updateCartItemCount = (count) => {
    setCartItemCount(count);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar cartItemCount={cartItemCount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products cartItemCount={cartItemCount} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/products/:productId" element={<ProductView />} />
          <Route path="/cart" element={<Cart setCartItemCount={updateCartItemCount} />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:email" element={<Bookings />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </UserProvider>
  );
  
}

export default App;