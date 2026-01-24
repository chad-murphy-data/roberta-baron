import {
  GameState,
  Criminal,
  Brand,
  CollectedClue,
  DestinationClue,
  Archetype,
  LOCATIONS_BY_INDUSTRY
} from '../data/types';
import { CRIMINALS, getRandomCriminal } from '../data/criminals';
import { BRANDS, PUBLIC_BRANDS, getBrandById } from '../data/brands';
import {
  VALID_CRIMINAL_COMBOS,
  getClueById,
  generateDestinationClues,
  ROBERTA_QUOTES,
  NEWS_HEADLINES,
  FIDELITY_NEWS_HEADLINES
} from '../data/clues';

export class GameEngine {
  private gameState: GameState;

  constructor(fidelityMode: boolean = false, customVillain?: GameState['customVillain']) {
    this.gameState = this.initializeGame(fidelityMode, customVillain);
  }

  private initializeGame(fidelityMode: boolean, customVillain?: GameState['customVillain']): GameState {
    // Select random criminal
    const criminal = getRandomCriminal();

    // Select 5 companies for the criminal's path
    const companies = this.selectCompanyPath(fidelityMode);

    // Select valid clue combination for this criminal
    const validClues = this.selectValidClueCombination(criminal.archetype);

    // Generate destination clues for each destination (cities 2-5)
    const destinationClues = this.generateDestinationCluesForPath(companies);

    // Pre-generate travel options for each city (except the last)
    const travelOptions = this.generateTravelOptionsForPath(companies);

    return {
      criminal,
      companies,
      currentCityIndex: 0,
      hoursRemaining: 39,
      cluesCollected: [],
      criminalIdentified: false,
      criminalName: null,
      fidelityMode,
      customVillain,
      searchedLocations: [],
      gamePhase: 'lobby',
      validCriminalClues: validClues,
      validDestinationClues: destinationClues,
      travelOptions
    };
  }

  private selectCompanyPath(fidelityMode: boolean): Brand[] {
    const pool = fidelityMode ? BRANDS : PUBLIC_BRANDS;
    const selected: Brand[] = [];
    const usedCities = new Set<string>();
    const usedIndustries = new Set<string>();

    // Shuffle the pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // Select 5 diverse companies (or 4 + Fidelity in Fidelity Mode)
    const numToSelect = fidelityMode ? 4 : 5;

    for (const brand of shuffled) {
      if (selected.length >= numToSelect) break;
      if (brand.isSecret) continue;

      // Try to ensure diversity (different cities and industries)
      const cityKey = `${brand.city}-${brand.state}`;
      if (usedCities.has(cityKey) && selected.length > 2) continue;
      if (usedIndustries.has(brand.industry) && selected.length > 3) continue;

      selected.push(brand);
      usedCities.add(cityKey);
      usedIndustries.add(brand.industry);
    }

    // In Fidelity Mode, add Fidelity as the final destination
    if (fidelityMode) {
      const fidelity = getBrandById('fidelity');
      if (fidelity) {
        selected.push(fidelity);
      }
    }

    return selected;
  }

  private selectValidClueCombination(archetype: Archetype): number[] {
    const combos = VALID_CRIMINAL_COMBOS[archetype];
    if (!combos || combos.length === 0) {
      // Fallback: return unique clue for this archetype
      return [];
    }
    const selectedCombo = combos[Math.floor(Math.random() * combos.length)];
    return selectedCombo;
  }

  private generateDestinationCluesForPath(companies: Brand[]): DestinationClue[][] {
    // Generate clues for destinations 2-5 (first city is given)
    return companies.slice(1).map(company => generateDestinationClues(company));
  }

  // Pre-generate 4 travel options for each city in the path
  // This ensures consistent options throughout the game
  private generateTravelOptionsForPath(companies: Brand[]): string[][] {
    const options: string[][] = [];

    for (let i = 0; i < companies.length - 1; i++) {
      const correctNext = companies[i + 1];
      const correctOption = `${correctNext.city}, ${correctNext.state}`;

      // Get 3 decoy options from other brands
      const decoys = this.selectDecoyDestinations(correctOption, 3);

      // Combine and shuffle
      const cityOptions = [correctOption, ...decoys].sort(() => Math.random() - 0.5);
      options.push(cityOptions);
    }

    return options;
  }

  // Select plausible decoy destinations (cities that are NOT the correct answer)
  private selectDecoyDestinations(correctOption: string, count: number): string[] {
    const allCities = PUBLIC_BRANDS
      .map(b => `${b.city}, ${b.state}`)
      .filter(c => c !== correctOption);

    // Remove duplicates
    const uniqueCities = [...new Set(allCities)];

    // Shuffle and take the requested count
    const shuffled = uniqueCities.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  getState(): GameState {
    return { ...this.gameState };
  }

  startGame(): void {
    this.gameState.gamePhase = 'intro';
  }

  proceedFromIntro(): void {
    this.gameState.gamePhase = 'searching';
  }

  getCurrentCompany(): Brand {
    return this.gameState.companies[this.gameState.currentCityIndex];
  }

  getNextDestination(): Brand | null {
    if (this.gameState.currentCityIndex >= this.gameState.companies.length - 1) {
      return null;
    }
    return this.gameState.companies[this.gameState.currentCityIndex + 1];
  }

  search(locationId: string): CollectedClue | null {
    const currentIndex = this.gameState.currentCityIndex;
    const searchKey = `${currentIndex}-${locationId}`;

    // Check if already searched this location
    if (this.gameState.searchedLocations.includes(searchKey)) {
      return null;
    }

    // Deduct time
    this.gameState.hoursRemaining -= 1;
    this.gameState.searchedLocations.push(searchKey);

    // Determine what type of clue to give
    const clue = this.generateClueForSearch(currentIndex, locationId);

    if (clue) {
      this.gameState.cluesCollected.push(clue);
    }

    return clue;
  }

  private generateClueForSearch(cityIndex: number, locationId: string): CollectedClue | null {
    const currentCompany = this.gameState.companies[cityIndex];
    const cityKey = `${currentCompany.city}, ${currentCompany.state}`;

    // Check if we've already given a criminal clue at this city
    const criminalCluesThisCity = this.gameState.cluesCollected.filter(
      c => c.type === 'criminal' && c.cityFound === cityKey
    ).length;

    // Count total criminal clues collected across all cities
    const totalCriminalClues = this.gameState.cluesCollected.filter(
      c => c.type === 'criminal'
    ).length;

    const clues: CollectedClue[] = [];

    // Determine if this location should give a criminal clue
    // Rule: Max 1 criminal clue per city, only first 3 cities, max 3 total
    const shouldGiveCriminalClue =
      cityIndex < 3 &&
      criminalCluesThisCity === 0 &&
      totalCriminalClues < 3 &&
      this.shouldLocationGiveCriminalClue(cityIndex, locationId);

    if (shouldGiveCriminalClue) {
      const clueId = this.gameState.validCriminalClues[totalCriminalClues];
      const clue = getClueById(clueId);
      if (clue) {
        const text = this.gameState.criminal.gender === 'M'
          ? clue.textMale
          : clue.textFemale;
        clues.push({
          type: 'criminal',
          text,
          cityFound: cityKey
        });
      }
    }

    // Always give a destination clue (if not final city)
    // This ensures players always know where to go next
    if (cityIndex < this.gameState.companies.length - 1) {
      const destClues = this.gameState.validDestinationClues[cityIndex];
      if (destClues && destClues.length > 0) {
        // Pick a clue based on how many we've given
        const destCluesGivenThisCity = this.gameState.cluesCollected.filter(
          c => c.type === 'destination' && c.cityFound === cityKey
        ).length;

        // Prioritize certain clue types for narrowing
        const priorityOrder = ['region', 'industry', 'subIndustry', 'cityHint', 'era', 'unique'];
        const clueType = priorityOrder[destCluesGivenThisCity % priorityOrder.length];
        const clue = destClues.find(c => c.type === clueType) || destClues[0];

        clues.push({
          type: 'destination',
          text: clue.text,
          cityFound: cityKey
        });
      }
    }

    // If we collected clues, add them all and return the first one
    // (The search function will add them via cluesCollected)
    if (clues.length > 0) {
      // If there are multiple clues (criminal + destination), add extras to collected
      if (clues.length > 1) {
        // Add all but the first to cluesCollected (the first will be returned and added by search())
        for (let i = 1; i < clues.length; i++) {
          this.gameState.cluesCollected.push(clues[i]);
        }
      }
      return clues[0];
    }

    return null;
  }

  // Determine if a specific location should give the criminal clue for this city
  // Uses deterministic randomization based on city index to ensure consistent behavior
  private shouldLocationGiveCriminalClue(cityIndex: number, locationId: string): boolean {
    const currentCompany = this.gameState.companies[cityIndex];
    const locations = LOCATIONS_BY_INDUSTRY[currentCompany.industry];

    if (!locations || locations.length === 0) return false;

    // Use city index as seed for which location gets the criminal clue
    // This ensures the same location is "chosen" for each city throughout the game
    const criminalClueLocationIndex = cityIndex % locations.length;
    const criminalClueLocation = locations[criminalClueLocationIndex];

    return criminalClueLocation.id === locationId;
  }

  getSearchedLocationsThisCity(): string[] {
    const currentIndex = this.gameState.currentCityIndex;
    return this.gameState.searchedLocations
      .filter(s => s.startsWith(`${currentIndex}-`))
      .map(s => s.split('-')[1]);
  }

  travel(destination: string): { success: boolean; message: string; timeSpent: number } {
    const nextCompany = this.getNextDestination();

    if (!nextCompany) {
      return { success: false, message: 'Already at final destination', timeSpent: 0 };
    }

    // Random flight time between 4-5 hours
    const flightTime = 4 + Math.floor(Math.random() * 2);
    this.gameState.hoursRemaining -= flightTime;

    // Check if correct destination
    const correctCity = `${nextCompany.city}, ${nextCompany.state}`;

    if (destination === correctCity || destination === nextCompany.name) {
      this.gameState.currentCityIndex++;
      this.gameState.gamePhase = 'searching';

      // Check if at final destination
      if (this.gameState.currentCityIndex === this.gameState.companies.length - 1) {
        this.checkEndGame();
      }

      return {
        success: true,
        message: `Arrived at ${nextCompany.name} in ${nextCompany.city}`,
        timeSpent: flightTime
      };
    } else {
      // Wrong destination - they still travel but waste time
      return {
        success: false,
        message: `You traveled to ${destination}, but the trail has gone cold. The criminal isn't here.`,
        timeSpent: flightTime
      };
    }
  }

  checkEndGame(): void {
    const isFinalCity = this.gameState.currentCityIndex === this.gameState.companies.length - 1;

    if (isFinalCity) {
      if (this.gameState.criminalIdentified) {
        this.gameState.gamePhase = 'victory';
      } else {
        this.gameState.gamePhase = 'defeat';
      }
    }

    if (this.gameState.hoursRemaining <= 0) {
      this.gameState.gamePhase = 'defeat';
    }
  }

  submitToAI(clues: string[]): { identified: boolean; message: string; possibleMatches?: string[] } {
    // Deduct time
    this.gameState.hoursRemaining -= 2;

    // Count how many criminal clues we have
    const criminalClues = this.gameState.cluesCollected.filter(c => c.type === 'criminal');

    if (criminalClues.length < 3) {
      return {
        identified: false,
        message: "Insufficient data. Keep investigating to gather more clues about the suspect.",
        possibleMatches: this.getPossibleMatches()
      };
    }

    // With 3+ clues, we can identify the criminal
    this.gameState.criminalIdentified = true;
    this.gameState.criminalName = this.gameState.criminal.name;

    return {
      identified: true,
      message: `CONFIRMED: ${this.gameState.criminal.name}. You have clearance to apprehend.`
    };
  }

  private getPossibleMatches(): string[] {
    const criminalClues = this.gameState.cluesCollected.filter(c => c.type === 'criminal');

    if (criminalClues.length === 0) {
      return CRIMINALS.map(c => c.name);
    }

    // This is a simplified version - in reality you'd cross-reference all clues
    // For now, we'll narrow based on the number of clues
    if (criminalClues.length === 1) {
      // Return criminals of same archetype family (4-6 names)
      return CRIMINALS.filter(c =>
        c.archetype === this.gameState.criminal.archetype ||
        Math.random() > 0.5
      ).slice(0, 6).map(c => c.name);
    }

    if (criminalClues.length === 2) {
      // Return 2-3 names including the real one
      const result = [this.gameState.criminal.name];
      const others = CRIMINALS.filter(c => c.id !== this.gameState.criminal.id);
      result.push(others[Math.floor(Math.random() * others.length)].name);
      return result;
    }

    return [this.gameState.criminal.name];
  }

  getDestinationOptions(): string[] {
    const currentIndex = this.gameState.currentCityIndex;

    // Use pre-generated options for this city
    if (currentIndex < this.gameState.travelOptions.length) {
      return this.gameState.travelOptions[currentIndex];
    }

    // Fallback (shouldn't happen) - generate on the fly
    const nextCompany = this.getNextDestination();
    if (!nextCompany) return [];

    const correctOption = `${nextCompany.city}, ${nextCompany.state}`;
    const decoys = this.selectDecoyDestinations(correctOption, 3);
    return [correctOption, ...decoys].sort(() => Math.random() - 0.5);
  }

  getRobertaQuote(): string {
    return ROBERTA_QUOTES[Math.floor(Math.random() * ROBERTA_QUOTES.length)];
  }

  getNewsHeadline(): string {
    const currentCompany = this.getCurrentCompany();
    const headlines = this.gameState.fidelityMode
      ? [...NEWS_HEADLINES, ...FIDELITY_NEWS_HEADLINES]
      : NEWS_HEADLINES;

    const template = headlines[Math.floor(Math.random() * headlines.length)];
    return template
      .replace('{company}', currentCompany.name)
      .replace('{asset}', currentCompany.stolenAsset);
  }

  isGameOver(): boolean {
    return this.gameState.gamePhase === 'victory' ||
           this.gameState.gamePhase === 'defeat' ||
           this.gameState.hoursRemaining <= 0;
  }

  getVictoryMessage(): string {
    if (this.gameState.fidelityMode && this.gameState.customVillain) {
      return `${this.gameState.customVillain.name} HAS BEEN APPREHENDED.

The Sun Chips Strategic Reserve has been recovered.
Snack baskets are being restocked as we speak.
Harvest Cheddar levels returning to normal.

Abby sends her thanks.`;
    }

    return `${this.gameState.criminal.name} HAS BEEN APPREHENDED.

The stolen corporate assets have been recovered.
${this.gameState.companies[0].name}'s "${this.gameState.companies[0].stolenAsset}" is being returned.

Corporate America owes you its gratitude.`;
  }

  getDefeatMessage(): string {
    if (this.gameState.hoursRemaining <= 0) {
      return `TIME'S UP!

${this.gameState.criminal.name} has escaped with the stolen assets.
You ran out of time before completing the investigation.

Roberta Baron wins this round.`;
    }

    return `SUSPECT ESCAPED!

You found the criminal but couldn't confirm their identity.
Without positive ID, you couldn't make an arrest.
${this.gameState.criminal.name} slipped away.

Better luck next time.`;
  }

  getPublicGameState(): Partial<GameState> & { destinationOptions?: string[] } {
    const state = this.getState();
    const currentCompany = this.getCurrentCompany();

    // Return a sanitized version without revealing the criminal identity
    return {
      currentCityIndex: state.currentCityIndex,
      hoursRemaining: state.hoursRemaining,
      cluesCollected: state.cluesCollected,
      criminalIdentified: state.criminalIdentified,
      criminalName: state.criminalIdentified ? state.criminal.name : null,
      fidelityMode: state.fidelityMode,
      customVillain: state.customVillain,
      gamePhase: state.gamePhase,
      // Current company info
      currentCompany: {
        name: currentCompany.name,
        city: currentCompany.city,
        state: currentCompany.state,
        industry: currentCompany.industry,
        stolenAsset: currentCompany.stolenAsset
      },
      // Locations available to search
      availableLocations: LOCATIONS_BY_INDUSTRY[currentCompany.industry],
      searchedLocations: this.getSearchedLocationsThisCity(),
      // Total cities to visit
      totalCities: state.companies.length,
      // Pre-set destination options for the current city (always exactly 4)
      destinationOptions: this.getDestinationOptions(),
      // Victory/defeat messages
      victoryMessage: state.gamePhase === 'victory' ? this.getVictoryMessage() : undefined,
      defeatMessage: state.gamePhase === 'defeat' ? this.getDefeatMessage() : undefined,
      // Roberta quote for intro
      robertaQuote: state.gamePhase === 'intro' ? this.getRobertaQuote() : undefined,
      // Criminal archetype description (only if identified)
      criminalDescription: state.criminalIdentified ? state.criminal.description : undefined
    } as Partial<GameState> & { destinationOptions?: string[] };
  }
}
