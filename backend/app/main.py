from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import json
import os
from app.scraper.browser import BrowserScraper
from app.models.conversation import validate_dataset, Conversation

app = FastAPI(title="AI Chat Scraper API")

# Allow CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration (replace with DB in production)
DATA_STORE = {
    "latest_job": {"status": "idle", "logs": []},
    "conversations": []
}

class ScrapeRequest(BaseModel):
    platform: str
    limit: Optional[int] = 5

async def run_scrape_task(platform: str, limit: int):
    """Background task to run the scraper"""
    DATA_STORE["latest_job"]["status"] = "running"
    DATA_STORE["latest_job"]["logs"].append(f"Starting scrape for {platform}...")
    
    try:
        scraper = BrowserScraper(platform=platform, headless=False)
        conversations = await scraper.crawl_conversations(limit=limit)
        
        # Validation
        report = validate_dataset(conversations)
        valid_data = report["valid_conversations"]
        
        # Update Store
        DATA_STORE["conversations"] = valid_data
        
        # Save to Disk
        os.makedirs("data", exist_ok=True)
        # JSON
        with open("data/conversations.json", "w") as f:
            f.write(json.dumps([c.model_dump(mode='json') for c in valid_data], indent=2))
        
        # CSV (Flattened)
        flat_data = []
        for c in valid_data:
            for m in c.messages:
                flat_data.append({
                    "conv_id": c.id, 
                    "platform": c.platform,
                    "role": m.role, 
                    "content": m.content, 
                    "timestamp": m.timestamp
                })
        pd.DataFrame(flat_data).to_csv("data/conversations.csv", index=False)
        
        DATA_STORE["latest_job"]["status"] = "completed"
        DATA_STORE["latest_job"]["logs"].append(f"Job finished. Validated {len(valid_data)} conversations.")
        
    except Exception as e:
        DATA_STORE["latest_job"]["status"] = "failed"
        DATA_STORE["latest_job"]["logs"].append(f"Error: {str(e)}")
        print(f"Job failed: {e}")

@app.post("/scrape")
async def trigger_scrape(request: ScrapeRequest, background_tasks: BackgroundTasks):
    if DATA_STORE["latest_job"]["status"] == "running":
        raise HTTPException(status_code=400, detail="Job already running")
    
    background_tasks.add_task(run_scrape_task, request.platform, request.limit)
    return {"message": "Scraping started", "job_id": "current"}

@app.get("/conversations", response_model=List[Conversation])
async def get_conversations():
    return DATA_STORE["conversations"]

@app.get("/status")
async def get_status():
    return DATA_STORE["latest_job"]