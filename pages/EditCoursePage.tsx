import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Course } from '../types';
import CourseForm from '../components/CourseForm';

interface EditCoursePageProps {
  allCourses: Course[];
  updateCourse: (courseData: Course) => void;
}

const EditCoursePage: React.FC<EditCoursePageProps> = ({ allCourses, updateCourse }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const courseToEdit = courseId ? allCourses.find(c => c.id === parseInt(courseId, 10)) : undefined;

  const handleSave = (courseData: Omit<Course, 'id' | 'progress' | 'enrollments' | 'instructor'>) => {
    if (courseToEdit) {
      updateCourse({ ...courseToEdit, ...courseData });
      // Optionally show a success toast message here
      navigate('/instructor-dashboard');
    }
  };

  if (!courseToEdit) {
    return <Navigate to="/instructor-dashboard" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-royal-blue">Edit Course</h1>
        <p className="text-gray-600 mt-1">Update the details for "{courseToEdit.title}".</p>
      </div>
      <CourseForm onSave={handleSave} initialData={courseToEdit} />
    </div>
  );
};

export default EditCoursePage;