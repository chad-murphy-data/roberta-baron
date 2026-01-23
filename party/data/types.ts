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

export interface DestinationClue {
  type: 'region' | 'state' | 'cityHint' | 'industry' | 'subIndustry' | 'era' | 'unique';
  value: string;
  text: string;
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
}

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
  gamePhase: 'lobby' | 'intro' | 'searching' | 'voting' | 'traveling' | 'pilot' | 'victory' | 'defeat';
  validCriminalClues: number[]; // IDs of clues assigned to this game
  validDestinationClues: DestinationClue[][]; // Clues for each destination
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
}

export const LOCATIONS_BY_INDUSTRY: Record<Industry, SearchLocation[]> = {
  Tech: [
    { id: 'bean-bag', name: 'Bean Bag Lounge', description: 'A casual area with colorful bean bags and whiteboards covered in sticky notes' },
    { id: 'ping-pong', name: 'Ping Pong Room', description: 'The unofficial meeting space where important decisions happen between volleys' },
    { id: 'nap-pod', name: 'Nap Pod Area', description: 'Futuristic sleeping pods where burnt-out engineers recharge' }
  ],
  Retail: [
    { id: 'model-store', name: 'Model Store', description: 'A full-scale replica store used for testing new layouts' },
    { id: 'distribution', name: 'Distribution Center', description: 'Miles of conveyor belts and robotic arms sorting packages' },
    { id: 'buyer-office', name: "Buyer's Office", description: 'Where trends are analyzed and purchasing decisions are made' }
  ],
  Food: [
    { id: 'test-kitchen', name: 'Test Kitchen', description: 'Where new menu items are born (and sometimes die)' },
    { id: 'focus-group', name: 'Focus Group Room', description: 'Two-way mirrors and free samples abound' },
    { id: 'drive-thru', name: 'Drive-Thru', description: 'The nerve center of fast food operations' }
  ],
  Finance: [
    { id: 'trading-floor', name: 'Trading Floor', description: 'Screens everywhere, people shouting, money moving' },
    { id: 'exec-dining', name: 'Executive Dining Room', description: 'White tablecloths and deals made over steak' },
    { id: 'compliance', name: 'Compliance Office', description: 'Where fun goes to die, but regulations are followed' }
  ],
  Entertainment: [
    { id: 'screening', name: 'Screening Room', description: 'Plush seats and a screen that would make any cinema jealous' },
    { id: 'writers', name: "Writer's Room", description: 'Whiteboards full of plot ideas and empty coffee cups' },
    { id: 'talent', name: 'Talent Office', description: "Signed headshots line the walls of this agent's lair" }
  ],
  Apparel: [
    { id: 'design-studio', name: 'Design Studio', description: 'Fabric swatches, mannequins, and mood boards everywhere' },
    { id: 'fitting', name: 'Fitting Room', description: 'Mirrors and measuring tapes, the birthplace of fashion' },
    { id: 'sample-closet', name: 'Sample Closet', description: 'Racks of prototypes and next season\'s secrets' }
  ],
  Auto: [
    { id: 'factory', name: 'Factory Floor', description: 'Robots and humans working in precision harmony' },
    { id: 'design-lab', name: 'Design Lab', description: 'Clay models and computer renderings of future vehicles' },
    { id: 'showroom', name: 'Showroom', description: 'Gleaming vehicles under perfect lighting' }
  ],
  Airline: [
    { id: 'gate-area', name: 'Gate Area', description: 'Departures board flickering, passengers waiting' },
    { id: 'crew-lounge', name: 'Crew Lounge', description: 'Where pilots and flight attendants decompress' },
    { id: 'operations', name: 'Operations Center', description: 'The nerve center tracking every flight in the sky' }
  ],
  Shipping: [
    { id: 'sorting', name: 'Sorting Facility', description: 'Packages flying by on conveyor belts at lightning speed' },
    { id: 'loading-dock', name: 'Loading Dock', description: 'Trucks backed up, packages being loaded around the clock' },
    { id: 'control-room', name: 'Control Room', description: 'Screens tracking every package in the system' }
  ],
  CPG: [
    { id: 'rd-lab', name: 'R&D Lab', description: 'Scientists in lab coats testing new formulations' },
    { id: 'focus-group-cpg', name: 'Focus Group Room', description: 'Consumers taste-testing and giving feedback' },
    { id: 'packaging', name: 'Packaging Line', description: 'Products being boxed and prepared for shelves' }
  ],
  Media: [
    { id: 'newsroom', name: 'Newsroom', description: 'Desks cluttered with papers, TVs showing every channel' },
    { id: 'editing', name: 'Editing Bay', description: 'Dim lighting and multiple monitors showing footage' },
    { id: 'broadcast', name: 'Broadcast Studio', description: 'Cameras, lights, and the anchor desk' }
  ],
  Telecom: [
    { id: 'network-ops', name: 'Network Operations', description: 'Blinking lights on endless racks of equipment' },
    { id: 'retail-store', name: 'Retail Store', description: 'Phones on display, customers comparing plans' },
    { id: 'call-center', name: 'Call Center', description: 'Rows of cubicles, headsets, and hold music' }
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
  | { type: 'get-news' };

export type ServerMessage =
  | { type: 'room-joined'; roomCode: string; players: Player[]; isHost: boolean }
  | { type: 'player-joined'; players: Player[] }
  | { type: 'player-left'; players: Player[] }
  | { type: 'game-started'; gameState: Partial<GameState> }
  | { type: 'game-update'; gameState: Partial<GameState> }
  | { type: 'vote-started'; prompt: string; options: string[]; votingType: VotingState['votingType']; duration: number }
  | { type: 'vote-timer'; timeRemaining: number }
  | { type: 'vote-update'; votesReceived: number; totalPlayers: number }
  | { type: 'vote-result'; winner: string; allVotes: Record<string, string>; gameState: Partial<GameState> }
  | { type: 'search-result'; clue: CollectedClue | null; gameState: Partial<GameState> }
  | { type: 'travel-result'; success: boolean; message: string; timeSpent: number; gameState: Partial<GameState> }
  | { type: 'pilot-result'; identified: boolean; message: string; possibleMatches?: string[]; gameState: Partial<GameState> }
  | { type: 'game-state'; gameState: Partial<GameState> | null }
  | { type: 'destination-options'; options: string[] }
  | { type: 'news-headline'; headline: string }
  | { type: 'error'; message: string };
