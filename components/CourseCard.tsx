import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import Card from './Card';
import { LanguageIcon } from './IconComponents';

interface CourseCardProps {
  course: Course;
  onEnroll?: (course: Course) => void;
  isEnrolled: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolled }) => {
  const getBadgeStyles = (type: Course['type']) => {
    switch (type) {
      case 'Free':
        return 'bg-green-500 text-white';
      case 'Paid':
        return 'bg-blue-500 text-white';
      case 'Premium':
        return 'bg-gradient-to-r from-gold-accent to-yellow-300 text-royal-blue';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleEnrollClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if inside a link
    if (onEnroll) {
        onEnroll(course);
    }
  };

  const courseContent = (
    <>
      <div className="relative">
        <img loading="lazy" className="h-40 w-full object-cover" src={course.imageUrl} alt={course.title} />
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <div className={`px-2 py-1 text-xs font-bold rounded ${getBadgeStyles(course.type)}`}>
                {course.type}
            </div>
            {course.language && (
                <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 text-xs font-bold rounded">
                    <LanguageIcon className="w-3 h-3"/>
                    <span>{course.language}</span>
                </div>
            )}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-royal-blue">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{course.category}</p>
        
        {isEnrolled ? (
          <div className="mt-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(course.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="mt-auto flex items-center justify-between">
            {course.price && onEnroll ? (
              <>
                <span className="text-xl font-bold text-royal-blue">{course.price}</span>
                <button 
                  onClick={handleEnrollClick}
                  className="bg-royal-blue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors ml-2">
                  Enroll Now
                </button>
              </>
            ) : (
              <button 
                onClick={handleEnrollClick}
                className="w-full bg-royal-blue text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                Start for Free
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <Card className="flex flex-col">
       {isEnrolled ? (
         <Link to={`/course/${course.id}`} className="flex flex-col flex-1 hover:opacity-90 transition-opacity">
           {courseContent}
         </Link>
       ) : (
         <div className="flex flex-col flex-1">
           {courseContent}
         </div>
       )}
    </Card>
  );
};

export default CourseCard;