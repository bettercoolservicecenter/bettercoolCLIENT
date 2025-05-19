import { useState, useEffect } from 'react';
import { Row, Container, Col } from 'react-bootstrap';
import PreviewProducts from './PreviewProducts';
import { Link } from 'react-router-dom';

export default function FeaturedProducts() {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
      .then(res => res.json())
      .then(data => {
        // Create array of indices and shuffle it
        const indices = Array.from({ length: data.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Take first 6 indices and create preview components
        const featured = indices
          .slice(0, 6)
          .map(index => ({
            ...data[index],
            key: data[index]._id
          }));

        setPreviews(featured);
      });
  }, []);

  return (
    <Container fluid style={{ padding: '0 20px', marginTop: '20px', boxSizing: 'border-box' }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="text-center text-md-start">
          <h3 style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 900,
            letterSpacing: '2px',
            margin: 0,
            marginLeft: '20px'
          }}>
            Featured Products
          </h3>
        </Col>
        <Col xs={12} md={6} className="text-center text-md-end">
          <Link to="/products" style={{
            padding: '8px 14px',
            border: '1px solid transparent',
            color: '#0e368c',
            textDecoration: 'none',
            borderRadius: '5px',
            transition: 'all 0.3s ease',
            boxShadow: 'none',
            fontWeight: 'normal',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid #0e368c';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            View More Products &gt;
          </Link>
        </Col>
      </Row>
      <Row style={{ margin: '0', justifyContent: 'center', marginBottom: '20px', padding: '0' }}>
        {previews.map(product => (
          <PreviewProducts 
            data={product} 
            key={product.key} 
            breakPoint={2}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          />
        ))}
      </Row>
    </Container>
  );
}