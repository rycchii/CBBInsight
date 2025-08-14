import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner, faUsers} from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import './PositionsPage.css'

interface Position {
  name: string;
  abbreviation: string;
  playerCount?: number;
  description?: string;
  image?: string;
}

const PositionsPage: React.FC = () => {
  const [searchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const positions: Position[] = [
    {
      name: 'Guards',
      abbreviation: 'G',
      playerCount: 0,
      description: 'Point Guards & Shooting Guards',
      image: '/images/buttonimages/guard.webp'
    },
    {
      name: 'Forwards',
      abbreviation: 'F',
      playerCount: 0,
      description: 'Small Forwards & Power Forwards',
      image: '/images/buttonimages/forward.jpg'
    },
    {
      name: 'Centers',
      abbreviation: 'C',
      playerCount: 0,
      description: 'Centers & Big Men',
      image: '/images/buttonimages/center.webp'
    }
  ]

  const [positionsData, setPositionsData] = useState<Position[]>(positions)

  useEffect(() => {
    loadPositionsData()
  }, [])

  const loadPositionsData = async () => {
    try {
      setLoading(true)
      const players = await apiService.getAllPlayers()
      
      // Count players by position (G, F, C)
      const positionCounts = players.reduce((acc, player) => {
        if (player.position) {
          const pos = player.position.toUpperCase()
          acc[pos] = (acc[pos] || 0) + 1
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
      
      console.log('Position counts:', positionCounts)

    } catch (error) {
      console.error('Error loading positions data:', error)
      setError('Failed to load positions data')
    } finally {
      setLoading(false)
    }
  }

  // Filter positions based on search term
  const filteredPositions = positionsData.filter(position =>
    position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePositionClick = async (position: Position) => {
    try {
      const players = await apiService.getAllPlayers()
      const positionPlayers = players.filter(player => 
        player.position?.toUpperCase() === position.abbreviation
      )
      console.log(`${position.name} has ${positionPlayers.length} players:`, positionPlayers)
      
      // TODO: Navigate to position detail page
    } catch (error) {
      console.error('Error loading position players:', error)
    }
  }

  if (loading) {
    return (
      <div className="positions-container">
        <div className="loading-state">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <h2>Loading Positions...</h2>
          <p>Fetching data from Spring Boot API...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="positions-container">
        <div className="error-state">
          <h2>Error Loading Positions</h2>
          <p>{error}</p>
          <button onClick={loadPositionsData} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="positions-page">
      <div className="positions-container">
        <div className="positions-header">
          <h1>
            Basketball Positions
          </h1>
        </div>

        {/* Positions Grid */}
        <div className="positions-grid">
          {filteredPositions.map((position, index) => (
            <div
              key={`${position.abbreviation}-${index}`}
              className="position-card"
              onClick={() => handlePositionClick(position)}
            >
              <div 
                className="position-background"
                style={position.image ? { backgroundImage: `url(${position.image})` } : {
                  background: 'linear-gradient(135deg, #ff6b35, #f9844a)'
                }}
              />
              <div className="position-info">
                <h3 className="position-name">{position.name}</h3>
                <p className="position-description">{position.description}</p>
                <div className="position-stats">
                  <span className="stat-item">
                    <FontAwesomeIcon icon={faUsers} /> {position.playerCount || 0} players
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPositions.length === 0 && searchTerm && (
          <div className="no-results">
            <FontAwesomeIcon icon={faSearch} className="no-results-icon" />
            <h3>No positions found</h3>
            <p>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PositionsPage