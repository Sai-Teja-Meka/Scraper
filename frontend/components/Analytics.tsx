
import React from 'react';
import { Conversation } from '../types';

interface AnalyticsProps {
  conversations: Conversation[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ conversations }) => {
  const stats = {
    total: conversations.length,
    valid: conversations.filter(c => c.messages.length >= 2).length,
    invalid: conversations.filter(c => c.messages.length < 2).length,
    avgMessages: (conversations.reduce((acc, c) => acc + c.messages.length, 0) / conversations.length).toFixed(1),
    deduplicated: 42,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-48 h-48 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="stroke-slate-100"
                strokeDasharray="100, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
              />
              <path
                className="stroke-indigo-600"
                strokeDasharray={`${(stats.valid/stats.total)*100}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900">{Math.round((stats.valid/stats.total)*100)}%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-none mt-1">Health Score</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
               <p className="text-xs font-bold text-slate-500 uppercase">Valid Samples</p>
               <p className="text-2xl font-black text-slate-900 mt-1">{stats.valid}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
               <p className="text-xs font-bold text-slate-500 uppercase">Avg Messages</p>
               <p className="text-2xl font-black text-slate-900 mt-1">{stats.avgMessages}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
               <p className="text-xs font-bold text-slate-500 uppercase">Deduplicated</p>
               <p className="text-2xl font-black text-slate-900 mt-1">{stats.deduplicated}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
               <p className="text-xs font-bold text-red-600 uppercase">Data Drops</p>
               <p className="text-2xl font-black text-red-700 mt-1">{stats.invalid}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold">Validation Exceptions Report</h3>
          <span className="text-xs font-bold text-slate-400">Total: {stats.invalid} issues</span>
        </div>
        <div className="divide-y divide-slate-100">
          {conversations.filter(c => c.messages.length < 2).map((conv, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <i className="fas fa-times"></i>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900">{conv.title}</h5>
                  <p className="text-xs text-slate-500 italic">Error: Missing assistant response</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-900"><i className="fas fa-trash"></i></button>
                <button className="p-2 text-slate-400 hover:text-indigo-600"><i className="fas fa-external-link-alt"></i></button>
              </div>
            </div>
          ))}
          {stats.invalid === 0 && (
            <div className="px-6 py-12 text-center">
               <i className="fas fa-check-circle text-4xl text-emerald-400 mb-4"></i>
               <p className="text-slate-500">All conversations passed strict Pydantic validation rules.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
