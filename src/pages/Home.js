// Home.js

import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  const data = {
    title: "The Zuitt Shop",
    content: "Products for everyone, everywhere",
    destination: "/",
    buttonLabel: "Browse Products"
  };

  return (
    <>
      <Banner data={data} />
      <FeaturedProducts />
      
    </>
  );
}
