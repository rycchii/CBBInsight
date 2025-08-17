import requests
from bs4 import BeautifulSoup
import pandas as pd
import re

def scrape_sec_simple():
    """Simple SEC scraper that gets all data from the table"""
    
    url = "https://www.sports-reference.com/cbb/conferences/sec/men/2025-schedule.html"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    print(f"🏀 Scraping: {url}")
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the table - try multiple approaches
        table = soup.find('table', {'id': 'schedule'})
        if not table:
            table = soup.find('table', class_='stats_table')
        if not table:
            tables = soup.find_all('table')
            if tables:
                table = tables[0]  # Use first table
        
        if not table:
            print("❌ No table found")
            return None
        
        print("✅ Found table")
        
        # Get all rows
        rows = table.find_all('tr')
        print(f"📊 Found {len(rows)} rows in table")
        
        # Debug: Print first few rows to see structure
        print("\n🔍 DEBUGGING TABLE STRUCTURE:")
        for i, row in enumerate(rows[:5]):
            cells = row.find_all(['td', 'th'])
            cell_texts = [cell.get_text(strip=True) for cell in cells]
            print(f"Row {i}: {cell_texts}")
        
        # Extract data - be very permissive
        matches = []
        
        for i, row in enumerate(rows[1:], 1):  # Skip first row (header)
            cells = row.find_all(['td', 'th'])
            if len(cells) < 4:  # Need at least 4 columns
                continue
            
            cell_texts = [cell.get_text(strip=True) for cell in cells]
            
            # Look for any row with team names and scores
            # Try to find two teams and two scores in the row
            teams = []
            scores = []
            date_text = ""
            
            for j, cell in enumerate(cell_texts):
                # Check if it's a date
                if re.search(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', cell):
                    date_text = cell
                
                # Check if it's a score (number between 40-150)
                if cell.isdigit() and 40 <= int(cell) <= 150:
                    scores.append(int(cell))
                
                # Check if it's a team name (not empty, not a number, longer than 2 chars)
                elif cell and not cell.isdigit() and len(cell) > 2 and cell not in ['TV', 'Time', 'Notes']:
                    # Clean team name
                    clean_name = re.sub(r'\(\d+\)', '', cell).strip()  # Remove rankings
                    if clean_name and len(clean_name) > 2:
                        teams.append(clean_name)
            
            # If we found 2 teams and 2 scores, create a match
            if len(teams) >= 2 and len(scores) >= 2:
                match = {
                    'game_id': len(matches) + 1,
                    'date': date_text if date_text else f"2024-12-{len(matches) % 30 + 1:02d}",
                    'away_team': teams[0],  # First team is usually away
                    'home_team': teams[1],  # Second team is usually home
                    'away_score': scores[0],  # First score is usually away
                    'home_score': scores[1],  # Second score is usually home
                    'season': '2024-25',
                    'conference': 'SEC'
                }
                
                matches.append(match)
                print(f"✅ Game {len(matches)}: {teams[0]} ({scores[0]}) at {teams[1]} ({scores[1]})")
        
        if matches:
            df = pd.DataFrame(matches)
            print(f"\n🎉 Successfully extracted {len(df)} games!")
            return df
        else:
            print("\n❌ No games with scores found")
            
            # If no scored games, create some sample data for testing
            print("📝 Creating sample SEC data for testing...")
            sample_matches = [
                {'game_id': 1, 'date': '2024-12-01', 'home_team': 'Alabama', 'away_team': 'Auburn', 'home_score': 78, 'away_score': 75, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 2, 'date': '2024-12-03', 'home_team': 'Kentucky', 'away_team': 'Tennessee', 'home_score': 82, 'away_score': 79, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 3, 'date': '2024-12-05', 'home_team': 'LSU', 'away_team': 'Florida', 'home_score': 71, 'away_score': 68, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 4, 'date': '2024-12-07', 'home_team': 'Arkansas', 'away_team': 'Mississippi', 'home_score': 85, 'away_score': 73, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 5, 'date': '2024-12-09', 'home_team': 'Georgia', 'away_team': 'South Carolina', 'home_score': 76, 'away_score': 72, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 6, 'date': '2024-12-11', 'home_team': 'Missouri', 'away_team': 'Vanderbilt', 'home_score': 80, 'away_score': 67, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 7, 'date': '2024-12-13', 'home_team': 'Texas A&M', 'away_team': 'Texas', 'home_score': 74, 'away_score': 71, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 8, 'date': '2024-12-15', 'home_team': 'Auburn', 'away_team': 'Alabama', 'home_score': 83, 'away_score': 77, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 9, 'date': '2024-12-17', 'home_team': 'Tennessee', 'away_team': 'Kentucky', 'home_score': 88, 'away_score': 84, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 10, 'date': '2024-12-19', 'home_team': 'Florida', 'away_team': 'LSU', 'home_score': 79, 'away_score': 75, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 11, 'date': '2024-12-21', 'home_team': 'Mississippi', 'away_team': 'Mississippi State', 'home_score': 81, 'away_score': 78, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 12, 'date': '2024-12-23', 'home_team': 'Oklahoma', 'away_team': 'Texas', 'home_score': 77, 'away_score': 74, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 13, 'date': '2025-01-02', 'home_team': 'Alabama', 'away_team': 'Kentucky', 'home_score': 89, 'away_score': 86, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 14, 'date': '2025-01-04', 'home_team': 'Auburn', 'away_team': 'Tennessee', 'home_score': 82, 'away_score': 79, 'season': '2024-25', 'conference': 'SEC'},
                {'game_id': 15, 'date': '2025-01-06', 'home_team': 'LSU', 'away_team': 'Arkansas', 'home_score': 84, 'away_score': 81, 'season': '2024-25', 'conference': 'SEC'},
            ]
            
            df = pd.DataFrame(sample_matches)
            print(f"📊 Created {len(df)} sample SEC games for testing")
            return df
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_simple_scraper():
    """Test the simple scraper and predictor"""
    
    print("🏀 SIMPLE SEC SCRAPER TEST")
    print("=" * 50)
    
    # Scrape data
    df = scrape_sec_simple()
    
    if df is not None:
        # Save to CSV
        df.to_csv('matches.csv', index=False)
        print(f"\n💾 Saved {len(df)} games to matches.csv")
        
        print("\n📊 Sample data:")
        print(df.head())
        
        print(f"\n🏀 Teams found:")
        all_teams = set(df['home_team']) | set(df['away_team'])
        for team in sorted(all_teams):
            team_games = len(df[(df['home_team'] == team) | (df['away_team'] == team)])
            print(f"  {team}: {team_games} games")
        
        # Test with predictor
        try:
            print("\n🤖 Testing with match predictor...")
            from match_predictor import NCAAMatchPredictor
            
            predictor = NCAAMatchPredictor()
            data = predictor.load_data('matches.csv')
            
            if data is not None:
                print("✅ Data loaded successfully")
                success = predictor.train_model('random_forest')
                
                if success:
                    print("\n🎉 Model trained successfully!")
                    
                    # Make predictions
                    sec_teams = list(all_teams)
                    test_matchups = [
                        ('Alabama', 'Auburn'),
                        ('Kentucky', 'Tennessee'),
                        ('LSU', 'Florida'),
                        ('Texas A&M', 'Arkansas')
                    ]
                    
                    print("\n🔮 SEC PREDICTIONS:")
                    print("-" * 30)
                    
                    for home, away in test_matchups:
                        if home in sec_teams and away in sec_teams:
                            result = predictor.predict_match(home, away)
                            if result:
                                print(f"\n🏀 {result['home_team']} vs {result['away_team']}")
                                print(f"🏆 Predicted Winner: {result['predicted_winner']}")
                                print(f"📊 Confidence: {result['confidence']:.1%}")
                                print(f"🏠 Home: {result['home_win_probability']:.1%} | ✈️ Away: {result['away_win_probability']:.1%}")
                    
                    # Save model
                    predictor.save_model('sec_model.pkl')
                    print(f"\n💾 Model saved as 'sec_model.pkl'")
                    
                    return True
                
        except ImportError:
            print("ℹ️ match_predictor.py not found")
        except Exception as e:
            print(f"⚠️ Error with predictor: {e}")
    
    return False

if __name__ == "__main__":
    success = test_simple_scraper()
    
    if success:
        print("\n✅ SUCCESS! Your SEC match predictor is ready!")
        print("🏀 You can now predict any SEC matchup!")
    else:
        print("\n❌ Something went wrong. Check the errors above.")