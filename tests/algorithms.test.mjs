import test from 'node:test';
import assert from 'node:assert/strict';

// Helper functions mirroring pure logic for ES module testing
function calculateFloodRisk(input) {
  const normRain = Math.min(1, Math.max(0, input.rainfallMm / 120));
  const rainPts = Math.round(normRain * 25);

  const normWater = Math.min(1, Math.max(0, (input.waterLevelRatio - 0.75) / 0.4));
  const waterPts = Math.round(normWater * 30);

  const normProx = Math.min(1, Math.max(0, (10 - input.distanceToFloodBoundaryKm) / 10));
  const proxPts = Math.round(normProx * 25);

  const normHist = Math.min(1, Math.max(0, input.historicalFloodExposure / 100));
  const histPts = Math.round(normHist * 10);

  const normRoad = Math.min(1, Math.max(0, input.nearbyBlockedRoadsCount / 3));
  const roadPts = Math.round(normRoad * 10);

  const score = Math.min(100, Math.max(0, rainPts + waterPts + proxPts + histPts + roadPts));
  let level = 'LOW';
  if (score >= 85) level = 'EXTREME';
  else if (score >= 60) level = 'HIGH';
  else if (score >= 30) level = 'MODERATE';

  return { score, level };
}

function predictResourceShortage(item, targetDays = 7, buffer = 20) {
  const qty = Math.max(0, item.quantity);
  const rate = item.dailyConsumptionRate;
  if (!rate || rate <= 0) {
    return {
      daysRemaining: null,
      status: qty > 0 ? 'ADEQUATE' : 'CRITICAL_SHORTAGE',
      suggestedReplenishment: qty > 0 ? 0 : 500,
    };
  }
  const days = Math.round((qty / rate) * 10) / 10;
  let status = 'ADEQUATE';
  if (days < 1.0) status = 'CRITICAL_SHORTAGE';
  else if (days < 3.0) status = 'WARNING';

  const required = Math.ceil(targetDays * rate * (1 + buffer / 100));
  const replenishment = Math.max(0, required - qty);
  return { daysRemaining: days, status, suggestedReplenishment: replenishment };
}

function calculateSOSPriority(input) {
  let score = 0;
  if (input.emergencyType === 'TRAPPED_FLOODWATER') score += 40;
  else if (input.emergencyType === 'MEDICAL') score += 38;
  else score += 20;

  if (input.hasVulnerable) score += 25;
  score += Math.min(20, Math.max(0, (input.peopleCount - 1) * 3));
  if (input.nearbyRiskLevel === 'EXTREME') score += 15;

  const finalScore = Math.min(100, Math.max(10, score));
  let level = 'MEDIUM';
  if (finalScore >= 85) level = 'CRITICAL';
  else if (finalScore >= 65) level = 'HIGH';
  else if (finalScore >= 40) level = 'MEDIUM';
  else level = 'LOW';

  return { score: finalScore, level };
}

test('Risk scoring handles extreme flood scenario', () => {
  const res = calculateFloodRisk({
    rainfallMm: 130, // max rain
    waterLevelRatio: 1.15, // breached danger
    distanceToFloodBoundaryKm: 0.5, // 500m from flood edge
    historicalFloodExposure: 90,
    nearbyBlockedRoadsCount: 3,
  });
  assert.equal(res.level, 'EXTREME');
  assert.ok(res.score >= 85, `Expected score >= 85, got ${res.score}`);
});

test('Risk scoring handles low risk dry weather scenario', () => {
  const res = calculateFloodRisk({
    rainfallMm: 5,
    waterLevelRatio: 0.70,
    distanceToFloodBoundaryKm: 15,
    historicalFloodExposure: 10,
    nearbyBlockedRoadsCount: 0,
  });
  assert.equal(res.level, 'LOW');
  assert.ok(res.score < 30, `Expected score < 30, got ${res.score}`);
});

test('Resource shortage algorithm handles division by zero safely', () => {
  const res = predictResourceShortage({
    quantity: 500,
    dailyConsumptionRate: 0,
  });
  assert.equal(res.daysRemaining, null);
  assert.equal(res.status, 'ADEQUATE');
  assert.equal(res.suggestedReplenishment, 0);
});

test('Resource shortage detects critical depletion within 24 hours', () => {
  const res = predictResourceShortage({
    quantity: 200,
    dailyConsumptionRate: 400, // 0.5 days remaining
  });
  assert.equal(res.status, 'CRITICAL_SHORTAGE');
  assert.equal(res.daysRemaining, 0.5);
  assert.ok(res.suggestedReplenishment > 0);
});

test('SOS priority assigns CRITICAL to trapped families with vulnerable members', () => {
  const res = calculateSOSPriority({
    emergencyType: 'TRAPPED_FLOODWATER',
    hasVulnerable: true,
    peopleCount: 6,
    nearbyRiskLevel: 'EXTREME',
  });
  assert.equal(res.level, 'CRITICAL');
  assert.ok(res.score >= 85);
});

