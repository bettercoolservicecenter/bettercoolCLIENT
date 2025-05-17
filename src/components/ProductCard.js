import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
  if (!productProp) {
    return null;
  }

  const { _id, name, description, price, imageUrl } = productProp;;

  return (
    <Card 
          id={_id} 
          className="mb-3 h-100 d-flex flex-column mx-3"
          style={{ borderRadius: '0' }}
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
          <Card.Body className="flex-grow-1">    
        <Card.Title>
          <Link 
            to={`/products/${_id}`}
            style={{ 
              color: '#0d6efd',
              textDecoration: 'underline'
            }}
          >
            {name}
          </Link>
        </Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Text className="px-3 mb-2">
        <span style={{ 
          fontSize: '1.1rem',
          color: '#FF6B00'
        }}>₱{price}</span>
      </Card.Text>
      <Card.Footer 
        className="bg-light border-top text-start"
        style={{ borderRadius: '0' }} // Removed border radius from footer
      >
        <Link 
          className="btn btn-primary" 
          to={`/products/${_id}`}
          style={{ borderRadius: 0 }}
        >
          Details
        </Link>
      </Card.Footer>
    </Card>
  );
}
