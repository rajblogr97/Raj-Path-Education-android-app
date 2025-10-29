import React, { useState } from 'react';
import Card from './Card';
import { BrainCircuitIcon } from './IconComponents';
import { getAnalyticsInsights } from '../services/geminiService';
import { AnalyticsData } from '../types';

interface GeminiAnalyticsProps {
    analyticsData: AnalyticsData;
}

const GeminiAnalytics: React.FC<GeminiAnalyticsProps> = ({ analyticsData }) => {
    const [query, setQuery] = useState('');
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateInsight = async () => {
        if (!query.trim()) {
            setError('Please enter a question to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setInsight(null);
        try {
            const result = await getAnalyticsInsights(query, analyticsData);
            setInsight(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
    }

    // A simple markdown to HTML converter
    const renderMarkdown = (text: string) => {
        const html = text
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-royal-blue mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-royal-blue mt-4 mb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-royal-blue mt-4 mb-2">$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n/g, '<br />');

        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
        <Card className="p-6 bg-slate-50">
            <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-4">
                    <BrainCircuitIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-royal-blue">AI-Powered Analytics Assistant</h2>
            </div>
            <p className="text-gray-600 mb-4">
                Ask questions about your platform data in plain English and get instant insights from Gemini.
            </p>

            <div className="space-y-2">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'Which course generated the most revenue?' or 'Who are the newest users who joined this month?'"
                    className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-royal-blue focus:outline-none transition"
                    disabled={isLoading}
                />
                <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-gray-500 font-semibold">Suggestions:</span>
                    <button onClick={() => handleSuggestionClick("Which course has the highest completion rate?")} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-full">Highest completion?</button>
                    <button onClick={() => handleSuggestionClick("Which 3 courses have the most enrollments?")} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-full">Most enrollments?</button>
                    <button onClick={() => handleSuggestionClick("Summarize the platform's financial performance.")} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-full">Financial summary?</button>
                </div>
            </div>

            <button
                onClick={handleGenerateInsight}
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center bg-royal-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : 'Generate Insight'}
            </button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            {insight && (
                <div className="mt-6 p-4 bg-white rounded-lg border">
                     <h3 className="text-lg font-bold text-royal-blue mb-2">Analysis Result:</h3>
                     <div className="prose prose-sm max-w-none text-gray-700">
                        {renderMarkdown(insight)}
                     </div>
                </div>
            )}
        </Card>
    );
};

export default GeminiAnalytics;