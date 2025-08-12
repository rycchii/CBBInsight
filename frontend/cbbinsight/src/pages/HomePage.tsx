import React from 'react';
import { useNavigate } from 'react-router-dom';
import basketballGif from '../assets/dirtysprite.gif';  // im gonna make my own gif later
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <img
        src={basketballGif}
        alt="Basketball Animation"
        className="homepage-gif"
      />
      <button
        className="get-started-btn"
        onClick={() => navigate('/dashboard')}
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;