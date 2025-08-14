import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { apiService } from '../services/api'
import { 
  getConferenceAbbreviation, 
  fetchAllTeamLogos, 
  getSchoolLogoFromMap, 
  getDefaultSchoolLogo 
} from '../utils/conferenceUtils'
import './SchoolsPage.css'

interface School {
  name: string;
  originalName?: string;
  playerCount?: number;
  conference?: string;
}

const SchoolsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logoMap, setLogoMap] = useState<{ [key: string]: string }>({})
  const [logosLoaded, setLogosLoaded] = useState(false)

  useEffect(() => {
    loadSchools()
    loadLogos()
  }, [])

  const loadLogos = async () => {
    try {
      const logos = await fetchAllTeamLogos()
      setLogoMap(logos)
      setLogosLoaded(true)
      console.log('Loaded logos for', Object.keys(logos).length, 'teams from Sports Reference')
      
      // Debug: Show available logos
      console.log('Available team logos:', Object.keys(logos).sort())
      
    } catch (error) {
      console.error('Error loading team logos:', error)
      setLogosLoaded(true) // Set to true anyway to stop loading
    }
  }

  const loadSchools = async () => {
    try {
      setLoading(true)
      const players = await apiService.getAllPlayers()
      
      // Your existing formatSchoolName function
      const formatSchoolName = (name: string): string => {
        return name
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => {
            const lowerWord = word.toLowerCase()
            
            const allCapsAbbreviations = [
              'usc', 'ucla', 'unlv', 'utep', 'smu', 'tcu', 'vcu', 'fiu', 
              'fsu', 'lsu', 'uab', 'ucf', 'unc', 'utsa', 'umbc', 'uic',
              'asu', 'byu', 'ttu', 'wvu', 'psu', 'osu', 'msu'
            ]
            
            if (allCapsAbbreviations.includes(lowerWord)) {
              return word.toUpperCase()
            }
            
            if (lowerWord === 'st') {
              return 'St.'
            }
            
            if (lowerWord.includes('&')) {
              return word.split('&').map(part => 
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
              ).join('&')
            }
            
            if (word.length === 2) {
              const twoLetterSpecialCases: { [key: string]: string } = {
                'am': 'A&M',
                'el': 'El',
                'la': 'La',
                'du': 'Du',
                'mc': 'Mc',
                'st': 'St',
                'de': 'De',
                'va': 'VA',
                'ny': 'NY',
              }
              
              return twoLetterSpecialCases[lowerWord] || 
                     (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            }
            
            const specialWordCases: { [key: string]: string } = {
              'tech': 'Tech',
              'state': 'State',
              'university': 'University',
              'college': 'College',
              'southern': 'Southern',
              'northern': 'Northern',
              'eastern': 'Eastern',
              'western': 'Western',
              'central': 'Central',
              'international': 'International',
              'american': 'American',
              'christian': 'Christian',
              'baptist': 'Baptist',
              'methodist': 'Methodist',
              'presbyterian': 'Presbyterian',
              'catholic': 'Catholic'
            }
            
            if (specialWordCases[lowerWord]) {
              return specialWordCases[lowerWord]
            }
            
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          })
          .join(' ')
      }
      
      // Extract unique schools from players data
      const schoolMap = new Map<string, School>()
      
      players.forEach(player => {
        if (player.school) {
          const formattedName = formatSchoolName(player.school)
          const existing = schoolMap.get(formattedName)
          if (existing) {
            existing.playerCount = (existing.playerCount || 0) + 1
          } else {
            schoolMap.set(formattedName, {
              name: formattedName,
              originalName: player.school,
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

  const handleSchoolClick = async (school: School) => {
    try {
      const originalName = school.originalName || school.name.toLowerCase().replace(/\s+/g, '-')
      const players = await apiService.getPlayersBySchool(originalName)
      console.log(`${school.name} has ${players.length} players:`, players)
    } catch (error) {
      console.error('Error loading school players:', error)
    }
  }

  const getSchoolLogo = (school: School): string => {
    if (!logosLoaded) {
      return getDefaultSchoolLogo()
    }
    
    const logo = getSchoolLogoFromMap(school.name, logoMap)
    return logo || getDefaultSchoolLogo()
  }

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.conference?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && !logosLoaded) {
    return (
      <div className="schools-container">
        <div className="loading-state">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <h2>Loading Schools...</h2>
          <p>Fetching data and Sports Reference logos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="schools-container">
        <div className="error-state">
          <h2>Error Loading Schools</h2>
          <p>{error}</p>
          <button onClick={loadSchools} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="schools-container">
      <div className="schools-header">
        <h1>NCAA Basketball Schools</h1>
        <p>Explore {schools.length} schools and their basketball programs</p>
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
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${getSchoolLogo(school)})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="school-info">
              <h3 className="school-name">{school.name}</h3>
              <div className="school-stats">
                <span className="stat-item">
                  <FontAwesomeIcon icon="users" /> {school.playerCount || 0}
                </span>
                {school.conference && (
                  <span className="conference-tag">
                    {getConferenceAbbreviation(school.conference)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredSchools.length === 0 && searchTerm && !loading && (
        <div className="no-results">
          <FontAwesomeIcon icon={faSearch} className="no-results-icon" />
          <h3>No schools found</h3>
          <p>Try adjusting your search term</p>
        </div>
      )}
    </div>
  )
}

export default SchoolsPage