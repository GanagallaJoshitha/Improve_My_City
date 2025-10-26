import React from 'react';
import type { Complaint } from '../types';

interface ComplaintListProps {
  complaints: Complaint[];
  onComplaintClick?: (complaint: Complaint) => void;
  // FIX: Added optional `selectedComplaintId` to highlight the selected item.
  selectedComplaintId?: string | null;
}

const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

export const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onComplaintClick, selectedComplaintId }) => {
  if (complaints.length === 0) {
    return <p className="text-slate-500 text-center mt-4">No complaints to display.</p>;
  }

  const timeSince = (date: number) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  return (
    <ul className="space-y-3">
      {complaints.map((complaint) => (
        <li
          key={complaint.id}
          onClick={() => onComplaintClick?.(complaint)}
          // FIX: Added conditional styling to highlight the selected complaint.
          className={`p-3 rounded-lg border ${
            selectedComplaintId === complaint.id
              ? 'bg-blue-50 border-blue-200'
              : 'border-slate-200'
          } ${onComplaintClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 truncate pr-2">{complaint.description}</p>
              <p className="text-xs text-slate-500">{timeSince(complaint.timestamp)}</p>
            </div>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[complaint.status]}`}>
              {complaint.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};