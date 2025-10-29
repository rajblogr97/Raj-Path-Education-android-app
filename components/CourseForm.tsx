import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import Card from './Card';

interface CourseFormProps {
  onSave: (courseData: Omit<Course, 'id' | 'progress' | 'enrollments' | 'instructor'>) => void;
  initialData?: Course;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState<Course['type']>('Free');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState<Course['level']>('Beginner');
  const [prerequisites, setPrerequisites] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl);
      setType(initialData.type);
      setPrice(initialData.price || '');
      setDuration(initialData.duration || '');
      setLevel(initialData.level || 'Beginner');
      setPrerequisites(initialData.prerequisites?.join(', ') || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      title,
      category,
      description,
      imageUrl,
      type,
      price: type !== 'Free' ? price : undefined,
      duration,
      level,
      prerequisites: prerequisites.split(',').map(p => p.trim()).filter(p => p),
    };
    onSave(courseData as Omit<Course, 'id' | 'progress' | 'enrollments' | 'instructor'>);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                placeholder="e.g., IT & Software"
              />
            </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
          />
        </div>
        
        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                placeholder="e.g., 8 Weeks"
              />
            </div>
            
            {/* Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as Course['level'])}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            
             {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Course Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as Course['type'])}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
              >
                <option>Free</option>
                <option>Paid</option>
                <option>Premium</option>
              </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prerequisites */}
            <div className={type === 'Free' ? 'md:col-span-2' : ''}>
                <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">Prerequisites</label>
                <input
                    type="text"
                    id="prerequisites"
                    value={prerequisites}
                    onChange={(e) => setPrerequisites(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                    placeholder="e.g., React Fundamentals, JavaScript ES6"
                />
                 <p className="text-xs text-gray-500 mt-1">Separate prerequisites with a comma.</p>
            </div>
            
            {/* Price (Conditional) */}
            {type !== 'Free' && (
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="text"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                        placeholder="$99.99"
                    />
                </div>
            )}
        </div>
        
         {initialData && (
             <div>
                <label className="block text-sm font-medium text-gray-700">Overall Student Progress</label>
                 <div className="mt-1 w-full px-3 py-2 bg-slate-100 border border-gray-300 rounded-md">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full"
                        style={{ width: `${initialData.progress || 0}%` }}
                      ></div>
                    </div>
                     <p className="text-xs text-right text-gray-500 mt-1">{Math.round(initialData.progress || 0)}% Complete</p>
                 </div>
                 <p className="text-xs text-gray-500 mt-1">This field is read-only and is updated automatically based on student activity.</p>
             </div>
        )}


        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/instructor-dashboard')}
            className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-royal-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {initialData ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CourseForm;