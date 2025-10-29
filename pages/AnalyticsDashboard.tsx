import React from 'react';
import Card from '../components/Card';
import { ANALYTICS_DATA } from '../constants';
import { AnalyticsData } from '../types';
import { UsersIcon, DollarSignIcon, BookOpenIcon, TrendingUpIcon } from '../components/IconComponents';
import GeminiAnalytics from '../components/GeminiAnalytics';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-xl font-bold text-royal-blue mb-4">{title}</h2>
);

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


const AnalyticsDashboard: React.FC = () => {
    const data: AnalyticsData = ANALYTICS_DATA;

    return (
        <div className="space-y-8">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-royal-blue">Admin Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">An overview of platform performance and user engagement.</p>
            </div>

            {/* AI Analytics */}
            <GeminiAnalytics analyticsData={data} />

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard icon={<UsersIcon className="w-6 h-6 text-royal-blue"/>} title="Total Users" value={data.totalUsers.toLocaleString()} />
                <KPICard icon={<DollarSignIcon className="w-6 h-6 text-green-600"/>} title="Total Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} />
                <KPICard icon={<BookOpenIcon className="w-6 h-6 text-yellow-600"/>} title="Total Courses" value={data.detailedCourseStats.length} />
                <KPICard icon={<TrendingUpIcon className="w-6 h-6 text-purple-600"/>} title="Total Enrollments" value={data.detailedCourseStats.reduce((sum, c) => sum + c.enrollments, 0).toLocaleString()} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Management */}
                <Card className="p-6">
                    <SectionHeader title="User Management" />
                    <div className="overflow-y-auto h-96">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.allUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{user.enrolledCourses}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Detailed Course Analytics */}
                <Card className="p-6">
                     <SectionHeader title="Detailed Course Analytics" />
                    <div className="overflow-y-auto h-96">
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.detailedCourseStats.map(course => (
                                    <tr key={course.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{course.enrollments.toLocaleString()}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{course.avgCompletionRate}%</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹{course.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;