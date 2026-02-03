/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Main Index - Combines all regional clue sets
 *
 * Total: 44 brands across 7 regions
 *
 * Each brand has:
 * - 4 weak clues (vague, regional/cultural hints)
 * - 3 medium clues (company-adjacent hints)
 * - 2 strong clues (nearly direct references)
 * - 1 gimme clue (embarrassingly obvious, costs 2 hours)
 */

// Import types from main types file
import {
  DestinationClue,
  DestinationClueSet
} from '../types';

// Import all regional clue sets
import { PACIFIC_NORTHWEST_CLUES } from './01-pacific-northwest';
import { BAY_AREA_CLUES } from './02-bay-area';
import { SOCAL_CLUES } from './03-socal';
import { TEXAS_CLUES } from './04-texas';
import { MIDWEST_CLUES } from './05-midwest';
import { SOUTHEAST_CLUES } from './06-southeast';
import { NORTHEAST_CLUES } from './07-northeast';

// Re-export regional arrays for convenience
export { PACIFIC_NORTHWEST_CLUES } from './01-pacific-northwest';
export { BAY_AREA_CLUES } from './02-bay-area';
export { SOCAL_CLUES } from './03-socal';
export { TEXAS_CLUES } from './04-texas';
export { MIDWEST_CLUES } from './05-midwest';
export { SOUTHEAST_CLUES } from './06-southeast';
export { NORTHEAST_CLUES } from './07-northeast';

// Combined master list
export const ALL_DESTINATION_CLUES: DestinationClueSet[] = [
  ...PACIFIC_NORTHWEST_CLUES,
  ...BAY_AREA_CLUES,
  ...SOCAL_CLUES,
  ...TEXAS_CLUES,
  ...MIDWEST_CLUES,
  ...SOUTHEAST_CLUES,
  ...NORTHEAST_CLUES
];

// Lookup by company ID
export const CLUES_BY_COMPANY_ID = ALL_DESTINATION_CLUES.reduce((acc, clueSet) => {
  acc[clueSet.companyId] = clueSet;
  return acc;
}, {} as Record<string, DestinationClueSet>);

// Lookup by region
export const CLUES_BY_REGION = {
  "Pacific Northwest": PACIFIC_NORTHWEST_CLUES,
  "Bay Area": BAY_AREA_CLUES,
  "SoCal": SOCAL_CLUES,
  "Texas": TEXAS_CLUES,
  "Midwest": MIDWEST_CLUES,
  "Southeast": SOUTHEAST_CLUES,
  "Northeast": NORTHEAST_CLUES
};

/**
 * Get a random clue for a company at a given strength level
 */
export function getRandomClue(
  companyId: string,
  strength: 'weak' | 'medium' | 'strong' | 'gimme'
): DestinationClue | null {
  const clueSet = CLUES_BY_COMPANY_ID[companyId];
  if (!clueSet) return null;

  if (strength === 'gimme') {
    return clueSet.clues.gimme;
  }

  const cluesAtStrength = clueSet.clues[strength];
  if (cluesAtStrength.length === 0) return null;

  return cluesAtStrength[Math.floor(Math.random() * cluesAtStrength.length)];
}

/**
 * Get clues for a location search (returns appropriate strength based on location index)
 * Locations 1-5: weak clues
 * Locations 6-7: medium clues
 * Location 8: gimme (costs 2 hours)
 */
export function getClueForLocation(
  companyId: string,
  locationIndex: number // 1-8
): { clue: DestinationClue | null; cost: number } {
  if (locationIndex === 8) {
    return { clue: getRandomClue(companyId, 'gimme'), cost: 2 };
  }

  if (locationIndex >= 6) {
    return { clue: getRandomClue(companyId, 'medium'), cost: 1 };
  }

  // Some weak locations might also give strong clues (rare)
  if (locationIndex <= 2 && Math.random() < 0.2) {
    return { clue: getRandomClue(companyId, 'strong'), cost: 1 };
  }

  return { clue: getRandomClue(companyId, 'weak'), cost: 1 };
}
