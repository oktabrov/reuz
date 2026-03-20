// ==========================================
// ReUz — Shipping Calculator (UZS / so'm)
// ==========================================

export const REGIONS = [
  'Tashkent',
  'Tashkent Region',
  'Samarkand',
  'Bukhara',
  'Khorezm',
  'Navoi',
  'Kashkadarya',
  'Surkhandarya',
  'Jizzakh',
  'Syrdarya',
  'Andijan',
  'Namangan',
  'Fergana',
  'Karakalpakstan'
];

// Adjacency map — which regions neighbor each other
const adjacency = {
  'Tashkent': ['Tashkent Region', 'Syrdarya'],
  'Tashkent Region': ['Tashkent', 'Syrdarya', 'Jizzakh', 'Namangan'],
  'Samarkand': ['Jizzakh', 'Navoi', 'Kashkadarya'],
  'Bukhara': ['Navoi', 'Kashkadarya', 'Khorezm', 'Karakalpakstan'],
  'Khorezm': ['Bukhara', 'Karakalpakstan'],
  'Navoi': ['Samarkand', 'Bukhara', 'Jizzakh', 'Karakalpakstan'],
  'Kashkadarya': ['Samarkand', 'Bukhara', 'Surkhandarya'],
  'Surkhandarya': ['Kashkadarya'],
  'Jizzakh': ['Tashkent Region', 'Syrdarya', 'Samarkand', 'Navoi'],
  'Syrdarya': ['Tashkent', 'Tashkent Region', 'Jizzakh'],
  'Andijan': ['Fergana', 'Namangan'],
  'Namangan': ['Andijan', 'Fergana', 'Tashkent Region'],
  'Fergana': ['Andijan', 'Namangan'],
  'Karakalpakstan': ['Khorezm', 'Bukhara', 'Navoi']
};

// BFS to find shortest path distance between two regions
function getDistance(from, to) {
  if (from === to) return 0;

  const visited = new Set([from]);
  const queue = [{ region: from, dist: 0 }];

  while (queue.length > 0) {
    const { region, dist } = queue.shift();
    const neighbors = adjacency[region] || [];

    for (const neighbor of neighbors) {
      if (neighbor === to) return dist + 1;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ region: neighbor, dist: dist + 1 });
      }
    }
  }

  return 5; // fallback max distance
}

/**
 * Calculate shipping cost in UZS (so'm) and estimated delivery time
 * Same region: 15,000 so'm, ~5s simulation
 * Neighboring (dist=1): 20,000 so'm, ~8s
 * Medium (dist=2-3): 25,000–30,000 so'm, ~12s
 * Long distance (dist=4+): 35,000–40,000 so'm, ~18s
 */
export function calculateShipping(fromRegion, toRegion) {
  const dist = getDistance(fromRegion, toRegion);

  let cost, estimatedSeconds, label;

  if (dist === 0) {
    cost = 15000;
    estimatedSeconds = 5;
    label = 'Same region';
  } else if (dist === 1) {
    cost = 20000;
    estimatedSeconds = 8;
    label = 'Neighboring region';
  } else if (dist <= 3) {
    cost = dist === 2 ? 25000 : 30000;
    estimatedSeconds = 12;
    label = 'Medium distance';
  } else {
    cost = dist === 4 ? 35000 : 40000;
    estimatedSeconds = 18;
    label = 'Long distance';
  }

  return {
    cost,
    estimatedSeconds,
    label,
    distance: dist,
    fromRegion,
    toRegion
  };
}
