'use client';

import { useState } from 'react';
import { PostInputs, UploadFormProps, TONE_OPTIONS } from '@/types/interfaces';

export default function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [vendorImage, setVendorImage] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [tone, setTone] = useState<string>('Professional');
  const [postText, setPostText] = useState<string>('');
  const [vendorImagePreview, setVendorImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [brandColors, setBrandColors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vendorImage || !logo || !postText.trim()) {
      alert('Please provide a vendor image, logo, and post text');
      return;
    }

    const inputs: PostInputs = {
      vendorImage,
      logo,
      tone,
      postText: postText.trim(),
      brandColors
    };

    onSubmit(inputs);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    previewSetter: (preview: string | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setter(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewSetter(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      previewSetter(null);
    }
  };

  const addBrandColor = (color: string) => {
    if (brandColors.length < 3 && !brandColors.includes(color)) {
      setBrandColors([...brandColors, color]);
    }
  };

  const removeBrandColor = (colorToRemove: string) => {
    setBrandColors(brandColors.filter(color => color !== colorToRemove));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (brandColors.length < 3) {
      addBrandColor(color);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Social Media Post
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vendor Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setVendorImage, setVendorImagePreview)}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       cursor-pointer"
            disabled={isLoading}
          />
          {vendorImage && (
            <p className="mt-1 text-sm text-green-600">
              Selected: {vendorImage.name}
            </p>
          )}
          {vendorImagePreview && (
            <div className="mt-3">
              <img
                src={vendorImagePreview}
                alt="Vendor image preview"
                className="w-full max-w-xs h-32 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLogo, setLogoPreview)}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       cursor-pointer"
            disabled={isLoading}
          />
          {logo && (
            <p className="mt-1 text-sm text-green-600">
              Selected: {logo.name}
            </p>
          )}
          {logoPreview && (
            <div className="mt-3">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Brand Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Colors (up to 3)
          </label>
          
          <div className="space-y-3">
            {/* Color Input */}
            {brandColors.length < 3 && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  onChange={handleColorChange}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">
                  Click to add a brand color ({brandColors.length}/3)
                </span>
              </div>
            )}
            
            {/* Selected Colors Display */}
            {brandColors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {brandColors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border"
                  >
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-sm text-gray-700 font-mono">
                      {color}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBrandColor(color)}
                      className="text-red-500 hover:text-red-700 ml-1"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Select colors that represent your brand identity. These will be used in the generated image.
            </p>
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone of Voice
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500
                       text-gray-900 bg-white"
            disabled={isLoading}
          >
            {TONE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Post Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Text *
          </label>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Enter the content for your social media post..."
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500
                       text-gray-900 placeholder-gray-400"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            {postText.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !vendorImage || !logo || !postText.trim()}
          className="w-full flex justify-center py-3 px-4 border border-transparent
                     rounded-md shadow-sm text-sm font-medium text-white
                     bg-blue-600 hover:bg-blue-700
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Post...
            </div>
          ) : (
            'Generate Post'
          )}
        </button>
      </form>
    </div>
  );
}