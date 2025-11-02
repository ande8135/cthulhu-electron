export interface Setting {
  id: string;
  name: string;
  era: string;
  description: string;
  headerFont: string;
  titleText: string;
  themeOverrides?: {
    primary?: string;
    secondary?: string;
    background?: string;
  };
}

export const settings: Setting[] = [
  {
    id: '1920s',
    name: '1920s',
    era: '1920s',
    description: 'The classic era of Call of Cthulhu, set in the roaring twenties.',
    headerFont: 'UnifrakturMaguntia',
    titleText: 'Call of Cthulhu',
  },
  {
    id: 'dark-ages',
    name: 'Dark Ages',
    era: 'Dark Ages',
    description: 'Medieval horror in the time of superstition and fear.',
    headerFont: 'MedievalSharp',
    titleText: 'Call of Cthulhu',
    themeOverrides: {
      secondary: '#8B4513',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    era: 'Modern Day',
    description: 'Contemporary horror in the digital age.',
    headerFont: 'Orbitron',
    titleText: 'Call of Cthulhu',
    themeOverrides: {
      primary: '#1a1a1a',
      secondary: '#404040',
    },
  },
  {
    id: 'regency',
    name: 'Regency',
    era: 'Regency Period',
    description: 'Gothic horror in Jane Austen\'s England.',
    headerFont: 'Petit Formal Script',
    titleText: 'Call of Cthulhu',
    themeOverrides: {
      secondary: '#762f2f',
    },
  },
  {
    id: 'gaslight',
    name: 'Gaslight',
    era: 'Victorian Era',
    description: 'Victorian horror in the age of innovation and imperialism.',
    headerFont: 'Playfair Display SC',
    titleText: 'Call of Cthulhu',
    themeOverrides: {
      secondary: '#2f4f4f',
    },
  },
];