import type { TripDay } from '../../types/types';
import { useTrip } from '../../context/TripContext';

interface DayCardProps {
  day: TripDay;
}

export const DayCard = ({ day }: DayCardProps) => {
  const { selectedDay, setSelectedDay } = useTrip();
  const isSelected = selectedDay?.dayNumber === day.dayNumber;
  const isStayDay = day.drivingMiles === 0;

  const handleClick = () => {
    setSelectedDay(isSelected ? null : day);
  };

  return (
    <div
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300'}
        ${isStayDay ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-white'}
      `}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            Day {day.dayNumber} - {day.dayOfWeek}
          </h3>
          <p className="text-sm text-gray-600">{day.date}</p>
        </div>
        {!isStayDay && (
          <div className="text-right text-sm bg-blue-100 px-3 py-1 rounded-full">
            <p className="font-semibold text-blue-900">{day.drivingHours} hrs</p>
            <p className="text-xs text-blue-700">{day.drivingMiles} mi</p>
          </div>
        )}
        {isStayDay && (
          <div className="text-right text-sm bg-green-100 px-3 py-1 rounded-full">
            <p className="font-semibold text-green-900">Stay Day</p>
          </div>
        )}
      </div>

      {/* Route */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-12">From:</span>
          <span className="text-sm font-medium text-gray-900">{day.departure.shortName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-12">To:</span>
          <span className="text-sm font-medium text-gray-900">{day.destination.shortName}</span>
        </div>
      </div>

      {/* Overnight */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Overnight:</span>
          <span className="text-sm text-gray-800">
            {day.overnight.location.name}
            {day.overnight.type === 'campground' && ' ⛺'}
            {day.overnight.type === 'hotel' && ' 🏨'}
            {day.overnight.type === 'home' && ' 🏠'}
          </span>
        </div>
      </div>

      {/* Activities */}
      {day.activities.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Activities:</p>
          <ul className="text-xs space-y-1">
            {day.activities.map(activity => (
              <li key={activity.id} className="ml-2 text-gray-600">
                • {activity.name}
                {activity.estimatedDuration && (
                  <span className="text-gray-400 ml-1">
                    ({Math.floor(activity.estimatedDuration / 60)}h {activity.estimatedDuration % 60}m)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {day.notes && (
        <p className="text-xs text-gray-600 italic mt-2 pt-2 border-t border-gray-100">
          {day.notes}
        </p>
      )}
    </div>
  );
};
