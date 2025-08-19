# NCAA Basketball Statistics Platform

A full-stack web application that provides comprehensive NCAA basketball statistics, insights, and match predictions. The platform features data scraping capabilities, player analytics, conference breakdowns, and machine learning-powered match predictions.

## 🏀 Features

- **Player Statistics**: Complete stats for NCAA basketball players across all divisions
- **Conference Analytics**: Detailed breakdowns of basketball conferences
- **Team/School Data**: Comprehensive school and team information
- **Position Analysis**: In-depth analysis by player positions
- **Match Predictions**: ML-powered predictions for upcoming games
- **Interactive Dashboard**: User-friendly interface with search and filtering capabilities

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **FontAwesome** for icons
- **CSS3** with custom styling

### Backend
- **Spring Boot** (Java)
- RESTful API architecture
- **Currently being deployed** 🚧

### Data & Machine Learning
- **Python** for data scraping and ML
- **scikit-learn** for match prediction models
- Web scraping for real-time data collection

## 📁 Project Structure

```
NCAABstats/
├── frontend/cbbinsight/          # React TypeScript frontend
├── backend/                      # Spring Boot backend (deployment in progress)
├── DataScraping/                 # Python scraping scripts
├── MatchPredictor/              # ML prediction models
└── .gitignore
```

## 🛠️ Installation & Setup

### Frontend Setup

```bash
cd frontend/cbbinsight
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup
🚧 **Backend deployment is currently in progress**

The Spring Boot backend is being deployed and will provide REST API endpoints for:
- Player data
- Conference information
- Team statistics
- Match predictions

### Data Scraping Setup

```bash
cd DataScraping
pip install -r requirements.txt
python scraper.py
```

### Match Prediction Setup

```bash
cd MatchPredictor
pip install -r requirements.txt
python match_predictor.py
```

## 🎯 Current Status

- ✅ Frontend: Fully functional React application
- 🚧 Backend: Spring Boot API deployment in progress
- ✅ Data Scraping: Operational Python scrapers
- ✅ ML Models: Match prediction models trained and ready

## 🖥️ Screenshots & Demo

The application features:
- **Homepage**: Welcome interface with navigation
- **Dashboard**: Overview of statistics and insights
- **Players Page**: Searchable player database
- **Conferences**: Conference-specific breakdowns
- **Positions**: Analysis by player positions

## 🔮 Upcoming Features

- Real-time game updates
- Advanced analytics dashboard
- User authentication
- Favorite teams/players
- Historical trend analysis
- Mobile responsive improvements

## 📊 API Endpoints (Post-Deployment)

Once the backend is deployed, the following endpoints will be available:

```
GET /api/players          # Get all players
GET /api/conferences      # Get conference data
GET /api/schools         # Get school information
GET /api/positions       # Get position analytics
POST /api/predictions    # Get match predictions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is currently under development. License information will be updated upon completion.

## 🚧 Development Status

**Current Phase**: Backend Deployment
- Frontend: Complete and functional
- Data Pipeline: Operational
- ML Models: Training more models for future and past games
- Backend API: Deployment in progress

---

*Stay tuned for updates as we complete the backend deployment and launch the full platform!*
