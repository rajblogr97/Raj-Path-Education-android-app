import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import Card from './Card';
import { CreditCardIcon, CloseIcon, CheckCircleIcon } from './IconComponents';

interface CheckoutProps {
  course: Course;
  onClose: () => void;
  onPaymentSuccess: (course: Course) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ course, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onPaymentSuccess(course);
      }, 1500); // Wait a moment before calling success to show message
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onPaymentSuccess, course]);


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
            <CloseIcon className="w-6 h-6" />
          </button>

          {isSuccess ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-royal-blue">Payment Successful!</h2>
              <p className="text-gray-600 mt-2">You have successfully enrolled in "{course.title}".</p>
              <p className="text-sm text-gray-500 mt-4">You can now start your course.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-royal-blue mb-2">Complete Your Enrollment</h2>
              <p className="text-gray-600 mb-6">You are enrolling in <span className="font-semibold">{course.title}</span>.</p>
              
              <div className="bg-slate-50 p-4 rounded-lg mb-6 flex justify-between items-center">
                <span className="text-gray-700">Total Amount</span>
                <span className="text-2xl font-bold text-royal-blue">{course.price}</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">Name on Card</label>
                    <input type="text" id="card-name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm" placeholder="Raj Kumar" />
                  </div>
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
                    <div className="relative">
                      <input type="text" id="card-number" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm" placeholder="0000 0000 0000 0000" />
                      <CreditCardIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input type="text" id="expiry" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm" placeholder="MM/YY" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                      <input type="text" id="cvc" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm" placeholder="123" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-8 flex items-center justify-center bg-royal-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                  ) : `Pay ${course.price}`}
                </button>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Checkout;