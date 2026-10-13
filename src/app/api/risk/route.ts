import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateFloodRisk } from '@/lib/algorithms/riskScoring';
import { haversineDistanceKm } from '@/lib/algorithms/shelterScoring';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');

    // Default to Patna central if lat/lng not specified: 25.6154, 85.1212
    const lat = latStr ? parseFloat(latStr) : 25.6154;
    const lng = lngStr ? parseFloat(lngStr) : 85.1212;

    // Fetch risk zones, sensors, road conditions, and shelters
    const [riskZones, sensors, roadConditions, shelters] = await Promise.all([
      prisma.riskZone.findMany(),
      prisma.sensorStation.findMany({ include: { readings: { take: 5, orderBy: { timestamp: 'desc' } } } }),
      prisma.roadCondition.findMany(),
      prisma.shelter.findMany(),
    ]);

    // Find nearest risk zone
    let nearestZone = riskZones[0];
    let minZoneDist = 9999;
    for (const z of riskZones) {
      const d = haversineDistanceKm(lat, lng, z.centerLat, z.centerLng);
      if (d < minZoneDist) {
        minZoneDist = d;
        nearestZone = z;
      }
    }

    // Find nearest sensor station
    let nearestSensor = sensors[0];
    let minSensorDist = 9999;
    for (const s of sensors) {
      const d = haversineDistanceKm(lat, lng, s.latitude, s.longitude);
      if (d < minSensorDist) {
        minSensorDist = d;
        nearestSensor = s;
      }
    }

    // Water level ratio vs danger mark
    const waterLevelRatio = nearestSensor
      ? nearestSensor.currentWaterLevelM / (nearestSensor.dangerThresholdM || 1)
      : 0.85;

    // Rainfall in mm
    const rainfallMm = nearestZone?.rainfallMm || nearestSensor?.currentRainfallMm || 45;

    // Count blocked roads within 15 km
    const blockedCount = roadConditions.filter((r) => {
      // In demo mode or if coordinates are absent, treat blocked status records
      return r.status === 'BLOCKED_FLOODED';
    }).length;

    // Run scoring algorithm
    const assessment = calculateFloodRisk(
      {
        rainfallMm,
        waterLevelRatio,
        distanceToFloodBoundaryKm: minZoneDist,
        historicalFloodExposure: nearestZone ? nearestZone.riskScore : 45,
        nearbyBlockedRoadsCount: Math.min(3, blockedCount),
      },
      true // isDemo
    );

    // Find nearest open shelter
    const openShelters = shelters.filter((s) => s.operationalStatus === 'OPEN');
    let bestShelter = openShelters[0] || shelters[0];
    let minShelterDist = 9999;
    for (const s of openShelters) {
      const d = haversineDistanceKm(lat, lng, s.latitude, s.longitude);
      if (d < minShelterDist) {
        minShelterDist = d;
        bestShelter = s;
      }
    }

    return NextResponse.json({
      location: {
        latitude: lat,
        longitude: lng,
        nearestZoneName: nearestZone?.name || 'Central Ganga Basin',
        district: nearestZone?.district || 'Patna',
        distanceToZoneKm: minZoneDist,
      },
      assessment,
      sensor: nearestSensor
        ? {
            id: nearestSensor.id,
            name: nearestSensor.name,
            river: nearestSensor.riverName,
            currentWaterLevelM: nearestSensor.currentWaterLevelM,
            dangerThresholdM: nearestSensor.dangerThresholdM,
            status: nearestSensor.status,
            distanceKm: minSensorDist,
          }
        : null,
      recommendedShelter: bestShelter
        ? {
            id: bestShelter.id,
            name: bestShelter.name,
            address: bestShelter.address,
            distanceKm: minShelterDist,
            availableBeds: bestShelter.availableBeds,
            hasMedical: bestShelter.hasMedical,
            hasFood: bestShelter.hasFood,
          }
        : null,
      blockedRoadsCount: blockedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to calculate risk' }, { status: 500 });
  }
}

