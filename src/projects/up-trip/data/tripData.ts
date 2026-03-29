import type { TripConfig, Location } from '../types/types';

// ── Location Registry ──
export const LOCATIONS: Record<string, Location> = {
  home: {
    id: 'home',
    name: 'Grosse Pointe Park',
    shortName: 'HOME',
    lat: 42.3756,
    lng: -82.9346,
    type: 'home',
    description: 'Start / End point',
  },
  tahquamenonFalls: {
    id: 'tahquamenon-falls',
    name: 'Tahquamenon Falls State Park',
    shortName: 'T.FALLS',
    lat: 46.5958,
    lng: -85.1518,
    type: 'campground',
    description: 'Upper & Lower Falls',
    website: 'https://www2.dnr.state.mi.us/parksandtrails/Details.aspx?id=428',
  },
  picturedRocks: {
    id: 'pictured-rocks',
    name: 'Pictured Rocks National Lakeshore',
    shortName: 'P.ROCKS',
    lat: 46.5575,
    lng: -86.3500,
    type: 'campground',
    description: 'Kayak + boat tours',
  },
  marquette: {
    id: 'marquette',
    name: 'Marquette',
    shortName: 'MQT',
    lat: 46.5436,
    lng: -87.3954,
    type: 'city',
    description: 'Mining tour stop',
  },
  houghton: {
    id: 'houghton',
    name: 'Houghton',
    shortName: 'HOU',
    lat: 47.1211,
    lng: -88.5694,
    type: 'hotel',
    description: 'Hotel or BnB',
  },
  copperHarbor: {
    id: 'copper-harbor',
    name: 'Copper Harbor',
    shortName: 'C.HARBOR',
    lat: 47.4683,
    lng: -87.8903,
    type: 'campground',
    description: 'End of Keweenaw Peninsula',
  },
  porcupineMountains: {
    id: 'porcupine-mountains',
    name: 'Porcupine Mountains State Park',
    shortName: 'PORKIES',
    lat: 46.7558,
    lng: -89.7960,
    type: 'campground',
    description: 'Trails + Lake of the Clouds',
  },
};

// ── Trip Configuration ──
export const TRIP: TripConfig = {
  tripName: 'Upper Peninsula Road Trip 2026',
  startDate: '2026-07-04',
  endDate: '2026-07-12',
  participants: ['Katherine', 'Family'],
  locations: Object.values(LOCATIONS),
  totalMiles: 1575,
  totalDrivingHours: 23.5,
  days: [
    // Day 5 - Saturday
    {
      dayNumber: 5,
      dayOfWeek: 'Sat',
      date: '2026-07-05',
      departure: LOCATIONS.home,
      destination: LOCATIONS.tahquamenonFalls,
      drivingHours: 5.5,
      drivingMiles: 360,
      overnight: {
        location: LOCATIONS.tahquamenonFalls,
        type: 'campground',
        notes: 'T.Falls State Park Campground — reserve early',
      },
      activities: [
        {
          id: 'tf-upper',
          name: 'Upper Falls Viewing',
          location: LOCATIONS.tahquamenonFalls,
          category: 'scenic',
          estimatedDuration: 90,
        },
        {
          id: 'tf-lower',
          name: 'Lower Falls Trail',
          location: LOCATIONS.tahquamenonFalls,
          category: 'hike',
          estimatedDuration: 120,
        },
      ],
      notes: 'Depart early / Explore falls / Camp at T.Falls St. Park',
    },

    // Day 6 - Sunday
    {
      dayNumber: 6,
      dayOfWeek: 'Sun',
      date: '2026-07-06',
      departure: LOCATIONS.tahquamenonFalls,
      destination: LOCATIONS.picturedRocks,
      drivingHours: 1.5,
      drivingMiles: 90,
      overnight: {
        location: LOCATIONS.picturedRocks,
        type: 'campground',
        notes: 'Pictured Rocks Campground',
      },
      activities: [
        {
          id: 'pr-setup',
          name: 'Setup camp and explore area',
          location: LOCATIONS.picturedRocks,
          category: 'other',
          estimatedDuration: 120,
        },
      ],
      notes: 'Leave falls anytime / Camp near Pictured Rocks',
    },

    // Day 7 - Monday (Stay Day)
    {
      dayNumber: 7,
      dayOfWeek: 'Mon',
      date: '2026-07-07',
      departure: LOCATIONS.picturedRocks,
      destination: LOCATIONS.picturedRocks,
      drivingHours: 0,
      drivingMiles: 0,
      overnight: {
        location: LOCATIONS.picturedRocks,
        type: 'campground',
        notes: 'Pictured Rocks Campground',
      },
      activities: [
        {
          id: 'pr-kayak',
          name: 'Kayak Tour',
          location: LOCATIONS.picturedRocks,
          category: 'water',
          estimatedDuration: 180,
          notes: 'Book in advance',
        },
        {
          id: 'pr-boat',
          name: 'Boat Tour (alternative)',
          location: LOCATIONS.picturedRocks,
          category: 'tour',
          estimatedDuration: 120,
        },
      ],
      notes: 'Full day at Pictured Rocks / Excursions (kayak/boat tour)',
    },

    // Day 8 - Tuesday
    {
      dayNumber: 8,
      dayOfWeek: 'Tue',
      date: '2026-07-08',
      departure: LOCATIONS.picturedRocks,
      destination: LOCATIONS.houghton,
      drivingHours: 2.5,
      drivingMiles: 150,
      overnight: {
        location: LOCATIONS.houghton,
        type: 'hotel',
        notes: 'Houghton Hotel/BnB',
      },
      activities: [
        {
          id: 'mqt-mining',
          name: 'Mining tour in Marquette',
          location: LOCATIONS.marquette,
          category: 'tour',
          estimatedDuration: 90,
          notes: 'Stop in Marquette on the way',
        },
      ],
      notes: 'Stop in Marquette (mining tour or other) / Hotel in Houghton',
    },

    // Day 9 - Wednesday
    {
      dayNumber: 9,
      dayOfWeek: 'Wed',
      date: '2026-07-09',
      departure: LOCATIONS.houghton,
      destination: LOCATIONS.copperHarbor,
      drivingHours: 1,
      drivingMiles: 50,
      overnight: {
        location: LOCATIONS.copperHarbor,
        type: 'campground',
        notes: 'Copper Harbor Campground',
      },
      activities: [
        {
          id: 'ch-explore',
          name: 'Explore Copper Harbor',
          location: LOCATIONS.copperHarbor,
          category: 'scenic',
          estimatedDuration: 240,
        },
      ],
      notes: 'Leave Houghton early / Spend day in Copper Harbor',
    },

    // Day 10 - Thursday
    {
      dayNumber: 10,
      dayOfWeek: 'Thu',
      date: '2026-07-10',
      departure: LOCATIONS.copperHarbor,
      destination: LOCATIONS.porcupineMountains,
      drivingHours: 2.5,
      drivingMiles: 125,
      overnight: {
        location: LOCATIONS.porcupineMountains,
        type: 'campground',
        notes: 'Porkies Campground',
      },
      activities: [
        {
          id: 'pm-setup',
          name: 'Setup camp and relax',
          location: LOCATIONS.porcupineMountains,
          category: 'other',
          estimatedDuration: 120,
        },
        {
          id: 'pm-sunset',
          name: 'Sunset viewing',
          location: LOCATIONS.porcupineMountains,
          category: 'scenic',
          estimatedDuration: 60,
        },
      ],
      notes: 'Arrive at Porkies mid-day / Setup camp / Relax + sunset',
    },

    // Day 11 - Friday (Stay Day)
    {
      dayNumber: 11,
      dayOfWeek: 'Fri',
      date: '2026-07-11',
      departure: LOCATIONS.porcupineMountains,
      destination: LOCATIONS.porcupineMountains,
      drivingHours: 0,
      drivingMiles: 0,
      overnight: {
        location: LOCATIONS.porcupineMountains,
        type: 'campground',
        notes: 'Porkies Campground',
      },
      activities: [
        {
          id: 'pm-hike',
          name: 'Lake of the Clouds Trail',
          location: LOCATIONS.porcupineMountains,
          category: 'hike',
          estimatedDuration: 180,
        },
        {
          id: 'pm-peak',
          name: 'Summit Peak Trail',
          location: LOCATIONS.porcupineMountains,
          category: 'hike',
          estimatedDuration: 120,
        },
      ],
      notes: 'Full day at Porkies / Hike trails or peak',
    },

    // Day 12 - Saturday (Return Home)
    {
      dayNumber: 12,
      dayOfWeek: 'Sat',
      date: '2026-07-12',
      departure: LOCATIONS.porcupineMountains,
      destination: LOCATIONS.home,
      drivingHours: 10,
      drivingMiles: 600,
      overnight: {
        location: LOCATIONS.home,
        type: 'home',
        notes: 'Home / Optional stay near Mackinaw',
      },
      activities: [],
      notes: 'Full drive back w/ breaks (N. or S. route)',
    },
  ],
};
