import { useTrip } from '../../context/TripContext';
import { DayCard } from './DayCard';
import { TripSummary } from './TripSummary';

export const ItineraryPanel = () => {
  const { tripConfig } = useTrip();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <TripSummary />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tripConfig.days.map(day => (
          <DayCard key={day.dayNumber} day={day} />
        ))}
      </div>
    </div>
  );
};
