import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import './SchoolsPage.css'

interface School {
  name: string;
  playerCount?: number;
  conference?: string;
}

const SchoolsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSchools()
  }, [])

  const loadSchools = async () => {
    try {
      setLoading(true)
      const players = await apiService.getAllPlayers()
      
      // Extract unique schools from players data
      const schoolMap = new Map<string, School>()
      
      players.forEach(player => {
        if (player.school) {
          const existing = schoolMap.get(player.school)
          if (existing) {
            existing.playerCount = (existing.playerCount || 0) + 1
          } else {
            schoolMap.set(player.school, {
              name: player.school,
              playerCount: 1,
              conference: player.conference
            })
          }
        }
      })

      const schoolsArray = Array.from(schoolMap.values()).sort((a, b) => a.name.localeCompare(b.name))
      setSchools(schoolsArray)
      setError(null)
    } catch (err) {
      setError('Failed to load schools. Make sure your Spring Boot backend is running on localhost:8080')
      console.error('Error loading schools:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter schools based on search term
  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.conference && school.conference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSchoolClick = async (school: School) => {
    try {
      // Example: Load players for this school
      const players = await apiService.getPlayersBySchool(school.name)
      console.log(`${school.name} has ${players.length} players:`, players)
      
      // TODO: Navigate to school detail page or show players
      // Example: navigate(`/schools/${encodeURIComponent(school.name)}`)
    } catch (error) {
      console.error('Error loading school players:', error)
    }
  }

  if (loading) {
    return (
      <div className="schools-page">
        <div className="schools-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <h2>Loading Schools...</h2>
            <p>Fetching data from Spring Boot API...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="schools-page">
        <div className="schools-container">
          <div className="error-state">
            <h2>Error Loading Schools</h2>
            <p>{error}</p>
            <button onClick={loadSchools} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="schools-page">
      <div className="schools-container">
        <div className="schools-header">
          <h1>NCAA Basketball Schools</h1>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search schools or conferences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {searchTerm && (
            <p className="search-results">
              Showing {filteredSchools.length} of {schools.length} schools
            </p>
          )}
        </div>

        {/* Schools Grid */}
        <div className="schools-grid">
          {filteredSchools.map((school, index) => (
            <div
              key={`${school.name}-${index}`}
              className="school-card"
              onClick={() => handleSchoolClick(school)}
            >
              <div className="school-logo">
                <div className="placeholder-logo">
                  <FontAwesomeIcon icon="shirt" className="placeholder-icon" />
                </div>
              </div>
              <div className="school-info">
                <h3 className="school-name">{school.name}</h3>
                <div className="school-stats">
                  <span className="stat-item">
                    <FontAwesomeIcon icon="users" /> {school.playerCount || 0}
                  </span>
                  {school.conference && (
                    <span className="conference-tag">{school.conference}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSchools.length === 0 && searchTerm && (
          <div className="no-results">
            <FontAwesomeIcon icon="search" className="no-results-icon" />
            <h3>No schools found</h3>
            <p>Try adjusting your search term</p>
          </div>
        )}

        {schools.length === 0 && !loading && (
          <div className="no-results">
            <FontAwesomeIcon icon="shirt" className="no-results-icon" />
            <h3>No schools found</h3>
            <p>Make sure your Spring Boot backend is running and has data</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SchoolsPage