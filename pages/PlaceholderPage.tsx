import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { SparklesIcon } from '../components/IconComponents';

interface PlaceholderPageProps {
  title: string;
}

const CommunityContent: React.FC = () => (
  <>
    <SparklesIcon className="w-16 h-16 mx-auto text-gold-accent mb-4" />
    <h2 className="text-2xl font-semibold text-royal-blue">Our Community is Coming Soon!</h2>
    <p className="text-gray-600 mt-2 mb-6 max-w-lg mx-auto">
      Get ready to connect with fellow learners, join exclusive study groups, and get mentored by industry experts. Our interactive community platform is under construction and launching soon!
    </p>
    <Link to="/" className="bg-royal-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
      Go to Dashboard
    </Link>
  </>
);

const DefaultContent: React.FC<{ title: string }> = ({ title }) => (
  <>
    <SparklesIcon className="w-16 h-16 mx-auto text-gold-accent mb-4" />
    <h2 className="text-2xl font-semibold text-royal-blue">Coming Soon!</h2>
    <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
      We're working hard to bring you the best {title.toLowerCase()} experience. This feature is currently under construction.
    </p>
    <Link to="/" className="bg-royal-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
      Go to Dashboard
    </Link>
  </>
);

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-royal-blue">{title}</h1>
      </div>
      
      <Card className="text-center p-12">
        {title === 'Community' ? <CommunityContent /> : <DefaultContent title={title} />}
      </Card>
    </div>
  );
};

export default PlaceholderPage;