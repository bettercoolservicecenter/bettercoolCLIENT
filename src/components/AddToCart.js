import React from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';

export default function AddToCart({ productId, quantity, price }) {
  const notyf = new Notyf();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const subtotal = price * quantity;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          subtotal
        })
      });

      const data = await response.json();

      if (response.ok) {
        notyf.success('Added to Cart.');
        navigate('/cart');
      } else {
        notyf.error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      notyf.error('An error occurred while adding to cart');
    }
  };

  return (
    <Button
      variant="link"
      onClick={handleAddToCart}
      style={{
        background: '#0c4798',
        color: '#fff',
        border: 'none',
        minWidth: 140,
        maxWidth: 160,
        width: '100%',
        fontWeight: 600,
        letterSpacing: '0.5px',
        borderRadius: 6,
        boxShadow: '0 6px 18px rgba(69,210,250,0.13)',
        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
        fontSize: '1rem',
        padding: '8px 0',
        fontFamily: 'Roboto, sans-serif',
        margin: '0',
        display: 'block',
        textAlign: 'center', // Center align text
        textDecoration: 'none'
      }}
      className="add-to-cart-btn"
      onMouseUp={e => e.currentTarget.blur()}
    >
      Add to Cart
      <style>
        {`
          .add-to-cart-btn {
            text-decoration: none !important;
          }
          .add-to-cart-btn:hover, .add-to-cart-btn:focus {
            background: #08306b !important;
            color: #fff !important;
            box-shadow: 0 8px 24px rgba(69,210,250,0.18);
            transform: scale(1.06);
            text-decoration: none !important;
          }
        `}
      </style>
    </Button>
  );
}
