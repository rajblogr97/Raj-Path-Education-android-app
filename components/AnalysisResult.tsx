import React from 'react';
import { ATSAnalysisResult } from '../types';
import Card from './Card';
import { CheckCircleIcon, ExclamationTriangleIcon, SparklesIcon } from './IconComponents';

interface CircularProgressProps {
  score: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ score }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score >= 75) return 'stroke-green-500';
        if (score >= 50) return 'stroke-yellow-500';
        return 'stroke-red-500';
    };

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`transition-all duration-1000 ease-out ${getColor()}`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <span className={`absolute text-3xl font-bold ${getColor().replace('stroke-', 'text-')}`}>
                {score}%
            </span>
        </div>
    );
};


const AnalysisResult: React.FC<{ result: ATSAnalysisResult }> = ({ result }) => {
    return (
        <Card className="p-6 mt-6 bg-white">
            <h2 className="text-2xl font-bold text-royal-blue text-center mb-6">Your Resume Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Match Score</h3>
                    <CircularProgress score={result.matchScore} />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-green-700 flex items-center mb-2">
                            <CheckCircleIcon className="w-6 h-6 mr-2" />
                            Matching Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {result.matchingKeywords.length > 0 ? (
                                result.matchingKeywords.map((keyword, index) => (
                                    <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No matching keywords found from the job description.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-700 flex items-center mb-2">
                            <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
                            Missing Keywords
                        </h3>
                         <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.length > 0 ? (
                                result.missingKeywords.map((keyword, index) => (
                                    <span key={index} className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Great job! All important keywords seem to be included.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-royal-blue flex items-center mb-4">
                   <SparklesIcon className="w-6 h-6 mr-2 text-gold-accent" />
                    Actionable Suggestions
                </h3>
                <ul className="space-y-3 list-disc list-inside text-gray-700">
                   {result.suggestions.map((suggestion, index) => (
                       <li key={index}>{suggestion}</li>
                   ))}
                </ul>
            </div>
        </Card>
    )
};

export default AnalysisResult;
