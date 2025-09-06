'use client';

import { useState } from 'react';
import { ResultsDisplayProps } from '@/types/interfaces';

export default function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  const [imageError, setImageError] = useState(false);

  const handleCopyText = async () => {
    if (!result?.text) return;
    
    try {
      await navigator.clipboard.writeText(result.text);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Failed to copy text');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Generating Your Post
          </h3>
          <p className="text-gray-600">
            Please wait while we create your branded social media content...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📱</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Post Generated Yet
          </h3>
          <p className="text-gray-600">
            Upload your images and fill out the form above to generate your social media post.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Generated Social Media Post
      </h2>

      {/* Generated Image */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Image</h3>
        
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          {result.image && !imageError ? (
            <img
              src={result.image}
              alt="Generated social media post"
              className="w-full h-auto rounded-lg shadow-sm"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-200 rounded-lg">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-2">🖼️</div>
                <p className="text-gray-600">
                  {imageError ? 'Failed to load image' : 'Image not available'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated Text */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Generated Text</h3>
          <button
            onClick={handleCopyText}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       transition-colors duration-200"
          >
            Copy Text
          </button>
        </div>
        
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          {result.text ? (
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {result.text}
            </p>
          ) : (
            <p className="text-gray-500 italic">No text generated</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:ring-offset-2 transition-colors duration-200"
        >
          Generate Another Post
        </button>
      </div>
    </div>
  );
}