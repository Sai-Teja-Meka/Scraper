
import React, { useState } from 'react';
import { Conversation, Message } from '../types';

interface ConversationViewerProps {
  conversations: Conversation[];
}

export const ConversationViewer: React.FC<ConversationViewerProps> = ({ conversations }) => {
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
  const selectedConversation = conversations.find(c => c.id === selectedId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px] animate-fade-in">
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search dataset..." 
              className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full text-left p-4 border-b border-slate-100 transition-colors ${
                selectedId === conv.id ? 'bg-indigo-50 border-r-4 border-r-indigo-600' : 'hover:bg-slate-50'
              }`}
            >
              <h5 className="font-bold text-sm text-slate-900 truncate">{conv.title}</h5>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{conv.platform}</span>
                <span className="text-[10px] text-slate-500">{new Date(conv.created_at).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        {selectedConversation ? (
          <>
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedConversation.title}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">UUID: {selectedConversation.id}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-2">
                  <i className="fas fa-download"></i> JSON
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors flex items-center gap-2">
                  <i className="fas fa-file-csv"></i> CSV
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
              {selectedConversation.messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white border-indigo-500' 
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase opacity-80">
                      <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                      {msg.role}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div className={`text-[10px] mt-2 opacity-60 text-right`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-500">Select a conversation to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};
