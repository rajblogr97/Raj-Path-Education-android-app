import React from 'react';
import HostingGuide from '../components/HostingGuide';
import { CloudIcon } from '../components/IconComponents';

const HostingPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-200 text-center">
        <CloudIcon className="w-12 h-12 mx-auto text-royal-blue mb-2" />
        <h1 className="text-3xl font-bold text-royal-blue">Netlify Hosting Guide</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Apne Raj Path app ko Netlify par free me host karne ke liye step-by-step instructions.
        </p>
      </div>
      <HostingGuide />
    </div>
  );
};

export default HostingPage;
