import requests
import time

def test_rate_limit():
    test_url = 'https://www.sports-reference.com/cbb/conferences/acc/men/2025.html'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print("Testing current rate limit status...")
    try:
        response = requests.get(test_url, headers=headers, timeout=10)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ You're no longer rate-limited! Safe to run the scraper.")
            return True
        elif response.status_code == 429:
            print("❌ Still rate-limited. Wait longer before running the scraper.")
            return False
        else:
            print(f"⚠️  Unexpected status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_rate_limit()