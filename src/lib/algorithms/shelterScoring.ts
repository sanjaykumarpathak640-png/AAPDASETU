export interface ShelterEntity {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  occupiedCapacity: number;
  availableBeds: number;
  hasFood: boolean;
  hasDrinkingWater: boolean;
  hasMedical: boolean;
  hasToilets: boolean;
  hasElectricity: boolean;
  isAccessible: boolean;
  contactPhone?: string | null;
  operationalStatus: string;
  isDemo: boolean;
  lastUpdated: Date | string;
}

export interface ShelterScoreResult {
  shelter: ShelterEntity;
  distanceKm: number;
  occupancyPercent: number;
  safetyScore: number; // 0 - 100
  breakdown: {
    distancePoints: number; // max 30
    occupancyPoints: number; // max 20
    floodSafetyPoints: number; // max 20
    resourcePoints: number; // max 30
  };
  recommendationReason: string;
}

export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function rankShelters(
  shelters: ShelterEntity[],
  userLat: number,
  userLng: number,
  nearbyFloodRisk = 50 // 0-100 surrounding flood risk
): ShelterScoreResult[] {
  return shelters
    .map((shelter) => {
      const distanceKm = haversineDistanceKm(userLat, userLng, shelter.latitude, shelter.longitude);
      const occupancyPercent =
        shelter.totalCapacity > 0
          ? Math.round((shelter.occupiedCapacity / shelter.totalCapacity) * 100)
          : 100;

      // 1. Distance points (max 30):
      // 0 km = 30 pts; >= 15 km = 0 pts
      const normalizedDist = Math.max(0, Math.min(1, (15 - distanceKm) / 15));
      const distancePoints = Math.round(normalizedDist * 30);

      // 2. Lower occupancy points (max 20):
      // 0% occupancy = 20 pts; 100% occupancy = 0 pts
      const normalizedOccupancy = Math.max(0, Math.min(1, (100 - occupancyPercent) / 100));
      const occupancyPoints = Math.round(normalizedOccupancy * 20);

      // 3. Lower nearby flood risk (max 20):
      // Elevated or low risk zone gives higher score
      const floodSafetyPoints = Math.round((1 - nearbyFloodRisk / 100) * 20);

      // 4. Resources and Accessibility (max 30):
      // Food: 6, Water: 7, Medical: 6, Toilets: 4, Electricity: 4, Accessibility: 3 = 30 pts
      let resourcePoints = 0;
      if (shelter.hasDrinkingWater) resourcePoints += 7;
      if (shelter.hasFood) resourcePoints += 6;
      if (shelter.hasMedical) resourcePoints += 6;
      if (shelter.hasToilets) resourcePoints += 4;
      if (shelter.hasElectricity) resourcePoints += 4;
      if (shelter.isAccessible) resourcePoints += 3;

      const totalSafetyScore = distancePoints + occupancyPoints + floodSafetyPoints + resourcePoints;

      // Generate transparent explanation
      const reasons: string[] = [];
      if (distanceKm <= 3) reasons.push(`Close proximity (${distanceKm} km)`);
      if (occupancyPercent < 60) reasons.push(`Ample bed capacity (${100 - occupancyPercent}% free)`);
      if (shelter.hasMedical) reasons.push('On-site medical post');
      if (shelter.hasDrinkingWater && shelter.hasFood) reasons.push('Verified food & clean water supplies');
      if (shelter.isAccessible) reasons.push('Wheelchair accessible');

      const recommendationReason =
        reasons.length > 0
          ? `Ranked high due to: ${reasons.join(', ')}.`
          : 'Alternative shelter with standard amenities.';

      return {
        shelter,
        distanceKm,
        occupancyPercent,
        safetyScore: totalSafetyScore,
        breakdown: {
          distancePoints,
          occupancyPoints,
          floodSafetyPoints,
          resourcePoints,
        },
        recommendationReason,
      };
    })
    .sort((a, b) => b.safetyScore - a.safetyScore);
}

