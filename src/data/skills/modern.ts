import { Skill } from './index';

export const skillsModern: Skill[] = [
  // Core Investigation Skills
  { name: 'Computer Use', base: 20, category: 'Investigation', eraSpecific: true },
  { name: 'Digital Research', base: 25, category: 'Investigation', eraSpecific: true },
  { name: 'Forensics', base: 10, category: 'Investigation', eraSpecific: true },
  { name: 'Research', base: 25, category: 'Investigation' },
  { name: 'Library Use', base: 25, category: 'Investigation' },
  { name: 'Spot Hidden', base: 25, category: 'Investigation' },
  { name: 'Track', base: 10, category: 'Investigation' },

  // Social Skills
  { name: 'Charm', base: 15, category: 'Social' },
  { name: 'Fast Talk', base: 5, category: 'Social' },
  { name: 'Intimidate', base: 15, category: 'Social' },
  { name: 'Persuade', base: 10, category: 'Social' },
  { name: 'Psychology', base: 10, category: 'Social' },
  { name: 'Social Media', base: 25, category: 'Social', eraSpecific: true },

  // Academic Skills
  { name: 'Accounting', base: 5, category: 'Academic' },
  { name: 'Anthropology', base: 1, category: 'Academic' },
  { name: 'Archaeology', base: 1, category: 'Academic' },
  { name: 'History', base: 20, category: 'Academic' },
  { name: 'Law', base: 5, category: 'Academic' },
  { name: 'Occult', base: 5, category: 'Academic' },
  { name: 'Cthulhu Mythos', base: 0, category: 'Academic' },
  { name: 'Science', base: 1, category: 'Academic' },

  // Technical Skills
  { name: 'Electronics', base: 10, category: 'Technical', eraSpecific: true },
  { name: 'Hacking', base: 1, category: 'Technical', eraSpecific: true },
  { name: 'Mechanical Repair', base: 10, category: 'Technical' },
  { name: 'Photography', base: 10, category: 'Technical' },
  { name: 'Operate Heavy Machinery', base: 1, category: 'Technical' },

  // Physical Skills
  { name: 'Climb', base: 20, category: 'Physical' },
  { name: 'Drive Auto', base: 20, category: 'Physical' },
  { name: 'First Aid', base: 30, category: 'Physical' },
  { name: 'Jump', base: 20, category: 'Physical' },
  { name: 'Stealth', base: 20, category: 'Physical' },
  { name: 'Swim', base: 20, category: 'Physical' },

  // Combat Skills
  { name: 'Fighting', base: 25, category: 'Combat' },
  { name: 'Firearms', base: 20, category: 'Combat' },
  { name: 'Throw', base: 20, category: 'Combat' },

  // Survival Skills
  { name: 'Navigate', base: 10, category: 'Survival' },
  { name: 'Survival', base: 10, category: 'Survival' },
  
  // Languages
  { name: 'Own Language', base: 40, category: 'Languages' },
  { name: 'Other Language', base: 1, category: 'Languages' },
];