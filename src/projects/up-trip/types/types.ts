// Core location interface
export interface Location {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  type: 'home' | 'campground' | 'hotel' | 'attraction' | 'city';
  description?: string;
  website?: string;
  phone?: string;
  reservationConfirmed?: boolean;
}

// Day of week type
export type DayOfWeek = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

// Activity interface
export interface Activity {
  id: string;
  name: string;
  location: Location;
  category: 'hike' | 'tour' | 'water' | 'food' | 'scenic' | 'other';
  estimatedDuration?: number; // minutes
  cost?: number;
  booked?: boolean;
  url?: string;
  notes?: string;
}

// Overnight stop interface
export interface OvernightStop {
  location: Location;
  type: 'campground' | 'hotel' | 'bnb' | 'home';
  reservationId?: string;
  checkIn?: string;
  checkOut?: string;
  cost?: number;
  notes?: string;
}

// Trip day interface
export interface TripDay {
  dayNumber: number;
  dayOfWeek: DayOfWeek;
  date: string; // ISO date
  departure: Location;
  destination: Location;
  drivingHours: number;
  drivingMiles: number;
  overnight: OvernightStop;
  activities: Activity[];
  notes: string;
  routeWaypoints?: [number, number][];
}

// Main trip configuration
export interface TripConfig {
  tripName: string;
  startDate: string;
  endDate: string;
  participants: string[];
  days: TripDay[];
  locations: Location[];
  totalMiles: number;
  totalDrivingHours: number;
}
