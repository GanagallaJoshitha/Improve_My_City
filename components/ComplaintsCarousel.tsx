import React, { useRef, useEffect } from 'react';
import type { Complaint } from '../types';

interface ComplaintsCarouselProps {
  complaints: Complaint[];
  selectedComplaintId: string | null;
  onComplaintSelect: (complaint: Complaint | null) => void;
}

export const ComplaintsCarousel: React.FC<ComplaintsCarouselProps> = ({ complaints, selectedComplaintId, onComplaintSelect }) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (selectedComplaintId) {
        const cardElement = document.getElementById(`carousel-card-${selectedComplaintId}`);
        cardElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedComplaintId]);

  if (complaints.length === 0) return null;

  const statusColors: { [key: string]: string } = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Resolved: 'bg-green-100 text-green-800',
  };
  
  const timeSince = (date: number) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  }

  return (
    <div className="absolute bottom-0 left-0 w-full z-20 p-4">
      <ul ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {complaints.map(complaint => (
          <li
            key={complaint.id}
            id={`carousel-card-${complaint.id}`}
            onClick={() => onComplaintSelect(complaint)}
            className={`flex-shrink-0 w-64 p-3 rounded-lg border-2 snap-center cursor-pointer transition-all duration-200 ${selectedComplaintId === complaint.id ? 'bg-white border-blue-500 shadow-lg' : 'bg-white/80 backdrop-blur-sm border-transparent'}`}
          >
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-slate-800 truncate pr-2 flex-1">{complaint.description}</p>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[complaint.status]}`}>
                    {complaint.status}
                </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{timeSince(complaint.timestamp)} by {complaint.reporter.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// CSS for hiding scrollbar if not using a utility like tailwind-scrollbar-hide
const style = document.createElement('style');
style.innerHTML = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);
