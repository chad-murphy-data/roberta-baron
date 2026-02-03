/**
 * ROBERTA BARON - DESTINATION CLUE BANK
 * Part 4: Texas (6 brands)
 */

import { DestinationClueSet } from '../types';

export const TESLA: DestinationClueSet = {
  companyId: "tesla",
  companyName: "Tesla",
  city: "Austin",
  state: "TX",
  region: "Texas",
  industry: "Auto",
  subIndustry: "Electric vehicles",
  clues: {
    weak: [
      {
        id: "tesla-texas",
        text: "Said they're going to Texas",
        matchesRegion: ["Texas"],
        strength: "weak"
      },
      {
        id: "tesla-ev",
        text: "Mentioned visiting an 'electric car company'",
        matchesSubIndustry: ["Electric vehicles"],
        matchesCompanyId: ["tesla"],
        strength: "weak"
      },
      {
        id: "tesla-austin",
        text: "Said the HQ moved to Austin recently",
        matchesCity: ["Austin"],
        matchesCompanyId: ["tesla"],
        strength: "weak"
      },
      {
        id: "tesla-future",
        text: "Made a comment about 'the future of transportation'",
        matchesCompanyId: ["tesla", "uber"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "tesla-gigafactory",
        text: "Referenced 'the Gigafactory'",
        matchesCompanyId: ["tesla"],
        strength: "medium"
      },
      {
        id: "tesla-supercharger",
        text: "Mentioned 'Superchargers' when talking about travel",
        matchesCompanyId: ["tesla"],
        strength: "medium"
      },
      {
        id: "tesla-autopilot",
        text: "Joked about 'letting the car drive itself'",
        matchesCompanyId: ["tesla"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "tesla-elon",
        text: "Referenced 'what Elon does when he's not tweeting'",
        matchesCompanyId: ["tesla"],
        strength: "strong"
      },
      {
        id: "tesla-model-s",
        text: "Said 'Model S, 3, X, Y... you get the joke'",
        matchesCompanyId: ["tesla"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "tesla-gimme",
      text: "Found meeting request: 'Tesla HQ, 13101 Tesla Road, Austin TX'",
      matchesCompanyId: ["tesla"],
      strength: "gimme"
    }
  }
};

export const YETI: DestinationClueSet = {
  companyId: "yeti",
  companyName: "Yeti",
  city: "Austin",
  state: "TX",
  region: "Texas",
  industry: "CPG",
  subIndustry: "Outdoor gear",
  clues: {
    weak: [
      {
        id: "yeti-texas",
        text: "Said they're going to Austin",
        matchesCity: ["Austin"],
        matchesRegion: ["Texas"],
        strength: "weak"
      },
      {
        id: "yeti-outdoor",
        text: "Mentioned visiting an 'outdoor lifestyle brand'",
        matchesSubIndustry: ["Outdoor gear"],
        matchesCompanyId: ["yeti", "patagonia"],
        strength: "weak"
      },
      {
        id: "yeti-premium",
        text: "Joked about 'paying way too much for a cooler'",
        matchesCompanyId: ["yeti"],
        strength: "weak"
      },
      {
        id: "yeti-cold",
        text: "Made a comment about 'keeping things cold'",
        matchesCompanyId: ["yeti"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "yeti-cooler",
        text: "Referenced 'the cooler that became a status symbol'",
        matchesCompanyId: ["yeti"],
        strength: "medium"
      },
      {
        id: "yeti-tumbler",
        text: "Mentioned 'everyone at work has one of their tumblers'",
        matchesCompanyId: ["yeti"],
        strength: "medium"
      },
      {
        id: "yeti-indestructible",
        text: "Said the products are 'basically indestructible'",
        matchesCompanyId: ["yeti"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "yeti-brothers",
        text: "Mentioned 'the Seiders brothers who wanted a better cooler'",
        matchesCompanyId: ["yeti"],
        strength: "strong"
      },
      {
        id: "yeti-bear-proof",
        text: "Referenced 'bear-proof coolers'",
        matchesCompanyId: ["yeti"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "yeti-gimme",
      text: "Found address: 'YETI Coolers, 7601 Southwest Pkwy, Austin TX'",
      matchesCompanyId: ["yeti"],
      strength: "gimme"
    }
  }
};

export const SOUTHWEST: DestinationClueSet = {
  companyId: "southwest",
  companyName: "Southwest Airlines",
  city: "Dallas",
  state: "TX",
  region: "Texas",
  industry: "Airline",
  subIndustry: "Low-cost carrier",
  clues: {
    weak: [
      {
        id: "southwest-texas",
        text: "Said they're going to Dallas",
        matchesCity: ["Dallas"],
        matchesRegion: ["Texas"],
        strength: "weak"
      },
      {
        id: "southwest-airline",
        text: "Mentioned visiting an 'airline'",
        matchesIndustry: ["Airline"],
        strength: "weak"
      },
      {
        id: "southwest-budget",
        text: "Referenced 'the budget-friendly option'",
        matchesSubIndustry: ["Low-cost carrier"],
        matchesCompanyId: ["southwest"],
        strength: "weak"
      },
      {
        id: "southwest-fun",
        text: "Said the company has 'a fun culture'",
        matchesCompanyId: ["southwest"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "southwest-bags",
        text: "Said 'bags fly free' with enthusiasm",
        matchesCompanyId: ["southwest"],
        strength: "medium"
      },
      {
        id: "southwest-no-seats",
        text: "Mentioned 'no assigned seats'",
        matchesCompanyId: ["southwest"],
        strength: "medium"
      },
      {
        id: "southwest-heart",
        text: "Referenced 'the heart logo on the plane'",
        matchesCompanyId: ["southwest"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "southwest-luv",
        text: "Said the stock ticker is 'LUV'",
        matchesCompanyId: ["southwest"],
        strength: "strong"
      },
      {
        id: "southwest-herb",
        text: "Mentioned 'what Herb Kelleher built with peanuts and fun'",
        matchesCompanyId: ["southwest"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "southwest-gimme",
      text: "Found meeting details: 'Southwest Airlines HQ, 2702 Love Field Dr, Dallas TX'",
      matchesCompanyId: ["southwest"],
      strength: "gimme"
    }
  }
};

export const ATT: DestinationClueSet = {
  companyId: "att",
  companyName: "AT&T",
  city: "Dallas",
  state: "TX",
  region: "Texas",
  industry: "Telecom",
  subIndustry: "Wireless/Internet",
  clues: {
    weak: [
      {
        id: "att-texas",
        text: "Said they're going to Dallas",
        matchesCity: ["Dallas"],
        matchesRegion: ["Texas"],
        strength: "weak"
      },
      {
        id: "att-telecom",
        text: "Mentioned visiting a 'telecommunications company'",
        matchesIndustry: ["Telecom"],
        matchesCompanyId: ["att"],
        strength: "weak"
      },
      {
        id: "att-phone",
        text: "Made a comment about 'the phone company'",
        matchesCompanyId: ["att"],
        strength: "weak"
      },
      {
        id: "att-old",
        text: "Said the company 'has been around forever'",
        matchesCompanyId: ["att", "ford", "coca-cola"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "att-globe",
        text: "Mentioned 'the globe logo'",
        matchesCompanyId: ["att"],
        strength: "medium"
      },
      {
        id: "att-bell",
        text: "Referenced 'used to be Ma Bell'",
        matchesCompanyId: ["att"],
        strength: "medium"
      },
      {
        id: "att-stadium",
        text: "Said they might 'catch a Cowboys game while there'",
        matchesCity: ["Dallas"],
        matchesCompanyId: ["att"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "att-breakup",
        text: "Referenced 'the big breakup in the 80s'",
        matchesCompanyId: ["att"],
        strength: "strong"
      },
      {
        id: "att-reach-out",
        text: "Said 'reach out and touch someone' ironically",
        matchesCompanyId: ["att"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "att-gimme",
      text: "Found calendar invite: 'AT&T Corporate HQ, 208 S Akard St, Dallas TX'",
      matchesCompanyId: ["att"],
      strength: "gimme"
    }
  }
};

export const WHOLE_FOODS: DestinationClueSet = {
  companyId: "whole-foods",
  companyName: "Whole Foods",
  city: "Austin",
  state: "TX",
  region: "Texas",
  industry: "Retail",
  subIndustry: "Grocery",
  clues: {
    weak: [
      {
        id: "wholefoods-austin",
        text: "Said they're going to Austin",
        matchesCity: ["Austin"],
        matchesRegion: ["Texas"],
        strength: "weak"
      },
      {
        id: "wholefoods-grocery",
        text: "Mentioned visiting a 'grocery chain'",
        matchesSubIndustry: ["Grocery"],
        matchesCompanyId: ["whole-foods"],
        strength: "weak"
      },
      {
        id: "wholefoods-organic",
        text: "Made a comment about 'organic everything'",
        matchesCompanyId: ["whole-foods"],
        strength: "weak"
      },
      {
        id: "wholefoods-expensive",
        text: "Joked about 'expensive grocery shopping'",
        matchesCompanyId: ["whole-foods"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "wholefoods-paycheck",
        text: "Called it 'Whole Paycheck' and laughed",
        matchesCompanyId: ["whole-foods"],
        strength: "medium"
      },
      {
        id: "wholefoods-amazon",
        text: "Mentioned they're 'owned by the big e-commerce company now'",
        matchesCompanyId: ["whole-foods"],
        strength: "medium"
      },
      {
        id: "wholefoods-hotbar",
        text: "Referenced 'the hot bar' with genuine enthusiasm",
        matchesCompanyId: ["whole-foods"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "wholefoods-mackey",
        text: "Mentioned 'what John Mackey built in Austin'",
        matchesCompanyId: ["whole-foods"],
        strength: "strong"
      },
      {
        id: "wholefoods-conscious",
        text: "Used the phrase 'conscious capitalism' unironically",
        matchesCompanyId: ["whole-foods"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "wholefoods-gimme",
      text: "Found meeting request: 'Whole Foods Market Global HQ, 550 Bowie St, Austin TX'",
      matchesCompanyId: ["whole-foods"],
      strength: "gimme"
    }
  }
};

export const DELL: DestinationClueSet = {
  companyId: "dell",
  companyName: "Dell",
  city: "Round Rock",
  state: "TX",
  region: "Texas",
  industry: "Tech",
  subIndustry: "Hardware",
  clues: {
    weak: [
      {
        id: "dell-texas",
        text: "Said they're going to the Austin area",
        matchesRegion: ["Texas"],
        matchesCity: ["Austin", "Round Rock"],
        strength: "weak"
      },
      {
        id: "dell-tech",
        text: "Mentioned visiting a 'computer company'",
        matchesIndustry: ["Tech"],
        matchesSubIndustry: ["Hardware"],
        strength: "weak"
      },
      {
        id: "dell-pc",
        text: "Made a comment about 'PCs and servers'",
        matchesCompanyId: ["dell"],
        strength: "weak"
      },
      {
        id: "dell-direct",
        text: "Referenced 'selling directly to customers'",
        matchesCompanyId: ["dell", "tesla"],
        strength: "weak"
      }
    ],
    medium: [
      {
        id: "dell-roundrock",
        text: "Said the HQ is in Round Rock, not quite Austin",
        matchesCity: ["Round Rock"],
        matchesCompanyId: ["dell"],
        strength: "medium"
      },
      {
        id: "dell-dorm",
        text: "Mentioned 'starting in a dorm room'",
        matchesCompanyId: ["dell", "meta"],
        strength: "medium"
      },
      {
        id: "dell-emc",
        text: "Referenced 'the merger with EMC'",
        matchesCompanyId: ["dell"],
        strength: "medium"
      }
    ],
    strong: [
      {
        id: "dell-michael",
        text: "Said 'what Michael built at UT Austin'",
        matchesCompanyId: ["dell"],
        strength: "strong"
      },
      {
        id: "dell-dudegettin",
        text: "Joked 'Dude, you're gettin a...' and trailed off",
        matchesCompanyId: ["dell"],
        strength: "strong"
      }
    ],
    gimme: {
      id: "dell-gimme",
      text: "Found visitor request: 'Dell Technologies HQ, One Dell Way, Round Rock TX'",
      matchesCompanyId: ["dell"],
      strength: "gimme"
    }
  }
};

export const TEXAS_CLUES: DestinationClueSet[] = [
  TESLA,
  YETI,
  SOUTHWEST,
  ATT,
  WHOLE_FOODS,
  DELL
];
