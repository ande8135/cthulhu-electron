import * as Yup from 'yup';
import { skillsByEra } from '../data/skills/index';

// Common validation patterns
const numberPattern = /^\d+$/;
const namePattern = /^[a-zA-Z\s'-]+$/;

// Base validation schema for characteristics
const characteristicSchema = Yup.object({
  current: Yup.string()
    .matches(numberPattern, 'Must be a number')
    .required('Required'),
  half: Yup.string()
    .matches(numberPattern, 'Must be a number')
    .required('Required'),
  fifth: Yup.string()
    .matches(numberPattern, 'Must be a number')
    .required('Required'),
});

// Era-specific validation requirements
const eraValidation: Record<string, {
  minAge: number;
  maxAge: number;
  requiresOccupation: boolean;
  requiresEmail?: boolean;
  requiresSocialClass?: boolean;
}> = {
  '1920s': {
    minAge: 15,
    maxAge: 90,
    requiresOccupation: true,
  },
  'dark-ages': {
    minAge: 15,
    maxAge: 60,
    requiresOccupation: false,
  },
  'modern': {
    minAge: 15,
    maxAge: 90,
    requiresOccupation: true,
    requiresEmail: true,
  },
  'regency': {
    minAge: 16,
    maxAge: 70,
    requiresOccupation: true,
    requiresSocialClass: true,
  },
  'gaslight': {
    minAge: 15,
    maxAge: 80,
    requiresOccupation: true,
  },
};

export const createValidationSchema = (era: string) => {
  const eraRules = eraValidation[era] || eraValidation['1920s'];
  const eraSkills = skillsByEra[era] || skillsByEra['1920s'];

  return Yup.object({
    // Basic Info
    name: Yup.string()
      .matches(namePattern, 'Must contain only letters, spaces, hyphens and apostrophes')
      .required('Required'),
    occupation: Yup.string()
      .required(eraRules.requiresOccupation ? 'Required' : undefined),
    age: Yup.number()
      .min(eraRules.minAge, `Must be at least ${eraRules.minAge}`)
      .max(eraRules.maxAge, `Must be no more than ${eraRules.maxAge}`)
      .required('Required'),
    sex: Yup.string().required('Required'),
    residence: Yup.string().required('Required'),
    birthplace: Yup.string().required('Required'),

    // Modern era specific
    ...(era === 'modern' && {
      email: Yup.string()
        .email('Invalid email')
        .required('Required for modern era'),
    }),

    // Regency era specific
    ...(era === 'regency' && {
      socialClass: Yup.string()
        .required('Required for regency era'),
    }),

    // Characteristics
    str: characteristicSchema,
    con: characteristicSchema,
    siz: characteristicSchema,
    dex: characteristicSchema,
    app: characteristicSchema,
    int: characteristicSchema,
    pow: characteristicSchema,
    edu: characteristicSchema,

    // Skills
    skills: Yup.object().shape(
      Object.fromEntries(
        eraSkills.map(skill => [
          skill.name + (skill.specialization ? ` ${skill.specialization}` : ''),
          Yup.object({
            base: Yup.number().required(),
            occupation: Yup.number()
              .min(0, 'Cannot be negative')
              .required(),
            personal: Yup.number()
              .min(0, 'Cannot be negative')
              .required(),
            final: Yup.number().required(),
          })
        ])
      )
    ),

    // Combat & Health
    hp: Yup.string()
      .matches(numberPattern, 'Must be a number')
      .required('Required'),
    maxHp: Yup.string()
      .matches(numberPattern, 'Must be a number')
      .required('Required'),
    sanity: Yup.string()
      .matches(numberPattern, 'Must be a number')
      .required('Required'),
    maxSanity: Yup.string()
      .matches(numberPattern, 'Must be a number')
      .required('Required'),
    
    // Optional fields with basic validation when provided
    description: Yup.string(),
    ideology: Yup.string(),
    significantPeople: Yup.string(),
    meaningfulLocations: Yup.string(),
    treasuredPossessions: Yup.string(),
    traits: Yup.string(),
    injuries: Yup.string(),
    phobias: Yup.string(),
    arcane: Yup.string(),
    encounters: Yup.string(),

    // Inventory and Assets
    possessions: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Required'),
        quantity: Yup.number().min(1, 'Must have at least 1').required('Required'),
      })
    ),
    assets: Yup.string(),
    cash: Yup.string(),
    spendingLevel: Yup.string(),
  });
};