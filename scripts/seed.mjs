import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning old demo data ---');
  await prisma.auditLog.deleteMany();
  await prisma.checklistRecord.deleteMany();
  await prisma.sOSStatusHistory.deleteMany();
  await prisma.sOSRequest.deleteMany();
  await prisma.roadCondition.deleteMany();
  await prisma.resourceInventory.deleteMany();
  await prisma.reliefCenter.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.shelter.deleteMany();
  await prisma.publicAlert.deleteMany();
  await prisma.sensorReading.deleteMany();
  await prisma.sensorStation.deleteMany();
  await prisma.riskZone.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.familyGroup.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- Seeding Users ---');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aapdasetu.gov.in',
      passwordHash: 'Admin@12345',
      name: 'Dr. Rajesh Verma (Disaster Commander)',
      role: 'ADMIN',
      phone: '+91 98765 43210',
    },
  });

  const responder = await prisma.user.create({
    data: {
      email: 'responder@aapdasetu.gov.in',
      passwordHash: 'Rescue@12345',
      name: 'Inspector Vikram Singh (NDRF Team 4)',
      role: 'RESPONDER',
      phone: '+91 98765 12345',
    },
  });

  const citizen = await prisma.user.create({
    data: {
      email: 'citizen@aapdasetu.gov.in',
      passwordHash: 'Citizen@12345',
      name: 'Aarav Sharma',
      role: 'CITIZEN',
      phone: '+91 91234 56789',
    },
  });

  console.log('--- Seeding Family Group ---');
  const familyGroup = await prisma.familyGroup.create({
    data: {
      name: 'Sharma Family Safety Circle',
      createdById: citizen.id,
      members: {
        create: [
          {
            name: 'Aarav Sharma',
            role: 'FATHER',
            status: 'SAFE',
            locationLat: 25.6154,
            locationLng: 85.1212,
            locationName: 'Patna High School Relief Wing',
            notes: 'At shelter with provisions',
          },
          {
            name: 'Priya Sharma',
            role: 'MOTHER',
            status: 'MOVING',
            locationLat: 25.6102,
            locationLng: 85.1150,
            locationName: 'En route to Digha Shelter',
            notes: 'Moving along elevated bypass road',
          },
          {
            name: 'Rohan Sharma',
            role: 'CHILD',
            status: 'SAFE',
            locationLat: 25.6154,
            locationLng: 85.1212,
            locationName: 'Patna High School Relief Wing',
            notes: 'Safe with father',
          },
          {
            name: 'Kanta Devi',
            role: 'GRANDPARENT',
            status: 'NEED_HELP',
            locationLat: 25.6290,
            locationLng: 85.1380,
            locationName: 'Sector 3 Lowlands, Near Canal',
            notes: 'Water entering ground floor, mobility issue',
          },
        ],
      },
    },
  });

  console.log('--- Seeding Risk Zones ---');
  await prisma.riskZone.createMany({
    data: [
      {
        name: 'Kosi Catchment Supaul East',
        district: 'Supaul',
        state: 'Bihar',
        riskLevel: 'EXTREME',
        riskScore: 92,
        population: 145000,
        centerLat: 26.1260,
        centerLng: 86.6025,
        rainfallMm: 142.5,
        waterLevelM: 74.2,
        primaryRiver: 'Kosi River',
        isDemo: true,
      },
      {
        name: 'North Patna Lowland Riparian Zone',
        district: 'Patna',
        state: 'Bihar',
        riskLevel: 'HIGH',
        riskScore: 78,
        population: 210000,
        centerLat: 25.6280,
        centerLng: 85.1320,
        rainfallMm: 88.0,
        waterLevelM: 50.8,
        primaryRiver: 'Ganga River',
        isDemo: true,
      },
      {
        name: 'Bagmati Floodplain Muzaffarpur South',
        district: 'Muzaffarpur',
        state: 'Bihar',
        riskLevel: 'HIGH',
        riskScore: 74,
        population: 180000,
        centerLat: 26.0980,
        centerLng: 85.3850,
        rainfallMm: 95.0,
        waterLevelM: 53.4,
        primaryRiver: 'Bagmati River',
        isDemo: true,
      },
      {
        name: 'Samastipur Rural Basin Belt',
        district: 'Samastipur',
        state: 'Bihar',
        riskLevel: 'MODERATE',
        riskScore: 56,
        population: 95000,
        centerLat: 25.8620,
        centerLng: 85.7810,
        rainfallMm: 45.0,
        waterLevelM: 46.2,
        primaryRiver: 'Burhi Gandak River',
        isDemo: true,
      },
      {
        name: 'Darbhanga Central Urban Lowlands',
        district: 'Darbhanga',
        state: 'Bihar',
        riskLevel: 'MODERATE',
        riskScore: 48,
        population: 165000,
        centerLat: 26.1540,
        centerLng: 85.8910,
        rainfallMm: 38.5,
        waterLevelM: 49.1,
        primaryRiver: 'Kamla River',
        isDemo: true,
      },
      {
        name: 'Bhagalpur South Ridge Highground',
        district: 'Bhagalpur',
        state: 'Bihar',
        riskLevel: 'LOW',
        riskScore: 22,
        population: 85000,
        centerLat: 25.2420,
        centerLng: 86.9840,
        rainfallMm: 12.0,
        waterLevelM: 32.5,
        primaryRiver: 'Ganga River',
        isDemo: true,
      },
    ],
  });

  console.log('--- Seeding Sensors & Readings ---');
  const dighaStation = await prisma.sensorStation.create({
    data: {
      name: 'Digha Ghat Gauging Station',
      riverName: 'Ganga River',
      district: 'Patna',
      latitude: 25.6410,
      longitude: 85.1050,
      warningThresholdM: 50.2,
      dangerThresholdM: 51.5,
      currentWaterLevelM: 51.1,
      currentRainfallMm: 92.4,
      status: 'WARNING',
      isDemo: true,
    },
  });

  const baltaraStation = await prisma.sensorStation.create({
    data: {
      name: 'Baltara Gauging Station',
      riverName: 'Kosi River',
      district: 'Khagaria',
      latitude: 25.5200,
      longitude: 86.6400,
      warningThresholdM: 33.8,
      dangerThresholdM: 34.5,
      currentWaterLevelM: 34.9,
      currentRainfallMm: 125.0,
      status: 'DANGER',
      isDemo: true,
    },
  });

  const rewaStation = await prisma.sensorStation.create({
    data: {
      name: 'Rewa Ghat Station',
      riverName: 'Gandak River',
      district: 'Muzaffarpur',
      latitude: 26.0420,
      longitude: 85.0800,
      warningThresholdM: 53.5,
      dangerThresholdM: 54.8,
      currentWaterLevelM: 53.9,
      currentRainfallMm: 78.0,
      status: 'WARNING',
      isDemo: true,
    },
  });

  // Seed time-series historical readings for trends
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    const t = new Date(now - i * 3600 * 1000 * 4); // every 4 hours
    await prisma.sensorReading.create({
      data: {
        stationId: dighaStation.id,
        timestamp: t,
        waterLevelM: 49.5 + (6 - i) * 0.28,
        rainfallMm: 15 + (6 - i) * 12.5,
        dischargeCusecs: 145000 + (6 - i) * 4500,
      },
    });
    await prisma.sensorReading.create({
      data: {
        stationId: baltaraStation.id,
        timestamp: t,
        waterLevelM: 33.2 + (6 - i) * 0.31,
        rainfallMm: 22 + (6 - i) * 16.0,
        dischargeCusecs: 198000 + (6 - i) * 6200,
      },
    });
  }

  console.log('--- Seeding Public Alerts ---');
  await prisma.publicAlert.createMany({
    data: [
      {
        title: 'EXTREME: Flash Flood Inundation in Kosi River Catchment',
        message: 'Water levels at Baltara have breached danger level by 0.4m. Inhabitants in low-lying sectors of Supaul, Saharsa and Khagaria are instructed to evacuate immediately to designated elevated shelters.',
        severity: 'EXTREME',
        area: 'Supaul, Saharsa, Khagaria Districts',
        reason: 'Continuous cloudburst rainfall upstream in Nepal catchment combined with active reservoir spillway discharge.',
        recommendedAction: 'Immediate vertical or regional evacuation. Do not cross culverts or submerged state highways.',
        validFrom: new Date(now - 3600 * 1000 * 2),
        validTo: new Date(now + 3600 * 1000 * 24),
        issuingAuthority: 'State Disaster Management Authority (SDMA - Bihar)',
        isPublished: true,
        isDemo: true,
      },
      {
        title: 'HIGH: Rising Water Levels along Ganga River Corridor',
        message: 'Water elevation at Digha Ghat has exceeded warning marks. Riparian settlements in Patna North and Danapur lowlands placed on high alert.',
        severity: 'HIGH',
        area: 'Patna Riparian Lowlands, Danapur',
        reason: 'Heavy localized precipitation of 88mm coupled with upper basin swell.',
        recommendedAction: 'Move livestock, elderly, and medical supplies to elevated community centers.',
        validFrom: new Date(now - 3600 * 1000 * 6),
        validTo: new Date(now + 3600 * 1000 * 18),
        issuingAuthority: 'Central Water Commission (CWC Flood Division)',
        isPublished: true,
        isDemo: true,
      },
      {
        title: 'MODERATE: Waterlogging & Drainage Surcharge in Darbhanga Urban Sector',
        message: 'Urban lowlands experiencing 2-3 feet stagnant inundation on secondary ring roads.',
        severity: 'MODERATE',
        area: 'Darbhanga Municipal Ward 4 to 12',
        reason: 'Drainage blockage and Kamla Balan high tributary backflow.',
        recommendedAction: 'Use designated bypass routes. Avoid two-wheeler transit through underpasses.',
        validFrom: new Date(now - 3600 * 1000 * 12),
        validTo: new Date(now + 3600 * 1000 * 12),
        issuingAuthority: 'District Emergency Operations Center (DEOC Darbhanga)',
        isPublished: true,
        isDemo: true,
      },
    ],
  });

  console.log('--- Seeding 8+ Shelters ---');
  const s1 = await prisma.shelter.create({
    data: {
      name: 'Patna Community Hall Relief Center',
      address: 'Near Digha Elevated Road, Sector 4, Patna',
      latitude: 25.6210,
      longitude: 85.1120,
      totalCapacity: 500,
      occupiedCapacity: 280,
      availableBeds: 220,
      hasFood: true,
      hasDrinkingWater: true,
      hasMedical: true,
      hasToilets: true,
      hasElectricity: true,
      isAccessible: true,
      contactPhone: '+91 612 254 9911',
      operationalStatus: 'OPEN',
      isDemo: true,
    },
  });

  const s2 = await prisma.shelter.create({
    data: {
      name: 'Muzaffarpur District Sports Complex Shelter',
      address: 'Stadium Road, North Campus, Muzaffarpur',
      latitude: 26.1150,
      longitude: 85.3920,
      totalCapacity: 800,
      occupiedCapacity: 640,
      availableBeds: 160,
      hasFood: true,
      hasDrinkingWater: true,
      hasMedical: true,
      hasToilets: true,
      hasElectricity: true,
      isAccessible: true,
      contactPhone: '+91 621 228 1144',
      operationalStatus: 'OPEN',
      isDemo: true,
    },
  });

  const s3 = await prisma.shelter.create({
    data: {
      name: 'Darbhanga Raj High School Evacuation Center',
      address: 'Raj High Ground, Lalbagh, Darbhanga',
      latitude: 26.1620,
      longitude: 85.8980,
      totalCapacity: 350,
      occupiedCapacity: 120,
      availableBeds: 230,
      hasFood: true,
      hasDrinkingWater: true,
      hasMedical: false,
      hasToilets: true,
      hasElectricity: true,
      isAccessible: false,
      contactPhone: '+91 6272 245 009',
      operationalStatus: 'OPEN',
      isDemo: true,
    },
  });

  const s4 = await prisma.shelter.create({
    data: {
      name: 'Samastipur Railway Stadium Shelter',
      address: 'Station Colony Rd, Railway Grounds, Samastipur',
      latitude: 25.8590,
      longitude: 85.7890,
      totalCapacity: 600,
      occupiedCapacity: 410,
      availableBeds: 190,
      hasFood: true,
      hasDrinkingWater: true,
      hasMedical: true,
      hasToilets: true,
      hasElectricity: false,
      isAccessible: true,
      contactPhone: '+91 6274 222 300',
      operationalStatus: 'OPEN',
      isDemo: true,
    },
  });

  const s5 = await prisma.shelter.create({
    data: {
      name: 'Bhagalpur Zila School Flood Relief Center',
      address: 'Kutchery Road, Southern Ridge, Bhagalpur',
      latitude: 25.2490,
      longitude: 86.9920,
      totalCapacity: 450,
      occupiedCapacity: 95,
      availableBeds: 355,
      hasFood: true,
      hasDrinkingWater: true,
      hasMedical: true,
      hasToilets: true,
      hasElectricity: true,
      isAccessible: true,
      contactPhone: '+91 641 240 8822',
      operationalStatus: 'OPEN',
      isDemo: true,
    },
  });

  const s6 = await prisma.shelter.create({
    data: {
      name: 'Saharsa Polytechnic Emergency Camp',
      address: 'Tiwari Tola, High Elevation Zone, Saharsa',
      latitude: 25.8820,
      longitude: 86.5980,
      totalCapacity: 700,
      occupiedCapacity: 680,
      availableBeds: 20,
      hasFood: true,
      hasDrinkingWater: true,
      hasMedical: true,
      hasToilets: true,
      hasElectricity: true,
      isAccessible: true,
      contactPhone: '+91 6478 221 556',
      operationalStatus: 'FULL',
      isDemo: true,
    },
  });

  const s7 = await prisma.shelter.create({
    data: {
      name: 'Supaul Flood Rehabilitation Center',
      address: 'Circuit House Road, Block A, Supaul',
      latitude: 26.1180,
      longitude: 86.5940,
      totalCapacity: 550,
      occupiedCapacity: 480,
      availableBeds: 70,
      hasFood: true,
      hasDrinkingWater: false,
      hasMedical: true,
      hasToilets: true,
      hasElectricity: true,
      isAccessible: false,
      contactPhone: '+91 6473 224 100',
      operationalStatus: 'OPEN',
      isDemo: true,
    },
  });

  const s8 = await prisma.shelter.create({
    data: {
      name: 'Khagaria Riverfront Disaster Shelter',
      address: 'Bandh Road North, Khagaria Elevated Wing',
      latitude: 25.5080,
      longitude: 86.4710,
      totalCapacity: 400,
      occupiedCapacity: 380,
      availableBeds: 20,
      hasFood: true,
      hasDrinkingWater: true,
      hasMedical: false,
      hasToilets: true,
      hasElectricity: false,
      isAccessible: false,
      contactPhone: '+91 6244 223 901',
      operationalStatus: 'CLOSING',
      isDemo: true,
    },
  });

  console.log('--- Seeding Hospitals ---');
  await prisma.hospital.createMany({
    data: [
      {
        name: 'AIIMS Patna Trauma & Disaster Emergency Center',
        address: 'Phulwari Sharif, Patna, Bihar 801507',
        latitude: 25.5615,
        longitude: 85.0442,
        emergencyBeds: 120,
        availableBeds: 45,
        traumaCareAvailable: true,
        contactPhone: '+91 612 245 1070',
        isDemo: true,
      },
      {
        name: 'Sri Krishna Medical College Hospital (SKMCH)',
        address: 'Muzaffarpur Bypass, Muzaffarpur, Bihar 842004',
        latitude: 26.1510,
        longitude: 85.3620,
        emergencyBeds: 90,
        availableBeds: 18,
        traumaCareAvailable: true,
        contactPhone: '+91 621 223 0220',
        isDemo: true,
      },
      {
        name: 'Darbhanga Medical College & Hospital (DMCH)',
        address: 'Benta Road, Laheriasarai, Darbhanga, Bihar 846003',
        latitude: 26.1340,
        longitude: 85.9010,
        emergencyBeds: 80,
        availableBeds: 22,
        traumaCareAvailable: true,
        contactPhone: '+91 6272 233 111',
        isDemo: true,
      },
      {
        name: 'Jawaharlal Nehru Medical College Hospital (JLNMCH)',
        address: 'Mayaganj, Bhagalpur, Bihar 812001',
        latitude: 25.2530,
        longitude: 87.0010,
        emergencyBeds: 70,
        availableBeds: 31,
        traumaCareAvailable: true,
        contactPhone: '+91 641 240 1022',
        isDemo: true,
      },
    ],
  });

  console.log('--- Seeding Relief Centers & Inventories ---');
  const rc1 = await prisma.reliefCenter.create({
    data: {
      name: 'Patna Central Disaster Warehouse',
      address: 'Danapur Cantonment Depot, Patna',
      latitude: 25.6260,
      longitude: 85.0500,
      centerType: 'WAREHOUSE',
      contactPerson: 'Suresh Chandra (Logistics Head)',
      contactPhone: '+91 94310 11223',
      shelterId: s1.id,
      isDemo: true,
      inventories: {
        create: [
          { resourceType: 'FOOD', quantity: 4200, unit: 'packets', dailyConsumptionRate: 450 },
          { resourceType: 'DRINKING_WATER', quantity: 9500, unit: 'liters', dailyConsumptionRate: 1100 },
          { resourceType: 'MEDICINES', quantity: 380, unit: 'kits', dailyConsumptionRate: 40 },
          { resourceType: 'CHARGING_POWER', quantity: 45, unit: 'generator stations', dailyConsumptionRate: 5 },
          { resourceType: 'TOILETS_SANITATION', quantity: 180, unit: 'mobile units', dailyConsumptionRate: 12 },
          { resourceType: 'BEDDING', quantity: 1400, unit: 'mats & blankets', dailyConsumptionRate: 120 },
          { resourceType: 'RESCUE_EQUIPMENT', quantity: 24, unit: 'inflatable raft kits', dailyConsumptionRate: 2 },
        ],
      },
    },
  });

  const rc2 = await prisma.reliefCenter.create({
    data: {
      name: 'Muzaffarpur Rapid Supply Post',
      address: 'Kalyani Chowk Transit Point, Muzaffarpur',
      latitude: 26.1210,
      longitude: 85.3880,
      centerType: 'DISTRIBUTION',
      contactPerson: 'Anita Rao (Relief Officer)',
      contactPhone: '+91 94310 88990',
      shelterId: s2.id,
      isDemo: true,
      inventories: {
        create: [
          { resourceType: 'FOOD', quantity: 850, unit: 'packets', dailyConsumptionRate: 600 }, // shortage warning!
          { resourceType: 'DRINKING_WATER', quantity: 1400, unit: 'liters', dailyConsumptionRate: 1200 }, // shortage warning!
          { resourceType: 'MEDICINES', quantity: 95, unit: 'kits', dailyConsumptionRate: 35 },
          { resourceType: 'CHARGING_POWER', quantity: 12, unit: 'generator stations', dailyConsumptionRate: 2 },
          { resourceType: 'BEDDING', quantity: 280, unit: 'mats & blankets', dailyConsumptionRate: 90 },
        ],
      },
    },
  });

  const rc3 = await prisma.reliefCenter.create({
    data: {
      name: 'Supaul Forward Emergency Depot',
      address: 'Near Old Embankment Gate, Supaul',
      latitude: 26.1190,
      longitude: 86.5920,
      centerType: 'MOBILE_UNIT',
      contactPerson: 'Mohan Lal (Field Supervisor)',
      contactPhone: '+91 94310 55667',
      shelterId: s7.id,
      isDemo: true,
      inventories: {
        create: [
          { resourceType: 'FOOD', quantity: 320, unit: 'packets', dailyConsumptionRate: 400 }, // critical shortage (< 1 day)
          { resourceType: 'DRINKING_WATER', quantity: 450, unit: 'liters', dailyConsumptionRate: 900 }, // critical shortage
          { resourceType: 'MEDICINES', quantity: 30, unit: 'kits', dailyConsumptionRate: 25 },
          { resourceType: 'BEDDING', quantity: 110, unit: 'mats & blankets', dailyConsumptionRate: 60 },
        ],
      },
    },
  });

  console.log('--- Seeding Road Conditions ---');
  await prisma.roadCondition.createMany({
    data: [
      {
        roadName: 'Old Digha Riverfront Link Road',
        segmentDescription: 'From Gate 22 to Kurji Ghat intersection',
        status: 'BLOCKED_FLOODED',
        waterDepthCm: 95,
        reportedAt: new Date(now - 3600 * 1000 * 3),
        verified: true,
        isDemo: true,
      },
      {
        roadName: 'Bailey Road Underpass (Patna)',
        segmentDescription: 'Near Canal Crossing, lower carriage-way',
        status: 'CAUTION_WATERLOGGED',
        waterDepthCm: 32,
        reportedAt: new Date(now - 3600 * 1000 * 5),
        verified: true,
        isDemo: true,
      },
      {
        roadName: 'Patna Elevated Expressway / AIIMS Link',
        segmentDescription: 'High-elevation arterial bypass corridor',
        status: 'CLEAR',
        waterDepthCm: 0,
        reportedAt: new Date(now - 3600 * 1000 * 1),
        verified: true,
        isDemo: true,
      },
      {
        roadName: 'NH-57 Kosi Embankment Bypass',
        segmentDescription: 'Bridge approach near Baltara',
        status: 'BLOCKED_FLOODED',
        waterDepthCm: 120,
        reportedAt: new Date(now - 3600 * 1000 * 2),
        verified: true,
        isDemo: true,
      },
      {
        roadName: 'Muzaffarpur Ring Road South',
        segmentDescription: 'Between Zero Mile and Ramdayalu Nagar',
        status: 'CAUTION_WATERLOGGED',
        waterDepthCm: 25,
        reportedAt: new Date(now - 3600 * 1000 * 4),
        verified: true,
        isDemo: true,
      },
    ],
  });

  console.log('--- Seeding SOS Requests ---');
  const sos1 = await prisma.sOSRequest.create({
    data: {
      requestNumber: 'SOS-2041',
      emergencyType: 'TRAPPED_FLOODWATER',
      description: 'Family trapped on rooftop as ground floor inundated with 5 feet rising water. No electricity or drinking water.',
      latitude: 25.6310,
      longitude: 85.1280,
      address: 'House #42, Ward 3, Digha Lowlands, Patna',
      peopleCount: 5,
      hasVulnerable: true,
      contactName: 'Sunita Mishra',
      contactPhone: '+91 98711 22334',
      priorityScore: 94,
      priorityLevel: 'CRITICAL',
      priorityReason: 'Trapped by fast-rising floodwater with 2 elderly persons and a child. Ground floor submerged.',
      status: 'ASSIGNED',
      responderId: responder.id,
      responderNotes: 'Boat rescue unit NDRF-04 deployed with life vests.',
      isDemo: true,
      createdAt: new Date(now - 3600 * 1000 * 3),
      statusHistory: {
        create: [
          { status: 'REPORTED', note: 'Incoming emergency SOS via mobile portal', changedBy: 'System', timestamp: new Date(now - 3600 * 1000 * 3) },
          { status: 'ASSIGNED', note: 'Assigned to Inspector Vikram Singh', changedBy: admin.name, timestamp: new Date(now - 3600 * 1000 * 2) },
        ],
      },
    },
  });

  const sos2 = await prisma.sOSRequest.create({
    data: {
      requestNumber: 'SOS-2042',
      emergencyType: 'MEDICAL',
      description: 'Diabetic patient requiring insulin and oxygen support. Inaccessible by normal ambulance due to waterlogged roads.',
      latitude: 26.1280,
      longitude: 86.6010,
      address: 'Village Pipra East, Near Supaul Embankment',
      peopleCount: 2,
      hasVulnerable: true,
      contactName: 'Ramesh Kumar',
      contactPhone: '+91 98711 55667',
      priorityScore: 91,
      priorityLevel: 'CRITICAL',
      priorityReason: 'Urgent medical dependency (insulin/O2) with road obstruction preventing normal transport.',
      status: 'EN_ROUTE',
      responderId: responder.id,
      responderNotes: 'Amphibious medical van dispatched with paramedical team.',
      isDemo: true,
      createdAt: new Date(now - 3600 * 1000 * 4),
      statusHistory: {
        create: [
          { status: 'REPORTED', note: 'Emergency medical report filed', changedBy: 'System', timestamp: new Date(now - 3600 * 1000 * 4) },
          { status: 'ASSIGNED', note: 'Assigned to Amphibious Response Unit', changedBy: admin.name, timestamp: new Date(now - 3600 * 1000 * 3) },
          { status: 'EN_ROUTE', note: 'Unit cleared checkpoint 2 en route', changedBy: responder.name, timestamp: new Date(now - 3600 * 1000 * 1) },
        ],
      },
    },
  });

  const sos3 = await prisma.sOSRequest.create({
    data: {
      requestNumber: 'SOS-2043',
      emergencyType: 'FOOD_WATER_NEEDED',
      description: '12 people stranded at elevated temple building; potable water supply exhausted since yesterday.',
      latitude: 26.1020,
      longitude: 85.3810,
      address: 'Shiv Mandir Compound, South Muzaffarpur',
      peopleCount: 12,
      hasVulnerable: true,
      contactName: 'Pandit Ramakant',
      contactPhone: '+91 98711 88990',
      priorityScore: 76,
      priorityLevel: 'HIGH',
      priorityReason: 'High cluster of stranded citizens (12) without drinking water for >24 hours.',
      status: 'REPORTED',
      isDemo: true,
      createdAt: new Date(now - 3600 * 1000 * 5),
    },
  });

  const sos4 = await prisma.sOSRequest.create({
    data: {
      requestNumber: 'SOS-2044',
      emergencyType: 'EVACUATION',
      description: 'Elderly couple requests safe transfer to designated community shelter before dusk.',
      latitude: 25.8610,
      longitude: 85.7820,
      address: 'Railway Colony Quarter 14, Samastipur',
      peopleCount: 2,
      hasVulnerable: true,
      contactName: 'B.N. Verma',
      contactPhone: '+91 98711 33445',
      priorityScore: 68,
      priorityLevel: 'HIGH',
      priorityReason: 'Evacuation of vulnerable elderly citizens ahead of nightfall and potential surge.',
      status: 'REPORTED',
      isDemo: true,
      createdAt: new Date(now - 3600 * 1000 * 6),
    },
  });

  const sos5 = await prisma.sOSRequest.create({
    data: {
      requestNumber: 'SOS-2040',
      emergencyType: 'TRAPPED_FLOODWATER',
      description: '4 stranded livestock handlers rescued safely and transferred to Bhagalpur Zila School shelter.',
      latitude: 25.2450,
      longitude: 86.9890,
      address: 'Diara Flood Plain, Bhagalpur',
      peopleCount: 4,
      hasVulnerable: false,
      contactName: 'Gopal Yadav',
      contactPhone: '+91 98711 99001',
      priorityScore: 82,
      priorityLevel: 'HIGH',
      priorityReason: 'Rapid water surge in Diara plain.',
      status: 'RESOLVED',
      responderId: responder.id,
      responderNotes: 'All 4 individuals transported to relief shelter with basic supplies.',
      resolvedAt: new Date(now - 3600 * 1000 * 1),
      isDemo: true,
      createdAt: new Date(now - 3600 * 1000 * 8),
      statusHistory: {
        create: [
          { status: 'REPORTED', note: 'Initial alert received', changedBy: 'System', timestamp: new Date(now - 3600 * 1000 * 8) },
          { status: 'ASSIGNED', note: 'Assigned to Boat Patrol 02', changedBy: admin.name, timestamp: new Date(now - 3600 * 1000 * 7) },
          { status: 'EN_ROUTE', note: 'Boat on water', changedBy: responder.name, timestamp: new Date(now - 3600 * 1000 * 5) },
          { status: 'RESOLVED', note: 'Rescue successful; delivered to shelter', changedBy: responder.name, timestamp: new Date(now - 3600 * 1000 * 1) },
        ],
      },
    },
  });

  console.log('--- Seeding Checklist Defaults ---');
  const checklistKeys = [
    'drinking_water',
    'food_supplies',
    'medicines',
    'waterproof_documents',
    'torch_batteries',
    'charged_phone_powerbank',
    'first_aid_kit',
    'emergency_contacts',
    'clothing_sanitation',
  ];

  for (const k of checklistKeys.slice(0, 4)) {
    await prisma.checklistRecord.create({
      data: {
        userId: citizen.id,
        itemKey: k,
        isCompleted: true,
      },
    });
  }

  console.log('--- Seed Completed Successfully! ---');
  console.log('Demo Accounts:');
  console.log('  Admin:     admin@aapdasetu.gov.in     / Admin@12345');
  console.log('  Responder: responder@aapdasetu.gov.in / Rescue@12345');
  console.log('  Citizen:   citizen@aapdasetu.gov.in   / Citizen@12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

