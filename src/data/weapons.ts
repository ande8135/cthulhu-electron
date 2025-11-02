export interface Weapon {
  name: string;
  skill: string;
  damage: string;
  range: string;
  attacks: string;
  ammo: string;
  malfunction: string;
  era: string[];
}

export const weapons: Weapon[] = [
  // Basic Combat (all eras with appropriate names)
  {
    name: "Unarmed Strike",
    skill: "Fighting (Brawl)",
    damage: "1d3 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["dark-ages"]
  },
  {
    name: "Punch/Strike",
    skill: "Fighting (Brawl)",
    damage: "1d3 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["1920s", "modern"]
  },
  {
    name: "Gentleman's Fisticuffs",
    skill: "Fighting (Brawl)",
    damage: "1d3 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["regency", "gaslight"]
  },

  // Dark Ages Weapons
  {
    name: "Dirk",
    skill: "Fighting (Blade)",
    damage: "1d4 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["dark-ages"]
  },
  {
    name: "Hand Axe",
    skill: "Fighting (Axe)",
    damage: "1d6 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["dark-ages"]
  },
  {
    name: "Longsword",
    skill: "Fighting (Sword)",
    damage: "1d8 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["dark-ages"]
  },
  {
    name: "Battle Axe",
    skill: "Fighting (Axe)",
    damage: "1d8 + 2 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["dark-ages"]
  },
  {
    name: "War Bow",
    skill: "Bow",
    damage: "1d8 + 1",
    range: "50 yards",
    attacks: "1",
    ammo: "1",
    malfunction: "-",
    era: ["dark-ages"]
  },

  // Regency Era Weapons
  {
    name: "Dress Dagger",
    skill: "Fighting (Blade)",
    damage: "1d4 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["regency"]
  },
  {
    name: "Smallsword",
    skill: "Fighting (Sword)",
    damage: "1d6 + 1",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["regency"]
  },
  {
    name: "Dueling Pistol",
    skill: "Firearms (Flintlock)",
    damage: "1d8+1",
    range: "15 yards",
    attacks: "1/2",
    ammo: "1",
    malfunction: "95",
    era: ["regency"]
  },

  // Gaslight Era Weapons
  {
    name: "Walking Stick",
    skill: "Fighting (Brawl)",
    damage: "1d6 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["gaslight"]
  },
  {
    name: "Gentleman's Cane Sword",
    skill: "Fighting (Sword)",
    damage: "1d6 + 1",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["gaslight"]
  },
  {
    name: "Webley Bulldog Revolver",
    skill: "Firearms (Handgun)",
    damage: "1d8",
    range: "15 yards",
    attacks: "1",
    ammo: "5",
    malfunction: "95",
    era: ["gaslight"]
  },

  // 1920s Weapons
  {
    name: "Brass Knuckles",
    skill: "Fighting (Brawl)",
    damage: "1d4 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["1920s"]
  },
  {
    name: "Switchblade",
    skill: "Fighting (Blade)",
    damage: "1d4 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["1920s"]
  },
  {
    name: "Colt Police Positive",
    skill: "Firearms (Handgun)",
    damage: "1d8",
    range: "15 yards",
    attacks: "1",
    ammo: "6",
    malfunction: "100",
    era: ["1920s"]
  },
  {
    name: "Winchester Model 12",
    skill: "Firearms (Shotgun)",
    damage: "2d6/1d6",
    range: "10/20 yards",
    attacks: "1(2)",
    ammo: "6",
    malfunction: "98",
    era: ["1920s"]
  },

  // Modern Weapons
  {
    name: "Tactical Knife",
    skill: "Fighting (Blade)",
    damage: "1d4 + 2 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["modern"]
  },
  {
    name: "Telescopic Baton",
    skill: "Fighting (Brawl)",
    damage: "1d6 + DB",
    range: "Touch",
    attacks: "1",
    ammo: "-",
    malfunction: "-",
    era: ["modern"]
  },
  {
    name: "9mm Pistol",
    skill: "Firearms (Handgun)",
    damage: "1d10",
    range: "15 yards",
    attacks: "1",
    ammo: "15",
    malfunction: "98",
    era: ["modern"]
  },
];

export const weaponSkills = [
  "Fighting (Brawl)",
  "Fighting (Blade)",
  "Fighting (Sword)",
  "Fighting (Axe)",
  "Firearms (Handgun)",
  "Firearms (Rifle)",
  "Firearms (SMG)",
  "Firearms (Shotgun)",
  "Firearms (Flintlock)",
  "Throw"
];