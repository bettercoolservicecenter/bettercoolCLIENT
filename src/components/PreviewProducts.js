import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProducts(props) {
  const { breakPoint, data } = props;
  const { _id, name, description, price, imageUrl } = data;

  return (
    <Col xs={12} md={6} lg={breakPoint} style={{ padding: '0' }}>
      <Link to={`/products/${_id}`} style={{ textDecoration: 'none' }}>
        <Card 
          className="h-100 d-flex flex-column" 
          style={{ 
            border: 'none',
            minHeight: '100px',
            borderRadius: '0',
            transition: 'box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.outline = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
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
