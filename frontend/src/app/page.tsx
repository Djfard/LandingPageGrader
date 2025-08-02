'use client';

import { useState } from 'react';
import { analyzeContent, AnalyzeResponse } from '../../utils/api';

export default function Home() {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = inputType === 'url' 
        ? { url: url.trim() }
        : { raw_text: rawText.trim() };

      const response = await analyzeContent(data);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = inputType === 'url' 
    ? url.trim().length > 0 
    : rawText.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Landing Page Clarity Grader
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Get AI-powered insights on how clear your landing page is to first-time visitors
          </p>
        </div>

        <div className="mt-12 bg-white shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Type Toggle */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setInputType('url')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    inputType === 'url'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('text')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    inputType === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Raw Text
                </button>
              </div>

              {/* URL Input */}
              {inputType === 'url' && (
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    Landing Page URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Raw Text Input */}
              {inputType === 'text' && (
                <div>
                  <label htmlFor="rawText" className="block text-sm font-medium text-gray-700">
                    Landing Page Copy
                  </label>
                  <textarea
                    id="rawText"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={8}
                    placeholder="Paste your landing page copy here..."
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Grade My Landing Page'}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Display */}
            {results && (
              <div className="mt-8 space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">What it is</h3>
                        <p className="text-gray-700">{results.what_it_is}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">Who it's for</h3>
                        <p className="text-gray-700">{results.who_it_is_for}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">Value proposition</h3>
                        <p className="text-gray-700">{results.value_prop}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Clarity Scores</h3>
                      <div className="space-y-3">
                        {Object.entries(results.scores).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(value / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {value}/5
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
