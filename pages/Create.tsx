import React, { useState } from 'react';
import { Send, RefreshCw, Copy, Check, Star, ArrowRight, Wand2, AlertCircle, Sparkles } from 'lucide-react';
import { CATEGORIES, Category, OptimizationResult } from '../types';
import { optimizePrompt } from '../services/geminiService';
import { saveResult } from '../services/storageService';

const Create: React.FC = () => {
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<Category>('General');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await optimizePrompt(input, category);
      setResult(data);
      saveResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setInput('');
    setResult(null);
    setCategory('General');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Wand2 className="text-brand-600" />
            Optimize Prompt
          </h1>
          <p className="text-slate-500 mt-2">Refine your ideas into powerful instructions for AI.</p>
        </div>
        {result && (
            <button 
                onClick={resetForm} 
                className="text-sm text-slate-500 hover:text-brand-600 flex items-center font-medium"
            >
                <RefreshCw size={16} className="mr-1" /> Start Over
            </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`
                      text-xs py-2 px-3 rounded-lg border transition-all text-center truncate
                      ${category === cat 
                        ? 'bg-brand-50 border-brand-500 text-brand-700 font-medium' 
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Original Prompt</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Write a blog post about coffee..."
                className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed"
                maxLength={5000}
              />
              <div className="text-right text-xs text-slate-400 mt-2">
                {input.length}/5000 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`
                w-full py-3.5 px-4 rounded-xl text-white font-medium shadow-md transition-all flex items-center justify-center
                ${loading || !input.trim()
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5'}
              `}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={20} /> Optimizing...
                </>
              ) : (
                <>
                  Generate Optimized Prompt <Send className="ml-2" size={18} />
                </>
              )}
            </button>
            
            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start text-sm">
                    <AlertCircle size={18} className="mr-2 shrink-0 mt-0.5" />
                    {error}
                </div>
            )}
          </form>
        </div>

        {/* Right Column: Result */}
        <div className="space-y-6">
          {!result && !loading && (
             <div className="h-full bg-slate-100 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 p-12 text-center min-h-[500px]">
                <Sparkles size={48} className="mb-4 text-slate-300" />
                <p className="font-medium text-lg">Your optimized prompt will appear here</p>
                <p className="text-sm mt-2 max-w-xs">Select a category and describe your task on the left to get started.</p>
             </div>
          )}

          {loading && (
            <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[500px] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Wand2 className="text-brand-600 animate-pulse" size={24}/>
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-slate-800">Analyzing your prompt...</h3>
                    <p className="text-slate-500 text-sm">Identifying context, vague terms, and structure.</p>
                </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Output Card */}
              <div className="bg-white rounded-2xl border border-brand-200 shadow-lg shadow-brand-500/5 overflow-hidden">
                <div className="bg-brand-50 px-6 py-4 border-b border-brand-100 flex justify-between items-center">
                    <h2 className="font-semibold text-brand-900 flex items-center gap-2">
                        <Sparkles size={18} className="text-brand-600" /> 
                        Optimized Result
                    </h2>
                    <div className="flex items-center gap-2">
                        {result.rating && (
                            <div className="flex items-center bg-white px-2 py-1 rounded-md text-xs font-medium text-slate-600 border border-brand-100 shadow-sm">
                                <span className="text-slate-400 mr-1">Original Rating:</span>
                                <Star size={12} className="text-amber-400 fill-amber-400 mr-1" />
                                {result.rating}/5
                            </div>
                        )}
                        <button
                            onClick={handleCopy}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                copied 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-white text-slate-600 hover:text-brand-700 border border-brand-100 hover:border-brand-300'
                            }`}
                        >
                            {copied ? <Check size={14} className="mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {result.optimizedPrompt}
                  </pre>
                </div>
                <div className="px-6 pb-6 pt-2 bg-white">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Why is this better?</h3>
                    <p className="text-sm text-slate-600 italic border-l-2 border-brand-300 pl-3">
                        "{result.analysisNotes}"
                    </p>
                </div>
              </div>

              {/* Improvements List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Key Improvements</h3>
                <div className="space-y-3">
                  {result.improvements.map((imp, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="mt-1 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <div className="ml-3">
                        <span className="text-sm font-semibold text-slate-800 block">{imp.type}</span>
                        <span className="text-sm text-slate-600">{imp.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;