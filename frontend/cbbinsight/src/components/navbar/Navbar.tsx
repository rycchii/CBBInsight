import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <button onClick={() => navigate('/')} className="logo-button">
          <FontAwesomeIcon icon="basketball" size="2x" />
        </button>
      </div>
      <div className="navbar-links">
        <button onClick={() => navigate('/')}>
          <FontAwesomeIcon icon="home" /> 
          <span className="button-text">Home</span>
        </button>
        <button onClick={() => navigate('/conferences')}>
          <FontAwesomeIcon icon="trophy" /> 
          <span className="button-text">Conferences</span>
        </button>
        <button onClick={() => navigate('/teams')}>
          <FontAwesomeIcon icon="flag" /> 
          <span className="button-text">Teams</span>
        </button>
        <button onClick={() => navigate('/positions')}>
          <FontAwesomeIcon icon="shirt" /> 
          <span className="button-text">Positions</span>
        </button>
        <button onClick={() => navigate('/players')}>
          <FontAwesomeIcon icon="users" /> 
          <span className="button-text">Players</span>
        </button>
      </div>
      <div className="navbar-search">
        <FontAwesomeIcon icon="search" />
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;