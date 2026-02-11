from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime
import hashlib

class Message(BaseModel):
    role: Literal['user', 'assistant', 'system']
    content: str
    timestamp: Optional[datetime] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Conversation(BaseModel):
    id: str
    platform: str
    title: str
    created_at: datetime = Field(default_factory=datetime.now)
    messages: List[Message]
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @validator('messages')
    def validate_message_count(cls, v):
        if not v:
            return v
        # Basic check: scraping often results in empty threads if failed
        return v

def validate_dataset(conversations: List[Conversation]) -> Dict[str, Any]:
    """
    Quality check logic:
    1. Ensures min 1 user and 1 assistant message.
    2. Deduplicates based on platform + title + first message hash.
    """
    total = len(conversations)
    valid_convs = []
    seen_hashes = set()
    dropped_count = 0

    for conv in conversations:
        # Check 1: Message Content
        user_msgs = [m for m in conv.messages if m.role == 'user']
        asst_msgs = [m for m in conv.messages if m.role == 'assistant']
        
        if not user_msgs or not asst_msgs:
            dropped_count += 1
            continue

        # Check 2: Deduplication
        # Create a signature using platform, title, and the first message content
        first_msg_sig = user_msgs[0].content[:50] if user_msgs else ""
        unique_sig = f"{conv.platform}|{conv.title}|{hashlib.md5(first_msg_sig.encode()).hexdigest()}"
        
        if unique_sig in seen_hashes:
            dropped_count += 1
            continue
            
        seen_hashes.add(unique_sig)
        valid_convs.append(conv)

    avg_messages = sum(len(c.messages) for c in valid_convs) / len(valid_convs) if valid_convs else 0
    
    return {
        "total_scraped": total,
        "valid_count": len(valid_convs),
        "dropped_count": dropped_count,
        "avg_messages": round(avg_messages, 1),
        "valid_conversations": valid_convs
    }