import React, { useEffect, useState } from 'react';
import { Search, Trash2, Star, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { HistoryItem, CATEGORIES } from '../types';
import { getHistory, toggleBookmark, deleteItem } from '../services/storageService';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmark(id);
    setHistory(updated);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      const updated = deleteItem(id);
      setHistory(updated);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredHistory = history.filter(item => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch = item.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.optimizedPrompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">History Library</h1>
        <p className="text-slate-500 mt-2">Manage your collection of optimized prompts.</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search prompts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button 
            onClick={() => setFilterCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterCategory === 'All' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
             <button 
             key={cat}
             onClick={() => setFilterCategory(cat)}
             className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
           >
             {cat}
           </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <Tag size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No prompts found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div 
              key={item.id} 
              onClick={() => toggleExpand(item.id)}
              className={`
                bg-white rounded-xl border transition-all cursor-pointer overflow-hidden
                ${expandedId === item.id 
                  ? 'border-brand-500 shadow-md ring-1 ring-brand-100' 
                  : 'border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md'}
              `}
            >
              {/* Header */}
              <div className="p-5 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                      {item.category}
                    </span>
                    <span className="flex items-center text-xs text-slate-400">
                      <Calendar size={12} className="mr-1" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    {item.rating && (
                        <span className="flex items-center text-xs font-medium text-slate-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                            <Star size={10} className="fill-amber-400 text-amber-400 mr-1" />
                            {item.rating}/5
                        </span>
                    )}
                  </div>
                  <h3 className="text-slate-900 font-medium truncate">{item.originalPrompt}</h3>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={(e) => handleToggleBookmark(item.id, e)}
                    className={`p-2 rounded-lg transition-colors ${item.isBookmarked ? 'text-amber-400 bg-amber-50 hover:bg-amber-100' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    <Star size={18} fill={item.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="p-2 text-slate-400">
                    {expandedId === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === item.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Original</h4>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-600 font-mono whitespace-pre-wrap">
                        {item.originalPrompt}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">Optimized</h4>
                      <div className="bg-white p-3 rounded-lg border border-brand-200 text-sm text-slate-800 font-mono whitespace-pre-wrap shadow-sm">
                        {item.optimizedPrompt}
                      </div>
                    </div>
                  </div>
                  
                  {item.improvements.length > 0 && (
                     <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Improvements</h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                            {item.improvements.map((imp, i) => (
                                <li key={i} className="text-xs text-slate-600 bg-white border border-slate-100 px-3 py-2 rounded-md">
                                    <span className="font-semibold text-slate-800">{imp.type}:</span> {imp.description}
                                </li>
                            ))}
                        </ul>
                     </div>
                  )}

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                        <span className="font-bold">Analysis:</span> {item.analysisNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;