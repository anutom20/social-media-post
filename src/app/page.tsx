'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { PostInputs, GeneratedPost } from '@/types/interfaces';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);

  const handleSubmit = async (inputs: PostInputs) => {
    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('vendorImage', inputs.vendorImage as File);
      formData.append('logo', inputs.logo as File);
      formData.append('tone', inputs.tone);
      formData.append('postText', inputs.postText);
      formData.append('brandColors', JSON.stringify(inputs.brandColors));

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        alert(data.error || 'Failed to generate post');
      }
    } catch (error) {
      console.error('Error generating post:', error);
      alert('Failed to generate post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Social Media Post Generator
          </h1>
          <p className="text-gray-600">
            Create branded social media content with AI
          </p>
        </div>

        <div className="space-y-8">
          <UploadForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ResultsDisplay result={result} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
