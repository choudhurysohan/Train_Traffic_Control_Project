export const DUMMY_DATA = {
  projectInfo: {
    name: "Train Traffic Control",
    subtitle: "Section Throughput Optimization System",
    sectionId: "SEC-OPTIMA-CR4",
    sectionName: "Western Main Corridor (Varanasi - Prayagraj Junction)",
    controllerName: "Chief Controller R. Sharma",
    controllerRole: "Section Traffic Controller",
    systemStatus: "OPTIMAL",
    lastUpdated: "Just now",
    version: "v2.4 (College Major Project Edition)"
  },

  metrics: {
    totalTrains: 24,
    activeTrains: 14,
    delayedTrains: 4,
    onTimeTrains: 10,
    trackUtilization: 82.4, // %
    sectionThroughput: 18.6, // Trains/Hour
    averageSpeed: 74.2, // km/h
    averageDelay: 6.8, // minutes
    headway: 4.5, // min safe spacing
    congestionIndex: "Moderate",
    bottleneckCount: 1
  },

  trains: [
    {
      id: "TR-12401",
      name: "Vande Bharat Express",
      source: "Varanasi (BSB)",
      destination: "New Delhi (NDLS)",
      speed: 130,
      maxSpeed: 160,
      track: "Track 1 (UP Main)",
      delay: 0,
      status: "Normal", // Normal (Green), Active (Blue), Warning (Yellow), Critical (Red)
      priority: "High",
      category: "Superfast",
      currentBlock: "BLK-104 (Station Alpha)",
      nextSignal: "SIG-104A [GREEN]",
      direction: "UP (Westbound)",
      dwellTime: "2 min"
    },
    {
      id: "TR-12309",
      name: "Rajdhani Superfast",
      source: "Patna Jn (PNBE)",
      destination: "New Delhi (NDLS)",
      speed: 115,
      maxSpeed: 140,
      track: "Track 1 (UP Main)",
      delay: 4,
      status: "Normal",
      priority: "High",
      category: "Superfast",
      currentBlock: "BLK-102 (West Approach)",
      nextSignal: "SIG-102A [GREEN]",
      direction: "UP (Westbound)",
      dwellTime: "0 min"
    },
    {
      id: "TR-12560",
      name: "Shiv Ganga Express",
      source: "New Delhi (NDLS)",
      destination: "Varanasi (BSB)",
      speed: 95,
      maxSpeed: 130,
      track: "Track 2 (DN Main)",
      delay: 14,
      status: "Warning",
      priority: "Medium",
      category: "Express",
      currentBlock: "BLK-203 (Central Junction)",
      nextSignal: "SIG-203B [YELLOW]",
      direction: "DN (Eastbound)",
      dwellTime: "5 min"
    },
    {
      id: "FRT-9042",
      name: "Container Freight Liner-A",
      source: "Mughalsarai Yard",
      destination: "Dadri DFC Terminal",
      speed: 48,
      maxSpeed: 75,
      track: "Track 3 (Loop UP)",
      delay: 38,
      status: "Critical",
      priority: "Low",
      category: "Freight",
      currentBlock: "BLK-301 (Loop North Siding)",
      nextSignal: "SIG-301C [RED]",
      direction: "UP (Westbound)",
      dwellTime: "18 min"
    },
    {
      id: "TR-14258",
      name: "Kashi Vishwanath Exp",
      source: "Banaras (BSBS)",
      destination: "New Delhi (NDLS)",
      speed: 82,
      maxSpeed: 110,
      track: "Track 1 (UP Main)",
      delay: 0,
      status: "Active",
      priority: "Medium",
      category: "Mail/Express",
      currentBlock: "BLK-106 (East Outskirts)",
      nextSignal: "SIG-106A [GREEN]",
      direction: "UP (Westbound)",
      dwellTime: "0 min"
    },
    {
      id: "FRT-8821",
      name: "Coal Bulk Freight-09",
      source: "Singrauli Coalfield",
      destination: "Ropar Thermal",
      speed: 0,
      maxSpeed: 65,
      track: "Track 4 (Loop DN)",
      delay: 45,
      status: "Critical",
      priority: "Low",
      category: "Freight",
      currentBlock: "BLK-402 (Holding Siding)",
      nextSignal: "SIG-402D [RED]",
      direction: "DN (Eastbound)",
      dwellTime: "28 min"
    },
    {
      id: "TR-22436",
      name: "Vande Bharat Return",
      source: "New Delhi (NDLS)",
      destination: "Varanasi (BSB)",
      speed: 125,
      maxSpeed: 160,
      track: "Track 2 (DN Main)",
      delay: 0,
      status: "Active",
      priority: "High",
      category: "Superfast",
      currentBlock: "BLK-201 (West Inbound)",
      nextSignal: "SIG-201B [GREEN]",
      direction: "DN (Eastbound)",
      dwellTime: "0 min"
    },
    {
      id: "LOC-0044",
      name: "Track Inspection Car",
      source: "Junction Depot",
      destination: "Block 108 Sector",
      speed: 35,
      maxSpeed: 50,
      track: "Siding Yard 2",
      delay: 0,
      status: "Active",
      priority: "Low",
      category: "Inspection",
      currentBlock: "BLK-502 (Depot Track)",
      nextSignal: "SIG-502Y [YELLOW]",
      direction: "UP (Westbound)",
      dwellTime: "N/A"
    }
  ],

  tracks: [
    {
      id: "TRK-01",
      name: "UP Main Line (Fast Corridor)",
      lengthKm: 28.4,
      occupied: true,
      currentTrain: "TR-12401 (Vande Bharat)",
      utilization: 88,
      speedLimit: 160,
      electrification: "25kV AC Overhead",
      interlocking: "Electronic (Solid State)",
      status: "Occupied - High Speed",
      health: "Normal"
    },
    {
      id: "TRK-02",
      name: "DN Main Line (Fast Corridor)",
      lengthKm: 28.4,
      occupied: true,
      currentTrain: "TR-22436 (Vande Bharat DN)",
      utilization: 84,
      speedLimit: 160,
      electrification: "25kV AC Overhead",
      interlocking: "Electronic (Solid State)",
      status: "Occupied - Normal",
      health: "Normal"
    },
    {
      id: "TRK-03",
      name: "Loop Line 1 (UP Precedence)",
      lengthKm: 1.8,
      occupied: true,
      currentTrain: "FRT-9042 (Freight Liner)",
      utilization: 92,
      speedLimit: 50,
      electrification: "25kV AC Overhead",
      interlocking: "Relay Interlocking",
      status: "Occupied - Precedence Hold",
      health: "Warning"
    },
    {
      id: "TRK-04",
      name: "Loop Line 2 (DN Bypass)",
      lengthKm: 2.1,
      occupied: true,
      currentTrain: "FRT-8821 (Coal Freight)",
      utilization: 95,
      speedLimit: 50,
      electrification: "25kV AC Overhead",
      interlocking: "Relay Interlocking",
      status: "Occupied - Congested",
      health: "Critical"
    },
    {
      id: "TRK-05",
      name: "Station Platform Line 1",
      lengthKm: 0.9,
      occupied: false,
      currentTrain: "None (Clear)",
      utilization: 45,
      speedLimit: 30,
      electrification: "25kV AC Overhead",
      interlocking: "Electronic",
      status: "Available - Clean Track",
      health: "Normal"
    },
    {
      id: "TRK-06",
      name: "Station Platform Line 2",
      lengthKm: 0.9,
      occupied: true,
      currentTrain: "TR-12560 (Shiv Ganga)",
      utilization: 78,
      speedLimit: 30,
      electrification: "25kV AC Overhead",
      interlocking: "Electronic",
      status: "Occupied - Passenger Boarding",
      health: "Normal"
    },
    {
      id: "TRK-07",
      name: "Freight Yard Siding Alpha",
      lengthKm: 3.4,
      occupied: false,
      currentTrain: "None (Reserved)",
      utilization: 30,
      speedLimit: 25,
      electrification: "Non-Electrified / Shunting",
      interlocking: "Mechanical/Panel",
      status: "Available",
      health: "Normal"
    },
    {
      id: "TRK-08",
      name: "Maintenance & Crossover Spur",
      lengthKm: 1.2,
      occupied: true,
      currentTrain: "LOC-0044 (Inspection)",
      utilization: 60,
      speedLimit: 20,
      electrification: "25kV AC Overhead",
      interlocking: "Electronic",
      status: "Occupied - Inspection Mode",
      health: "Active"
    }
  ],

  signals: [
    { id: "SIG-101A", location: "KM 10.2 (Station Entry UP)", status: "GREEN", track: "Track 1 (UP Main)", train: "TR-12401", aspect: "Proceed at Max Permissible", interlocking: "Locked / Route Cleared" },
    { id: "SIG-102B", location: "KM 14.8 (Mid-Section Auto)", status: "GREEN", track: "Track 1 (UP Main)", train: "TR-12309", aspect: "Clear Aspect", interlocking: "Automatic Block System" },
    { id: "SIG-201A", location: "KM 12.0 (DN Main Outskirts)", status: "GREEN", track: "Track 2 (DN Main)", train: "TR-22436", aspect: "Clear Aspect", interlocking: "Locked / Route Cleared" },
    { id: "SIG-203B", location: "KM 18.5 (Junction Approach DN)", status: "YELLOW", track: "Track 2 (DN Main)", train: "TR-12560", aspect: "Caution - Next Signal at Stop", interlocking: "Route Setting Active" },
    { id: "SIG-301C", location: "KM 18.9 (Loop Line Exit UP)", status: "RED", track: "Track 3 (Loop UP)", train: "FRT-9042", aspect: "Danger - Stop before Signal", interlocking: "Precedence Interlocked" },
    { id: "SIG-402D", location: "KM 22.1 (DN Holding Siding Exit)", status: "RED", track: "Track 4 (Loop DN)", train: "FRT-8821", aspect: "Danger - Block Occupied Ahead", interlocking: "Locked" },
    { id: "SIG-105S", location: "KM 19.2 (Platform 1 Starter)", status: "GREEN", track: "Track 5 (Platform 1)", train: "None", aspect: "Route Ready for Arrival", interlocking: "Panel Cleared" },
    { id: "SIG-106S", location: "KM 19.2 (Platform 2 Starter)", status: "YELLOW", track: "Track 6 (Platform 2)", train: "TR-12560", aspect: "Caution - Depart on Dispatch", interlocking: "Timer Countdown" },
    { id: "SIG-501X", location: "KM 26.4 (Yard Crossover Lead)", status: "YELLOW", track: "Track 7 (Yard Lead)", train: "None", aspect: "Caution - Shunting Limit", interlocking: "Manual Cleared" },
    { id: "SIG-502Y", location: "KM 27.0 (Spur Siding Junction)", status: "YELLOW", track: "Track 8 (Spur Line)", train: "LOC-0044", aspect: "Proceed with 15 km/h limit", interlocking: "Occupational Permit" }
  ],

  schedule: [
    { trainId: "TR-12401", trainName: "Vande Bharat Express", arrival: "14:15", departure: "14:18", platform: "PF-01", delay: "+0 min", status: "On-Time" },
    { trainId: "TR-12309", trainName: "Rajdhani Superfast", arrival: "14:28", departure: "14:32", platform: "PF-01", delay: "+4 min", status: "Expected" },
    { trainId: "TR-12560", trainName: "Shiv Ganga Express", arrival: "14:40", departure: "14:45", platform: "PF-02", delay: "+14 min", status: "Delayed" },
    { trainId: "TR-14258", trainName: "Kashi Vishwanath Exp", arrival: "15:05", departure: "15:10", platform: "PF-03", delay: "+0 min", status: "Scheduled" },
    { trainId: "FRT-9042", trainName: "Freight Liner-A", arrival: "13:50", departure: "14:55", platform: "Loop 1", delay: "+38 min", status: "Precedence Halt" },
    { trainId: "TR-22436", trainName: "Vande Bharat Return", arrival: "15:20", departure: "15:23", platform: "PF-02", delay: "+0 min", status: "Scheduled" },
    { trainId: "FRT-8821", trainName: "Coal Bulk Freight-09", arrival: "13:30", departure: "15:30", platform: "Loop 2", delay: "+45 min", status: "Siding Hold" },
    { trainId: "TR-15004", trainName: "Chauri Chaura Express", arrival: "15:45", departure: "15:52", platform: "PF-04", delay: "+6 min", status: "Approaching" }
  ],

  trafficControl: {
    densityPct: 78,
    utilizationPct: 82.4,
    avgDelayMin: 6.8,
    headwayMin: 4.5,
    congestionLevel: "Moderate",
    bottlenecks: [
      {
        section: "Central Junction Switch SW-04",
        cause: "Freight Loop Wait for Superfast Clearance",
        impact: "Adds +8 min headway buffer for trailing express trains",
        recommendedAction: "Dispatch FRT-9042 into Siding Alpha after TR-12401 passes KM 22.0 to unlock Main UP block."
      },
      {
        section: "Platform 2 Dwell Limit",
        cause: "Passenger rush on TR-12560",
        impact: "Occupies Track 6 for 3 minutes beyond scheduled timetable",
        recommendedAction: "Signal Aspect SIG-106S primed for instant departure upon bell acknowledgment."
      }
    ],
    optimizationTips: [
      "Automated Throughput Gain: +14.2% if Loop 1 Freight is held for 6 more mins to allow dual high-speed slot.",
      "Dynamic Speed Profiling: Reduce TR-12560 approach speed by 10 km/h to prevent hard stop at Signal SIG-203B.",
      "Energy Savings: Eliminates 3 unnecessary locomotive heavy regenerations."
    ]
  },

  performance: {
    throughputHourly: [
      { hour: "06:00", trains: 12 },
      { hour: "08:00", trains: 19 },
      { hour: "10:00", trains: 16 },
      { hour: "12:00", trains: 14 },
      { hour: "14:00", trains: 22 },
      { hour: "16:00", trains: 18 },
      { hour: "18:00", trains: 21 },
      { hour: "20:00", trains: 15 }
    ],
    delayBySection: [
      { section: "West Approach", delay: 2.1 },
      { section: "Central Jcn", delay: 8.4 },
      { section: "North Loop", delay: 14.2 },
      { section: "East Outskirts", delay: 1.8 }
    ],
    trackUtilization: [
      { track: "TRK-01 (UP Main)", util: 88 },
      { track: "TRK-02 (DN Main)", util: 84 },
      { track: "TRK-03 (Loop 1)", util: 92 },
      { track: "TRK-04 (Loop 2)", util: 95 },
      { track: "TRK-05 (PF 1)", util: 45 },
      { track: "TRK-06 (PF 2)", util: 78 }
    ],
    waitingTimeBreakdown: [
      { category: "High Speed Pass (0-5m)", count: 14 },
      { category: "Signal Caution (5-15m)", count: 6 },
      { category: "Loop Precedence (15-40m)", count: 3 },
      { category: "Heavy Bottleneck (>40m)", count: 1 }
    ]
  },

  alerts: [
    {
      id: "ALT-901",
      type: "critical",
      title: "Precedence Conflict on Loop 1 Exit",
      description: "FRT-9042 awaiting slot clearance. Held at SIG-301C due to incoming high-priority Vande Bharat TR-12401.",
      trainId: "FRT-9042",
      trackId: "TRK-03",
      timestamp: "14:21:05",
      acknowledged: false
    },
    {
      id: "ALT-902",
      type: "warning",
      title: "Speed Restriction Imposed",
      description: "Temporary Speed Restriction of 45 km/h at KM 18.2 due to ballast vibration sensor calibration.",
      trainId: "All DN Trains",
      trackId: "TRK-02",
      timestamp: "14:14:30",
      acknowledged: true
    },
    {
      id: "ALT-903",
      type: "warning",
      title: "Approaching Headway Margin",
      description: "Headway spacing between TR-12309 and TR-12401 dropped to 3.8 minutes (Target: >= 4.0m).",
      trainId: "TR-12309",
      trackId: "TRK-01",
      timestamp: "14:10:12",
      acknowledged: true
    },
    {
      id: "ALT-904",
      type: "info",
      title: "Throughput Optimization Triggered",
      description: "Section Throughput Optimization Algorithm recalculated path. +1 slot created in 15:30 window.",
      trainId: "SYSTEM-ALGO",
      trackId: "SEC-ALL",
      timestamp: "13:58:00",
      acknowledged: true
    },
    {
      id: "ALT-905",
      type: "info",
      title: "Electronic Interlocking Self-Check",
      description: "Solid State Interlocking (SSI) Cabin 4 reported 100% telemetry fidelity across all 24 switches.",
      trainId: "CABIN-04",
      trackId: "ALL",
      timestamp: "13:45:00",
      acknowledged: true
    }
  ]
};
