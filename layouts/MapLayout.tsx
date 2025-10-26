import React, { useState, useEffect } from 'react';
import { ComplaintMap } from '../components/ComplaintMap';
import type { Complaint, Reporter, UserLocation } from '../types';
import { SidePanel } from '../components/SidePanel';
import { ComplaintsCarousel } from '../components/ComplaintsCarousel';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ReportIssueModal } from '../components/ReportIssueModal';
import { MenuIcon } from '../components/icons/MenuIcon';

// Hook implementation inside the component file as we cannot add new files.
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

interface MapLayoutProps {
  complaints: Complaint[];
  userLocation: UserLocation;
  onAddComplaint: (newComplaintData: Omit<Complaint, 'id' | 'timestamp' | 'reporter' | 'status'>) => void;
  onUpdateComplaint: (updatedComplaint: Complaint) => void;
  currentUser: Reporter;
}

const MapLayout: React.FC<MapLayoutProps> = ({ 
    complaints, 
    userLocation, 
    onAddComplaint, 
    onUpdateComplaint,
    currentUser
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isPanelOpen, setPanelOpen] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<UserLocation>(userLocation);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  useEffect(() => {
      setPanelOpen(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (selectedComplaint) {
        setMapCenter(selectedComplaint.location);
    } else {
        setMapCenter(userLocation);
    }
  }, [selectedComplaint, userLocation]);

  const handleSelectComplaint = (complaint: Complaint | null) => {
    setSelectedComplaint(complaint);
    if (complaint && isDesktop) {
        setPanelOpen(true);
    }
  };
  
  const handleMapClick = () => {
    if(!isDesktop) {
      setSelectedComplaint(null);
    }
  };
  
  const handlePanelClose = () => {
    setPanelOpen(false);
    setSelectedComplaint(null);
  };

  const handleAddComplaint = (newComplaintData: Omit<Complaint, 'id' | 'timestamp' | 'reporter' | 'status'>) => {
    onAddComplaint(newComplaintData);
    setModalOpen(false);
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
        <SidePanel 
            complaints={complaints}
            selectedComplaint={selectedComplaint}
            onComplaintSelect={handleSelectComplaint}
            onClose={handlePanelClose}
            onUpdateComplaint={onUpdateComplaint}
            currentUser={currentUser}
            isOpen={isPanelOpen}
        />
        
        {!isDesktop && !isPanelOpen && (
            <button
            onClick={() => setPanelOpen(true)}
            className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-lg"
            >
            <MenuIcon className="w-6 h-6" />
            </button>
        )}
      
      <main className="w-full h-full">
        <ComplaintMap 
            complaints={complaints}
            userLocation={userLocation}
            selectedComplaintId={selectedComplaint?.id || null}
            onMarkerClick={handleSelectComplaint}
            onMapClick={handleMapClick}
            mapCenter={mapCenter}
        />
      </main>

      {!isDesktop && (
        <ComplaintsCarousel 
            complaints={complaints}
            selectedComplaintId={selectedComplaint?.id || null}
            onComplaintSelect={handleSelectComplaint}
        />
      )}
      
      <FloatingActionButton onClick={() => setModalOpen(true)} label="Report a new issue">
        <PlusIcon className="w-6 h-6" />
      </FloatingActionButton>
      
      {isModalOpen && (
        <ReportIssueModal 
            userLocation={userLocation}
            onClose={() => setModalOpen(false)}
            onSubmit={handleAddComplaint}
        />
      )}
    </div>
  );
};

export default MapLayout;
