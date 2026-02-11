import argparse
import asyncio
import os
import json
import pandas as pd
from app.scraper.browser import BrowserScraper
from app.models.conversation import validate_dataset

async def main():
    parser = argparse.ArgumentParser(description="Run Attended AI Chat Scraper")
    parser.add_argument("--platform", type=str, default="chatgpt", help="Target platform (chatgpt/claude)")
    parser.add_argument("--out", type=str, default="data/conversations", help="Output filename (without extension)")
    
    args = parser.parse_args()
    
    print(f"--- Starting Attended Scraper for {args.platform} ---")
    
    # HEADLESS MUST BE FALSE for manual login/interaction
    scraper = BrowserScraper(platform=args.platform, headless=False)
    
    # 1. Extract
    conversation = await scraper.extract_current_conversation()
    conversations = [conversation]
    
    # 2. Validate
    print("--- Validating Data ---")
    report = validate_dataset(conversations)
    print(f"Total: {report['total_scraped']} | Valid: {report['valid_count']} | Dropped: {report['dropped_count']}")
    
    if report['valid_count'] > 0:
        print(f"✅ Successfully extracted {len(conversation.messages)} messages.")
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(args.out), exist_ok=True)

        # --- EXPORT JSON (Primary) ---
        json_path = f"{args.out}.json"
        with open(json_path, "w", encoding="utf-8") as f:
            # dumps with default=str handles datetime objects automatically
            json.dump([c.model_dump() for c in conversations], f, indent=2, default=str)
        print(f"💾 Saved JSON to: {json_path}")

        # --- EXPORT CSV (Secondary) ---
        flat_data = []
        for c in conversations:
            for m in c.messages:
                flat_data.append({
                    "conv_id": c.id,
                    "title": c.title,
                    "role": m.role,
                    "content": m.content, # Full content for CSV
                    "timestamp": m.timestamp
                })
        
        df = pd.DataFrame(flat_data)
        csv_path = f"{args.out}.csv"
        df.to_csv(csv_path, index=False)
        print(f"   Saved CSV to: {csv_path}")
        
    else:
        print("⚠️  Extraction failed. Check debug.html again if the DOM changed.")

if __name__ == "__main__":
    asyncio.run(main())