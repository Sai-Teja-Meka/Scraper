
import React from 'react';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const titles: Record<string, string> = {
    dashboard: 'Overview Dashboard',
    scraper: 'Scrape Controls & Logs',
    data: 'Dataset Explorer',
    analytics: 'Quality Reports'
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-900 capitalize">
        {titles[activeTab]}
      </h1>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
          <i className="fas fa-bell"></i>
        </button>
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
          JD
        </div>
      </div>
    </header>
  );
};
