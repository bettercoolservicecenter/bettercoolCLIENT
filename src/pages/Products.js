import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import AdminDashboard from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';
import AppNavbar from '../components/AppNavbar';

export default function Products({ cartItemCount }) {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = (query = '') => {
    const fetchUrl = user.isAdmin
      ? `${process.env.REACT_APP_API_BASE_URL}/products/all`
      : `${process.env.REACT_APP_API_BASE_URL}/products/active`;

    console.log('Fetching products from:', fetchUrl); // Debugging line

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched products:', data);
        setProducts(data);
        if (query) {
          setSearchQuery(query); // Set search query if provided
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    const searchCategory = window.history.state?.searchCategory; // Get the search category from state
    if (searchCategory) {
      console.log('Setting search query to:', searchCategory); // Debugging line
      fetchData(searchCategory); // Fetch products with the search category
    } else {
      fetchData(); // Fetch all products if no category
    }
  }, [user]);

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const location = useLocation();
  useEffect(() => {
    const searchCategory = location.state?.searchCategory;
    if (searchCategory) {
      console.log('Setting search query to:', searchCategory);
      fetchData(searchCategory);
    } else {
      fetchData();
    }
  }, [user, location]); 

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AppNavbar cartItemCount={cartItemCount} onSearch={handleSearch} />
      {user?.isAdmin ? (
        <AdminDashboard productsData={filteredProducts} fetchData={fetchData} />
      ) : (
        <UserView productsData={filteredProducts} />
      )}
    </>
  );
}