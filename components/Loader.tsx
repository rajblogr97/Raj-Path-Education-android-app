import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
    </div>
  );
};

export default Loader;
