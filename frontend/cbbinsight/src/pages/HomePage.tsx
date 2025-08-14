import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Background Video */}
      <video 
        className="background-video"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Content Overlay */}
      <div className="homepage-content">
        <div className="homepage-text">
        </div>
        
        <button
          className="get-started-btn"
          onClick={() => navigate('/dashboard')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;