import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { BookOpenIcon, UsersIcon, PlusCircleIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from '../components/IconComponents';

interface InstructorDashboardProps {
    allCourses: Course[];
    deleteCourse: (courseId: number) => void;
}

const KPICard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; }> = ({ icon, title, value }) => (
    <Card className="p-4">
        <div className="flex items-center">
            <div className="p-3 bg-slate-100 rounded-lg mr-4">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-royal-blue">{value}</p>
            </div>
        </div>
    </Card>
);

const DeleteConfirmationModal: React.FC<{ course: Course; onConfirm: () => void; onCancel: () => void; }> = ({ course, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md p-6">
            <div className="flex items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Course</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete the course "{course.title}"? This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onConfirm}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </Card>
    </div>
);


const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ allCourses, deleteCourse }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    const instructorCourses = useMemo(() => {
        if (!user || user.role !== 'Instructor') return [];
        return allCourses.filter(course => course.instructor === user.name);
    }, [allCourses, user]);

    if (!user || user.role !== 'Instructor') {
        return <p>Access Denied.</p>;
    }

    const totalEnrollments = instructorCourses.reduce((sum, course) => sum + (course.enrollments || 0), 0);
    
    const handleDeleteClick = (course: Course) => {
        setCourseToDelete(course);
    };
    
    const handleConfirmDelete = () => {
        if (courseToDelete) {
            deleteCourse(courseToDelete.id);
            setCourseToDelete(null);
        }
    };

    const handleEditClick = (courseId: number) => {
        navigate(`/edit-course/${courseId}`);
    };
    
    return (
        <div className="space-y-8">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-royal-blue">Instructor Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your courses and view student engagement.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <KPICard icon={<BookOpenIcon className="w-6 h-6 text-royal-blue"/>} title="Total Courses" value={instructorCourses.length} />
                 <KPICard icon={<UsersIcon className="w-6 h-6 text-green-600"/>} title="Total Enrollments" value={totalEnrollments.toLocaleString()} />
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-royal-blue">Your Courses</h2>
                    <Link to="/create-course">
                        <button className="flex items-center gap-2 bg-royal-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                           <PlusCircleIcon className="w-5 h-5" />
                           Create New Course
                        </button>
                    </Link>
                </div>

                <Card className="p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {instructorCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                            <div className="text-sm text-gray-500">{course.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrollments?.toLocaleString() ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Published</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => handleEditClick(course.id)} className="text-royal-blue hover:text-indigo-900 p-1 rounded-md hover:bg-slate-100" title="Edit">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDeleteClick(course)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-slate-100" title="Delete">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            {courseToDelete && (
                <DeleteConfirmationModal 
                    course={courseToDelete}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setCourseToDelete(null)}
                />
            )}
        </div>
    );
};

export default InstructorDashboard;