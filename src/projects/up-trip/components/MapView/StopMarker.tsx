import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import type { Location, TripDay } from '../../types/types';

interface StopMarkerProps {
  location: Location;
  day: TripDay;
}

export const StopMarker = ({ location, day }: StopMarkerProps) => {
  // Create custom icon based on location type
  const iconHtml =
    location.type === 'campground'
      ? '⛺'
      : location.type === 'hotel'
      ? '🏨'
      : location.type === 'home'
      ? '🏠'
      : '📍';

  const customIcon = divIcon({
    html: `<div class="text-2xl">${iconHtml}</div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <Marker position={[location.lat, location.lng]} icon={customIcon}>
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-lg mb-1">{location.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{location.description}</p>

          <div className="border-t pt-2 mt-2">
            <p className="text-sm font-semibold">
              Day {day.dayNumber} - {day.dayOfWeek}
            </p>
            <p className="text-xs text-gray-500">{day.date}</p>

            {day.activities.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold mb-1">Activities:</p>
                <ul className="text-xs space-y-1">
                  {day.activities.map(activity => (
                    <li key={activity.id} className="ml-2">
                      • {activity.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {day.overnight.notes && (
              <p className="text-xs text-gray-600 mt-2 italic">
                {day.overnight.notes}
              </p>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
