import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { Specialist, ChatMessage } from '../../types';
import { SPECIALISTS } from '../../data/mockData';

interface MessagesScreenProps {
  activeSpecialist?: Specialist;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  activeSpecialist,
  onBack,
  showToast,
}) => {
  const specialist = activeSpecialist || SPECIALISTS.alex;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'specialist',
      text: `Hello Ahmed! This is ${specialist.name}. I'm en route to your location with the replacement parts and pressure testing kit.`,
      timestamp: '1:48 PM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Great, thanks! Is there parking available in front of the gate?',
      timestamp: '1:50 PM',
    },
    {
      id: 'm3',
      sender: 'specialist',
      text: 'Yes perfect! I have a service van, so front gate parking is ideal. ETA is ~4 minutes.',
      timestamp: '1:51 PM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const quickReplies = [
    'I am waiting by the gate',
    'Please call when you arrive',
    'Do you need power outlet access?',
    'Take your time!',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputVal('');

    // Simulate reply after 1.2s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        sender: 'specialist',
        text: 'Understood! See you in just a minute. Thank you!',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-full bg-slate-100 pb-2 overflow-hidden flex-1">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs shrink-0">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 text-slate-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="relative">
              <img
                src={specialist.avatar}
                alt={specialist.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">{specialist.name}</h2>
              <span className="text-[11px] text-emerald-600 font-semibold block">Online • Approaching (4 mins)</span>
            </div>
          </div>

          <button
            onClick={() => showToast(`Calling ${specialist.name}...`)}
            className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </button>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden no-scrollbar space-y-3.5">
        <div className="text-center my-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/80 px-3 py-1 rounded-full shadow-xs">
            Live Dispatch Conversation
          </span>
        </div>

        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/60'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickReplies.map((r, i) => (
          <button
            key={i}
            onClick={() => handleSend(r)}
            className="shrink-0 text-[11px] font-medium bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-full px-3 py-1 shadow-xs transition-all cursor-pointer"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={() => showToast('Photo attachment opened')}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Message ${specialist.name}...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputVal.trim()}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
};
