import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    { title: 'Players', path: '/players', image: '/buttonimages/players.avif' },
    { title: 'Schools', path: '/schools', image: '/buttonimages/teams.jpg' },
    { title: 'Conferences', path: '/conferences', image: '/buttonimages/conferences.jpeg' },
    { title: 'Positions', path: '/positions', image: '/buttonimages/positions.jpg' },
    { title: 'Insight', path: '/insight', image: '/buttonimages/insight.png' },
  ];

  return (
    <>
      <div className="dashboard-page"></div>
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