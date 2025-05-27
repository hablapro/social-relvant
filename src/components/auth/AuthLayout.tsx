import React from 'react';
import { useAuth } from './useAuth';
import LoginForm from './LoginForm';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import Header from '../Header';

export default function AuthLayout({ children }: { children?: React.ReactNode }) {
  const { user, loading, error } = useAuth();

  // Show loading spinner only for initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing application...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we set up your session</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
              <p className="mt-1 text-sm text-red-700">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Retry Connection
              </button>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}