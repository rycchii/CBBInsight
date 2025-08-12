import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import './PositionsPage.css'

interface Position {
  name: string;
  abbreviation: string;
  playerCount?: number;
}

const positions: Position[] = [
  {
    name: 'Point Guard',
    abbreviation: 'PG',
    playerCount: 0
  },
  {
    name: 'Shooting Guard',
    abbreviation: 'SG',
    playerCount: 0
  },
  {
    name: 'Small Forward',
    abbreviation: 'SF',
    playerCount: 0
  },
  {
    name: 'Power Forward',
    abbreviation: 'PF',
    playerCount: 0
  },
  {
    name: 'Center',
    abbreviation: 'C',
    playerCount: 0
  }
]

const PositionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [positionsData, setPositionsData] = useState<Position[]>(positions)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPositionsData()
  }, [])

  const loadPositionsData = async () => {
    try {
      setLoading(true)
      const players = await apiService.getAllPlayers()
      
      // Count players by position
      const positionCounts = players.reduce((acc, player) => {
        if (player.position) {
          acc[player.position] = (acc[player.position] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

      // Update positions with player counts
      const updatedPositions = positions.map(pos => ({
        ...pos,
        playerCount: positionCounts[pos.abbreviation] || 0
      }))

      setPositionsData(updatedPositions)
      setError(null)
    } catch (err) {
      setError('Failed to load positions data. Make sure your Spring Boot backend is running on localhost:8080')
      console.error('Error loading positions:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter positions based on search term
  const filteredPositions = positionsData.filter(position =>
    position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePositionClick = async (position: Position) => {
    try {
      // Example: Load players for this position
      const players = await apiService.getAllPlayers()
      const positionPlayers = players.filter(player => player.position === position.abbreviation)
      console.log(`${position.name} has ${positionPlayers.length} players:`, positionPlayers)
      
      // TODO: Navigate to position detail page or show players
      // Example: navigate(`/positions/${position.abbreviation.toLowerCase()}`)
    } catch (error) {
      console.error('Error loading position players:', error)
    }
  }

  if (loading) {
    return (
      <div className="positions-page">
        <div className="positions-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <h2>Loading Positions...</h2>
            <p>Fetching data from Spring Boot API...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="positions-page">
        <div className="positions-container">
          <div className="error-state">
            <h2>Error Loading Positions</h2>
            <p>{error}</p>
            <button onClick={loadPositionsData} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="positions-page">
      <div className="positions-container">
        <div className="positions-header">
          <h1>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="header-icon" />
            Basketball Positions
          </h1>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {searchTerm && (
            <p className="search-results">
              Showing {filteredPositions.length} of {positionsData.length} positions
            </p>
          )}
        </div>

        {/* Positions Grid */}
        <div className="positions-grid">
          {filteredPositions.map((position, index) => (
            <div
              key={`${position.abbreviation}-${index}`}
              className="position-card"
              onClick={() => handlePositionClick(position)}
            >
              <div className="position-logo">
                <div className="placeholder-logo">
                  <span className="position-abbreviation">{position.abbreviation}</span>
                </div>
              </div>
              <div className="position-info">
                <h3 className="position-name">{position.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {filteredPositions.length === 0 && searchTerm && (
          <div className="no-results">
            <FontAwesomeIcon icon="search" className="no-results-icon" />
            <h3>No positions found</h3>
            <p>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PositionsPage