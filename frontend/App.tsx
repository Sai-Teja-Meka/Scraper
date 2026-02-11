
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ScraperControl } from './components/ScraperControl';
import { ConversationViewer } from './components/ConversationViewer';
import { Analytics } from './components/Analytics';
import { Conversation, ScrapeJob, QualityStats } from './types';
import { initialConversations, mockJobs } from './services/mockData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scraper' | 'data' | 'analytics'>('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [jobs, setJobs] = useState<ScrapeJob[]>(mockJobs);
  const [currentJob, setCurrentJob] = useState<ScrapeJob | null>(null);

  const handleStartScrape = (platform: string) => {
    const newJob: ScrapeJob = {
      id: Math.random().toString(36).substr(2, 9),
      platform,
      status: 'running',
      progress: 0,
      logs: [`Initializing Playwright session for ${platform}...`, `Navigating to ${platform} login page...`],
      startTime: new Date().toISOString(),
    };
    setCurrentJob(newJob);
    setJobs(prev => [newJob, ...prev]);
    setActiveTab('scraper');

    // Simulate scraping progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setCurrentJob(prev => {
          if (!prev) return null;
          const logMsg = progress % 20 === 0 ? `Scraped conversation #${progress/5}...` : null;
          return {
            ...prev,
            progress,
            logs: logMsg ? [...prev.logs, logMsg] : prev.logs
          };
        });
      } else {
        clearInterval(interval);
        setCurrentJob(prev => prev ? { ...prev, status: 'completed', progress: 100, logs: [...prev.logs, 'Extraction complete. Validating dataset...'] } : null);
      }
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activeTab={activeTab} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <Dashboard 
                conversations={conversations} 
                jobs={jobs} 
                onNavigate={(tab) => setActiveTab(tab as any)} 
              />
            )}
            
            {activeTab === 'scraper' && (
              <ScraperControl 
                currentJob={currentJob} 
                onStartScrape={handleStartScrape} 
              />
            )}
            
            {activeTab === 'data' && (
              <ConversationViewer conversations={conversations} />
            )}
            
            {activeTab === 'analytics' && (
              <Analytics conversations={conversations} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
