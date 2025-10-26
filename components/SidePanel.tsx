import React from 'react';
import type { Complaint, Reporter } from '../types';
import { ComplaintList } from './ComplaintList';
import { CloseIcon } from './icons/CloseIcon';
import { ResolutionModal } from './ResolutionModal';
import { ReporterInfoModal } from './ReporterInfoModal';

interface SidePanelProps {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  onComplaintSelect: (complaint: Complaint | null) => void;
  onClose: () => void;
  onUpdateComplaint: (updatedComplaint: Complaint) => void;
  currentUser: Reporter;
  isOpen: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
    complaints, 
    selectedComplaint, 
    onComplaintSelect, 
    onClose, 
    onUpdateComplaint,
    currentUser,
    isOpen
}) => {
  const [isResolutionModalOpen, setResolutionModalOpen] = React.useState(false);
  const [isReporterModalOpen, setReporterModalOpen] = React.useState(false);

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

  const statusColors: { [key: string]: string } = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Resolved: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <>
        <div className={`absolute top-0 left-0 h-full bg-white shadow-lg z-30 w-full md:w-96 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800">Community Issues</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                    <CloseIcon className="w-6 h-6 text-slate-600" />
                </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4">
                {selectedComplaint ? (
                    <div className="space-y-4">
                        <button onClick={() => onComplaintSelect(null)} className="text-sm text-blue-600 hover:underline mb-2">
                            &larr; Back to list
                        </button>
                        {selectedComplaint.imageUrl && (
                            <img src={selectedComplaint.imageUrl} alt={selectedComplaint.description} className="w-full h-48 object-cover rounded-lg" />
                        )}
                        <div className={`p-3 rounded-md border ${statusColors[selectedComplaint.status]}`}>
                            <p className="font-semibold">{selectedComplaint.status}</p>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">{selectedComplaint.description}</h3>
                        <p className="text-sm text-slate-500">
                            Reported {timeSince(selectedComplaint.timestamp)} by 
                            <button onClick={() => setReporterModalOpen(true)} className="ml-1 font-medium text-blue-600 hover:underline">
                                {selectedComplaint.reporter.name}
                            </button>
                        </p>
                         <p className="text-sm text-slate-500">
                            Location: {selectedComplaint.location.latitude.toFixed(4)}, {selectedComplaint.location.longitude.toFixed(4)}
                        </p>
                        {currentUser.id.startsWith('admin') && (
                            <button 
                                onClick={() => setResolutionModalOpen(true)}
                                className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                            >
                                Update Status
                            </button>
                        )}
                    </div>
                ) : (
                    <ComplaintList 
                        complaints={complaints}
                        onComplaintClick={(c) => onComplaintSelect(c)} 
                        selectedComplaintId={selectedComplaint?.id}
                    />
                )}
            </div>
        </div>
        </div>
        {isResolutionModalOpen && selectedComplaint && (
            <ResolutionModal
                complaint={selectedComplaint}
                onClose={() => setResolutionModalOpen(false)}
                onUpdate={onUpdateComplaint}
            />
        )}
        {isReporterModalOpen && selectedComplaint && (
            <ReporterInfoModal
                reporter={selectedComplaint.reporter}
                onClose={() => setReporterModalOpen(false)}
            />
        )}
    </>
  );
};
