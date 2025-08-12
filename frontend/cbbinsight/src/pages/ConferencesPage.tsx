import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import type { Conference } from '../services/api'  // Type-only import
import './ConferencesPage.css'

const ConferencesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadConferences()
  }, [])

  const loadConferences = async () => {
    try {
      setLoading(true)
      const data = await apiService.getConferences()
      setConferences(data)
      setError(null)
    } catch (err) {
      setError('Failed to load conferences. Make sure your Spring Boot backend is running on localhost:8080')
      console.error('Error loading conferences:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter conferences based on search term
  const filteredConferences = conferences.filter(conference =>
    conference.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleConferenceClick = async (conference: Conference) => {
    try {
      // Example: Load players for this conference
      const players = await apiService.getPlayersByConference(conference.name)
      console.log(`${conference.name} has ${players.length} players:`, players)
      
      // TODO: Navigate to conference detail page or show players
      // Example: navigate(`/conferences/${encodeURIComponent(conference.name)}`)
    } catch (error) {
      console.error('Error loading conference players:', error)
    }
  }

  if (loading) {
    return (
      <div className="conferences-page">
        <div className="conferences-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <h2>Loading Conferences...</h2>
            <p>Fetching data from Spring Boot API...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="conferences-page">
        <div className="conferences-container">
          <div className="error-state">
            <h2>Error Loading Conferences</h2>
            <p>{error}</p>
            <button onClick={loadConferences} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="conferences-page">
      <div className="conferences-container">
        <div className="conferences-header">
          <h1>
            NCAA Basketball Conferences
          </h1>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search conferences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {searchTerm && (
            <p className="search-results">
              Showing {filteredConferences.length} of {conferences.length} conferences
            </p>
          )}
        </div>

        {/* Conference Grid */}
        <div className="conferences-grid">
          {filteredConferences.map((conference, index) => (
            <div
              key={`${conference.name}-${index}`}
              className="conference-card"
              onClick={() => handleConferenceClick(conference)}
            >
              <div className="conference-logo">
                <div className="placeholder-logo">
                  <FontAwesomeIcon icon="flag" className="placeholder-icon" />
                </div>
              </div>
              <div className="conference-info">
                <h3 className="conference-display-name">{conference.name}</h3>
                <div className="conference-stats">
                  <span className="stat-item">
                    <FontAwesomeIcon icon="users" /> {conference.playerCount || 0} players
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredConferences.length === 0 && searchTerm && (
          <div className="no-results">
            <FontAwesomeIcon icon="search" className="no-results-icon" />
            <h3>No conferences found</h3>
            <p>Try adjusting your search term</p>
          </div>
        )}

        {conferences.length === 0 && !loading && (
          <div className="no-results">
            <FontAwesomeIcon icon="users" className="no-results-icon" />
            <h3>No conferences found</h3>
            <p>Make sure your Spring Boot backend is running and has data</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConferencesPage