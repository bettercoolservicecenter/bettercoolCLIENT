import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const About = () => {

    const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Slight delay to ensure component has rendered
      }
    }
  }, [location]);
  
  return (
    <div style={{
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}>
      {/* Hero Banner */}
      <div className="about-banner">
        {/* Banner content can go here if needed */}
      </div>

      {/* Short Description */}
      <Row className="text-center">
        <Col>
          <h2 className='my-5'>Welcome to Our Service Center</h2>
          <p className='w-75 mx-auto mb-5'>
            We specialize in the repair and maintenance of air conditioners, refrigerators, and washing machines. 
            Our experienced technicians are dedicated to providing high-quality service to ensure your appliances 
            are running efficiently. We pride ourselves on our commitment to customer satisfaction and our 
            expertise in the field.
          </p>
        </Col>
      </Row>

      {/* Carousel */}
      <div className="carousel-container" style={{ width: '35.5%', margin: '0 auto', minWidth: '400px' }}>
        <Carousel>
          <Carousel.Item>
            <div className="carousel-item-content">
              <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fweb.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0hfxXJnivkCsZ67JfsYuzNETcBhg7stoiabbeGUPZe3K3snZcYNFRfwizN7xXP9MMl%26id%3D100083403047450&show_text=true&width=500" width="1000" height="750" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="carousel-item-content">
              <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fweb.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0BJj6pN7WvjRaaiDui1Jh5p8LxL47pa3CNjFu5xbCM97E6nHRmtcypaFiDm6dCoZpl%26id%3D100083403047450&show_text=true&width=500" width="1000" height="750" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="carousel-item-content">
              <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fweb.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0tFW1LcTtASJ2JNgLYocdaEjt5nU9Pdo8RRUJ7VYTZzmZRifosMKzxBWGzYbJ5vT9l%26id%3D100083403047450&show_text=true&width=500" width="1000" height="750" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Location Section */}
      <Row style={{ marginTop: '20px', textAlign: 'center' }}>
        <Col>
          <h2 id="our-location" className='my-5'>Our Location</h2>
          <p>Visit us at our service center:</p>
          <div style={{ width: '100%', height: '400px', margin: '0 auto' }}>
            <iframe 
              className="d-block d-grid gap-5 ms-lg-auto mx-auto mx-md-auto mx-sm-auto"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.653482142169!2d124.6825374!3d6.689772500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f80dd8dc12ca4d%3A0xe128ebded71acfe1!2sBettercool%20service%20center!5e0!3m2!1sen!2sph!4v1741943546745!5m2!1sen!2sph" 
              width="60%" 
              height="100%" 
              allowFullScreen="" 
              
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, minWidth: '400px' }} 
            ></iframe>
          </div>
        </Col>
      </Row>
      <style>
        {`
          .about-banner {
            background-image: url("https://i.ibb.co/MxS9n7pg/about-us-banner.png");
            height: 300px; /* Default height */
            background-size: cover;
            background-position: center;
            margin-bottom: 20px; 
            margin-top: 4rem;
          }

          @media (max-width: 768px) {
            .about-banner {
              height: 200px; /* Adjust height for mobile */
              margin-top: 2rem; /* Adjust margin for mobile */
            }
          }

          @media (max-width: 576px) {
            .about-banner {
              background-size: 140%;
              background-position: 0 0;
              width: 425px;
              height: 150px; /* Further adjust height for smaller screens */
            }
          }

          .carousel-item-content {
            width: 100%; /* Full width for carousel items */
            height: auto; /* Auto height to maintain aspect ratio */
          }

          @media (max-width: 768px) {
            .carousel-container {
              width: 90%; /* Expand carousel width on smaller screens */
            }
          }

          @media (max-width: 576px) {
            .carousel-container {
              width: 100%; /* Full width on extra small screens */
              margin: 0 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default About;
