import React, { Suspense } from 'react';
import RoadmapPlanner from './RoadmapPlanner';
import CourseCard from './CourseCard';
import OpportunitiesFinder from './OpportunitiesFinder';
import Card from './Card';
import {
  IndustryVettedIcon,
  ExpertFacultyIcon,
  CareerServicesIcon,
  RoadmapIcon,
  MentorshipIcon,
  GlobeIcon
} from './IconComponents';
import { Course } from '../types';
import Loader from './Loader';
import { Link } from 'react-router-dom';

// Lazy-load components that are not in the initial viewport
const HiringPartners = React.lazy(() => import('./HiringPartners'));
const Testimonials = React.lazy(() => import('./Testimonials'));


interface DashboardProps {
    onEnroll: (course: Course) => void;
    enrolledCourses: Course[];
    allCourses: Course[];
}

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl font-bold text-royal-blue mb-2">{title}</h2>
    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const HeroSection: React.FC = () => (
  <section className="relative text-white py-20 px-4 sm:px-6 lg:px-8 text-center rounded-xl overflow-hidden bg-royal-blue" style={{ backgroundImage: `url('https://picsum.photos/seed/natural-growth-hd/1200/400')`, backgroundBlendMode: 'multiply', backgroundColor: 'rgba(26, 58, 125, 0.8)', backgroundSize: 'cover' }}>
    <div className="relative z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Bharat Premier SkillTech Platform</h1>
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mb-8">
        Your career companion that simplifies education and empowers you to build skills and achieve your dreams.
      </p>
      <button className="bg-gradient-to-r from-gold-accent to-yellow-300 text-royal-blue font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-transform transform hover:scale-105">
        Explore Courses
      </button>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-sm">
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">100% Placement Assistance</div>
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">Industry-Led Curriculum</div>
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">300+ Hiring Partners</div>
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">1-on-1 Mentorship</div>
      </div>
    </div>
  </section>
);

const WhyRajPath: React.FC = () => {
    const features = [
        {
            icon: <IndustryVettedIcon className="w-10 h-10 mx-auto mb-4 text-royal-blue" />,
            title: "Industry-Vetted Curriculum",
            description: "Our courses are designed with input from industry experts to ensure you learn the most relevant skills."
        },
        {
            icon: <ExpertFacultyIcon className="w-10 h-10 mx-auto mb-4 text-royal-blue" />,
            title: "Learn From The Best",
            description: "Gain insights from experienced faculty and mentors who are leaders in their fields."
        },
        {
            icon: <CareerServicesIcon className="w-10 h-10 mx-auto mb-4 text-royal-blue" />,
            title: "Dedicated Career Services",
            description: "From resume building to mock interviews, we provide end-to-end placement support."
        }
    ];

    return (
        <section>
            <SectionHeader title="Why Raj Path?" subtitle="We are committed to providing a holistic learning experience that prepares you for the future of work." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="p-8 text-center">
                        {feature.icon}
                        <h3 className="text-xl font-bold text-royal-blue mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </Card>
                ))}
            </div>
        </section>
    )
};

const OurServices: React.FC = () => {
    const services = [
        {
            icon: <RoadmapIcon className="w-10 h-10 mx-auto mb-4 text-royal-blue" />,
            title: "Personalized AI Roadmap",
            description: "Get a custom, step-by-step learning path tailored to your career goals and interests."
        },
        {
            icon: <MentorshipIcon className="w-10 h-10 mx-auto mb-4 text-royal-blue" />,
            title: "Live 1-on-1 Mentorship",
            description: "Connect with industry experts for personalized guidance, doubt clearing, and career advice."
        },
        {
            icon: <GlobeIcon className="w-10 h-10 mx-auto mb-4 text-royal-blue" />,
            title: "Global Opportunity Hub",
            description: "Discover real-time internships, scholarships, and jobs from around the world."
        },
        {
            icon: <CareerServicesIcon className="w-10 h-10 mx-auto mb-4 text-royal-blue" />,
            title: "Complete Career Services",
            description: "We provide comprehensive placement assistance, including resume reviews and mock interviews."
        },
    ];
    return (
        <section>
            <SectionHeader title="Our Core Services" subtitle="A suite of powerful tools and services designed to accelerate your career." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                     <Card key={index} className="p-8 text-center bg-slate-50">
                        {service.icon}
                        <h3 className="text-xl font-bold text-royal-blue mb-2">{service.title}</h3>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onEnroll, enrolledCourses, allCourses }) => {
  const coursesToExplore = allCourses.filter(fc => !enrolledCourses.some(ec => ec.id === fc.id));
  return (
    <div className="space-y-12">

      <HeroSection />
      
      <WhyRajPath />
      
      <OurServices />

      {/* Your Enrolled Courses Section */}
      <section>
        <SectionHeader title="Your Enrolled Courses" subtitle="Pick up where you left off and continue your learning journey."/>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <CourseCard key={course.id} course={course} isEnrolled={true} />
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <h3 className="text-xl font-semibold text-royal-blue">Your learning journey starts here!</h3>
            <p className="text-gray-600 mt-2 mb-4">You haven't enrolled in any courses yet. Explore our popular courses to get started.</p>
             <Link to="/" className="bg-royal-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                Explore Courses
            </Link>
          </Card>
        )}
      </section>

      {/* Featured Courses Section */}
      <section>
        <SectionHeader title="Explore Our Popular Courses" subtitle="Choose from a wide range of courses across technical and non-technical domains designed for your career growth."/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesToExplore.map(course => (
            <CourseCard key={course.id} course={course} onEnroll={onEnroll} isEnrolled={false} />
          ))}
        </div>
      </section>
      
      <Suspense fallback={<Loader />}>
        <HiringPartners />
      </Suspense>

      {/* AI Roadmap Planner Section */}
      <Suspense fallback={<Loader />}>
        <section>
          <RoadmapPlanner />
        </section>
      </Suspense>
      
      {/* Global Opportunities Hub Section */}
      <Suspense fallback={<Loader />}>
        <section>
          <OpportunitiesFinder />
        </section>
      </Suspense>

      <Suspense fallback={<Loader />}>
        <Testimonials />
      </Suspense>

    </div>
  );
};

export default Dashboard;