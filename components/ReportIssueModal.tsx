import React, { useState } from 'react';
import type { Complaint, UserLocation } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { CameraIcon } from './icons/CameraIcon';

interface ReportIssueModalProps {
  userLocation: UserLocation;
  onClose: () => void;
  onSubmit: (newComplaint: Omit<Complaint, 'id' | 'timestamp' | 'reporter' | 'status'>) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ userLocation, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];

    if (file) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        setImageError('File is too large. Maximum size is 10MB.');
        setImagePreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      // FIX: Corrected typo in FileReader method name from readDataURL to readAsDataURL.
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !imageError) {
      setIsSubmitting(true);
      // Simulate network delay for a better user experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmit({
        description,
        location: userLocation,
        imageUrl: imagePreview || undefined,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-800">Report a New Issue</h2>
            <p className="text-sm text-slate-500">Provide details about the issue you've observed.</p>
            
            <fieldset disabled={isSubmitting}>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-50"
                  placeholder="e.g., A large pothole is causing traffic issues..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Attach a Photo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                    ) : (
                      <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                    )}
                    <div className="flex text-sm text-slate-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {imageError && (
                    <p className="mt-2 text-sm text-red-600">{imageError}</p>
                )}
              </div>
            </fieldset>

            <div className="mt-4 flex items-center text-sm text-slate-600">
              <MapPinIcon className="w-5 h-5 mr-2 text-slate-400" />
              <span>Location will be recorded as: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</span>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="submit"
              disabled={!description.trim() || !!imageError || isSubmitting}
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-800 text-base font-medium text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-slate-400 disabled:cursor-wait"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};