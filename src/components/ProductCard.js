import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
  if (!productProp) {
    return null;
  }

  const { _id, name, description, price, imageUrl } = productProp;

  return (
    <>
      <style>
        {`
          .allproducts-card {
            box-shadow:
              0 4px 16px 0 rgba(30,60,120,0.10),
              0 2px 8px rgba(69,210,250,0.07);
            border-radius: 0;
            transition: box-shadow 0.35s cubic-bezier(.4,2,.6,1), transform 0.35s cubic-bezier(.4,2,.6,1);
            background: #fff;
          }
          .allproducts-card:hover {
            box-shadow:
              0 12px 32px 0 rgba(30,60,120,0.16),
              0 6px 18px rgba(69,210,250,0.13);
            transform: translateY(-8px) scale(1.025);
          }
          .allproducts-title {
            font-family: 'Poppins', 'Roboto', sans-serif;
            font-weight: 600;
            color: #0c4798;
            letter-spacing: 1px;
            margin: 10px 0 4px 0;
            font-size: 1.1rem;
          }
          .allproducts-price {
            color: #ff6b00;
            font-size: 1.2rem;
            font-weight: 500;
            padding: 0 1rem;
            margin-bottom: 0.5rem;
            text-align: center;
            display: block;
          }
          .allproducts-details-btn {
            padding: 6px 0;
            min-width: 90px;
            max-width: 110px;
            width: 100%;
            font-size: 0.95rem;
            border: 1px solid #0c4798;
            color: #0c4798;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
            font-weight: 600;
            letter-spacing: 0.5px;
            background: rgba(255,255,255,0.85);
            box-shadow: 0 2px 8px rgba(69,210,250,0.07);
            margin: 0 auto;
            display: block;
            text-align: center;
          }
          .allproducts-details-btn:hover, .allproducts-details-btn:focus {
            background: #0c4798;
            color: #fff !important;
            border: none;
            box-shadow: 0 6px 18px rgba(69,210,250,0.13);
            transform: scale(1.06);
          }
        `}
      </style>
      <Card 
        id={_id} 
        className="mb-3 h-100 d-flex flex-column mx-3 allproducts-card"
        style={{ borderRadius: '0', border: 'none' }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          margin: '10px 0',
          width: '100%',
          height: '200px'
        }}>
          <img 
            src={imageUrl || "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg"}
            alt={name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              backgroundColor: 'white'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg";
            }}
          />
        </div>
        <Card.Body className="flex-grow-1 text-center">    
          <Card.Title className="allproducts-title">
            {name}
          </Card.Title>
          <Card.Text style={{ fontSize: '0.97rem', color: '#444' }}>{description}</Card.Text>
        </Card.Body>
        <span className="allproducts-price">₱{price}</span>
        <Card.Footer 
          className="bg-light border-top text-center"
          style={{ borderRadius: '0', background: 'transparent', border: 'none' }}
        >
          <Link 
            className="allproducts-details-btn" 
            to={`/products/${_id}`}
          >
            Details
          </Link>
        </Card.Footer>
      </Card>
    </>
  );
}
