// Which is More Popular mini-game data
// City-themed matchups for trivia during travel

import { PopularityMatchup } from './types';

export const POPULARITY_MATCHUPS: PopularityMatchup[] = [
  // General matchups (can appear for any city)
  {
    id: 'mcdonalds-vs-starbucks',
    cities: [],
    category: 'Instagram followers',
    optionA: { name: 'McDonald\'s', value: 4800000, formattedValue: '4.8M' },
    optionB: { name: 'Starbucks', value: 17600000, formattedValue: '17.6M' },
    winner: 'B'
  },
  {
    id: 'coca-cola-vs-pepsi',
    cities: [],
    category: 'Instagram followers',
    optionA: { name: 'Coca-Cola', value: 2900000, formattedValue: '2.9M' },
    optionB: { name: 'Pepsi', value: 1700000, formattedValue: '1.7M' },
    winner: 'A'
  },
  {
    id: 'amazon-vs-walmart',
    cities: [],
    category: 'Employees worldwide',
    optionA: { name: 'Amazon', value: 1540000, formattedValue: '1.54M' },
    optionB: { name: 'Walmart', value: 2100000, formattedValue: '2.1M' },
    winner: 'B'
  },
  {
    id: 'apple-vs-microsoft',
    cities: [],
    category: 'Market cap (billions)',
    optionA: { name: 'Apple', value: 3000, formattedValue: '$3T' },
    optionB: { name: 'Microsoft', value: 2900, formattedValue: '$2.9T' },
    winner: 'A'
  },
  {
    id: 'netflix-vs-disney-plus',
    cities: [],
    category: 'Global subscribers',
    optionA: { name: 'Netflix', value: 260000000, formattedValue: '260M' },
    optionB: { name: 'Disney+', value: 150000000, formattedValue: '150M' },
    winner: 'A'
  },
  {
    id: 'uber-vs-lyft',
    cities: [],
    category: 'US market share',
    optionA: { name: 'Uber', value: 68, formattedValue: '68%' },
    optionB: { name: 'Lyft', value: 32, formattedValue: '32%' },
    winner: 'A'
  },

  // Texas themed
  {
    id: 'austin-vs-dallas-reddit',
    cities: ['austin', 'dallas', 'houston', 'san-antonio', 'fort-worth', 'plano'],
    category: 'Reddit subscribers',
    optionA: { name: 'r/Austin', value: 450000, formattedValue: '450K' },
    optionB: { name: 'r/Dallas', value: 320000, formattedValue: '320K' },
    winner: 'A'
  },
  {
    id: 'whataburger-vs-in-n-out',
    cities: ['austin', 'dallas', 'houston', 'san-antonio', 'fort-worth', 'plano'],
    category: 'Number of locations',
    optionA: { name: 'Whataburger', value: 950, formattedValue: '950' },
    optionB: { name: 'In-N-Out', value: 400, formattedValue: '400' },
    winner: 'A'
  },
  {
    id: 'cowboys-vs-texans',
    cities: ['austin', 'dallas', 'houston', 'fort-worth', 'plano'],
    category: 'Team valuation',
    optionA: { name: 'Dallas Cowboys', value: 9000000000, formattedValue: '$9B' },
    optionB: { name: 'Houston Texans', value: 5600000000, formattedValue: '$5.6B' },
    winner: 'A'
  },

  // Pacific Northwest themed
  {
    id: 'seattle-vs-portland-reddit',
    cities: ['seattle', 'portland', 'beaverton', 'bellevue'],
    category: 'Reddit subscribers',
    optionA: { name: 'r/Seattle', value: 400000, formattedValue: '400K' },
    optionB: { name: 'r/Portland', value: 340000, formattedValue: '340K' },
    winner: 'A'
  },
  {
    id: 'starbucks-vs-peets',
    cities: ['seattle', 'portland', 'beaverton', 'bellevue'],
    category: 'US locations',
    optionA: { name: 'Starbucks', value: 16000, formattedValue: '16,000' },
    optionB: { name: 'Peet\'s Coffee', value: 350, formattedValue: '350' },
    winner: 'A'
  },
  {
    id: 'amazon-vs-microsoft-employees',
    cities: ['seattle', 'bellevue'],
    category: 'Seattle area employees',
    optionA: { name: 'Amazon', value: 75000, formattedValue: '75K' },
    optionB: { name: 'Microsoft', value: 57000, formattedValue: '57K' },
    winner: 'A'
  },

  // Bay Area / California themed
  {
    id: 'sf-vs-la-reddit',
    cities: ['san-francisco', 'san-jose', 'palo-alto', 'mountain-view', 'menlo-park', 'cupertino', 'santa-clara', 'los-gatos'],
    category: 'Reddit subscribers',
    optionA: { name: 'r/sanfrancisco', value: 350000, formattedValue: '350K' },
    optionB: { name: 'r/LosAngeles', value: 580000, formattedValue: '580K' },
    winner: 'B'
  },
  {
    id: 'google-vs-meta-employees',
    cities: ['san-francisco', 'san-jose', 'palo-alto', 'mountain-view', 'menlo-park'],
    category: 'Total employees',
    optionA: { name: 'Google', value: 180000, formattedValue: '180K' },
    optionB: { name: 'Meta', value: 67000, formattedValue: '67K' },
    winner: 'A'
  },
  {
    id: 'stanford-vs-berkeley',
    cities: ['san-francisco', 'san-jose', 'palo-alto', 'mountain-view'],
    category: 'Endowment',
    optionA: { name: 'Stanford', value: 37000000000, formattedValue: '$37B' },
    optionB: { name: 'UC Berkeley', value: 7000000000, formattedValue: '$7B' },
    winner: 'A'
  },

  // SoCal themed
  {
    id: 'disneyland-vs-universal',
    cities: ['los-angeles', 'burbank', 'culver-city'],
    category: 'Annual visitors',
    optionA: { name: 'Disneyland', value: 17000000, formattedValue: '17M' },
    optionB: { name: 'Universal Studios', value: 9000000, formattedValue: '9M' },
    winner: 'A'
  },
  {
    id: 'lakers-vs-clippers',
    cities: ['los-angeles', 'burbank', 'culver-city', 'torrance'],
    category: 'NBA Championships',
    optionA: { name: 'Lakers', value: 17, formattedValue: '17' },
    optionB: { name: 'Clippers', value: 0, formattedValue: '0' },
    winner: 'A'
  },
  {
    id: 'toyota-vs-honda',
    cities: ['torrance', 'los-angeles'],
    category: 'US vehicle sales (2024)',
    optionA: { name: 'Toyota', value: 2200000, formattedValue: '2.2M' },
    optionB: { name: 'Honda', value: 1400000, formattedValue: '1.4M' },
    winner: 'A'
  },

  // Midwest themed
  {
    id: 'chicago-vs-nyc-pizza',
    cities: ['chicago', 'minneapolis', 'detroit', 'cincinnati', 'battle-creek'],
    category: 'Google searches "best pizza"',
    optionA: { name: 'Chicago', value: 74000, formattedValue: '74K/mo' },
    optionB: { name: 'New York', value: 135000, formattedValue: '135K/mo' },
    winner: 'B'
  },
  {
    id: 'cubs-vs-white-sox',
    cities: ['chicago'],
    category: 'World Series wins',
    optionA: { name: 'Cubs', value: 3, formattedValue: '3' },
    optionB: { name: 'White Sox', value: 3, formattedValue: '3' },
    winner: 'A'  // Tie but Cubs are more recent
  },
  {
    id: 'ford-vs-gm',
    cities: ['detroit'],
    category: 'US vehicle sales (2024)',
    optionA: { name: 'Ford', value: 2000000, formattedValue: '2M' },
    optionB: { name: 'GM', value: 2700000, formattedValue: '2.7M' },
    winner: 'B'
  },
  {
    id: 'kelloggs-vs-general-mills',
    cities: ['battle-creek', 'minneapolis'],
    category: 'Annual revenue',
    optionA: { name: 'Kellogg\'s', value: 15000000000, formattedValue: '$15B' },
    optionB: { name: 'General Mills', value: 20000000000, formattedValue: '$20B' },
    winner: 'B'
  },

  // Northeast themed
  {
    id: 'nyc-vs-boston-reddit',
    cities: ['new-york', 'boston', 'providence', 'purchase', 'mclean'],
    category: 'Reddit subscribers',
    optionA: { name: 'r/nyc', value: 500000, formattedValue: '500K' },
    optionB: { name: 'r/boston', value: 380000, formattedValue: '380K' },
    winner: 'A'
  },
  {
    id: 'yankees-vs-red-sox',
    cities: ['new-york', 'boston'],
    category: 'World Series wins',
    optionA: { name: 'Yankees', value: 27, formattedValue: '27' },
    optionB: { name: 'Red Sox', value: 9, formattedValue: '9' },
    winner: 'A'
  },
  {
    id: 'dunkin-vs-starbucks-locations',
    cities: ['boston', 'providence'],
    category: 'Massachusetts locations',
    optionA: { name: 'Dunkin\'', value: 1100, formattedValue: '1,100' },
    optionB: { name: 'Starbucks', value: 400, formattedValue: '400' },
    winner: 'A'
  },
  {
    id: 'visa-vs-mastercard',
    cities: ['mclean', 'purchase', 'new-york'],
    category: 'Cards in circulation',
    optionA: { name: 'Visa', value: 4000000000, formattedValue: '4B' },
    optionB: { name: 'Mastercard', value: 2900000000, formattedValue: '2.9B' },
    winner: 'A'
  },

  // Southeast themed
  {
    id: 'atlanta-vs-charlotte-reddit',
    cities: ['atlanta', 'charlotte', 'memphis'],
    category: 'Reddit subscribers',
    optionA: { name: 'r/Atlanta', value: 280000, formattedValue: '280K' },
    optionB: { name: 'r/Charlotte', value: 180000, formattedValue: '180K' },
    winner: 'A'
  },
  {
    id: 'delta-vs-american',
    cities: ['atlanta'],
    category: 'Fleet size',
    optionA: { name: 'Delta', value: 900, formattedValue: '900' },
    optionB: { name: 'American', value: 950, formattedValue: '950' },
    winner: 'B'
  },
  {
    id: 'fedex-vs-ups',
    cities: ['memphis', 'atlanta'],
    category: 'Daily packages delivered',
    optionA: { name: 'FedEx', value: 15000000, formattedValue: '15M' },
    optionB: { name: 'UPS', value: 25000000, formattedValue: '25M' },
    winner: 'B'
  },
  {
    id: 'tyson-vs-perdue',
    cities: ['springdale'],
    category: 'Annual revenue',
    optionA: { name: 'Tyson Foods', value: 53000000000, formattedValue: '$53B' },
    optionB: { name: 'Perdue Farms', value: 8000000000, formattedValue: '$8B' },
    winner: 'A'
  },

  // Southwest / Mountain themed
  {
    id: 'denver-vs-phoenix-reddit',
    cities: ['denver', 'phoenix'],
    category: 'Reddit subscribers',
    optionA: { name: 'r/Denver', value: 340000, formattedValue: '340K' },
    optionB: { name: 'r/Phoenix', value: 260000, formattedValue: '260K' },
    winner: 'A'
  },
  {
    id: 'skiing-vs-snowboarding',
    cities: ['denver'],
    category: 'US participants annually',
    optionA: { name: 'Skiing', value: 9000000, formattedValue: '9M' },
    optionB: { name: 'Snowboarding', value: 4500000, formattedValue: '4.5M' },
    winner: 'A'
  },

  // Florida themed
  {
    id: 'miami-vs-tampa-reddit',
    cities: ['miami', 'lakeland'],
    category: 'Reddit subscribers',
    optionA: { name: 'r/Miami', value: 200000, formattedValue: '200K' },
    optionB: { name: 'r/Tampa', value: 170000, formattedValue: '170K' },
    winner: 'A'
  },
  {
    id: 'publix-vs-kroger',
    cities: ['lakeland', 'miami', 'atlanta'],
    category: 'Store count',
    optionA: { name: 'Publix', value: 1380, formattedValue: '1,380' },
    optionB: { name: 'Kroger', value: 2700, formattedValue: '2,700' },
    winner: 'B'
  },

  // Tech giants
  {
    id: 'iphone-vs-android',
    cities: ['cupertino', 'mountain-view', 'san-jose', 'san-francisco'],
    category: 'US market share',
    optionA: { name: 'iPhone', value: 57, formattedValue: '57%' },
    optionB: { name: 'Android', value: 42, formattedValue: '42%' },
    winner: 'A'
  },
  {
    id: 'google-vs-bing',
    cities: ['mountain-view', 'seattle', 'bellevue'],
    category: 'US search market share',
    optionA: { name: 'Google', value: 88, formattedValue: '88%' },
    optionB: { name: 'Bing', value: 7, formattedValue: '7%' },
    winner: 'A'
  },
  {
    id: 'twitter-vs-threads',
    cities: ['san-francisco', 'menlo-park'],
    category: 'Monthly active users',
    optionA: { name: 'X (Twitter)', value: 400000000, formattedValue: '400M' },
    optionB: { name: 'Threads', value: 150000000, formattedValue: '150M' },
    winner: 'A'
  },

  // Entertainment / Streaming
  {
    id: 'spotify-vs-apple-music',
    cities: [],
    category: 'Paid subscribers',
    optionA: { name: 'Spotify', value: 240000000, formattedValue: '240M' },
    optionB: { name: 'Apple Music', value: 88000000, formattedValue: '88M' },
    winner: 'A'
  },
  {
    id: 'youtube-vs-tiktok',
    cities: [],
    category: 'Daily active users',
    optionA: { name: 'YouTube', value: 2700000000, formattedValue: '2.7B' },
    optionB: { name: 'TikTok', value: 1200000000, formattedValue: '1.2B' },
    winner: 'A'
  },

  // Food & Beverage
  {
    id: 'chick-fil-a-vs-kfc',
    cities: [],
    category: 'US locations',
    optionA: { name: 'Chick-fil-A', value: 3000, formattedValue: '3,000' },
    optionB: { name: 'KFC', value: 4000, formattedValue: '4,000' },
    winner: 'B'
  },
  {
    id: 'chipotle-vs-qdoba',
    cities: [],
    category: 'US locations',
    optionA: { name: 'Chipotle', value: 3500, formattedValue: '3,500' },
    optionB: { name: 'Qdoba', value: 750, formattedValue: '750' },
    winner: 'A'
  },
];

// Get a random matchup for a city (prefer city-specific, fall back to general)
export function getMatchupForCity(cityName: string, usedMatchupIds: string[] = []): PopularityMatchup | null {
  const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Get matchups valid for this city (city-specific or general)
  const validMatchups = POPULARITY_MATCHUPS.filter(m => {
    // Skip already used
    if (usedMatchupIds.includes(m.id)) return false;
    // Include if city matches or if it's a general matchup (empty cities array)
    return m.cities.length === 0 || m.cities.some(c =>
      c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === citySlug
    );
  });

  if (validMatchups.length === 0) {
    // All matchups used, allow reuse of general ones
    const generalMatchups = POPULARITY_MATCHUPS.filter(m => m.cities.length === 0);
    if (generalMatchups.length === 0) return null;
    return generalMatchups[Math.floor(Math.random() * generalMatchups.length)];
  }

  // Prefer city-specific matchups
  const citySpecific = validMatchups.filter(m => m.cities.length > 0);
  const pool = citySpecific.length > 0 ? citySpecific : validMatchups;

  return pool[Math.floor(Math.random() * pool.length)];
}

// Calculate time bonus based on team accuracy
export function calculatePopularityTimeBonus(correctCount: number, totalPlayers: number): number {
  if (totalPlayers === 0) return 0;
  const accuracy = correctCount / totalPlayers;
  // Max 15 minutes for 100% accuracy, scaled down
  const bonus = Math.round(accuracy * 15);
  return bonus;
}
