import React, { useState } from 'react';
import type { Complaint } from '../../types';
import { CameraIcon } from '../../components/icons/CameraIcon';
import { MapPinIcon } from '../../components/icons/MapPinIcon';

interface ReportIssuePageProps {
  onSubmit: (newComplaint: Omit<Complaint, 'id' | 'timestamp' | 'reporter' | 'status'>) => void;
}

const ReportIssuePage: React.FC<ReportIssuePageProps> = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      // In this new UI, location is handled by the parent component
      onSubmit({
        description,
        // The location will be added by the App component
        location: { latitude: 0, longitude: 0 }, 
        imageUrl: imagePreview || undefined,
      });
      setDescription('');
      setImagePreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Issue Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Attach a Photo (Optional)</label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover" />
            ) : (
                <CameraIcon className="mx-auto h-10 w-10 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={!description.trim()}
          className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          Submit Report
        </button>
      </div>
    </form>
  );
};

export default ReportIssuePage;