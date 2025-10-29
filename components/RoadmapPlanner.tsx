
import React, { useState } from 'react';
import Card from './Card';
import { SparklesIcon } from './IconComponents';
import { generateCareerRoadmap } from '../services/geminiService';
import { RoadmapStep } from '../types';

const RoadmapPlanner: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoadmap = async () => {
    if (!interests.trim()) {
      setError('Please tell us your interests and goals.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      const result = await generateCareerRoadmap(interests);
      setRoadmap(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInterests(suggestion);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-4">
            <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-royal-blue">AI-Powered Career Roadmap</h2>
      </div>
      <p className="text-gray-600 mb-4">
        Describe your interests, current skills, and career goals. Our AI will generate a personalized step-by-step learning path for you.
      </p>

      {!roadmap && (
        <>
            <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., 'I am a beginner interested in web development and want to become a full-stack engineer. I enjoy creative problem-solving and building user interfaces.'"
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-royal-blue focus:outline-none transition mb-2"
                disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2 mb-4 text-sm">
                <span className="text-gray-500 font-semibold">Try:</span>
                <button onClick={() => handleSuggestionClick("Become a data scientist starting from scratch.")} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-full">Data Scientist</button>
                <button onClick={() => handleSuggestionClick("I want to learn mobile app development for iOS and Android.")} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-full">Mobile Developer</button>
                 <button onClick={() => handleSuggestionClick("Transition into a project management role in the tech industry.")} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-full">Tech Project Manager</button>
            </div>

            <button
                onClick={handleGenerateRoadmap}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 text-royal-blue font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </>
                ) : 'Generate My Roadmap'}
            </button>
        </>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {roadmap && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 text-center">Your Personalized Roadmap:</h3>
          <div className="relative border-l-2 border-royal-blue/20 ml-6">
            {roadmap.map((step, index) => (
              <div key={index} className="mb-8 pl-10 relative">
                <div className="absolute -left-4 top-1 w-7 h-7 bg-royal-blue rounded-full text-white flex items-center justify-center font-bold ring-4 ring-white">
                  {step.step}
                </div>
                <h4 className="text-lg font-semibold text-royal-blue">{step.title}</h4>
                <p className="text-gray-600 my-2">{step.description}</p>
                <div>
                  <h5 className="font-semibold mt-3 mb-1">Skills to Learn:</h5>
                  <div className="flex flex-wrap gap-2">
                    {step.skills.map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
                 <div>
                  <h5 className="font-semibold mt-3 mb-1">Suggested Resources:</h5>
                  <ul className="list-disc list-inside text-gray-500 text-sm space-y-1">
                    {step.resources.map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setRoadmap(null); setInterests(''); }} className="mt-4 w-full bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition-colors">
            Start Over
          </button>
        </div>
      )}
    </Card>
  );
};

export default RoadmapPlanner;
