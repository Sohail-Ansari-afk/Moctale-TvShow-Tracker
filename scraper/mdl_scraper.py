import requests
from bs4 import BeautifulSoup
import json
import os
import re
import time

# Configuration
OUTPUT_FILE = '../src/constants/scraped_data.json'
BASE_URL = 'https://mydramalist.com'
SEARCH_URL = 'https://mydramalist.com/shows/top_airing'

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Referer': 'https://www.google.com/'
}

def clean_text(text):
    return text.strip() if text else ''

def scrape_mdl():
    print(f"Fetching {SEARCH_URL}...")
    try:
        response = requests.get(SEARCH_URL, headers=headers)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch MDL: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # MDL structure usually has a table or list of .box items
    # In /shows/top_airing, it's typically a list of .box items inside .m-t-nav
    
    shows = []
    
    # Finding the list items. The selector might need adjustment based on current site layout.
    # Common class for show entries: .box
    
    box_items = soup.select('.box')
    
    print(f"Found {len(box_items)} items. Parsing top 10...")
    
    count = 0
    for box in box_items:
        if count >= 10: break
        
        try:
            # Title & Link
            title_node = box.select_one('h6.text-primary.title a')
            if not title_node: continue
            
            title = clean_text(title_node.text)
            link = BASE_URL + title_node['href']
            
            # Image
            img_node = box.select_one('img.img-responsive')
            img_src = ''
            if img_node:
                img_src = img_node.get('data-src') or img_node.get('src')
            
            # Type & Country (often in text-muted span)
            # Example: "Korean Drama - 2024, 16 episodes"
            meta_node = box.select_one('.text-muted')
            meta_text = clean_text(meta_node.text) if meta_node else ''
            
            # Determine type
            show_type = 'drama' # Default
            if 'Movie' in meta_text: show_type = 'movie'
            
            # Origin Check
            origin = 'other'
            if 'Korean' in meta_text: origin = 'ko'
            elif 'Chinese' in meta_text: origin = 'zh'
            elif 'Japanese' in meta_text: origin = 'ja'
            elif 'Thai' in meta_text: origin = 'th'
            
            # Score
            score_node = box.select_one('.score')
            score = clean_text(score_node.text) if score_node else 'N/A'

            # Fetch Details for Next Episode (Simulated for now, real scraping would visit link)
            # For "Top Airing", these are currently broadcasting.
            # We will default to a "Live" or "Airing" state unless we deep scrape.
            
            # Deep scrape for Air Date (Optional - slows it down)
            # Let's do a quick deep scrape for the first few to demonstrate power
            # print(f"  Deep scraping {title}...")
            # detail_res = requests.get(link, headers=headers)
            # detail_soup = BeautifulSoup(detail_res.text, 'html.parser')
            # Extract 'Airs' info... (Complexity high, skipping for V1)

            shows.append({
                'id': f"mdl-{hash(title)}", # specific ID
                'title': title,
                'type': show_type,
                'origin': origin,
                'image': img_src,
                'score': score,
                'status': 'Airing',
                'description': f"Ranked #{count+1} on MDL. Score: {score}",
                'releaseDate': None, # We assume LIVE for airing
                'episode': 'New Episode Soon'
            })
            
            count += 1
            
        except Exception as e:
            print(f"Error parsing item: {e}")
            continue

    # Save to JSON
    output_path = os.path.join(os.path.dirname(__file__), OUTPUT_FILE)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(shows, f, indent=2, ensure_ascii=False)
        
    print(f"Scraped {len(shows)} shows to {output_path}")

if __name__ == "__main__":
    scrape_mdl()
