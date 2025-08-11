import './App.css'
import Navbar from './components/navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSearch, faUsers, faBasketball, faFlag, faTrophy, faShirt } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faHome, faSearch, faUsers, faBasketball, faFlag, faTrophy, faShirt)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
