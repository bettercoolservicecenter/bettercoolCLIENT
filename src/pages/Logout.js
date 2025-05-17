import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
  const { setUser, unsetUser } = useContext(UserContext);

  // Clear user data immediately
  unsetUser();
  setUser({
    id: null,
    isAdmin: null
  });

  // Redirect to the login page instead of products
  return <Navigate to="/login" />;
}
