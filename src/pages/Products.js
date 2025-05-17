import { useState, useEffect, useContext } from 'react';

import AdminDashboard from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  const fetchData = () => {

    const fetchUrl = user.isAdmin
      ? `${process.env.REACT_APP_API_BASE_URL}/products/all`
      : `${process.env.REACT_APP_API_BASE_URL}/products/active`

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched courses:', data);
        setProducts(data);
      })
      .catch(error => console.error('Error fetching courses:', error));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {user ?.isAdmin ? (
        <AdminDashboard productsData={products} fetchData={fetchData} />
      ) : (
        <UserView productsData={products}/>
      )}
    </>
  );
}