/**
 * Generalized Graph Railway Traffic Control & ML Dataset Engine
 * 
 * Supports:
 * - Parameterized Stations with variable platform counts
 * - Parameterized Inter-station sections with variable line counts (1, 2, 3 lines)
 * - Single-line bottleneck locking & bi-directional conflict resolution
 * - Priority-based dispatching (1-10 scale)
 * - Dynamic Speed Regulation (advisory speed pacing to prevent hard dead-stops)
 * - Live ML Dataset collection & JSON/CSV exports
 */

export const DEFAULT_CORRIDOR = {
  id: 'corridor-default',
  name: 'Standard 4-Station Mixed Corridor',
  totalKm: 36,
  stations: [
    {
      id: 'S1',
      name: 'Station I',
      code: 'I',
      subtitle: 'Varanasi Terminal',
      km: 0,
      platformCount: 4,
      platforms: [
        { id: 'S1-PF1', name: 'PF 1', index: 0 },
        { id: 'S1-PF2', name: 'PF 2', index: 1 },
        { id: 'S1-PF3', name: 'PF 3', index: 2 },
        { id: 'S1-PF4', name: 'PF 4', index: 3 }
      ]
    },
    {
      id: 'S2',
      name: 'Station II',
      code: 'II',
      subtitle: 'Central Choke Point',
      km: 12,
      platformCount: 2,
      platforms: [
        { id: 'S2-PF1', name: 'PF 1', index: 0 },
        { id: 'S2-PF2', name: 'PF 2', index: 1 }
      ]
    },
    {
      id: 'S3',
      name: 'Station III',
      code: 'III',
      subtitle: 'Riverside Junction',
      km: 24,
      platformCount: 3,
      platforms: [
        { id: 'S3-PF1', name: 'PF 1', index: 0 },
        { id: 'S3-PF2', name: 'PF 2', index: 1 },
        { id: 'S3-PF3', name: 'PF 3', index: 2 }
      ]
    },
    {
      id: 'S4',
      name: 'Station IV',
      code: 'IV',
      subtitle: 'East Freight Terminal',
      km: 36,
      platformCount: 4,
      platforms: [
        { id: 'S4-PF1', name: 'PF 1', index: 0 },
        { id: 'S4-PF2', name: 'PF 2', index: 1 },
        { id: 'S4-PF3', name: 'PF 3', index: 2 },
        { id: 'S4-PF4', name: 'PF 4', index: 3 }
      ]
    }
  ],
  sections: [
    {
      id: 'SEC-1-2',
      fromStationId: 'S1',
      toStationId: 'S2',
      name: 'Section I–II',
      typeLabel: 'Single-Line Choke (1 Track)',
      startKm: 0,
      endKm: 12,
      lengthKm: 12,
      lineCount: 1,
      lines: [
        { id: 'SEC-1-2-L1', lineIndex: 0, name: 'Single Bottleneck Track' }
      ]
    },
    {
      id: 'SEC-2-3',
      fromStationId: 'S2',
      toStationId: 'S3',
      name: 'Section II–III',
      typeLabel: 'Dual Mainline (2 Tracks)',
      startKm: 12,
      endKm: 24,
      lengthKm: 12,
      lineCount: 2,
      lines: [
        { id: 'SEC-2-3-L1', lineIndex: 0, name: 'Track Line 1' },
        { id: 'SEC-2-3-L2', lineIndex: 1, name: 'Track Line 2' }
      ]
    },
    {
      id: 'SEC-3-4',
      fromStationId: 'S3',
      toStationId: 'S4',
      name: 'Section III–IV',
      typeLabel: 'Single-Line Choke (1 Track)',
      startKm: 24,
      endKm: 36,
      lengthKm: 12,
      lineCount: 1,
      lines: [
        { id: 'SEC-3-4-L1', lineIndex: 0, name: 'Single Bottleneck Track' }
      ]
    }
  ]
};

/**
 * Procedural random corridor generator
 */
export function generateRandomCorridor(stationCount = 4) {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const stationSubtitles = ['Terminal West', 'Junction Cabin', 'River Valley', 'East Depot', 'Highland Spur', 'Terminal East'];
  const stations = [];
  const sections = [];
  let currentKm = 0;

  for (let i = 0; i < stationCount; i++) {
    // Variable platform counts (e.g. 2 to 4 platforms per station)
    const pfCount = i === 0 || i === stationCount - 1 ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 3) + 2;
    const stId = `S${i + 1}`;
    const platforms = [];
    for (let p = 0; p < pfCount; p++) {
      platforms.push({ id: `${stId}-PF${p + 1}`, name: `PF ${p + 1}`, index: p });
    }

    stations.push({
      id: stId,
      name: `Station ${romanNumerals[i] || (i + 1)}`,
      code: romanNumerals[i] || `${i + 1}`,
      subtitle: stationSubtitles[i] || `Sector Node ${i + 1}`,
      km: currentKm,
      platformCount: pfCount,
      platforms
    });

    if (i > 0) {
      const prevSt = stations[i - 1];
      const secLength = Math.floor(Math.random() * 4) + 8; // 8 to 12 km
      // Random line count: 1, 2, or 3 lines
      const randVal = Math.random();
      const lineCount = randVal < 0.45 ? 1 : randVal < 0.85 ? 2 : 3;
      const secId = `SEC-${i}-${i + 1}`;
      const lines = [];
      for (let l = 0; l < lineCount; l++) {
        lines.push({
          id: `${secId}-L${l + 1}`,
          lineIndex: l,
          name: lineCount === 1 ? 'Single Bottleneck Track' : `Track Line ${l + 1}`
        });
      }

      sections.push({
        id: secId,
        fromStationId: prevSt.id,
        toStationId: stId,
        name: `Section ${romanNumerals[i - 1]}–${romanNumerals[i]}`,
        typeLabel: lineCount === 1 ? 'Single-Line Choke (1 Track)' : `${lineCount} Parallel Lines`,
        startKm: prevSt.km,
        endKm: currentKm,
        lengthKm: currentKm - prevSt.km,
        lineCount,
        lines
      });
    }

    if (i < stationCount - 1) {
      currentKm += Math.floor(Math.random() * 4) + 10;
    }
  }

  return {
    id: 'corridor-random-' + Math.floor(Math.random() * 10000),
    name: `Dynamic Corridor (${stationCount} Stations, Variable Lines)`,
    totalKm: currentKm,
    stations,
    sections
  };
}

/**
 * Predict initial arrival and departure timetables
 */
export function calculateGraphSchedule(train, corridor, departureTimeStr = '14:00') {
  const [depHour, depMin] = departureTimeStr.split(':').map(Number);
  let currentTime = depHour * 60 + depMin;
  const resultSchedule = [];

  const originIdx = corridor.stations.findIndex(s => s.id === train.originStationId);
  const destIdx = corridor.stations.findIndex(s => s.id === train.destinationStationId);
  if (originIdx === -1 || destIdx === -1) return [];

  const isForward = destIdx >= originIdx;
  const stationsPath = isForward
    ? corridor.stations.slice(originIdx, destIdx + 1)
    : corridor.stations.slice(destIdx, originIdx + 1).reverse();

  stationsPath.forEach((station, idx) => {
    if (idx === 0) {
      resultSchedule.push({
        stationId: station.id,
        stationName: station.name,
        arrival: '--:--',
        departure: departureTimeStr,
        status: 'Departing'
      });
    } else {
      const prevStation = stationsPath[idx - 1];
      const dist = Math.abs(station.km - prevStation.km);
      const speedKmh = Math.max(40, train.maxSpeed * 0.85);
      const travelTimeMin = Math.max(1, Math.round((dist / speedKmh) * 60));

      currentTime += travelTimeMin;
      const arrHour = Math.floor(currentTime / 60) % 24;
      const arrMin = Math.round(currentTime % 60);
      const arrivalStr = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;

      // Dwell time
      const dwell = train.priority >= 8 ? 2 : train.category === 'Freight' ? 6 : 3;
      currentTime += dwell;
      const depHourVal = Math.floor(currentTime / 60) % 24;
      const depMinVal = Math.round(currentTime % 60);
      const departureStr = `${String(depHourVal).padStart(2, '0')}:${String(depMinVal).padStart(2, '0')}`;

      resultSchedule.push({
        stationId: station.id,
        stationName: station.name,
        arrival: arrivalStr,
        departure: idx === stationsPath.length - 1 ? '--:--' : departureStr,
        status: 'Scheduled'
      });
    }
  });

  return resultSchedule;
}

/**
 * Main Graph Simulation State Transition Step
 */
export function simulateGraphStep(trains, corridor, timeStepSec = 1, currentSimTime = 0) {
  let updatedTrains = trains.map(t => ({
    ...t,
    schedule: t.schedule ? t.schedule.map(s => ({ ...s })) : []
  }));

  const logs = [];
  const decisions = [];

  // 1. Build occupancy maps for sections and station platforms
  const sectionOccupancy = {};
  corridor.sections.forEach(sec => {
    sectionOccupancy[sec.id] = sec.lines.map(() => null);
  });

  const platformOccupancy = {};
  corridor.stations.forEach(st => {
    st.platforms.forEach(pf => {
      platformOccupancy[pf.id] = null;
    });
  });

  // Populate current occupancies
  updatedTrains.forEach(train => {
    if (train.status === 'Completed') return;

    if (train.locState === 'IN_SECTION' && train.currentSectionId && train.assignedLineIndex !== null) {
      if (sectionOccupancy[train.currentSectionId]) {
        sectionOccupancy[train.currentSectionId][train.assignedLineIndex] = train.id;
      }
    } else if ((train.locState === 'AT_PLATFORM' || train.locState === 'REQUESTING_LINE') && train.currentPlatformId) {
      platformOccupancy[train.currentPlatformId] = train.id;
    }
  });

  // 2. Process active trains in section
  updatedTrains = updatedTrains.map(train => {
    if (train.status === 'Completed') return train;

    if (train.locState === 'IN_SECTION') {
      const section = corridor.sections.find(s => s.id === train.currentSectionId);
      if (!section) return train;

      const isForward = train.direction > 0;
      const speedKms = (train.currentSpeed || train.maxSpeed) / 3600;
      const deltaKm = speedKms * timeStepSec;

      if (isForward) {
        train.km += deltaKm;
      } else {
        train.km -= deltaKm;
      }

      // Check section progress percentage
      const totalSecLen = Math.abs(section.endKm - section.startKm);
      const coveredKm = isForward ? (train.km - section.startKm) : (section.endKm - train.km);
      train.progressPct = Math.min(100, Math.max(0, Math.round((coveredKm / totalSecLen) * 100)));

      // Dynamic Speed Pacing check when approaching next station
      const nextStationId = isForward ? section.toStationId : section.fromStationId;
      const nextStation = corridor.stations.find(s => s.id === nextStationId);
      const distToNextStation = isForward ? (section.endKm - train.km) : (train.km - section.startKm);

      // Check if next station has any free platform
      const freePlatforms = nextStation ? nextStation.platforms.filter(pf => !platformOccupancy[pf.id] || platformOccupancy[pf.id] === train.id) : [];

      if (distToNextStation < 2.5 && freePlatforms.length === 0) {
        // Platform Congestion ahead! Regulate speed down to 40 km/h
        if (!train.pacingAdvisory) {
          train.pacingAdvisory = true;
          train.pacingSpeed = 40;
          train.currentSpeed = 40;
          train.signalAspect = 'YELLOW';
          train.stopsAvoided = (train.stopsAvoided || 0) + 1;

          logs.push({
            timestamp: new Date().toLocaleTimeString(),
            type: 'warning',
            title: 'Dynamic Speed Pacing (Anti-Deadstop)',
            description: `Train ${train.name} (${train.id}) paced down to 40 km/h due to full platforms at ${nextStation.name}.`
          });

          decisions.push({
            trainId: train.id,
            action: 'SPEED_PACING_REGULATION',
            targetSpeed: 40,
            reason: `Platform Congestion at ${nextStation.name}`
          });
        }
      } else if (train.pacingAdvisory && freePlatforms.length > 0) {
        // Platform cleared ahead, resume normal speed
        train.pacingAdvisory = false;
        train.currentSpeed = train.maxSpeed;
        train.signalAspect = 'GREEN';
      }

      // Check Station Arrival
      const hasReachedEnd = isForward ? train.km >= section.endKm : train.km <= section.startKm;
      if (hasReachedEnd) {
        // Allocate free platform at next station
        const allocatedPf = freePlatforms.length > 0 ? freePlatforms[0] : (nextStation ? nextStation.platforms[0] : null);
        const pfId = allocatedPf ? allocatedPf.id : `${nextStationId}-PF1`;
        const pfName = allocatedPf ? allocatedPf.name : 'PF 1';

        train.locState = 'AT_PLATFORM';
        train.currentStationId = nextStationId;
        train.currentPlatformId = pfId;
        train.currentPlatformName = pfName;
        train.currentSpeed = 0;
        train.km = nextStation ? nextStation.km : train.km;
        train.progressPct = 0;
        train.assignedLineIndex = null;
        train.pacingAdvisory = false;

        // Check if this is the final destination
        if (nextStationId === train.destinationStationId) {
          train.status = 'Completed';
          train.signalAspect = 'RED';

          logs.push({
            timestamp: new Date().toLocaleTimeString(),
            type: 'info',
            title: 'Destination Reached',
            description: `Train ${train.name} (${train.id}) arrived at final destination: ${nextStation?.name} (${pfName}).`
          });

          decisions.push({
            trainId: train.id,
            action: 'JOURNEY_COMPLETED',
            stationId: nextStationId,
            platformId: pfId
          });
        } else {
          // Intermediate station dwell time
          train.dwellTimeRemaining = train.priority >= 8 ? 8 : train.category === 'Freight' ? 18 : 12;

          logs.push({
            timestamp: new Date().toLocaleTimeString(),
            type: 'info',
            title: 'Station Arrival',
            description: `Train ${train.name} (${train.id}) arrived at intermediate ${nextStation?.name} on ${pfName}.`
          });

          decisions.push({
            trainId: train.id,
            action: 'PLATFORM_ALLOCATED',
            stationId: nextStationId,
            platformId: pfId
          });
        }

        // Update schedule status
        if (train.schedule) {
          const sIndex = train.schedule.findIndex(s => s.stationId === nextStationId);
          if (sIndex !== -1) {
            train.schedule[sIndex].status = 'Arrived';
          }
        }
      }
    } else if (train.locState === 'AT_PLATFORM') {
      if (train.dwellTimeRemaining > 0) {
        train.dwellTimeRemaining -= timeStepSec;
        train.currentSpeed = 0;
      } else {
        // Dwell finished, request forward line
        train.locState = 'REQUESTING_LINE';
        train.signalAspect = 'YELLOW';
      }
    }

    return train;
  });

  // 3. Line Reservation & Priority Preemption Solver for Trains requesting line
  const requestingTrains = updatedTrains.filter(t => t.locState === 'REQUESTING_LINE');

  // Sort requesting trains by numerical priority (10 down to 1) so Express gets green light first
  requestingTrains.sort((a, b) => (Number(b.priority) || 1) - (Number(a.priority) || 1));

  requestingTrains.forEach(train => {
    const isForward = train.direction > 0;
    const currentStIdx = corridor.stations.findIndex(s => s.id === train.currentStationId);
    if (currentStIdx === -1) return;

    const nextStIdx = isForward ? currentStIdx + 1 : currentStIdx - 1;
    if (nextStIdx < 0 || nextStIdx >= corridor.stations.length) return;

    const nextSt = corridor.stations[nextStIdx];
    const secId = isForward
      ? `SEC-${currentStIdx + 1}-${nextStIdx + 1}`
      : `SEC-${nextStIdx + 1}-${currentStIdx + 1}`;

    const section = corridor.sections.find(s => s.id === secId);
    if (!section) return;

    const lines = sectionOccupancy[secId] || [];

    // Bottleneck Rule (1-Line Section)
    if (section.lineCount === 1) {
      const isLineBusy = lines[0] !== null;

      if (isLineBusy) {
        // Line is busy! Hold train at platform with RED signal
        train.signalAspect = 'RED';
        train.currentSpeed = 0;
        train.delaySeconds = (train.delaySeconds || 0) + timeStepSec;

        const occupyingTrainId = lines[0];
        decisions.push({
          trainId: train.id,
          action: 'PLATFORM_HOLD_RED',
          sectionId: secId,
          reason: `Single-line bottleneck occupied by Train ${occupyingTrainId}`
        });
      } else {
        // Line is FREE! Dispatch high-priority train
        lines[0] = train.id;
        sectionOccupancy[secId][0] = train.id;

        train.locState = 'IN_SECTION';
        train.currentSectionId = secId;
        train.assignedLineIndex = 0;
        train.currentSpeed = train.maxSpeed;
        train.signalAspect = 'GREEN';
        train.km = isForward ? section.startKm : section.endKm;
        train.progressPct = 0;

        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          title: 'Single-Line Clearance Granted',
          description: `Priority ${train.priority} Train ${train.name} (${train.id}) entered bottleneck ${section.name}.`
        });

        decisions.push({
          trainId: train.id,
          action: 'DISPATCH_TO_SINGLE_LINE',
          sectionId: secId,
          lineIndex: 0,
          priority: train.priority
        });
      }
    } else {
      // Multi-Line Section (2 or 3 parallel tracks)
      // Find an unoccupied line
      let freeLineIdx = lines.findIndex(occ => occ === null);

      if (freeLineIdx !== -1) {
        lines[freeLineIdx] = train.id;
        sectionOccupancy[secId][freeLineIdx] = train.id;

        train.locState = 'IN_SECTION';
        train.currentSectionId = secId;
        train.assignedLineIndex = freeLineIdx;
        train.currentSpeed = train.maxSpeed;
        train.signalAspect = 'GREEN';
        train.km = isForward ? section.startKm : section.endKm;
        train.progressPct = 0;

        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          title: 'Multi-Line Dispatch',
          description: `Train ${train.name} (${train.id}) dispatched on Track Line ${freeLineIdx + 1} across ${section.name}.`
        });

        decisions.push({
          trainId: train.id,
          action: 'DISPATCH_TO_MULTI_LINE',
          sectionId: secId,
          lineIndex: freeLineIdx
        });
      } else {
        // All parallel lines full
        train.signalAspect = 'RED';
        train.currentSpeed = 0;
        train.delaySeconds = (train.delaySeconds || 0) + timeStepSec;
      }
    }
  });

  // 4. Capture ML Dataset Record for this time step
  const datasetRecord = {
    step: currentSimTime,
    timestamp: new Date().toISOString(),
    corridorId: corridor.id,
    activeTrainsCount: updatedTrains.filter(t => t.status !== 'Completed').length,
    completedTrainsCount: updatedTrains.filter(t => t.status === 'Completed').length,
    totalDelaySeconds: updatedTrains.reduce((acc, t) => acc + (t.delaySeconds || 0), 0),
    stopsAvoidedTotal: updatedTrains.reduce((acc, t) => acc + (t.stopsAvoided || 0), 0),
    trains: updatedTrains.map(t => ({
      id: t.id,
      name: t.name,
      priority: Number(t.priority) || 1,
      category: t.category,
      speed: Math.round(t.currentSpeed || 0),
      locState: t.locState,
      stationId: t.currentStationId || null,
      platformId: t.currentPlatformId || null,
      sectionId: t.currentSectionId || null,
      lineIndex: t.assignedLineIndex,
      km: Number((t.km || 0).toFixed(2)),
      signal: t.signalAspect,
      pacingAdvisory: t.pacingAdvisory ? 1 : 0
    })),
    decisions
  };

  return {
    trains: updatedTrains,
    logs,
    datasetRecord
  };
}

/**
 * Exports Dataset to JSON format
 */
export function exportDatasetAsJSON(records) {
  const jsonStr = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `railway_traffic_dataset_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports Dataset to Flattened CSV format for Pandas/PyTorch ML ingestion
 */
export function exportDatasetAsCSV(records) {
  if (!records || records.length === 0) return;

  const rows = [];
  rows.push([
    'step',
    'timestamp',
    'corridor_id',
    'train_id',
    'train_name',
    'priority',
    'category',
    'speed_kmh',
    'loc_state',
    'station_id',
    'platform_id',
    'section_id',
    'line_index',
    'km_position',
    'signal_aspect',
    'pacing_advisory',
    'total_delay_sec',
    'stops_avoided'
  ].join(','));

  records.forEach(rec => {
    rec.trains.forEach(t => {
      rows.push([
        rec.step,
        `"${rec.timestamp}"`,
        `"${rec.corridorId}"`,
        `"${t.id}"`,
        `"${t.name}"`,
        t.priority,
        `"${t.category}"`,
        t.speed,
        `"${t.locState}"`,
        `"${t.stationId || ''}"`,
        `"${t.platformId || ''}"`,
        `"${t.sectionId || ''}"`,
        t.lineIndex !== null ? t.lineIndex : -1,
        t.km,
        `"${t.signal}"`,
        t.pacingAdvisory,
        rec.totalDelaySeconds,
        rec.stopsAvoidedTotal
      ].join(','));
    });
  });

  const csvStr = rows.join('\n');
  const blob = new Blob([csvStr], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `railway_traffic_dataset_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
