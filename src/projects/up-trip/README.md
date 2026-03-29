# Upper Peninsula Trip Planner

An interactive TypeScript React application for visualizing and planning an 8-day road trip through Michigan's Upper Peninsula.

## Features

- **Interactive Map**: Full-screen Leaflet.js map showing the complete route with custom markers
- **Trip Itinerary**: Detailed day-by-day schedule with activities, driving times, and overnight locations
- **Responsive Design**: Optimized layouts for desktop, tablet, and mobile
- **Data-Driven**: Single source of truth in `tripData.ts` for easy schedule modifications
- **Interactive Selection**: Click day cards to highlight route segments on the map

## Project Structure

```
src/projects/up-trip/
├── types/
│   └── index.ts              # TypeScript interfaces
├── data/
│   └── tripData.ts           # Trip data and location registry (SINGLE SOURCE OF TRUTH)
├── context/
│   └── TripContext.tsx       # React Context for state management
├── components/
│   ├── MapView/
│   │   ├── MapView.tsx       # Main map component
│   │   ├── RoutePolyline.tsx # Route line rendering
│   │   └── StopMarker.tsx    # Location markers with popups
│   └── Itinerary/
│       ├── ItineraryPanel.tsx # Sidebar container
│       ├── DayCard.tsx        # Individual day card
│       └── TripSummary.tsx    # Trip statistics header
├── UPTrip.tsx                # Main component with responsive layout
└── up.css                    # Custom styles
```

## Tech Stack

- **TypeScript**: Type-safe code
- **React 18+**: Component-based UI
- **Leaflet.js / react-leaflet**: Interactive maps
- **Tailwind CSS**: Utility-first styling
- **OpenStreetMap**: Free map tiles (no API key required)

## Trip Details

- **Duration**: 8 days (July 4-12, 2026)
- **Total Distance**: 1,575 miles
- **Total Driving Time**: 23.5 hours
- **Route**: Grosse Pointe Park → Tahquamenon Falls → Pictured Rocks → Houghton → Copper Harbor → Porcupine Mountains → Home

## How to Modify the Trip

All trip data is stored in `src/projects/up-trip/data/tripData.ts`. To make changes:

1. **Add a new location**: Add entry to the `LOCATIONS` object with coordinates
2. **Add a day**: Push a new `TripDay` object to the `days` array
3. **Change a stop**: Update the `departure` or `destination` Location references
4. **Add activities**: Add to the `activities` array for any day
5. **Reorder days**: Rearrange entries in the `days` array

The map and itinerary will automatically update when you save the file!

## Usage

The application shows:
- **Map View**: Full route with markers at each overnight location
- **Itinerary Panel**: Scrollable list of all trip days
- **Day Cards**:
  - Blue border when selected
  - Green background for "stay days" (0 miles driven)
  - Click to highlight that day's route segment on the map
- **Marker Popups**: Click map markers to see location details and activities

## Responsive Breakpoints

- **Desktop (1024px+)**: Side-by-side layout (65% map, 35% itinerary)
- **Tablet (768-1023px)**: Stacked layout (60% map top, 40% itinerary bottom)
- **Mobile (<768px)**: 50/50 split vertically

## Future Enhancements

- Weather forecast integration
- Packing list and gear checklist
- Cost tracking
- Photo uploads
- Export to Google Maps / Apple Maps
- Multi-trip support
