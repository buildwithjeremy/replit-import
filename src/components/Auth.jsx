
import React, { useState } from 'react';
import { authService } from '../services/auth';

const Auth = ({ onAuthChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      onAuthChange(user);
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInAsAdmin();
      onAuthChange(user);
    } catch (error) {
      console.error('Admin sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Team Tenacious Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-black rounded-lg flex items-center justify-center">
            <div className="text-white font-bold text-xl">TT</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rep Tracker</h2>
          <p className="text-gray-600">Your ultimate partner in rep performance management.</p>
        </div>

        {/* Sign In Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="text-center text-gray-500">Or</div>

          {/* Demo Access Buttons */}
          <button
            onClick={handleAdminSignIn}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Demo as Admin
          </button>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center text-sm text-gray-500">
          By tapping continue, you accept our{' '}
          <a href="#" className="text-indigo-600 hover:underline">Terms & Conditions</a>
          {' '}and{' '}
          <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
