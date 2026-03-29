import { Polyline } from 'react-leaflet';
import { useTrip } from '../../context/TripContext';
import type { LatLngExpression } from 'leaflet';

export const RoutePolyline = () => {
  const { tripConfig, selectedDay } = useTrip();

  // Build the complete route as a series of positions
  const routePositions: LatLngExpression[] = [];

  tripConfig.days.forEach((day, index) => {
    // Add departure point (if first day or different from previous destination)
    if (index === 0) {
      routePositions.push([day.departure.lat, day.departure.lng]);
    }

    // Add destination point
    routePositions.push([day.destination.lat, day.destination.lng]);
  });

  const pathOptions = {
    color: selectedDay ? '#94a3b8' : '#3b82f6',
    weight: 3,
    opacity: 0.7,
    dashArray: selectedDay ? '10, 5' : undefined,
  };

  // If a day is selected, highlight that segment
  if (selectedDay) {
    const selectedPathOptions = {
      color: '#ef4444',
      weight: 4,
      opacity: 0.9,
    };

    return (
      <>
        {/* Main route (dimmed) */}
        <Polyline positions={routePositions} pathOptions={pathOptions} />

        {/* Highlighted segment */}
        <Polyline
          positions={[
            [selectedDay.departure.lat, selectedDay.departure.lng],
            [selectedDay.destination.lat, selectedDay.destination.lng],
          ]}
          pathOptions={selectedPathOptions}
        />
      </>
    );
  }

  return <Polyline positions={routePositions} pathOptions={pathOptions} />;
};
