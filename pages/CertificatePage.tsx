import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import Certificate from '../components/Certificate';

interface CertificatePageProps {
  allCourses: Course[];
}

const CertificatePage: React.FC<CertificatePageProps> = ({ allCourses }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();

  const course = courseId ? allCourses.find(c => c.id === parseInt(courseId, 10)) : undefined;

  if (!user || !course || course.progress < 100) {
    // Redirect if user not logged in, course not found, or course not completed
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-200 p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0">
      <div className="w-full max-w-4xl bg-white p-4 shadow-lg print:shadow-none">
          <Certificate 
              userName={user.name}
              courseTitle={course.title}
              completionDate={new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })}
          />
      </div>
      <div className="mt-8 text-center print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-royal-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors mr-4"
        >
          Print or Save as PDF
        </button>
        <Link 
          to={`/course/${course.id}`}
          className="text-royal-blue font-semibold hover:underline"
        >
          Back to Course
        </Link>
      </div>
       <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          main {
             padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;
