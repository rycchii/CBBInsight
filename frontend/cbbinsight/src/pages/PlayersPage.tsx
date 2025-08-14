import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import './PlayersPage.css'

interface Player {
  playerName: string;
  position: string;
  games_played: number;
  games_started: number;
  minutes_played: number;
  fg_per_game: number;
  fga_per_game: number;
  fg_percentage: number;
  threep_per_game: number;
  threepa_per_game: number;
  threep_percentage: number;
  twop_per_game: number;
  twopa_per_game: number;
  twop_percentage: number;
  efg: number;
  ft_per_game: number;
  fta_per_game: number;
  ft_percentage: number;
  orb: number;
  drb: number;
  trb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  pts: number;
  school_name: string;
  conference: string;
}

type SortField = keyof Player;
type SortDirection = 'asc' | 'desc';

const PlayersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('playerName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const playersPerPage = 50

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    try {
      setLoading(true)
      const playersData = await apiService.getAllPlayers()
      
      // Sort alphabetically by playerName initially
      const sortedPlayers = playersData.sort((a, b) => 
        (a.playerName || '').localeCompare(b.playerName || '')
      )
      
      setPlayers(sortedPlayers)
      setError(null)
    } catch (err) {
      setError('Failed to load players data. Make sure your Spring Boot backend is running on localhost:8080')
      console.error('Error loading players:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return faSort
    return sortDirection === 'asc' ? faSortUp : faSortDown
  }

  // Filter and sort players
  const filteredPlayers = players.filter(player =>
    (player.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (player.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (player.conference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const aValue = a[sortField] || ''
    const bValue = b[sortField] || ''
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue
    }
    
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage)
  const startIndex = (currentPage - 1) * playersPerPage
  const paginatedPlayers = sortedPlayers.slice(startIndex, startIndex + playersPerPage)

  const formatSchoolName = (schoolName: string): string => {
    if (!schoolName) return 'N/A'
    
    return schoolName
      .split('-')
      .map((word, index, array) => {
        if (word.toLowerCase() === 'state') return 'State'
        if (word.toLowerCase() === 'am') return 'A&M'
        if (word.toLowerCase() === 'tech') return 'Tech'
        if (word.toLowerCase() === 'university') return 'University'
        if (word.toLowerCase() === 'college') return 'College'
        if (word.toLowerCase() === 'institute') return 'Institute'
        if (word.toLowerCase() === 'international') return 'International'
        
        if (word.toLowerCase() === 'st') {
          if (index === 0 || (index > 0 && array[index - 1].toLowerCase() === 'mount')) {
            return 'St.'
          }
          // Otherwise it's probably "State"
          return 'State'
        }
        
        // Handle location abbreviations that should stay uppercase
        if (word.toLowerCase() === 'ny') return 'NY'
        if (word.toLowerCase() === 'ca') return 'CA'
        if (word.toLowerCase() === 'tx') return 'TX'
        if (word.toLowerCase() === 'fl') return 'FL'
        
        // For regular words, capitalize first letter only
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ') // Join with spaces instead of dashes
  }

  if (loading) {
    return (
      <div className="players-page">
        <div className="players-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <h2>Loading Players...</h2>
            <p>Fetching data from Spring Boot API...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="players-page">
        <div className="players-container">
          <div className="error-state">
            <h2>Error Loading Players</h2>
            <p>{error}</p>
            <button onClick={loadPlayers} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="players-page">
      <div className="players-container">
        <div className="players-header">
          <h1>NCAA Basketball Players</h1>
          <p>Complete stats for {players.length} players across all divisions</p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search players by name, school, position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          {searchTerm && (
            <p className="search-results">
              Showing {filteredPlayers.length} of {players.length} players
            </p>
          )}
        </div>

        {/* Players Table */}
        <div className="table-container">
          <table className="players-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('playerName')} className="sortable">
                  Name <FontAwesomeIcon icon={getSortIcon('playerName')} />
                </th>
                <th onClick={() => handleSort('position')} className="sortable">
                  Pos <FontAwesomeIcon icon={getSortIcon('position')} />
                </th>
                <th onClick={() => handleSort('games_played')} className="sortable">
                  Games Played <FontAwesomeIcon icon={getSortIcon('games_played')} />
                </th>
                <th onClick={() => handleSort('games_started')} className="sortable">
                  Games Started <FontAwesomeIcon icon={getSortIcon('games_started')} />
                </th>
                <th onClick={() => handleSort('minutes_played')} className="sortable">
                  Minutes <FontAwesomeIcon icon={getSortIcon('minutes_played')} />
                </th>
                <th onClick={() => handleSort('pts')} className="sortable">
                  PTS <FontAwesomeIcon icon={getSortIcon('pts')} />
                </th>
                <th onClick={() => handleSort('fg_per_game')} className="sortable">
                  FG/G <FontAwesomeIcon icon={getSortIcon('fg_per_game')} />
                </th>
                <th onClick={() => handleSort('fga_per_game')} className="sortable">
                  FGA/G <FontAwesomeIcon icon={getSortIcon('fga_per_game')} />
                </th>
                <th onClick={() => handleSort('fg_percentage')} className="sortable">
                  FG% <FontAwesomeIcon icon={getSortIcon('fg_percentage')} />
                </th>
                <th onClick={() => handleSort('threep_per_game')} className="sortable">
                  3P/G <FontAwesomeIcon icon={getSortIcon('threep_per_game')} />
                </th>
                <th onClick={() => handleSort('threepa_per_game')} className="sortable">
                  3PA/G <FontAwesomeIcon icon={getSortIcon('threepa_per_game')} />
                </th>
                <th onClick={() => handleSort('threep_percentage')} className="sortable">
                  3P% <FontAwesomeIcon icon={getSortIcon('threep_percentage')} />
                </th>
                <th onClick={() => handleSort('twop_per_game')} className="sortable">
                  2P/G <FontAwesomeIcon icon={getSortIcon('twop_per_game')} />
                </th>
                <th onClick={() => handleSort('twopa_per_game')} className="sortable">
                  2PA/G <FontAwesomeIcon icon={getSortIcon('twopa_per_game')} />
                </th>
                <th onClick={() => handleSort('twop_percentage')} className="sortable">
                  2P% <FontAwesomeIcon icon={getSortIcon('twop_percentage')} />
                </th>
                <th onClick={() => handleSort('efg')} className="sortable">
                  eFG% <FontAwesomeIcon icon={getSortIcon('efg')} />
                </th>
                <th onClick={() => handleSort('ft_per_game')} className="sortable">
                  FT/G <FontAwesomeIcon icon={getSortIcon('ft_per_game')} />
                </th>
                <th onClick={() => handleSort('fta_per_game')} className="sortable">
                  FTA/G <FontAwesomeIcon icon={getSortIcon('fta_per_game')} />
                </th>
                <th onClick={() => handleSort('ft_percentage')} className="sortable">
                  FT% <FontAwesomeIcon icon={getSortIcon('ft_percentage')} />
                </th>
                <th onClick={() => handleSort('orb')} className="sortable">
                  ORB <FontAwesomeIcon icon={getSortIcon('orb')} />
                </th>
                <th onClick={() => handleSort('drb')} className="sortable">
                  DRB <FontAwesomeIcon icon={getSortIcon('drb')} />
                </th>
                <th onClick={() => handleSort('trb')} className="sortable">
                  TRB <FontAwesomeIcon icon={getSortIcon('trb')} />
                </th>
                <th onClick={() => handleSort('ast')} className="sortable">
                  AST <FontAwesomeIcon icon={getSortIcon('ast')} />
                </th>
                <th onClick={() => handleSort('stl')} className="sortable">
                  STL <FontAwesomeIcon icon={getSortIcon('stl')} />
                </th>
                <th onClick={() => handleSort('blk')} className="sortable">
                  BLK <FontAwesomeIcon icon={getSortIcon('blk')} />
                </th>
                <th onClick={() => handleSort('tov')} className="sortable">
                  TOV <FontAwesomeIcon icon={getSortIcon('tov')} />
                </th>
                <th onClick={() => handleSort('pf')} className="sortable">
                  PF <FontAwesomeIcon icon={getSortIcon('pf')} />
                </th>
                <th onClick={() => handleSort('school_name')} className="sortable">
                  School <FontAwesomeIcon icon={getSortIcon('school_name')} />
                </th>
                <th onClick={() => handleSort('conference')} className="sortable">
                  Conference <FontAwesomeIcon icon={getSortIcon('conference')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlayers.map((player, index) => (
                <tr key={`${player.playerName}-${index}`} className="player-row">
                  <td className="player-name">{player.playerName || 'N/A'}</td>
                  <td className="player-position">
                    <span className={`position-badge ${player.position?.toLowerCase()}`}>
                      {player.position || 'N/A'}
                    </span>
                  </td>
                  <td>{player.games_played || 0}</td>
                  <td>{player.games_started || 0}</td>
                  <td>{player.minutes_played || 0}</td>
                  <td className="player-pts">{player.pts?.toFixed(1) || '0.0'}</td>
                  <td>{player.fg_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.fga_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.fg_percentage ? `${(player.fg_percentage * 100).toFixed(1)}%` : 'N/A'}</td>
                  <td>{player.threep_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.threepa_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.threep_percentage ? `${(player.threep_percentage * 100).toFixed(1)}%` : 'N/A'}</td>
                  <td>{player.twop_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.twopa_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.twop_percentage ? `${(player.twop_percentage * 100).toFixed(1)}%` : 'N/A'}</td>
                  <td>{player.efg ? `${(player.efg * 100).toFixed(1)}%` : 'N/A'}</td>
                  <td>{player.ft_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.fta_per_game?.toFixed(1) || '0.0'}</td>
                  <td>{player.ft_percentage ? `${(player.ft_percentage * 100).toFixed(1)}%` : 'N/A'}</td>
                  <td>{player.orb?.toFixed(1) || '0.0'}</td>
                  <td>{player.drb?.toFixed(1) || '0.0'}</td>
                  <td>{player.trb?.toFixed(1) || '0.0'}</td>
                  <td>{player.ast?.toFixed(1) || '0.0'}</td>
                  <td>{player.stl?.toFixed(1) || '0.0'}</td>
                  <td>{player.blk?.toFixed(1) || '0.0'}</td>
                  <td>{player.tov?.toFixed(1) || '0.0'}</td>
                  <td>{player.pf?.toFixed(1) || '0.0'}</td>
                  <td className="player-school">{formatSchoolName(player.school_name)}</td>
                  <td className="player-conference">{player.conference || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}

        {filteredPlayers.length === 0 && searchTerm && (
          <div className="no-results">
            <FontAwesomeIcon icon={faSearch} className="no-results-icon" />
            <h3>No players found</h3>
            <p>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayersPage