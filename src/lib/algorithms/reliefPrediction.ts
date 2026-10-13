export interface InventoryItem {
  id: string;
  resourceType: string;
  quantity: number;
  unit: string;
  dailyConsumptionRate: number;
  lastUpdated: Date | string;
}

export interface ReliefPredictionResult {
  inventoryId: string;
  resourceType: string;
  quantity: number;
  unit: string;
  dailyConsumptionRate: number;
  daysRemaining: number | null; // null if consumption rate is 0
  status: 'CRITICAL_SHORTAGE' | 'WARNING' | 'ADEQUATE' | 'UNKNOWN';
  statusText: string;
  suggestedReplenishment: number; // for target 7 days + 20% safety buffer
  explanation: string;
}

export function predictResourceShortage(
  item: InventoryItem,
  targetCoverageDays = 7,
  safetyBufferPercent = 20
): ReliefPredictionResult {
  const quantity = Math.max(0, item.quantity);
  const rate = item.dailyConsumptionRate;

  // Handle zero or invalid consumption rate
  if (!rate || rate <= 0) {
    return {
      inventoryId: item.id,
      resourceType: item.resourceType,
      quantity,
      unit: item.unit,
      dailyConsumptionRate: 0,
      daysRemaining: null,
      status: quantity > 0 ? 'ADEQUATE' : 'CRITICAL_SHORTAGE',
      statusText: quantity > 0 ? 'Stable (No recorded daily drain)' : 'Exhausted (0 stock)',
      suggestedReplenishment: quantity > 0 ? 0 : 500,
      explanation: 'Consumption rate is zero or unrecorded. Time remaining cannot be estimated from burn rate.',
    };
  }

  const daysRemaining = Math.round((quantity / rate) * 10) / 10;
  let status: 'CRITICAL_SHORTAGE' | 'WARNING' | 'ADEQUATE' = 'ADEQUATE';
  let statusText = `Adequate (~${daysRemaining} days remaining)`;

  if (daysRemaining < 1.0) {
    status = 'CRITICAL_SHORTAGE';
    statusText = `CRITICAL: Depleting within ${Math.max(1, Math.round(daysRemaining * 24))} hours!`;
  } else if (daysRemaining < 3.0) {
    status = 'WARNING';
    statusText = `WARNING: Shortage expected within ${daysRemaining} days`;
  }

  // Replenishment formula: (targetDays * rate) * (1 + buffer/100) - currentStock
  const requiredStock = Math.ceil(targetCoverageDays * rate * (1 + safetyBufferPercent / 100));
  const suggestedReplenishment = Math.max(0, requiredStock - quantity);

  return {
    inventoryId: item.id,
    resourceType: item.resourceType,
    quantity,
    unit: item.unit,
    dailyConsumptionRate: rate,
    daysRemaining,
    status,
    statusText,
    suggestedReplenishment,
    explanation: `Calculated from: ${quantity} ${item.unit} ÷ ${rate} ${item.unit}/day = ${daysRemaining} days. Target: ${targetCoverageDays} days coverage + ${safetyBufferPercent}% buffer.`,
  };
}

