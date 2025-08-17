import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.impute import SimpleImputer
import joblib
import warnings
warnings.filterwarnings('ignore')

class NCAAMatchPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_columns = []
        self.is_trained = False
        
    def load_data(self, matches_csv_path):
        """Load and prepare match data from CSV"""
        try:
            self.df = pd.read_csv(matches_csv_path)
            print(f"Loaded {len(self.df)} matches from {matches_csv_path}")
            print(f"Columns: {list(self.df.columns)}")
            return self.df
        except Exception as e:
            print(f"Error loading data: {e}")
            return None
    
    def create_team_stats(self):
        """Create team statistics features"""
        # Calculate team statistics (wins, losses, win percentage, etc.)
        team_stats = {}
        
        # Process each team's performance
        all_teams = set(self.df['home_team'].unique()) | set(self.df['away_team'].unique())
        
        for team in all_teams:
            home_games = self.df[self.df['home_team'] == team].copy()
            away_games = self.df[self.df['away_team'] == team].copy()
            
            # Calculate wins/losses
            home_wins = len(home_games[home_games['home_score'] > home_games['away_score']])
            away_wins = len(away_games[away_games['away_score'] > away_games['home_score']])
            total_wins = home_wins + away_wins
            
            total_games = len(home_games) + len(away_games)
            win_percentage = total_wins / total_games if total_games > 0 else 0
            
            # Calculate average scores
            home_avg_score = home_games['home_score'].mean() if len(home_games) > 0 else 0
            away_avg_score = away_games['away_score'].mean() if len(away_games) > 0 else 0
            avg_score = (home_avg_score + away_avg_score) / 2 if total_games > 0 else 0
            
            # Calculate average points allowed
            home_avg_allowed = home_games['away_score'].mean() if len(home_games) > 0 else 0
            away_avg_allowed = away_games['home_score'].mean() if len(away_games) > 0 else 0
            avg_allowed = (home_avg_allowed + away_avg_allowed) / 2 if total_games > 0 else 0
            
            team_stats[team] = {
                'wins': total_wins,
                'losses': total_games - total_wins,
                'total_games': total_games,
                'win_percentage': win_percentage,
                'avg_score': avg_score,
                'avg_allowed': avg_allowed,
                'score_differential': avg_score - avg_allowed,
                'home_wins': home_wins,
                'away_wins': away_wins
            }
        
        return team_stats
    
    def create_features(self):
        """Create features for machine learning"""
        print("Creating team statistics...")
        team_stats = self.create_team_stats()
        
        features = []
        labels = []
        
        for idx, row in self.df.iterrows():
            home_team = row['home_team']
            away_team = row['away_team']
            
            # Skip if we don't have stats for both teams
            if home_team not in team_stats or away_team not in team_stats:
                continue
            
            # Create feature vector
            feature_vector = [
                # Home team stats
                team_stats[home_team]['wins'],
                team_stats[home_team]['losses'],
                team_stats[home_team]['win_percentage'],
                team_stats[home_team]['avg_score'],
                team_stats[home_team]['avg_allowed'],
                team_stats[home_team]['score_differential'],
                team_stats[home_team]['home_wins'],
                
                # Away team stats
                team_stats[away_team]['wins'],
                team_stats[away_team]['losses'],
                team_stats[away_team]['win_percentage'],
                team_stats[away_team]['avg_score'],
                team_stats[away_team]['avg_allowed'],
                team_stats[away_team]['score_differential'],
                team_stats[away_team]['away_wins'],
                
                # Head-to-head comparison features
                team_stats[home_team]['win_percentage'] - team_stats[away_team]['win_percentage'],
                team_stats[home_team]['avg_score'] - team_stats[away_team]['avg_score'],
                team_stats[home_team]['score_differential'] - team_stats[away_team]['score_differential'],
                
                # Home field advantage (binary)
                1  # Home team advantage
            ]
            
            # Create label (1 if home team wins, 0 if away team wins)
            home_score = row.get('home_score', 0)
            away_score = row.get('away_score', 0)
            label = 1 if home_score > away_score else 0
            
            features.append(feature_vector)
            labels.append(label)
        
        self.feature_columns = [
            'home_wins', 'home_losses', 'home_win_pct', 'home_avg_score', 
            'home_avg_allowed', 'home_score_diff', 'home_home_wins',
            'away_wins', 'away_losses', 'away_win_pct', 'away_avg_score',
            'away_avg_allowed', 'away_score_diff', 'away_away_wins',
            'win_pct_diff', 'avg_score_diff', 'score_diff_diff', 'home_advantage'
        ]
        
        return np.array(features), np.array(labels)
    
    def train_model(self, model_type='random_forest'):
        """Train the prediction model"""
        print("Creating features...")
        X, y = self.create_features()
        
        if len(X) == 0:
            print("No valid features created. Check your data.")
            return False
        
        print(f"Created {len(X)} training samples with {len(X[0])} features")
        
        # Handle missing values
        imputer = SimpleImputer(strategy='mean')
        X = imputer.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Choose model
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        elif model_type == 'gradient_boost':
            self.model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        else:
            self.model = LogisticRegression(random_state=42)
        
        # Train model
        print(f"Training {model_type} model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_pred = self.model.predict(X_train_scaled)
        test_pred = self.model.predict(X_test_scaled)
        
        train_accuracy = accuracy_score(y_train, train_pred)
        test_accuracy = accuracy_score(y_test, test_pred)
        
        print(f"Training Accuracy: {train_accuracy:.3f}")
        print(f"Testing Accuracy: {test_accuracy:.3f}")
        print("\nClassification Report:")
        print(classification_report(y_test, test_pred))
        
        # Feature importance (for tree-based models)
        if hasattr(self.model, 'feature_importances_'):
            feature_importance = pd.DataFrame({
                'feature': self.feature_columns,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            print("\nTop 10 Most Important Features:")
            print(feature_importance.head(10))
        
        self.is_trained = True
        return True
    
    def predict_match(self, home_team, away_team):
        """Predict the outcome of a specific match"""
        if not self.is_trained:
            print("Model not trained yet!")
            return None
        
        # Get team stats
        team_stats = self.create_team_stats()
        
        if home_team not in team_stats or away_team not in team_stats:
            print(f"No data available for {home_team} vs {away_team}")
            return None
        
        # Create feature vector for this match
        feature_vector = np.array([[
            # Home team stats
            team_stats[home_team]['wins'],
            team_stats[home_team]['losses'],
            team_stats[home_team]['win_percentage'],
            team_stats[home_team]['avg_score'],
            team_stats[home_team]['avg_allowed'],
            team_stats[home_team]['score_differential'],
            team_stats[home_team]['home_wins'],
            
            # Away team stats
            team_stats[away_team]['wins'],
            team_stats[away_team]['losses'],
            team_stats[away_team]['win_percentage'],
            team_stats[away_team]['avg_score'],
            team_stats[away_team]['avg_allowed'],
            team_stats[away_team]['score_differential'],
            team_stats[away_team]['away_wins'],
            
            # Head-to-head comparison features
            team_stats[home_team]['win_percentage'] - team_stats[away_team]['win_percentage'],
            team_stats[home_team]['avg_score'] - team_stats[away_team]['avg_score'],
            team_stats[home_team]['score_differential'] - team_stats[away_team]['score_differential'],
            
            # Home field advantage
            1
        ]])
        
        # Scale features
        feature_vector_scaled = self.scaler.transform(feature_vector)
        
        # Make prediction
        prediction = self.model.predict(feature_vector_scaled)[0]
        probability = self.model.predict_proba(feature_vector_scaled)[0]
        
        result = {
            'home_team': home_team,
            'away_team': away_team,
            'predicted_winner': home_team if prediction == 1 else away_team,
            'home_win_probability': probability[1],
            'away_win_probability': probability[0],
            'confidence': max(probability)
        }
        
        return result
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.is_trained:
            joblib.dump({
                'model': self.model,
                'scaler': self.scaler,
                'feature_columns': self.feature_columns
            }, filepath)
            print(f"Model saved to {filepath}")
        else:
            print("No trained model to save!")
    
    def load_model(self, filepath):
        """Load a pre-trained model"""
        try:
            saved_data = joblib.load(filepath)
            self.model = saved_data['model']
            self.scaler = saved_data['scaler']
            self.feature_columns = saved_data['feature_columns']
            self.is_trained = True
            print(f"Model loaded from {filepath}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

# Example usage and testing
if __name__ == "__main__":
    # Initialize predictor
    predictor = NCAAMatchPredictor()
    
    # Load your match data
    # Replace 'matches.csv' with your actual file path
    data = predictor.load_data('matches.csv')
    
    if data is not None:
        # Train the model
        success = predictor.train_model('random_forest')
        
        if success:
            # Make some predictions
            print("\n" + "="*50)
            print("MAKING PREDICTIONS")
            print("="*50)
            
            # Example predictions (replace with actual team names from your data)
            sample_teams = predictor.df[['home_team', 'away_team']].head(5)
            
            for idx, row in sample_teams.iterrows():
                result = predictor.predict_match(row['home_team'], row['away_team'])
                if result:
                    print(f"\n{result['home_team']} vs {result['away_team']}")
                    print(f"Predicted Winner: {result['predicted_winner']}")
                    print(f"Confidence: {result['confidence']:.1%}")
                    print(f"Home Win Probability: {result['home_win_probability']:.1%}")
            
            # Save the model
            predictor.save_model('ncaa_predictor_model.pkl')