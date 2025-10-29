import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { CertificateIcon, UserCircleIcon, CoursesIcon } from '../components/IconComponents';

interface ProfilePageProps {
    enrolledCourses: Course[];
}

const AchievementCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; }> = ({ icon, title, value }) => (
    <div className="flex items-center p-4 bg-slate-50 rounded-lg">
        <div className="p-2 bg-slate-200 text-royal-blue rounded-lg mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-royal-blue">{value}</p>
        </div>
    </div>
);


const ProfilePage: React.FC<ProfilePageProps> = ({ enrolledCourses }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const coursesCompleted = enrolledCourses.filter(c => c.progress === 100).length;
    const certificatesEarned = coursesCompleted;

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'Admin': return 'bg-red-100 text-red-800';
            case 'Instructor': return 'bg-purple-100 text-purple-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    }

    return (
        <div className="space-y-8">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-royal-blue">My Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Profile & Achievements */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <img src={`https://picsum.photos/seed/${user.name}/128`} alt="User Avatar" className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-md" />
                            <h2 className="text-2xl font-bold text-royal-blue">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeStyle(user.role)}`}>
                                {user.role}
                            </span>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-royal-blue mb-4 flex items-center gap-2"><UserCircleIcon className="w-6 h-6" /> Achievements</h3>
                        <div className="space-y-4">
                           <AchievementCard icon={<CoursesIcon className="w-6 h-6"/>} title="Courses Completed" value={coursesCompleted} />
                           <AchievementCard icon={<CertificateIcon className="w-6 h-6"/>} title="Certificates Earned" value={certificatesEarned} />
                        </div>
                    </Card>
                </div>

                {/* Right Column: Learning History */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-royal-blue mb-4">Learning History</h3>
                        <div className="space-y-4">
                            {enrolledCourses.length > 0 ? (
                                enrolledCourses.map(course => (
                                    <Link to={`/course/${course.id}`} key={course.id} className="block hover:bg-slate-50 p-4 rounded-lg transition-colors border">
                                        <div className="flex items-center gap-4">
                                            <img src={course.imageUrl} alt={course.title} className="w-24 h-16 object-cover rounded-md" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-royal-blue">{course.title}</h4>
                                                <p className="text-sm text-gray-500">{course.category}</p>
                                                <div className="mt-2">
                                                     <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                        <span>Progress</span>
                                                        <span>{Math.round(course.progress)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full"
                                                            style={{ width: `${course.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">Your learning history is empty. Enroll in a course to get started!</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;