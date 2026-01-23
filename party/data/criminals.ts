import { Criminal, Archetype } from './types';

// Archetype descriptions for flavor text
export const ARCHETYPE_DESCRIPTIONS: Record<Archetype, string> = {
  Vest: "Ex-consulting/finance background. Wears a fleece vest, says 'circle back' and 'net-net'. Half-day Fridays for 'a thing in the Hamptons'. Strong Sweetgreen opinions.",
  Disruptor: "Grey $80 t-shirt, everything is 'the Uber of...'. Oura ring, AirPods in constantly. Standing desk evangelist. Founded something once.",
  ThoughtLeader: "Every meeting becomes a LinkedIn post. 'The future of...' catchphrase. Gave a TED talk (or was it TEDx?). Calls themselves a 'connector'.",
  Consultant: "Bills by the hour, delivers by the slide. Always 'between engagements'. Says 'let's pressure-test that'. Knows everyone's org chart.",
  Biohacker: "Up at 4am (tells everyone). Oura ring AND Whoop band. Cold plunge enthusiast. Strong opinions about seed oils.",
  Lifer: "30 years at the same company. 'We tried that in '98'. Still prints emails. Knows where the good office supplies are hidden.",
  Evangelist: "Pivoted to crypto. Says 'decentralized' and 'trustless'. 'Few understand this'. Asks if the cafeteria takes Bitcoin."
};

// The 14 criminals (7 archetypes x 2 genders)
export const CRIMINALS: Criminal[] = [
  // The Vest
  {
    id: 'vest-m',
    name: 'Chad Worthington',
    archetype: 'Vest',
    gender: 'M',
    description: ARCHETYPE_DESCRIPTIONS.Vest
  },
  {
    id: 'vest-f',
    name: 'Priya Mehta',
    archetype: 'Vest',
    gender: 'F',
    description: ARCHETYPE_DESCRIPTIONS.Vest
  },
  // The Disruptor
  {
    id: 'disruptor-m',
    name: 'Marcus Chen',
    archetype: 'Disruptor',
    gender: 'M',
    description: ARCHETYPE_DESCRIPTIONS.Disruptor
  },
  {
    id: 'disruptor-f',
    name: 'Aisha Okonkwo',
    archetype: 'Disruptor',
    gender: 'F',
    description: ARCHETYPE_DESCRIPTIONS.Disruptor
  },
  // The Thought Leader
  {
    id: 'thoughtleader-m',
    name: 'David Brennan',
    archetype: 'ThoughtLeader',
    gender: 'M',
    description: ARCHETYPE_DESCRIPTIONS.ThoughtLeader
  },
  {
    id: 'thoughtleader-f',
    name: 'Keisha Reynolds',
    archetype: 'ThoughtLeader',
    gender: 'F',
    description: ARCHETYPE_DESCRIPTIONS.ThoughtLeader
  },
  // The Consultant
  {
    id: 'consultant-m',
    name: 'James Fitzgerald',
    archetype: 'Consultant',
    gender: 'M',
    description: ARCHETYPE_DESCRIPTIONS.Consultant
  },
  {
    id: 'consultant-f',
    name: 'Sofia Navarro',
    archetype: 'Consultant',
    gender: 'F',
    description: ARCHETYPE_DESCRIPTIONS.Consultant
  },
  // The Biohacker
  {
    id: 'biohacker-m',
    name: 'Derek Washington',
    archetype: 'Biohacker',
    gender: 'M',
    description: ARCHETYPE_DESCRIPTIONS.Biohacker
  },
  {
    id: 'biohacker-f',
    name: 'Jasmine Torres',
    archetype: 'Biohacker',
    gender: 'F',
    description: ARCHETYPE_DESCRIPTIONS.Biohacker
  },
  // The Lifer
  {
    id: 'lifer-m',
    name: 'Bill Patterson',
    archetype: 'Lifer',
    gender: 'M',
    description: ARCHETYPE_DESCRIPTIONS.Lifer
  },
  {
    id: 'lifer-f',
    name: 'Linda Chen',
    archetype: 'Lifer',
    gender: 'F',
    description: ARCHETYPE_DESCRIPTIONS.Lifer
  },
  // The Evangelist
  {
    id: 'evangelist-m',
    name: 'Tyler Russo',
    archetype: 'Evangelist',
    gender: 'M',
    description: ARCHETYPE_DESCRIPTIONS.Evangelist
  },
  {
    id: 'evangelist-f',
    name: 'Destiny Okafor',
    archetype: 'Evangelist',
    gender: 'F',
    description: ARCHETYPE_DESCRIPTIONS.Evangelist
  }
];

export function getCriminalById(id: string): Criminal | undefined {
  return CRIMINALS.find(c => c.id === id);
}

export function getCriminalsByArchetype(archetype: Archetype): Criminal[] {
  return CRIMINALS.filter(c => c.archetype === archetype);
}

export function getRandomCriminal(): Criminal {
  return CRIMINALS[Math.floor(Math.random() * CRIMINALS.length)];
}
