/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Part 5: Midwest (6 brands)
 */

import { DestinationClueSet } from '../types';

export const MCDONALDS: DestinationClueSet = {
  companyId: "mcdonalds",
  companyName: "McDonald's",
  city: "Chicago",
  state: "IL",
  region: "Midwest",
  industry: "Food",
  subIndustry: "Fast food",
  clues: {
    weak: [
      {
        id: "mcdonalds-chicago",
        text: "Said they're going to Chicago",
        matchesCity: ["Chicago"],
        matchesRegion: ["Midwest"],
        strength: "weak"
      },
      {
        id: "mcdonalds-fastfood",
        text: "Mentioned visiting a 'fast food giant'",
        matchesSubIndustry: ["Fast food"],
        matchesCompanyId: ["mcdonalds", "taco-bell", "in-n-out"],
        strength: "weak"
      },
      {
        id: "mcdonalds-global",
        text: "Said it's 'the biggest restaurant company in the world'",
        matchesCompanyId: ["mcdonalds", "starbucks"],
        strength: "weak"
      },
      {
        id: "mcdonalds-kids",
        text: "Made a comment about 'kids meals and playgrounds'",
        matchesCompanyId: ["mcdonalds"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "mcdonalds-arches",
        text: "Referenced 'the golden arches'",
        matchesCompanyId: ["mcdonalds"],
        strength: "medium"
      },
      {
        id: "mcdonalds-lovinit",
        text: "Hummed the 'ba da ba ba ba' jingle",
        matchesCompanyId: ["mcdonalds"],
        strength: "medium"
      },
      {
        id: "mcdonalds-fries",
        text: "Said 'nobody does fries like them'",
        matchesCompanyId: ["mcdonalds"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "mcdonalds-ray",
        text: "Referenced 'what Ray Kroc built from a milkshake machine'",
        matchesCompanyId: ["mcdonalds"],
        strength: "strong"
      },
      {
        id: "mcdonalds-billions",
        text: "Made a joke about 'billions and billions served'",
        matchesCompanyId: ["mcdonalds"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "mcdonalds-gimme",
      text: "Found meeting invite: 'McDonald's HQ, 110 N Carpenter St, Chicago IL'",
      matchesCompanyId: ["mcdonalds"],
      strength: "gimme"
    }
  }
};

export const UNITED: DestinationClueSet = {
  companyId: "united",
  companyName: "United Airlines",
  city: "Chicago",
  state: "IL",
  region: "Midwest",
  industry: "Airline",
  subIndustry: "Major carrier",
  clues: {
    weak: [
      {
        id: "united-chicago",
        text: "Said they're going to Chicago",
        matchesCity: ["Chicago"],
        matchesRegion: ["Midwest"],
        strength: "weak"
      },
      {
        id: "united-airline",
        text: "Mentioned visiting an 'airline'",
        matchesIndustry: ["Airline"],
        strength: "weak"
      },
      {
        id: "united-major",
        text: "Referenced 'one of the big three carriers'",
        matchesCompanyId: ["united", "delta"],
        strength: "weak"
      },
      {
        id: "united-hub",
        text: "Said they 'hub out of O'Hare'",
        matchesCity: ["Chicago"],
        matchesCompanyId: ["united"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "united-friendly",
        text: "Said 'fly the friendly skies' with some irony",
        matchesCompanyId: ["united"],
        strength: "medium"
      },
      {
        id: "united-continental",
        text: "Mentioned 'the merger with Continental'",
        matchesCompanyId: ["united"],
        strength: "medium"
      },
      {
        id: "united-globe",
        text: "Referenced 'the globe logo'",
        matchesCompanyId: ["united", "att"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "united-polaris",
        text: "Mentioned 'Polaris business class'",
        matchesCompanyId: ["united"],
        strength: "strong"
      },
      {
        id: "united-tulip",
        text: "Referenced 'the tulip livery from the Continental days'",
        matchesCompanyId: ["united"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "united-gimme",
      text: "Found badge request: 'United Airlines HQ, Willis Tower, Chicago IL'",
      matchesCompanyId: ["united"],
      strength: "gimme"
    }
  }
};

export const TARGET: DestinationClueSet = {
  companyId: "target",
  companyName: "Target",
  city: "Minneapolis",
  state: "MN",
  region: "Midwest",
  industry: "Retail",
  subIndustry: "Big box",
  clues: {
    weak: [
      {
        id: "target-minnesota",
        text: "Said they're going to Minneapolis",
        matchesCity: ["Minneapolis"],
        matchesRegion: ["Midwest"],
        strength: "weak"
      },
      {
        id: "target-retail",
        text: "Mentioned visiting a 'big box retailer'",
        matchesSubIndustry: ["Big box"],
        matchesCompanyId: ["target"],
        strength: "weak"
      },
      {
        id: "target-affordable",
        text: "Made a comment about 'affordable style'",
        matchesCompanyId: ["target"],
        strength: "weak"
      },
      {
        id: "target-red",
        text: "Said something about 'a lot of red'",
        matchesCompanyId: ["target", "coca-cola"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "target-bullseye",
        text: "Referenced 'the bullseye'",
        matchesCompanyId: ["target"],
        strength: "medium"
      },
      {
        id: "target-tarzhay",
        text: "Called it 'Tar-zhay' with a French accent",
        matchesCompanyId: ["target"],
        strength: "medium"
      },
      {
        id: "target-dog",
        text: "Mentioned 'the dog mascot with the bullseye around its eye'",
        matchesCompanyId: ["target"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "target-dayton",
        text: "Referenced 'what the Dayton family built'",
        matchesCompanyId: ["target"],
        strength: "strong"
      },
      {
        id: "target-expect-more",
        text: "Said 'expect more, pay less'",
        matchesCompanyId: ["target"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "target-gimme",
      text: "Found meeting details: 'Target Corporate, 1000 Nicollet Mall, Minneapolis MN'",
      matchesCompanyId: ["target"],
      strength: "gimme"
    }
  }
};

export const GENERAL_MILLS: DestinationClueSet = {
  companyId: "general-mills",
  companyName: "General Mills",
  city: "Minneapolis",
  state: "MN",
  region: "Midwest",
  industry: "CPG",
  subIndustry: "Packaged food",
  clues: {
    weak: [
      {
        id: "generalmills-minnesota",
        text: "Said they're going to Minneapolis",
        matchesCity: ["Minneapolis"],
        matchesRegion: ["Midwest"],
        strength: "weak"
      },
      {
        id: "generalmills-cpg",
        text: "Mentioned visiting a 'packaged food company'",
        matchesSubIndustry: ["Packaged food"],
        matchesCompanyId: ["general-mills", "pg"],
        strength: "weak"
      },
      {
        id: "generalmills-cereal",
        text: "Made a comment about 'breakfast cereal'",
        matchesCompanyId: ["general-mills"],
        strength: "weak"
      },
      {
        id: "generalmills-brands",
        text: "Said they 'own a lot of brands you'd recognize'",
        matchesCompanyId: ["general-mills", "pg"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "generalmills-cheerios",
        text: "Referenced 'Cheerios' specifically",
        matchesCompanyId: ["general-mills"],
        strength: "medium"
      },
      {
        id: "generalmills-pillsbury",
        text: "Mentioned 'the doughboy'",
        matchesCompanyId: ["general-mills"],
        strength: "medium"
      },
      {
        id: "generalmills-lucky",
        text: "Made a 'magically delicious' reference",
        matchesCompanyId: ["general-mills"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "generalmills-betty",
        text: "Mentioned 'Betty Crocker isn't a real person'",
        matchesCompanyId: ["general-mills"],
        strength: "strong"
      },
      {
        id: "generalmills-big-g",
        text: "Referenced 'the Big G' logo on the box",
        matchesCompanyId: ["general-mills"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "generalmills-gimme",
      text: "Found calendar invite: 'General Mills HQ, 1 General Mills Blvd, Minneapolis MN'",
      matchesCompanyId: ["general-mills"],
      strength: "gimme"
    }
  }
};

export const FORD: DestinationClueSet = {
  companyId: "ford",
  companyName: "Ford",
  city: "Dearborn",
  state: "MI",
  region: "Midwest",
  industry: "Auto",
  subIndustry: "Traditional auto",
  clues: {
    weak: [
      {
        id: "ford-michigan",
        text: "Said they're going to Michigan",
        matchesState: ["MI"],
        matchesRegion: ["Midwest"],
        strength: "weak"
      },
      {
        id: "ford-auto",
        text: "Mentioned visiting an 'automaker'",
        matchesIndustry: ["Auto"],
        strength: "weak"
      },
      {
        id: "ford-detroit",
        text: "Said they're going to the Detroit area",
        matchesCity: ["Detroit", "Dearborn"],
        strength: "weak"
      },
      {
        id: "ford-american",
        text: "Made a comment about 'American manufacturing'",
        matchesCompanyId: ["ford"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "ford-f150",
        text: "Referenced 'the best-selling truck in America'",
        matchesCompanyId: ["ford"],
        strength: "medium"
      },
      {
        id: "ford-blue-oval",
        text: "Mentioned 'the blue oval'",
        matchesCompanyId: ["ford"],
        strength: "medium"
      },
      {
        id: "ford-dearborn",
        text: "Said the HQ is in Dearborn, not Detroit",
        matchesCity: ["Dearborn"],
        matchesCompanyId: ["ford"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "ford-henry",
        text: "Referenced 'what Henry built with the assembly line'",
        matchesCompanyId: ["ford"],
        strength: "strong"
      },
      {
        id: "ford-mustang",
        text: "Said 'Mustang, Bronco, F-150' with reverence",
        matchesCompanyId: ["ford"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "ford-gimme",
      text: "Found visitor pass: 'Ford Motor Company, 1 American Road, Dearborn MI'",
      matchesCompanyId: ["ford"],
      strength: "gimme"
    }
  }
};

export const PG: DestinationClueSet = {
  companyId: "pg",
  companyName: "P&G",
  city: "Cincinnati",
  state: "OH",
  region: "Midwest",
  industry: "CPG",
  subIndustry: "Consumer goods",
  clues: {
    weak: [
      {
        id: "pg-ohio",
        text: "Said they're going to Cincinnati",
        matchesCity: ["Cincinnati"],
        matchesRegion: ["Midwest"],
        strength: "weak"
      },
      {
        id: "pg-cpg",
        text: "Mentioned visiting a 'consumer goods company'",
        matchesIndustry: ["CPG"],
        strength: "weak"
      },
      {
        id: "pg-brands",
        text: "Said they 'own half the brands in your bathroom'",
        matchesCompanyId: ["pg"],
        strength: "weak"
      },
      {
        id: "pg-household",
        text: "Made a comment about 'household staples'",
        matchesCompanyId: ["pg", "general-mills", "jnj"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "pg-tide",
        text: "Referenced 'Tide, Pampers, Gillette'",
        matchesCompanyId: ["pg"],
        strength: "medium"
      },
      {
        id: "pg-gamble",
        text: "Made a pun about 'taking a gamble'",
        matchesCompanyId: ["pg"],
        strength: "medium"
      },
      {
        id: "pg-advertising",
        text: "Mentioned they 'invented modern brand advertising'",
        matchesCompanyId: ["pg"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "pg-soap-opera",
        text: "Said they 'literally invented soap operas'",
        matchesCompanyId: ["pg"],
        strength: "strong"
      },
      {
        id: "pg-moon-stars",
        text: "Referenced 'the old moon and stars logo'",
        matchesCompanyId: ["pg"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "pg-gimme",
      text: "Found meeting details: 'Procter & Gamble HQ, 1 P&G Plaza, Cincinnati OH'",
      matchesCompanyId: ["pg"],
      strength: "gimme"
    }
  }
};

export const MIDWEST_CLUES: DestinationClueSet[] = [
  MCDONALDS,
  UNITED,
  TARGET,
  GENERAL_MILLS,
  FORD,
  PG
];
