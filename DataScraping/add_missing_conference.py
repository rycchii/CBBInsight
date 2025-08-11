import requests
from bs4 import BeautifulSoup
import time
import pandas as pd
import os
import random

# Add headers to mimic a real browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
}

def make_request_with_backoff(url, max_retries=3):
    """Make request with exponential backoff for 429 errors"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            
            if response.status_code == 429:
                wait_time = (5 * (3 ** attempt)) * 60
                print(f"    Rate limited (429). Waiting {wait_time/60:.1f} minutes before retry {attempt+1}/{max_retries}...")
                time.sleep(wait_time)
                continue
            
            response.raise_for_status()
            return response
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                continue
            else:
                print(f"    HTTP Error: {e}")
                return None
        except Exception as e:
            print(f"    Request error: {e}")
            return None
    
    print(f"    Failed after {max_retries} retries")
    return None

def scrape_single_conference(conference_url):
    """Scrape player stats for a single conference"""
    print(f"Scraping missing conference: {conference_url}")
    
    try:
        # Fix URL construction
        if conference_url.startswith('http'):
            full_url = conference_url
        elif conference_url.startswith('/'):
            full_url = f'https://www.sports-reference.com{conference_url}'
        else:
            # If user just entered conference name, build the full path
            full_url = f'https://www.sports-reference.com/cbb/conferences/{conference_url}/men/2025.html'
        
        print(f"  Full URL: {full_url}")
        
        delay = random.uniform(15, 25)
        print(f"  Waiting {delay:.1f} seconds before requesting conference page...")
        time.sleep(delay)
        
        response = make_request_with_backoff(full_url)
        if response is None:
            # Fix IndexError by safely parsing conference name
            try:
                if '/' in conference_url:
                    conf_name = conference_url.split('/')[-2]
                else:
                    conf_name = conference_url
            except (IndexError, ValueError):
                conf_name = conference_url
            return [], conf_name
        
        html = response.text
        soup = BeautifulSoup(html, 'lxml')
        
        # Extract conference name
        conference_name = None
        title = soup.find('title')
        if title:
            title_text = title.get_text()
            if "Conference" in title_text:
                conference_name = title_text.split("Conference")[0].strip()
        
        if not conference_name:
            if '/' in conference_url:
                url_parts = conference_url.strip('/').split('/')
                conference_name = url_parts[-3] if len(url_parts) >= 3 else url_parts[-1]
                if conference_name == '2025.html':
                    conference_name = url_parts[-2]
            else:
                conference_name = conference_url
            conference_name = conference_name.replace('-', ' ').title()
        
        print(f"  Conference name: {conference_name}")
        
        # Look for standings table
        standings_table = soup.find('table', id='standings')
        
        if standings_table is None:
            print(f"  No standings table found for {conference_name}")
            return [], conference_name
        
        print(f"  Found standings table for {conference_name}")
        
        # Find school links
        school_links = []
        for link in standings_table.find_all('a'):
            href = link.get('href')
            if href and '/schools/' in href:
                school_links.append(href)
        
        if not school_links:
            print(f"  No school links found in standings table for {conference_name}")
            return [], conference_name
        
        # Build school URLs
        school_urls = []
        for link in school_links:
            if '/men/2025.html' in link:
                school_urls.append(f"https://www.sports-reference.com{link}")
            else:
                school_path = link.split('/schools/')[1].split('/')[0]
                school_urls.append(f"https://www.sports-reference.com/schools/{school_path}/men/2025.html")
        
        school_urls = list(set(school_urls))
        print(f"  Found {len(school_urls)} schools in {conference_name}")
        
        conference_data = []
        
        for i, school_url in enumerate(school_urls):
            try:
                school_name = school_url.split("/")[5]
                print(f"    Scraping {school_name} ({i+1}/{len(school_urls)})...")
                
                delay = random.uniform(8, 15)
                print(f"      Waiting {delay:.1f} seconds...")
                time.sleep(delay)
                
                response = make_request_with_backoff(school_url)
                if response is None:
                    print(f"      Failed to access {school_name}")
                    continue
                
                data = response.text
                soup = BeautifulSoup(data, 'lxml')
                stats = soup.find('table', id="players_per_game")
                
                if stats is None:
                    print(f"      No players_per_game table found for {school_name}")
                    continue
                
                school_data = pd.read_html(str(stats))[0]
                school_data = school_data.iloc[:, 1:-1]
                school_data = school_data[school_data['Player'] != 'Team Totals']
                school_data["School"] = school_name
                school_data["Conference"] = conference_name
                conference_data.append(school_data)
                
                print(f"      Successfully scraped {len(school_data)} players from {school_name}")
                
            except Exception as e:
                print(f"      Error scraping {school_url}: {e}")
                continue
        
        return conference_data, conference_name
        
    except Exception as e:
        print(f"  Error scraping conference {conference_url}: {e}")
        # Fix IndexError in exception handler too
        try:
            if '/' in conference_url:
                conf_name = conference_url.split('/')[-2]
            else:
                conf_name = conference_url
        except (IndexError, ValueError):
            conf_name = conference_url
        return [], conf_name

def append_to_existing_dataset(new_data, conference_name):
    """Append new conference data to existing CSV files"""
    
    # Check if main CSV exists
    main_csv = "all_ncaa_player_stats_updated.csv"
    
    if os.path.exists(main_csv):
        print(f"Loading existing dataset: {main_csv}")
        existing_df = pd.read_csv(main_csv)
        print(f"Existing dataset has {len(existing_df)} records")
        
        # Combine with new data
        if new_data:
            new_df = pd.concat(new_data, ignore_index=True)
            combined_df = pd.concat([existing_df, new_df], ignore_index=True)
            
            # Save updated dataset
            combined_df.to_csv(main_csv, index=False)
            print(f"✅ Added {len(new_df)} new records. Total now: {len(combined_df)} records")
            
            # Also save individual conference file
            os.makedirs('conference_data', exist_ok=True)
            conf_filename = f"conference_data/{conference_name}_players.csv"
            new_df.to_csv(conf_filename, index=False)
            print(f"✅ Saved individual conference file: {conf_filename}")
            
        else:
            print("❌ No new data to append")
    else:
        print(f"❌ Main CSV file {main_csv} not found!")
        if new_data:
            new_df = pd.concat(new_data, ignore_index=True)
            new_df.to_csv(main_csv, index=False)
            print(f"✅ Created new dataset with {len(new_df)} records")

def main():
    print("Enter the missing conference. Examples:")
    print("  Full path: /cbb/conferences/mwc/men/2025.html")
    print("  Short name: mwc")
    print("  Abbreviation: mountain-west")
    
    missing_conference = input("\nEnter conference: ").strip()
    
    if not missing_conference:
        print("❌ No conference provided!")
        return
    
    # Handle common abbreviations - FIXED TO MATCH ACTUAL URLS
    conference_mapping = {
        'mountain-west': 'mwc',  # Convert friendly name to URL name
        'mw': 'mwc',             # Convert abbreviation to URL name
        'pac12': 'pac-12',
        'pac-12': 'pac-12',
        'big12': 'big-12',
        'big-12': 'big-12',
        'big10': 'big-ten',
        'big-ten': 'big-ten',
        'acc': 'acc',
        'sec': 'sec',
        'big-east': 'big-east',
        'aac': 'aac',
        'atlantic10': 'atlantic-10',
        'atlantic-10': 'atlantic-10',
        'a10': 'atlantic-10',
        'coastal': 'coastal',
        'southern': 'southern',
    }
    
    # Convert abbreviations
    if missing_conference.lower() in conference_mapping:
        missing_conference = conference_mapping[missing_conference.lower()]
        print(f"  Converted to URL format: {missing_conference}")
    
    # Scrape the missing conference
    conference_data, conference_name = scrape_single_conference(missing_conference)
    
    # Append to existing dataset
    append_to_existing_dataset(conference_data, conference_name)

if __name__ == "__main__":
    main()