import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, History, Star, TrendingUp } from 'lucide-react';
import { getHistory } from '../services/storageService';
import { HistoryItem } from '../types';

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const totalPrompts = history.length;
  const bookmarked = history.filter(h => h.isBookmarked).length;
  
  // Calculate average rating if available, default to N/A
  const ratedItems = history.filter(h => h.rating);
  const avgRating = ratedItems.length 
    ? (ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedItems.length).toFixed(1)
    : '-';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Creator</h1>
        <p className="text-slate-500 mt-2">Ready to craft some high-quality prompts today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Optimizations</p>
            <p className="text-2xl font-bold text-slate-900">{totalPrompts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Saved Favorites</p>
            <p className="text-2xl font-bold text-slate-900">{bookmarked}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Original Quality</p>
            <p className="text-2xl font-bold text-slate-900">{avgRating}<span className="text-sm text-slate-400 font-normal">/5</span></p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-brand-500/20">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Create a New Optimization</h2>
          <p className="text-brand-100 mb-8 leading-relaxed">
            Transform your vague ideas into precise, high-performance prompts suitable for any large language model.
          </p>
          <Link 
            to="/create" 
            className="inline-flex items-center px-6 py-3 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-sm"
          >
            Start Crafting <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-48 h-48 bg-brand-500/30 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Recent History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
          <Link to="/history" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <History size={24} />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">No history yet</h3>
            <p className="text-slate-500 text-sm">Your optimized prompts will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-1 font-medium group-hover:text-brand-600 transition-colors">
                      {item.originalPrompt}
                    </p>
                  </div>
                  {item.isBookmarked && <Star size={16} className="text-amber-400 fill-amber-400" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;