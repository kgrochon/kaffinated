import { TripProvider } from './context/TripContext';
import { MapView } from './components/MapView/MapView';
import { ItineraryPanel } from './components/Itinerary/ItineraryPanel';
import './up.css';
import 'leaflet/dist/leaflet.css';

export const UPTrip = () => {
  return (
    <TripProvider>
      <div className="up-trip-container">
        {/* Desktop layout - side by side */}
        <div className="hidden lg:flex h-screen w-full">
          <div className="w-2/3 h-full">
            <MapView />
          </div>
          <div className="w-1/3 h-full">
            <ItineraryPanel />
          </div>
        </div>

        {/* Tablet layout - map on top, itinerary below */}
        <div className="hidden md:flex lg:hidden flex-col h-screen w-full">
          <div className="h-[60vh] w-full">
            <MapView />
          </div>
          <div className="h-[40vh] w-full overflow-y-auto">
            <ItineraryPanel />
          </div>
        </div>

        {/* Mobile layout - stacked vertically */}
        <div className="flex md:hidden flex-col h-screen w-full">
          <div className="h-[50vh] w-full">
            <MapView />
          </div>
          <div className="h-[50vh] w-full overflow-y-auto">
            <ItineraryPanel />
          </div>
        </div>
      </div>
    </TripProvider>
  );
};
