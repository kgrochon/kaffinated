import { useTrip } from '../../context/TripContext';

export const TripSummary = () => {
  const { tripConfig } = useTrip();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-3">{tripConfig.tripName}</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="opacity-90">Duration</p>
          <p className="font-semibold text-lg">{tripConfig.days.length} days</p>
        </div>
        <div>
          <p className="opacity-90">Total Miles</p>
          <p className="font-semibold text-lg">{tripConfig.totalMiles.toLocaleString()}</p>
        </div>
        <div>
          <p className="opacity-90">Driving Hours</p>
          <p className="font-semibold text-lg">{tripConfig.totalDrivingHours}</p>
        </div>
        <div>
          <p className="opacity-90">Travelers</p>
          <p className="font-semibold text-lg">{tripConfig.participants.length}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-400 text-xs opacity-90">
        <p>{tripConfig.startDate} → {tripConfig.endDate}</p>
      </div>
    </div>
  );
};
