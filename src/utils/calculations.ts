interface Characteristics {
  str: { current: string };
  siz: { current: string };
  dex: { current: string };
  edu: { current: string };
}

type Era = '1920s' | 'dark-ages' | 'modern' | 'regency' | 'gaslight';

export const calculateDamageBonus = (str: number, siz: number): string => {
  const total = str + siz;
  if (total >= 2 && total <= 64) return '-2';
  if (total >= 65 && total <= 84) return '-1';
  if (total >= 85 && total <= 124) return '0';
  if (total >= 125 && total <= 164) return '+1d4';
  if (total >= 165) return '+1d6';
  return '0';
};

export const calculateBuild = (str: number, siz: number): string => {
  const total = str + siz;
  if (total >= 2 && total <= 64) return '-2';
  if (total >= 65 && total <= 84) return '-1';
  if (total >= 85 && total <= 124) return '0';
  if (total >= 125 && total <= 164) return '1';
  if (total >= 165) return '2';
  return '0';
};

export const calculateMaxHp = (con: number, siz: number): number => {
  return Math.floor((con + siz) / 10);
};

export const calculateMaxSanity = (pow: number): number => {
  return Math.min(99, pow * 5);
};

export const calculateMovementRate = (
  str: number, 
  dex: number, 
  siz: number, 
  era: Era,
  age: number
): number => {
  // Base movement rate calculation
  let movementRate = 8;
  
  if (str < siz && dex < siz) movementRate = 7;
  if (str > siz && dex > siz) movementRate = 9;

  // Era-specific modifiers
  switch (era) {
    case 'dark-ages':
      // People were generally more physically active
      movementRate += 1;
      break;
    case 'modern':
      // Modern lifestyle may reduce base movement
      if (age > 40) movementRate -= 1;
      break;
    case 'regency':
    case 'gaslight':
      // No specific modifiers
      break;
  }

  // Age modifiers
  if (age >= 40 && age < 50) movementRate -= 1;
  if (age >= 50 && age < 60) movementRate -= 2;
  if (age >= 60 && age < 70) movementRate -= 3;
  if (age >= 70) movementRate -= 4;

  // Ensure movement rate doesn't go below 2
  return Math.max(2, movementRate);
};

export const calculateSkillPointsAvailable = (
  era: Era,
  edu: number
): { occupation: number; personal: number } => {
  let occupationPoints = edu * 4;
  let personalPoints = edu * 2;

  switch (era) {
    case 'dark-ages':
      // Less formal education in dark ages, more personal experience
      occupationPoints = edu * 2;
      personalPoints = edu * 3;
      break;
    case 'modern':
      // More education opportunities in modern era
      occupationPoints = edu * 4;
      personalPoints = edu * 2;
      break;
    case 'regency':
      // Education was more class-based
      occupationPoints = edu * 3;
      personalPoints = edu * 2;
      break;
    case 'gaslight':
      // Standard Victorian era points
      occupationPoints = edu * 4;
      personalPoints = edu * 2;
      break;
  }

  return { occupation: occupationPoints, personal: personalPoints };
};

export const calculateEraSpecificModifiers = (
  characteristics: Characteristics,
  era: Era
): Record<string, number> => {
  const mods: Record<string, number> = {};
  const str = parseInt(characteristics.str.current) || 0;
  const siz = parseInt(characteristics.siz.current) || 0;
  const dex = parseInt(characteristics.dex.current) || 0;
  const edu = parseInt(characteristics.edu.current) || 0;

  switch (era) {
    case 'dark-ages':
      // Physical skills were more important
      mods.fighting = 10;
      mods.climb = 10;
      mods.jump = 10;
      break;
      
    case 'modern':
      // Technical and computer skills get bonuses
      mods.computerUse = 20;
      mods.electronics = 10;
      mods.research = 10;
      break;
      
    case 'regency':
      // Social skills were paramount
      mods.etiquette = 15;
      mods.charm = 10;
      mods.art = 10;
      break;
      
    case 'gaslight':
      // Mix of physical and intellectual skills
      mods.fighting = 5;
      mods.research = 5;
      mods.craft = 10;
      break;
  }

  return mods;
};