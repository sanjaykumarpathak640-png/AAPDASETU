export interface RiskInput {
  rainfallMm: number; // e.g., 0 - 200 mm
  waterLevelRatio: number; // current level / danger threshold (e.g. 0.8 - 1.2)
  distanceToFloodBoundaryKm: number; // distance to river/flood edge (0 - 20 km)
  historicalFloodExposure: number; // 0 - 100
  nearbyBlockedRoadsCount: number; // 0 - 5+
}

export interface RiskFactorContribution {
  name: string;
  key: string;
  rawValue: string;
  points: number; // contribution to 0-100 score
  maxPoints: number;
  description: string;
}

export interface RiskAssessmentResult {
  score: number; // 0-100
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  label: string;
  isDemo: boolean;
  contributingFactors: RiskFactorContribution[];
  recommendedAction: string;
  formulaDescription: string;
}

export const RISK_WEIGHTS = {
  rainfall: 25,
  waterLevel: 30,
  proximity: 25,
  historical: 10,
  roadHazards: 10,
};

export function calculateFloodRisk(input: RiskInput, isDemo = true): RiskAssessmentResult {
  // 1. Rainfall score (0 - 25 pts)
  // Severe threshold: 120mm+ gets full points
  const normalizedRainfall = Math.min(1, Math.max(0, input.rainfallMm / 120));
  const rainfallPts = Math.round(normalizedRainfall * RISK_WEIGHTS.rainfall);

  // 2. Water level ratio score (0 - 30 pts)
  // 0.8 is normal (0 pts), 1.0 is danger mark (20 pts), 1.15+ is catastrophic (30 pts)
  const normalizedWater = Math.min(1, Math.max(0, (input.waterLevelRatio - 0.75) / 0.4));
  const waterPts = Math.round(normalizedWater * RISK_WEIGHTS.waterLevel);

  // 3. Proximity score (0 - 25 pts)
  // 0km = max danger (25 pts), 10km+ = safe (0 pts)
  const normalizedProximity = Math.min(1, Math.max(0, (10 - input.distanceToFloodBoundaryKm) / 10));
  const proximityPts = Math.round(normalizedProximity * RISK_WEIGHTS.proximity);

  // 4. Historical exposure (0 - 10 pts)
  const normalizedHistory = Math.min(1, Math.max(0, input.historicalFloodExposure / 100));
  const historyPts = Math.round(normalizedHistory * RISK_WEIGHTS.historical);

  // 5. Blocked roads (0 - 10 pts)
  // 3+ blocked roads nearby gets full 10 pts
  const normalizedRoads = Math.min(1, Math.max(0, input.nearbyBlockedRoadsCount / 3));
  const roadPts = Math.round(normalizedRoads * RISK_WEIGHTS.roadHazards);

  const totalScore = Math.min(100, Math.max(0, rainfallPts + waterPts + proximityPts + historyPts + roadPts));

  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' = 'LOW';
  let label = 'Low Risk';
  let recommendedAction = 'No immediate flood risk detected. Maintain standard monsoon alertness and monitor local advisories.';

  if (totalScore >= 85) {
    level = 'EXTREME';
    label = 'Extreme Risk — Immediate Action Required';
    recommendedAction = 'Imminent flood hazard. Evacuate lowlands immediately to designated elevated shelters. Avoid all inundated roadways.';
  } else if (totalScore >= 60) {
    level = 'HIGH';
    label = 'High Risk — Evacuation Preparation';
    recommendedAction = 'Water levels and rainfall indicate high hazard. Move elderly, children, and livestock to safe ground. Prepare emergency go-bags.';
  } else if (totalScore >= 30) {
    level = 'MODERATE';
    label = 'Moderate Risk — Elevated Caution';
    recommendedAction = 'Localized waterlogging possible. Check shelter capacity and keep battery-powered communication devices charged.';
  }

  const contributingFactors: RiskFactorContribution[] = [
    {
      name: 'Rainfall Severity',
      key: 'rainfall',
      rawValue: `${input.rainfallMm.toFixed(1)} mm`,
      points: rainfallPts,
      maxPoints: RISK_WEIGHTS.rainfall,
      description: input.rainfallMm > 80 ? 'Heavy localized precipitation' : 'Normal to moderate precipitation',
    },
    {
      name: 'River Water Level vs Danger Mark',
      key: 'waterLevel',
      rawValue: `${(input.waterLevelRatio * 100).toFixed(0)}% of danger mark`,
      points: waterPts,
      maxPoints: RISK_WEIGHTS.waterLevel,
      description: input.waterLevelRatio >= 1.0 ? 'Breached danger threshold' : 'Below danger threshold',
    },
    {
      name: 'Proximity to Flood Boundary',
      key: 'proximity',
      rawValue: `${input.distanceToFloodBoundaryKm.toFixed(1)} km`,
      points: proximityPts,
      maxPoints: RISK_WEIGHTS.proximity,
      description: input.distanceToFloodBoundaryKm < 2 ? 'Immediately adjacent to active flood zone' : 'Buffer distance from high hazard zone',
    },
    {
      name: 'Historical Flood Vulnerability',
      key: 'historical',
      rawValue: `${input.historicalFloodExposure}/100`,
      points: historyPts,
      maxPoints: RISK_WEIGHTS.historical,
      description: 'Historical basin inundation index',
    },
    {
      name: 'Nearby Road Obstructions',
      key: 'roads',
      rawValue: `${input.nearbyBlockedRoadsCount} reported`,
      points: roadPts,
      maxPoints: RISK_WEIGHTS.roadHazards,
      description: input.nearbyBlockedRoadsCount > 0 ? 'Surrounding access routes compromised' : 'Access corridors open',
    },
  ];

  return {
    score: totalScore,
    level,
    label,
    isDemo,
    contributingFactors,
    recommendedAction,
    formulaDescription: 'Weighted index: Rainfall (25%) + River Gauge (30%) + Boundary Proximity (25%) + Historical Index (10%) + Local Obstructions (10%).',
  };
}

