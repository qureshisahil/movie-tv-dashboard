import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Lightbulb, Wand2 } from 'lucide-react';
import { generateRandomSuggestion } from '../utils/helpers';

const AISuggestion = ({ onSuggest, loading }) => {
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      onSuggest(description.trim());
    }
  };

  const handleRandomSuggestion = () => {
    const randomSuggestion = generateRandomSuggestion();
    setDescription(randomSuggestion);
  };

  const quickSuggestions = [
    'Romantic comedy in Paris',
    'Sci-fi thriller with AI',
    'Marvel superhero adventure',
    'Japanese anime movie',
    'Historical war drama',
    'Horror with ghosts'
  ];

  return (
    <div className="glass-morphism rounded-xl p-6 border border-white/10 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-primary">AI Movie Suggestions</h3>
          <p className="text-gray-400 text-sm">Describe what you're in the mood for and let AI find perfect matches</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., 'A heartwarming story about friendship and adventure' or 'Dark psychological thriller with plot twists'"
            className="w-full p-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none h-20 form-control"
            style={{ fontFamily: 'var(--font-primary)' }}
          />
          <button
            type="button"
            onClick={handleRandomSuggestion}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all tooltip"
            data-tooltip="Get random suggestion"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-400 mr-2">Quick ideas:</span>
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setDescription(suggestion)}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-purple-500/20 text-gray-300 hover:text-white rounded-full border border-white/20 hover:border-purple-500/30 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!description.trim() || loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-premium"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? 'Finding Movies...' : 'Get AI Suggestions'}
          </button>
          
          <button
            type="button"
            onClick={() => setDescription('')}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl transition-all border border-white/10"
          >
            Clear
          </button>
        </div>
      </form>

      {description && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-purple-200 text-sm font-medium">AI will search for:</p>
              <p className="text-white text-sm">{description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestion;