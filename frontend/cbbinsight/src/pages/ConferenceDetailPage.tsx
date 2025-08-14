import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch, faSpinner, faTrophy, faGraduationCap, faUsers } from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import { getConferenceAbbreviation } from '../utils/conferenceUtils' // Add this import
import type { Player, School } from '../services/api' // Import interfaces from API service
import './ConferenceDetailPage.css'

// Remove the local interfaces and use the ones from API service
// interface School { ... } - REMOVE THIS
// interface Player { ... } - REMOVE THIS

interface Conference {
  id: number;
  name: string;
  abbreviation: string;
  fullName?: string;
  logoUrl?: string;
}

const ConferenceDetailPage: React.FC = () => {
  const { conferenceId } = useParams<{ conferenceId: string }>()
  const navigate = useNavigate()
  
  const [conference, setConference] = useState<Conference | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [selectedTeam, setSelectedTeam] = useState<School | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams')

  useEffect(() => {
    if (conferenceId) {
      loadConferenceData()
    }
  }, [conferenceId])

  const loadConferenceData = async () => {
    try {
      setLoading(true)
      
      // Load conference details
      const allSchools = await apiService.getSchools()
      const conferenceTeams = allSchools.filter(school =>
        school.conference?.toLowerCase() === conferenceId?.toLowerCase()
      )
      
      // Create conference object from teams data
      const conferenceData: Conference = {
        id: 1,
        name: conferenceId?.toUpperCase() || '',
        abbreviation: conferenceId?.toUpperCase() || '',
        fullName: `${conferenceId?.toUpperCase()} Conference`
      }
      
      setConference(conferenceData)
      setSchools(conferenceTeams)
      
      // Load all players for this conference
      const allPlayers = await apiService.getPlayers()
      const conferencePlayers = allPlayers.filter(player =>
        conferenceTeams.some(school => school.name === player.school_name)
      )
      setPlayers(conferencePlayers)
      
      setError(null)
    } catch (err) {
      setError('Failed to load conference data. Make sure your Spring Boot backend is running.')
      console.error('Error loading conference:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTeamClick = async (team: School) => {
    setSelectedTeam(team)
    setActiveTab('players')
    
    // Filter players for selected team - use 'school_name' property from API
    const teamPlayers = players.filter(player => player.school_name === team.name)
    console.log(`${team.name} has ${teamPlayers.length} players:`, teamPlayers)
  }

  const filteredTeams = schools.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.mascot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPlayers = selectedTeam 
    ? players.filter(player => 
        player.school_name === selectedTeam.name && // Changed to school_name
        (player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         player.position?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : players.filter(player =>
        player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) // Changed to school_name
      )

  if (loading) {
    return (
      <div className="conference-detail-page">
        <div className="conference-detail-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <h2>Loading Conference...</h2>
            <p>Fetching teams and players...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !conference) {
    return (
      <div className="conference-detail-page">
        <div className="conference-detail-container">
          <div className="error-state">
            <h2>Conference Not Found</h2>
            <p>{error || 'Could not load conference data'}</p>
            <button onClick={() => navigate('/conferences')} className="back-button">
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Conferences
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="conference-detail-page"></div>
      <div className="conference-detail-container">
        {/* Header */}
        <div className="conference-detail-header">
          <button onClick={() => navigate('/conferences')} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Conferences
          </button>
          
          <div className="conference-info">
            <div className="conference-logo">
              {conference.logoUrl ? (
                <img src={conference.logoUrl} alt={`${conference.name} logo`} />
              ) : (
                <div className="placeholder-logo">
                  <FontAwesomeIcon icon={faTrophy} />
                </div>
              )}
            </div>
            <h1>{getConferenceAbbreviation(conference.name)}</h1> {/* Show abbreviation */}
            <p className="conference-full-name">{conference.fullName}</p> {/* Show full name */}
            <div className="conference-stats">
              <span className="stat-item">
                <FontAwesomeIcon icon={faGraduationCap} /> {schools.length} Teams
              </span>
              <span className="stat-item">
                <FontAwesomeIcon icon={faUsers} /> {players.length} Players
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('teams')
              setSelectedTeam(null)
              setSearchTerm('')
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} /> Teams ({schools.length})
          </button>
          <button 
            className={`tab ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('players')
              setSearchTerm('')
            }}
          >
            <FontAwesomeIcon icon={faUsers} /> 
            {selectedTeam ? `${selectedTeam.name} Players` : `All Players (${players.length})`}
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder={activeTab === 'teams' ? 'Search teams...' : 'Search players...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {searchTerm && (
            <p className="search-results">
              Showing {activeTab === 'teams' ? filteredTeams.length : filteredPlayers.length} results
            </p>
          )}
        </div>

        {/* Content */}
        {activeTab === 'teams' ? (
          <div className="teams-grid">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="team-card"
                onClick={() => handleTeamClick(team)}
              >
                <div className="team-logo">
                  <div className="placeholder-logo">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                </div>
                <div className="team-info">
                  <h3>{team.name}</h3>
                  {team.mascot && <p className="team-mascot">{team.mascot}</p>}
                  {team.location && <p className="team-location">{team.location}</p>}
                  <div className="team-stats">
                    {team.wins !== undefined && team.losses !== undefined && (
                      <span className="stat-item">
                        Record: {team.wins}-{team.losses}
                      </span>
                    )}
                    <span className="stat-item">
                      <FontAwesomeIcon icon={faUsers} /> 
                      {players.filter(p => p.school_name === team.name).length} players
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="players-grid">
            {selectedTeam && (
              <div className="selected-team-info">
                <h3>
                  <FontAwesomeIcon icon={faGraduationCap} /> {selectedTeam.name} Roster
                </h3>
                <button 
                  onClick={() => setSelectedTeam(null)}
                  className="show-all-button"
                >
                  Show All Conference Players
                </button>
              </div>
            )}
            
            {filteredPlayers.map((player, index) => (
              <div key={`${player.school_name}-${player.playerName}-${index}`} className="player-card">
                <div className="player-info">
                  <h4>{player.playerName}</h4>
                  <p className="player-team">{player.school_name}</p> {/* Changed to school_name */}
                  <div className="player-details">
                    {player.position && (
                      <span className="detail-item">
                        <strong>Position:</strong> {player.position}
                      </span>
                    )}
                    <span className="detail-item">
                      <strong>Games:</strong> {player.games_played}
                    </span>
                    <span className="detail-item">
                      <strong>Points/Game:</strong> {player.pts}
                    </span>
                    <span className="detail-item">
                      <strong>Assists/Game:</strong> {player.ast}
                    </span>
                    <span className="detail-item">
                      <strong>Rebounds/Game:</strong> {player.trb}
                    </span>
                    <span className="detail-item">
                      <strong>FG%:</strong> {(player.fg_percentage * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {((activeTab === 'teams' && filteredTeams.length === 0) || 
          (activeTab === 'players' && filteredPlayers.length === 0)) && searchTerm && (
          <div className="no-results">
            <FontAwesomeIcon icon={faSearch} className="no-results-icon" />
            <h3>No {activeTab} found</h3>
            <p>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ConferenceDetailPage