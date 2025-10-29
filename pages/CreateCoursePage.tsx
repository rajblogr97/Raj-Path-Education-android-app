import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import CourseForm from '../components/CourseForm';

interface CreateCoursePageProps {
  addCourse: (courseData: Omit<Course, 'id' | 'progress' | 'enrollments' | 'instructor'>) => void;
}

const CreateCoursePage: React.FC<CreateCoursePageProps> = ({ addCourse }) => {
  const navigate = useNavigate();

  const handleSave = (courseData: Omit<Course, 'id' | 'progress' | 'enrollments' | 'instructor'>) => {
    addCourse(courseData);
    // Optionally show a success toast message here
    navigate('/instructor-dashboard');
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-royal-blue">Create New Course</h1>
        <p className="text-gray-600 mt-1">Fill in the details below to create a new course.</p>
      </div>
      <CourseForm onSave={handleSave} />
    </div>
  );
};

export default CreateCoursePage;