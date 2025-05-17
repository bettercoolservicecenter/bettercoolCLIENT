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
      variant="primary" 
      onClick={handleAddToCart}
      style={{ 
        width: 'auto', 
        borderRadius: '0' 
      }}
    >
      Add to Cart
    </Button>
  );
}
