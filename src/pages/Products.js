import { useState, useEffect, useContext } from 'react';

import AdminDashboard from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';
import AppNavbar from '../components/AppNavbar';

export default function Products({ cartItemCount }) {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = () => {
    const fetchUrl = user.isAdmin
      ? `${process.env.REACT_APP_API_BASE_URL}/products/all`
      : `${process.env.REACT_APP_API_BASE_URL}/products/active`;

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched products:', data);
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

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