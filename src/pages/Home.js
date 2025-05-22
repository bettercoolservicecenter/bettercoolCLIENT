import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate('/products', { state: { searchCategory: query } }); // Navigate with search query
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Hero Banner Image - Edge to Edge */}
      <div style={{
        marginTop: '42px',
        width: '100%',
        padding: 0
      }}>
        <img 
          src="https://i.ibb.co/Q3xCHbtG/Designer.png" 
          alt="Designer" 
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            margin: 0,
            padding: 0,
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        maxWidth: '1440px', // control width for FeaturedProducts only
        margin: '0 auto',
        padding: '0 16px',
        boxSizing: 'border-box'
      }}>
        <FeaturedProducts />
      </div>
    </div>
  );
}
