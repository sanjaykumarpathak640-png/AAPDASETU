export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  safetyScore: number; // 0 - 100
  isRecommended: boolean;
  hazardExposureLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  blockedRoadEncountered: boolean;
  cautionRoadsCount: number;
  elevationProfile: 'ELEVATED_EMBANKMENT' | 'GROUND_ARTERIAL' | 'LOWLAND_CUT';
  waypoints: [number, number][]; // lat, lng pairs
  rationale: string;
}

export function evaluateSafeRoutes(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  blockedRoadNames: string[] = ['Old Digha Riverfront Link Road', 'NH-57 Kosi Embankment Bypass']
): RouteOption[] {
  // Compute mid-points for 3 realistic paths:
  // Route A: Elevated Highway / Bypass (Longer, but safe)
  // Route B: Direct City Arterial (Medium distance, caution/waterlogging risk)
  // Route C: Riverfront / Lowland Shortest Path (Shortest, but blocked by rising water!)

  const dLat = destLat - originLat;
  const dLng = destLng - originLng;

  // Base straight-line distance
  const baseDistKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

  // Route A: Elevated Ring Road
  const routeA: RouteOption = {
    id: 'route-a',
    name: 'Route A — Elevated Expressway & Flyover Bypass (Recommended)',
    distanceKm: Math.round((baseDistKm * 1.35 + 1.2) * 10) / 10,
    estimatedTimeMinutes: Math.round(baseDistKm * 1.35 * 3.5 + 8),
    safetyScore: 92,
    isRecommended: true,
    hazardExposureLevel: 'LOW',
    blockedRoadEncountered: false,
    cautionRoadsCount: 0,
    elevationProfile: 'ELEVATED_EMBANKMENT',
    waypoints: [
      [originLat, originLng],
      [originLat + dLat * 0.25 - 0.015, originLng + dLng * 0.15 - 0.02],
      [originLat + dLat * 0.65 - 0.012, originLng + dLng * 0.55 - 0.018],
      [destLat, destLng],
    ],
    rationale: 'Avoids all riverfront lowlands and underpasses. Entire corridor follows elevated embankment and bypass flyover with 0 reported waterlogging.',
  };

  // Route B: Central Arterial Highway
  const routeB: RouteOption = {
    id: 'route-b',
    name: 'Route B — Central Arterial Avenue',
    distanceKm: Math.round((baseDistKm * 1.1 + 0.5) * 10) / 10,
    estimatedTimeMinutes: Math.round(baseDistKm * 1.1 * 4.2 + 5),
    safetyScore: 58,
    isRecommended: false,
    hazardExposureLevel: 'MEDIUM',
    blockedRoadEncountered: false,
    cautionRoadsCount: 2,
    elevationProfile: 'GROUND_ARTERIAL',
    waypoints: [
      [originLat, originLng],
      [originLat + dLat * 0.45 + 0.005, originLng + dLng * 0.4 - 0.005],
      [destLat, destLng],
    ],
    rationale: 'Passes through 2 caution sectors with 20-30cm localized waterlogging near central canal. High-clearance vehicles only.',
  };

  // Route C: Riverfront Lowland Road (Shortest, but flooded!)
  const routeC: RouteOption = {
    id: 'route-c',
    name: 'Route C — Direct Riverfront Cut (DANGEROUS / BLOCKED)',
    distanceKm: Math.round((baseDistKm * 0.95 + 0.2) * 10) / 10,
    estimatedTimeMinutes: 999, // blocked
    safetyScore: 12,
    isRecommended: false,
    hazardExposureLevel: 'CRITICAL',
    blockedRoadEncountered: true,
    cautionRoadsCount: 1,
    elevationProfile: 'LOWLAND_CUT',
    waypoints: [
      [originLat, originLng],
      [originLat + dLat * 0.35 + 0.015, originLng + dLng * 0.45 + 0.018],
      [destLat, destLng],
    ],
    rationale: `CRITICAL HAZARD: Route intersects verified blocked segment (${blockedRoadNames[0] || 'Inundated Road'}) with water depth >90cm. DO NOT ATTEMPT.`,
  };

  return [routeA, routeB, routeC];
}

