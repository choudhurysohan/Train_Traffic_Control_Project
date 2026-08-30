/**
 * Train Traffic Control Scheduler & Routing Service
 * Models the railway layout (stations, blocks) and computes safe headway,
 * signal aspects, precedence loop diversions, and schedule logs.
 */

export const STATIONS = [
  { id: 'BSB', name: 'Station I (Varanasi)', km: 0, pct: 0 },
  { id: 'CJN', name: 'Station II (Central Junction)', km: 14.5, pct: 45 },
  { id: 'RVS', name: 'Station III (Riverside)', km: 22, pct: 68 },
  { id: 'EYD', name: 'Station IV (East Yard)', km: 32, pct: 100 }
];

export const BLOCKS_UP = [
  { id: 'BLK-101', name: 'Varanasi Exit', startKm: 0, endKm: 5 },
  { id: 'BLK-102', name: 'West Approach', startKm: 5, endKm: 13.5 },
  { id: 'BLK-103', name: 'Central Junction Main', startKm: 13.5, endKm: 15.5 },
  { id: 'BLK-104', name: 'Loop 1 (UP Siding)', startKm: 13.5, endKm: 15.5, isLoop: true },
  { id: 'BLK-105', name: 'Riverside Approach', startKm: 15.5, endKm: 21 },
  { id: 'BLK-106', name: 'Riverside Sector Main', startKm: 21, endKm: 23 },
  { id: 'BLK-107', name: 'Riverside Siding', startKm: 21, endKm: 23, isLoop: true },
  { id: 'BLK-108', name: 'East Outskirts', startKm: 23, endKm: 32 }
];

export const BLOCKS_DN = [
  { id: 'BLK-201', name: 'East Inbound', startKm: 32, endKm: 23 },
  { id: 'BLK-202', name: 'Riverside Sector Main', startKm: 23, endKm: 21 },
  { id: 'BLK-203', name: 'Riverside DN Siding', startKm: 23, endKm: 21, isLoop: true },
  { id: 'BLK-204', name: 'Riverside Exit', startKm: 21, endKm: 15.5 },
  { id: 'BLK-205', name: 'Central Junction DN Main', startKm: 15.5, endKm: 13.5 },
  { id: 'BLK-206', name: 'Loop 2 (DN Siding)', startKm: 15.5, endKm: 13.5, isLoop: true },
  { id: 'BLK-207', name: 'West Outbound', startKm: 13.5, endKm: 5 },
  { id: 'BLK-208', name: 'Varanasi Entry', startKm: 5, endKm: 0 }
];

/**
 * Calculates predicted timetables for a train based on its speed and routing.
 * Returns arrival and departure times for each station node.
 */
export function calculateSchedule(train, departureTimeStr = '14:00') {
  const [depHour, depMin] = departureTimeStr.split(':').map(Number);
  let currentTime = depHour * 60 + depMin;

  const resultSchedule = [];
  const isUp = train.direction === 'UP (Westbound)';
  const orderedStations = isUp ? STATIONS : [...STATIONS].reverse();

  orderedStations.forEach((station, idx) => {
    if (idx === 0) {
      // Starting Station
      resultSchedule.push({
        stationId: station.id,
        stationName: station.name,
        arrival: '--:--',
        departure: departureTimeStr,
        delay: '+0 min',
        status: 'On-Time'
      });
    } else {
      // Calculate travel time based on distance delta and average travel speed
      const prevStation = orderedStations[idx - 1];
      const dist = Math.abs(station.km - prevStation.km);
      // Assuming avg speed in simulation is 80% of maxSpeed due to acceleration/braking
      const speedKmh = Math.max(30, train.maxSpeed * 0.8);
      const travelTimeMin = Math.round((dist / speedKmh) * 60);
      
      currentTime += travelTimeMin;
      const arrHour = Math.floor(currentTime / 60) % 24;
      const arrMin = Math.round(currentTime % 60);
      const arrivalStr = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;

      // Add dwell time (e.g. Express dwell = 3 mins, Freight loop = 10 mins)
      let dwell = 2;
      if (train.category === 'Freight') dwell = 10;
      else if (train.category === 'Superfast') dwell = 2;
      else if (train.category === 'Express') dwell = 4;

      currentTime += dwell;
      const depHourVal = Math.floor(currentTime / 60) % 24;
      const depMinVal = Math.round(currentTime % 60);
      const departureStr = `${String(depHourVal).padStart(2, '0')}:${String(depMinVal).padStart(2, '0')}`;

      resultSchedule.push({
        stationId: station.id,
        stationName: station.name,
        arrival: arrivalStr,
        departure: idx === orderedStations.length - 1 ? '--:--' : departureStr,
        delay: '+0 min',
        status: 'On-Time'
      });
    }
  });

  return resultSchedule;
}

/**
 * Updates positions, checks headway spacing, resolves priority conflicts,
 * and sets signal colors for each block segment.
 */
export function simulateStep(trains, timeStepSec = 5, currentSimTime = 0) {
  // Deep clone to avoid mutating React states directly
  let updatedTrains = trains.map(t => ({
    ...t,
    schedule: t.schedule ? t.schedule.map(s => ({ ...s })) : []
  }));

  const logs = [];

  // 1. Move Trains and assign block indices based on direction
  updatedTrains = updatedTrains.map(train => {
    if (train.isWaiting) {
      if (train.waitTimeRemaining > 0) {
        train.waitTimeRemaining -= timeStepSec;
        train.speed = 0;
      } else {
        train.isWaiting = false;
        train.speed = train.targetSpeed || train.maxSpeed;
        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          title: `Train Departure`,
          description: `${train.name} (${train.id}) finished hold, departing block.`
        });
      }
    }

    const isUp = train.direction === 'UP (Westbound)';
    const speedKms = train.speed / 3600; // km per second
    const deltaKm = speedKms * timeStepSec;

    if (!train.isWaiting) {
      if (isUp) {
        train.km = Math.min(32, train.km + deltaKm);
      } else {
        train.km = Math.max(0, train.km - deltaKm);
      }
      train.pct = Math.round((train.km / 32) * 100);
    }

    // Check station arrival bounds to trigger dwell time
    const targetStations = isUp ? STATIONS.slice(1) : STATIONS.slice(0, -1).reverse();
    targetStations.forEach(st => {
      const distanceToStation = Math.abs(train.km - st.km);
      if (distanceToStation < 0.1 && !train.visitedStations?.includes(st.id)) {
        train.visitedStations = [...(train.visitedStations || []), st.id];
        
        // Check if this station is the destination
        const isDestination = train.destinationStationId === st.id || (train.destination && train.destination.includes(st.id)) || (train.destination && train.destination.includes(st.name));
        
        if (isDestination) {
          train.speed = 0;
          train.status = 'Completed';
          train.nextSignal = 'SIG-END [N/A]';
          logs.push({
            timestamp: new Date().toLocaleTimeString(),
            type: 'info',
            title: 'Destination Reached',
            description: `${train.name} (${train.id}) reached its destination: ${st.name}`
          });
          return train;
        }

        train.isWaiting = true;
        train.dwellTimer = (train.dwellTimer || 0) + 1;
        let dwell = 15; // default 15s for sim fast forward
        if (train.category === 'Superfast') dwell = 15;
        else if (train.category === 'Express') dwell = 25;
        else if (train.category === 'Freight') dwell = 45;
        train.waitTimeRemaining = dwell;
        train.speed = 0;

        // Log station arrival
        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          title: 'Station Arrival',
          description: `${train.name} (${train.id}) arrived at platform: ${st.name}`
        });

        // Update schedule delays if any
        if (train.schedule) {
          const scheduleIndex = train.schedule.findIndex(s => s.stationId === st.id);
          if (scheduleIndex !== -1) {
            train.schedule[scheduleIndex].status = 'Arrived';
          }
        }
      }
    });

    // Determine current block id
    const blocks = isUp ? BLOCKS_UP : BLOCKS_DN;
    let currentBlock = null;
    
    // Find matching block
    for (let b of blocks) {
      if (isUp) {
        if (train.km >= b.startKm && train.km <= b.endKm) {
          // If train is on loop line
          if (train.track.toLowerCase().includes('loop') && b.isLoop) {
            currentBlock = b;
            break;
          }
          if (!train.track.toLowerCase().includes('loop') && !b.isLoop) {
            currentBlock = b;
          }
        }
      } else {
        if (train.km <= b.startKm && train.km >= b.endKm) {
          if (train.track.toLowerCase().includes('loop') && b.isLoop) {
            currentBlock = b;
            break;
          }
          if (!train.track.toLowerCase().includes('loop') && !b.isLoop) {
            currentBlock = b;
          }
        }
      }
    }

    if (currentBlock) {
      train.currentBlock = `${currentBlock.id} (${currentBlock.name})`;
      train.currentBlockId = currentBlock.id;
    }

    return train;
  });

  // 2. Precedence / Overtake Solver (Interlocking routing)
  // Check pairs of trains going the same direction where trailing train is higher priority
  for (let i = 0; i < updatedTrains.length; i++) {
    for (let j = 0; j < updatedTrains.length; j++) {
      if (i === j) continue;
      const trainA = updatedTrains[i]; // Leading train
      const trainB = updatedTrains[j]; // Trailing train

      const isSameDirection = trainA.direction === trainB.direction;
      if (!isSameDirection) continue;

      const isUp = trainA.direction === 'UP (Westbound)';
      const distBehind = isUp ? (trainA.km - trainB.km) : (trainB.km - trainA.km);

      // If trainB (trailing) is High priority and trainA is Low (Freight),
      // and trainB is getting close (within 4km), divert trainA to a Loop siding
      if (distBehind > 0 && distBehind < 5.0) {
        const priorityA = Number(trainA.priority) || 1;
        const priorityB = Number(trainB.priority) || 1;

        if (priorityB > priorityA && !trainA.track.toLowerCase().includes('loop')) {
          // Find next loop block
          const blocks = isUp ? BLOCKS_UP : BLOCKS_DN;
          const nextLoop = blocks.find(b => b.isLoop && (isUp ? b.startKm >= trainA.km : b.startKm <= trainA.km));
          
          if (nextLoop) {
            // Divert leading train (trainA) to loop line
            trainA.track = isUp ? 'Track 3 (Loop UP)' : 'Track 4 (Loop DN)';
            trainA.isWaiting = true;
            trainA.waitTimeRemaining = 35; // wait 35s for fast express to overtake
            trainA.speed = 0;
            trainA.nextSignal = `SIG-${nextLoop.id} [RED]`;

            logs.push({
              timestamp: new Date().toLocaleTimeString(),
              type: 'critical',
              title: 'Precedence Bypass Routing',
              description: `Conflict Solved: Diverted ${trainA.name} to Siding Loop to allow High-Priority ${trainB.name} to pass.`
            });
          }
        }
      }
    }
  }

  // 3. Signal Aspect Scheduler
  // Calculate dynamic aspects based on occupancy and distance ahead
  updatedTrains = updatedTrains.map((train, idx) => {
    if (train.km >= 32 && train.direction === 'UP (Westbound)') {
      train.speed = 0;
      train.status = 'Completed';
      train.nextSignal = 'SIG-END [N/A]';
      return train;
    }
    if (train.km <= 0 && train.direction === 'DN (Eastbound)') {
      train.speed = 0;
      train.status = 'Completed';
      train.nextSignal = 'SIG-END [N/A]';
      return train;
    }

    const isUp = train.direction === 'UP (Westbound)';
    
    // Find closest train in front
    let minDistanceAhead = Infinity;
    let leadingTrain = null;

    updatedTrains.forEach((other, otherIdx) => {
      if (idx === otherIdx) return;
      if (other.direction !== train.direction) return;
      if (other.status === 'Completed') return;

      const dist = isUp ? (other.km - train.km) : (train.km - other.km);
      if (dist > 0 && dist < minDistanceAhead) {
        // Double check loop overlap
        const bothOnMain = !train.track.toLowerCase().includes('loop') && !other.track.toLowerCase().includes('loop');
        const bothOnSameLoop = train.track.toLowerCase().includes('loop') && other.track.toLowerCase().includes('loop') && train.currentBlockId === other.currentBlockId;
        
        if (bothOnMain || bothOnSameLoop) {
          minDistanceAhead = dist;
          leadingTrain = other;
        }
      }
    });

    // Aspect rules
    let aspect = 'GREEN';
    let targetSpeed = train.maxSpeed;

    if (minDistanceAhead < 2.0) {
      aspect = 'RED';
      targetSpeed = 0;
      train.speed = 0;
      train.status = 'Critical';
      train.dwellTimer = (train.dwellTimer || 0) + 1;
      
      if (!train.isWaiting) {
        train.isWaiting = true;
        train.waitTimeRemaining = 5; // try again in 5s
      }
    } else if (minDistanceAhead < 4.0) {
      aspect = 'YELLOW';
      targetSpeed = Math.min(train.maxSpeed, 45); // Caution speed
      train.speed = targetSpeed;
      train.status = 'Warning';
    } else {
      aspect = 'GREEN';
      train.status = train.isWaiting ? 'Warning' : 'Active';
      if (!train.isWaiting) {
        train.speed = train.maxSpeed;
      }
    }

    const signalId = `SIG-${train.currentBlockId || '101'}A`;
    train.nextSignal = `${signalId} [${aspect}]`;

    return train;
  });

  return {
    trains: updatedTrains,
    logs
  };
}
