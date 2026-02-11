
import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: 'dashboard' | 'scraper' | 'data' | 'analytics') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'scraper', icon: 'fa-spider', label: 'Run Scraper' },
    { id: 'data', icon: 'fa-database', label: 'Dataset' },
    { id: 'analytics', icon: 'fa-vial', label: 'Quality' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white">
          <i className="fas fa-robot text-2xl text-indigo-400"></i>
          <span className="font-bold text-lg tracking-tight">AI Scraper Pro</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4 text-xs">
          <p className="mb-2 text-slate-400">Environment: <span className="text-emerald-400">Production</span></p>
          <p className="text-slate-400">API: <span className="text-slate-200">v2.4.0-stable</span></p>
        </div>
      </div>
    </aside>
  );
};
