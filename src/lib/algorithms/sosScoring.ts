export interface SOSInput {
  emergencyType: string;
  peopleCount: number;
  hasVulnerable: boolean;
  nearbyRiskLevel?: string; // 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'
  description?: string;
}

export interface SOSPriorityResult {
  score: number; // 0-100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
}

export function calculateSOSPriority(input: SOSInput): SOSPriorityResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Emergency Type base urgency (max 40)
  switch (input.emergencyType) {
    case 'TRAPPED_FLOODWATER':
      score += 40;
      reasons.push('Direct rising water entrapment');
      break;
    case 'MEDICAL':
      score += 38;
      reasons.push('Acute medical emergency requiring urgent intervention');
      break;
    case 'EVACUATION':
      score += 25;
      reasons.push('Active evacuation assistance request');
      break;
    case 'FOOD_WATER_NEEDED':
      score += 22;
      reasons.push('Depleted essential survival rations');
      break;
    case 'ELDERLY_ASSISTANCE':
      score += 28;
      reasons.push('Elderly citizen immobility risk');
      break;
    case 'CHILD_ASSISTANCE':
      score += 28;
      reasons.push('Infant/child vulnerability');
      break;
    default:
      score += 15;
      reasons.push('General flood assistance request');
      break;
  }

  // 2. Vulnerable person presence (+25 pts)
  if (input.hasVulnerable) {
    score += 25;
    reasons.push('Presence of elderly/children/mobility-impaired persons');
  }

  // 3. Scale by people count (max 20 pts)
  const peopleBonus = Math.min(20, Math.max(0, (input.peopleCount - 1) * 3));
  if (peopleBonus > 0) {
    score += peopleBonus;
    reasons.push(`${input.peopleCount} individuals reported in cluster`);
  }

  // 4. Surrounding flood risk multiplier (+15 pts)
  if (input.nearbyRiskLevel === 'EXTREME') {
    score += 15;
    reasons.push('Location situated inside Extreme Inundation Zone');
  } else if (input.nearbyRiskLevel === 'HIGH') {
    score += 10;
    reasons.push('Location situated inside High Flood Risk Zone');
  }

  const finalScore = Math.min(100, Math.max(10, score));

  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
  if (finalScore >= 85) {
    level = 'CRITICAL';
  } else if (finalScore >= 65) {
    level = 'HIGH';
  } else if (finalScore >= 40) {
    level = 'MEDIUM';
  } else {
    level = 'LOW';
  }

  const reason = `Priority assessed as ${level} (${finalScore}/100) based on: ${reasons.join('; ')}. Recommended for responder review.`;

  return {
    score: finalScore,
    level,
    reason,
  };
}

