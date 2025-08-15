import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faSpinner, 
  faUsers, 
  faChevronDown, 
  faChevronUp,
  faBasketballBall,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { apiService} from '../services/api';
import type { Player } from '../services/api';
import './ConferenceDetailPage.css';

interface School {
  name: string;
  players: Player[];
  playerCount: number;
}

const ConferenceDetailPage: React.FC = () => {
  const { conferenceName } = useParams<{ conferenceName: string }>();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);

  useEffect(() => {
    if (conferenceName) {
      loadConferenceData();
    }
  }, [conferenceName]);

  const loadConferenceData = async () => {
    try {
      setLoading(true);
      
      console.log('Conference name from URL:', conferenceName);
      const decodedConferenceName = decodeURIComponent(conferenceName || '');
      console.log('Decoded conference name:', decodedConferenceName);
      
      const players = await apiService.getAllPlayers();
      console.log('Total players fetched:', players.length);
      
      // Group all players by school (we'll filter by conference later when we have conference data)
      const schoolPlayersMap = new Map<string, Player[]>();
      
      players.forEach(player => {
        if (player.school_name) {
          const schoolName = player.school_name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          if (!schoolPlayersMap.has(schoolName)) {
            schoolPlayersMap.set(schoolName, []);
          }
          schoolPlayersMap.get(schoolName)?.push(player);
        }
      });

      console.log('Unique schools found:', schoolPlayersMap.size);
      console.log('Schools:', Array.from(schoolPlayersMap.keys()).slice(0, 10));

      // For now, let's show all schools since we don't have conference data in players
      // Later we can implement proper conference filtering
      const schoolsData: School[] = Array.from(schoolPlayersMap.entries()).map(([schoolName, schoolPlayers]) => ({
        name: schoolName,
        players: schoolPlayers.sort((a, b) => (a.playerName || '').localeCompare(b.playerName || '')),
        playerCount: schoolPlayers.length
      }));

      // Sort schools by name and limit to a reasonable number for display
      schoolsData.sort((a, b) => a.name.localeCompare(b.name));
      
      // Show first 20 schools for this conference (you can adjust this)
      const limitedSchools = schoolsData.slice(0, 20);
      
      console.log('Schools to display:', limitedSchools.length);
      
      setSchools(limitedSchools);
      setError(null);
      
    } catch (err) {
      console.error('Error loading conference data:', err);
      if (import.meta.env.PROD) {
        setError('Backend service is currently being deployed. Please try again in a few minutes.');
      } else {
        setError('Failed to load conference data. Make sure your Spring Boot backend is running on localhost:8080');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSchoolExpansion = (schoolName: string) => {
    setExpandedSchool(expandedSchool === schoolName ? null : schoolName);
  };

  const handleSchoolClick = (schoolName: string) => {
    navigate(`/schools/${encodeURIComponent(schoolName)}`);
  };

  const handlePlayerClick = (player: Player) => {
    navigate(`/players/${encodeURIComponent(player.playerName || '')}`);
  };

  if (loading) {
    return (
      <div className="conference-detail-page">
        <div className="loading-state">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <h2>Loading {conferenceName} Conference...</h2>
          <p>Fetching schools and players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conference-detail-page">
        <div className="error-state">
          <h2>Error Loading Conference</h2>
          <p>{error}</p>
          <button onClick={loadConferenceData} className="retry-button">
            Try Again
          </button>
          <button onClick={() => navigate('/conferences')} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Conferences
          </button>
        </div>
      </div>
    );
  }

  const totalPlayers = schools.reduce((sum, school) => sum + school.playerCount, 0);

  return (
    <div className="conference-detail-page">
      <div className="conference-detail-container">
        {/* Header */}
        <div className="conference-detail-header">
          <button onClick={() => navigate('/conferences')} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Conferences
          </button>
          
          <div className="conference-title-section">
            <h1>
              <FontAwesomeIcon icon={faBasketballBall} className="header-icon" />
              {decodeURIComponent(conferenceName || '')} Conference
            </h1>
            <div className="conference-summary">
              <span className="stat-item">
                <FontAwesomeIcon icon={faGraduationCap} /> {schools.length} Schools
              </span>
              <span className="stat-item">
                <FontAwesomeIcon icon={faUsers} /> {totalPlayers} Players
              </span>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="schools-grid">
          {schools.map((school) => (
            <div key={school.name} className="school-card">
              <div className="school-header" onClick={() => handleSchoolClick(school.name)}>
                <div className="school-logo">
                  <div className="placeholder-logo">
                    <FontAwesomeIcon icon={faGraduationCap} className="placeholder-icon" />
                  </div>
                </div>
                <div className="school-info">
                  <h3>{school.name}</h3>
                  <p>{school.playerCount} Players</p>
                </div>
                <button 
                  className="expand-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSchoolExpansion(school.name);
                  }}
                >
                  <FontAwesomeIcon 
                    icon={expandedSchool === school.name ? faChevronUp : faChevronDown} 
                  />
                </button>
              </div>

              {/* Expandable Players List */}
              {expandedSchool === school.name && (
                <div className="players-dropdown">
                  <div className="players-list">
                    {school.players.map((player, index) => (
                      <div 
                        key={`${player.playerName}-${index}`} 
                        className="player-item"
                        onClick={() => handlePlayerClick(player)}
                      >
                        <div className="player-basic-info">
                          <span className="player-name">{player.playerName}</span>
                          <span className="player-position">{player.position}</span>
                        </div>
                        <div className="player-stats">
                          <span className="stat">GP: {player.games_played || 0}</span>
                          <span className="stat">PPG: {player.fg_per_game?.toFixed(1) || '0.0'}</span>
                          <span className="stat">FG%: {(player.fg_percentage * 100)?.toFixed(1) || '0.0'}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {schools.length === 0 && (
          <div className="no-results">
            <FontAwesomeIcon icon={faBasketballBall} className="no-results-icon" />
            <h3>No schools found</h3>
            <p>This conference doesn't have any schools with player data yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferenceDetailPage;