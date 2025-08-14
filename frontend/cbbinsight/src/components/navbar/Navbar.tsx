import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faTrophy, faGraduationCap, faUsers, faLightbulb, faSearch, faShirt } from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'

const Navbar: React.FC = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  const isActive = (path: string) => location.pathname === path

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchTerm)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            CBB Insight
          </Link>
          
          <div className="navbar-links">
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Link>

            <Link 
              to="/players" 
              className={`navbar-link ${isActive('/players') ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>Players</span>
            </Link>

            <Link 
              to="/schools" 
              className={`navbar-link ${isActive('/schools') ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
              <span>Schools</span>
            </Link>
            <Link 
              to="/conferences" 
              className={`navbar-link ${isActive('/conferences') ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faTrophy} />
              <span>Conferences</span>
            </Link>
            
            
            <Link 
              to="/positions" 
              className={`navbar-link ${isActive('/positions') ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faShirt} />
              <span>Positions</span>
            </Link>
            
            <Link 
              to="/insight" 
              className={`navbar-link ${isActive('/insight') ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faLightbulb} />
              <span>Insight</span>
            </Link>
          </div>
        </div>
        
        <div className="navbar-right">
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="navbar-search-input"
            />
            <button type="submit" className="navbar-search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default Navbar