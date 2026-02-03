// High-Low card mini-game utilities

import { Card, CardSuit } from './types';

const SUITS: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const SUIT_SYMBOLS: Record<CardSuit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const RANK_DISPLAYS: Record<number, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
  11: 'J', 12: 'Q', 13: 'K', 14: 'A'
};

// Create a standard 52-card deck
export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({
        rank,
        suit,
        display: `${RANK_DISPLAYS[rank]}${SUIT_SYMBOLS[suit]}`
      });
    }
  }

  return deck;
}

// Fisher-Yates shuffle
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Compare two cards
export function compareCards(current: Card, next: Card): 'higher' | 'lower' | 'same' {
  if (next.rank > current.rank) return 'higher';
  if (next.rank < current.rank) return 'lower';
  return 'same';
}

// Check if guess was correct
export function checkGuess(current: Card, next: Card, guess: 'higher' | 'lower'): 'correct' | 'wrong' | 'push' {
  const comparison = compareCards(current, next);

  // Same rank = push (draw again, doesn't count)
  if (comparison === 'same') return 'push';

  // Check if guess matches actual result
  if (guess === comparison) return 'correct';
  return 'wrong';
}

// Get the majority vote from player choices
export function getMajorityVote(votes: { choice: 'higher' | 'lower' }[]): 'higher' | 'lower' {
  const higher = votes.filter(v => v.choice === 'higher').length;
  const lower = votes.filter(v => v.choice === 'lower').length;

  // Tie = random
  if (higher === lower) {
    return Math.random() < 0.5 ? 'higher' : 'lower';
  }

  return higher > lower ? 'higher' : 'lower';
}

// Get the majority for continue/cash out voting
export function getContinueVoteMajority(votes: { choice: 'continue' | 'cash_out' }[]): 'continue' | 'cash_out' {
  const continueCount = votes.filter(v => v.choice === 'continue').length;
  const cashOutCount = votes.filter(v => v.choice === 'cash_out').length;

  // Tie = cash out (safer choice)
  if (continueCount === cashOutCount) {
    return 'cash_out';
  }

  return continueCount > cashOutCount ? 'continue' : 'cash_out';
}

// Calculate time bonus based on streak
export function calculateHighLowTimeBonus(streak: number): number {
  // 5 minutes per streak point, capped at 30
  return Math.min(streak * 5, 30);
}

// Get a human-readable card name
export function getCardName(card: Card): string {
  const rankName = card.rank === 14 ? 'Ace' :
                   card.rank === 13 ? 'King' :
                   card.rank === 12 ? 'Queen' :
                   card.rank === 11 ? 'Jack' :
                   card.rank.toString();

  const suitName = card.suit.charAt(0).toUpperCase() + card.suit.slice(1);

  return `${rankName} of ${suitName}`;
}

// Create a client-safe version of the card (same data, just for clarity)
export function toClientCard(card: Card): Card {
  return {
    rank: card.rank,
    suit: card.suit,
    display: card.display
  };
}
