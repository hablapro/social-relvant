import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface SearchErrorProps {
  message: string;
}

export default function SearchError({ message }: SearchErrorProps) {
  const isPermissionError = message.toLowerCase().includes('permission') || 
                           message.toLowerCase().includes('business account');

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Search Error</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{message}</p>
            {isPermissionError && (
              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                <div className="flex items-center">
                  <Info className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-xs font-medium text-blue-800">Important Note</span>
                </div>
                <div className="mt-1 text-xs text-blue-700">
                  <span>To analyze Instagram profiles, you need:</span>
                  <ul className="list-disc ml-4 mt-1">
                    <li>A Business or Creator Instagram account</li>
                    <li>Proper API access permissions</li>
                    <li>The target profile must also be a Business account</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}