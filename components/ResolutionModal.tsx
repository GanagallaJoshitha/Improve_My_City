import React, { useState } from 'react';
import type { Complaint } from '../types';

interface ResolutionModalProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdate: (updatedComplaint: Complaint) => void;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({ complaint, onClose, onUpdate }) => {
  const [status, setStatus] = useState<Complaint['status']>(complaint.status);

  const handleUpdate = () => {
    onUpdate({ ...complaint, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-800">Update Issue Status</h2>
          <p className="text-sm text-slate-600 mt-1 truncate">
            Issue: <span className="font-medium">{complaint.description}</span>
          </p>

          <div className="mt-4">
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value as Complaint['status'])}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            onClick={handleUpdate}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-800 text-base font-medium text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Update Status
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
