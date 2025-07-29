import React from 'react';
import { Database, AlertCircle, ExternalLink } from 'lucide-react';

export default function SupabaseSetup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Database className="mx-auto h-16 w-16 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Supabase Configuration Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your application needs to be connected to Supabase to function properly.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Missing Environment Variables</h3>
              <p className="mt-1 text-sm text-blue-700">
                The following environment variables are required:
              </p>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                <li><code className="bg-blue-100 px-1 rounded">VITE_SUPABASE_URL</code></li>
                <li><code className="bg-blue-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
            <li>
              Create a new Supabase project at{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                supabase.com
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </li>
            <li>Go to your project settings → API</li>
            <li>Copy your Project URL and anon public key</li>
            <li>Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in your project root:</li>
          </ol>
          
          <div className="mt-4 bg-gray-100 rounded p-3 text-sm">
            <pre className="whitespace-pre-wrap text-gray-800">
{`VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
            </pre>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            After adding the environment variables, restart your development server.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Check Configuration Again
          </button>
        </div>
      </div>
    </div>
  );
}