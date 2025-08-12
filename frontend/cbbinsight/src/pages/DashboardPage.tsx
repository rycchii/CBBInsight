import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import conferencesImage from '../assets/buttonimages/conferences.jpeg';
import teamsImage from '../assets/buttonimages/teams.jpg'
import playersImage from '../assets/buttonimages/players.avif';
import positionImage from '../assets/buttonimages/positions.jpg';
import insightImage from '../assets/buttonimages/insight.png';
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    { title: 'Players', path: '/players', image: playersImage },
    { title: 'Schools', path: '/schools', image: teamsImage },
    { title: 'Conferences', path: '/conferences', image: conferencesImage },
    { title: 'Insight', path: '/insight', image: insightImage },
    { title: 'Positions', path: '/positions', image: positionImage }
    
  ];

  return (
    <>
      <div className="dashboard-page"></div> {/* Background wrapper */}
      <div className="dashboard-container">
        {dashboardItems.map((item) => (
          <button
            key={item.title}
            className="dashboard-button"
            onClick={() => navigate(item.path)}
          >
            <div className="button-background" style={{ backgroundImage: `url(${item.image})` }} />
            <span className="button-title">{item.title}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default DashboardPage;