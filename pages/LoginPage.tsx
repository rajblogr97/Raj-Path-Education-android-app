import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-royal-blue mb-2">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Log in to continue your learning journey.</p>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-royal-blue text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-xs text-center text-gray-500 bg-slate-50 p-3 rounded-lg">
          <p className="font-semibold">Demo Accounts (password: 'password')</p>
          <p><strong className="text-royal-blue">Student:</strong> student@rajpath.com</p>
          <p><strong className="text-royal-blue">Instructor:</strong> instructor@rajpath.com</p>
          <p><strong className="text-royal-blue">Admin:</strong> admin@rajpath.com</p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-royal-blue hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;