import React from 'react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (role: 'citizen' | 'admin') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4 p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Select Your Role</h2>
        <p className="text-slate-500 mb-8">
          Choose a role to explore the application's features from different perspectives.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => onLogin('citizen')}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            I am a Citizen
          </button>
          <button
            onClick={() => onLogin('admin')}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            I am an Admin
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-8 text-sm text-slate-500 hover:underline"
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
};
