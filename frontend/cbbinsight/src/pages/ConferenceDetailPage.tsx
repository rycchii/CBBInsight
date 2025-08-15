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
      console.log('Loading test data...');
      
      // Create test data to verify the component works
      const testSchools: School[] = [
        {
          name: 'Duke University',
          players: [
            { 
              playerName: 'Test Player 1', 
              position: 'G', 
              school_name: 'Duke University', 
              games_played: 30, 
              fg_per_game: 15.2, 
              fg_percentage: 0.456 
            } as Player,
            { 
              playerName: 'Test Player 2', 
              position: 'F', 
              school_name: 'Duke University', 
              games_played: 28, 
              fg_per_game: 12.8, 
              fg_percentage: 0.423 
            } as Player,
          ],
          playerCount: 2
        },
        {
          name: 'University of North Carolina',
          players: [
            { 
              playerName: 'Test Player 3', 
              position: 'C', 
              school_name: 'UNC', 
              games_played: 32, 
              fg_per_game: 18.5, 
              fg_percentage: 0.512 
            } as Player,
            { 
              playerName: 'Test Player 4', 
              position: 'G', 
              school_name: 'UNC', 
              games_played: 29, 
              fg_per_game: 14.1, 
              fg_percentage: 0.389 
            } as Player,
          ],
          playerCount: 2
        },
        {
          name: 'Virginia Tech',
          players: [
            { 
              playerName: 'Test Player 5', 
              position: 'F', 
              school_name: 'Virginia Tech', 
              games_played: 31, 
              fg_per_game: 16.7, 
              fg_percentage: 0.467 
            } as Player,
          ],
          playerCount: 1
        }
      ];
      
      console.log('Test schools created:', testSchools);
      
      setSchools(testSchools);
      setError(null);
      
    } catch (err) {
      console.error('Error in loadConferenceData:', err);
      setError('Error loading test data');
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