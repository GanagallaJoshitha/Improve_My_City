import React, { useState } from 'react';
import { generateVideoFromPrompt } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { VideoIcon } from './icons/VideoIcon';

// As per guidelines, check for API key selection for Veo models.
// These window.aistudio functions are assumed to exist in the environment.
// FIX: Defined the AIStudio type to resolve a global type conflict for window.aistudio.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}

export const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyChecked, setApiKeyChecked] = useState(false);

  const checkAndSetApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Assume key is selected after dialog closes to handle race condition.
      }
    }
    setApiKeyChecked(true); // Mark as checked even if aistudio is not present for local dev
  };
  
  const handleGenerateVideo = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      // Ensure API key is selected before making the call
      await checkAndSetApiKey();
      
      const url = await generateVideoFromPrompt(prompt);
      setVideoUrl(url);
    } catch (e) {
      const err = e as Error;
      if (err.message.includes("Requested entity was not found")) {
        setError("API Key error. Please select your API key again.");
        // Reset key selection state
        setApiKeyChecked(false); 
      } else {
        setError(err.message || 'An unknown error occurred during video generation.');
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySelect = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setApiKeyChecked(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <VideoIcon className="w-6 h-6 mr-2" />
        AI Video Generator
      </h2>
      
      {!apiKeyChecked && window.aistudio ? (
          <div className="text-center p-4 border border-blue-200 bg-blue-50 rounded-md">
              <p className="text-slate-700 mb-3">To generate videos with Veo, you need to select an API key.</p>
              <p className="text-xs text-slate-500 mb-4">
                  For information about billing, please see the{' '}
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      billing documentation
                  </a>.
              </p>
              <button
                  onClick={handleApiKeySelect}
                  className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
              >
                  Select API Key
              </button>
          </div>
      ) : (
        <>
            <div className="relative">
                <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create, e.g., 'A neon hologram of a cat driving at top speed'"
                className="w-full p-3 pr-28 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                disabled={isLoading}
                />
                <button
                onClick={handleGenerateVideo}
                disabled={isLoading || !prompt.trim()}
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900 disabled:bg-slate-400 flex items-center"
                >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
    
            {error && <p className="text-red-600 mt-4">{error}</p>}
    
            {isLoading && (
                <div className="mt-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
                <p className="mt-4 text-slate-600">Generating your video... This can take a few minutes.</p>
                <p className="text-sm text-slate-500">This is a great time to grab a coffee! ☕️</p>
                </div>
            )}
    
            {videoUrl && !isLoading && (
                <div className="mt-6">
                <h3 className="text-lg font-medium text-slate-800 mb-2">Your Video is Ready!</h3>
                <video controls src={videoUrl} className="w-full rounded-lg shadow-inner" />
                </div>
            )}
        </>
      )}

    </div>
  );
};