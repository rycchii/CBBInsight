import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Add this import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import './ConferencesPage.css'

// Your existing interfaces...
interface Conference {
  name: string;
  abbreviation?: string;
  fullName?: string;
  logoUrl?: string;
  playerCount?: number;
  schoolCount?: number;
}

const ConferencesPage: React.FC = () => {
  const navigate = useNavigate() // Add this line
  
  const [conferences, setConferences] = useState<Conference[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Your existing useEffect and loadConferencesData...
  useEffect(() => {
    loadConferencesData()
  }, [])

  const loadConferencesData = async () => {
    try {
      setLoading(true)
      const data = await apiService.getConferences()
      
      // Add debugging to see what data we're getting
      console.log('Raw conference data from API:', data)
      
      // Also check players data to see school/conference structure
      const players = await apiService.getAllPlayers()
      console.log('Sample players data:', players.slice(0, 5))
      console.log('Unique conferences from players:', [...new Set(players.map(p => p.conference))])
      console.log('Unique schools from players:', [...new Set(players.map(p => p.school))])
      
      const mappedConferences = data.map(conf => ({
        ...conf,
        abbreviation: conf.name.toLowerCase().replace(/\s+/g, '-'),
        fullName: `${conf.name} Conference`
      }))
      
      console.log('Mapped conferences:', mappedConferences)
      
      setConferences(mappedConferences)
      setError(null)
    } catch (err) {
      setError('Failed to load conferences. Make sure your Spring Boot backend is running.')
      console.error('Error loading conferences:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add this function
  const handleConferenceClick = (conference: Conference) => {
    try {
      // Navigate to conference detail page using the conference name
      const conferenceId = conference.name.toLowerCase().replace(/\s+/g, '-')
      navigate(`/conferences/${conferenceId}`)
    } catch (error) {
      console.error('Error navigating to conference:', error)
    }
  }

  const filteredConferences = conferences.filter(conference =>
    conference.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conference.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <div className="conferences-page"></div>
        <div className="conferences-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <h2>Loading Conferences...</h2>
            <p>Fetching data from Spring Boot API...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <div className="conferences-page"></div>
        <div className="conferences-container">
          <div className="error-state">
            <h2>Error Loading Conferences</h2>
            <p>{error}</p>
            <button onClick={loadConferencesData} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="conferences-page"></div>
      <div className="conferences-container">
        <div className="conferences-header">
          <h1>
            <FontAwesomeIcon icon={faTrophy} className="header-icon" />
            NCAA Basketball Conferences
          </h1>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search conferences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          {searchTerm && (
            <p className="search-results">
              Showing {filteredConferences.length} of {conferences.length} conferences
            </p>
          )}
        </div>

        {/* Conferences Grid */}
        <div className="conferences-grid">
          {filteredConferences.map((conference, index) => (
            <div
              key={`${conference.name}-${index}`}
              className="conference-card"
              onClick={() => handleConferenceClick(conference)} // Add this onClick handler
            >
              <div className="conference-logo">
                {conference.logoUrl ? (
                  <img 
                    src={conference.logoUrl} 
                    alt={`${conference.name} logo`}
                    className="conference-image"
                  />
                ) : (
                  <div className="placeholder-logo">
                    <FontAwesomeIcon icon={faTrophy} className="placeholder-icon" />
                  </div>
                )}
              </div>
              <div className="conference-info">
                <h3>{conference.name}</h3>
                <p className="conference-full-name">{conference.fullName}</p>
                <div className="conference-stats">
                  <span className="stat-item">
                    <FontAwesomeIcon icon="graduation-cap" /> {conference.schoolCount || 0} schools
                  </span>
                  <span className="stat-item">
                    <FontAwesomeIcon icon="users" /> {conference.playerCount || 0} players
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredConferences.length === 0 && searchTerm && !loading && (
          <div className="no-results">
            <FontAwesomeIcon icon="search" className="no-results-icon" />
            <h3>No conferences found</h3>
            <p>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ConferencesPage