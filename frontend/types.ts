
export type Role = 'user' | 'assistant';

export interface Message {
  role: Role;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  platform: string;
  title: string;
  created_at: string;
  messages: Message[];
  metadata?: Record<string, any>;
}

export interface ScrapeJob {
  id: string;
  platform: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  startTime?: string;
}

export interface QualityStats {
  total: number;
  dropped: number;
  avgMessages: number;
  deduplicated: number;
}
