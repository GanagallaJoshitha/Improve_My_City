import React from 'react';
import { VideoGenerator } from '../../components/VideoGenerator';

const CreateVideoPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 bg-slate-50 h-full">
      <header className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Create a Video with AI</h1>
        <p className="mt-2 text-slate-600">
          Use our AI-powered tool to generate a short video from a text description. 
          This can be used to visualize a reported issue or for any creative purpose.
        </p>
      </header>
      <VideoGenerator />
    </div>
  );
};

export default CreateVideoPage;
