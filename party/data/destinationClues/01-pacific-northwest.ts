/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Part 1: Pacific Northwest (6 brands)
 */

import {
  Region,
  Industry,
  DestinationClue,
  DestinationClueSet
} from '../types';

// Re-export for convenience
export type { Region, Industry, DestinationClue, DestinationClueSet };

// Note: These types are now defined in ../types.ts:
// - Region
// - Industry
// - DestinationClue
// - DestinationClueSet


// =============================================================================
// PACIFIC NORTHWEST (6 brands)
// =============================================================================

export const AMAZON: DestinationClueSet = {
  companyId: "amazon",
  companyName: "Amazon",
  city: "Seattle",
  state: "WA",
  region: "Pacific Northwest",
  industry: "Tech",
  subIndustry: "E-commerce",
  clues: {
    weak: [
      {
        id: "amazon-rain",
        text: "Said something about packing an umbrella for where they're headed",
        matchesRegion: ["Pacific Northwest"],
        excludesRegion: ["Texas", "SoCal", "Southeast"],
        strength: "weak"
      },
      {
        id: "amazon-delivery",
        text: "Kept nervously checking tracking numbers on their phone",
        matchesSubIndustry: ["E-commerce", "Shipping"],
        strength: "weak"
      },
      {
        id: "amazon-boxes",
        text: "Made a joke about 'drowning in cardboard boxes'",
        matchesCompanyId: ["amazon", "ups", "fedex"],
        strength: "weak"
      },
      {
        id: "amazon-tech-retail",
        text: "Mentioned they're going somewhere that 'does everything'",
        matchesCompanyId: ["amazon", "apple", "google"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "amazon-spheres",
        text: "Said they're looking forward to seeing 'those giant glass balls downtown'",
        matchesCompanyId: ["amazon"],
        strength: "medium"
      },
      {
        id: "amazon-prime",
        text: "Made a pun about this being a 'prime' opportunity",
        matchesCompanyId: ["amazon"],
        strength: "medium"
      },
      {
        id: "amazon-forest",
        text: "Said the company is named after something big and wild",
        matchesCompanyId: ["amazon", "patagonia"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "amazon-bezos",
        text: "Referenced 'what Jeff started in his garage with books'",
        matchesCompanyId: ["amazon"],
        strength: "strong"
      },
      {
        id: "amazon-smile",
        text: "Drew a little arrow that looked like a smile on their notepad",
        matchesCompanyId: ["amazon"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "amazon-gimme",
      text: "Found an itinerary: 'Amazon HQ, Seattle - Meeting with AWS leadership'",
      matchesCompanyId: ["amazon"],
      strength: "gimme"
    }
  }
};

export const STARBUCKS: DestinationClueSet = {
  companyId: "starbucks",
  companyName: "Starbucks",
  city: "Seattle",
  state: "WA",
  region: "Pacific Northwest",
  industry: "Food",
  subIndustry: "Coffee",
  clues: {
    weak: [
      {
        id: "starbucks-rain",
        text: "Said they missed the rain where they're heading",
        matchesRegion: ["Pacific Northwest"],
        excludesRegion: ["Texas", "SoCal", "Southeast"],
        strength: "weak"
      },
      {
        id: "starbucks-coffee-snob",
        text: "Complained that the coffee here was 'barely drinkable'",
        matchesSubIndustry: ["Coffee"],
        matchesCompanyId: ["starbucks", "dunkin"],
        strength: "weak"
      },
      {
        id: "starbucks-green",
        text: "Was wearing a very specific shade of green",
        matchesCompanyId: ["starbucks", "whole-foods"],
        strength: "weak"
      },
      {
        id: "starbucks-morning-ritual",
        text: "Said their destination 'runs on caffeine'",
        matchesSubIndustry: ["Coffee"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "starbucks-pike",
        text: "Asked if anyone had recommendations for Pike Place",
        matchesCity: ["Seattle"],
        matchesCompanyId: ["starbucks"],
        strength: "medium"
      },
      {
        id: "starbucks-original",
        text: "Mentioned wanting to visit 'the original store'",
        matchesCompanyId: ["starbucks"],
        strength: "medium"
      },
      {
        id: "starbucks-names",
        text: "Joked about people misspelling names on cups",
        matchesCompanyId: ["starbucks"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "starbucks-siren",
        text: "Said the logo has a 'mythical sea creature'",
        matchesCompanyId: ["starbucks"],
        strength: "strong"
      },
      {
        id: "starbucks-howard",
        text: "Referenced 'what Howard built' with genuine admiration",
        matchesCompanyId: ["starbucks"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "starbucks-gimme",
      text: "Found a sticky note: 'Starbucks HQ, 2401 Utah Ave, Seattle'",
      matchesCompanyId: ["starbucks"],
      strength: "gimme"
    }
  }
};

export const MICROSOFT: DestinationClueSet = {
  companyId: "microsoft",
  companyName: "Microsoft",
  city: "Redmond",
  state: "WA",
  region: "Pacific Northwest",
  industry: "Tech",
  subIndustry: "Software",
  clues: {
    weak: [
      {
        id: "microsoft-pnw",
        text: "Mentioned the destination has 'great hiking nearby'",
        matchesRegion: ["Pacific Northwest"],
        strength: "weak"
      },
      {
        id: "microsoft-tech",
        text: "Said they're meeting with 'the software people'",
        matchesIndustry: ["Tech"],
        matchesSubIndustry: ["Software"],
        strength: "weak"
      },
      {
        id: "microsoft-campus",
        text: "Talked about a 'sprawling suburban campus'",
        matchesCompanyId: ["microsoft", "apple", "google", "meta"],
        strength: "weak"
      },
      {
        id: "microsoft-old-school",
        text: "Called the company 'one of the originals'",
        matchesCompanyId: ["microsoft", "apple", "ibm"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "microsoft-redmond",
        text: "Mentioned it's technically not in Seattle proper",
        matchesCity: ["Redmond", "Bellevue"],
        matchesCompanyId: ["microsoft", "costco"],
        strength: "medium"
      },
      {
        id: "microsoft-windows",
        text: "Made a joke about 'opening windows'",
        matchesCompanyId: ["microsoft"],
        strength: "medium"
      },
      {
        id: "microsoft-xbox",
        text: "Said they might swing by the gaming division",
        matchesCompanyId: ["microsoft"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "microsoft-gates",
        text: "Referenced 'what Bill and Paul built in the 70s'",
        matchesCompanyId: ["microsoft"],
        strength: "strong"
      },
      {
        id: "microsoft-office",
        text: "Joked about 'having a meeting about meetings in Office'",
        matchesCompanyId: ["microsoft"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "microsoft-gimme",
      text: "Found a badge request: 'Microsoft Campus, Building 92, Redmond WA'",
      matchesCompanyId: ["microsoft"],
      strength: "gimme"
    }
  }
};

export const COSTCO: DestinationClueSet = {
  companyId: "costco",
  companyName: "Costco",
  city: "Issaquah",
  state: "WA",
  region: "Pacific Northwest",
  industry: "Retail",
  subIndustry: "Warehouse club",
  clues: {
    weak: [
      {
        id: "costco-pnw",
        text: "Said they're heading to the Seattle area",
        matchesRegion: ["Pacific Northwest"],
        matchesState: ["WA"],
        strength: "weak"
      },
      {
        id: "costco-bulk",
        text: "Joked about needing to 'buy in bulk'",
        matchesCompanyId: ["costco"],
        matchesSubIndustry: ["Warehouse club"],
        strength: "weak"
      },
      {
        id: "costco-retail",
        text: "Mentioned visiting a retailer that 'treats employees well'",
        matchesIndustry: ["Retail"],
        matchesCompanyId: ["costco"],
        strength: "weak"
      },
      {
        id: "costco-samples",
        text: "Made a joke about 'free lunch if you know where to walk'",
        matchesCompanyId: ["costco"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "costco-membership",
        text: "Said something about 'membership has its privileges'",
        matchesCompanyId: ["costco"],
        strength: "medium"
      },
      {
        id: "costco-hotdog",
        text: "Referenced a '$1.50 lunch deal that never changes'",
        matchesCompanyId: ["costco"],
        strength: "medium"
      },
      {
        id: "costco-kirkland",
        text: "Mentioned a 'house brand that's actually good'",
        matchesCompanyId: ["costco"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "costco-issaquah",
        text: "Said the HQ is in a small town east of Seattle",
        matchesCompanyId: ["costco"],
        matchesCity: ["Issaquah"],
        strength: "strong"
      },
      {
        id: "costco-sinegal",
        text: "Mentioned the founder who refused to raise hot dog prices",
        matchesCompanyId: ["costco"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "costco-gimme",
      text: "Found a calendar invite: 'Costco Corporate HQ, Issaquah WA'",
      matchesCompanyId: ["costco"],
      strength: "gimme"
    }
  }
};

export const NIKE: DestinationClueSet = {
  companyId: "nike",
  companyName: "Nike",
  city: "Beaverton",
  state: "OR",
  region: "Pacific Northwest",
  industry: "Apparel",
  subIndustry: "Athletic wear",
  clues: {
    weak: [
      {
        id: "nike-pnw",
        text: "Said they're heading to the Pacific Northwest",
        matchesRegion: ["Pacific Northwest"],
        strength: "weak"
      },
      {
        id: "nike-athletic",
        text: "Mentioned visiting an 'athletic wear company'",
        matchesIndustry: ["Apparel"],
        matchesSubIndustry: ["Athletic wear"],
        matchesCompanyId: ["nike", "patagonia"],
        strength: "weak"
      },
      {
        id: "nike-oregon",
        text: "Said something about Oregon being underrated",
        matchesState: ["OR"],
        strength: "weak"
      },
      {
        id: "nike-sports",
        text: "Referenced a company that 'sponsors everyone'",
        matchesCompanyId: ["nike"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "nike-swoosh",
        text: "Drew a curved checkmark on their notepad",
        matchesCompanyId: ["nike"],
        strength: "medium"
      },
      {
        id: "nike-campus",
        text: "Mentioned the campus has 'buildings named after athletes'",
        matchesCompanyId: ["nike"],
        strength: "medium"
      },
      {
        id: "nike-portland",
        text: "Said it's near Portland but not quite in the city",
        matchesCity: ["Beaverton"],
        matchesCompanyId: ["nike"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "nike-just-do-it",
        text: "Ended a sentence with '...you know, just do it'",
        matchesCompanyId: ["nike"],
        strength: "strong"
      },
      {
        id: "nike-phil",
        text: "Referenced 'what Phil started selling from his car trunk'",
        matchesCompanyId: ["nike"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "nike-gimme",
      text: "Found visitor pass request: 'Nike World Headquarters, Beaverton OR'",
      matchesCompanyId: ["nike"],
      strength: "gimme"
    }
  }
};

export const NORDSTROM: DestinationClueSet = {
  companyId: "nordstrom",
  companyName: "Nordstrom",
  city: "Seattle",
  state: "WA",
  region: "Pacific Northwest",
  industry: "Retail",
  subIndustry: "Department store",
  clues: {
    weak: [
      {
        id: "nordstrom-seattle",
        text: "Said they're heading to Seattle",
        matchesCity: ["Seattle"],
        matchesRegion: ["Pacific Northwest"],
        strength: "weak"
      },
      {
        id: "nordstrom-retail",
        text: "Mentioned visiting 'an upscale retailer'",
        matchesIndustry: ["Retail"],
        matchesCompanyId: ["nordstrom"],
        strength: "weak"
      },
      {
        id: "nordstrom-service",
        text: "Said the company is 'famous for customer service'",
        matchesCompanyId: ["nordstrom", "costco"],
        strength: "weak"
      },
      {
        id: "nordstrom-fashion",
        text: "Made a comment about 'not dressing down for this meeting'",
        matchesSubIndustry: ["Department store"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "nordstrom-shoes",
        text: "Said the company 'started by selling shoes'",
        matchesCompanyId: ["nordstrom"],
        strength: "medium"
      },
      {
        id: "nordstrom-rack",
        text: "Mentioned they might 'check the rack' while they're there",
        matchesCompanyId: ["nordstrom"],
        strength: "medium"
      },
      {
        id: "nordstrom-piano",
        text: "Referenced stores that 'have someone playing piano'",
        matchesCompanyId: ["nordstrom"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "nordstrom-returns",
        text: "Joked about the legendary 'tire return story'",
        matchesCompanyId: ["nordstrom"],
        strength: "strong"
      },
      {
        id: "nordstrom-family",
        text: "Said it's 'still run by the founding family'",
        matchesCompanyId: ["nordstrom"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "nordstrom-gimme",
      text: "Found meeting details: 'Nordstrom Corporate, Downtown Seattle'",
      matchesCompanyId: ["nordstrom"],
      strength: "gimme"
    }
  }
};

export const PACIFIC_NORTHWEST_CLUES: DestinationClueSet[] = [
  AMAZON,
  STARBUCKS,
  MICROSOFT,
  COSTCO,
  NIKE,
  NORDSTROM
];
