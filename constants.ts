import { Course, AnalyticsData, User, Instructor, DetailedCourseStat } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Raj Kumar', email: 'student@saumyapath.com', role: 'Student', joinDate: '2023-01-15', enrolledCourses: 2 },
  { id: 2, name: 'Dr. Evelyn Reed', email: 'instructor@saumyapath.com', role: 'Instructor', joinDate: '2022-11-20', enrolledCourses: 0 },
  { id: 3, name: 'Admin User', email: 'admin@saumyapath.com', role: 'Admin', joinDate: '2022-10-01', enrolledCourses: 0 },
  { id: 4, name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'Student', joinDate: '2023-03-22', enrolledCourses: 1 },
  { id: 5, name: 'Amit Singh', email: 'amit.singh@example.com', role: 'Student', joinDate: '2023-08-10', enrolledCourses: 3 },
  { id: 6, name: 'Sunita Reddy', email: 'sunita.reddy@example.com', role: 'Student', joinDate: '2023-09-05', enrolledCourses: 1 },
];

export const INSTRUCTORS: Instructor[] = [
  {
    id: 1,
    name: 'Dr. Evelyn Reed',
    title: 'Lead AI & Software Engineering Instructor',
    avatarUrl: 'https://picsum.photos/seed/evelyn/200',
    bio: 'With a Ph.D. in Computer Science from Stanford, Dr. Reed is a leading expert in Machine Learning and Full-Stack Development. She has over 15 years of experience building scalable systems at top tech companies and is passionate about making complex topics accessible to all.'
  },
  {
    id: 2,
    name: 'Jane Doe',
    title: 'Head of Digital Marketing & Design',
    avatarUrl: 'https://picsum.photos/seed/jane/200',
    bio: 'Jane is an award-winning digital strategist and creative director with a decade of experience leading campaigns for global brands. Her expertise lies in SEO, content marketing, and creating compelling brand narratives that drive growth.'
  },
  {
    id: 3,
    name: 'Saumya Meena',
    title: 'Founder & CEO, Lead Skill Development Coach',
    avatarUrl: 'https://picsum.photos/seed/raj/200',
    bio: 'Saumya is a visionary entrepreneur dedicated to democratizing education in India. With a background in both tech and business, she specializes in holistic skill development, career coaching, and helping learners unlock their full potential.'
  },
  {
    id: 4,
    name: 'CA Priya Gupta',
    title: 'Expert in Finance & Taxation',
    avatarUrl: 'https://picsum.photos/seed/priya_gupta/200',
    bio: 'Priya is a certified Chartered Accountant with extensive experience in corporate finance and Indian tax law. She simplifies complex financial concepts, empowering business owners and aspiring finance professionals to navigate the world of GST and taxation with confidence.'
  },
  {
    id: 5,
    name: 'Anjali Sharma',
    title: 'Communication & Public Speaking Coach',
    avatarUrl: 'https://picsum.photos/seed/anjali_sharma/200',
    bio: 'Anjali is a renowned communication expert and public speaking coach who has trained corporate leaders and students alike. Her workshops focus on building confidence, mastering body language, and delivering impactful presentations.'
  },
  {
    id: 6,
    name: 'Mr. R. K. Singh',
    title: 'Senior Faculty, Govt. Exam Preparation',
    avatarUrl: 'https://picsum.photos/seed/rk_singh/200',
    bio: 'A veteran educator with over 20 years of experience, Mr. Singh has mentored thousands of students for competitive exams like UPSC. His structured approach and deep subject matter knowledge make him a trusted guide for civil service aspirants.'
  }
];

export const MY_COURSES: Course[] = [
  {
    id: 1,
    title: 'Advanced React Development',
    category: 'IT & Software',
    progress: 20,
    imageUrl: 'https://picsum.photos/seed/react/400/200',
    type: 'Paid',
    price: '$99.99',
    description: 'Master advanced React concepts including hooks, context, performance optimization, and server-side rendering to build complex, scalable applications.',
    instructor: 'Dr. Evelyn Reed',
    enrollments: 1250,
    language: 'English',
    duration: '8 Weeks',
    level: 'Advanced',
    prerequisites: ['React Fundamentals', 'JavaScript ES6'],
    lessons: [
      { id: 'r1', title: 'Deep Dive into React Hooks (useState, useEffect, useContext)', description: 'Explore powerful hooks like useMemo, useCallback, and learn how to create your own custom hooks for reusable logic.', type: 'video', completed: true, resources: [{ title: 'Official Hooks FAQ', type: 'link', url: 'https://react.dev/reference/react/hooks' }], notes: 'Custom hooks seem very powerful for abstracting logic.', language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
      { id: 'r2', title: 'Advanced State Management with Redux Toolkit', description: 'Master Redux Toolkit for efficient and scalable state management, moving beyond basic Context API.', type: 'video', completed: false, notes: '', language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
      { id: 'r3', title: 'Performance Optimization: Memoization and Code Splitting', description: 'Learn how to use React.memo, useMemo, useCallback, and implement code splitting with React.lazy to boost application speed.', type: 'pdf', completed: false, resources: [{ title: 'React Memoization Patterns', type: 'pdf', url: '#' }, { title: 'Code Splitting Guide', type: 'link', url: '#' }], notes: '', language: 'English' },
      { 
        id: 'r4', 
        title: 'Testing React Apps with Jest & React Testing Library', 
        description: 'Set up a robust testing environment to write unit and integration tests for your components, ensuring application reliability.', 
        type: 'quiz', 
        completed: false, 
        notes: '', 
        language: 'English',
        quizContent: [
          {
              question: "What is the primary purpose of React Testing Library?",
              options: [
                  "To test the implementation details of components.",
                  "To test how users interact with the application, focusing on accessibility.",
                  "To provide a framework for end-to-end testing.",
                  "To replace Jest."
              ],
              correctAnswer: 1
          },
          {
              question: "Which query from React Testing Library is best for finding an element that a user can see?",
              options: [
                  "getByTestId",
                  "getByRole",
                  "querySelector",
                  "getById"
              ],
              correctAnswer: 1
          },
          {
              question: "What does the `fireEvent` utility do?",
              options: [
                  "It directly calls component methods.",
                  "It dispatches DOM events to simulate user interactions.",
                  "It sets component state.",
                  "It measures component render performance."
              ],
              correctAnswer: 1
          }
        ]
      },
      { id: 'r5', title: 'Server-Side Rendering (SSR) with Next.js', description: 'Discover the benefits of SSR and how to implement it using the Next.js framework for better SEO and initial load times.', type: 'video', completed: false, resources: [{ title: 'Next.js Documentation', type: 'link', url: 'https://nextjs.org/docs' }], notes: '', language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
    ]
  },
  {
    id: 2,
    title: 'Digital Marketing Fundamentals',
    category: 'Marketing',
    progress: 60,
    imageUrl: 'https://picsum.photos/seed/marketing/400/200',
    type: 'Free',
    description: 'Learn the core principles of digital marketing, including SEO, content marketing, social media strategy, and email campaigns to grow your online presence.',
    instructor: 'Jane Doe',
    enrollments: 1854,
    language: 'English',
    duration: '4 Weeks',
    level: 'Beginner',
    prerequisites: ['None'],
    lessons: [
      { id: 'm1', title: 'Understanding the Marketing Funnel', description: 'Learn the AIDA model and how customers move from awareness to action.', type: 'video', completed: true, notes: '', language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
      { id: 'm2', title: 'Basics of Search Engine Optimization (SEO)', description: 'An introduction to on-page, off-page, and technical SEO to improve your search rankings.', type: 'video', completed: true, resources: [{ title: 'Google SEO Starter Guide', type: 'pdf', url: '#' }], notes: '', language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
      { id: 'm3', title: 'Content Marketing Strategy', description: 'Discover how to create and distribute valuable content to attract and retain a clearly defined audience.', type: 'pdf', completed: true, notes: '', language: 'English' },
      { id: 'm4', title: 'Social Media for Business', description: 'Leverage major social media platforms to build a community and drive business goals.', type: 'video', completed: false, notes: '', language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
      { id: 'm5', title: 'Mid-term Quiz', description: 'Test your knowledge on the fundamental concepts of digital marketing.', type: 'quiz', completed: false, notes: '', language: 'English' },
    ]
  },
];

export const FEATURED_COURSES: Course[] = [
  {
    id: 9,
    title: "Python for Beginners (English & Hindi)",
    category: "IT & Software",
    progress: 0,
    imageUrl: "https://picsum.photos/seed/python/400/200",
    type: "Free",
    instructor: "Dr. Evelyn Reed",
    enrollments: 4500,
    language: "Bilingual",
    duration: "6 Weeks",
    level: "Beginner",
    prerequisites: ["None"],
    description: "Start your programming journey with Python. This course covers the fundamentals from variables and data types to functions and basic data structures, available in both English and Hindi.",
    lessons: [
      { id: 'p1', title: 'Setting Up Your Environment', description: 'Learn how to install Python and set up your development environment on Windows, macOS, or Linux.', type: 'video', completed: false, language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4'},
      { id: 'p2', title: 'अपना एनवायरनमेंट सेटअप करें', description: 'सीखें कि विंडोज, मैकओएस या लिनक्स पर पाइथन कैसे स्थापित करें और अपना डेवलपमेंट एनवायरनमेंट कैसे सेटअप करें।', type: 'video', completed: false, language: 'Hindi', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4'},
      { id: 'p3', title: 'Understanding Variables & Data Types', description: 'An introduction to fundamental programming concepts: variables, data types (integers, strings, booleans), and how to use them.', type: 'audio', completed: false, language: 'English', audioUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/speech.ogg' },
      { id: 'p4', title: 'वेरिएबल्स और डेटा टाइप्स को समझना', description: 'मौलिक प्रोग्रामिंग अवधारणाओं का परिचय: वेरिएबल्स, डेटा प्रकार (इंटीजर, स्ट्रिंग्स, बूलियन), और उनका उपयोग कैसे करें।', type: 'audio', completed: false, language: 'Hindi', audioUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/speech.ogg' },
      { id: 'p5', title: 'First Program Quiz', description: 'Test your knowledge on the basic concepts of setting up and writing your first lines of Python code.', type: 'quiz', completed: false, language: 'Bilingual' },
    ],
  },
  {
    id: 8,
    title: 'Ultimate Skills Bundle: Tech & Business',
    category: 'Skill Development',
    progress: 0,
    imageUrl: 'https://picsum.photos/seed/bundle/400/200',
    type: 'Premium',
    price: '₹14,999',
    instructor: 'Saumya Meena',
    enrollments: 5000,
    language: 'Bilingual',
    duration: '6 Months',
    level: 'Intermediate',
    prerequisites: ['Basic computer literacy'],
    description: 'A comprehensive bundle covering all high-demand skills from programming and AI to digital marketing and finance, with content in both English and Hindi.',
    lessons: [
      { id: 'b1', title: 'Introduction to Python Programming', description: 'Get started with the most versatile programming language for web development, data science, and more.', type: 'video', completed: false, language: 'English', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4'},
      { id: 'b2', title: 'Python प्रोग्रामिंग का परिचय', description: 'वेब डेवलपमेंट, डेटा साइंस, और बहुत कुछ के लिए सबसे बहुमुखी प्रोग्रामिंग भाषा के साथ आरंभ करें।', type: 'video', completed: false, language: 'Hindi', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4'},
      { id: 'b3', title: 'Fundamentals of Digital Marketing', description: 'Learn the core strategies for online marketing, including SEO, SEM, and social media.', type: 'audio', completed: false, language: 'English', audioUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/speech.ogg' },
    ],
  },
  {
    id: 10,
    title: 'GST and Indian Taxation',
    category: 'Banking & Finance',
    progress: 0,
    imageUrl: 'https://picsum.photos/seed/gst/400/200',
    type: 'Paid',
    price: '₹4,999',
    instructor: 'CA Priya Gupta',
    enrollments: 1500,
    language: 'Bilingual',
    duration: '6 Weeks',
    level: 'Intermediate',
    prerequisites: ['Basics of accounting'],
    description: 'A detailed course on Goods and Services Tax (GST) and Indian tax laws for aspiring finance professionals and business owners.',
    lessons: [{ id: 'gst1', title: 'Introduction to GST', type: 'video', completed: false, language: 'Bilingual' }]
  },
  {
    id: 11,
    title: 'Mastering Public Speaking',
    category: 'Skill Development',
    progress: 0,
    imageUrl: 'https://picsum.photos/seed/publicspeaking/400/200',
    type: 'Free',
    instructor: 'Anjali Sharma',
    enrollments: 6200,
    language: 'English',
    duration: '3 Weeks',
    level: 'Beginner',
    prerequisites: [],
    description: 'Build confidence and learn the techniques to deliver powerful and persuasive speeches in any setting.',
    lessons: [{ id: 'ps1', title: 'Overcoming Stage Fright', type: 'video', completed: false, language: 'English' }]
  },
  {
    id: 12,
    title: 'UPSC Exam Foundation Course',
    category: 'Govt. Exam Prep',
    progress: 0,
    imageUrl: 'https://picsum.photos/seed/upsc/400/200',
    type: 'Premium',
    price: '₹24,999',
    instructor: 'Mr. R. K. Singh',
    enrollments: 890,
    language: 'Bilingual',
    duration: '1 Year',
    level: 'Beginner',
    prerequisites: ['Graduate degree'],
    description: 'A comprehensive foundation course covering all major subjects for the UPSC Civil Services Examination.',
    lessons: [{ id: 'upsc1', title: 'Understanding the Exam Pattern', type: 'pdf', completed: false, language: 'Bilingual' }]
  },
  {
    id: 4,
    title: 'AI and Machine Learning for Beginners',
    category: 'IT & Software',
    progress: 0,
    imageUrl: 'https://picsum.photos/seed/ai/400/200',
    type: 'Paid',
    price: '₹8,999',
    instructor: 'Dr. Evelyn Reed',
    enrollments: 2845,
    language: 'English',
    duration: '12 Weeks',
    level: 'Beginner',
    prerequisites: ['Basic Python knowledge'],
    lessons: [
      { id: 'ai1', title: 'Introduction to Artificial Intelligence', type: 'video', completed: false, language: 'English' },
      { id: 'ai2', title: 'Supervised Learning Algorithms', type: 'video', completed: false, language: 'English' }
    ]
  },
  {
    id: 5,
    title: 'Graphic Design Masterclass',
    category: 'Design, Arts & Media',
    progress: 0,
    imageUrl: 'https://picsum.photos/seed/design/400/200',
    type: 'Free',
    instructor: 'Jane Doe',
    enrollments: 3102,
    language: 'English',
    duration: '4 Weeks',
    level: 'Beginner',
    prerequisites: ['None'],
    lessons: [
      { id: 'gd1', title: 'Fundamentals of Design Theory', type: 'pdf', completed: false, language: 'English' },
      { id: 'gd2', title: 'Introduction to Adobe Photoshop', type: 'video', completed: false, language: 'English' }
    ]
  },
  {
    id: 3,
    title: 'Introduction to Financial Analysis',
    category: 'Banking & Finance',
    progress: 0,
    imageUrl: 'https://picsum.photos/seed/finance/400/200',
    type: 'Paid',
    price: '₹3,499',
    description: 'Get a foundational understanding of financial analysis, including reading financial statements, valuation methods, and investment principles.',
    instructor: 'John Smith',
    enrollments: 1420,
    language: 'English',
    duration: '6 Weeks',
    level: 'Intermediate',
    prerequisites: ['Basic accounting'],
     lessons: [
      { id: 'f1', title: 'Reading the Balance Sheet', description: 'Understand the key components of a balance sheet: assets, liabilities, and equity.', type: 'video', completed: false, notes: '', language: 'English' },
      { id: 'f2', title: 'Income Statement Analysis', description: 'Learn how to analyze revenue, costs, and profits from an income statement.', type: 'video', completed: false, notes: '', language: 'English' },
      { id: 'f3', title: 'Introduction to Valuation', description: 'Explore common valuation methods like DCF and comparable company analysis.', type: 'pdf', completed: false, resources: [{ title: 'Valuation Cheatsheet', type: 'pdf', url: '#' }], notes: '', language: 'English' },
      { id: 'f4', title: 'Final Project: Company Analysis', description: 'Apply your new skills to perform a complete financial analysis of a public company.', type: 'quiz', completed: false, notes: '', language: 'English' },
    ]
  },
];

export const HIRING_PARTNERS = [
    { name: 'Google', logoUrl: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' },
    { name: 'Microsoft', logoUrl: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31' },
    { name: 'Amazon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Infosys', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
    { name: 'TCS', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg' },
    { name: 'Wipro', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg' },
    { name: 'Zomato', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png' },
    { name: 'Paytm', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png' }
];

export const TESTIMONIALS = [
    {
        quote: "I was completely lost about my career path. The AI Roadmap feature gave me a clear, step-by-step plan. Saumya Path didn't just teach me to code; it taught me how to think like an engineer.",
        name: "Priya Sharma",
        course: "Full Stack Development",
        avatarUrl: "https://picsum.photos/seed/priya/100"
    },
    {
        quote: "As someone from a non-tech background, I was nervous. But the bilingual courses in Hindi and English were a game-changer. The community is so supportive. It's the best decision I ever made.",
        name: "Amit Singh",
        course: "Python for Beginners",
        avatarUrl: "https://picsum.photos/seed/amit/100"
    },
    {
        quote: "Saumya Path's placement assistance is top-notch. From resume building to mock interviews with industry experts, they prepared me for everything. I landed a great HR role at a top startup!",
        name: "Sunita Reddy",
        course: "Modern HR Management",
        avatarUrl: "https://picsum.photos/seed/sunita/100"
    }
];

const DETAILED_COURSE_STATS: DetailedCourseStat[] = [
    { id: 1, title: 'Advanced React Development', enrollments: 1250, avgCompletionRate: 78, revenue: 124987.50 },
    { id: 2, title: 'Digital Marketing Fundamentals', enrollments: 1854, avgCompletionRate: 92, revenue: 0 },
    { id: 3, title: 'Introduction to Financial Analysis', enrollments: 1420, avgCompletionRate: 65, revenue: 49685.80 },
    { id: 4, title: 'AI and Machine Learning for Beginners', enrollments: 2845, avgCompletionRate: 71, revenue: 256021.55 },
    { id: 5, title: 'Graphic Design Masterclass', enrollments: 3102, avgCompletionRate: 88, revenue: 0 },
    { id: 8, title: 'Ultimate Skills Bundle: Tech & Business', enrollments: 5000, avgCompletionRate: 55, revenue: 749950.00 },
    { id: 9, title: "Python for Beginners (English & Hindi)", enrollments: 4500, avgCompletionRate: 95, revenue: 0 },
    { id: 10, title: 'GST and Indian Taxation', enrollments: 1500, avgCompletionRate: 81, revenue: 74985.00 },
    { id: 11, title: 'Mastering Public Speaking', enrollments: 6200, avgCompletionRate: 75, revenue: 0 },
    { id: 12, title: 'UPSC Exam Foundation Course', enrollments: 890, avgCompletionRate: 45, revenue: 222491.10 },
];


export const ANALYTICS_DATA: AnalyticsData = {
  totalUsers: MOCK_USERS.length,
  totalRevenue: DETAILED_COURSE_STATS.reduce((sum, course) => sum + course.revenue, 0),
  allUsers: MOCK_USERS,
  detailedCourseStats: DETAILED_COURSE_STATS,
};