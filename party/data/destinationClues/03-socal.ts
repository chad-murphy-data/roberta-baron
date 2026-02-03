/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Part 3: SoCal (6 brands)
 */

import { DestinationClueSet } from '../types';

export const DISNEY: DestinationClueSet = {
  companyId: "disney",
  companyName: "Disney",
  city: "Burbank",
  state: "CA",
  region: "SoCal",
  industry: "Entertainment",
  subIndustry: "Media conglomerate",
  clues: {
    weak: [
      {
        id: "disney-socal",
        text: "Said they're going to Southern California",
        matchesRegion: ["SoCal"],
        strength: "weak"
      },
      {
        id: "disney-entertainment",
        text: "Mentioned visiting an 'entertainment giant'",
        matchesIndustry: ["Entertainment"],
        matchesCompanyId: ["disney", "netflix"],
        strength: "weak"
      },
      {
        id: "disney-family",
        text: "Said the company is 'for the whole family'",
        matchesCompanyId: ["disney"],
        strength: "weak"
      },
      {
        id: "disney-magic",
        text: "Used the word 'magical' unironically",
        matchesCompanyId: ["disney"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "disney-burbank",
        text: "Said the studio lot is in Burbank",
        matchesCity: ["Burbank"],
        matchesCompanyId: ["disney"],
        strength: "medium"
      },
      {
        id: "disney-castle",
        text: "Referenced 'the castle' as shorthand",
        matchesCompanyId: ["disney"],
        strength: "medium"
      },
      {
        id: "disney-parks",
        text: "Mentioned they 'also run theme parks'",
        matchesCompanyId: ["disney"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "disney-walt",
        text: "Said something about 'what Walt built from a mouse'",
        matchesCompanyId: ["disney"],
        strength: "strong"
      },
      {
        id: "disney-happiest",
        text: "Referenced 'the happiest place on earth'",
        matchesCompanyId: ["disney"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "disney-gimme",
      text: "Found studio pass: 'Walt Disney Studios, 500 S Buena Vista St, Burbank CA'",
      matchesCompanyId: ["disney"],
      strength: "gimme"
    }
  }
};

export const CHIPOTLE: DestinationClueSet = {
  companyId: "chipotle",
  companyName: "Chipotle",
  city: "Newport Beach",
  state: "CA",
  region: "SoCal",
  industry: "Food",
  subIndustry: "Fast casual",
  clues: {
    weak: [
      {
        id: "chipotle-socal",
        text: "Said they're going to Orange County",
        matchesRegion: ["SoCal"],
        matchesState: ["CA"],
        strength: "weak"
      },
      {
        id: "chipotle-food",
        text: "Mentioned visiting a 'fast casual restaurant company'",
        matchesSubIndustry: ["Fast casual"],
        matchesCompanyId: ["chipotle", "sweetgreen"],
        strength: "weak"
      },
      {
        id: "chipotle-mexican",
        text: "Made a comment about 'Mexican-inspired food'",
        matchesCompanyId: ["chipotle", "taco-bell"],
        strength: "weak"
      },
      {
        id: "chipotle-fresh",
        text: "Said the company is 'obsessed with fresh ingredients'",
        matchesCompanyId: ["chipotle", "sweetgreen"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "chipotle-burrito",
        text: "Made a gesture like they were rolling a burrito",
        matchesCompanyId: ["chipotle"],
        strength: "medium"
      },
      {
        id: "chipotle-line",
        text: "Referenced 'the assembly line' style of ordering",
        matchesCompanyId: ["chipotle"],
        strength: "medium"
      },
      {
        id: "chipotle-integrity",
        text: "Mentioned 'food with integrity' as a mission",
        matchesCompanyId: ["chipotle"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "chipotle-guac-extra",
        text: "Joked 'yes, I know the guac is extra'",
        matchesCompanyId: ["chipotle"],
        strength: "strong"
      },
      {
        id: "chipotle-foil",
        text: "Referenced 'those shiny foil-wrapped burritos'",
        matchesCompanyId: ["chipotle"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "chipotle-gimme",
      text: "Found meeting invite: 'Chipotle Corporate, 610 Newport Center Dr, Newport Beach CA'",
      matchesCompanyId: ["chipotle"],
      strength: "gimme"
    }
  }
};

export const TACO_BELL: DestinationClueSet = {
  companyId: "taco-bell",
  companyName: "Taco Bell",
  city: "Irvine",
  state: "CA",
  region: "SoCal",
  industry: "Food",
  subIndustry: "Fast food",
  clues: {
    weak: [
      {
        id: "tacobell-socal",
        text: "Said they're going to Irvine",
        matchesCity: ["Irvine"],
        matchesRegion: ["SoCal"],
        strength: "weak"
      },
      {
        id: "tacobell-fastfood",
        text: "Mentioned a 'fast food chain'",
        matchesSubIndustry: ["Fast food"],
        matchesCompanyId: ["taco-bell", "mcdonalds", "in-n-out"],
        strength: "weak"
      },
      {
        id: "tacobell-mexican",
        text: "Referenced 'Mexican-ish food'",
        matchesCompanyId: ["taco-bell", "chipotle"],
        strength: "weak"
      },
      {
        id: "tacobell-late",
        text: "Made a joke about 'fourth meal'",
        matchesCompanyId: ["taco-bell"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "tacobell-bell",
        text: "Said the logo has 'a bell, obviously'",
        matchesCompanyId: ["taco-bell"],
        strength: "medium"
      },
      {
        id: "tacobell-doritos",
        text: "Referenced 'that collaboration with the chip company'",
        matchesCompanyId: ["taco-bell"],
        strength: "medium"
      },
      {
        id: "tacobell-live-mas",
        text: "Said 'live más' with exaggerated enthusiasm",
        matchesCompanyId: ["taco-bell"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "tacobell-yum",
        text: "Mentioned they're 'part of Yum! Brands'",
        matchesCompanyId: ["taco-bell"],
        strength: "strong"
      },
      {
        id: "tacobell-crunch",
        text: "Referenced 'the Crunchwrap' with genuine reverence",
        matchesCompanyId: ["taco-bell"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "tacobell-gimme",
      text: "Found directions: 'Taco Bell Corp HQ, 1 Glen Bell Way, Irvine CA'",
      matchesCompanyId: ["taco-bell"],
      strength: "gimme"
    }
  }
};

export const PATAGONIA: DestinationClueSet = {
  companyId: "patagonia",
  companyName: "Patagonia",
  city: "Ventura",
  state: "CA",
  region: "SoCal",
  industry: "Apparel",
  subIndustry: "Outdoor wear",
  clues: {
    weak: [
      {
        id: "patagonia-socal",
        text: "Said they're going to a beach town in SoCal",
        matchesRegion: ["SoCal"],
        strength: "weak"
      },
      {
        id: "patagonia-outdoor",
        text: "Mentioned visiting an 'outdoor apparel company'",
        matchesSubIndustry: ["Outdoor wear"],
        matchesCompanyId: ["patagonia", "nike"],
        strength: "weak"
      },
      {
        id: "patagonia-environment",
        text: "Said the company 'cares about the environment'",
        matchesCompanyId: ["patagonia", "whole-foods"],
        strength: "weak"
      },
      {
        id: "patagonia-climbing",
        text: "Made a reference to 'climbing culture'",
        matchesCompanyId: ["patagonia"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "patagonia-ventura",
        text: "Said the HQ is in a small beach town called Ventura",
        matchesCity: ["Ventura"],
        matchesCompanyId: ["patagonia"],
        strength: "medium"
      },
      {
        id: "patagonia-vest",
        text: "Joked about 'the unofficial uniform of finance bros'",
        matchesCompanyId: ["patagonia"],
        strength: "medium"
      },
      {
        id: "patagonia-repair",
        text: "Mentioned they 'repair old gear instead of selling new'",
        matchesCompanyId: ["patagonia"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "patagonia-dont-buy",
        text: "Referenced 'that ad that said Don't Buy This Jacket'",
        matchesCompanyId: ["patagonia"],
        strength: "strong"
      },
      {
        id: "patagonia-yvon",
        text: "Mentioned 'what Yvon built for dirtbag climbers'",
        matchesCompanyId: ["patagonia"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "patagonia-gimme",
      text: "Found visitor info: 'Patagonia HQ, 259 W Santa Clara St, Ventura CA'",
      matchesCompanyId: ["patagonia"],
      strength: "gimme"
    }
  }
};

export const SWEETGREEN: DestinationClueSet = {
  companyId: "sweetgreen",
  companyName: "Sweetgreen",
  city: "Los Angeles",
  state: "CA",
  region: "SoCal",
  industry: "Food",
  subIndustry: "Fast casual",
  clues: {
    weak: [
      {
        id: "sweetgreen-la",
        text: "Said they're going to Los Angeles",
        matchesCity: ["Los Angeles"],
        matchesRegion: ["SoCal"],
        strength: "weak"
      },
      {
        id: "sweetgreen-healthy",
        text: "Mentioned visiting a 'healthy fast food chain'",
        matchesSubIndustry: ["Fast casual"],
        matchesCompanyId: ["sweetgreen", "chipotle"],
        strength: "weak"
      },
      {
        id: "sweetgreen-salad",
        text: "Made a comment about 'elevated salads'",
        matchesCompanyId: ["sweetgreen"],
        strength: "weak"
      },
      {
        id: "sweetgreen-millennial",
        text: "Joked about 'where millennials eat lunch'",
        matchesCompanyId: ["sweetgreen", "chipotle"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "sweetgreen-bowls",
        text: "Referenced 'grain bowls and seasonal menus'",
        matchesCompanyId: ["sweetgreen"],
        strength: "medium"
      },
      {
        id: "sweetgreen-local",
        text: "Mentioned 'sourcing from local farms'",
        matchesCompanyId: ["sweetgreen", "chipotle"],
        strength: "medium"
      },
      {
        id: "sweetgreen-app",
        text: "Said 'everyone orders on the app'",
        matchesCompanyId: ["sweetgreen"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "sweetgreen-georgetown",
        text: "Mentioned 'three Georgetown students who started a salad shop'",
        matchesCompanyId: ["sweetgreen"],
        strength: "strong"
      },
      {
        id: "sweetgreen-robots",
        text: "Referenced 'the salad robots they're testing'",
        matchesCompanyId: ["sweetgreen"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "sweetgreen-gimme",
      text: "Found calendar invite: 'Sweetgreen HQ, Los Angeles CA'",
      matchesCompanyId: ["sweetgreen"],
      strength: "gimme"
    }
  }
};

export const IN_N_OUT: DestinationClueSet = {
  companyId: "in-n-out",
  companyName: "In-N-Out",
  city: "Irvine",
  state: "CA",
  region: "SoCal",
  industry: "Food",
  subIndustry: "Fast food",
  clues: {
    weak: [
      {
        id: "innout-socal",
        text: "Said they're going to Southern California",
        matchesRegion: ["SoCal"],
        strength: "weak"
      },
      {
        id: "innout-burger",
        text: "Mentioned visiting a 'burger chain'",
        matchesSubIndustry: ["Fast food"],
        matchesCompanyId: ["in-n-out", "mcdonalds"],
        strength: "weak"
      },
      {
        id: "innout-westcoast",
        text: "Said it's 'a West Coast thing, you wouldn't understand'",
        matchesCompanyId: ["in-n-out"],
        matchesRegion: ["SoCal", "Bay Area"],
        strength: "weak"
      },
      {
        id: "innout-fresh",
        text: "Referenced 'never frozen, always fresh'",
        matchesCompanyId: ["in-n-out"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "innout-secret",
        text: "Made a knowing reference to 'the secret menu'",
        matchesCompanyId: ["in-n-out"],
        strength: "medium"
      },
      {
        id: "innout-animal",
        text: "Said 'animal style' like it was a password",
        matchesCompanyId: ["in-n-out"],
        strength: "medium"
      },
      {
        id: "innout-palm",
        text: "Mentioned 'crossed palm trees on the cups'",
        matchesCompanyId: ["in-n-out"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "innout-double-double",
        text: "Referenced 'a Double-Double' with reverence",
        matchesCompanyId: ["in-n-out"],
        strength: "strong"
      },
      {
        id: "innout-bible",
        text: "Mentioned 'the Bible verses on the packaging'",
        matchesCompanyId: ["in-n-out"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "innout-gimme",
      text: "Found address: 'In-N-Out Burger Corporate, 4199 Campus Dr, Irvine CA'",
      matchesCompanyId: ["in-n-out"],
      strength: "gimme"
    }
  }
};

export const SOCAL_CLUES: DestinationClueSet[] = [
  DISNEY,
  CHIPOTLE,
  TACO_BELL,
  PATAGONIA,
  SWEETGREEN,
  IN_N_OUT
];
