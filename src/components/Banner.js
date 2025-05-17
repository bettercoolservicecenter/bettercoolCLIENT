import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

export default function Banner({ data }) {
  const [shouldNavigate, setShouldNavigate] = useState(false);

  if (shouldNavigate) {
    return <Navigate to="/products" />;
  }

  return (
    <Row className="my-5 text-center">
      <Col>
        <h1>{data.title}</h1>
        <p><em>{data.content}</em></p>
        <Button 
          variant="primary" 
          onClick={() => setShouldNavigate(true)}
          style={{
            borderRadius: '0'
          }}
        >
          {data.buttonLabel}
        </Button>
      </Col>
    </Row>
  );
}