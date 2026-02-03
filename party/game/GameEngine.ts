import {
  GameState,
  Criminal,
  Brand,
  CollectedClue,
  DestinationClue,
  LegacyDestinationClue,
  FoundDestinationClue,
  Archetype,
  MiniGameType,
  LOCATIONS_BY_INDUSTRY,
  SearchLocation
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
import {
  CLUES_BY_COMPANY_ID,
  getRandomClue as getDestinationClueByStrength,
  ALL_DESTINATION_CLUES
} from '../data/destinationClues';
import { DestinationClueSet } from '../data/types';

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
      miniGamesPlayed: [],
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

  private generateDestinationCluesForPath(companies: Brand[]): LegacyDestinationClue[][] {
    // Generate clues for destinations 2-5 (first city is given)
    // This is the legacy system, used as fallback when new clue bank doesn't have a company
    return companies.slice(1).map(company => generateDestinationClues(company));
  }

  // Pre-generate 4 travel options for each city in the path
  // This ensures consistent options throughout the game
  // Options are company names (e.g., "Starbucks") not cities
  private generateTravelOptionsForPath(companies: Brand[]): string[][] {
    const options: string[][] = [];

    for (let i = 0; i < companies.length - 1; i++) {
      const correctNext = companies[i + 1];
      const correctOption = correctNext.name;

      // Get 3 decoy options from other brands (excluding companies in the path)
      const pathCompanyNames = companies.map(c => c.name);
      const decoys = this.selectDecoyCompanies(correctOption, pathCompanyNames, 3);

      // Combine and shuffle
      const companyOptions = [correctOption, ...decoys].sort(() => Math.random() - 0.5);
      options.push(companyOptions);
    }

    return options;
  }

  // Select plausible decoy companies that share SOME but not ALL attributes with the correct answer
  // This makes the game more challenging by requiring multiple clues to deduce the answer
  private selectDecoyCompanies(correctOption: string, excludeNames: string[], count: number): string[] {
    const correctBrand = PUBLIC_BRANDS.find(b => b.name === correctOption);
    if (!correctBrand) {
      // Fallback to random selection
      const allCompanies = PUBLIC_BRANDS
        .map(b => b.name)
        .filter(name => name !== correctOption && !excludeNames.includes(name));
      return allCompanies.sort(() => Math.random() - 0.5).slice(0, count);
    }

    // Score each potential decoy by shared attributes
    const candidates = PUBLIC_BRANDS
      .filter(b => b.name !== correctOption && !excludeNames.includes(b.name))
      .map(brand => ({
        brand,
        sharedAttributes: this.countSharedAttributes(correctBrand, brand)
      }));

    // Best decoys share 1-2 attributes (not 0, not all)
    const goodDecoys = candidates
      .filter(c => c.sharedAttributes >= 1 && c.sharedAttributes <= 2)
      .sort(() => Math.random() - 0.5);

    const decoys: Brand[] = [];

    // Try to get at least one decoy with same region
    const sameRegion = goodDecoys.find(c => c.brand.region === correctBrand.region);
    if (sameRegion && !decoys.includes(sameRegion.brand)) {
      decoys.push(sameRegion.brand);
    }

    // Try to get at least one decoy with same industry
    const sameIndustry = goodDecoys.find(c =>
      c.brand.industry === correctBrand.industry && !decoys.includes(c.brand)
    );
    if (sameIndustry) {
      decoys.push(sameIndustry.brand);
    }

    // Fill remaining slots with other good decoys
    for (const c of goodDecoys) {
      if (decoys.length >= count) break;
      if (!decoys.includes(c.brand)) {
        decoys.push(c.brand);
      }
    }

    // If not enough good decoys, add random ones
    const remaining = candidates
      .filter(c => !decoys.includes(c.brand))
      .sort(() => Math.random() - 0.5);

    for (const c of remaining) {
      if (decoys.length >= count) break;
      decoys.push(c.brand);
    }

    return decoys.map(b => b.name);
  }

  // Count how many attributes two brands share
  private countSharedAttributes(a: Brand, b: Brand): number {
    let shared = 0;
    if (a.region === b.region) shared++;
    if (a.industry === b.industry) shared++;
    if (a.subIndustry === b.subIndustry) shared++;
    if (a.era === b.era) shared++;
    if (a.state === b.state) shared++;
    return shared;
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

  setGamePhase(phase: GameState['gamePhase']): void {
    this.gameState.gamePhase = phase;
  }

  addTime(hours: number): void {
    this.gameState.hoursRemaining += hours;
  }

  // Mini-game tracking
  recordMiniGamePlayed(game: MiniGameType): void {
    this.gameState.miniGamesPlayed.push(game);
  }

  getMiniGamesPlayed(): MiniGameType[] {
    return this.gameState.miniGamesPlayed || [];
  }

  setActiveMiniGame(game: MiniGameType | undefined): void {
    this.gameState.activeMiniGame = game;
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

    // Get the location to check if it's a gimme (costs 2 hours)
    const currentCompany = this.gameState.companies[currentIndex];
    const locations = LOCATIONS_BY_INDUSTRY[currentCompany.industry];
    const location = locations?.find(l => l.id === locationId);
    const isGimme = location?.isGimme || false;

    // Deduct time - gimme locations cost 2 hours
    this.gameState.hoursRemaining -= isGimme ? 2 : 1;
    this.gameState.searchedLocations.push(searchKey);

    // Determine what type of clue to give
    const clue = this.generateClueForSearch(currentIndex, locationId);

    if (clue) {
      this.gameState.cluesCollected.push(clue);
    }

    return clue;
  }

  // Search that returns ALL clues found (for asymmetric distribution)
  // Does NOT add clues to collected - that happens when players share
  searchWithMultipleClues(locationId: string): CollectedClue[] {
    const currentIndex = this.gameState.currentCityIndex;
    const searchKey = `${currentIndex}-${locationId}`;

    // Check if already searched this location
    if (this.gameState.searchedLocations.includes(searchKey)) {
      return [];
    }

    // Get the location to check if it's a gimme (costs 2 hours)
    const currentCompany = this.gameState.companies[currentIndex];
    const locations = LOCATIONS_BY_INDUSTRY[currentCompany.industry];
    const location = locations?.find(l => l.id === locationId);
    const isGimme = location?.isGimme || false;

    // Deduct time - gimme locations cost 2 hours
    this.gameState.hoursRemaining -= isGimme ? 2 : 1;
    this.gameState.searchedLocations.push(searchKey);

    // Generate all clues for this search
    return this.generateAllCluesForSearch(currentIndex, locationId);
  }

  // Add a clue that was shared by a player (for asymmetric distribution)
  addSharedClue(clue: CollectedClue): void {
    this.gameState.cluesCollected.push(clue);
  }

  private generateClueForSearch(cityIndex: number, locationId: string): CollectedClue | null {
    const currentCompany = this.gameState.companies[cityIndex];
    const cityKey = `${currentCompany.city}, ${currentCompany.state}`;

    // Get the location to determine clue strength
    const locations = LOCATIONS_BY_INDUSTRY[currentCompany.industry];
    const location = locations?.find(l => l.id === locationId);
    const clueStrength = location?.clueStrength || 'weak';

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
          cityFound: cityKey,
          criminalClueId: clueId,
          archetypes: clue.archetypes
        });
      }
    }

    // Give a destination clue (if not final city)
    // Use the new strength-based clue system from destination clue bank
    if (cityIndex < this.gameState.companies.length - 1) {
      const nextCompany = this.gameState.companies[cityIndex + 1];
      const clueSet = CLUES_BY_COMPANY_ID[nextCompany.id];

      if (clueSet) {
        // Get clue based on location strength
        const destClue = getDestinationClueByStrength(nextCompany.id, clueStrength);

        if (destClue) {
          clues.push({
            type: 'destination',
            text: destClue.text,
            cityFound: cityKey,
            // Store the full clue data for auto-narrowing
            destinationClue: destClue
          });
        }
      } else {
        // Fallback to legacy system if no clue set exists for this company
        const destClues = this.gameState.validDestinationClues[cityIndex];
        if (destClues && destClues.length > 0) {
          const destCluesGivenThisCity = this.gameState.cluesCollected.filter(
            c => c.type === 'destination' && c.cityFound === cityKey
          ).length;
          const priorityOrder = ['region', 'industry', 'subIndustry', 'cityHint', 'era', 'unique'];
          const clueType = priorityOrder[destCluesGivenThisCity % priorityOrder.length];
          const clue = destClues.find((c: LegacyDestinationClue) => c.type === clueType) || destClues[0];

          clues.push({
            type: 'destination',
            text: clue.text,
            cityFound: cityKey
          });
        }
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

  // Generate ALL clues for a search (for asymmetric distribution)
  // Does NOT add to cluesCollected - caller handles that
  private generateAllCluesForSearch(cityIndex: number, locationId: string): CollectedClue[] {
    const currentCompany = this.gameState.companies[cityIndex];
    const cityKey = `${currentCompany.city}, ${currentCompany.state}`;

    // Get the location to determine clue strength
    const locations = LOCATIONS_BY_INDUSTRY[currentCompany.industry];
    const location = locations?.find(l => l.id === locationId);
    const clueStrength = location?.clueStrength || 'weak';

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
          cityFound: cityKey,
          criminalClueId: clueId,
          archetypes: clue.archetypes
        });
      }
    }

    // Give a destination clue (if not final city)
    // Use the new strength-based clue system
    if (cityIndex < this.gameState.companies.length - 1) {
      const nextCompany = this.gameState.companies[cityIndex + 1];
      const clueSet = CLUES_BY_COMPANY_ID[nextCompany.id];

      if (clueSet) {
        // Get clue based on location strength
        const destClue = getDestinationClueByStrength(nextCompany.id, clueStrength);

        if (destClue) {
          clues.push({
            type: 'destination',
            text: destClue.text,
            cityFound: cityKey,
            destinationClue: destClue
          });
        }
      } else {
        // Fallback to legacy system
        const destClues = this.gameState.validDestinationClues[cityIndex];
        if (destClues && destClues.length > 0) {
          const destCluesGivenThisCity = this.gameState.cluesCollected.filter(
            c => c.type === 'destination' && c.cityFound === cityKey
          ).length;
          const priorityOrder = ['region', 'industry', 'subIndustry', 'cityHint', 'era', 'unique'];
          const clueType = priorityOrder[destCluesGivenThisCity % priorityOrder.length];
          const clue = destClues.find((c: LegacyDestinationClue) => c.type === clueType) || destClues[0];

          clues.push({
            type: 'destination',
            text: clue.text,
            cityFound: cityKey
          });
        }
      }
    }

    return clues;
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

  travel(destination: string): { success: boolean; message: string; timeSpent: number; wrongCity?: boolean } {
    const nextCompany = this.getNextDestination();

    if (!nextCompany) {
      return { success: false, message: 'Already at final destination', timeSpent: 0 };
    }

    // Random flight time between 4-5 hours
    const flightTime = 4 + Math.floor(Math.random() * 2);
    this.gameState.hoursRemaining -= flightTime;

    // Check if correct destination
    // Support multiple formats:
    // - "Company" (just the name)
    // - "City, ST" (city and state)
    // - "Company (City, ST)" (new format with both)
    const correctCity = `${nextCompany.city}, ${nextCompany.state}`;
    const correctWithCity = `${nextCompany.name} (${nextCompany.city}, ${nextCompany.state})`;

    // Extract company name from "Company (City, ST)" format if present
    const companyNameMatch = destination.match(/^(.+?)\s*\(/);
    const destinationCompanyName = companyNameMatch ? companyNameMatch[1].trim() : destination;

    const isCorrect =
      destination === correctCity ||
      destination === nextCompany.name ||
      destination === correctWithCity ||
      destinationCompanyName === nextCompany.name;

    if (isCorrect) {
      // Clear any wrong city state
      this.gameState.wrongCityName = undefined;
      this.gameState.previousCityIndex = undefined;

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
      // Wrong destination - set wrong city state
      this.gameState.wrongCityName = destination;
      this.gameState.previousCityIndex = this.gameState.currentCityIndex;
      this.gameState.gamePhase = 'wrongCity';

      return {
        success: false,
        message: `You traveled to ${destination}, but the trail has gone cold. The criminal isn't here.`,
        timeSpent: flightTime,
        wrongCity: true
      };
    }
  }

  // Return from wrong city back to the previous correct city
  flyBack(): { success: boolean; message: string; timeSpent: number } {
    if (this.gameState.gamePhase !== 'wrongCity' || this.gameState.previousCityIndex === undefined) {
      return { success: false, message: 'Not in a wrong city', timeSpent: 0 };
    }

    // Random flight time between 4-5 hours (penalty for wrong guess!)
    const flightTime = 4 + Math.floor(Math.random() * 2);
    this.gameState.hoursRemaining -= flightTime;

    const currentCompany = this.gameState.companies[this.gameState.previousCityIndex];

    // Clear wrong city state and return to searching
    this.gameState.wrongCityName = undefined;
    this.gameState.previousCityIndex = undefined;
    this.gameState.gamePhase = 'searching';

    // Check if time ran out
    if (this.gameState.hoursRemaining <= 0) {
      this.gameState.gamePhase = 'defeat';
    }

    return {
      success: true,
      message: `Returned to ${currentCompany.name} in ${currentCompany.city}`,
      timeSpent: flightTime
    };
  }

  // Get a dead-end message for when searching in a wrong city
  getDeadEndMessage(): string {
    const messages = [
      "Nope, haven't seen anyone suspicious around here.",
      "A corporate thief? In THIS economy? Haven't heard anything.",
      "You just missed... actually, no. Nobody's been here.",
      "The only crime here is the coffee in the break room.",
      "Security says the only unusual activity was someone microwaving fish.",
      "Trail's cold. Colder than the AC in this building.",
      "Nothing to see here. The criminal definitely isn't at this company.",
      "Dead end. Time to head back and try again."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
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

    const correctOption = nextCompany.name;
    const pathCompanyNames = this.gameState.companies.map(c => c.name);
    const decoys = this.selectDecoyCompanies(correctOption, pathCompanyNames, 3);
    return [correctOption, ...decoys].sort(() => Math.random() - 0.5);
  }

  /**
   * Get destination options filtered by collected clues
   * Returns options with their elimination status
   */
  getFilteredDestinationOptions(): {
    options: Array<{
      name: string;
      city: string;
      state: string;
      eliminated: boolean;
      eliminatedBy?: string[];
    }>;
    recommendation: string | null;
  } {
    const allOptions = this.getDestinationOptions();
    const currentIndex = this.gameState.currentCityIndex;
    const currentCompany = this.gameState.companies[currentIndex];
    const currentCityKey = `${currentCompany.city}, ${currentCompany.state}`;

    // Get destination clues collected at current city that have full clue data
    const destCluesThisCity = this.gameState.cluesCollected.filter(
      c => c.type === 'destination' &&
           c.cityFound === currentCityKey &&
           c.destinationClue
    );

    const optionStatuses = allOptions.map(optionName => {
      const brand = PUBLIC_BRANDS.find(b => b.name === optionName);
      if (!brand) {
        return { name: optionName, city: '', state: '', eliminated: false };
      }

      let eliminated = false;
      const eliminatedBy: string[] = [];

      // Check each clue against this option
      for (const collectedClue of destCluesThisCity) {
        const clue = collectedClue.destinationClue;
        if (!clue) continue;

        let matchesClue = false;
        let excludedByClue = false;

        // Check if option is excluded by the clue
        if (clue.excludesRegion?.includes(brand.region)) {
          excludedByClue = true;
        }
        if (clue.excludesState?.includes(brand.state)) {
          excludedByClue = true;
        }
        if (clue.excludesIndustry?.includes(brand.industry)) {
          excludedByClue = true;
        }

        // Check if option matches the clue criteria
        if (clue.matchesRegion?.includes(brand.region)) {
          matchesClue = true;
        }
        if (clue.matchesState?.includes(brand.state)) {
          matchesClue = true;
        }
        if (clue.matchesCity?.includes(brand.city)) {
          matchesClue = true;
        }
        if (clue.matchesIndustry?.includes(brand.industry)) {
          matchesClue = true;
        }
        if (clue.matchesSubIndustry?.includes(brand.subIndustry)) {
          matchesClue = true;
        }
        if (clue.matchesCompanyId?.includes(brand.id)) {
          matchesClue = true;
        }

        // If clue has match criteria and this option doesn't match any,
        // and the option is also excluded, eliminate it
        if (excludedByClue) {
          eliminated = true;
          eliminatedBy.push(collectedClue.text);
        }

        // If clue has explicit match criteria (not just exclusions),
        // options that don't match any criteria are candidates for elimination
        // BUT only if there are no exclusion criteria or option matches exclusion
        const hasMatchCriteria =
          clue.matchesRegion ||
          clue.matchesState ||
          clue.matchesCity ||
          clue.matchesIndustry ||
          clue.matchesSubIndustry ||
          clue.matchesCompanyId;

        if (hasMatchCriteria && !matchesClue && !excludedByClue) {
          // This option doesn't match, mark as eliminated
          eliminated = true;
          eliminatedBy.push(collectedClue.text);
        }
      }

      return {
        name: optionName,
        city: brand.city,
        state: brand.state,
        eliminated,
        eliminatedBy: eliminatedBy.length > 0 ? eliminatedBy : undefined
      };
    });

    // If only one option remains, recommend it
    const remaining = optionStatuses.filter(o => !o.eliminated);
    const recommendation = remaining.length === 1 ? remaining[0].name : null;

    return { options: optionStatuses, recommendation };
  }

  /**
   * Get remaining suspects based on criminal clues collected
   * Auto-eliminates based on archetype matching
   */
  getRemainingSuspects(): {
    suspects: Criminal[];
    identified: Criminal | null;
    gender: 'M' | 'F';
  } {
    const criminalClues = this.gameState.cluesCollected.filter(c => c.type === 'criminal');
    const criminalGender = this.gameState.criminal.gender;

    // Start with all criminals of the correct gender
    let remaining = CRIMINALS.filter(c => c.gender === criminalGender);

    // For each criminal clue, narrow down based on archetypes
    for (const collectedClue of criminalClues) {
      if (collectedClue.archetypes && collectedClue.archetypes.length > 0) {
        remaining = remaining.filter(c =>
          collectedClue.archetypes!.includes(c.archetype)
        );
      } else if (collectedClue.criminalClueId !== undefined) {
        // Look up the clue to get archetypes
        const clue = getClueById(collectedClue.criminalClueId);
        if (clue) {
          remaining = remaining.filter(c => clue.archetypes.includes(c.archetype));
        }
      }
    }

    const identified = remaining.length === 1 ? remaining[0] : null;

    // If we've narrowed to 1 suspect, mark criminal as identified
    if (identified && identified.id === this.gameState.criminal.id) {
      this.gameState.criminalIdentified = true;
      this.gameState.criminalName = identified.name;
    }

    return {
      suspects: remaining,
      identified,
      gender: criminalGender
    };
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

  getPublicGameState(): PublicGameState {
    const state = this.getState();
    const currentCompany = this.getCurrentCompany();
    const currentCityKey = `${currentCompany.city}, ${currentCompany.state}`;

    // Filter clues: suspect clues persist, destination clues only for current city
    const currentCityClues = state.cluesCollected.filter(clue =>
      clue.type === 'criminal' || clue.cityFound === currentCityKey
    );

    // Get destination options with city info for display
    const destinationOptions = this.getDestinationOptions();
    const destinationOptionsWithCities = destinationOptions.map(name => {
      const brand = PUBLIC_BRANDS.find(b => b.name === name);
      return {
        name,
        city: brand?.city || '',
        state: brand?.state || ''
      };
    });

    // Get filtered destination options based on clues (new system)
    const filteredDestinations = this.getFilteredDestinationOptions();

    // Get remaining suspects based on criminal clues (new system)
    const suspectInfo = this.getRemainingSuspects();

    // Return a sanitized version without revealing the criminal identity
    return {
      currentCityIndex: state.currentCityIndex,
      hoursRemaining: state.hoursRemaining,
      cluesCollected: state.cluesCollected, // Full history for reference
      currentCityClues, // Filtered clues for display
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
      destinationOptions,
      destinationOptionsWithCities,
      // NEW: Filtered destination options with elimination status
      filteredDestinations: filteredDestinations.options,
      destinationRecommendation: filteredDestinations.recommendation,
      // NEW: Remaining suspects based on clues
      remainingSuspects: suspectInfo.suspects.map(s => ({
        id: s.id,
        name: s.name,
        archetype: s.archetype,
        description: s.description
      })),
      identifiedSuspect: suspectInfo.identified ? {
        id: suspectInfo.identified.id,
        name: suspectInfo.identified.name,
        archetype: suspectInfo.identified.archetype,
        description: suspectInfo.identified.description
      } : null,
      suspectGender: suspectInfo.gender,
      // Wrong city state
      wrongCityName: state.wrongCityName,
      deadEndMessage: state.gamePhase === 'wrongCity' ? this.getDeadEndMessage() : undefined,
      // Victory/defeat messages
      victoryMessage: state.gamePhase === 'victory' ? this.getVictoryMessage() : undefined,
      defeatMessage: state.gamePhase === 'defeat' ? this.getDefeatMessage() : undefined,
      // Roberta quote for intro
      robertaQuote: state.gamePhase === 'intro' ? this.getRobertaQuote() : undefined,
      // Criminal archetype description (only if identified)
      criminalDescription: state.criminalIdentified ? state.criminal.description : undefined
    };
  }
}

// Type for the public game state
export interface PublicGameState {
  currentCityIndex: number;
  hoursRemaining: number;
  cluesCollected: CollectedClue[];
  currentCityClues: CollectedClue[];
  criminalIdentified: boolean;
  criminalName: string | null;
  fidelityMode: boolean;
  customVillain?: GameState['customVillain'];
  gamePhase: GameState['gamePhase'];
  currentCompany: {
    name: string;
    city: string;
    state: string;
    industry: string;
    stolenAsset: string;
  };
  availableLocations: SearchLocation[];
  searchedLocations: string[];
  totalCities: number;
  destinationOptions: string[];
  destinationOptionsWithCities: { name: string; city: string; state: string }[];
  filteredDestinations: Array<{
    name: string;
    city: string;
    state: string;
    eliminated: boolean;
    eliminatedBy?: string[];
  }>;
  destinationRecommendation: string | null;
  remainingSuspects: Array<{
    id: string;
    name: string;
    archetype: Archetype;
    description: string;
  }>;
  identifiedSuspect: {
    id: string;
    name: string;
    archetype: Archetype;
    description: string;
  } | null;
  suspectGender: 'M' | 'F';
  wrongCityName?: string;
  deadEndMessage?: string;
  victoryMessage?: string;
  defeatMessage?: string;
  robertaQuote?: string;
  criminalDescription?: string;
}
