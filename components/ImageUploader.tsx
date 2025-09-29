
import React from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  previewUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, previewUrl, onFileChange }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md h-48 bg-gray-800/50 hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105">
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="mx-auto h-40 max-w-full object-contain rounded-md" />
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-400">
                <label htmlFor={id} className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-indigo-500 px-1">
                  <span>ارفع ملف</span>
                  <input id={id} name={id} type="file" className="sr-only" accept="image/*" onChange={onFileChange} />
                </label>
                <p className="ps-1">أو اسحبه وأفلته هنا</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
