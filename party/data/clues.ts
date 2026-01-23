import { CriminalClue, Archetype, DestinationClue, Brand } from './types';

// 3-Archetype Clues (create ambiguity)
export const THREE_ARCHETYPE_CLUES: CriminalClue[] = [
  {
    id: 1,
    textMale: "He kept saying 'let's circle back'",
    textFemale: "She kept saying 'let's circle back'",
    archetypes: ['Vest', 'Consultant', 'Lifer']
  },
  {
    id: 2,
    textMale: 'He mentioned his MBA within the first two minutes',
    textFemale: 'She mentioned her MBA within the first two minutes',
    archetypes: ['Vest', 'Consultant', 'Disruptor']
  },
  {
    id: 3,
    textMale: 'He knew the org chart better than I do',
    textFemale: 'She knew the org chart better than I do',
    archetypes: ['Vest', 'Consultant', 'Lifer']
  },
  {
    id: 4,
    textMale: "He started three sentences with 'the future of...'",
    textFemale: "She started three sentences with 'the future of...'",
    archetypes: ['Disruptor', 'ThoughtLeader', 'Evangelist']
  },
  {
    id: 5,
    textMale: 'He had AirPods in the entire conversation',
    textFemale: 'She had AirPods in the entire conversation',
    archetypes: ['Disruptor', 'ThoughtLeader', 'Biohacker']
  },
  {
    id: 6,
    textMale: 'He was wearing an expensive-looking grey t-shirt',
    textFemale: 'She was wearing an expensive-looking grey t-shirt',
    archetypes: ['Disruptor', 'Evangelist', 'Biohacker']
  },
  {
    id: 7,
    textMale: 'I noticed he was wearing an Oura ring',
    textFemale: 'I noticed she was wearing an Oura ring',
    archetypes: ['Biohacker', 'Disruptor', 'Evangelist']
  },
  {
    id: 8,
    textMale: 'He mentioned being up since 4am like it was impressive',
    textFemale: 'She mentioned being up since 4am like it was impressive',
    archetypes: ['Biohacker', 'Disruptor', 'Evangelist']
  },
  {
    id: 9,
    textMale: 'He had very strong opinions about seed oils',
    textFemale: 'She had very strong opinions about seed oils',
    archetypes: ['Biohacker', 'Evangelist', 'Disruptor']
  },
  {
    id: 10,
    textMale: "He made a reference to something that happened in the '90s",
    textFemale: "She made a reference to something that happened in the '90s",
    archetypes: ['Lifer', 'Consultant', 'ThoughtLeader']
  },
  {
    id: 11,
    textMale: 'He was carrying a printed-out document',
    textFemale: 'She was carrying a printed-out document',
    archetypes: ['Lifer', 'Consultant', 'ThoughtLeader']
  },
  {
    id: 12,
    textMale: 'He was carrying a presentation clicker even though there was no screen',
    textFemale: 'She was carrying a presentation clicker even though there was no screen',
    archetypes: ['Consultant', 'ThoughtLeader', 'Vest']
  },
  {
    id: 13,
    textMale: 'He was typing a LinkedIn post while talking to me',
    textFemale: 'She was typing a LinkedIn post while talking to me',
    archetypes: ['ThoughtLeader', 'Evangelist', 'Disruptor']
  },
  {
    id: 14,
    textMale: "He mentioned giving a TED talk-or maybe it was TEDx",
    textFemale: "She mentioned giving a TED talk-or maybe it was TEDx",
    archetypes: ['ThoughtLeader', 'Evangelist', 'Consultant']
  },
  {
    id: 15,
    textMale: "He said something about it being 'decentralized'",
    textFemale: "She said something about it being 'decentralized'",
    archetypes: ['Evangelist', 'Disruptor', 'Biohacker']
  },
  {
    id: 16,
    textMale: "He said 'few understand this' completely seriously",
    textFemale: "She said 'few understand this' completely seriously",
    archetypes: ['Evangelist', 'ThoughtLeader', 'Disruptor']
  },
  {
    id: 17,
    textMale: 'He was wearing a fleece vest',
    textFemale: 'She was wearing a fleece vest',
    archetypes: ['Vest', 'Consultant', 'Lifer']
  },
  {
    id: 18,
    textMale: 'He was taking the meeting from a Peloton',
    textFemale: 'She was taking the meeting from a Peloton',
    archetypes: ['Biohacker', 'Disruptor', 'Evangelist']
  }
];

// 2-Archetype Clues (narrow it down, include gender)
export const TWO_ARCHETYPE_CLUES: CriminalClue[] = [
  {
    id: 30,
    textMale: 'He had strong opinions about Sweetgreen',
    textFemale: 'She had strong opinions about Sweetgreen',
    archetypes: ['Vest', 'Biohacker']
  },
  {
    id: 31,
    textMale: "He called it 'disruptive' unironically",
    textFemale: "She called it 'disruptive' unironically",
    archetypes: ['Disruptor', 'Evangelist']
  },
  {
    id: 32,
    textMale: 'He was clearly drafting content for later',
    textFemale: 'She was clearly drafting content for later',
    archetypes: ['ThoughtLeader', 'Evangelist']
  },
  {
    id: 33,
    textMale: "He said 'net-net' at least three times",
    textFemale: "She said 'net-net' at least three times",
    archetypes: ['Consultant', 'Vest']
  },
  {
    id: 34,
    textMale: 'He kept checking his HRV on his watch',
    textFemale: 'She kept checking her HRV on her watch',
    archetypes: ['Biohacker', 'Disruptor']
  },
  {
    id: 35,
    textMale: 'He knew where the good office supplies are hidden',
    textFemale: 'She knew where the good office supplies are hidden',
    archetypes: ['Lifer', 'Vest']
  },
  {
    id: 36,
    textMale: "He mentioned 'asymmetric upside'",
    textFemale: "She mentioned 'asymmetric upside'",
    archetypes: ['Evangelist', 'Disruptor']
  }
];

// Unique Clues (smoking guns - one per archetype)
export const UNIQUE_CLUES: CriminalClue[] = [
  {
    id: 20,
    textMale: "He mentioned having a half-day Friday for 'a thing in the Hamptons'",
    textFemale: "She mentioned having a half-day Friday for 'a thing in the Hamptons'",
    archetypes: ['Vest'],
    isUnique: true
  },
  {
    id: 21,
    textMale: "He called something 'the Uber of...'",
    textFemale: "She called something 'the Uber of...'",
    archetypes: ['Disruptor'],
    isUnique: true
  },
  {
    id: 22,
    textMale: 'He turned our conversation into a LinkedIn post before leaving',
    textFemale: 'She turned our conversation into a LinkedIn post before leaving',
    archetypes: ['ThoughtLeader'],
    isUnique: true
  },
  {
    id: 23,
    textMale: "He said 'let's pressure-test that assumption'",
    textFemale: "She said 'let's pressure-test that assumption'",
    archetypes: ['Consultant'],
    isUnique: true
  },
  {
    id: 24,
    textMale: 'He asked if the building has a cold plunge',
    textFemale: 'She asked if the building has a cold plunge',
    archetypes: ['Biohacker'],
    isUnique: true
  },
  {
    id: 25,
    textMale: "He said 'we tried that in '98'",
    textFemale: "She said 'we tried that in '98'",
    archetypes: ['Lifer'],
    isUnique: true
  },
  {
    id: 26,
    textMale: 'He asked if the cafeteria takes Bitcoin',
    textFemale: 'She asked if the cafeteria takes Bitcoin',
    archetypes: ['Evangelist'],
    isUnique: true
  }
];

// All criminal clues combined
export const ALL_CRIMINAL_CLUES: CriminalClue[] = [
  ...THREE_ARCHETYPE_CLUES,
  ...TWO_ARCHETYPE_CLUES,
  ...UNIQUE_CLUES
];

// Get clue by ID
export function getClueById(id: number): CriminalClue | undefined {
  return ALL_CRIMINAL_CLUES.find(c => c.id === id);
}

// Get clues for a specific archetype
export function getCluesForArchetype(archetype: Archetype): CriminalClue[] {
  return ALL_CRIMINAL_CLUES.filter(c => c.archetypes.includes(archetype));
}

// Pre-computed valid combinations for each archetype
// Format: [3-arch clue ID, 3-arch clue ID, 2-arch clue ID]
export const VALID_CRIMINAL_COMBOS: Record<Archetype, number[][]> = {
  Vest: [
    [1, 3, 33], [1, 3, 35], [1, 12, 33], [1, 12, 35], [1, 17, 33], [1, 17, 35],
    [2, 3, 33], [2, 3, 35], [2, 12, 33], [2, 12, 35], [2, 17, 33], [2, 17, 35],
    [3, 12, 33], [3, 12, 35], [3, 17, 33], [3, 17, 35], [12, 17, 30]
  ],
  Disruptor: [
    [2, 4, 31], [2, 4, 34], [2, 4, 36], [2, 5, 31], [2, 5, 34], [2, 5, 36],
    [2, 6, 31], [2, 6, 34], [2, 6, 36], [2, 7, 31], [2, 7, 34], [2, 7, 36],
    [2, 8, 31], [2, 8, 34], [2, 8, 36], [2, 9, 31], [2, 9, 34], [2, 9, 36],
    [4, 5, 31], [4, 5, 34], [4, 5, 36], [4, 6, 31], [4, 6, 34], [4, 6, 36],
    [4, 7, 31], [4, 7, 34], [4, 7, 36], [4, 8, 31], [4, 8, 34], [4, 8, 36],
    [4, 9, 31], [4, 9, 34], [4, 9, 36], [4, 13, 31], [4, 13, 34], [4, 13, 36],
    [4, 15, 31], [4, 15, 34], [4, 15, 36], [4, 16, 31], [4, 16, 34], [4, 16, 36],
    [5, 6, 31], [5, 6, 34], [5, 6, 36], [5, 7, 31], [5, 7, 34], [5, 7, 36],
    [5, 8, 31], [5, 8, 34], [5, 8, 36], [5, 9, 31], [5, 9, 34], [5, 9, 36],
    [6, 7, 31], [6, 7, 34], [6, 7, 36], [6, 8, 31], [6, 8, 34], [6, 8, 36],
    [6, 9, 31], [6, 9, 34], [6, 9, 36], [7, 8, 31], [7, 8, 34], [7, 8, 36],
    [7, 9, 31], [7, 9, 34], [7, 9, 36], [8, 9, 31], [8, 9, 34], [8, 9, 36]
  ],
  ThoughtLeader: [
    [4, 5, 32], [4, 10, 32], [4, 11, 32], [4, 13, 32], [4, 14, 32], [4, 16, 32],
    [5, 10, 32], [5, 11, 32], [5, 13, 32], [5, 14, 32], [5, 16, 32],
    [10, 11, 32], [10, 12, 32], [10, 13, 32], [10, 14, 32], [10, 16, 32],
    [11, 12, 32], [11, 13, 32], [11, 14, 32], [11, 16, 32], [12, 13, 32], [12, 14, 32]
  ],
  Consultant: [
    [1, 2, 33], [1, 3, 33], [1, 10, 33], [1, 11, 33], [1, 12, 33], [1, 14, 33],
    [2, 3, 33], [2, 10, 33], [2, 11, 33], [2, 12, 33], [2, 14, 33],
    [3, 10, 33], [3, 11, 33], [3, 12, 33], [3, 14, 33],
    [10, 11, 33], [10, 12, 33], [10, 14, 33]
  ],
  Biohacker: [
    [5, 6, 30], [5, 6, 34], [5, 7, 30], [5, 7, 34], [5, 8, 30], [5, 8, 34],
    [5, 9, 30], [5, 9, 34], [5, 15, 30], [5, 15, 34], [5, 18, 30], [5, 18, 34],
    [6, 7, 30], [6, 7, 34], [6, 8, 30], [6, 8, 34], [6, 9, 30], [6, 9, 34],
    [7, 8, 30], [7, 8, 34], [7, 9, 30]
  ],
  Lifer: [
    [1, 3, 35], [1, 10, 35], [1, 11, 35], [1, 17, 35],
    [3, 10, 35], [3, 11, 35], [3, 17, 35]
  ],
  Evangelist: [
    [4, 6, 31], [4, 6, 32], [4, 6, 36], [4, 7, 31], [4, 7, 32], [4, 7, 36],
    [4, 8, 31], [4, 8, 32], [4, 8, 36], [4, 9, 31], [4, 9, 32], [4, 9, 36],
    [4, 13, 31], [4, 13, 32], [4, 13, 36], [4, 14, 31], [4, 14, 32], [4, 14, 36],
    [4, 15, 31], [4, 15, 32], [4, 15, 36], [4, 16, 31], [4, 16, 32], [4, 16, 36],
    [4, 18, 31], [4, 18, 32], [4, 18, 36], [6, 7, 31], [6, 7, 32], [6, 7, 36],
    [6, 8, 31], [6, 8, 32], [6, 8, 36], [6, 9, 31], [6, 9, 32], [6, 9, 36],
    [6, 13, 31], [6, 13, 32], [6, 13, 36], [6, 14, 31], [6, 14, 32], [6, 14, 36],
    [6, 15, 31], [6, 15, 32], [6, 15, 36], [6, 16, 31], [6, 16, 32], [6, 16, 36],
    [7, 8, 31], [7, 8, 32], [7, 8, 36], [7, 9, 31], [7, 9, 32], [7, 9, 36],
    [8, 9, 31], [8, 9, 32], [8, 9, 36]
  ]
};

// Destination clue generators
export function generateDestinationClues(brand: Brand): DestinationClue[] {
  const clues: DestinationClue[] = [];

  // Region clue
  clues.push({
    type: 'region',
    value: brand.region,
    text: generateRegionClueText(brand.region)
  });

  // State clue
  clues.push({
    type: 'state',
    value: brand.state,
    text: `They mentioned heading to ${brand.state}`
  });

  // City hint clue
  clues.push({
    type: 'cityHint',
    value: brand.cityHint,
    text: `Said something about going to a city ${brand.cityHint}`
  });

  // Industry clue
  clues.push({
    type: 'industry',
    value: brand.industry,
    text: generateIndustryClueText(brand.industry)
  });

  // Sub-industry clue
  clues.push({
    type: 'subIndustry',
    value: brand.subIndustry,
    text: generateSubIndustryClueText(brand.subIndustry)
  });

  // Era clue
  clues.push({
    type: 'era',
    value: brand.era,
    text: generateEraClueText(brand.era)
  });

  // Unique identifier clue
  clues.push({
    type: 'unique',
    value: brand.uniqueIdentifier,
    text: `Mentioned something about "${brand.uniqueIdentifier}"`
  });

  return clues;
}

function generateRegionClueText(region: string): string {
  const regionTexts: Record<string, string[]> = {
    'Pacific Northwest': [
      'Said they were heading to the Pacific Northwest',
      'Mentioned rain and mountains in their next destination',
      'Talked about going somewhere with lots of coffee and tech'
    ],
    'Bay Area': [
      'Said something about Silicon Valley',
      'Mentioned heading to the Bay Area',
      'Talked about tech startups and the Golden Gate'
    ],
    'SoCal': [
      'Said they were going to Southern California',
      'Mentioned sunshine and beaches',
      'Talked about LA or Orange County'
    ],
    'Texas': [
      'Mentioned heading to the Lone Star State',
      'Said something about Texas',
      'Talked about BBQ and big cities'
    ],
    'Midwest': [
      'Said they were going to the Midwest',
      'Mentioned the heartland',
      'Talked about friendly people and cold winters'
    ],
    'Southeast': [
      'Mentioned heading to the Southeast',
      'Said something about Southern hospitality',
      'Talked about sweet tea and hot weather'
    ],
    'Northeast': [
      'Said they were going to the Northeast',
      'Mentioned the East Coast',
      'Talked about history and financial centers'
    ]
  };

  const texts = regionTexts[region] || [`Heading to ${region}`];
  return texts[Math.floor(Math.random() * texts.length)];
}

function generateIndustryClueText(industry: string): string {
  const industryTexts: Record<string, string[]> = {
    Tech: ['Mentioned code or engineers', 'Said something about software', 'Talked about disrupting an industry'],
    Food: ['Said something about food or restaurants', 'Mentioned something delicious', 'Talked about meals'],
    Retail: ['Mentioned shopping or stores', 'Said something about customers', 'Talked about inventory'],
    Finance: ['Said something about money or investments', 'Mentioned banking', 'Talked about the market'],
    Entertainment: ['Mentioned movies or shows', 'Said something about content', 'Talked about streaming'],
    Apparel: ['Mentioned clothing or fashion', 'Said something about style', 'Talked about designs'],
    Auto: ['Said something about cars', 'Mentioned vehicles or driving', 'Talked about manufacturing'],
    Airline: ['Mentioned flying or planes', 'Said something about travel', 'Talked about airports'],
    Shipping: ['Said something about packages', 'Mentioned delivery', 'Talked about logistics'],
    CPG: ['Mentioned household products', 'Said something about brands everyone knows', 'Talked about the grocery aisle'],
    Media: ['Said something about news or sports', 'Mentioned journalism', 'Talked about broadcasting'],
    Telecom: ['Mentioned phones or connectivity', 'Said something about networks', 'Talked about service']
  };

  const texts = industryTexts[industry] || [`Something about ${industry}`];
  return texts[Math.floor(Math.random() * texts.length)];
}

function generateSubIndustryClueText(subIndustry: string): string {
  const subIndustryTexts: Record<string, string> = {
    'E-commerce': 'Mentioned online shopping and next-day delivery',
    'Coffee': 'Said something about coffee or espresso',
    'Software': 'Talked about enterprise software and cloud',
    'Warehouse club': 'Mentioned bulk buying and membership cards',
    'Athletic wear': 'Said something about sports gear and athletes',
    'Department store': 'Mentioned luxury shopping and customer service',
    'Consumer electronics': 'Talked about devices and innovation',
    'Search/Advertising': 'Mentioned searching for information',
    'Social media': 'Said something about connecting people online',
    'Streaming': 'Mentioned binge-watching and original content',
    'Enterprise software': 'Talked about CRM and business solutions',
    'Rideshare': 'Said something about getting a ride',
    'Payments': 'Mentioned credit cards and transactions',
    'Media conglomerate': 'Talked about theme parks and movies',
    'Fast casual': 'Mentioned quick service but quality food',
    'Fast food': 'Said something about drive-thrus and quick meals',
    'Outdoor wear': 'Mentioned hiking and environmental responsibility',
    'Electric vehicles': 'Talked about EVs and the future of cars',
    'Outdoor gear': 'Said something about coolers and camping',
    'Low-cost carrier': 'Mentioned budget airlines and no frills',
    'Wireless/Internet': 'Talked about phones and connectivity',
    'Grocery': 'Mentioned organic food and natural products',
    'Hardware': 'Said something about computers and PCs',
    'Big box': 'Mentioned Target runs and affordable style',
    'Packaged food': 'Talked about breakfast cereals and snacks',
    'Traditional auto': 'Said something about trucks and American cars',
    'Consumer goods': 'Mentioned household brands everyone uses',
    'Beverage': 'Talked about soft drinks and refreshment',
    'Major carrier': 'Mentioned full-service airlines',
    'Home improvement': 'Said something about DIY and tools',
    'Package delivery': 'Mentioned overnight shipping and tracking',
    'Banking': 'Talked about accounts and financial services',
    'News': 'Mentioned journalism and breaking stories',
    'Sports': 'Said something about sports coverage and highlights',
    'Healthcare/Consumer': 'Mentioned health products and baby care',
    'Investment management': 'Talked about retirement and investments'
  };

  return subIndustryTexts[subIndustry] || `Something about ${subIndustry}`;
}

function generateEraClueText(era: string): string {
  const eraTexts: Record<string, string[]> = {
    'Pre-1950': [
      'Mentioned a company with over 75 years of history',
      'Said something about a business started before World War II',
      'Talked about a truly historic American company'
    ],
    '1950-1980': [
      'Mentioned a company from the mid-century',
      'Said something about a business that grew with the suburbs',
      'Talked about a company established during the golden age'
    ],
    '1980-2000': [
      'Mentioned a company that emerged in the computer age',
      'Said something about a business from the 80s or 90s',
      'Talked about a company that grew with globalization'
    ],
    'Post-2000': [
      'Mentioned a relatively new company',
      'Said something about a 21st-century disruptor',
      'Talked about a company born in the internet age'
    ]
  };

  const texts = eraTexts[era] || [`A company from the ${era} era`];
  return texts[Math.floor(Math.random() * texts.length)];
}

// Roberta Baron quotes for intro
export const ROBERTA_QUOTES = [
  "My cousins got caught stealing jewels from the Louvre. Jewels! In 2025! Meanwhile, I just took Coca-Cola's 'brand authenticity' and no one even filed a police report.",
  "Why steal diamonds when you can steal 'synergy'? It's worth more and weighs nothing.",
  "The Crown Jewels are insured. Corporate values? Priceless-and completely unprotected.",
  "My family has been in the theft business for generations. I'm just the first to realize ideas are worth more than objects.",
  "They called me crazy for stealing mission statements. Now every Fortune 500 company is looking for their 'why' and can't find it.",
  "Physical theft is so 20th century. I take what makes a company a company."
];

// News ticker headlines
export const NEWS_HEADLINES = [
  "BREAKING: {company} reports Q3 earnings down after mysterious theft of '{asset}'",
  "Analysts puzzled as {company}'s '{asset}' vanishes from quarterly report",
  "Employees at {company} report 'something feels different' but can't explain",
  "{company} stock tumbles as '{asset}' mysteriously absent from investor call",
  "Industry experts baffled: {company}'s '{asset}' nowhere to be found",
  "Consultants hired to find {company}'s missing '{asset}'-billed by the hour",
  "'{asset}' declared missing from {company}; authorities have no leads",
  "Intern at {company}: 'The vibes are just... off now'"
];

// Fidelity Mode specific news headlines
export const FIDELITY_NEWS_HEADLINES = [
  "BREAKING: Snack baskets across Fidelity campuses reported empty. Morale plummeting.",
  "Phone reps suffering from Harvest Cheddar Deficiency. Average handle time up 47%.",
  "Sources say the Strategic Reserve took 15 years to accumulate. 'We may never recover,' says insider.",
  "Fidelity wellness team deploys emergency trail mix. Employees describe it as 'not the same.'",
  "Abby seen wandering the halls of 245 Summer, muttering 'they took everything.'",
  "401(k) participants report sensing 'a disturbance in the vibes' but can't explain why.",
  "Analysts downgrade Fidelity snack situation from 'abundant' to 'concerning.'",
  "Breaking: Sun Chips futures trading suspended amid supply crisis"
];
