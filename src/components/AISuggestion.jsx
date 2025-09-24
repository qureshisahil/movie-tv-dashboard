import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

// This is an ADVANCED SIMULATION. It mimics how an AI would extract keywords and genres.
const simulateAiProcessing = async (text) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      // Pre-defined genres and concepts
      const concepts = {
        'sci-fi': ['sci-fi', 'science fiction', 'space', 'aliens', 'future', 'robots'],
        'comedy': ['funny', 'comedy', 'hilarious', 'laugh'],
        'action': ['action', 'explosions', 'fast-paced', 'chase'],
        'horror': ['horror', 'scary', 'terrifying', 'ghosts', 'monsters'],
        'thriller': ['thriller', 'suspenseful', 'mind-bending', 'twist'],
        'drama': ['drama', 'emotional', 'serious'],
        'family': ['family', 'kids', 'children', 'animation'],
        'romance': ['romance', 'love', 'romantic'],
        'heist': ['heist', 'robbery', 'con'],
        // Add more concepts as needed
      };

      let keywords = new Set();
      
      // Look for concepts
      for (const concept in concepts) {
        if (concepts[concept].some(keyword => lowerText.includes(keyword))) {
          keywords.add(concept);
        }
      }

      // Look for quoted text (like movie titles or actor names)
      const quoted = lowerText.match(/"(.*?)"/g)?.map(q => q.replace(/"/g, '')) || [];
      quoted.forEach(q => keywords.add(q));

      // Add remaining meaningful words
      lowerText
        .replace(/"(.*?)"/g, '')
        .split(' ')
        .filter(word => word.length > 3 && !Object.values(concepts).flat().includes(word))
        .forEach(word => keywords.add(word));
      
      resolve([...keywords]);
    }, 1500); // Simulate network and AI processing delay
  });
};

const AISuggestion = ({ onSearch }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const keywords = await simulateAiProcessing(prompt);
    onSearch(keywords);
    // Loading is set to false in the parent App component after fetching
  };

  return (
    <div className="mb-6 p-6 rounded-xl glass-effect border border-white/10 text-center">
      <Sparkles className="mx-auto text-purple-400 mb-2" />
      <h3 className="text-lg font-semibold text-white mb-2">Describe Your Perfect Movie</h3>
      <p className="text-sm text-gray-400 mb-4">e.g., "A funny sci-fi movie with robots" or "something like The Matrix"</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe it here..."
          className="flex-grow pl-4 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Suggest'
          )}
        </button>
      </form>
    </div>
  );
};

export default AISuggestion;