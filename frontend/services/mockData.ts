
import { Conversation, ScrapeJob, Role } from '../types';

export const initialConversations: Conversation[] = [
  {
    id: 'conv_8273645',
    platform: 'chatgpt',
    title: 'Python Scraper Architecture',
    created_at: '2023-10-24T14:30:00Z',
    messages: [
      { role: 'user', content: 'How should I structure a Python project for web scraping with Playwright?', timestamp: '2023-10-24T14:30:05Z' },
      { role: 'assistant', content: 'Use a clear directory structure: app/scraper for logic, app/models for Pydantic types, and scripts/ for execution.', timestamp: '2023-10-24T14:30:45Z' }
    ]
  },
  {
    id: 'conv_1122334',
    platform: 'claude',
    title: 'Data Validation Best Practices',
    created_at: '2023-10-25T09:15:00Z',
    messages: [
      { role: 'user', content: 'What are common data quality checks for scraped datasets?', timestamp: '2023-10-25T09:15:10Z' },
      { role: 'assistant', content: 'Focus on schema validation, missing value detection, and deduplication based on content hashes.', timestamp: '2023-10-25T09:16:00Z' }
    ]
  },
  {
    id: 'conv_empty_err',
    platform: 'chatgpt',
    title: 'Empty Response Case',
    created_at: '2023-10-25T11:00:00Z',
    messages: [
      { role: 'user', content: 'Hello?', timestamp: '2023-10-25T11:00:05Z' }
    ]
  }
];

export const mockJobs: ScrapeJob[] = [
  {
    id: 'job_1',
    platform: 'chatgpt',
    status: 'completed',
    progress: 100,
    logs: ['Auth successful', 'Fetched 12 conversations', 'Exported to CSV'],
    startTime: '2023-10-24T12:00:00Z'
  },
  {
    id: 'job_2',
    platform: 'claude',
    status: 'completed',
    progress: 100,
    logs: ['Auth successful', 'Fetched 8 conversations', 'Exported to JSON'],
    startTime: '2023-10-25T08:00:00Z'
  }
];
