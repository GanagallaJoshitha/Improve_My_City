import React from 'react';
import type { Complaint } from '../types';
import { InfoWindow as GoogleInfoWindow } from '@vis.gl/react-google-maps';

interface InfoWindowProps {
  complaint: Complaint | null;
  onClose: () => void;
}

const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

export const InfoWindow: React.FC<InfoWindowProps> = ({ complaint, onClose }) => {
  if (!complaint) return null;

  return (
    <GoogleInfoWindow
      position={{ lat: complaint.location.latitude, lng: complaint.location.longitude }}
      onCloseClick={onClose}
      pixelOffset={[0, -40]}
    >
      <div className="p-2 rounded-lg bg-white shadow-lg max-w-xs text-slate-800">
        {complaint.imageUrl && (
            <img src={complaint.imageUrl} alt={complaint.description} className="w-full h-24 object-cover rounded-t-md mb-2"/>
        )}
        <div className="px-1 pb-1">
            <div className="flex justify-between items-start">
                <p className="text-sm font-semibold pr-2">{complaint.description}</p>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[complaint.status]}`}>
                    {complaint.status}
                </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Reported by: {complaint.reporter.name}</p>
        </div>
      </div>
    </GoogleInfoWindow>
  );
};
