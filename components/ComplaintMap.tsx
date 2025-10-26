import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Complaint, UserLocation } from '../types';
import { MapPinIcon } from './icons/MapPinIcon'; // A fallback icon

interface ComplaintMapProps {
  complaints: Complaint[];
  userLocation: UserLocation;
  selectedComplaintId: string | null;
  onMarkerClick: (complaint: Complaint) => void;
  onMapClick: () => void;
  mapCenter: UserLocation;
}

const statusColors: { [key in Complaint['status']]: string } = {
  Pending: '#f59e0b', // amber-500
  'In Progress': '#3b82f6', // blue-500
  Resolved: '#22c55e', // green-500
};


export const ComplaintMap: React.FC<ComplaintMapProps> = ({ complaints, userLocation, selectedComplaintId, onMarkerClick, onMapClick, mapCenter }) => {
  const mapId = process.env.REACT_APP_GOOGLE_MAPS_ID || 'DEMO_MAP_ID';
  
  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 text-center p-4">
        <div>
          <MapPinIcon className="w-8 h-8 mr-2 mx-auto"/>
          <p>Map requires a Google Maps API Key.</p>
          <p className="text-xs mt-1">Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} >
        <Map
          center={{ lat: mapCenter.latitude, lng: mapCenter.longitude }}
          zoom={14}
          mapId={mapId}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onClick={onMapClick}
          className="w-full h-full"
        >
          {complaints.map((complaint) => (
            <AdvancedMarker
              key={complaint.id}
              position={{ lat: complaint.location.latitude, lng: complaint.location.longitude }}
              onClick={() => onMarkerClick(complaint)}
            >
              <Pin 
                background={statusColors[complaint.status]}
                borderColor={selectedComplaintId === complaint.id ? '#1e293b' : '#ffffff'}
                glyphColor={'#ffffff'}
                scale={selectedComplaintId === complaint.id ? 1.5 : 1}
              />
            </AdvancedMarker>
          ))}

          {/* User Location Marker */}
          <AdvancedMarker position={{ lat: userLocation.latitude, lng: userLocation.longitude }}>
             <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-white"></span>
            </span>
          </AdvancedMarker>

        </Map>
      </APIProvider>
    </div>
  );
};
