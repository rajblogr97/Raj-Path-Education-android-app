import React, { useState } from 'react';
import Card from '../components/Card';
import { DocumentSearchIcon, SparklesIcon } from '../components/IconComponents';
import { ATSAnalysisResult } from '../types';
import { analyzeResumeWithATS } from '../services/geminiService';
import AnalysisResult from '../components/AnalysisResult';
import Loader from '../components/Loader';

const ATSCheckerPage: React.FC = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) {
            setError('Please paste both your resume and the job description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeResumeWithATS(resumeText, jobDescription);
            setAnalysisResult(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setResumeText('');
        setJobDescription('');
        setAnalysisResult(null);
        setError(null);
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <DocumentSearchIcon className="w-12 h-12 mx-auto text-royal-blue" />
                <h1 className="text-3xl font-bold text-royal-blue mt-2">Master Resume ATS Checker</h1>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Optimize your resume for any job. Paste your resume and the job description to get an AI-powered analysis and boost your chances of getting an interview.</p>
            </div>

            {!analysisResult && (
                <Card className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="resume-text" className="block text-lg font-semibold text-gray-700 mb-2">Your Resume</label>
                            <textarea
                                id="resume-text"
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                placeholder="Paste your full resume text here..."
                                className="w-full h-80 p-3 border rounded-lg focus:ring-2 focus:ring-royal-blue focus:outline-none transition"
                                disabled={isLoading}
                            />
                        </div>
                         <div>
                            <label htmlFor="job-description" className="block text-lg font-semibold text-gray-700 mb-2">Job Description</label>
                            <textarea
                                id="job-description"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here..."
                                className="w-full h-80 p-3 border rounded-lg focus:ring-2 focus:ring-royal-blue focus:outline-none transition"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 text-royal-blue font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                'Analyzing...'
                            ) : (
                                <span className="flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5"/>
                                    Analyze My Resume
                                </span>
                            )}
                        </button>
                    </div>
                </Card>
            )}

            {isLoading && <Loader />}
            {error && <p className="text-red-500 mt-4 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
            
            {analysisResult && (
                <div>
                    <AnalysisResult result={analysisResult} />
                    <div className="mt-6 text-center">
                        <button 
                            onClick={handleReset}
                            className="bg-slate-200 text-slate-800 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Analyze Another Job
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ATSCheckerPage;
