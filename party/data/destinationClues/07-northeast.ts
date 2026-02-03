/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Part 7: Northeast (7 brands, including Fidelity for internal use)
 */

import { DestinationClueSet } from '../types';

export const JPMORGAN: DestinationClueSet = {
  companyId: "jpmorgan",
  companyName: "JPMorgan Chase",
  city: "New York",
  state: "NY",
  region: "Northeast",
  industry: "Finance",
  subIndustry: "Banking",
  clues: {
    weak: [
      {
        id: "jpmorgan-nyc",
        text: "Said they're going to New York",
        matchesCity: ["New York"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      },
      {
        id: "jpmorgan-bank",
        text: "Mentioned visiting a 'big bank'",
        matchesIndustry: ["Finance"],
        matchesSubIndustry: ["Banking"],
        matchesCompanyId: ["jpmorgan"],
        strength: "weak"
      },
      {
        id: "jpmorgan-wallstreet",
        text: "Made a comment about 'Wall Street'",
        matchesCompanyId: ["jpmorgan", "nytimes"],
        matchesCity: ["New York"],
        strength: "weak"
      },
      {
        id: "jpmorgan-biggest",
        text: "Said it's 'the biggest bank in America'",
        matchesCompanyId: ["jpmorgan"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "jpmorgan-chase",
        text: "Mentioned 'the merger with Chase'",
        matchesCompanyId: ["jpmorgan"],
        strength: "medium"
      },
      {
        id: "jpmorgan-park-ave",
        text: "Referenced 'the Park Avenue headquarters'",
        matchesCompanyId: ["jpmorgan"],
        strength: "medium"
      },
      {
        id: "jpmorgan-dimon",
        text: "Said something about 'Jamie running the show'",
        matchesCompanyId: ["jpmorgan"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "jpmorgan-pierpont",
        text: "Referenced 'what J.P. Morgan built in the 1800s'",
        matchesCompanyId: ["jpmorgan"],
        strength: "strong"
      },
      {
        id: "jpmorgan-bailout",
        text: "Mentioned 'the bank that bailed out other banks in 2008'",
        matchesCompanyId: ["jpmorgan"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "jpmorgan-gimme",
      text: "Found meeting request: 'JPMorgan Chase HQ, 383 Madison Ave, New York NY'",
      matchesCompanyId: ["jpmorgan"],
      strength: "gimme"
    }
  }
};

export const NYTIMES: DestinationClueSet = {
  companyId: "nytimes",
  companyName: "The New York Times",
  city: "New York",
  state: "NY",
  region: "Northeast",
  industry: "Media",
  subIndustry: "Newspaper",
  clues: {
    weak: [
      {
        id: "nytimes-nyc",
        text: "Said they're going to New York",
        matchesCity: ["New York"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      },
      {
        id: "nytimes-media",
        text: "Mentioned visiting a 'news organization'",
        matchesIndustry: ["Media"],
        matchesCompanyId: ["nytimes", "espn"],
        strength: "weak"
      },
      {
        id: "nytimes-paper",
        text: "Made a comment about 'the paper of record'",
        matchesCompanyId: ["nytimes"],
        strength: "weak"
      },
      {
        id: "nytimes-journalism",
        text: "Said something about 'serious journalism'",
        matchesCompanyId: ["nytimes"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "nytimes-gray-lady",
        text: "Referenced 'the Gray Lady'",
        matchesCompanyId: ["nytimes"],
        strength: "medium"
      },
      {
        id: "nytimes-crossword",
        text: "Mentioned 'the crossword puzzle'",
        matchesCompanyId: ["nytimes"],
        strength: "medium"
      },
      {
        id: "nytimes-times-square",
        text: "Said the square was 'named after them'",
        matchesCompanyId: ["nytimes"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "nytimes-all-the-news",
        text: "Said 'all the news that's fit to print'",
        matchesCompanyId: ["nytimes"],
        strength: "strong"
      },
      {
        id: "nytimes-sulzberger",
        text: "Mentioned 'the Sulzberger family'",
        matchesCompanyId: ["nytimes"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "nytimes-gimme",
      text: "Found visitor info: 'The New York Times, 620 Eighth Avenue, New York NY'",
      matchesCompanyId: ["nytimes"],
      strength: "gimme"
    }
  }
};

export const PEPSI: DestinationClueSet = {
  companyId: "pepsi",
  companyName: "PepsiCo",
  city: "Purchase",
  state: "NY",
  region: "Northeast",
  industry: "Food",
  subIndustry: "Beverage",
  clues: {
    weak: [
      {
        id: "pepsi-newyork",
        text: "Said they're going to the New York area",
        matchesState: ["NY"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      },
      {
        id: "pepsi-beverage",
        text: "Mentioned visiting a 'beverage company'",
        matchesSubIndustry: ["Beverage"],
        matchesCompanyId: ["pepsi", "coca-cola"],
        strength: "weak"
      },
      {
        id: "pepsi-snacks",
        text: "Said 'they do snacks too, not just drinks'",
        matchesCompanyId: ["pepsi"],
        strength: "weak"
      },
      {
        id: "pepsi-rival",
        text: "Referenced 'the other cola company'",
        matchesCompanyId: ["pepsi", "coca-cola"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "pepsi-frito-lay",
        text: "Mentioned 'Frito-Lay is part of the same company'",
        matchesCompanyId: ["pepsi"],
        strength: "medium"
      },
      {
        id: "pepsi-purchase",
        text: "Said the HQ is in a town literally called Purchase",
        matchesCity: ["Purchase"],
        matchesCompanyId: ["pepsi"],
        strength: "medium"
      },
      {
        id: "pepsi-generation",
        text: "Referenced 'the choice of a new generation'",
        matchesCompanyId: ["pepsi"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "pepsi-challenge",
        text: "Made a joke about 'the Pepsi Challenge'",
        matchesCompanyId: ["pepsi"],
        strength: "strong"
      },
      {
        id: "pepsi-indra",
        text: "Mentioned 'Indra ran the show for years'",
        matchesCompanyId: ["pepsi"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "pepsi-gimme",
      text: "Found calendar invite: 'PepsiCo HQ, 700 Anderson Hill Rd, Purchase NY'",
      matchesCompanyId: ["pepsi"],
      strength: "gimme"
    }
  }
};

export const ESPN: DestinationClueSet = {
  companyId: "espn",
  companyName: "ESPN",
  city: "Bristol",
  state: "CT",
  region: "Northeast",
  industry: "Media",
  subIndustry: "Sports media",
  clues: {
    weak: [
      {
        id: "espn-northeast",
        text: "Said they're going to Connecticut",
        matchesState: ["CT"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      },
      {
        id: "espn-sports",
        text: "Mentioned visiting a 'sports media company'",
        matchesSubIndustry: ["Sports media"],
        matchesCompanyId: ["espn"],
        strength: "weak"
      },
      {
        id: "espn-tv",
        text: "Made a comment about 'sports on TV'",
        matchesCompanyId: ["espn"],
        strength: "weak"
      },
      {
        id: "espn-disney",
        text: "Said 'it's owned by the mouse'",
        matchesCompanyId: ["espn"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "espn-bristol",
        text: "Mentioned 'middle of nowhere Connecticut'",
        matchesCity: ["Bristol"],
        matchesCompanyId: ["espn"],
        strength: "medium"
      },
      {
        id: "espn-sportscenter",
        text: "Referenced 'SportsCenter'",
        matchesCompanyId: ["espn"],
        strength: "medium"
      },
      {
        id: "espn-worldwide",
        text: "Said 'the worldwide leader in sports'",
        matchesCompanyId: ["espn"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "espn-duh-duh-duh",
        text: "Made the 'duh-duh-duh, duh-duh-duh' sound effect",
        matchesCompanyId: ["espn"],
        strength: "strong"
      },
      {
        id: "espn-top-ten",
        text: "Referenced 'the top ten plays'",
        matchesCompanyId: ["espn"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "espn-gimme",
      text: "Found badge request: 'ESPN Campus, 935 Middle St, Bristol CT'",
      matchesCompanyId: ["espn"],
      strength: "gimme"
    }
  }
};

export const DUNKIN: DestinationClueSet = {
  companyId: "dunkin",
  companyName: "Dunkin'",
  city: "Canton",
  state: "MA",
  region: "Northeast",
  industry: "Food",
  subIndustry: "Coffee",
  clues: {
    weak: [
      {
        id: "dunkin-boston",
        text: "Said they're going to the Boston area",
        matchesState: ["MA"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      },
      {
        id: "dunkin-coffee",
        text: "Mentioned visiting a 'coffee chain'",
        matchesSubIndustry: ["Coffee"],
        matchesCompanyId: ["dunkin", "starbucks"],
        strength: "weak"
      },
      {
        id: "dunkin-donuts",
        text: "Made a comment about 'donuts and coffee'",
        matchesCompanyId: ["dunkin"],
        strength: "weak"
      },
      {
        id: "dunkin-newengland",
        text: "Said 'it's a New England thing'",
        matchesCompanyId: ["dunkin"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "dunkin-runs-on",
        text: "Said 'America runs on' this company",
        matchesCompanyId: ["dunkin"],
        strength: "medium"
      },
      {
        id: "dunkin-dropped",
        text: "Mentioned 'they dropped the Donuts from the name'",
        matchesCompanyId: ["dunkin"],
        strength: "medium"
      },
      {
        id: "dunkin-iced",
        text: "Referenced 'iced coffee even in winter'",
        matchesCompanyId: ["dunkin"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "dunkin-time-to-make",
        text: "Said 'time to make the donuts' in a tired voice",
        matchesCompanyId: ["dunkin"],
        strength: "strong"
      },
      {
        id: "dunkin-ben-affleck",
        text: "Made a joke about 'Ben Affleck's favorite place'",
        matchesCompanyId: ["dunkin"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "dunkin-gimme",
      text: "Found meeting details: 'Dunkin' Brands HQ, 130 Royall St, Canton MA'",
      matchesCompanyId: ["dunkin"],
      strength: "gimme"
    }
  }
};

export const JNJ: DestinationClueSet = {
  companyId: "jnj",
  companyName: "Johnson & Johnson",
  city: "New Brunswick",
  state: "NJ",
  region: "Northeast",
  industry: "CPG",
  subIndustry: "Healthcare/Pharma",
  clues: {
    weak: [
      {
        id: "jnj-newjersey",
        text: "Said they're going to New Jersey",
        matchesState: ["NJ"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      },
      {
        id: "jnj-healthcare",
        text: "Mentioned visiting a 'healthcare company'",
        matchesSubIndustry: ["Healthcare/Pharma"],
        matchesCompanyId: ["jnj"],
        strength: "weak"
      },
      {
        id: "jnj-consumer",
        text: "Said 'they make stuff in your medicine cabinet'",
        matchesCompanyId: ["jnj", "pg"],
        strength: "weak"
      },
      {
        id: "jnj-baby",
        text: "Referenced 'baby products'",
        matchesCompanyId: ["jnj"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "jnj-bandaid",
        text: "Mentioned 'Band-Aid is one of their brands'",
        matchesCompanyId: ["jnj"],
        strength: "medium"
      },
      {
        id: "jnj-tylenol",
        text: "Referenced 'Tylenol'",
        matchesCompanyId: ["jnj"],
        strength: "medium"
      },
      {
        id: "jnj-new-brunswick",
        text: "Said the HQ is in New Brunswick",
        matchesCity: ["New Brunswick"],
        matchesCompanyId: ["jnj"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "jnj-credo",
        text: "Referenced 'the credo on the wall'",
        matchesCompanyId: ["jnj"],
        strength: "strong"
      },
      {
        id: "jnj-three-brothers",
        text: "Mentioned 'the three Johnson brothers'",
        matchesCompanyId: ["jnj"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "jnj-gimme",
      text: "Found visitor request: 'Johnson & Johnson HQ, 1 Johnson & Johnson Plaza, New Brunswick NJ'",
      matchesCompanyId: ["jnj"],
      strength: "gimme"
    }
  }
};

export const FIDELITY: DestinationClueSet = {
  companyId: "fidelity",
  companyName: "Fidelity Investments",
  city: "Boston",
  state: "MA",
  region: "Northeast",
  industry: "Finance",
  subIndustry: "Asset management",
  clues: {
    weak: [
      {
        id: "fidelity-boston",
        text: "Said they're going to Boston",
        matchesCity: ["Boston"],
        matchesRegion: ["Northeast"],
        strength: "weak"
      },
      {
        id: "fidelity-finance",
        text: "Mentioned visiting a 'financial services company'",
        matchesIndustry: ["Finance"],
        matchesCompanyId: ["fidelity", "jpmorgan"],
        strength: "weak"
      },
      {
        id: "fidelity-investments",
        text: "Made a comment about 'retirement savings'",
        matchesCompanyId: ["fidelity"],
        strength: "weak"
      },
      {
        id: "fidelity-private",
        text: "Said it's 'still privately held'",
        matchesCompanyId: ["fidelity"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "fidelity-green",
        text: "Referenced 'the green company'",
        matchesCompanyId: ["fidelity", "starbucks"],
        strength: "medium"
      },
      {
        id: "fidelity-401k",
        text: "Mentioned '401(k) management'",
        matchesCompanyId: ["fidelity"],
        strength: "medium"
      },
      {
        id: "fidelity-family",
        text: "Said 'still family-owned after all these years'",
        matchesCompanyId: ["fidelity"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "fidelity-johnson",
        text: "Referenced 'the Johnson family, not that J&J'",
        matchesCompanyId: ["fidelity"],
        strength: "strong"
      },
      {
        id: "fidelity-magellan",
        text: "Mentioned 'the Magellan Fund' with reverence",
        matchesCompanyId: ["fidelity"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "fidelity-gimme",
      text: "Found badge request: 'Fidelity Investments, 245 Summer Street, Boston MA'",
      matchesCompanyId: ["fidelity"],
      strength: "gimme"
    }
  }
};

export const NORTHEAST_CLUES: DestinationClueSet[] = [
  JPMORGAN,
  NYTIMES,
  PEPSI,
  ESPN,
  DUNKIN,
  JNJ,
  FIDELITY
];
