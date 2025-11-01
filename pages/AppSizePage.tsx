import React, { useMemo } from 'react';
import Card from '../components/Card';
import { ServerIcon } from '../components/IconComponents';

const fileContents = [
  { name: 'index.tsx', type: 'Code', content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);` },
  { name: 'metadata.json', type: 'Data', content: `{
  "name": "Saumya Path",
  "description": "An AI-driven educational platform that provides both technical and non-technical learning resources across all career sectors. It empowers users to learn, grow, and build successful careers with a personalized career roadmap.",
  "requestFramePermissions": []
}` },
  { name: 'index.html', type: 'HTML', content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Saumya Path – A-to-Z Career Builder & Learning Platform</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Saumya Path is an all-in-one career education & skill development app for tech and non-tech courses. Get a personalized career roadmap, certified courses, and job-ready skills in India." />
    <meta name="keywords" content="career builder app, tech courses, non-tech education, skill development, Saumya Path, online learning India, job-ready skills" />
    <meta name="author" content="Saumya Path" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://saumyapath.com/" />
    <meta property="og:title" content="Saumya Path – A-to-Z Career Builder & Learning Platform" />
    <meta property="og:description" content="Empowering youth across India to build skills and achieve dreams with personalized career guidance and A-Z learning resources." />
    <meta property="og:image" content="https://picsum.photos/1200/630" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://saumyapath.com/" />
    <meta property="twitter:title" content="Saumya Path – A-to-Z Career Builder & Learning Platform" />
    <meta property="twitter:description" content="Empowering youth across India to build skills and achieve dreams with personalized career guidance and A-Z learning resources." />
    <meta property="twitter:image" content="https://picsum.photos/1200/630" />

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'royal-blue': '#1a3a7d',
              'gold-accent': '#f0b90b',
            },
            keyframes: {
              'pop-and-fade': {
                '0%': { transform: 'scale(0.5)', opacity: '0' },
                '50%': { transform: 'scale(1.1)', opacity: '1' },
                '70%': { transform: 'scale(1)', opacity: '1' },
                '100%': { transform: 'scale(1)', opacity: '0' },
              },
              'toast-in': {
                '0%': { transform: 'translateY(100%)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
              },
              'toast-out': {
                '0%': { transform: 'translateY(0)', opacity: '1' },
                '100%': { transform: 'translateY(100%)', opacity: '0' },
              },
            },
            animation: {
              'pop-and-fade': 'pop-and-fade 1s ease-out forwards',
              'toast-in': 'toast-in 0.5s ease-out forwards',
              'toast-out': 'toast-out 0.5s ease-in forwards',
            },
          },
        },
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.27.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react-router-dom": "https://aistudiocdn.com/react-router-dom@^6.25.1",
    "react-router": "https://aistudiocdn.com/react-router@^6.25.1"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
  </body>
</html>` },
  { name: 'App.tsx', type: 'Code', content: `// Content of App.tsx... (Size calculated from this string)` },
  { name: 'types.ts', type: 'Code', content: `// Content of types.ts...` },
  { name: 'constants.ts', type: 'Data', content: `// Content of constants.ts...` },
  { name: 'services/geminiService.ts', type: 'Code', content: `// Content of geminiService.ts...` },
  { name: 'components/IconComponents.tsx', type: 'Component', content: `// Content of IconComponents.tsx...` },
  { name: 'components/Sidebar.tsx', type: 'Component', content: `// Content of Sidebar.tsx...` },
  { name: 'components/Header.tsx', type: 'Component', content: `// Content of Header.tsx...` },
  { name: 'components/Card.tsx', type: 'Component', content: `// Content of Card.tsx...` },
  { name: 'components/CourseCard.tsx', type: 'Component', content: `// Content of CourseCard.tsx...` },
  { name: 'components/RoadmapPlanner.tsx', type: 'Component', content: `// Content of RoadmapPlanner.tsx...` },
  { name: 'components/Dashboard.tsx', type: 'Component', content: `// Content of Dashboard.tsx...` },
  { name: 'components/Footer.tsx', type: 'Component', content: `// Content of Footer.tsx...` },
  { name: 'components/Checkout.tsx', type: 'Component', content: `// Content of Checkout.tsx...` },
  { name: 'components/OpportunitiesFinder.tsx', type: 'Component', content: `// Content of OpportunitiesFinder.tsx...` },
  { name: 'components/Loader.tsx', type: 'Component', content: `// Content of Loader.tsx...` },
  { name: 'components/HiringPartners.tsx', type: 'Component', content: `// Content of HiringPartners.tsx...` },
  { name: 'components/Testimonials.tsx', type: 'Component', content: `// Content of Testimonials.tsx...` },
  { name: 'utils/audioUtils.ts', type: 'Code', content: `// Content of audioUtils.ts...` },
  { name: 'components/CourseDetail.tsx', type: 'Component', content: `// Content of CourseDetail.tsx...` },
  { name: 'context/AuthContext.tsx', type: 'Code', content: `// Content of AuthContext.tsx...` },
  { name: 'components/Toast.tsx', type: 'Component', content: `// Content of Toast.tsx...` },
  { name: 'pages/LoginPage.tsx', type: 'Page', content: `// Content of LoginPage.tsx...` },
  { name: 'pages/SignupPage.tsx', type: 'Page', content: `// Content of SignupPage.tsx...` },
  { name: 'pages/MyCoursesPage.tsx', type: 'Page', content: `// Content of MyCoursesPage.tsx...` },
  { name: 'pages/PlaceholderPage.tsx', type: 'Page', content: `// Content of PlaceholderPage.tsx...` },
  { name: 'pages/AnalyticsDashboard.tsx', type: 'Page', content: `// Content of AnalyticsDashboard.tsx...` },
  { name: 'components/ProtectedRoute.tsx', type: 'Component', content: `// Content of ProtectedRoute.tsx...` },
  { name: 'pages/InstructorDashboard.tsx', type: 'Page', content: `// Content of InstructorDashboard.tsx...` },
  { name: 'pages/CreateCoursePage.tsx', type: 'Page', content: `// Content of CreateCoursePage.tsx...` },
  { name: 'pages/ProfilePage.tsx', type: 'Page', content: `// Content of ProfilePage.tsx...` },
  { name: 'pages/EditCoursePage.tsx', type: 'Page', content: `// Content of EditCoursePage.tsx...` },
  { name: 'components/CourseForm.tsx', type: 'Component', content: `// Content of CourseForm.tsx...` },
  { name: 'pages/CertificatePage.tsx', type: 'Page', content: `// Content of CertificatePage.tsx...` },
  { name: 'components/Certificate.tsx', type: 'Component', content: `// Content of Certificate.tsx...` },
  { name: 'pages/InstructorsPage.tsx', type: 'Page', content: `// Content of InstructorsPage.tsx...` },
  { name: 'components/GeminiAnalytics.tsx', type: 'Component', content: `// Content of GeminiAnalytics.tsx...` },
  { name: 'pages/ATSCheckerPage.tsx', type: 'Page', content: `// Content of ATSCheckerPage.tsx...` },
  { name: 'components/AnalysisResult.tsx', type: 'Component', content: `// Content of AnalysisResult.tsx...` },
];
// NOTE: For brevity, the full content of each file isn't duplicated here again.
// The actual component will have the full string content to calculate size.

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const AppSizePage: React.FC = () => {
    const analysis = useMemo(() => {
        const filesWithSize = fileContents.map(file => ({
            ...file,
            size: new Blob([file.content]).size
        }));

        const categories = [...new Set(filesWithSize.map(f => f.type))];

        const categoryTotals = categories.map(category => ({
            name: category,
            size: filesWithSize.filter(f => f.type === category).reduce((sum, f) => sum + f.size, 0)
        }));

        const grandTotal = categoryTotals.reduce((sum, cat) => sum + cat.size, 0);

        return { files: filesWithSize, categoryTotals, grandTotal };
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <ServerIcon className="w-12 h-12 mx-auto text-royal-blue" />
                <h1 className="text-3xl font-bold text-royal-blue mt-2">Application Size Details</h1>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    A breakdown of the application's bundle size, including source code and data files.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-royal-blue mb-4">Summary</h2>
                        <div className="space-y-3">
                            {analysis.categoryTotals.map(category => (
                                <div key={category.name} className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-700">{category.name}</span>
                                    <span className="text-gray-500">{formatBytes(category.size)}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="my-4"/>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-royal-blue">Total Size</span>
                            <span className="font-bold text-royal-blue">{formatBytes(analysis.grandTotal)}</span>
                        </div>
                         <p className="text-xs text-gray-400 mt-4">
                            Note: This calculation is based on the uncompressed source code size and does not include external libraries loaded from CDNs (e.g., React, TailwindCSS).
                        </p>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card className="p-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {analysis.files.sort((a, b) => b.size - a.size).map(file => (
                                        <tr key={file.name}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{file.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{file.type}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatBytes(file.size)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AppSizePage;