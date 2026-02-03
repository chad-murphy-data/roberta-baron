// Core game types

export type Gender = 'M' | 'F';

export type Archetype =
  | 'Vest'
  | 'Disruptor'
  | 'ThoughtLeader'
  | 'Consultant'
  | 'Biohacker'
  | 'Lifer'
  | 'Evangelist';

export interface Criminal {
  id: string;
  name: string;
  archetype: Archetype;
  gender: Gender;
  description: string;
}

export type Region =
  | 'Pacific Northwest'
  | 'Bay Area'
  | 'SoCal'
  | 'Texas'
  | 'Midwest'
  | 'Southeast'
  | 'Northeast';

export type Industry =
  | 'Tech'
  | 'Food'
  | 'Retail'
  | 'Finance'
  | 'Entertainment'
  | 'Apparel'
  | 'Auto'
  | 'Airline'
  | 'Shipping'
  | 'CPG'
  | 'Media'
  | 'Telecom';

export type Era = 'Pre-1950' | '1950-1980' | '1980-2000' | 'Post-2000';

export interface Brand {
  id: string;
  name: string;
  city: string;
  state: string;
  region: Region;
  industry: Industry;
  subIndustry: string;
  era: Era;
  stolenAsset: string;
  uniqueIdentifier: string;
  isSecret?: boolean; // For Fidelity Mode
  cityHint: string; // Descriptive hint about the city
}

export interface CriminalClue {
  id: number;
  textMale: string;
  textFemale: string;
  archetypes: Archetype[];
  isUnique?: boolean; // Smoking gun clue
}

// Legacy destination clue type (for backwards compatibility)
export interface LegacyDestinationClue {
  type: 'region' | 'state' | 'cityHint' | 'industry' | 'subIndustry' | 'era' | 'unique';
  value: string;
  text: string;
}

// New destination clue type with matching/exclusion criteria
export interface DestinationClue {
  id: string;
  text: string;
  matchesRegion?: Region[];
  matchesState?: string[];
  matchesCity?: string[];
  matchesIndustry?: Industry[];
  matchesSubIndustry?: string[];
  matchesCompanyId?: string[];
  excludesRegion?: Region[];
  excludesState?: string[];
  excludesIndustry?: Industry[];
  strength: 'weak' | 'medium' | 'strong' | 'gimme';
}

// Clue set for a company
export interface DestinationClueSet {
  companyId: string;
  companyName: string;
  city: string;
  state: string;
  region: Region;
  industry: Industry;
  subIndustry: string;
  clues: {
    weak: DestinationClue[];
    medium: DestinationClue[];
    strong: DestinationClue[];
    gimme: DestinationClue;
  };
}

// Destination clue found by player with tracking info
export interface FoundDestinationClue {
  clue: DestinationClue;
  foundBy: string;  // player ID
  foundByName: string;  // player name
  sharedToBoard: boolean;  // has player added to evidence board?
  cityFound: string;
}

// Criminal clue found by player with tracking info
export interface FoundCriminalClue {
  clueId: number;
  text: string;
  foundBy: string;  // player ID
  foundByName: string;  // player name
  sharedToBoard: boolean;
  cityFound: string;
  archetypes: Archetype[];  // which archetypes this clue matches
}

// Game state types
export interface Player {
  id: string;
  name: string;
  connectionId: string;
  isHost?: boolean;
}

export interface Vote {
  playerId: string;
  choice: string;
}

export interface VotingState {
  active: boolean;
  prompt: string;
  options: string[];
  votes: Record<string, string>;
  timeRemaining: number;
  votingType: 'travel' | 'search' | 'continue' | 'pilot';
}

export interface CollectedClue {
  type: 'criminal' | 'destination';
  text: string;
  cityFound: string;
  sharedBy?: string; // Player name who shared this clue (for asymmetric distribution)
  destinationClue?: DestinationClue; // Full clue data for auto-narrowing (new system)
  criminalClueId?: number; // For auto-elimination (new system)
  archetypes?: Archetype[]; // Which archetypes this clue matches (for criminal clues)
}

// For asymmetric clue distribution: tracks which player has which unshared clue
export interface PendingClue {
  clueId: string;
  clue: CollectedClue;
  playerId: string;
  playerName: string;
  shared: boolean;
}

// Mini-game type enum
export type MiniGameType = 'mind_meld' | 'popularity' | 'high_low';

// Mind Meld mini-game types
export interface MindMeldSubmission {
  playerId: string;
  playerName: string;
  answers: string[];  // up to 3 answers
  submittedAt: number;
}

export interface MindMeldMatch {
  answer: string;
  playerIds: string[];
  playerNames: string[];
  matchSize: number;
  points: number;  // n * (n-1) / 2
}

export interface MindMeldState {
  active: boolean;
  phase: 'input' | 'waiting' | 'revealing' | 'complete';
  prompt: string;
  citySlug: string;
  submissions: MindMeldSubmission[];
  timeLimit: number;  // seconds
  timeRemaining: number;
  startedAt: number;
  results?: {
    matches: MindMeldMatch[];
    totalPoints: number;
    timeBonus: number;  // minutes to add
  };
  revealIndex?: number;  // For reveal animation - which match we're showing
}

// Which is More Popular mini-game types
export interface PopularityMatchup {
  id: string;
  cities: string[];  // which cities this matchup can appear in (empty = any)
  category: string;  // "Instagram followers", "Reddit subscribers", etc.
  optionA: {
    name: string;
    value: number;
    formattedValue: string;  // "17.2M"
  };
  optionB: {
    name: string;
    value: number;
    formattedValue: string;
  };
  winner: 'A' | 'B';
}

export interface PopularityVote {
  playerId: string;
  playerName: string;
  choice: 'A' | 'B';
}

export interface PopularityState {
  active: boolean;
  phase: 'voting' | 'reveal' | 'complete';
  matchup: PopularityMatchup;
  votes: PopularityVote[];
  timeLimit: number;
  timeRemaining: number;
  startedAt: number;
  results?: {
    correctPlayers: string[];  // player names who got it right
    incorrectPlayers: string[];  // player names who got it wrong
    teamScore: number;  // X out of Y correct
    timeBonus: number;  // minutes earned
  };
}

// High-Low card mini-game types
export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export interface Card {
  rank: number;  // 2-14 (11=J, 12=Q, 13=K, 14=A)
  suit: CardSuit;
  display: string;  // "7♥", "K♠", etc.
}

export interface HighLowVote {
  playerId: string;
  playerName: string;
  choice: 'higher' | 'lower';
}

export interface HighLowContinueVote {
  playerId: string;
  playerName: string;
  choice: 'continue' | 'cash_out';
}

export interface HighLowState {
  active: boolean;
  phase: 'voting' | 'reveal' | 'continue_vote' | 'complete';
  deck: Card[];  // remaining cards (not sent to client)
  currentCard: Card;
  nextCard?: Card;  // revealed during 'reveal' phase
  streak: number;
  timeBanked: number;  // minutes accumulated
  votes: HighLowVote[];
  continueVotes: HighLowContinueVote[];
  timeLimit: number;
  timeRemaining: number;
  startedAt: number;
  lastResult?: 'correct' | 'wrong' | 'push';
  teamChoice?: 'higher' | 'lower';
  results?: {
    finalStreak: number;
    timeBonus: number;
    reason: 'wrong' | 'cashed_out';
  };
}

// Union type for any mini-game state
export type MiniGameState =
  | { type: 'mind_meld'; state: MindMeldState }
  | { type: 'popularity'; state: PopularityState }
  | { type: 'high_low'; state: HighLowState };

export interface GameState {
  criminal: Criminal;
  companies: Brand[];
  currentCityIndex: number;
  hoursRemaining: number;
  cluesCollected: CollectedClue[];
  criminalIdentified: boolean;
  criminalName: string | null;
  fidelityMode: boolean;
  customVillain?: {
    name: string;
    title?: string;
    photoUrl?: string;
    catchphrase?: string;
  };
  searchedLocations: string[];
  gamePhase: 'lobby' | 'intro' | 'searching' | 'voting' | 'traveling' | 'miniGame' | 'pilot' | 'victory' | 'defeat' | 'wrongCity';
  // Mini-games (one at a time, renamed from mindMeld to support all types)
  activeMiniGame?: MiniGameType;
  mindMeld?: MindMeldState;
  popularity?: PopularityState;
  highLow?: HighLowState;
  miniGamesPlayed: MiniGameType[];  // Track which games played this session for variety
  validCriminalClues: number[]; // IDs of clues assigned to this game
  validDestinationClues: LegacyDestinationClue[][]; // Legacy clues for each destination (fallback)
  travelOptions: string[][]; // Pre-generated 4 options for each city (except last)
  wrongCityName?: string; // Name of wrong city if player traveled to wrong destination
  previousCityIndex?: number; // Index to return to after wrong city
}

export interface Room {
  roomCode: string;
  hostConnectionId: string;
  players: Player[];
  gameState: GameState | null;
  votingState: VotingState | null;
  createdAt: Date;
}

// Location types for searching
export interface SearchLocation {
  id: string;
  name: string;
  description: string;
  isGimme?: boolean;  // If true, costs 2 hours, gives gimme clue
  clueStrength?: 'weak' | 'medium' | 'strong' | 'gimme';  // What type of clue this location gives
}

export const LOCATIONS_BY_INDUSTRY: Record<Industry, SearchLocation[]> = {
  Tech: [
    { id: 'bean-bag', name: 'Bean Bag Lounge', description: 'A casual area with colorful bean bags and whiteboards covered in sticky notes', clueStrength: 'weak' },
    { id: 'ping-pong', name: 'Ping Pong Room', description: 'The unofficial meeting space where important decisions happen between volleys', clueStrength: 'weak' },
    { id: 'nap-pod', name: 'Nap Pod Area', description: 'Futuristic sleeping pods where burnt-out engineers recharge', clueStrength: 'weak' },
    { id: 'cafeteria', name: 'Cafeteria', description: 'Free gourmet food and overheard conversations', clueStrength: 'weak' },
    { id: 'server-room', name: 'Server Room', description: 'Cold, loud, and full of blinking lights', clueStrength: 'weak' },
    { id: 'exec-suite', name: 'Executive Suite', description: 'Corner offices with standing desks and expensive art', clueStrength: 'medium' },
    { id: 'founders-office', name: "Founder's Office", description: 'Where the original vision was dreamed up', clueStrength: 'medium' },
    { id: 'records-dept', name: 'Records Department', description: 'Boring paperwork, but sometimes useful', isGimme: true, clueStrength: 'gimme' }
  ],
  Retail: [
    { id: 'model-store', name: 'Model Store', description: 'A full-scale replica store used for testing new layouts', clueStrength: 'weak' },
    { id: 'distribution', name: 'Distribution Center', description: 'Miles of conveyor belts and robotic arms sorting packages', clueStrength: 'weak' },
    { id: 'buyer-office', name: "Buyer's Office", description: 'Where trends are analyzed and purchasing decisions are made', clueStrength: 'weak' },
    { id: 'customer-service', name: 'Customer Service Center', description: 'Phones ringing, associates helping', clueStrength: 'weak' },
    { id: 'warehouse', name: 'Warehouse', description: 'Pallets stacked high with inventory', clueStrength: 'weak' },
    { id: 'marketing', name: 'Marketing Suite', description: 'Mockups of next season\'s campaigns', clueStrength: 'medium' },
    { id: 'boardroom', name: 'Boardroom', description: 'Where quarterly earnings are discussed', clueStrength: 'medium' },
    { id: 'travel-coord', name: 'Travel Coordination Office', description: 'Expense reports and itineraries', isGimme: true, clueStrength: 'gimme' }
  ],
  Food: [
    { id: 'test-kitchen', name: 'Test Kitchen', description: 'Where new menu items are born (and sometimes die)', clueStrength: 'weak' },
    { id: 'focus-group', name: 'Focus Group Room', description: 'Two-way mirrors and free samples abound', clueStrength: 'weak' },
    { id: 'drive-thru', name: 'Drive-Thru Simulator', description: 'The nerve center of fast food operations', clueStrength: 'weak' },
    { id: 'quality-lab', name: 'Quality Control Lab', description: 'Food scientists checking every ingredient', clueStrength: 'weak' },
    { id: 'supply-chain', name: 'Supply Chain Office', description: 'Maps of farms and distribution routes', clueStrength: 'weak' },
    { id: 'exec-dining', name: 'Executive Dining Room', description: 'Where VIPs taste the latest creations', clueStrength: 'medium' },
    { id: 'brand-room', name: 'Brand Room', description: 'Memorabilia and marketing history on display', clueStrength: 'medium' },
    { id: 'records-dept', name: 'Records Department', description: 'Filing cabinets and travel receipts', isGimme: true, clueStrength: 'gimme' }
  ],
  Finance: [
    { id: 'trading-floor', name: 'Trading Floor', description: 'Screens everywhere, people shouting, money moving', clueStrength: 'weak' },
    { id: 'exec-dining', name: 'Executive Dining Room', description: 'White tablecloths and deals made over steak', clueStrength: 'weak' },
    { id: 'compliance', name: 'Compliance Office', description: 'Where fun goes to die, but regulations are followed', clueStrength: 'weak' },
    { id: 'wealth-mgmt', name: 'Wealth Management Suite', description: 'Leather chairs and discretion', clueStrength: 'weak' },
    { id: 'research', name: 'Research Department', description: 'Analysts crunching numbers and writing reports', clueStrength: 'weak' },
    { id: 'client-lounge', name: 'Client Lounge', description: 'Where high-net-worth individuals wait', clueStrength: 'medium' },
    { id: 'ceo-office', name: "CEO's Office", description: 'Corner suite with a view of the city', clueStrength: 'medium' },
    { id: 'travel-office', name: 'Travel Coordination Office', description: 'Corporate travel bookings and itineraries', isGimme: true, clueStrength: 'gimme' }
  ],
  Entertainment: [
    { id: 'screening', name: 'Screening Room', description: 'Plush seats and a screen that would make any cinema jealous', clueStrength: 'weak' },
    { id: 'writers', name: "Writer's Room", description: 'Whiteboards full of plot ideas and empty coffee cups', clueStrength: 'weak' },
    { id: 'talent', name: 'Talent Office', description: "Signed headshots line the walls of this agent's lair", clueStrength: 'weak' },
    { id: 'props', name: 'Props Department', description: 'Costumes and set pieces from famous productions', clueStrength: 'weak' },
    { id: 'sound-stage', name: 'Sound Stage', description: 'Where the magic is filmed', clueStrength: 'weak' },
    { id: 'exec-bungalow', name: 'Executive Bungalow', description: 'Where deals are made over lunch', clueStrength: 'medium' },
    { id: 'archives', name: 'Archives', description: 'Decades of entertainment history', clueStrength: 'medium' },
    { id: 'records-dept', name: 'Records Department', description: 'Contracts and travel arrangements', isGimme: true, clueStrength: 'gimme' }
  ],
  Apparel: [
    { id: 'design-studio', name: 'Design Studio', description: 'Fabric swatches, mannequins, and mood boards everywhere', clueStrength: 'weak' },
    { id: 'fitting', name: 'Fitting Room', description: 'Mirrors and measuring tapes, the birthplace of fashion', clueStrength: 'weak' },
    { id: 'sample-closet', name: 'Sample Closet', description: 'Racks of prototypes and next season\'s secrets', clueStrength: 'weak' },
    { id: 'photo-studio', name: 'Photo Studio', description: 'Where catalogs come to life', clueStrength: 'weak' },
    { id: 'textile-lab', name: 'Textile Lab', description: 'Testing fabrics for durability and comfort', clueStrength: 'weak' },
    { id: 'showroom', name: 'Showroom', description: 'Where buyers see the new collections', clueStrength: 'medium' },
    { id: 'creative-director', name: "Creative Director's Office", description: 'Vision boards and inspiration everywhere', clueStrength: 'medium' },
    { id: 'travel-coord', name: 'Travel Coordination Office', description: 'Fashion week itineraries and receipts', isGimme: true, clueStrength: 'gimme' }
  ],
  Auto: [
    { id: 'factory', name: 'Factory Floor', description: 'Robots and humans working in precision harmony', clueStrength: 'weak' },
    { id: 'design-lab', name: 'Design Lab', description: 'Clay models and computer renderings of future vehicles', clueStrength: 'weak' },
    { id: 'showroom', name: 'Showroom', description: 'Gleaming vehicles under perfect lighting', clueStrength: 'weak' },
    { id: 'test-track', name: 'Test Track', description: 'Where engineers push vehicles to their limits', clueStrength: 'weak' },
    { id: 'wind-tunnel', name: 'Wind Tunnel', description: 'Aerodynamics testing and research', clueStrength: 'weak' },
    { id: 'heritage-center', name: 'Heritage Center', description: 'Classic vehicles and company history', clueStrength: 'medium' },
    { id: 'ceo-suite', name: 'CEO Suite', description: 'Where the future of mobility is planned', clueStrength: 'medium' },
    { id: 'records-dept', name: 'Records Department', description: 'Vehicle registrations and travel logs', isGimme: true, clueStrength: 'gimme' }
  ],
  Airline: [
    { id: 'gate-area', name: 'Gate Area', description: 'Departures board flickering, passengers waiting', clueStrength: 'weak' },
    { id: 'crew-lounge', name: 'Crew Lounge', description: 'Where pilots and flight attendants decompress', clueStrength: 'weak' },
    { id: 'operations', name: 'Operations Center', description: 'The nerve center tracking every flight in the sky', clueStrength: 'weak' },
    { id: 'training-center', name: 'Training Center', description: 'Flight simulators and safety drills', clueStrength: 'weak' },
    { id: 'maintenance', name: 'Maintenance Hangar', description: 'Where planes get their checkups', clueStrength: 'weak' },
    { id: 'vip-lounge', name: 'VIP Lounge', description: 'First-class treatment before takeoff', clueStrength: 'medium' },
    { id: 'exec-floor', name: 'Executive Floor', description: 'Where routes and partnerships are planned', clueStrength: 'medium' },
    { id: 'travel-records', name: 'Travel Records Office', description: 'Flight manifests and booking histories', isGimme: true, clueStrength: 'gimme' }
  ],
  Shipping: [
    { id: 'sorting', name: 'Sorting Facility', description: 'Packages flying by on conveyor belts at lightning speed', clueStrength: 'weak' },
    { id: 'loading-dock', name: 'Loading Dock', description: 'Trucks backed up, packages being loaded around the clock', clueStrength: 'weak' },
    { id: 'control-room', name: 'Control Room', description: 'Screens tracking every package in the system', clueStrength: 'weak' },
    { id: 'dispatch', name: 'Dispatch Center', description: 'Where routes are optimized in real-time', clueStrength: 'weak' },
    { id: 'fleet-garage', name: 'Fleet Garage', description: 'Rows of trucks and maintenance crews', clueStrength: 'weak' },
    { id: 'customer-care', name: 'Customer Care Center', description: 'Tracking inquiries and delivery issues', clueStrength: 'medium' },
    { id: 'logistics-hub', name: 'Logistics Hub', description: 'The brain of the operation', clueStrength: 'medium' },
    { id: 'records-dept', name: 'Records Department', description: 'Shipping manifests and delivery confirmations', isGimme: true, clueStrength: 'gimme' }
  ],
  CPG: [
    { id: 'rd-lab', name: 'R&D Lab', description: 'Scientists in lab coats testing new formulations', clueStrength: 'weak' },
    { id: 'focus-group-cpg', name: 'Focus Group Room', description: 'Consumers taste-testing and giving feedback', clueStrength: 'weak' },
    { id: 'packaging', name: 'Packaging Line', description: 'Products being boxed and prepared for shelves', clueStrength: 'weak' },
    { id: 'quality-control', name: 'Quality Control', description: 'Testing every batch for consistency', clueStrength: 'weak' },
    { id: 'brand-center', name: 'Brand Center', description: 'History of iconic products and campaigns', clueStrength: 'weak' },
    { id: 'marketing-suite', name: 'Marketing Suite', description: 'Where ad campaigns are born', clueStrength: 'medium' },
    { id: 'innovation-lab', name: 'Innovation Lab', description: 'Next-generation products in development', clueStrength: 'medium' },
    { id: 'travel-coord', name: 'Travel Coordination Office', description: 'Expense reports and meeting schedules', isGimme: true, clueStrength: 'gimme' }
  ],
  Media: [
    { id: 'newsroom', name: 'Newsroom', description: 'Desks cluttered with papers, TVs showing every channel', clueStrength: 'weak' },
    { id: 'editing', name: 'Editing Bay', description: 'Dim lighting and multiple monitors showing footage', clueStrength: 'weak' },
    { id: 'broadcast', name: 'Broadcast Studio', description: 'Cameras, lights, and the anchor desk', clueStrength: 'weak' },
    { id: 'green-room', name: 'Green Room', description: 'Where guests wait before going on air', clueStrength: 'weak' },
    { id: 'archives', name: 'Archives', description: 'Decades of footage and articles', clueStrength: 'weak' },
    { id: 'exec-offices', name: 'Executive Offices', description: 'Where editorial decisions are made', clueStrength: 'medium' },
    { id: 'press-room', name: 'Press Room', description: 'Where breaking news gets printed', clueStrength: 'medium' },
    { id: 'records-dept', name: 'Records Department', description: 'Source files and travel vouchers', isGimme: true, clueStrength: 'gimme' }
  ],
  Telecom: [
    { id: 'network-ops', name: 'Network Operations', description: 'Blinking lights on endless racks of equipment', clueStrength: 'weak' },
    { id: 'retail-store', name: 'Retail Store', description: 'Phones on display, customers comparing plans', clueStrength: 'weak' },
    { id: 'call-center', name: 'Call Center', description: 'Rows of cubicles, headsets, and hold music', clueStrength: 'weak' },
    { id: 'data-center', name: 'Data Center', description: 'Servers humming and cooling systems working overtime', clueStrength: 'weak' },
    { id: 'engineering', name: 'Engineering Lab', description: 'Testing new devices and network equipment', clueStrength: 'weak' },
    { id: 'vip-services', name: 'VIP Services', description: 'White-glove treatment for corporate clients', clueStrength: 'medium' },
    { id: 'strategy', name: 'Strategy Room', description: 'Planning the next big merger', clueStrength: 'medium' },
    { id: 'travel-office', name: 'Travel Coordination Office', description: 'Corporate travel bookings and receipts', isGimme: true, clueStrength: 'gimme' }
  ]
};

// Message types for PartyKit communication
export type ClientMessage =
  | { type: 'join-room'; playerName: string }
  | { type: 'start-game' }
  | { type: 'proceed-from-intro' }
  | { type: 'start-vote'; prompt: string; options: string[]; votingType: VotingState['votingType']; duration?: number }
  | { type: 'submit-vote'; vote: string }
  | { type: 'search-location'; locationId: string }
  | { type: 'travel'; destination: string }
  | { type: 'submit-to-pilot' }
  | { type: 'get-state' }
  | { type: 'get-destinations' }
  | { type: 'get-news' }
  | { type: 'fly-back' }
  | { type: 'share-clue'; clueId: string }
  // Mind Meld messages
  | { type: 'mind-meld-submit'; answers: string[] }
  // Popularity messages
  | { type: 'popularity-vote'; choice: 'A' | 'B' }
  // High-Low messages
  | { type: 'high-low-vote'; choice: 'higher' | 'lower' }
  | { type: 'high-low-continue'; choice: 'continue' | 'cash_out' };

export type ServerMessage =
  | { type: 'room-joined'; roomCode: string; players: Player[]; isHost: boolean }
  | { type: 'player-joined'; players: Player[] }
  | { type: 'player-left'; players: Player[] }
  | { type: 'game-started'; gameState: Partial<GameState> }
  | { type: 'game-update'; gameState: Partial<GameState> }
  | { type: 'vote-started'; prompt: string; options: string[]; votingType: VotingState['votingType']; duration: number }
  | { type: 'vote-timer'; timeRemaining: number }
  | { type: 'vote-update'; votesReceived: number; totalPlayers: number }
  | { type: 'vote-result'; winner: string; allVotes: Record<string, string>; gameState: Partial<GameState>; wasTiebreaker?: boolean; tiebreakerPlayerName?: string }
  | { type: 'search-result'; clue: CollectedClue | null; gameState: Partial<GameState> }
  | { type: 'travel-result'; success: boolean; message: string; timeSpent: number; gameState: Partial<GameState>; wrongCity?: boolean }
  | { type: 'fly-back-result'; success: boolean; message: string; timeSpent: number; gameState: Partial<GameState> }
  | { type: 'pilot-result'; identified: boolean; message: string; possibleMatches?: string[]; gameState: Partial<GameState> }
  | { type: 'game-state'; gameState: Partial<GameState> | null }
  | { type: 'destination-options'; options: string[] }
  | { type: 'news-headline'; headline: string }
  | { type: 'error'; message: string }
  // Asymmetric clue distribution messages
  | { type: 'private-clue'; clue: CollectedClue; clueId: string }  // Sent to individual player
  | { type: 'no-clue-for-you'; message: string }  // Sent to players who don't get a clue this round
  | { type: 'clues-discovered'; count: number; unsharedCount: number; searcherName?: string; message: string }  // Broadcast to all/host
  | { type: 'clue-shared'; clue: CollectedClue; sharedBy: string; gameState: Partial<GameState>; unsharedCount: number }
  // Mind Meld messages
  | { type: 'mind-meld-start'; prompt: string; timeLimit: number }
  | { type: 'mind-meld-player-ready'; playerId: string; playerName: string; readyCount: number; totalPlayers: number }
  | { type: 'mind-meld-timer'; timeRemaining: number }
  | { type: 'mind-meld-reveal'; matches: MindMeldMatch[]; totalPoints: number; timeBonus: number }
  | { type: 'mind-meld-reveal-next'; matchIndex: number; match: MindMeldMatch }
  | { type: 'mind-meld-complete'; newHoursRemaining: number; gameState: Partial<GameState> }
  // Popularity messages
  | { type: 'popularity-start'; matchup: Omit<PopularityMatchup, 'winner'>; timeLimit: number }
  | { type: 'popularity-player-voted'; playerId: string; playerName: string; votedCount: number; totalPlayers: number }
  | { type: 'popularity-timer'; timeRemaining: number }
  | { type: 'popularity-reveal'; matchup: PopularityMatchup; results: PopularityState['results']; gameState: Partial<GameState> }
  | { type: 'popularity-complete'; newHoursRemaining: number; gameState: Partial<GameState> }
  // High-Low messages
  | { type: 'high-low-start'; currentCard: Card; streak: number; timeBanked: number; timeLimit: number }
  | { type: 'high-low-player-voted'; playerId: string; playerName: string; votedCount: number; totalPlayers: number }
  | { type: 'high-low-timer'; timeRemaining: number }
  | { type: 'high-low-reveal'; currentCard: Card; nextCard: Card; result: 'correct' | 'wrong' | 'push'; teamChoice: 'higher' | 'lower'; newStreak: number; timeBanked: number; canContinue: boolean }
  | { type: 'high-low-continue-vote-start'; timeLimit: number }
  | { type: 'high-low-continue-player-voted'; playerId: string; playerName: string; votedCount: number; totalPlayers: number }
  | { type: 'high-low-complete'; finalStreak: number; timeBonus: number; reason: 'wrong' | 'cashed_out'; newHoursRemaining: number; gameState: Partial<GameState> };
