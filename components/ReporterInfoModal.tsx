import React from 'react';
import type { Reporter } from '../types';
import { UserIcon } from './icons/UserIcon';
import { EmailIcon } from './icons/EmailIcon';

interface ReporterInfoModalProps {
  reporter: Reporter;
  onClose: () => void;
}

export const ReporterInfoModal: React.FC<ReporterInfoModalProps> = ({ reporter, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Reporter Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <UserIcon className="w-6 h-6 text-slate-500 mr-3" />
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium text-slate-800">{reporter.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <EmailIcon className="w-6 h-6 text-slate-500 mr-3" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{reporter.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 sm:px-6 flex justify-end rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
