// City-specific prompts for the Mind Meld mini-game
// Each city has a pool of prompts - one is picked randomly when Mind Meld triggers

export const MIND_MELD_PROMPTS: Record<string, string[]> = {
  // Texas
  "austin": [
    "Name something you'd put in a breakfast taco",
    "Name a reason to move to Austin",
    "Name something that's 'weird' about Austin",
  ],
  "dallas": [
    "Name something big in Texas",
    "Name a BBQ meat",
    "Name a cowboy thing",
  ],
  "houston": [
    "Name something at NASA",
    "Name a Tex-Mex dish",
    "Name a reason it's humid",
  ],
  "san-antonio": [
    "Name something at the Alamo",
    "Name a river walk activity",
    "Name a Spurs player (past or present)",
  ],
  "fort-worth": [
    "Name something at a rodeo",
    "Name a western wear item",
    "Name a steakhouse side dish",
  ],

  // Pacific Northwest
  "seattle": [
    "Name a coffee order",
    "Name something to do on a rainy day",
    "Name a tech company",
  ],
  "portland": [
    "Name something 'weird'",
    "Name a hipster hobby",
    "Name something organic or local",
  ],
  "beaverton": [
    "Name a running shoe brand",
    "Name an outdoor activity",
    "Name a type of athletic wear",
  ],
  "bellevue": [
    "Name a tech company",
    "Name something expensive",
    "Name a coffee drink",
  ],

  // Bay Area / California
  "san-francisco": [
    "Name a startup idea",
    "Name something expensive in SF",
    "Name a hill in San Francisco",
  ],
  "san-jose": [
    "Name a tech company",
    "Name a Silicon Valley stereotype",
    "Name something at a tech office",
  ],
  "palo-alto": [
    "Name a startup founder cliché",
    "Name something at Stanford",
    "Name a venture capital term",
  ],
  "mountain-view": [
    "Name a Google perk",
    "Name a tech buzzword",
    "Name something in a campus cafeteria",
  ],
  "menlo-park": [
    "Name a social media feature",
    "Name something in a tech office",
    "Name a Bay Area complaint",
  ],
  "cupertino": [
    "Name an Apple product",
    "Name something minimalist",
    "Name a design term",
  ],
  "santa-clara": [
    "Name a computer component",
    "Name a tech company logo color",
    "Name something at a data center",
  ],
  "los-gatos": [
    "Name a Netflix show",
    "Name something you'd binge watch",
    "Name a streaming service",
  ],

  // SoCal
  "los-angeles": [
    "Name something stuck in LA traffic",
    "Name a celebrity",
    "Name a type of juice or smoothie",
  ],
  "burbank": [
    "Name a Disney character",
    "Name a movie studio",
    "Name something on a film set",
  ],
  "culver-city": [
    "Name a movie genre",
    "Name something at a studio lot",
    "Name an Oscar category",
  ],
  "torrance": [
    "Name a Japanese car brand",
    "Name something at a car dealership",
    "Name a car feature",
  ],
  "newport-beach": [
    "Name something at the beach",
    "Name a boat type",
    "Name a wealthy person stereotype",
  ],

  // Midwest
  "chicago": [
    "Name a pizza topping",
    "Name something you'd do at a Cubs game",
    "Name a reason Chicago winters are tough",
  ],
  "minneapolis": [
    "Name something that's 'not that cold'",
    "Name a winter activity",
    "Name something nice about Minnesota",
  ],
  "detroit": [
    "Name an American car",
    "Name a Motown artist",
    "Name something making a comeback",
  ],
  "cincinnati": [
    "Name a chili topping",
    "Name something at a ballpark",
    "Name a Midwest nice phrase",
  ],
  "battle-creek": [
    "Name a breakfast cereal",
    "Name a cereal mascot",
    "Name something in a cereal box",
  ],
  "bentonville": [
    "Name something you'd buy at Walmart",
    "Name a discount store strategy",
    "Name something in a big box store",
  ],

  // Northeast
  "new-york": [
    "Name a reason your apartment is too small",
    "Name something you'd get from a bodega",
    "Name a subway complaint",
  ],
  "boston": [
    "Name something you'd yell at a ref",
    "Name a Dunkin order",
    "Name a Boston landmark",
  ],
  "providence": [
    "Name a pharmacy item",
    "Name something at a drugstore",
    "Name a New England thing",
  ],
  "purchase": [
    "Name a Pepsi product",
    "Name a soda flavor",
    "Name a snack food",
  ],
  "mclean": [
    "Name a credit card perk",
    "Name a banking fee",
    "Name something in a wallet",
  ],

  // Southeast
  "atlanta": [
    "Name something you do while stuck in traffic",
    "Name a southern food",
    "Name a reason Atlanta is hot",
  ],
  "charlotte": [
    "Name a banking term",
    "Name a NASCAR thing",
    "Name something at a bank",
  ],
  "memphis": [
    "Name a BBQ style",
    "Name an Elvis song",
    "Name a blues instrument",
  ],
  "lakeland": [
    "Name something at a grocery store",
    "Name a Florida thing",
    "Name a supermarket aisle",
  ],
  "springdale": [
    "Name a chicken dish",
    "Name something on a farm",
    "Name a poultry product",
  ],

  // Southwest
  "phoenix": [
    "Name something you do to stay cool",
    "Name a desert animal",
    "Name a reason it's too hot",
  ],
  "denver": [
    "Name an outdoor activity",
    "Name a mountain thing",
    "Name a craft beer style",
  ],
  "plano": [
    "Name a Toyota model",
    "Name a suburb thing",
    "Name something at a corporate campus",
  ],

  // Florida
  "miami": [
    "Name something at the beach",
    "Name a Latin food",
    "Name a reason it's too hot",
  ],

  // DC Area
  "washington-dc": [
    "Name something at the post office",
    "Name a government agency",
    "Name something in DC",
  ],

  // Fallback for cities without specific prompts
  "default": [
    "Name a corporate buzzword",
    "Name something in a break room",
    "Name a reason meetings run long",
    "Name an office snack",
    "Name something on a desk",
    "Name a Monday complaint",
  ],
};

// Convert city name to slug for lookup
function toSlug(cityName: string): string {
  return cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Get a random prompt for a city
export function getPromptForCity(cityName: string): string {
  const slug = toSlug(cityName);
  const prompts = MIND_MELD_PROMPTS[slug] || MIND_MELD_PROMPTS["default"];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Calculate match points: n * (n-1) / 2
export function calculateMatchPoints(matchSize: number): number {
  return (matchSize * (matchSize - 1)) / 2;
}

// Calculate time bonus from total points (capped at 30 minutes)
export function calculateTimeBonus(totalPoints: number): number {
  const bonus = totalPoints * 5; // 5 minutes per point
  return Math.min(bonus, 30); // Cap at 30 minutes
}
