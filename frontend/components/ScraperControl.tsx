
import React, { useState } from 'react';
import { ScrapeJob } from '../types';

interface ScraperControlProps {
  currentJob: ScrapeJob | null;
  onStartScrape: (platform: string) => void;
}

export const ScraperControl: React.FC<ScraperControlProps> = ({ currentJob, onStartScrape }) => {
  const [platform, setPlatform] = useState('chatgpt');

  const platforms = [
    { id: 'chatgpt', name: 'ChatGPT (OpenAI)', icon: 'fa-robot' },
    { id: 'claude', name: 'Claude (Anthropic)', icon: 'fa-ghost' },
    { id: 'gemini', name: 'Gemini (Google)', icon: 'fa-stars' },
    { id: 'custom', name: 'Custom DOM', icon: 'fa-code' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Configure Scraper</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      platform === p.id 
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <i className={`fas ${p.icon} text-slate-500`}></i>
                    <span className="text-sm font-medium">{p.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Session Cookie (Optional)</label>
              <input 
                type="password" 
                placeholder="__Secure-next-auth.session-token..." 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Playwright will launch a persistent Chromium instance. Ensure no other instances are using the same profile.</p>
            </div>

            <button
              onClick={() => onStartScrape(platform)}
              disabled={!!currentJob && currentJob.status === 'running'}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {currentJob?.status === 'running' ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Scraping...
                </>
              ) : (
                <>
                  <i className="fas fa-play"></i>
                  Execute Scraper
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
             <i className="fas fa-terminal text-indigo-400"></i>
             Terminal Preview
          </h3>
          <div className="font-mono text-xs space-y-2 h-48 overflow-y-auto scrollbar-hide text-slate-300">
            <p className="text-slate-500">$ python scripts/run_scrape.py --platform {platform}</p>
            {currentJob?.logs.map((log, i) => (
              <p key={i} className="animate-slide-in">
                <span className="text-indigo-400 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span> {log}
              </p>
            ))}
            {currentJob?.status === 'running' && (
              <p className="animate-pulse">_</p>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg">Execution Monitor</h3>
          {currentJob && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 font-mono">{currentJob.progress}%</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300" 
                  style={{ width: `${currentJob.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          {!currentJob ? (
            <div className="max-w-md space-y-4">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-microscope text-3xl text-slate-400"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-900">No active job</h4>
              <p className="text-slate-500">
                Select a platform and configuration to start the automated extraction process.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-8">
               <div className="flex justify-between items-end mb-2">
                 <div className="text-left">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Job Status</p>
                    <h4 className="text-3xl font-black text-slate-900">{currentJob.status === 'running' ? 'Active Extraction' : 'Completed Successfully'}</h4>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uptime</p>
                    <p className="text-lg font-mono text-slate-900">00:12:44</p>
                 </div>
               </div>

               <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-slate-200">
                    <div className="p-6">
                      <p className="text-xs font-medium text-slate-500 mb-1">Crawl Depth</p>
                      <p className="text-2xl font-bold">14 Pages</p>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-medium text-slate-500 mb-1">DOM Parse Rate</p>
                      <p className="text-2xl font-bold text-emerald-600">450ms/msg</p>
                    </div>
                  </div>
               </div>

               <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                        {currentJob.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {currentJob.progress}%
                      </span>
                    </div>
                 </div>
                 <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
                    <div style={{ width: `${currentJob.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
