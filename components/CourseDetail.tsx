import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Course, Lesson, TTSVoice, AVAILABLE_VOICES } from '../types';
import { LeftArrowIcon, SpeakerIcon, CertificateIcon, ChevronDownIcon, PdfIcon, LinkIcon, AnimatedCheckmarkIcon, NotesIcon, LanguageIcon, VideoCameraIcon, PlayCircleIcon, SparklesIcon } from './IconComponents';
import Card from './Card';
import { generateSpeech, generateLessonSummary } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';


interface CourseDetailProps {
  allCourses: Course[];
  setAllCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ allCourses, setAllCourses }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const currentlyPlayingMedia = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);


  // Find the course from the global state
  const courseFromState = useMemo(() => {
    const numericId = courseId ? parseInt(courseId, 10) : NaN;
    if (isNaN(numericId)) return null;
    return allCourses.find(c => c.id === numericId) || null;
  }, [courseId, allCourses]);

  const [course, setCourse] = useState<Course | null>(courseFromState);
  
  // Load progress from localStorage on mount
  useEffect(() => {
    if (courseId) {
      try {
        const savedProgress = localStorage.getItem(`course-progress-${courseId}`);
        if (savedProgress && courseFromState) {
          const parsedProgress: Lesson[] = JSON.parse(savedProgress);
          // Create a new course object with updated lessons
          const updatedCourse = { ...courseFromState, lessons: parsedProgress };
          setCourse(updatedCourse);
        } else {
          setCourse(courseFromState);
        }
      } catch (error) {
         console.error("Failed to load course progress from localStorage", error);
         setCourse(courseFromState);
      }
    }
  }, [courseId, courseFromState]);

  // Save progress to localStorage whenever the course state changes
  useEffect(() => {
    if (course && course.lessons) {
      try {
        localStorage.setItem(`course-progress-${course.id}`, JSON.stringify(course.lessons));
        // Also update the global state
        const updatedCourses = allCourses.map(c => c.id === course.id ? course : c);
        setAllCourses(updatedCourses);
      } catch (error) {
        console.error("Failed to save course progress to localStorage", error);
      }
    }
  }, [course, setAllCourses]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [recentlyCompletedId, setRecentlyCompletedId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selectedVoice, setSelectedVoice] = useState<TTSVoice>('Kore');
  const noteSaveTimer = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<Record<string, boolean>>({});
  const [summaryError, setSummaryError] = useState<Record<string, string | null>>({});

  // Effect to clean up the audio context on component unmount
  useEffect(() => {
    return () => {
      audioContextRef.current?.close().catch(e => console.error("Error closing AudioContext:", e));
    };
  }, []);
  
  const handlePlay = (e: React.SyntheticEvent<HTMLAudioElement | HTMLVideoElement, Event>) => {
    const currentMedia = e.currentTarget;
    if (currentlyPlayingMedia.current && currentlyPlayingMedia.current !== currentMedia) {
      currentlyPlayingMedia.current.pause();
    }
    currentlyPlayingMedia.current = currentMedia;
  };

  const playSound = (soundType: 'complete' | 'incomplete') => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);

    if (soundType === 'complete') {
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
    }

    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.15);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  const handleTextToSpeech = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    setAudioError(null);
    try {
      const base64Audio = await generateSpeech(text, selectedVoice);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      source.onended = () => {
        setIsSpeaking(false);
        audioContext.close();
      };
    } catch (err: any) {
      setAudioError(err.message || "An error occurred during audio playback.");
      setIsSpeaking(false);
    }
  };
  
  const handleToggleLesson = (lessonId: string) => {
    if (!course || !course.lessons) return;
    
    const lessonToToggle = course.lessons.find(l => l.id === lessonId);
    if (!lessonToToggle) return;

    const isCompleting = !lessonToToggle.completed;
    playSound(isCompleting ? 'complete' : 'incomplete');

    if (isCompleting) {
      setRecentlyCompletedId(lessonId);
      setTimeout(() => setRecentlyCompletedId(null), 1000); // Animation duration (1s)
    }

    const updatedLessons = course.lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
    );
    setCourse({ ...course, lessons: updatedLessons });
  };
  
  const handleToggleLessonResources = (lessonId: string) => {
    setActiveLessonId(prevId => (prevId === lessonId ? null : lessonId));
  };

  const handleNoteChange = (lessonId: string, newNote: string) => {
    if (!course || !course.lessons) return;

    const updatedLessons = course.lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, notes: newNote } : lesson
    );
    setCourse({ ...course, lessons: updatedLessons });

    setSaveStatus('saving');
    
    if (noteSaveTimer.current) clearTimeout(noteSaveTimer.current);

    noteSaveTimer.current = window.setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1500);
    }, 1000);
  };

  const handleGenerateSummary = async (lessonId: string) => {
    if (!course?.lessons) return;
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.description) return;

    setIsGeneratingSummary(prev => ({ ...prev, [lessonId]: true }));
    setSummaryError(prev => ({ ...prev, [lessonId]: null }));

    try {
        const summary = await generateLessonSummary(lesson.title, lesson.description);
        const updatedLessons = course.lessons.map(l => 
            l.id === lessonId ? { ...l, summary: summary } : l
        );
        setCourse(prev => prev ? { ...prev, lessons: updatedLessons } : null);
    } catch (error: any) {
        setSummaryError(prev => ({ ...prev, [lessonId]: error.message || "Failed to generate summary."}));
    } finally {
        setIsGeneratingSummary(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const completionPercentage = useMemo(() => {
    if (!course?.lessons || course.lessons.length === 0) return 0;
    const completedCount = course.lessons.filter(l => l.completed).length;
    const percentage = (completedCount / course.lessons.length) * 100;
    
    // Update progress on the main course object
    if (course && course.progress !== percentage) {
        const updatedCourse = {...course, progress: percentage };
        const updatedCourses = allCourses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
        setAllCourses(updatedCourses);
    }
    return percentage;
  }, [course]);

  if (!course) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold">Course Not Found</h2>
            <button onClick={() => navigate('/')} className="mt-4 flex items-center justify-center mx-auto bg-royal-blue text-white py-2 px-4 rounded-lg hover:bg-opacity-90">
                <LeftArrowIcon className="w-5 h-5 mr-2" />
                Back to Dashboard
            </button>
        </div>
    );
  }

  const getLanguageBadge = (language: Lesson['language']) => {
    if (!language) return null;
    const style = language === 'Hindi' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
    const text = language === 'Hindi' ? 'HI' : 'EN';
    if (language === 'Bilingual') {
        return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">EN/HI</span>;
    }
    return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style}`}>{text}</span>
  }

  return (
    <div className="space-y-6">
        <div>
            <button onClick={() => navigate('/')} className="flex items-center text-sm text-royal-blue font-semibold hover:underline mb-4">
                <LeftArrowIcon className="w-4 h-4 mr-1" />
                Back to Dashboard
            </button>
        </div>
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover rounded-l-xl" />
                <div className="p-6 md:col-span-2">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                             <h1 className="text-3xl font-bold text-royal-blue">{course.title}</h1>
                             {course.language && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <LanguageIcon className="w-5 h-5" />
                                    <span>{course.language}</span>
                                </div>
                             )}
                        </div>
                         <div className="flex items-center gap-2 flex-shrink-0">
                            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value as TTSVoice)} className="text-xs border-gray-300 rounded-md shadow-sm focus:border-royal-blue focus:ring-royal-blue">
                                {AVAILABLE_VOICES.map(voice => <option key={voice} value={voice}>{voice}</option>)}
                            </select>
                            <button 
                                onClick={() => handleTextToSpeech(course.title)} 
                                disabled={isSpeaking}
                                aria-label="Read course title aloud"
                                className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isSpeaking ? (
                                    <svg className="animate-spin h-6 w-6 text-royal-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <SpeakerIcon className="w-6 h-6 text-royal-blue" />
                                )}
                            </button>
                         </div>
                    </div>
                    {audioError && <p className="text-red-500 text-sm mt-1">{audioError}</p>}
                    <p className="text-md text-gray-500 mt-1">{course.category}</p>
                    <p className="text-gray-700 mt-4">{course.description}</p>
                    
                    <div className="mt-6">
                        <p className="font-semibold">Your Progress</p>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-yellow-400 to-amber-500 h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                            <span className="font-bold text-royal-blue">{Math.round(completionPercentage)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-royal-blue mb-4">Course Syllabus</h2>
                    <ul className="space-y-3">
                        {course.lessons?.map(lesson => (
                            <li key={lesson.id} className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
                                <div 
                                    className="flex items-center p-3 cursor-pointer hover:bg-slate-100 relative"
                                >
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" checked={lesson.completed} onChange={() => handleToggleLesson(lesson.id)} className="h-5 w-5 rounded border-gray-300 text-royal-blue focus:ring-royal-blue cursor-pointer" />
                                    </div>
                                    <span onClick={() => handleToggleLessonResources(lesson.id)} className={`ml-3 flex-1 ${lesson.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{lesson.title}</span>
                                    
                                    <div className="flex items-center gap-2 mx-3">
                                        {getLanguageBadge(lesson.language)}
                                        {lesson.videoUrl && <VideoCameraIcon className="w-5 h-5 text-gray-400" />}
                                        {lesson.audioUrl && <PlayCircleIcon className="w-5 h-5 text-gray-400" />}
                                    </div>

                                    {recentlyCompletedId === lesson.id && (
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <AnimatedCheckmarkIcon className="w-8 h-8 text-green-500 animate-pop-and-fade" />
                                        </div>
                                    )}
                                    <ChevronDownIcon onClick={() => handleToggleLessonResources(lesson.id)} className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${activeLessonId === lesson.id ? 'rotate-180' : ''}`} />
                                </div>
                                {activeLessonId === lesson.id && (
                                    <div className="px-6 pb-4 pt-2 border-t border-slate-200 bg-white space-y-4">
                                        {lesson.description && (
                                            <p className="text-sm text-gray-600 pt-2">{lesson.description}</p>
                                        )}

                                        {/* AI Summary Section */}
                                        {course.id === 1 && (
                                            <div className="pt-4 mt-4 border-t border-slate-200">
                                                {lesson.summary ? (
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-2 text-royal-blue flex items-center gap-2"><SparklesIcon className="w-4 h-4 text-gold-accent"/> AI Generated Summary</h4>
                                                        <blockquote className="text-sm text-gray-700 bg-slate-50 p-3 rounded-md border-l-4 border-gold-accent">
                                                            {lesson.summary}
                                                        </blockquote>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button 
                                                            onClick={() => handleGenerateSummary(lesson.id)}
                                                            disabled={isGeneratingSummary[lesson.id]}
                                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-royal-blue font-semibold py-2 px-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-wait"
                                                        >
                                                            {isGeneratingSummary[lesson.id] ? (
                                                                <>
                                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                    <span>Generating...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <SparklesIcon className="w-5 h-5" />
                                                                    <span>Generate Summary</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        {summaryError[lesson.id] && <p className="text-red-500 text-xs mt-2 text-center">{summaryError[lesson.id]}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {lesson.videoUrl && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-2 text-gray-600">Video Lesson:</h4>
                                                <video controls src={lesson.videoUrl} onPlay={handlePlay} className="w-full rounded-lg bg-black"></video>
                                            </div>
                                        )}
                                        {lesson.audioUrl && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-2 text-gray-600">Audio Lesson:</h4>
                                                <audio controls src={lesson.audioUrl} onPlay={handlePlay} className="w-full"></audio>
                                            </div>
                                        )}
                                        {lesson.resources && lesson.resources.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-2 text-gray-600">Resources:</h4>
                                                <ul className="space-y-2">
                                                    {lesson.resources.map((resource, index) => (
                                                        <li key={index}>
                                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-royal-blue hover:underline text-sm group">
                                                                {resource.type === 'pdf' ? <PdfIcon className="w-5 h-5 mr-2 text-red-500" /> : <LinkIcon className="w-5 h-5 mr-2 text-blue-500" />}
                                                                <span>{resource.title}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {lesson.type === 'quiz' && lesson.quizContent && (
                                            <div>
                                                <h4 className="text-sm font-semibold my-2 text-gray-600">Quiz:</h4>
                                                <div className="space-y-4">
                                                    {lesson.quizContent.map((q, index) => (
                                                        <div key={index} className="bg-white p-4 rounded-md border">
                                                            <p className="font-semibold">{index + 1}. {q.question}</p>
                                                            <div className="mt-2 space-y-2">
                                                                {q.options.map((option, optIndex) => (
                                                                    <div key={optIndex} className="flex items-center">
                                                                        <input type="radio" name={`question-${index}`} id={`q-${index}-opt-${optIndex}`} className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300" />
                                                                        <label htmlFor={`q-${index}-opt-${optIndex}`} className="ml-3 block text-sm text-gray-700">{option}</label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-semibold text-gray-600 flex items-center">
                                                    <NotesIcon className="w-5 h-5 mr-2 text-gray-400" />
                                                    Personal Notes
                                                </h4>
                                                {saveStatus === 'saving' && <span className="text-xs text-gray-500 italic">Saving...</span>}
                                                {saveStatus === 'saved' && <span className="text-xs text-green-600">Saved!</span>}
                                            </div>
                                            <textarea
                                                className="w-full h-24 p-2 border rounded-md text-sm focus:ring-1 focus:ring-royal-blue focus:outline-none transition"
                                                placeholder="Add your personal notes here..."
                                                value={lesson.notes || ''}
                                                onChange={(e) => handleNoteChange(lesson.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
            <div>
                 <Card className="p-6">
                     <div className="flex items-center mb-4">
                        <CertificateIcon className="w-8 h-8 text-gold-accent mr-3"/>
                        <h2 className="text-xl font-bold text-royal-blue">Certificate</h2>
                     </div>
                     <p className="text-gray-600 mb-4">Complete the course to earn your certificate and share your achievement.</p>
                     {completionPercentage >= 100 ? (
                        <Link
                            to={`/certificate/${course.id}`}
                            className="w-full block text-center bg-gold-accent text-royal-blue font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            View Certificate
                        </Link>
                    ) : (
                        <button 
                            disabled
                            className="w-full bg-gold-accent text-royal-blue font-bold py-2 rounded-lg transition-opacity opacity-50 cursor-not-allowed"
                        >
                           {`Complete to Unlock (${Math.round(completionPercentage)}%)`}
                        </button>
                    )}
                 </Card>
            </div>
        </div>
    </div>
  );
};

export default CourseDetail;