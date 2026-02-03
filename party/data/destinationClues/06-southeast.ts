/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Part 6: Southeast (6 brands)
 */

import { DestinationClueSet } from '../types';

export const COCA_COLA: DestinationClueSet = {
  companyId: "coca-cola",
  companyName: "Coca-Cola",
  city: "Atlanta",
  state: "GA",
  region: "Southeast",
  industry: "Food",
  subIndustry: "Beverage",
  clues: {
    weak: [
      {
        id: "cocacola-atlanta",
        text: "Said they're going to Atlanta",
        matchesCity: ["Atlanta"],
        matchesRegion: ["Southeast"],
        strength: "weak"
      },
      {
        id: "cocacola-beverage",
        text: "Mentioned visiting a 'beverage company'",
        matchesSubIndustry: ["Beverage"],
        matchesCompanyId: ["coca-cola", "pepsi"],
        strength: "weak"
      },
      {
        id: "cocacola-iconic",
        text: "Said it's 'probably the most recognized brand in the world'",
        matchesCompanyId: ["coca-cola", "mcdonalds", "apple"],
        strength: "weak"
      },
      {
        id: "cocacola-red",
        text: "Made a comment about 'a very red company'",
        matchesCompanyId: ["coca-cola", "target"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "cocacola-secret",
        text: "Referenced 'the secret formula in the vault'",
        matchesCompanyId: ["coca-cola"],
        strength: "medium"
      },
      {
        id: "cocacola-real-thing",
        text: "Said 'it's the real thing' knowingly",
        matchesCompanyId: ["coca-cola"],
        strength: "medium"
      },
      {
        id: "cocacola-polar-bear",
        text: "Mentioned 'the polar bear commercials'",
        matchesCompanyId: ["coca-cola"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "cocacola-pemberton",
        text: "Referenced 'what Dr. Pemberton mixed up in 1886'",
        matchesCompanyId: ["coca-cola"],
        strength: "strong"
      },
      {
        id: "cocacola-santa",
        text: "Said 'they basically invented modern Santa Claus'",
        matchesCompanyId: ["coca-cola"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "cocacola-gimme",
      text: "Found badge request: 'The Coca-Cola Company, 1 Coca-Cola Plaza, Atlanta GA'",
      matchesCompanyId: ["coca-cola"],
      strength: "gimme"
    }
  }
};

export const DELTA: DestinationClueSet = {
  companyId: "delta",
  companyName: "Delta Air Lines",
  city: "Atlanta",
  state: "GA",
  region: "Southeast",
  industry: "Airline",
  subIndustry: "Major carrier",
  clues: {
    weak: [
      {
        id: "delta-atlanta",
        text: "Said they're going to Atlanta",
        matchesCity: ["Atlanta"],
        matchesRegion: ["Southeast"],
        strength: "weak"
      },
      {
        id: "delta-airline",
        text: "Mentioned visiting an 'airline'",
        matchesIndustry: ["Airline"],
        strength: "weak"
      },
      {
        id: "delta-major",
        text: "Referenced 'one of the big three'",
        matchesCompanyId: ["delta", "united"],
        strength: "weak"
      },
      {
        id: "delta-hub",
        text: "Said they 'hub out of Atlanta'",
        matchesCity: ["Atlanta"],
        matchesCompanyId: ["delta"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "delta-skymiles",
        text: "Mentioned 'SkyMiles' with mixed feelings",
        matchesCompanyId: ["delta"],
        strength: "medium"
      },
      {
        id: "delta-triangle",
        text: "Referenced 'the triangle logo'",
        matchesCompanyId: ["delta"],
        strength: "medium"
      },
      {
        id: "delta-widget",
        text: "Called the logo 'the widget'",
        matchesCompanyId: ["delta"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "delta-mississippi",
        text: "Said they're 'named after the Mississippi Delta region'",
        matchesCompanyId: ["delta"],
        strength: "strong"
      },
      {
        id: "delta-keep-climbing",
        text: "Referenced 'Keep Climbing' as the slogan",
        matchesCompanyId: ["delta"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "delta-gimme",
      text: "Found visitor info: 'Delta Air Lines HQ, 1030 Delta Blvd, Atlanta GA'",
      matchesCompanyId: ["delta"],
      strength: "gimme"
    }
  }
};

export const HOME_DEPOT: DestinationClueSet = {
  companyId: "home-depot",
  companyName: "Home Depot",
  city: "Atlanta",
  state: "GA",
  region: "Southeast",
  industry: "Retail",
  subIndustry: "Home improvement",
  clues: {
    weak: [
      {
        id: "homedepot-atlanta",
        text: "Said they're going to Atlanta",
        matchesCity: ["Atlanta"],
        matchesRegion: ["Southeast"],
        strength: "weak"
      },
      {
        id: "homedepot-retail",
        text: "Mentioned visiting a 'home improvement retailer'",
        matchesSubIndustry: ["Home improvement"],
        matchesCompanyId: ["home-depot"],
        strength: "weak"
      },
      {
        id: "homedepot-diy",
        text: "Made a comment about 'DIY projects'",
        matchesCompanyId: ["home-depot"],
        strength: "weak"
      },
      {
        id: "homedepot-orange",
        text: "Said 'everything is very orange'",
        matchesCompanyId: ["home-depot"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "homedepot-apron",
        text: "Referenced 'the orange aprons'",
        matchesCompanyId: ["home-depot"],
        strength: "medium"
      },
      {
        id: "homedepot-warehouse",
        text: "Mentioned 'warehouse-style stores'",
        matchesCompanyId: ["home-depot", "costco"],
        strength: "medium"
      },
      {
        id: "homedepot-doers",
        text: "Said 'how doers get more done'",
        matchesCompanyId: ["home-depot"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "homedepot-bernie-arthur",
        text: "Mentioned 'what Bernie and Arthur built in Atlanta'",
        matchesCompanyId: ["home-depot"],
        strength: "strong"
      },
      {
        id: "homedepot-lumber",
        text: "Joked about 'the smell of lumber in the morning'",
        matchesCompanyId: ["home-depot"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "homedepot-gimme",
      text: "Found meeting invite: 'The Home Depot HQ, 2455 Paces Ferry Rd, Atlanta GA'",
      matchesCompanyId: ["home-depot"],
      strength: "gimme"
    }
  }
};

export const CHICKFILA: DestinationClueSet = {
  companyId: "chickfila",
  companyName: "Chick-fil-A",
  city: "Atlanta",
  state: "GA",
  region: "Southeast",
  industry: "Food",
  subIndustry: "Fast food",
  clues: {
    weak: [
      {
        id: "chickfila-atlanta",
        text: "Said they're going to Atlanta",
        matchesCity: ["Atlanta"],
        matchesRegion: ["Southeast"],
        strength: "weak"
      },
      {
        id: "chickfila-fastfood",
        text: "Mentioned visiting a 'fast food chain'",
        matchesSubIndustry: ["Fast food"],
        matchesCompanyId: ["chickfila", "mcdonalds", "taco-bell"],
        strength: "weak"
      },
      {
        id: "chickfila-chicken",
        text: "Made a comment about 'chicken sandwiches'",
        matchesCompanyId: ["chickfila"],
        strength: "weak"
      },
      {
        id: "chickfila-polite",
        text: "Said the company is 'famously polite'",
        matchesCompanyId: ["chickfila"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "chickfila-pleasure",
        text: "Said 'my pleasure' with a knowing smile",
        matchesCompanyId: ["chickfila"],
        strength: "medium"
      },
      {
        id: "chickfila-sunday",
        text: "Mentioned they're 'closed on Sundays'",
        matchesCompanyId: ["chickfila"],
        strength: "medium"
      },
      {
        id: "chickfila-cows",
        text: "Referenced 'the cows with the signs'",
        matchesCompanyId: ["chickfila"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "chickfila-eat-mor",
        text: "Said 'Eat Mor Chikin' in a cow voice",
        matchesCompanyId: ["chickfila"],
        strength: "strong"
      },
      {
        id: "chickfila-truett",
        text: "Mentioned 'what Truett Cathy built'",
        matchesCompanyId: ["chickfila"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "chickfila-gimme",
      text: "Found directions: 'Chick-fil-A Corporate, 5200 Buffington Rd, Atlanta GA'",
      matchesCompanyId: ["chickfila"],
      strength: "gimme"
    }
  }
};

export const UPS: DestinationClueSet = {
  companyId: "ups",
  companyName: "UPS",
  city: "Atlanta",
  state: "GA",
  region: "Southeast",
  industry: "Shipping",
  subIndustry: "Package delivery",
  clues: {
    weak: [
      {
        id: "ups-atlanta",
        text: "Said they're going to Atlanta",
        matchesCity: ["Atlanta"],
        matchesRegion: ["Southeast"],
        strength: "weak"
      },
      {
        id: "ups-shipping",
        text: "Mentioned visiting a 'shipping company'",
        matchesIndustry: ["Shipping"],
        matchesCompanyId: ["ups", "fedex"],
        strength: "weak"
      },
      {
        id: "ups-packages",
        text: "Made a comment about 'moving packages'",
        matchesCompanyId: ["ups", "fedex", "amazon"],
        strength: "weak"
      },
      {
        id: "ups-brown",
        text: "Said something about 'a lot of brown'",
        matchesCompanyId: ["ups"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "ups-brown-trucks",
        text: "Referenced 'the brown trucks'",
        matchesCompanyId: ["ups"],
        strength: "medium"
      },
      {
        id: "ups-what-brown",
        text: "Said 'what can brown do for you' ironically",
        matchesCompanyId: ["ups"],
        strength: "medium"
      },
      {
        id: "ups-worldport",
        text: "Mentioned 'Worldport' as the hub",
        matchesCompanyId: ["ups"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "ups-shield",
        text: "Referenced 'the shield logo'",
        matchesCompanyId: ["ups"],
        strength: "strong"
      },
      {
        id: "ups-messenger",
        text: "Mentioned 'started as a messenger service in Seattle'",
        matchesCompanyId: ["ups"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "ups-gimme",
      text: "Found badge request: 'UPS Corporate HQ, 55 Glenlake Pkwy, Atlanta GA'",
      matchesCompanyId: ["ups"],
      strength: "gimme"
    }
  }
};

export const FEDEX: DestinationClueSet = {
  companyId: "fedex",
  companyName: "FedEx",
  city: "Memphis",
  state: "TN",
  region: "Southeast",
  industry: "Shipping",
  subIndustry: "Package delivery",
  clues: {
    weak: [
      {
        id: "fedex-memphis",
        text: "Said they're going to Memphis",
        matchesCity: ["Memphis"],
        matchesRegion: ["Southeast"],
        strength: "weak"
      },
      {
        id: "fedex-shipping",
        text: "Mentioned visiting a 'shipping company'",
        matchesIndustry: ["Shipping"],
        matchesCompanyId: ["fedex", "ups"],
        strength: "weak"
      },
      {
        id: "fedex-overnight",
        text: "Made a comment about 'overnight delivery'",
        matchesCompanyId: ["fedex", "ups"],
        strength: "weak"
      },
      {
        id: "fedex-purple",
        text: "Said 'very purple and orange'",
        matchesCompanyId: ["fedex"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "fedex-arrow",
        text: "Asked if you can see 'the hidden arrow in the logo'",
        matchesCompanyId: ["fedex"],
        strength: "medium"
      },
      {
        id: "fedex-hub-spoke",
        text: "Mentioned 'the hub-and-spoke model'",
        matchesCompanyId: ["fedex"],
        strength: "medium"
      },
      {
        id: "fedex-absolutely",
        text: "Said 'when it absolutely, positively has to be there'",
        matchesCompanyId: ["fedex"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "fedex-fred-smith",
        text: "Referenced 'what Fred Smith proposed in his Yale paper'",
        matchesCompanyId: ["fedex"],
        strength: "strong"
      },
      {
        id: "fedex-castaway",
        text: "Made a joke about 'that Tom Hanks movie'",
        matchesCompanyId: ["fedex"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "fedex-gimme",
      text: "Found meeting details: 'FedEx Corporate HQ, 942 S Shady Grove Rd, Memphis TN'",
      matchesCompanyId: ["fedex"],
      strength: "gimme"
    }
  }
};

export const SOUTHEAST_CLUES: DestinationClueSet[] = [
  COCA_COLA,
  DELTA,
  HOME_DEPOT,
  CHICKFILA,
  UPS,
  FEDEX
];
