export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface Reporter {
    id: string;
    name: string;
    email: string;
}

export interface Complaint {
  id: string;
  description: string;
  timestamp: number;
  status: 'Pending' | 'In Progress' | 'Resolved';
  location: UserLocation;
  reporter: Reporter;
  imageUrl?: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot' | 'error';
  text: string;
}