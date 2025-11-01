import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Course, Lesson, TTSVoice, AVAILABLE_VOICES, GeneratedQuestion } from '../types';
import { LeftArrowIcon, SpeakerIcon, CertificateIcon, ChevronDownIcon, PdfIcon, LinkIcon, AnimatedCheckmarkIcon, NotesIcon, LanguageIcon, VideoCameraIcon, PlayCircleIcon, SparklesIcon, TestIcon } from './IconComponents';
import Card from './Card';
import { generateSpeech, generateLessonSummary, generateQuizForLesson } from '../services/geminiService';
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

  // State for AI Quiz
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<Record<string, boolean>>({});
  const [quizError, setQuizError] = useState<Record<string, string | null>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>({}); // key: `${lessonId}-${questionIndex}`
  const [quizResults, setQuizResults] = useState<Record<string, { score: number; total: number } | null>>({});


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
  
  const handleGenerateQuiz = async (lessonId: string) => {
    if (!course?.lessons) return;
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.description) return;

    setIsGeneratingQuiz(prev => ({ ...prev, [lessonId]: true }));
    setQuizError(prev => ({ ...prev, [lessonId]: null }));

    try {
        const quiz = await generateQuizForLesson(lesson.title, lesson.description);
        const updatedLessons = course.lessons.map(l => 
            l.id === lessonId ? { ...l, generatedQuiz: quiz } : l
        );
        setCourse(prev => prev ? { ...prev, lessons: updatedLessons } : null);
    } catch (error: any) {
        setQuizError(prev => ({ ...prev, [lessonId]: error.message || "Failed to generate quiz."}));
    } finally {
        setIsGeneratingQuiz(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const handleAnswerSelect = (lessonId: string, questionIndex: number, optionIndex: number) => {
      const key = `${lessonId}-${questionIndex}`;
      setUserAnswers(prev => ({ ...prev, [key]: optionIndex }));
      if (quizResults[lessonId]) {
          setQuizResults(prev => ({ ...prev, [lessonId]: null }));
      }
  };

  const handleCheckQuiz = (lessonId: string) => {
      if (!course?.lessons) return;
      const lesson = course.lessons.find(l => l.id === lessonId);
      if (!lesson?.generatedQuiz) return;
      
      let score = 0;
      lesson.generatedQuiz.questions.forEach((q, index) => {
          const key = `${lessonId}-${index}`;
          const userAnswer = userAnswers[key];
          if (userAnswer !== undefined && userAnswer === q.correctAnswer) {
              score++;
          }
      });

      setQuizResults(prev => ({ ...prev, [lessonId]: { score, total: lesson.generatedQuiz!.questions.length } }));
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
  }, [course, allCourses, setAllCourses]);

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

  const renderQuizOptionClasses = (lessonId: string, q: GeneratedQuestion, qIndex: number, oIndex: number): string => {
        const baseClasses = "w-full text-left p-2 border rounded-md transition-colors";
        const userAnswerKey = `${lessonId}-${qIndex}`;
        const userAnswer = userAnswers[userAnswerKey];

        if (quizResults[lessonId]) { // Results are being shown
            if (oIndex === q.correctAnswer) {
                return `${baseClasses} bg-green-200 border-green-400`; // Correct answer
            }
            if (userAnswer === oIndex && userAnswer !== q.correctAnswer) {
                return `${baseClasses} bg-red-200 border-red-400`; // Incorrectly selected answer
            }
            return `${baseClasses} bg-gray-100 border-gray-300 text-gray-500`; // Other options
        }

        // Not showing results yet
        if (userAnswer === oIndex) {
            return `${baseClasses} bg-blue-200 border-blue-400`; // Selected answer
        }
        return `${baseClasses} hover:bg-slate-100 border-gray-300`;
    };


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
                                        {lesson.description && (
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

                                        {/* AI Quiz Section */}
                                        {lesson.description && (
                                            <div className="pt-4 mt-4 border-t border-slate-200">
                                                <h4 className="text-sm font-semibold mb-2 text-royal-blue flex items-center gap-2">
                                                    <TestIcon className="w-4 h-4 text-purple-500" /> AI Practice Quiz
                                                </h4>
                                                {lesson.generatedQuiz ? (
                                                    <div className="space-y-4">
                                                        {quizResults[lesson.id] && (
                                                            <div className={`p-3 rounded-lg text-center ${quizResults[lesson.id]!.score / quizResults[lesson.id]!.total >= 0.7 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                <h5 className="font-bold">Quiz Result: {quizResults[lesson.id]!.score} / {quizResults[lesson.id]!.total}</h5>
                                                                <p className="text-sm">{quizResults[lesson.id]!.score / quizResults[lesson.id]!.total >= 0.7 ? 'Great job!' : 'Keep practicing!'}</p>
                                                            </div>
                                                        )}
                                                        {lesson.generatedQuiz.questions.map((q, qIndex) => (
                                                            <div key={qIndex} className="text-sm">
                                                                <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                                                                <div className="space-y-2">
                                                                    {q.options.map((option, oIndex) => (
                                                                        <button 
                                                                            key={oIndex}
                                                                            onClick={() => handleAnswerSelect(lesson.id, qIndex, oIndex)}
                                                                            className={renderQuizOptionClasses(lesson.id, q, qIndex, oIndex)}
                                                                            disabled={!!quizResults[lesson.id]}
                                                                        >
                                                                            {option}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button 
                                                            onClick={() => handleCheckQuiz(lesson.id)}
                                                            disabled={!!quizResults[lesson.id]}
                                                            className="w-full bg-royal-blue text-white font-semibold py-2 rounded-lg mt-4 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                                            Check Answers
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button 
                                                            onClick={() => handleGenerateQuiz(lesson.id)}
                                                            disabled={isGeneratingQuiz[lesson.id]}
                                                            className="w-full flex items-center justify-center gap-2 bg-purple-100 text-purple-800 font-semibold py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-60 disabled:cursor-wait"
                                                        >
                                                            {isGeneratingQuiz[lesson.id] ? (
                                                                <>
                                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                    <span>Generating Quiz...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <SparklesIcon className="w-5 h-5" />
                                                                    <span>Generate Practice Quiz</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        {quizError[lesson.id] && <p className="text-red-500 text-xs mt-2 text-center">{quizError[lesson.id]}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {lesson.videoUrl && (
                                            <div className="pt-4 mt-4 border-t border-slate-200">
                                                <video controls onPlay={handlePlay} className="w-full rounded-lg">
                                                    <source src={lesson.videoUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        )}
                                        {lesson.audioUrl && (
                                             <div className="pt-4 mt-4 border-t border-slate-200">
                                                <audio controls onPlay={handlePlay} className="w-full">
                                                    <source src={lesson.audioUrl} type="audio/ogg" />
                                                    Your browser does not support the audio tag.
                                                </audio>
                                            </div>
                                        )}
                                        {lesson.resources && lesson.resources.length > 0 && (
                                            <div className="pt-4 mt-4 border-t border-slate-200">
                                                <h4 className="text-sm font-semibold mb-2">Resources</h4>
                                                <ul className="space-y-2">
                                                    {lesson.resources.map((res, index) => (
                                                        <li key={index} className="flex items-center text-sm">
                                                            {res.type === 'pdf' ? <PdfIcon className="w-5 h-5 mr-2 text-red-500" /> : <LinkIcon className="w-5 h-5 mr-2 text-blue-500" />}
                                                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-royal-blue hover:underline">{res.title}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="pt-4 mt-4 border-t border-slate-200">
                                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><NotesIcon className="w-4 h-4" /> My Notes</h4>
                                            <textarea 
                                                value={lesson.notes}
                                                onChange={(e) => handleNoteChange(lesson.id, e.target.value)}
                                                placeholder="Add your personal notes for this lesson here..."
                                                className="w-full h-24 p-2 text-sm border rounded-md focus:ring-1 focus:ring-royal-blue focus:outline-none transition"
                                            />
                                             <p className="text-xs text-right text-gray-400 h-4 mt-1">
                                                {saveStatus === 'saving' && 'Saving...'}
                                                {saveStatus === 'saved' && 'Saved!'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-royal-blue mb-4">Course Info</h2>
                    <ul className="space-y-3 text-sm">
                       {course.instructor && <li className="flex items-center"><strong className="w-24 font-semibold">Instructor:</strong> <span className="text-gray-700">{course.instructor}</span></li>}
                       {course.level && <li className="flex items-center"><strong className="w-24 font-semibold">Level:</strong> <span className="text-gray-700">{course.level}</span></li>}
                       {course.duration && <li className="flex items-center"><strong className="w-24 font-semibold">Duration:</strong> <span className="text-gray-700">{course.duration}</span></li>}
                       {course.language && <li className="flex items-center"><strong className="w-24 font-semibold">Language:</strong> <span className="text-gray-700">{course.language}</span></li>}
                       {course.prerequisites && course.prerequisites.length > 0 && (
                          <li className="flex items-start">
                            <strong className="w-24 font-semibold flex-shrink-0">Prerequisites:</strong> 
                            <span className="text-gray-700">{course.prerequisites.join(', ')}</span>
                          </li>
                       )}
                    </ul>
                    {completionPercentage === 100 && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <h3 className="font-bold text-green-600">Congratulations!</h3>
                            <p className="text-sm text-gray-600 mb-4">You have completed this course.</p>
                            <Link to={`/certificate/${course.id}`}>
                                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-accent to-yellow-300 text-royal-blue font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                                    <CertificateIcon className="w-5 h-5"/>
                                    Get Certificate
                                </button>
                            </Link>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    </div>
  );
};

export default CourseDetail;
