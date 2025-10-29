import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 bg-white/80 backdrop-blur-sm shadow-sm px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex-1">
        {/* Kept for spacing to balance the flex layout */}
      </div>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-gray-600 hover:text-royal-blue transition-colors">Home</Link>
        <Link to="/my-courses" className="text-gray-600 hover:text-royal-blue transition-colors">Courses</Link>
        <Link to="/instructors" className="text-gray-600 hover:text-royal-blue transition-colors">Instructors</Link>
      </nav>

      <div className="flex flex-1 items-center justify-end space-x-4">
        {user ? (
          <>
            <Link to="/profile" className="hidden sm:inline text-sm hover:text-royal-blue hover:underline transition-colors">Welcome, {user.name}!</Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-200 text-royal-blue text-sm font-semibold rounded-lg hover:bg-slate-300 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hidden sm:inline-block text-sm font-medium text-royal-blue hover:underline">
              Login
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-royal-blue text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;