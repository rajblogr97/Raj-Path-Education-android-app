import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // Fix: Use the `signup` function from AuthContext for account creation.
  const { signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would hit a backend API.
    // Here, we just log the user in directly.
    // Fix: Called `signup` with the correct user data object instead of `login`.
    signup({ name, email });
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-royal-blue mb-2">Create Your Account</h2>
        <p className="text-center text-gray-600 mb-6">Start your journey with Raj Path today!</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
              placeholder="Raj Kumar"
            />
          </div>
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
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
              placeholder="Minimum 8 characters"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-royal-blue text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-royal-blue hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;