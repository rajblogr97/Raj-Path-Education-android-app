import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import Card from '../components/Card';

interface MyCoursesPageProps {
  enrolledCourses: Course[];
}

const MyCoursesPage: React.FC<MyCoursesPageProps> = ({ enrolledCourses }) => {
  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-royal-blue">My Courses</h1>
        <p className="text-gray-600 mt-1">Continue your learning journey with your enrolled courses.</p>
      </div>
      
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <CourseCard key={course.id} course={course} isEnrolled={true} />
          ))}
        </div>
      ) : (
        <Card className="text-center p-12">
          <h2 className="text-2xl font-semibold text-royal-blue">No Courses Yet!</h2>
          <p className="text-gray-600 mt-2 mb-6">It looks like you haven't enrolled in any courses. Explore our catalog to find your next learning opportunity.</p>
          <Link to="/" className="bg-royal-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
            Explore Courses
          </Link>
        </Card>
      )}
    </div>
  );
};

export default MyCoursesPage;
