import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import Certificate from '../components/Certificate';
import { LinkedInIcon } from '../components/IconComponents';

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
      <div className="mt-8 flex flex-wrap justify-center items-center gap-4 print:hidden">
          <Link 
            to={`/share/${course.id}`}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LinkedInIcon className="w-5 h-5" />
            Share on LinkedIn
          </Link>
          <button 
            onClick={handlePrint}
            className="bg-royal-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Print or Save as PDF
          </button>
      </div>
       <div className="mt-4 text-center print:hidden">
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