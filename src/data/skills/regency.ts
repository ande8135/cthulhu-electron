import { Skill } from './index';

export const skillsRegency: Skill[] = [
  // Core Investigation Skills
  { name: 'Appraise', base: 5, category: 'Investigation' },
  { name: 'Research', base: 25, category: 'Investigation' },
  { name: 'Library Use', base: 25, category: 'Investigation' },
  { name: 'Spot Hidden', base: 25, category: 'Investigation' },
  { name: 'Track', base: 10, category: 'Investigation' },

  // Social Skills
  { name: 'Art/Craft', base: 5, category: 'Social', specialization: 'Drawing' },
  { name: 'Art/Craft', base: 5, category: 'Social', specialization: 'Music' },
  { name: 'Art/Craft', base: 5, category: 'Social', specialization: 'Poetry' },
  { name: 'Charm', base: 15, category: 'Social' },
  { name: 'Etiquette', base: 25, category: 'Social', eraSpecific: true },
  { name: 'Fast Talk', base: 5, category: 'Social' },
  { name: 'Persuade', base: 10, category: 'Social' },
  { name: 'Psychology', base: 10, category: 'Social' },

  // Academic Skills
  { name: 'Accounting', base: 5, category: 'Academic' },
  { name: 'History', base: 20, category: 'Academic' },
  { name: 'Law', base: 5, category: 'Academic' },
  { name: 'Medicine', base: 1, category: 'Academic' },
  { name: 'Natural Philosophy', base: 1, category: 'Academic', eraSpecific: true },
  { name: 'Occult', base: 5, category: 'Academic' },
  { name: 'Cthulhu Mythos', base: 0, category: 'Academic' },

  // Physical Skills
  { name: 'Climb', base: 20, category: 'Physical' },
  { name: 'Dance', base: 20, category: 'Physical', eraSpecific: true },
  { name: 'First Aid', base: 30, category: 'Physical' },
  { name: 'Jump', base: 20, category: 'Physical' },
  { name: 'Ride', base: 15, category: 'Physical', eraSpecific: true },
  { name: 'Stealth', base: 20, category: 'Physical' },
  { name: 'Swim', base: 20, category: 'Physical' },

  // Combat Skills
  { name: 'Fighting', base: 25, category: 'Combat', specialization: 'Brawl' },
  { name: 'Fighting', base: 25, category: 'Combat', specialization: 'Sword' },
  { name: 'Firearms', base: 20, category: 'Combat', specialization: 'Flintlock' },
  { name: 'Throw', base: 20, category: 'Combat' },

  // Languages
  { name: 'Own Language', base: 0, category: 'Languages' }, // EDU-based in UI
  { name: 'French', base: 1, category: 'Languages', eraSpecific: true },
  { name: 'Latin', base: 1, category: 'Languages', eraSpecific: true },
  { name: 'Greek', base: 1, category: 'Languages', eraSpecific: true },
];