/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Part 2: Bay Area (7 brands)
 */

import { DestinationClueSet } from '../types';

export const APPLE: DestinationClueSet = {
  companyId: "apple",
  companyName: "Apple",
  city: "Cupertino",
  state: "CA",
  region: "Bay Area",
  industry: "Tech",
  subIndustry: "Consumer electronics",
  clues: {
    weak: [
      {
        id: "apple-bayarea",
        text: "Said they're headed to Silicon Valley",
        matchesRegion: ["Bay Area"],
        strength: "weak"
      },
      {
        id: "apple-tech",
        text: "Mentioned visiting 'the biggest tech company'",
        matchesIndustry: ["Tech"],
        matchesCompanyId: ["apple", "google", "microsoft"],
        strength: "weak"
      },
      {
        id: "apple-design",
        text: "Said the company is 'obsessed with design'",
        matchesCompanyId: ["apple"],
        strength: "weak"
      },
      {
        id: "apple-secrecy",
        text: "Joked about having to sign 'a dozen NDAs'",
        matchesCompanyId: ["apple", "tesla"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "apple-cupertino",
        text: "Said the campus looks like a spaceship from above",
        matchesCompanyId: ["apple"],
        matchesCity: ["Cupertino"],
        strength: "medium"
      },
      {
        id: "apple-fruit",
        text: "Made a pun about 'the fruit company'",
        matchesCompanyId: ["apple"],
        strength: "medium"
      },
      {
        id: "apple-infinite",
        text: "Referenced 'Infinite Loop' with a knowing smile",
        matchesCompanyId: ["apple"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "apple-steve",
        text: "Said something reverential about 'what Steve built'",
        matchesCompanyId: ["apple"],
        strength: "strong"
      },
      {
        id: "apple-think-different",
        text: "Ended their thought with '...you know, think different'",
        matchesCompanyId: ["apple"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "apple-gimme",
      text: "Found badge request: 'Apple Park, One Apple Park Way, Cupertino CA'",
      matchesCompanyId: ["apple"],
      strength: "gimme"
    }
  }
};

export const GOOGLE: DestinationClueSet = {
  companyId: "google",
  companyName: "Google",
  city: "Mountain View",
  state: "CA",
  region: "Bay Area",
  industry: "Tech",
  subIndustry: "Search/Advertising",
  clues: {
    weak: [
      {
        id: "google-bayarea",
        text: "Said they're going somewhere in the Bay Area",
        matchesRegion: ["Bay Area"],
        strength: "weak"
      },
      {
        id: "google-search",
        text: "Joked about 'looking something up' to find the address",
        matchesCompanyId: ["google"],
        matchesSubIndustry: ["Search"],
        strength: "weak"
      },
      {
        id: "google-campus-food",
        text: "Said the campus has 'amazing free food'",
        matchesCompanyId: ["google", "meta", "apple"],
        strength: "weak"
      },
      {
        id: "google-colorful",
        text: "Mentioned the office is 'very colorful'",
        matchesCompanyId: ["google"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "google-mountainview",
        text: "Said it's in Mountain View, near Stanford",
        matchesCity: ["Mountain View"],
        matchesCompanyId: ["google"],
        strength: "medium"
      },
      {
        id: "google-plex",
        text: "Called the campus 'the plex'",
        matchesCompanyId: ["google"],
        strength: "medium"
      },
      {
        id: "google-bikes",
        text: "Mentioned colorful bikes to get around campus",
        matchesCompanyId: ["google"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "google-larry-sergey",
        text: "Referenced 'what Larry and Sergey started in a garage'",
        matchesCompanyId: ["google"],
        strength: "strong"
      },
      {
        id: "google-dont-be-evil",
        text: "Made an ironic comment about 'not being evil'",
        matchesCompanyId: ["google"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "google-gimme",
      text: "Found calendar invite: 'Googleplex, 1600 Amphitheatre Parkway, Mountain View'",
      matchesCompanyId: ["google"],
      strength: "gimme"
    }
  }
};

export const META: DestinationClueSet = {
  companyId: "meta",
  companyName: "Meta",
  city: "Menlo Park",
  state: "CA",
  region: "Bay Area",
  industry: "Tech",
  subIndustry: "Social media",
  clues: {
    weak: [
      {
        id: "meta-bayarea",
        text: "Said they're heading to Silicon Valley",
        matchesRegion: ["Bay Area"],
        strength: "weak"
      },
      {
        id: "meta-social",
        text: "Mentioned visiting a 'social media company'",
        matchesSubIndustry: ["Social media"],
        matchesCompanyId: ["meta"],
        strength: "weak"
      },
      {
        id: "meta-rebranded",
        text: "Said the company 'changed their name recently'",
        matchesCompanyId: ["meta"],
        strength: "weak"
      },
      {
        id: "meta-vr",
        text: "Made a comment about 'the future being virtual'",
        matchesCompanyId: ["meta", "apple"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "meta-menlo",
        text: "Said the campus is in Menlo Park",
        matchesCity: ["Menlo Park"],
        matchesCompanyId: ["meta"],
        strength: "medium"
      },
      {
        id: "meta-thumbs-up",
        text: "Made a thumbs up gesture when describing the old logo",
        matchesCompanyId: ["meta"],
        strength: "medium"
      },
      {
        id: "meta-hacker",
        text: "Mentioned 'Hacker Way' is actually the street address",
        matchesCompanyId: ["meta"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "meta-zuck",
        text: "Referenced 'what Mark built in his dorm room'",
        matchesCompanyId: ["meta"],
        strength: "strong"
      },
      {
        id: "meta-infinity",
        text: "Drew a sideways figure-eight when describing the new logo",
        matchesCompanyId: ["meta"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "meta-gimme",
      text: "Found visitor pass: 'Meta HQ, 1 Hacker Way, Menlo Park CA'",
      matchesCompanyId: ["meta"],
      strength: "gimme"
    }
  }
};

export const NETFLIX: DestinationClueSet = {
  companyId: "netflix",
  companyName: "Netflix",
  city: "Los Gatos",
  state: "CA",
  region: "Bay Area",
  industry: "Entertainment",
  subIndustry: "Streaming",
  clues: {
    weak: [
      {
        id: "netflix-bayarea",
        text: "Said they're going to the Bay Area",
        matchesRegion: ["Bay Area"],
        strength: "weak"
      },
      {
        id: "netflix-streaming",
        text: "Mentioned visiting a 'streaming company'",
        matchesSubIndustry: ["Streaming"],
        matchesCompanyId: ["netflix", "disney"],
        strength: "weak"
      },
      {
        id: "netflix-binge",
        text: "Joked about 'binge-watching' the presentation",
        matchesCompanyId: ["netflix"],
        strength: "weak"
      },
      {
        id: "netflix-entertainment",
        text: "Said the company 'changed how we watch TV'",
        matchesIndustry: ["Entertainment"],
        matchesCompanyId: ["netflix", "disney"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "netflix-losgatos",
        text: "Said the office is in a small town called Los Gatos",
        matchesCity: ["Los Gatos"],
        matchesCompanyId: ["netflix"],
        strength: "medium"
      },
      {
        id: "netflix-dvd",
        text: "Mentioned they 'used to mail DVDs, can you believe it?'",
        matchesCompanyId: ["netflix"],
        strength: "medium"
      },
      {
        id: "netflix-red-envelope",
        text: "Referenced 'those old red envelopes'",
        matchesCompanyId: ["netflix"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "netflix-reed",
        text: "Mentioned 'what Reed built after that video store charged him a late fee'",
        matchesCompanyId: ["netflix"],
        strength: "strong"
      },
      {
        id: "netflix-tudum",
        text: "Made a 'ta-dum' sound effect when describing the brand",
        matchesCompanyId: ["netflix"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "netflix-gimme",
      text: "Found meeting details: 'Netflix HQ, 100 Winchester Circle, Los Gatos CA'",
      matchesCompanyId: ["netflix"],
      strength: "gimme"
    }
  }
};

export const SALESFORCE: DestinationClueSet = {
  companyId: "salesforce",
  companyName: "Salesforce",
  city: "San Francisco",
  state: "CA",
  region: "Bay Area",
  industry: "Tech",
  subIndustry: "Enterprise software",
  clues: {
    weak: [
      {
        id: "salesforce-sf",
        text: "Said they're going to San Francisco",
        matchesCity: ["San Francisco"],
        matchesRegion: ["Bay Area"],
        strength: "weak"
      },
      {
        id: "salesforce-enterprise",
        text: "Mentioned visiting an 'enterprise software company'",
        matchesSubIndustry: ["Enterprise software"],
        matchesCompanyId: ["salesforce"],
        strength: "weak"
      },
      {
        id: "salesforce-crm",
        text: "Made a comment about 'customer relationships'",
        matchesCompanyId: ["salesforce"],
        strength: "weak"
      },
      {
        id: "salesforce-cloud",
        text: "Said the company was 'early to the cloud'",
        matchesCompanyId: ["salesforce", "amazon"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "salesforce-tower",
        text: "Referenced 'the tallest building in San Francisco'",
        matchesCompanyId: ["salesforce"],
        strength: "medium"
      },
      {
        id: "salesforce-hawaiian",
        text: "Mentioned the founder 'always wears Hawaiian shirts'",
        matchesCompanyId: ["salesforce"],
        strength: "medium"
      },
      {
        id: "salesforce-ohana",
        text: "Said something about 'ohana' being part of the culture",
        matchesCompanyId: ["salesforce"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "salesforce-marc",
        text: "Referenced 'what Marc built after leaving Oracle'",
        matchesCompanyId: ["salesforce"],
        strength: "strong"
      },
      {
        id: "salesforce-no-software",
        text: "Drew a circle with a slash through the word 'software'",
        matchesCompanyId: ["salesforce"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "salesforce-gimme",
      text: "Found badge request: 'Salesforce Tower, 415 Mission St, San Francisco'",
      matchesCompanyId: ["salesforce"],
      strength: "gimme"
    }
  }
};

export const UBER: DestinationClueSet = {
  companyId: "uber",
  companyName: "Uber",
  city: "San Francisco",
  state: "CA",
  region: "Bay Area",
  industry: "Tech",
  subIndustry: "Rideshare",
  clues: {
    weak: [
      {
        id: "uber-sf",
        text: "Said they're meeting someone in San Francisco",
        matchesCity: ["San Francisco"],
        matchesRegion: ["Bay Area"],
        strength: "weak"
      },
      {
        id: "uber-rideshare",
        text: "Joked about 'getting a ride' to the meeting",
        matchesSubIndustry: ["Rideshare"],
        matchesCompanyId: ["uber"],
        strength: "weak"
      },
      {
        id: "uber-disruptor",
        text: "Called the company 'the original disruptor'",
        matchesCompanyId: ["uber"],
        strength: "weak"
      },
      {
        id: "uber-gig",
        text: "Mentioned the 'gig economy'",
        matchesCompanyId: ["uber"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "uber-app",
        text: "Said 'the app that made taxis obsolete'",
        matchesCompanyId: ["uber"],
        strength: "medium"
      },
      {
        id: "uber-surge",
        text: "Made a joke about 'surge pricing' during rush hour",
        matchesCompanyId: ["uber"],
        strength: "medium"
      },
      {
        id: "uber-eats",
        text: "Mentioned they might 'order food from them too'",
        matchesCompanyId: ["uber"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "uber-travis",
        text: "Referenced 'the company Travis built before everything went sideways'",
        matchesCompanyId: ["uber"],
        strength: "strong"
      },
      {
        id: "uber-one-tap",
        text: "Said 'one tap and a car shows up' changed everything",
        matchesCompanyId: ["uber"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "uber-gimme",
      text: "Found calendar invite: 'Uber HQ, 1515 3rd Street, San Francisco'",
      matchesCompanyId: ["uber"],
      strength: "gimme"
    }
  }
};

export const VISA: DestinationClueSet = {
  companyId: "visa",
  companyName: "Visa",
  city: "San Francisco",
  state: "CA",
  region: "Bay Area",
  industry: "Finance",
  subIndustry: "Payments",
  clues: {
    weak: [
      {
        id: "visa-bayarea",
        text: "Said they're going to the Bay Area",
        matchesRegion: ["Bay Area"],
        strength: "weak"
      },
      {
        id: "visa-finance",
        text: "Mentioned visiting a 'financial services company'",
        matchesIndustry: ["Finance"],
        strength: "weak"
      },
      {
        id: "visa-payments",
        text: "Made a comment about 'how money moves'",
        matchesSubIndustry: ["Payments"],
        matchesCompanyId: ["visa"],
        strength: "weak"
      },
      {
        id: "visa-plastic",
        text: "Joked about 'the plastic in everyone's wallet'",
        matchesCompanyId: ["visa"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "visa-everywhere",
        text: "Said 'it's everywhere you want to be'",
        matchesCompanyId: ["visa"],
        strength: "medium"
      },
      {
        id: "visa-blue-gold",
        text: "Mentioned the logo is 'blue and gold'",
        matchesCompanyId: ["visa"],
        strength: "medium"
      },
      {
        id: "visa-network",
        text: "Called it 'the network, not the bank'",
        matchesCompanyId: ["visa"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "visa-bankamericard",
        text: "Mentioned it 'used to be called BankAmericard'",
        matchesCompanyId: ["visa"],
        strength: "strong"
      },
      {
        id: "visa-olympics",
        text: "Referenced being 'the only card accepted at the Olympics'",
        matchesCompanyId: ["visa"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "visa-gimme",
      text: "Found meeting invite: 'Visa Inc., 900 Metro Center Blvd, Foster City CA'",
      matchesCompanyId: ["visa"],
      strength: "gimme"
    }
  }
};

export const BAY_AREA_CLUES: DestinationClueSet[] = [
  APPLE,
  GOOGLE,
  META,
  NETFLIX,
  SALESFORCE,
  UBER,
  VISA
];
