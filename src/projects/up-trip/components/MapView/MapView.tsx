import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import { useTrip } from '../../context/TripContext';
import { StopMarker } from './StopMarker';
import { RoutePolyline } from './RoutePolyline';
import { useRef } from 'react';

export const MapView = () => {
  const { tripConfig } = useTrip();
  const mapRef = useRef<L.Map | null>(null);

  // Calculate bounds for all locations
  const bounds = new LatLngBounds(
    tripConfig.locations.map(loc => [loc.lat, loc.lng] as [number, number])
  );

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [40, 40] }}
      className="h-full w-full z-0"
      scrollWheelZoom={true}
      ref={mapRef as any}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RoutePolyline />

      {/* Render markers for overnight locations only */}
      {tripConfig.days.map(day => (
        <StopMarker
          key={`marker-${day.dayNumber}`}
          location={day.overnight.location}
          day={day}
        />
      ))}
    </MapContainer>
  );
};
