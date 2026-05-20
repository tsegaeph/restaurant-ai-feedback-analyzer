import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Menu from '../components/Menu/Menu';
import ReviewSection from '../components/Reviews/ReviewSection';
import Footer from '../components/Footer/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <ReviewSection />
      <Footer />
    </>
  );
};

export default Home;