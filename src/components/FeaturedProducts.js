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
          <Link
            to="/products"
            style={{
              padding: '8px 0',
              minWidth: '110px',
              maxWidth: '130px',
              width: '100%',
              border: '1px solid #0c4798',
              color: '#0c4798',
              textDecoration: 'none',
              borderRadius: '6px',
              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
              fontWeight: 600,
              letterSpacing: '0.5px',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 2px 8px rgba(69,210,250,0.07)',
              margin: '0 auto',
              display: 'inline-block',
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#0c4798';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.border = 'none';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(69,210,250,0.13)';
              e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
              e.currentTarget.style.color = '#0c4798';
              e.currentTarget.style.border = '1px solid #0c4798';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(69,210,250,0.07)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            View More
          </Link>
          <Link
            to="/services"
            style={{
              padding: '8px 0',
              minWidth: '110px',
              maxWidth: '130px',
              width: '100%',
              border: '1px solid #0c4798',
              color: '#0c4798',
              textDecoration: 'none',
              borderRadius: '6px',
              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
              fontWeight: 600,
              letterSpacing: '0.5px',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 2px 8px rgba(69,210,250,0.07)',
              margin: '0 10px',
              display: 'inline-block',
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#0c4798';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.border = 'none';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(69,210,250,0.13)';
              e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
              e.currentTarget.style.color = '#0c4798';
              e.currentTarget.style.border = '1px solid #0c4798';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(69,210,250,0.07)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Book a Service
          </Link>
        </Col>
      </Row>
      <style>
        {`
          .featured-preview-card {
            box-shadow:
              0 8px 32px 0 rgba(30,60,120,0.22),
              0 8px 32px rgba(69,210,250,0.18),
              0 2px 16px rgba(12,71,152,0.18),
              0 8px 40px 0 rgba(12, 24, 48, 0.22); /* Added darker, deeper shadow */
            border-radius: 0;
            transition: box-shadow 0.35s cubic-bezier(.4,2,.6,1), transform 0.35s cubic-bezier(.4,2,.6,1);
            background: #fff;
          }
          .featured-preview-card:hover {
            box-shadow:
              0 24px 64px 0 rgba(30,60,120,0.30),
              0 16px 48px rgba(69,210,250,0.22),
              0 8px 32px rgba(12,71,152,0.22),
              0 16px 60px 0 rgba(12, 24, 48, 0.28); /* Even darker and deeper on hover */
            transform: translateY(-8px) scale(1.025);
          }
        `}
      </style>
      <Row style={{ margin: '0', justifyContent: 'center', marginBottom: '20px', padding: '0' }}>
        {previews.map(product => (
          <PreviewProducts 
            data={product} 
            key={product.key} 
            breakPoint={2}
            style={{ fontFamily: 'Roboto, sans-serif' }}
            className="featured-preview-card"
          />
        ))}
      </Row>
    </Container>
  );
}