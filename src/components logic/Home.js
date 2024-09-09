import React from 'react';
import '../components css/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="title-section">
        <div className="section welcome-section">
          Welcome to
        </div>
        <div className="section uni-section">
          UNI
        </div>
      </div>
      <div className="section description-section">
        Uni is an online platform dedicated to providing free self-education resources and affordable courses. Our interdisciplinary approach fosters a holistic understanding of the world, helping learners connect ideas across fields.
      </div>
    </div>
  );
};

export default Home;
