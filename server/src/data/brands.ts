import { Brand } from './types.js';

export const BRANDS: Brand[] = [
  // Pacific Northwest (6 brands)
  {
    id: 'amazon',
    name: 'Amazon',
    city: 'Seattle',
    state: 'WA',
    region: 'Pacific Northwest',
    industry: 'Tech',
    subIndustry: 'E-commerce',
    era: '1980-2000',
    stolenAsset: 'Customer Obsession',
    uniqueIdentifier: 'Started as an online bookstore, now sells everything',
    cityHint: 'known for rain and coffee culture'
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    city: 'Seattle',
    state: 'WA',
    region: 'Pacific Northwest',
    industry: 'Food',
    subIndustry: 'Coffee',
    era: '1950-1980',
    stolenAsset: 'Third Place Philosophy',
    uniqueIdentifier: 'Logo is a twin-tailed mermaid, green and white',
    cityHint: 'known for rain and coffee culture'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    city: 'Redmond',
    state: 'WA',
    region: 'Pacific Northwest',
    industry: 'Tech',
    subIndustry: 'Software',
    era: '1950-1980',
    stolenAsset: 'Enterprise Reliability',
    uniqueIdentifier: 'Makes Windows and Office',
    cityHint: 'a suburb east of Seattle'
  },
  {
    id: 'costco',
    name: 'Costco',
    city: 'Issaquah',
    state: 'WA',
    region: 'Pacific Northwest',
    industry: 'Retail',
    subIndustry: 'Warehouse club',
    era: '1980-2000',
    stolenAsset: 'Member Loyalty',
    uniqueIdentifier: 'Famous for $1.50 hot dogs and bulk buying',
    cityHint: 'a suburb east of Seattle'
  },
  {
    id: 'nike',
    name: 'Nike',
    city: 'Beaverton',
    state: 'OR',
    region: 'Pacific Northwest',
    industry: 'Apparel',
    subIndustry: 'Athletic wear',
    era: '1950-1980',
    stolenAsset: 'Athletic Aspiration',
    uniqueIdentifier: "Slogan is 'Just Do It'",
    cityHint: 'near Portland, Oregon'
  },
  {
    id: 'nordstrom',
    name: 'Nordstrom',
    city: 'Seattle',
    state: 'WA',
    region: 'Pacific Northwest',
    industry: 'Retail',
    subIndustry: 'Department store',
    era: 'Pre-1950',
    stolenAsset: 'Customer Service Excellence',
    uniqueIdentifier: 'Department store famous for customer service',
    cityHint: 'known for rain and coffee culture'
  },

  // Bay Area (7 brands)
  {
    id: 'apple',
    name: 'Apple',
    city: 'Cupertino',
    state: 'CA',
    region: 'Bay Area',
    industry: 'Tech',
    subIndustry: 'Consumer electronics',
    era: '1950-1980',
    stolenAsset: 'Innovation Culture',
    uniqueIdentifier: 'Logo is a fruit with a bite taken out',
    cityHint: 'in Silicon Valley'
  },
  {
    id: 'google',
    name: 'Google',
    city: 'Mountain View',
    state: 'CA',
    region: 'Bay Area',
    industry: 'Tech',
    subIndustry: 'Search/Advertising',
    era: '1980-2000',
    stolenAsset: "Organizing the World's Information",
    uniqueIdentifier: "Mission is to 'organize the world's information'",
    cityHint: 'in Silicon Valley'
  },
  {
    id: 'meta',
    name: 'Meta',
    city: 'Menlo Park',
    state: 'CA',
    region: 'Bay Area',
    industry: 'Tech',
    subIndustry: 'Social media',
    era: 'Post-2000',
    stolenAsset: 'Connecting People',
    uniqueIdentifier: 'Owns Facebook, Instagram, and WhatsApp',
    cityHint: 'in Silicon Valley'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    city: 'Los Gatos',
    state: 'CA',
    region: 'Bay Area',
    industry: 'Entertainment',
    subIndustry: 'Streaming',
    era: '1980-2000',
    stolenAsset: 'Binge-Worthiness',
    uniqueIdentifier: 'Started mailing DVDs, pioneered streaming',
    cityHint: 'in the Bay Area hills'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    city: 'San Francisco',
    state: 'CA',
    region: 'Bay Area',
    industry: 'Tech',
    subIndustry: 'Enterprise software',
    era: '1980-2000',
    stolenAsset: 'Ohana Spirit',
    uniqueIdentifier: "Founder known for Hawaiian shirts and 'Ohana' culture",
    cityHint: 'the city by the bay'
  },
  {
    id: 'uber',
    name: 'Uber',
    city: 'San Francisco',
    state: 'CA',
    region: 'Bay Area',
    industry: 'Tech',
    subIndustry: 'Rideshare',
    era: 'Post-2000',
    stolenAsset: 'Disruption Mindset',
    uniqueIdentifier: "Made 'let me get an Uber' a common phrase",
    cityHint: 'the city by the bay'
  },
  {
    id: 'visa',
    name: 'Visa',
    city: 'San Francisco',
    state: 'CA',
    region: 'Bay Area',
    industry: 'Finance',
    subIndustry: 'Payments',
    era: '1950-1980',
    stolenAsset: 'Everywhere You Want To Be',
    uniqueIdentifier: 'Blue and gold credit card network',
    cityHint: 'the city by the bay'
  },

  // SoCal (6 brands)
  {
    id: 'disney',
    name: 'Disney',
    city: 'Burbank',
    state: 'CA',
    region: 'SoCal',
    industry: 'Entertainment',
    subIndustry: 'Media conglomerate',
    era: 'Pre-1950',
    stolenAsset: 'Movie Magic',
    uniqueIdentifier: "Known for 'the happiest place on Earth'",
    cityHint: 'in the Los Angeles area'
  },
  {
    id: 'chipotle',
    name: 'Chipotle',
    city: 'Newport Beach',
    state: 'CA',
    region: 'SoCal',
    industry: 'Food',
    subIndustry: 'Fast casual',
    era: '1980-2000',
    stolenAsset: 'Food With Integrity',
    uniqueIdentifier: "Big burritos and 'food with integrity'",
    cityHint: 'in Orange County, California'
  },
  {
    id: 'tacobell',
    name: 'Taco Bell',
    city: 'Irvine',
    state: 'CA',
    region: 'SoCal',
    industry: 'Food',
    subIndustry: 'Fast food',
    era: '1950-1980',
    stolenAsset: 'Fourth Meal Energy',
    uniqueIdentifier: "Doritos Locos Tacos and 'Live Más'",
    cityHint: 'in Orange County, California'
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    city: 'Ventura',
    state: 'CA',
    region: 'SoCal',
    industry: 'Apparel',
    subIndustry: 'Outdoor wear',
    era: '1950-1980',
    stolenAsset: 'Environmental Conscience',
    uniqueIdentifier: "Ran an ad saying 'Don't Buy This Jacket'",
    cityHint: 'a coastal California city'
  },
  {
    id: 'sweetgreen',
    name: 'Sweetgreen',
    city: 'Los Angeles',
    state: 'CA',
    region: 'SoCal',
    industry: 'Food',
    subIndustry: 'Fast casual',
    era: 'Post-2000',
    stolenAsset: 'Healthy Halo Effect',
    uniqueIdentifier: 'Salad chain popular with health-conscious corporate crowd',
    cityHint: 'the City of Angels'
  },
  {
    id: 'innout',
    name: 'In-N-Out',
    city: 'Irvine',
    state: 'CA',
    region: 'SoCal',
    industry: 'Food',
    subIndustry: 'Fast food',
    era: 'Pre-1950',
    stolenAsset: 'Secret Menu Mystique',
    uniqueIdentifier: "West Coast burger chain with a 'secret menu'",
    cityHint: 'in Orange County, California'
  },

  // Texas (6 brands)
  {
    id: 'tesla',
    name: 'Tesla',
    city: 'Austin',
    state: 'TX',
    region: 'Texas',
    industry: 'Auto',
    subIndustry: 'Electric vehicles',
    era: 'Post-2000',
    stolenAsset: 'Future-Forward Vision',
    uniqueIdentifier: 'Electric cars, also makes solar panels and batteries',
    cityHint: "Texas's capital, known for live music"
  },
  {
    id: 'yeti',
    name: 'Yeti',
    city: 'Austin',
    state: 'TX',
    region: 'Texas',
    industry: 'CPG',
    subIndustry: 'Outdoor gear',
    era: 'Post-2000',
    stolenAsset: 'Rugged Premium-ness',
    uniqueIdentifier: 'Premium coolers and tumblers that became status symbols',
    cityHint: "Texas's capital, known for live music"
  },
  {
    id: 'southwest',
    name: 'Southwest',
    city: 'Dallas',
    state: 'TX',
    region: 'Texas',
    industry: 'Airline',
    subIndustry: 'Low-cost carrier',
    era: '1950-1980',
    stolenAsset: 'Bags Fly Free Spirit',
    uniqueIdentifier: 'Free checked bags and no assigned seats',
    cityHint: 'a major Texas city known for cowboys'
  },
  {
    id: 'att',
    name: 'AT&T',
    city: 'Dallas',
    state: 'TX',
    region: 'Texas',
    industry: 'Telecom',
    subIndustry: 'Wireless/Internet',
    era: 'Pre-1950',
    stolenAsset: 'Connectivity Promise',
    uniqueIdentifier: 'Was once the phone monopoly known as Ma Bell',
    cityHint: 'a major Texas city known for cowboys'
  },
  {
    id: 'wholefoods',
    name: 'Whole Foods',
    city: 'Austin',
    state: 'TX',
    region: 'Texas',
    industry: 'Retail',
    subIndustry: 'Grocery',
    era: '1980-2000',
    stolenAsset: 'Organic Authenticity',
    uniqueIdentifier: "Upscale grocery sometimes called 'Whole Paycheck'",
    cityHint: "Texas's capital, known for live music"
  },
  {
    id: 'dell',
    name: 'Dell',
    city: 'Round Rock',
    state: 'TX',
    region: 'Texas',
    industry: 'Tech',
    subIndustry: 'Hardware',
    era: '1980-2000',
    stolenAsset: 'Direct-to-Customer Trust',
    uniqueIdentifier: 'Pioneered direct-to-consumer PC sales from a dorm room',
    cityHint: 'a suburb of Austin'
  },

  // Midwest (6 brands)
  {
    id: 'mcdonalds',
    name: "McDonald's",
    city: 'Chicago',
    state: 'IL',
    region: 'Midwest',
    industry: 'Food',
    subIndustry: 'Fast food',
    era: '1950-1980',
    stolenAsset: 'Consistent Comfort',
    uniqueIdentifier: "Golden arches and 'I'm Lovin' It'",
    cityHint: 'the Windy City'
  },
  {
    id: 'united',
    name: 'United',
    city: 'Chicago',
    state: 'IL',
    region: 'Midwest',
    industry: 'Airline',
    subIndustry: 'Major carrier',
    era: 'Pre-1950',
    stolenAsset: 'Friendly Skies',
    uniqueIdentifier: "'Fly the friendly skies'",
    cityHint: 'the Windy City'
  },
  {
    id: 'target',
    name: 'Target',
    city: 'Minneapolis',
    state: 'MN',
    region: 'Midwest',
    industry: 'Retail',
    subIndustry: 'Big box',
    era: '1950-1980',
    stolenAsset: 'Affordable Style',
    uniqueIdentifier: "Red bullseye, affectionately called 'Tar-zhay'",
    cityHint: 'the Twin Cities'
  },
  {
    id: 'generalmills',
    name: 'General Mills',
    city: 'Minneapolis',
    state: 'MN',
    region: 'Midwest',
    industry: 'CPG',
    subIndustry: 'Packaged food',
    era: 'Pre-1950',
    stolenAsset: 'Breakfast Nostalgia',
    uniqueIdentifier: 'Makes Cheerios, Lucky Charms, and Pillsbury',
    cityHint: 'the Twin Cities'
  },
  {
    id: 'ford',
    name: 'Ford',
    city: 'Dearborn',
    state: 'MI',
    region: 'Midwest',
    industry: 'Auto',
    subIndustry: 'Traditional auto',
    era: 'Pre-1950',
    stolenAsset: 'American Toughness',
    uniqueIdentifier: "F-150 is America's best-selling vehicle",
    cityHint: 'near Detroit, the Motor City'
  },
  {
    id: 'pg',
    name: 'P&G',
    city: 'Cincinnati',
    state: 'OH',
    region: 'Midwest',
    industry: 'CPG',
    subIndustry: 'Consumer goods',
    era: 'Pre-1950',
    stolenAsset: 'Household Reliability',
    uniqueIdentifier: 'Makes Tide, Pampers, Gillette, and dozens of brands',
    cityHint: 'on the Ohio River'
  },

  // Southeast (6 brands)
  {
    id: 'cocacola',
    name: 'Coca-Cola',
    city: 'Atlanta',
    state: 'GA',
    region: 'Southeast',
    industry: 'Food',
    subIndustry: 'Beverage',
    era: 'Pre-1950',
    stolenAsset: 'Brand Authenticity',
    uniqueIdentifier: "Secret formula, 'the real thing'",
    cityHint: "Georgia's capital, home of the '96 Olympics"
  },
  {
    id: 'delta',
    name: 'Delta',
    city: 'Atlanta',
    state: 'GA',
    region: 'Southeast',
    industry: 'Airline',
    subIndustry: 'Major carrier',
    era: 'Pre-1950',
    stolenAsset: 'Premium Dependability',
    uniqueIdentifier: 'Named after the Mississippi Delta region',
    cityHint: "Georgia's capital, home of the '96 Olympics"
  },
  {
    id: 'homedepot',
    name: 'Home Depot',
    city: 'Atlanta',
    state: 'GA',
    region: 'Southeast',
    industry: 'Retail',
    subIndustry: 'Home improvement',
    era: '1950-1980',
    stolenAsset: 'DIY Empowerment',
    uniqueIdentifier: "Orange stores, 'How Doers Get More Done'",
    cityHint: "Georgia's capital, home of the '96 Olympics"
  },
  {
    id: 'chickfila',
    name: 'Chick-fil-A',
    city: 'Atlanta',
    state: 'GA',
    region: 'Southeast',
    industry: 'Food',
    subIndustry: 'Fast food',
    era: '1950-1980',
    stolenAsset: 'Polite Efficiency',
    uniqueIdentifier: "Closed on Sundays, cows say 'Eat Mor Chikin'",
    cityHint: "Georgia's capital, home of the '96 Olympics"
  },
  {
    id: 'ups',
    name: 'UPS',
    city: 'Atlanta',
    state: 'GA',
    region: 'Southeast',
    industry: 'Shipping',
    subIndustry: 'Package delivery',
    era: 'Pre-1950',
    stolenAsset: 'What Brown Can Do',
    uniqueIdentifier: "'Brown trucks, 'What can Brown do for you?'",
    cityHint: "Georgia's capital, home of the '96 Olympics"
  },
  {
    id: 'fedex',
    name: 'FedEx',
    city: 'Memphis',
    state: 'TN',
    region: 'Southeast',
    industry: 'Shipping',
    subIndustry: 'Package delivery',
    era: '1950-1980',
    stolenAsset: 'Overnight Certainty',
    uniqueIdentifier: 'Hidden arrow in the logo, overnight shipping pioneer',
    cityHint: 'home of Elvis and blues music'
  },

  // Northeast (6 brands + 1 secret)
  {
    id: 'jpmorgan',
    name: 'JPMorgan',
    city: 'New York City',
    state: 'NY',
    region: 'Northeast',
    industry: 'Finance',
    subIndustry: 'Banking',
    era: 'Pre-1950',
    stolenAsset: 'Financial Authority',
    uniqueIdentifier: 'Largest US bank, named after legendary financier',
    cityHint: 'the Big Apple'
  },
  {
    id: 'nytimes',
    name: 'The New York Times',
    city: 'New York City',
    state: 'NY',
    region: 'Northeast',
    industry: 'Media',
    subIndustry: 'News',
    era: 'Pre-1950',
    stolenAsset: 'Journalistic Integrity',
    uniqueIdentifier: "'All the News That's Fit to Print', famous crossword",
    cityHint: 'the Big Apple'
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    city: 'Purchase',
    state: 'NY',
    region: 'Northeast',
    industry: 'Food',
    subIndustry: 'Beverage',
    era: 'Pre-1950',
    stolenAsset: 'Next Generation Appeal',
    uniqueIdentifier: "Coke's main rival, red white and blue globe",
    cityHint: 'in suburban New York'
  },
  {
    id: 'espn',
    name: 'ESPN',
    city: 'Bristol',
    state: 'CT',
    region: 'Northeast',
    industry: 'Media',
    subIndustry: 'Sports',
    era: '1950-1980',
    stolenAsset: 'Sports Authority',
    uniqueIdentifier: "'The Worldwide Leader in Sports', SportsCenter",
    cityHint: 'in Connecticut'
  },
  {
    id: 'dunkin',
    name: "Dunkin'",
    city: 'Canton',
    state: 'MA',
    region: 'Northeast',
    industry: 'Food',
    subIndustry: 'Coffee',
    era: '1950-1980',
    stolenAsset: 'America Runs On It Energy',
    uniqueIdentifier: "'America Runs on Dunkin'', dropped 'Donuts' from name",
    cityHint: 'near Boston'
  },
  {
    id: 'jnj',
    name: 'Johnson & Johnson',
    city: 'New Brunswick',
    state: 'NJ',
    region: 'Northeast',
    industry: 'CPG',
    subIndustry: 'Healthcare/Consumer',
    era: 'Pre-1950',
    stolenAsset: 'Trusted Gentleness',
    uniqueIdentifier: 'Makes Band-Aid, Tylenol, baby products',
    cityHint: 'in New Jersey'
  },
  // Secret Fidelity brand
  {
    id: 'fidelity',
    name: 'Fidelity',
    city: 'Boston',
    state: 'MA',
    region: 'Northeast',
    industry: 'Finance',
    subIndustry: 'Investment management',
    era: 'Pre-1950',
    stolenAsset: "Abby's Sun Chips Strategic Reserve",
    uniqueIdentifier: 'Trusted stewardship, a financial company that is actually private',
    isSecret: true,
    cityHint: 'home of the Red Sox and the Freedom Trail'
  }
];

// Public brands only (excluding Fidelity for normal mode)
export const PUBLIC_BRANDS = BRANDS.filter(b => !b.isSecret);

export function getBrandById(id: string): Brand | undefined {
  return BRANDS.find(b => b.id === id);
}

export function getBrandsByRegion(region: string): Brand[] {
  return BRANDS.filter(b => b.region === region && !b.isSecret);
}

export function getBrandsByIndustry(industry: string): Brand[] {
  return BRANDS.filter(b => b.industry === industry && !b.isSecret);
}

export function getRandomBrands(count: number, includeSecret: boolean = false): Brand[] {
  const pool = includeSecret ? BRANDS : PUBLIC_BRANDS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get unique cities from brands
export function getUniqueCities(): string[] {
  const cities = new Set<string>();
  PUBLIC_BRANDS.forEach(b => cities.add(`${b.city}, ${b.state}`));
  return Array.from(cities);
}
