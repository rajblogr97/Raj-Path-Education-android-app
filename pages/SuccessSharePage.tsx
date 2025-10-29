import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { LinkedInIcon, ClipboardIcon, CheckIcon, RecordIcon, DownloadIcon, VideoCameraIcon } from '../components/IconComponents';

interface SuccessSharePageProps {
  allCourses: Course[];
}

const SuccessSharePage: React.FC<SuccessSharePageProps> = ({ allCourses }) => {
    const { courseId } = useParams<{ courseId: string }>();
    const { user } = useAuth();
    const [isCopied, setIsCopied] = useState(false);

    // Screen recording state
    const [isRecording, setIsRecording] = useState(false);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [recordingError, setRecordingError] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<number | null>(null);

    const course = useMemo(() => {
        return courseId ? allCourses.find(c => c.id === parseInt(courseId, 10)) : undefined;
    }, [courseId, allCourses]);

    const postTextTemplate = useMemo(() => {
        if (!course || !user) return '';
        const categoryHashtag = course.category.replace(/[^a-zA-Z0-9]/g, '');
        return `I'm excited to share that I've successfully completed the "${course.title}" course on Raj Path! 🎉

This comprehensive program has equipped me with valuable skills in ${course.category}. A big thank you to my instructor, ${course.instructor || 'the team at Raj Path'}, and the entire platform for this incredible learning journey.

I'm looking forward to applying my new skills and knowledge.

#RajPath #CareerGrowth #SkillIndia #OnlineLearning #${categoryHashtag}`;
    }, [course, user]);

    const [postText, setPostText] = useState(postTextTemplate);

    useEffect(() => {
        setPostText(postTextTemplate);
    }, [postTextTemplate]);
    
    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

     // Cleanup effect for recording
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (!user || !course) {
        return <Navigate to="/" replace />;
    }
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(postText);
        setIsCopied(true);
    };

    const handlePostToLinkedIn = () => {
        const encodedText = encodeURIComponent(postText);
        const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
        window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    };

    const handleStartRecording = async () => {
        setVideoURL(null);
        setRecordingError(null);
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                // Fix: Cast video constraints to 'any' to bypass strict type checking for the 'cursor' property,
                // which is valid for getDisplayMedia but may not be in older TypeScript DOM typings.
                video: { cursor: "always" } as any,
                audio: true
            });
            const userAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const combinedStream = new MediaStream([
                ...displayStream.getVideoTracks(),
                ...userAudioStream.getAudioTracks()
            ]);
            mediaStreamRef.current = combinedStream;

            const recorder = new MediaRecorder(combinedStream);
            mediaRecorderRef.current = recorder;
            recordedChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoURL(url);
                recordedChunksRef.current = [];
                 // Stop all tracks to remove the screen sharing indicator
                mediaStreamRef.current?.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            };

            recorder.start();
            setIsRecording(true);
            timerIntervalRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error starting recording:", err);
            setRecordingError("Could not start recording. Please ensure you have granted the necessary permissions.");
        }
    };
    
    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setRecordingTime(0);
        }
    };

    const handleDownload = () => {
        if (videoURL) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = videoURL;
            a.download = `raj-path-demo-${course.title.replace(/\s+/g, '-')}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="pb-4 border-b border-gray-200 text-center">
                <h1 className="text-3xl font-bold text-royal-blue">Share Your Success</h1>
                <p className="text-gray-600 mt-2">You've earned it! Share your achievement with your network.</p>
            </div>

            <Card className="p-6">
                 <h2 className="text-xl font-semibold text-royal-blue mb-4">Option 1: Create a LinkedIn Post</h2>
                 <div className="flex items-center mb-4">
                    <img src={`https://picsum.photos/seed/${user.name}/48`} alt="Your avatar" className="w-12 h-12 rounded-full mr-3" />
                    <div>
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">Share a post on LinkedIn</p>
                    </div>
                </div>

                <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-royal-blue focus:outline-none transition text-sm text-gray-800"
                />
                
                <div className="mt-4 p-3 border rounded-lg flex items-center gap-4 bg-slate-50">
                    <img src={course.imageUrl} alt={course.title} className="w-24 h-16 object-cover rounded-md" />
                    <div>
                        <p className="font-semibold text-royal-blue">Certificate of Completion</p>
                        <p className="text-sm text-gray-700">{course.title}</p>
                        <p className="text-xs text-gray-500">Raj Path</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleCopyToClipboard}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-royal-blue text-sm font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        {isCopied ? (
                            <>
                                <CheckIcon className="w-5 h-5 text-green-600" />
                                Copied!
                            </>
                        ) : (
                             <>
                                <ClipboardIcon className="w-5 h-5" />
                                Copy Text
                            </>
                        )}
                    </button>

                    <button
                        onClick={handlePostToLinkedIn}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <LinkedInIcon className="w-5 h-5" />
                        Post on LinkedIn
                    </button>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-semibold text-royal-blue mb-2">Option 2: Record a Video Demo</h2>
                <p className="text-sm text-gray-600 mb-4">Since this app isn't live on the web, a screen recording is a great way to showcase your accomplishment. Record a short video and upload it to LinkedIn!</p>
                
                <div className="bg-slate-100 p-4 rounded-lg mb-6 border border-slate-200">
                    <h3 className="font-semibold text-md text-royal-blue mb-2">💡 Recording Ideas</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Show the main <strong>Dashboard</strong> and your enrolled courses.</li>
                        <li>Demonstrate the <strong>AI Career Roadmap</strong> feature.</li>
                        <li>Walk through a course, complete a lesson, and show the <strong>Syllabus</strong>.</li>
                        <li>Show your final <strong>Certificate of Completion</strong>.</li>
                    </ul>
                </div>

                {recordingError && <p className="text-red-500 bg-red-50 p-3 rounded-lg text-center mb-4">{recordingError}</p>}

                {!videoURL ? (
                    <div className="flex flex-col items-center">
                         <button
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            className={`flex items-center justify-center gap-3 w-full max-w-xs px-4 py-3 text-lg font-bold rounded-lg transition-colors ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-royal-blue hover:bg-opacity-90 text-white'}`}
                        >
                            {isRecording ? (
                                <>
                                    <div className="w-4 h-4 bg-white rounded-sm animate-pulse"></div>
                                    Stop Recording ({formatTime(recordingTime)})
                                </>
                            ) : (
                                <>
                                    <RecordIcon className="w-5 h-5" />
                                    Start Recording
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <video src={videoURL} controls className="w-full rounded-lg bg-black"></video>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                                <DownloadIcon className="w-5 h-5" />
                                Download Video
                            </button>
                            <button onClick={() => setVideoURL(null)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-royal-blue font-semibold rounded-lg hover:bg-slate-300 transition-colors">
                                <VideoCameraIcon className="w-5 h-5" />
                                Record Again
                            </button>
                        </div>
                         <p className="text-xs text-center text-gray-500">You can now upload the downloaded video file to your LinkedIn post.</p>
                    </div>
                )}
            </Card>

            <div className="mt-4 text-center">
                <Link to={`/certificate/${course.id}`} className="text-sm text-gray-500 hover:text-royal-blue hover:underline">
                    Back to Certificate
                </Link>
            </div>
        </div>
    );
};

export default SuccessSharePage;