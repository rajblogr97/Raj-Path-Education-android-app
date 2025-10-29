import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import CourseDetail from './components/CourseDetail';
import { Course } from './types';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyCoursesPage from './pages/MyCoursesPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import { MY_COURSES, FEATURED_COURSES } from './constants';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCoursePage from './pages/CreateCoursePage';
import ProfilePage from './pages/ProfilePage';
import EditCoursePage from './pages/EditCoursePage';
import CourseForm from './components/CourseForm';
import CertificatePage from './pages/CertificatePage';
import InstructorsPage from './pages/InstructorsPage';
import ATSCheckerPage from './pages/ATSCheckerPage';
import SuccessSharePage from './pages/SuccessSharePage';
import HostingPage from './pages/HostingPage';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { user } = useAuth();
  
  const initialCourses = [...MY_COURSES, ...FEATURED_COURSES].reduce((acc: Course[], current) => {
    if (!acc.find(item => item.id === current.id)) {
      acc.push(current);
    }
    return acc;
  }, []);

  const [allCourses, setAllCourses] = useState<Course[]>(initialCourses);

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>(() => {
    try {
      const savedCourses = localStorage.getItem('enrolledCourses');
      return savedCourses ? JSON.parse(savedCourses) : MY_COURSES;
    } catch (error) {
      console.error("Failed to parse enrolled courses from localStorage", error);
      return MY_COURSES;
    }
  });
  
  const addCourse = (newCourseData: Omit<Course, 'id' | 'progress' | 'enrollments' | 'instructor'>) => {
    setAllCourses(prev => {
      const newCourse: Course = {
        ...newCourseData,
        id: Math.max(...prev.map(c => c.id)) + 1,
        progress: 0,
        enrollments: 0,
        instructor: user?.name
      };
      return [...prev, newCourse];
    });
  };

  const updateCourse = (updatedCourseData: Course) => {
    setAllCourses(prev => prev.map(c => c.id === updatedCourseData.id ? updatedCourseData : c));
  };
  
  const deleteCourse = (courseId: number) => {
    setAllCourses(prev => prev.filter(c => c.id !== courseId));
  }


  useEffect(() => {
    try {
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    } catch (error) {
      console.error("Failed to save enrolled courses to localStorage", error);
    }
  }, [enrolledCourses]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEnrollClick = (course: Course) => {
    if (course.type === 'Free') {
        if (!enrolledCourses.find(c => c.id === course.id)) {
            setEnrolledCourses(prev => [...prev, { ...course, progress: 0 }]);
        }
        showToast(`Successfully enrolled in ${course.title}!`);
    } else {
        setCheckoutCourse(course);
    }
  };

  const handlePaymentSuccess = (course: Course) => {
    if (!enrolledCourses.find(c => c.id === course.id)) {
        setEnrolledCourses(prev => [...prev, { ...course, progress: 0 }]);
    }
    showToast(`Payment successful! Welcome to ${course.title}.`);
    handleCloseCheckout();
  };

  const handleCloseCheckout = () => {
    setCheckoutCourse(null);
  };
  
  const renderDashboardByRole = () => {
    switch(user?.role) {
      case 'Admin':
        return <Navigate to="/analytics" replace />;
      case 'Instructor':
        return <Navigate to="/instructor-dashboard" replace />;
      case 'Student':
      default:
        return <Dashboard enrolledCourses={enrolledCourses} onEnroll={handleEnrollClick} allCourses={allCourses}/>;
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen flex text-gray-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={renderDashboardByRole()} />
            <Route path="/course/:courseId" element={<CourseDetail allCourses={enrolledCourses} setAllCourses={setEnrolledCourses} />} />
            <Route path="/my-courses" element={<MyCoursesPage enrolledCourses={enrolledCourses} />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/certificates" element={<PlaceholderPage title="Certificates" />} />
            <Route path="/community" element={<PlaceholderPage title="Community" />} />
            
            <Route path="/instructor-dashboard" element={
              <ProtectedRoute allowedRoles={['Instructor']}>
                <InstructorDashboard allCourses={allCourses} deleteCourse={deleteCourse} />
              </ProtectedRoute>
            } />
             <Route path="/create-course" element={
              <ProtectedRoute allowedRoles={['Instructor']}>
                <CreateCoursePage addCourse={addCourse} />
              </ProtectedRoute>
            } />
             <Route path="/edit-course/:courseId" element={
              <ProtectedRoute allowedRoles={['Instructor']}>
                <EditCoursePage allCourses={allCourses} updateCourse={updateCourse} />
              </ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['Student', 'Instructor', 'Admin']}>
                <ProfilePage enrolledCourses={enrolledCourses} />
              </ProtectedRoute>
            } />
            
             <Route path="/ats-checker" element={
              <ProtectedRoute allowedRoles={['Student', 'Instructor', 'Admin']}>
                <ATSCheckerPage />
              </ProtectedRoute>
            } />
            
            <Route path="/certificate/:courseId" element={
              <ProtectedRoute allowedRoles={['Student', 'Instructor', 'Admin']}>
                <CertificatePage allCourses={allCourses} />
              </ProtectedRoute>
            } />

            <Route path="/share/:courseId" element={
              <ProtectedRoute allowedRoles={['Student', 'Instructor', 'Admin']}>
                <SuccessSharePage allCourses={allCourses} />
              </ProtectedRoute>
            } />

            <Route path="/hosting" element={
              <ProtectedRoute allowedRoles={['Student', 'Instructor', 'Admin']}>
                <HostingPage />
              </ProtectedRoute>
            } />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      {checkoutCourse && (
        <Checkout course={checkoutCourse} onClose={handleCloseCheckout} onPaymentSuccess={handlePaymentSuccess} />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;