
import React from 'react';
import { Conversation, ScrapeJob } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  conversations: Conversation[];
  jobs: ScrapeJob[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ conversations, jobs, onNavigate }) => {
  const stats = [
    { label: 'Conversations', value: conversations.length, icon: 'fa-comments', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Messages', value: conversations.reduce((acc, c) => acc + c.messages.length, 0), icon: 'fa-envelope', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'running').length, icon: 'fa-sync-alt', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Export Success', value: '98.2%', icon: 'fa-check-circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const chartData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 22 },
    { name: 'Fri', count: 30 },
    { name: 'Sat', count: 24 },
    { name: 'Sun', count: 28 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg text-xl`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Scraping Volume (Last 7 Days)</h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-semibold uppercase">Real-time</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Recent Jobs</h3>
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className={`h-2 w-2 rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate uppercase">{job.platform}</p>
                  <p className="text-xs text-slate-500 italic">{job.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{new Date(job.startTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            <button 
              onClick={() => onNavigate('scraper')}
              className="w-full py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
            >
              View all jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
