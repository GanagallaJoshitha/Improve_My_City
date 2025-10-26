import React, { useState, useEffect } from 'react';
import MapLayout from './layouts/MapLayout';
import { AdminDashboard } from './components/AdminDashboard';
import type { Complaint, UserLocation, Reporter } from './types';
import { AuthModal } from './components/AuthModal';
import { SwitchUserIcon } from './components/icons/SwitchUserIcon';
import CreateVideoPage from './pages/citizen/CreateVideoPage';
import { VideoIcon } from './components/icons/VideoIcon';
import { MapPinIcon } from './components/icons/MapPinIcon';
import { Chatbot } from './components/Chatbot';

// Mock Data
const CITIZEN_REPORTER: Reporter = { id: 'citizen-123', name: 'Jane Doe', email: 'jane.doe@example.com' };
const ADMIN_REPORTER: Reporter = { id: 'admin-456', name: 'Admin User', email: 'admin@example.com' };

const initialComplaints: Complaint[] = [
  {
    id: '1',
    description: 'Large pothole on Main Street near the library.',
    timestamp: Date.now() - 2 * 86400000, // 2 days ago
    status: 'Pending',
    location: { latitude: 34.052235, longitude: -118.243683 },
    reporter: { id: 'user-1', name: 'John Smith', email: 'john.s@example.com' },
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Pothole'
  },
  {
    id: '2',
    description: 'Broken streetlight at the corner of Oak and 5th.',
    timestamp: Date.now() - 5 * 86400000, // 5 days ago
    status: 'In Progress',
    location: { latitude: 34.055, longitude: -118.245 },
    reporter: { id: 'user-2', name: 'Emily White', email: 'emily.w@example.com' },
  },
   {
    id: '3',
    description: 'Graffiti on the park bench.',
    timestamp: Date.now() - 10 * 86400000, // 10 days ago
    status: 'Resolved',
    location: { latitude: 34.050, longitude: -118.240 },
    reporter: { id: 'user-3', name: 'Michael Brown', email: 'michael.b@example.com' },
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Graffiti'
  }
];

type AppView = 'map' | 'admin_dashboard' | 'create_video';

const App: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [userLocation, setUserLocation] = useState<UserLocation>({ latitude: 34.0522, longitude: -118.2437 });
  const [currentUser, setCurrentUser] = useState<Reporter | null>(null);
  const [view, setView] = useState<AppView>('map');
  const [showAuthModal, setShowAuthModal] = useState(true);

  // Get user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        // Fallback to default location
      }
    );
  }, []);
  
  const handleLogin = (role: 'citizen' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_REPORTER);
      setView('admin_dashboard');
    } else {
      setCurrentUser(CITIZEN_REPORTER);
      setView('map');
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('map');
    setShowAuthModal(true);
  }

  const handleAddComplaint = (newComplaintData: Omit<Complaint, 'id' | 'timestamp' | 'reporter' | 'status'>) => {
    if (!currentUser) {
        alert("Please log in to report an issue.");
        setShowAuthModal(true);
        return;
    }
    const newComplaint: Complaint = {
      ...newComplaintData,
      id: new Date().toISOString(),
      timestamp: Date.now(),
      status: 'Pending',
      reporter: currentUser,
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };
  
  const handleUpdateComplaint = (updatedComplaint: Complaint) => {
    setComplaints(prev => prev.map(c => c.id === updatedComplaint.id ? updatedComplaint : c));
  };
  
  const renderView = () => {
      switch(view) {
          case 'admin_dashboard':
              return <AdminDashboard complaints={complaints} onComplaintClick={() => { /* Navigation to detail page can be added here */}} />;
          case 'create_video':
              return <CreateVideoPage />;
          case 'map':
          default:
              return (
                <MapLayout 
                    complaints={complaints}
                    userLocation={userLocation}
                    onAddComplaint={handleAddComplaint}
                    onUpdateComplaint={handleUpdateComplaint}
                    currentUser={currentUser || CITIZEN_REPORTER} // Pass a guest user if not logged in
                />
              );
      }
  }

  return (
    <div className="h-screen w-screen bg-slate-100 font-sans">
      <header className="absolute top-0 right-0 z-40 p-4 flex items-center space-x-4">
        {currentUser && (
            <button 
                onClick={handleLogout}
                className="bg-white/80 backdrop-blur-sm text-slate-700 font-medium py-2 px-4 rounded-full shadow-md hover:bg-white flex items-center"
            >
                <SwitchUserIcon className="w-5 h-5 mr-2" />
                Switch Role
            </button>
        )}
      </header>

      {renderView()}

      {showAuthModal && !currentUser && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}

      <Chatbot />
    </div>
  );
};

export default App;