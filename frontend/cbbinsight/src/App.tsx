import './App.css'
import Navbar from './components/navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ConferencesPage from './pages/ConferencesPage'
import SchoolsPage from './pages/SchoolsPage'
import PositionsPage from './pages/PositionsPage' // Add this import
import ConferenceDetailPage from './pages/ConferenceDetailPage'
import PlayersPage from './pages/PlayersPage' // Add this import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSearch, faUsers, faBasketball, faFlag, faTrophy, faShirt, faSpinner, faChartBar, faGraduationCap, faMapMarkerAlt, faLightbulb } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faHome, faSearch, faUsers, faBasketball, faFlag, faTrophy, faShirt, faSpinner, faChartBar, faGraduationCap, faMapMarkerAlt, faLightbulb)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/conferences" element={<ConferencesPage />} />
        <Route path="/conferences/:conferenceId" element={<ConferenceDetailPage />} /> {/* Make sure this route exists */}
        <Route path="/schools" element={<SchoolsPage />} />
        <Route path="/positions" element={<PositionsPage />} /> {/* Add this route */}
        <Route path="/players" element={<PlayersPage />} /> {/* Add this route */}
        {/* TODO: Add routes for /insight */}
      </Routes>
    </Router>
  )
}

export default App
