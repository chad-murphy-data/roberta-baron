#!/usr/bin/env node
/**
 * Roberta Baron Playtesting Bot
 *
 * A smart bot that joins a game room and makes intelligent decisions:
 * - Analyzes destination clues to pick the best travel option
 * - Counts criminal clues to know when to submit to Pilot
 * - Participates in mini-games
 *
 * Usage: node bot.js <roomCode> [playerName]
 */

import WebSocket from 'ws';

// =============================================================================
// CONFIGURATION
// =============================================================================

const PARTYKIT_HOST = 'all-hands-on-deck.chad-murphy-data.partykit.dev';
const DEFAULT_BOT_NAME = 'Detective Bot';

// =============================================================================
// BRAND DATABASE - All 42 companies with their attributes for clue matching
// =============================================================================

const BRANDS = [
  // Pacific Northwest
  { name: 'Amazon', city: 'Seattle', state: 'WA', region: 'Pacific Northwest', industry: 'Tech', subIndustry: 'E-commerce', era: '1980-2000', cityHint: 'known for rain and coffee culture' },
  { name: 'Starbucks', city: 'Seattle', state: 'WA', region: 'Pacific Northwest', industry: 'Food', subIndustry: 'Coffee', era: '1950-1980', cityHint: 'known for rain and coffee culture' },
  { name: 'Microsoft', city: 'Redmond', state: 'WA', region: 'Pacific Northwest', industry: 'Tech', subIndustry: 'Software', era: '1950-1980', cityHint: 'a suburb east of Seattle' },
  { name: 'Costco', city: 'Issaquah', state: 'WA', region: 'Pacific Northwest', industry: 'Retail', subIndustry: 'Warehouse club', era: '1980-2000', cityHint: 'a suburb east of Seattle' },
  { name: 'Nike', city: 'Beaverton', state: 'OR', region: 'Pacific Northwest', industry: 'Apparel', subIndustry: 'Athletic wear', era: '1950-1980', cityHint: 'near Portland, Oregon' },
  { name: 'Nordstrom', city: 'Seattle', state: 'WA', region: 'Pacific Northwest', industry: 'Retail', subIndustry: 'Department store', era: 'Pre-1950', cityHint: 'known for rain and coffee culture' },

  // Bay Area
  { name: 'Apple', city: 'Cupertino', state: 'CA', region: 'Bay Area', industry: 'Tech', subIndustry: 'Consumer electronics', era: '1950-1980', cityHint: 'in Silicon Valley' },
  { name: 'Google', city: 'Mountain View', state: 'CA', region: 'Bay Area', industry: 'Tech', subIndustry: 'Search/Advertising', era: '1980-2000', cityHint: 'in Silicon Valley' },
  { name: 'Meta', city: 'Menlo Park', state: 'CA', region: 'Bay Area', industry: 'Tech', subIndustry: 'Social media', era: 'Post-2000', cityHint: 'in Silicon Valley' },
  { name: 'Netflix', city: 'Los Gatos', state: 'CA', region: 'Bay Area', industry: 'Entertainment', subIndustry: 'Streaming', era: '1980-2000', cityHint: 'in the Bay Area hills' },
  { name: 'Salesforce', city: 'San Francisco', state: 'CA', region: 'Bay Area', industry: 'Tech', subIndustry: 'Enterprise software', era: '1980-2000', cityHint: 'the city by the bay' },
  { name: 'Uber', city: 'San Francisco', state: 'CA', region: 'Bay Area', industry: 'Tech', subIndustry: 'Rideshare', era: 'Post-2000', cityHint: 'the city by the bay' },
  { name: 'Visa', city: 'San Francisco', state: 'CA', region: 'Bay Area', industry: 'Finance', subIndustry: 'Payments', era: '1950-1980', cityHint: 'the city by the bay' },

  // SoCal
  { name: 'Disney', city: 'Burbank', state: 'CA', region: 'SoCal', industry: 'Entertainment', subIndustry: 'Media conglomerate', era: 'Pre-1950', cityHint: 'near Hollywood' },
  { name: 'Chipotle', city: 'Newport Beach', state: 'CA', region: 'SoCal', industry: 'Food', subIndustry: 'Fast casual', era: '1980-2000', cityHint: 'in Orange County, California' },
  { name: 'SpaceX', city: 'Hawthorne', state: 'CA', region: 'SoCal', industry: 'Tech', subIndustry: 'Aerospace', era: 'Post-2000', cityHint: 'in the LA area' },
  { name: 'Patagonia', city: 'Ventura', state: 'CA', region: 'SoCal', industry: 'Apparel', subIndustry: 'Outdoor wear', era: '1950-1980', cityHint: 'a coastal California city north of LA' },
  { name: 'Deloitte', city: 'Los Angeles', state: 'CA', region: 'SoCal', industry: 'Finance', subIndustry: 'Consulting', era: 'Pre-1950', cityHint: 'the City of Angels' },
  { name: 'In-N-Out', city: 'Irvine', state: 'CA', region: 'SoCal', industry: 'Food', subIndustry: 'Fast food', era: 'Pre-1950', cityHint: 'in Orange County, California' },

  // Texas
  { name: 'Tesla', city: 'Austin', state: 'TX', region: 'Texas', industry: 'Auto', subIndustry: 'Electric vehicles', era: 'Post-2000', cityHint: "Texas's capital, known for live music" },
  { name: 'Yeti', city: 'Austin', state: 'TX', region: 'Texas', industry: 'CPG', subIndustry: 'Outdoor gear', era: 'Post-2000', cityHint: "Texas's capital, known for live music" },
  { name: 'Southwest', city: 'Dallas', state: 'TX', region: 'Texas', industry: 'Airline', subIndustry: 'Low-cost carrier', era: '1950-1980', cityHint: 'a major Texas city known for cowboys' },
  { name: 'AT&T', city: 'Dallas', state: 'TX', region: 'Texas', industry: 'Telecom', subIndustry: 'Wireless/Internet', era: 'Pre-1950', cityHint: 'a major Texas city known for cowboys' },
  { name: 'Whole Foods', city: 'Austin', state: 'TX', region: 'Texas', industry: 'Retail', subIndustry: 'Grocery', era: '1980-2000', cityHint: "Texas's capital, known for live music" },
  { name: 'Dell', city: 'Round Rock', state: 'TX', region: 'Texas', industry: 'Tech', subIndustry: 'Hardware', era: '1980-2000', cityHint: 'a suburb of Austin' },

  // Midwest
  { name: "McDonald's", city: 'Chicago', state: 'IL', region: 'Midwest', industry: 'Food', subIndustry: 'Fast food', era: '1950-1980', cityHint: 'the Windy City' },
  { name: 'United', city: 'Chicago', state: 'IL', region: 'Midwest', industry: 'Airline', subIndustry: 'Major carrier', era: 'Pre-1950', cityHint: 'the Windy City' },
  { name: 'Target', city: 'Minneapolis', state: 'MN', region: 'Midwest', industry: 'Retail', subIndustry: 'Big box', era: '1950-1980', cityHint: 'the Twin Cities' },
  { name: 'General Mills', city: 'Minneapolis', state: 'MN', region: 'Midwest', industry: 'CPG', subIndustry: 'Packaged food', era: 'Pre-1950', cityHint: 'the Twin Cities' },
  { name: 'Ford', city: 'Dearborn', state: 'MI', region: 'Midwest', industry: 'Auto', subIndustry: 'Traditional auto', era: 'Pre-1950', cityHint: 'near Detroit, the Motor City' },
  { name: 'P&G', city: 'Cincinnati', state: 'OH', region: 'Midwest', industry: 'CPG', subIndustry: 'Consumer goods', era: 'Pre-1950', cityHint: 'the Queen City on the Ohio River' },

  // Southeast
  { name: 'Coca-Cola', city: 'Atlanta', state: 'GA', region: 'Southeast', industry: 'Food', subIndustry: 'Beverage', era: 'Pre-1950', cityHint: "Georgia's capital, home of the '96 Olympics" },
  { name: 'Delta', city: 'Atlanta', state: 'GA', region: 'Southeast', industry: 'Airline', subIndustry: 'Major carrier', era: 'Pre-1950', cityHint: "Georgia's capital, home of the '96 Olympics" },
  { name: 'Home Depot', city: 'Atlanta', state: 'GA', region: 'Southeast', industry: 'Retail', subIndustry: 'Home improvement', era: '1980-2000', cityHint: "Georgia's capital, home of the '96 Olympics" },
  { name: 'FedEx', city: 'Memphis', state: 'TN', region: 'Southeast', industry: 'Shipping', subIndustry: 'Package delivery', era: '1950-1980', cityHint: 'home of Elvis and blues music' },

  // Northeast
  { name: 'JPMorgan', city: 'New York City', state: 'NY', region: 'Northeast', industry: 'Finance', subIndustry: 'Banking', era: 'Pre-1950', cityHint: 'the Big Apple' },
  { name: 'New York Times', city: 'New York City', state: 'NY', region: 'Northeast', industry: 'Media', subIndustry: 'News', era: 'Pre-1950', cityHint: 'the Big Apple' },
  { name: 'Pepsi', city: 'Purchase', state: 'NY', region: 'Northeast', industry: 'Food', subIndustry: 'Beverage', era: 'Pre-1950', cityHint: 'in suburban New York' },
  { name: 'ESPN', city: 'Bristol', state: 'CT', region: 'Northeast', industry: 'Media', subIndustry: 'Sports', era: '1950-1980', cityHint: 'in Connecticut' },
  { name: "Dunkin'", city: 'Canton', state: 'MA', region: 'Northeast', industry: 'Food', subIndustry: 'Coffee', era: '1950-1980', cityHint: 'near Boston' },
  { name: 'Johnson & Johnson', city: 'New Brunswick', state: 'NJ', region: 'Northeast', industry: 'CPG', subIndustry: 'Healthcare/Consumer', era: 'Pre-1950', cityHint: 'in New Jersey' },
];

// =============================================================================
// CLUE MATCHING PATTERNS
// =============================================================================

const REGION_PATTERNS = {
  'Pacific Northwest': ['pacific northwest', 'rain and mountains', 'coffee and tech', 'seattle', 'portland', 'oregon', 'washington state'],
  'Bay Area': ['silicon valley', 'bay area', 'golden gate', 'san francisco', 'tech hub'],
  'SoCal': ['southern california', 'sunshine and beaches', 'la', 'los angeles', 'orange county', 'socal'],
  'Texas': ['lone star', 'texas', 'bbq', 'austin', 'dallas', 'houston'],
  'Midwest': ['midwest', 'heartland', 'cold winters', 'chicago', 'detroit', 'minneapolis'],
  'Southeast': ['southeast', 'southern hospitality', 'sweet tea', 'atlanta', 'memphis'],
  'Northeast': ['northeast', 'east coast', 'history and financial', 'new york', 'boston', 'new jersey'],
};

const INDUSTRY_PATTERNS = {
  'Tech': ['code', 'engineers', 'software', 'disrupting', 'tech', 'technology', 'digital', 'app', 'platform'],
  'Food': ['food', 'restaurants', 'delicious', 'meals', 'eating', 'dining', 'menu'],
  'Retail': ['shopping', 'stores', 'customers', 'inventory', 'retail', 'merchandise'],
  'Finance': ['money', 'investments', 'banking', 'market', 'financial', 'capital', 'funds'],
  'Entertainment': ['movies', 'shows', 'content', 'streaming', 'entertainment', 'media'],
  'Apparel': ['clothing', 'fashion', 'style', 'designs', 'wear', 'apparel'],
  'Auto': ['cars', 'vehicles', 'driving', 'manufacturing', 'automotive', 'motors'],
  'Airline': ['flying', 'planes', 'travel', 'airports', 'flights', 'airline'],
  'Shipping': ['packages', 'delivery', 'logistics', 'shipping', 'freight'],
  'CPG': ['household products', 'brands everyone knows', 'grocery aisle', 'consumer goods', 'packaged'],
  'Media': ['news', 'sports', 'journalism', 'broadcasting', 'reporters'],
  'Telecom': ['phones', 'connectivity', 'networks', 'service', 'wireless', 'telecom'],
};

const SUBINDUSTRY_PATTERNS = {
  'E-commerce': ['online shopping', 'next-day delivery', 'everything store', 'bookstore'],
  'Coffee': ['coffee', 'espresso', 'latte', 'barista'],
  'Software': ['enterprise software', 'cloud', 'office suite'],
  'Warehouse club': ['bulk buying', 'membership', 'wholesale'],
  'Athletic wear': ['sports gear', 'athletes', 'just do it', 'sneakers'],
  'Consumer electronics': ['devices', 'innovation', 'gadgets', 'iphone', 'mac'],
  'Social media': ['connecting people online', 'social network', 'friends', 'posts'],
  'Streaming': ['binge-watching', 'original content', 'subscribers', 'shows'],
  'Rideshare': ['getting a ride', 'uber', 'lyft', 'driver'],
  'Payments': ['credit cards', 'transactions', 'swipe', 'payment'],
  'Media conglomerate': ['theme parks', 'movies', 'characters', 'magic'],
  'Fast casual': ['build-your-own', 'fresh ingredients', 'bowls', 'customizable'],
  'Fast food': ['drive-thrus', 'quick meals', 'burgers', 'fries'],
  'Electric vehicles': ['evs', 'future of cars', 'electric', 'battery'],
  'Outdoor gear': ['coolers', 'camping', 'adventure', 'outdoors'],
  'Low-cost carrier': ['budget airlines', 'no frills', 'cheap flights'],
  'Wireless/Internet': ['phones and connectivity', 'cell service', 'data plans'],
  'Grocery': ['organic food', 'natural', 'healthy eating', 'groceries'],
  'Hardware': ['computers', 'pcs', 'laptops', 'desktop'],
  'Major carrier': ['full-service airlines', 'first class', 'frequent flyer'],
  'Big box': ['target runs', 'affordable style', 'one-stop shop'],
  'Packaged food': ['breakfast cereals', 'snacks', 'pantry staples'],
  'Traditional auto': ['trucks', 'american cars', 'pickup', 'f-150'],
  'Consumer goods': ['household brands', 'cleaning products', 'toiletries'],
  'Beverage': ['soft drinks', 'refreshment', 'soda', 'cola'],
  'Home improvement': ['diy', 'tools', 'renovation', 'hardware store'],
  'Package delivery': ['overnight shipping', 'tracking', 'parcels'],
  'Banking': ['accounts', 'financial services', 'loans', 'deposits'],
  'News': ['journalism', 'breaking stories', 'reporters', 'articles'],
  'Sports': ['sports coverage', 'highlights', 'espn', 'games'],
  'Healthcare/Consumer': ['health products', 'baby care', 'band-aids', 'medicine'],
};

const ERA_PATTERNS = {
  'Pre-1950': ['before world war ii', 'over a century', 'founded in the 1800s', 'very old', 'historic'],
  '1950-1980': ['mid-century', 'boomer era', 'cold war era', '60s', '70s'],
  '1980-2000': ['dot-com era', '90s', '80s', 'before the internet boom'],
  'Post-2000': ['relatively new', 'startup', '21st century', 'recent', 'young company'],
};

// =============================================================================
// CRIMINAL ARCHETYPE DATA
// =============================================================================

const ARCHETYPES = {
  Vest: { keywords: ['circle back', 'mba', 'org chart', 'fleece vest', 'net-net', 'office supplies', 'sweetgreen', 'hamptons'], suspects: { M: 'Chad Worthington', F: 'Priya Mehta' } },
  Disruptor: { keywords: ['mba', 'future of', 'airpods', 'expensive grey t-shirt', 'disruptive', 'hrv', 'asymmetric upside', 'uber of'], suspects: { M: 'Marcus Chen', F: 'Aisha Okonkwo' } },
  ThoughtLeader: { keywords: ['future of', 'airpods', 'printed document', 'presentation clicker', 'linkedin post', 'ted talk', 'few understand this', 'drafting content'], suspects: { M: 'David Brennan', F: 'Keisha Reynolds' } },
  Consultant: { keywords: ['circle back', 'mba', 'org chart', 'printed document', 'presentation clicker', 'ted talk', 'net-net', 'pressure-test'], suspects: { M: 'James Fitzgerald', F: 'Sofia Navarro' } },
  Biohacker: { keywords: ['airpods', 'grey t-shirt', 'oura ring', 'up since 4am', 'seed oils', 'sweetgreen', 'hrv', 'peloton', 'cold plunge'], suspects: { M: 'Derek Washington', F: 'Jasmine Torres' } },
  Lifer: { keywords: ['circle back', 'org chart', 'printed document', 'fleece vest', "the '90s", 'office supplies', "tried that in '98"], suspects: { M: 'Bill Patterson', F: 'Linda Chen' } },
  Evangelist: { keywords: ['future of', 'grey t-shirt', 'oura ring', 'up since 4am', 'seed oils', 'linkedin post', 'ted talk', 'decentralized', 'few understand this', 'peloton', 'disruptive', 'drafting content', 'asymmetric upside', 'cafeteria takes bitcoin'], suspects: { M: 'Tyler Russo', F: 'Destiny Okafor' } },
};

// =============================================================================
// BOT STATE
// =============================================================================

let gameState = null;
let playerId = null;
let isInGame = false;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function log(emoji, message, ...args) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${emoji} [${timestamp}] ${message}`, ...args);
}

function findBrandByName(name) {
  // Handle format like "Tesla HQ" or just "Tesla"
  const cleanName = name.replace(/ HQ$/, '').trim();
  return BRANDS.find(b => b.name.toLowerCase() === cleanName.toLowerCase());
}

function parseOptionToBrand(option) {
  // Parse "Tesla HQ (Austin, TX)" format
  const match = option.match(/^(.+?)\s*(?:HQ)?\s*\(([^,]+),\s*(\w+)\)$/);
  if (match) {
    const [, name, city, state] = match;
    return findBrandByName(name.trim());
  }
  return null;
}

function matchClueToAttributes(clueText) {
  const text = clueText.toLowerCase();
  const matches = { region: null, industry: null, subIndustry: null, era: null, cityHint: null };

  // Check regions
  for (const [region, patterns] of Object.entries(REGION_PATTERNS)) {
    if (patterns.some(p => text.includes(p))) {
      matches.region = region;
      break;
    }
  }

  // Check industries
  for (const [industry, patterns] of Object.entries(INDUSTRY_PATTERNS)) {
    if (patterns.some(p => text.includes(p))) {
      matches.industry = industry;
      break;
    }
  }

  // Check sub-industries (more specific)
  for (const [subIndustry, patterns] of Object.entries(SUBINDUSTRY_PATTERNS)) {
    if (patterns.some(p => text.includes(p))) {
      matches.subIndustry = subIndustry;
      break;
    }
  }

  // Check eras
  for (const [era, patterns] of Object.entries(ERA_PATTERNS)) {
    if (patterns.some(p => text.includes(p))) {
      matches.era = era;
      break;
    }
  }

  // Check city hints (direct brand matching)
  for (const brand of BRANDS) {
    if (brand.cityHint && text.includes(brand.cityHint.toLowerCase())) {
      matches.cityHint = brand.cityHint;
      break;
    }
  }

  return matches;
}

function scoreBrandAgainstClues(brand, clueMatches) {
  let score = 0;
  const reasons = [];

  for (const match of clueMatches) {
    if (match.region && brand.region === match.region) {
      score += 2;
      reasons.push(`region=${match.region}`);
    }
    if (match.industry && brand.industry === match.industry) {
      score += 2;
      reasons.push(`industry=${match.industry}`);
    }
    if (match.subIndustry && brand.subIndustry === match.subIndustry) {
      score += 3; // Sub-industry is more specific
      reasons.push(`subIndustry=${match.subIndustry}`);
    }
    if (match.era && brand.era === match.era) {
      score += 1;
      reasons.push(`era=${match.era}`);
    }
    if (match.cityHint && brand.cityHint === match.cityHint) {
      score += 3; // Direct city hint match
      reasons.push(`cityHint matched`);
    }
  }

  return { score, reasons };
}

function getDestinationClues() {
  if (!gameState || !gameState.cluesCollected) return [];
  return gameState.cluesCollected.filter(c => c.type === 'destination');
}

function getCriminalClues() {
  if (!gameState || !gameState.cluesCollected) return [];
  return gameState.cluesCollected.filter(c => c.type === 'criminal');
}

function analyzeCriminalClues(clues) {
  const archetypeScores = {};
  let gender = null;

  for (const [name, data] of Object.entries(ARCHETYPES)) {
    archetypeScores[name] = 0;
  }

  for (const clue of clues) {
    const text = clue.text.toLowerCase();

    // Check gender
    if (text.includes(' she ') || text.includes(' her ') || text.startsWith('she ')) {
      gender = 'F';
    } else if (text.includes(' he ') || text.includes(' his ') || text.startsWith('he ')) {
      gender = 'M';
    }

    // Score archetypes
    for (const [name, data] of Object.entries(ARCHETYPES)) {
      for (const keyword of data.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          archetypeScores[name]++;
        }
      }
    }
  }

  // Find top archetype
  const sorted = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1]);
  const topArchetype = sorted[0][0];
  const topScore = sorted[0][1];

  let suspect = null;
  if (topScore > 0 && gender) {
    suspect = ARCHETYPES[topArchetype].suspects[gender];
  }

  return { archetypeScores, topArchetype, gender, suspect };
}

// =============================================================================
// DECISION MAKING
// =============================================================================

function decideTravelVote(options) {
  const destClues = getDestinationClues();

  log('🧠', 'Analyzing destination clues:');
  const clueMatches = destClues.map(clue => {
    const match = matchClueToAttributes(clue.text);
    const hasMatch = Object.values(match).some(v => v !== null);
    if (hasMatch) {
      log('   ', `- "${clue.text.slice(0, 60)}..." → ${JSON.stringify(match)}`);
    }
    return match;
  });

  // Score each option
  const scores = options.map(option => {
    const brand = parseOptionToBrand(option);
    if (!brand) {
      return { option, score: 0, reasons: ['unknown brand'] };
    }
    const { score, reasons } = scoreBrandAgainstClues(brand, clueMatches);
    return { option, brand: brand.name, score, reasons };
  });

  // Log scores
  log('📊', 'Scores:');
  for (const s of scores) {
    log('   ', `${s.brand || s.option}: ${s.score} ${s.reasons.length > 0 ? `(${s.reasons.join(', ')})` : ''}`);
  }

  // Pick highest score, or random if all tied at 0
  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score === 0) {
    log('🎲', 'No clue matches - picking randomly');
    return options[Math.floor(Math.random() * options.length)];
  }

  return scores[0].option;
}

function decidePilotVote(options) {
  const criminalClues = getCriminalClues();
  const count = criminalClues.length;

  log('🧠', `Criminal clues collected: ${count}/3`);

  if (count >= 3) {
    log('✅', 'Ready to identify! Analyzing suspect...');
    const analysis = analyzeCriminalClues(criminalClues);
    if (analysis.suspect) {
      log('🔍', `Suspect identified: ${analysis.suspect} (${analysis.topArchetype}, ${analysis.gender === 'F' ? 'Female' : 'Male'})`);
    }

    // Find the "yes" option
    const yesOption = options.find(o => o.toLowerCase().includes('yes'));
    return yesOption || options[0];
  } else {
    log('⏳', `Need ${3 - count} more clues before identifying`);
    // Find the "no" option
    const noOption = options.find(o => o.toLowerCase().includes('no'));
    return noOption || options[1];
  }
}

function decideSearchContinueVote(options, votingType) {
  const criminalClues = getCriminalClues();
  const hours = gameState?.hoursRemaining || 0;
  const cityIndex = gameState?.currentCityIndex || 0;
  const totalCities = gameState?.totalCities || 5;
  const searchedCount = gameState?.searchedLocations?.length || 0;
  const availableCount = gameState?.availableLocations?.length || 0;
  const unsearchedCount = availableCount - searchedCount;

  log('🧠', `Hours: ${hours}, City: ${cityIndex + 1}/${totalCities}, Criminal clues: ${criminalClues.length}/3, Unsearched: ${unsearchedCount}`);

  // If we have enough criminal clues and are at end, continue to pilot
  if (criminalClues.length >= 3 && cityIndex >= totalCities - 1) {
    log('🎯', 'Ready for pilot! Voting to continue.');
    const continueOption = options.find(o =>
      o.toLowerCase().includes('continue') ||
      o.toLowerCase().includes('travel') ||
      o.toLowerCase().includes('move on')
    );
    return continueOption || options[0];
  }

  // If time is tight, prioritize moving forward
  if (hours <= 15 && unsearchedCount > 0) {
    log('⏰', 'Time is tight - voting to continue');
    const continueOption = options.find(o =>
      o.toLowerCase().includes('continue') ||
      o.toLowerCase().includes('travel')
    );
    return continueOption || options[0];
  }

  // If there are unsearched locations and we need clues, search more
  if (unsearchedCount > 0 && criminalClues.length < 3 && hours > 15) {
    log('🔍', 'More locations to search and need clues');
    const searchOption = options.find(o =>
      o.toLowerCase().includes('search') ||
      o.toLowerCase().includes('keep looking')
    );
    return searchOption || options[0];
  }

  // Default: continue/travel
  const continueOption = options.find(o =>
    o.toLowerCase().includes('continue') ||
    o.toLowerCase().includes('travel')
  );
  return continueOption || options[0];
}

function decideVote(votingType, options, prompt) {
  log('🗳️', `VOTE: "${prompt}"`);
  log('   ', `Options: ${options.join(' | ')}`);

  let choice;

  switch (votingType) {
    case 'travel':
      choice = decideTravelVote(options);
      break;
    case 'pilot':
      choice = decidePilotVote(options);
      break;
    case 'search':
    case 'continue':
      choice = decideSearchContinueVote(options, votingType);
      break;
    default:
      log('❓', `Unknown vote type: ${votingType}, picking first option`);
      choice = options[0];
  }

  log('✅', `Voting for: ${choice}`);
  return choice;
}

// =============================================================================
// MINI-GAME HANDLERS
// =============================================================================

function handleMindMeldStart(prompt, timeLimit) {
  log('🧠', `MIND MELD: "${prompt}"`);

  // Generate 3 relevant answers based on the prompt
  const promptLower = prompt.toLowerCase();
  let answers = [];

  // Common word associations by topic
  const associations = {
    'coffee': ['latte', 'espresso', 'morning', 'caffeine', 'beans'],
    'pizza': ['cheese', 'pepperoni', 'crust', 'delivery', 'slice'],
    'tech': ['computer', 'software', 'code', 'startup', 'app'],
    'texas': ['bbq', 'cowboy', 'austin', 'big', 'hot'],
    'seattle': ['rain', 'coffee', 'tech', 'mountains', 'grey'],
    'chicago': ['pizza', 'wind', 'cubs', 'cold', 'lake'],
    'office': ['desk', 'meeting', 'computer', 'email', 'coffee'],
    'breakfast': ['eggs', 'bacon', 'coffee', 'toast', 'cereal'],
    'taco': ['cheese', 'salsa', 'beef', 'shell', 'guac'],
  };

  // Try to match topic
  for (const [topic, words] of Object.entries(associations)) {
    if (promptLower.includes(topic)) {
      answers = words.slice(0, 3);
      break;
    }
  }

  // Fallback generic answers
  if (answers.length === 0) {
    answers = ['coffee', 'computer', 'meeting'];
  }

  log('📝', `Submitting: ${answers.join(', ')}`);
  return answers;
}

function handlePopularityVote(matchup) {
  log('📊', `POPULARITY: ${matchup.optionA?.name || 'A'} vs ${matchup.optionB?.name || 'B'}`);
  log('   ', `Category: ${matchup.category}`);

  // Make an educated guess based on common knowledge
  // For now, pick randomly but log reasoning
  const choice = Math.random() > 0.5 ? 'A' : 'B';
  log('🎲', `Guessing: ${choice}`);
  return choice;
}

function handleHighLowVote(currentCard) {
  log('🃏', `HIGH-LOW: Current card is ${currentCard?.display || 'unknown'}`);

  // Simple strategy: if card is low (2-7), guess higher; if high (8-A), guess lower
  const rank = currentCard?.rank || 8;
  const choice = rank <= 8 ? 'higher' : 'lower';
  log('🎲', `Guessing: ${choice}`);
  return choice;
}

function handleHighLowContinue(streak, timeBanked) {
  log('💰', `HIGH-LOW: Streak=${streak}, Banked=${timeBanked}min`);

  // Cash out if we have a decent streak (3+), otherwise keep going
  if (streak >= 3) {
    log('🏦', 'Good streak - cashing out!');
    return 'cash_out';
  }
  log('🎰', 'Keep going for more!');
  return 'continue';
}

// =============================================================================
// WEBSOCKET MESSAGE HANDLER
// =============================================================================

function handleMessage(ws, msg) {
  switch (msg.type) {
    case 'room-joined':
      log('✅', `Joined room ${msg.roomCode}!`);
      log('👥', `Players: ${msg.players.map(p => `${p.name}${p.isHost ? ' (host)' : ''}`).join(', ')}`);
      const me = msg.players.find(p => !p.isHost);
      if (me) playerId = me.id;
      break;

    case 'player-joined':
      log('👋', `Players: ${msg.players.map(p => p.name).join(', ')}`);
      break;

    case 'player-left':
      log('👋', `Player left. Remaining: ${msg.players.map(p => p.name).join(', ')}`);
      break;

    case 'game-started':
      log('🎬', 'Game started!');
      gameState = msg.gameState;
      isInGame = true;
      if (gameState?.currentCompany) {
        log('🏢', `First stop: ${gameState.currentCompany.name} — ${gameState.currentCompany.city}, ${gameState.currentCompany.state}`);
        log('💎', `Stolen: "${gameState.currentCompany.stolenAsset}"`);
      }
      break;

    case 'game-update':
      gameState = msg.gameState;
      if (gameState) {
        log('📍', `Phase: ${gameState.gamePhase}, City: ${(gameState.currentCityIndex || 0) + 1}/${gameState.totalCities || 5}, Hours: ${gameState.hoursRemaining}`);
      }
      break;

    case 'vote-started':
      // Small delay to seem more human
      setTimeout(() => {
        const choice = decideVote(msg.votingType, msg.options, msg.prompt);
        ws.send(JSON.stringify({ type: 'submit-vote', vote: choice }));
      }, 1000 + Math.random() * 2000);
      break;

    case 'vote-result':
      log('📣', `Vote result: ${msg.winner}`);
      if (msg.wasTiebreaker) {
        log('🎲', `Tiebreaker by ${msg.tiebreakerPlayerName}`);
      }
      gameState = msg.gameState;
      break;

    case 'search-result':
      if (msg.clue) {
        log('🔍', `Clue found: "${msg.clue.text.slice(0, 50)}..." (${msg.clue.type})`);
      }
      gameState = msg.gameState;
      break;

    case 'travel-result':
      if (msg.success) {
        log('✈️', `Arrived! ${msg.message}`);
      } else {
        log('❌', `Travel: ${msg.message}`);
      }
      gameState = msg.gameState;
      break;

    case 'pilot-result':
      if (msg.identified) {
        log('🎯', `Criminal identified! ${msg.message}`);
      } else {
        log('❓', `Pilot: ${msg.message}`);
      }
      gameState = msg.gameState;
      break;

    // Mini-game messages
    case 'mind-meld-start':
      setTimeout(() => {
        const answers = handleMindMeldStart(msg.prompt, msg.timeLimit);
        ws.send(JSON.stringify({ type: 'mind-meld-submit', answers }));
      }, 1500 + Math.random() * 2000);
      break;

    case 'mind-meld-reveal':
      log('🧠', `Mind Meld results: ${msg.totalPoints} points, +${msg.timeBonus} minutes!`);
      break;

    case 'popularity-start':
      setTimeout(() => {
        const choice = handlePopularityVote(msg.matchup);
        ws.send(JSON.stringify({ type: 'popularity-vote', choice }));
      }, 1000 + Math.random() * 2000);
      break;

    case 'popularity-reveal':
      log('📊', `Popularity results: Team got ${msg.results?.teamScore || 0} correct, +${msg.results?.timeBonus || 0} minutes!`);
      break;

    case 'high-low-start':
      setTimeout(() => {
        const choice = handleHighLowVote(msg.currentCard);
        ws.send(JSON.stringify({ type: 'high-low-vote', choice }));
      }, 1000 + Math.random() * 1500);
      break;

    case 'high-low-continue-vote-start':
      setTimeout(() => {
        const choice = handleHighLowContinue(
          gameState?.highLow?.streak || 0,
          gameState?.highLow?.timeBanked || 0
        );
        ws.send(JSON.stringify({ type: 'high-low-continue', choice }));
      }, 1000 + Math.random() * 1500);
      break;

    case 'high-low-reveal':
      if (msg.result === 'correct') {
        log('🃏', `Correct! Streak: ${msg.newStreak}`);
      } else {
        log('🃏', `Wrong! ${msg.teamChoice} was incorrect.`);
      }
      break;

    case 'high-low-complete':
      log('🃏', `High-Low complete! Streak: ${msg.finalStreak}, +${msg.timeBonus} minutes!`);
      break;

    // Clue sharing (for asymmetric clue distribution)
    case 'private-clue':
      log('🔐', `Private clue: "${msg.clue.text.slice(0, 50)}..."`);
      // Auto-share clues after a short delay
      setTimeout(() => {
        log('📤', `Sharing clue...`);
        ws.send(JSON.stringify({ type: 'share-clue', clueId: msg.clueId }));
      }, 1500 + Math.random() * 1500);
      break;

    case 'clue-shared':
      log('📨', `Clue shared by ${msg.sharedBy}: "${msg.clue.text.slice(0, 40)}..."`);
      break;

    case 'no-clue-for-you':
      log('📭', msg.message);
      break;

    case 'game-state':
      if (msg.gameState) {
        gameState = msg.gameState;
      }
      break;

    case 'error':
      log('❌', `Error: ${msg.message}`);
      break;

    default:
      // Log unknown message types for debugging
      if (!['vote-timer', 'vote-update', 'mind-meld-timer', 'mind-meld-player-ready',
            'popularity-timer', 'popularity-player-voted', 'high-low-timer',
            'high-low-player-voted', 'high-low-continue-player-voted',
            'clues-discovered', 'news-headline'].includes(msg.type)) {
        log('📨', `[${msg.type}]`);
      }
  }

  // Check for game end
  if (gameState?.gamePhase === 'victory') {
    log('🏆', 'VICTORY! The criminal has been apprehended!');
    if (gameState.criminalName) {
      log('🎉', `Caught: ${gameState.criminalName}`);
    }
  } else if (gameState?.gamePhase === 'defeat') {
    log('😔', 'DEFEAT! The criminal escaped...');
  }
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  const roomCode = process.argv[2];
  const botName = process.argv[3] || DEFAULT_BOT_NAME;

  if (!roomCode) {
    console.log('Usage: node bot.js <roomCode> [playerName]');
    console.log('');
    console.log('Example: node bot.js ABCD "Detective Bot"');
    process.exit(1);
  }

  log('🤖', `${botName} connecting to room ${roomCode.toUpperCase()}...`);

  const wsUrl = `wss://${PARTYKIT_HOST}/party/${roomCode.toUpperCase()}`;
  const ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    log('🔌', 'Connected! Joining room...');
    ws.send(JSON.stringify({ type: 'join-room', playerName: botName }));
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      handleMessage(ws, msg);
    } catch (e) {
      log('⚠️', `Parse error: ${e.message}`);
    }
  });

  ws.on('close', () => {
    log('👋', 'Disconnected from server');
    process.exit(0);
  });

  ws.on('error', (err) => {
    log('❌', `WebSocket error: ${err.message}`);
  });

  // Keep-alive ping
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000);

  log('⏳', 'Waiting for host to start game...');
  log('💡', 'Press Ctrl+C to exit');
}

main();
