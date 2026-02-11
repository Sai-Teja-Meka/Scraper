from bs4 import BeautifulSoup
from app.models.conversation import Message, Conversation
from datetime import datetime
import uuid
import os

class ChatExporter:
    @staticmethod
    def parse_html(html_content: str, platform: str, url: str) -> Conversation:
        soup = BeautifulSoup(html_content, 'html.parser')
        messages = []
        
        # [Fix] Target the specific <article> tags used in current ChatGPT
        rows = soup.find_all('article')
        
        print(f"  [DEBUG] Found {len(rows)} message rows (articles).")

        for row in rows:
            # 1. Extract Role (user/assistant) directly from the attribute
            role = row.get('data-turn', 'system') # defaults to system if missing
            
            # 2. Extract Content
            # ChatGPT uses different classes for user vs assistant text
            content_div = None
            if role == 'user':
                content_div = row.find('div', class_='whitespace-pre-wrap')
            else:
                # Assistant messages are usually in 'markdown' class
                content_div = row.find('div', class_='markdown') or row.find('div', class_='whitespace-pre-wrap')
            
            content = content_div.get_text(separator="\n").strip() if content_div else ""
            
            # Only add if content exists (skip empty placeholders)
            if content:
                messages.append(Message(
                    role=role, 
                    content=content,
                    timestamp=datetime.now(), # Real extraction implies parsing relative time strings
                    metadata={}
                ))

        # 3. Extract Title
        title_tag = soup.find('title')
        title = title_tag.text.strip() if title_tag else "Untitled Chat"

        return Conversation(
            id=str(uuid.uuid4()),
            platform=platform,
            title=title,
            messages=messages,
            metadata={"source_url": url}
        )