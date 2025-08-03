import requests
from bs4 import BeautifulSoup
import time
import pandas as pd

bigten = []

html = requests.get('https://www.sports-reference.com/cbb/conferences/big-ten/men/2025.html#big-ten-stats').text
soup = BeautifulSoup(html, 'lxml')
table = soup.find('table', id = 'big-ten-stats')

links = table.find_all('a')
links = [l.get("href") for l in links] ##parsing through links
links = [l for l in links if '/schools/' in l]

school_urls = [f"https://www.sports-reference.com{l.replace('/men/2025.html', '')}/men/2025.html" for l in links]

for school_url in school_urls: 
    # Extract school name from the URL
    school_name = school_url.split("/")[5]  # e.g., 'michigan-state'
    data = requests.get(school_url).text
    soup = BeautifulSoup(data, 'lxml')
    stats = soup.find('table', id="season-total_per_game")
    if stats is None:
        print(f"No season-total_per_game table found for {school_name} at {school_url}")
        continue

    # Convert it into a DataFrame
    school_data = pd.read_html(str(stats))[0]
    school_data["School"] = school_name
    bigten.append(school_data)
    time.sleep(5)

stat_df = pd.concat(bigten) ## concatenating all of the stats
stat_df.to_csv("bigtenteamstats.csv") ## importing to csv



