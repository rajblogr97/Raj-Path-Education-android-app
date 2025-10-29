import React from 'react';
import Card from '../components/Card';
import { INSTRUCTORS } from '../constants';
import { ExpertFacultyIcon } from '../components/IconComponents';

const InstructorsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-200 text-center">
        <ExpertFacultyIcon className="w-12 h-12 mx-auto text-royal-blue mb-2" />
        <h1 className="text-3xl font-bold text-royal-blue">Meet Our Expert Instructors</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Learn from the best in the industry. Our instructors are experienced professionals dedicated to your success.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INSTRUCTORS.map(instructor => (
          <Card key={instructor.id} className="p-6 text-center flex flex-col items-center">
            <img 
              src={instructor.avatarUrl} 
              alt={`Photo of ${instructor.name}`}
              className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-lg"
            />
            <h2 className="text-xl font-bold text-royal-blue">{instructor.name}</h2>
            <h3 className="text-md font-semibold text-gold-accent mb-3">{instructor.title}</h3>
            <p className="text-gray-600 text-sm">{instructor.bio}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorsPage;
