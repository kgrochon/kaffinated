import React, { createContext, useContext, useState, type ReactNode } from 'react';

import { TRIP } from '../data/tripData';
import type { TripConfig, TripDay } from '../types/types';

interface TripContextType {
  tripConfig: TripConfig;
  selectedDay: TripDay | null;
  setSelectedDay: (day: TripDay | null) => void;
  highlightedSegment: [number, number] | null;
  setHighlightedSegment: (segment: [number, number] | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState<TripDay | null>(null);
  const [highlightedSegment, setHighlightedSegment] = useState<[number, number] | null>(null);

  return (
    <TripContext.Provider
      value={{
        tripConfig: TRIP,
        selectedDay,
        setSelectedDay,
        highlightedSegment,
        setHighlightedSegment,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
