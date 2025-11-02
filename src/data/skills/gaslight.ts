import { Skill } from './index';

export const skillsGaslight: Skill[] = [
  // Core Investigation Skills
  { name: 'Appraise', base: 5, category: 'Investigation' },
  { name: 'Research', base: 25, category: 'Investigation' },
  { name: 'Library Use', base: 25, category: 'Investigation' },
  { name: 'Spot Hidden', base: 25, category: 'Investigation' },
  { name: 'Track', base: 10, category: 'Investigation' },
  { name: 'Photography', base: 10, category: 'Investigation', eraSpecific: true },

  // Social Skills
  { name: 'Art/Craft', base: 5, category: 'Social' },
  { name: 'Charm', base: 15, category: 'Social' },
  { name: 'Etiquette', base: 25, category: 'Social', eraSpecific: true },
  { name: 'Fast Talk', base: 5, category: 'Social' },
  { name: 'Intimidate', base: 15, category: 'Social' },
  { name: 'Persuade', base: 10, category: 'Social' },
  { name: 'Psychology', base: 10, category: 'Social' },

  // Academic Skills
  { name: 'Accounting', base: 5, category: 'Academic' },
  { name: 'Anthropology', base: 1, category: 'Academic' },
  { name: 'Archaeology', base: 1, category: 'Academic' },
  { name: 'History', base: 20, category: 'Academic' },
  { name: 'Law', base: 5, category: 'Academic' },
  { name: 'Medicine', base: 1, category: 'Academic' },
  { name: 'Natural Philosophy', base: 1, category: 'Academic', eraSpecific: true },
  { name: 'Occult', base: 5, category: 'Academic' },
  { name: 'Cthulhu Mythos', base: 0, category: 'Academic' },

  // Technical Skills
  { name: 'Electrical Repair', base: 10, category: 'Technical', eraSpecific: true },
  { name: 'Mechanical Repair', base: 10, category: 'Technical', eraSpecific: true },
  { name: 'Operate Heavy Machinery', base: 1, category: 'Technical' },

  // Physical Skills
  { name: 'Climb', base: 20, category: 'Physical' },
  { name: 'First Aid', base: 30, category: 'Physical' },
  { name: 'Jump', base: 20, category: 'Physical' },
  { name: 'Ride', base: 15, category: 'Physical', eraSpecific: true },
  { name: 'Stealth', base: 20, category: 'Physical' },
  { name: 'Swim', base: 20, category: 'Physical' },

  // Combat Skills
  { name: 'Fighting', base: 25, category: 'Combat', specialization: 'Brawl' },
  { name: 'Fighting', base: 25, category: 'Combat', specialization: 'Sword' },
  { name: 'Firearms', base: 20, category: 'Combat' },
  { name: 'Throw', base: 20, category: 'Combat' },

  // Languages
  { name: 'Own Language', base: 0, category: 'Languages' }, // EDU-based in UI
  { name: 'Other Language', base: 1, category: 'Languages' },
];