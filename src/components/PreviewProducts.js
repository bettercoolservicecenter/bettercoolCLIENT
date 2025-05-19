import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProducts(props) {
  const { breakPoint, data } = props;
  const { _id, name, description, price, imageUrl } = data;

  return (
    <Col xs={12} md={6} lg={breakPoint} style={{ padding: '0' }}>
      <style>
        {`
          .subtle-preview-card {
            transition: box-shadow 0.25s cubic-bezier(.4,2,.6,1), transform 0.25s cubic-bezier(.4,2,.6,1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          }
          .subtle-preview-card:hover {
            box-shadow: 0 8px 24px rgba(30,60,120,0.13);
            transform: translateY(-4px) scale(1.015);
          }
          .subtle-preview-img {
            transition: transform 0.25s cubic-bezier(.4,2,.6,1);
          }
          .subtle-preview-card:hover .subtle-preview-img {
            transform: scale(1.04);
          }
        `}
      </style>
      <Link to={`/products/${_id}`} style={{ textDecoration: 'none' }}>
        <Card 
          className="h-100 d-flex flex-column subtle-preview-card" 
          style={{ 
            border: 'none',
            minHeight: '100px',
            borderRadius: '0'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1px 0',
            width: '100%',
            height: '100px'
          }}>
            <img 
              src={imageUrl || "https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg"}
              alt={name}
              className="subtle-preview-img"
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
            <Card.Title style={{ fontSize: '1rem', paddingBottom: '0px' }}>
              {name}
            </Card.Title>
          </Card.Body>
          <div style={{ 
            color: '#ff6b00',
            fontSize: '1.2rem',
            fontWeight: '500',
            padding: '0 1rem',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            ₱{price}
          </div>
        </Card>
      </Link>
    </Col>
  );
}
