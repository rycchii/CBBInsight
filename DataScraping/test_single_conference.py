import requests
from bs4 import BeautifulSoup
import time
import pandas as pd

# Test with a known conference URL
test_url = 'https://www.sports-reference.com/cbb/conferences/big-ten/men/2025.html'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

print("Testing single conference...")
time.sleep(10)  # Wait 10 seconds

try:
    response = requests.get(test_url, headers=HEADERS)
    print(f"Status code: {response.status_code}")
    
    if response.status_code == 200:
        print("Successfully connected!")
        soup = BeautifulSoup(response.text, 'lxml')
        standings = soup.find('table', id='standings')
        print(f"Standings table found: {standings is not None}")
    else:
        print(f"Failed with status: {response.status_code}")
        
except Exception as e:
    print(f"Error: {e}")