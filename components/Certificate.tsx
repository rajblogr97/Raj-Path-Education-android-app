import React from 'react';

interface CertificateProps {
  userName: string;
  courseTitle: string;
  completionDate: string;
}

const Certificate: React.FC<CertificateProps> = ({ userName, courseTitle, completionDate }) => {
  return (
    <div className="w-full aspect-[sqrt(2)] border-8 border-gold-accent bg-slate-50 p-8 flex flex-col items-center justify-center text-center font-serif relative">
      <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-royal-blue"></div>
      
      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-royal-blue mb-4" style={{ fontFamily: "'Times New Roman', serif" }}>
          Certificate of Completion
        </h1>

        <p className="text-lg text-gray-700 mt-8">This certificate is proudly presented to</p>
        
        <p className="text-4xl font-extrabold text-gold-accent my-6 tracking-wider" style={{ fontFamily: "'Brush Script MT', cursive" }}>
          {userName}
        </p>

        <p className="text-lg text-gray-700">for successfully completing the course</p>
        
        <h2 className="text-3xl font-semibold text-royal-blue my-4">
          {courseTitle}
        </h2>
        
        <p className="text-md text-gray-600 mt-8">
          Awarded on {completionDate}
        </p>

        <div className="mt-16 flex justify-between items-end w-full max-w-lg mx-auto">
          <div className="text-center">
            <p className="text-xl font-bold text-royal-blue" style={{ fontFamily: "'Brush Script MT', cursive" }}>Raj Meena</p>
            <hr className="border-gray-600 mt-1" />
            <p className="text-sm font-semibold text-gray-600">Founder, Raj Path</p>
          </div>
          <div className="text-center">
             <p className="text-xl font-bold text-royal-blue" style={{ fontFamily: "'Brush Script MT', cursive" }}>Dr. Evelyn Reed</p>
            <hr className="border-gray-600 mt-1" />
            <p className="text-sm font-semibold text-gray-600">Lead Instructor</p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
            Certificate ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Certificate;