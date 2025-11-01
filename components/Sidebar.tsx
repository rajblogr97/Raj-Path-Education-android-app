import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DashboardIcon, CoursesIcon, LeftArrowIcon, RightArrowIcon, AnalyticsIcon, DocumentSearchIcon } from './IconComponents';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isOpen: boolean; to: string }> = ({ icon, label, isOpen, to }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'
      }`
    }
  >
    {icon}
    <span className={`ml-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 whitespace-nowrap'}`}>{label}</span>
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const getNavItems = () => {
    switch(user?.role) {
      case 'Admin':
        return [
           { to: "/analytics", icon: <AnalyticsIcon className="w-6 h-6" />, label: 'Admin Analytics' },
        ];
      case 'Instructor':
        return [
           { to: "/instructor-dashboard", icon: <DashboardIcon className="w-6 h-6" />, label: 'Instructor Dashboard' },
        ];
      case 'Student':
      default:
         return [
            { to: "/", icon: <DashboardIcon className="w-6 h-6" />, label: 'Dashboard' },
            { to: "/my-courses", icon: <CoursesIcon className="w-6 h-6" />, label: 'My Courses' },
            { to: "/ats-checker", icon: <DocumentSearchIcon className="w-6 h-6" />, label: 'ATS Resume Checker' },
        ];
    }
  }

  return (
    <div className={`fixed top-0 left-0 h-full bg-royal-blue text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/20">
        {isOpen && (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-accent to-yellow-300 text-transparent bg-clip-text whitespace-nowrap">Saumya Path</h1>
            <div className="flex items-center w-full mt-1">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gold-accent/50 to-gold-accent"></div>
              <div className="w-2 h-2 rotate-45 bg-gold-accent"></div>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-gold-accent/50 to-gold-accent"></div>
            </div>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full hover:bg-white/20">
            {isOpen ? <LeftArrowIcon className="w-6 h-6" /> : <RightArrowIcon className="w-6 h-6" />}
        </button>
      </div>
      <nav className="flex-1 px-2 py-4">
        {getNavItems().map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isOpen={isOpen} />
        ))}
      </nav>
      <div className="p-4 border-t border-white/20">
        {user ? (
          <Link to="/profile" className="flex items-center hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors">
              <img src={`https://picsum.photos/seed/${user.name}/40`} alt="User" className="w-10 h-10 rounded-full" />
              {isOpen && (
                  <div className="ml-3">
                      <p className="font-semibold whitespace-nowrap">{user.name}</p>
                      <p className="text-sm text-gray-400 whitespace-nowrap">{user.role}</p>
                  </div>
              )}
          </Link>
        ) : (
           <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              {isOpen && <p className="ml-3 font-semibold">Guest</p>}
           </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;