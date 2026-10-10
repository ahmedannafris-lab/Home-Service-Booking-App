import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronRight, Users, X } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { ScreenId } from '../../types';

interface User {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Kamal Perera', code: 'USR 1024', status: 'active', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Nimal Ranasinghe', code: 'USR 1025', status: 'active', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Sarah Silva', code: 'USR 1040', status: 'inactive', avatar: 'https://i.pravatar.cc/150?u=3' },
];

interface UserManagementScreenProps {
  onBack: () => void;
  onViewUser: (userId: string) => void;
}

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ onBack, onViewUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50 shrink-0">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-900 border-2 border-transparent"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">User Management</h1>
          <div className="w-11 h-11" /> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 px-5 pt-4 pb-24 space-y-5">
        {/* Search Bar */}
        <div className="relative flex items-center w-full h-12 bg-white border border-slate-200 rounded-xl shadow-sm px-4">
          <Search size={20} className="text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search user"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base text-slate-800 placeholder-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'all' 
                ? 'bg-blue-700 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              filter === 'active' 
                ? 'bg-blue-700 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${filter === 'active' ? 'bg-white' : 'bg-emerald-500'}`} />
            Active
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              filter === 'inactive' 
                ? 'bg-blue-700 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${filter === 'inactive' ? 'bg-white' : 'bg-slate-400'}`} />
            Inactive
          </button>
        </div>

        {/* Results Info */}
        <p className="text-sm font-medium text-slate-500 px-1">
          {filteredUsers.length} registered users
        </p>

        {/* User List */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Users size={48} className="text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No users found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => onViewUser(user.id)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-4 hover:bg-slate-50 transition-colors shadow-sm text-left"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-base font-semibold text-slate-900 truncate">{user.name}</h3>
                  <p className="text-sm text-slate-500 mb-1">{user.code}</p>
                  
                  {user.status === 'active' ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 self-start border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">Active</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 self-start border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span className="text-xs font-medium text-slate-600">Inactive</span>
                    </div>
                  )}
                </div>
                
                <ChevronRight size={20} className="text-slate-400 shrink-0" />
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
