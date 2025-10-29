
import React, { useState } from 'react';
import Card from './Card';
import { GlobeIcon } from './IconComponents';
import { fetchOpportunities } from '../services/geminiService';
import { Opportunity, Citation } from '../types';

const OpportunitiesFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ opportunities: Opportunity[]; citations: Citation[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const result = await fetchOpportunities(query);
      setResults(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryBadgeStyle = (category: Opportunity['category']) => {
    switch(category) {
        case 'Internship': return 'bg-blue-100 text-blue-800';
        case 'Scholarship': return 'bg-green-100 text-green-800';
        case 'Admission': return 'bg-purple-100 text-purple-800';
        case 'Job': return 'bg-yellow-100 text-yellow-800';
        case 'Workshop': return 'bg-indigo-100 text-indigo-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <Card className="p-6 bg-slate-50">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg mr-4">
          <GlobeIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-royal-blue">Global Opportunities Hub</h2>
      </div>
      <p className="text-gray-600 mb-4">
        Discover real-time, grounded information on university admissions, internships, scholarships, and more from around the world.
      </p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'AI internships in Europe' or 'MBA admissions India'"
          className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-royal-blue focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center bg-royal-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Search'}
        </button>
      </form>
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {isLoading && <p className="text-center text-gray-600">Searching for the latest opportunities...</p>}

      {results && (
        <div className="mt-6">
          <div className="space-y-4">
            {results.opportunities.length === 0 ? (
              <p className="text-center text-gray-600">No opportunities found for your query. Try a broader search term.</p>
            ) : (
              results.opportunities.map((op, index) => (
                <Card key={index} className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                      <h3 className="text-lg font-semibold text-royal-blue">{op.title}</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getCategoryBadgeStyle(op.category)}`}>{op.category}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{op.organization} - <span className="text-gray-500">{op.location}</span></p>
                  <p className="text-gray-600 my-2 text-sm">{op.description}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm">
                      <p className="text-red-600 font-medium">Deadline: {op.deadline}</p>
                      <a href={op.url} target="_blank" rel="noopener noreferrer" className="mt-2 sm:mt-0 bg-gold-accent text-royal-blue py-1 px-3 rounded-md hover:opacity-90 transition-opacity font-semibold">
                          Learn More &rarr;
                      </a>
                  </div>
                </Card>
              ))
            )}
          </div>

          {results.citations.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Information sourced from:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs list-disc list-inside">
                {results.citations.map((citation, index) => (
                    <li key={index} className="truncate">
                    <a
                        href={citation.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-royal-blue hover:underline"
                        title={citation.title}
                    >
                        {citation.title || new URL(citation.uri).hostname}
                    </a>
                    </li>
                ))}
                </ul>
            </div>
            )}
        </div>
      )}
    </Card>
  );
};

export default OpportunitiesFinder;
