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

# MANUAL CONFERENCE LIST - Bypasses rate limiting on conferences page
MANUAL_CONFERENCES = [
    '/cbb/conferences/acc/men/2025.html',
    '/cbb/conferences/big-ten/men/2025.html', 
    '/cbb/conferences/big-12/men/2025.html',
    '/cbb/conferences/sec/men/2025.html',
    '/cbb/conferences/big-east/men/2025.html',
    '/cbb/conferences/aac/men/2025.html',
    '/cbb/conferences/atlantic-10/men/2025.html',
    '/cbb/conferences/mountain-west/men/2025.html',
    '/cbb/conferences/wcc/men/2025.html',
    '/cbb/conferences/america-east/men/2025.html',
    '/cbb/conferences/atlantic-sun/men/2025.html',
    '/cbb/conferences/big-sky/men/2025.html',
    '/cbb/conferences/big-south/men/2025.html',
    '/cbb/conferences/big-west/men/2025.html',
    '/cbb/conferences/colonial/men/2025.html',
    '/cbb/conferences/cusa/men/2025.html',
    '/cbb/conferences/horizon/men/2025.html',
    '/cbb/conferences/ivy/men/2025.html',
    '/cbb/conferences/maac/men/2025.html',
    '/cbb/conferences/mac/men/2025.html',
    '/cbb/conferences/meac/men/2025.html',
    '/cbb/conferences/mvc/men/2025.html',
    '/cbb/conferences/nec/men/2025.html',
    '/cbb/conferences/ovc/men/2025.html',
    '/cbb/conferences/patriot/men/2025.html',
    '/cbb/conferences/socon/men/2025.html',
    '/cbb/conferences/southland/men/2025.html',
    '/cbb/conferences/summit/men/2025.html',
    '/cbb/conferences/sun-belt/men/2025.html',
    '/cbb/conferences/swac/men/2025.html',
    '/cbb/conferences/wac/men/2025.html',
]

def make_request_with_backoff(url, max_retries=3):
    """Make request with exponential backoff for 429 errors"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            
            if response.status_code == 429:
                # Calculate exponential backoff: 5min, 15min, 30min
                wait_time = (5 * (3 ** attempt)) * 60  # 300s, 900s, 2700s
                print(f"    Rate limited (429). Waiting {wait_time/60:.1f} minutes before retry {attempt+1}/{max_retries}...")
                time.sleep(wait_time)
                continue
            
            response.raise_for_status()
            return response
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                continue  # Will be handled by the 429 check above
            else:
                print(f"    HTTP Error: {e}")
                return None
        except Exception as e:
            print(f"    Request error: {e}")
            return None
    
    print(f"    Failed after {max_retries} retries")
    return None

def get_all_conferences():
    """Return manual list of conferences - NO WEB REQUEST NEEDED"""
    print(f"Using manual conference list with {len(MANUAL_CONFERENCES)} conferences")
    print("This bypasses the rate-limited conferences index page")
    return MANUAL_CONFERENCES

def scrape_conference(conference_url):
    """Scrape player stats for a specific conference"""
    print(f"Scraping conference: {conference_url}")
    
    try:
        full_url = f'https://www.sports-reference.com{conference_url}' if not conference_url.startswith('http') else conference_url
        
        # Add delay before each conference request
        delay = random.uniform(15, 25)  # Longer initial delay
        print(f"  Waiting {delay:.1f} seconds before requesting conference page...")
        time.sleep(delay)
        
        response = make_request_with_backoff(full_url)
        if response is None:
            return [], conference_url.split('/')[-2]  # Return conference name from URL
        
        html = response.text
        soup = BeautifulSoup(html, 'lxml')
        
        # Extract conference name from page title or heading
        conference_name = None
        
        # Method 1: Try to get from page title
        title = soup.find('title')
        if title:
            title_text = title.get_text()
            if "Conference" in title_text:
                conference_name = title_text.split("Conference")[0].strip()
        
        # Method 2: Try to get from h1 heading
        if not conference_name:
            h1 = soup.find('h1')
            if h1:
                h1_text = h1.get_text()
                if "Conference" in h1_text:
                    conference_name = h1_text.split("Conference")[0].strip()
        
        # Method 3: Fallback to URL parsing (clean it up)
        if not conference_name:
            url_parts = conference_url.strip('/').split('/')
            conference_name = url_parts[-3] if len(url_parts) >= 3 else url_parts[-1]
            if conference_name == '2025.html':
                conference_name = url_parts[-2]
            conference_name = conference_name.replace('-', ' ').title()
        
        print(f"  Conference name: {conference_name}")
        
        # Look specifically for the standings table
        standings_table = soup.find('table', id='standings')
        
        if standings_table is None:
            print(f"  No standings table found for {conference_name}")
            return [], conference_name
        
        print(f"  Found standings table for {conference_name}")
        
        # Find school links in the standings table
        school_links = []
        for link in standings_table.find_all('a'):
            href = link.get('href')
            if href and '/schools/' in href:
                school_links.append(href)
        
        if not school_links:
            print(f"  No school links found in standings table for {conference_name}")
            return [], conference_name
        
        # Build school URLs for 2025 season
        school_urls = []
        for link in school_links:
            if '/men/2025.html' in link:
                school_urls.append(f"https://www.sports-reference.com{link}")
            else:
                school_path = link.split('/schools/')[1].split('/')[0]
                school_urls.append(f"https://www.sports-reference.com/schools/{school_path}/men/2025.html")
        
        # Remove duplicates
        school_urls = list(set(school_urls))
        print(f"  Found {len(school_urls)} schools in {conference_name}")
        
        conference_data = []
        
        for i, school_url in enumerate(school_urls):
            try:
                school_name = school_url.split("/")[5]
                print(f"    Scraping {school_name} ({i+1}/{len(school_urls)})...")
                
                # Random delay between 8-15 seconds for each school
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
        return [], conference_url.split('/')[-2]

def main():
    # Create output directory for individual conference CSVs
    os.makedirs('conference_data', exist_ok=True)
    
    print("⚠️  Rate limit detected. This scraper will now use exponential backoff.")
    print("⚠️  First requests may take 5-30 minutes to complete.")
    print("⚠️  Consider running this overnight.\n")
    
    all_data = []
    conferences = get_all_conferences()
    
    print(f"\nFound {len(conferences)} conferences to scrape")
    
    for i, conference_url in enumerate(conferences):
        print(f"\nProcessing conference {i+1}/{len(conferences)}: {conference_url}")
        
        conference_data, conference_name = scrape_conference(conference_url)
        
        if conference_data:
            conf_df = pd.concat(conference_data, ignore_index=True)
            csv_filename = f"conference_data/{conference_name}_players.csv"
            conf_df.to_csv(csv_filename, index=False)
            print(f"  ✅ Saved {len(conf_df)} player records to {csv_filename}")
            all_data.extend(conference_data)
        else:
            print(f"  ❌ No data collected for {conference_name}")
        
        # Longer pause between conferences (20-30 seconds)
        if i < len(conferences) - 1:
            delay = random.uniform(20, 30)
            print(f"  Waiting {delay:.1f} seconds before next conference...")
            time.sleep(delay)
    
    # Save combined CSV
    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)
        combined_df.to_csv("all_ncaa_player_stats.csv", index=False)
        print(f"\n✅ Saved combined dataset with {len(combined_df)} total player records")
    else:
        print("\n❌ No data was collected from any conferences")

if __name__ == "__main__":
    main()



