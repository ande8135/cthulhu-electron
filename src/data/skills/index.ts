import { skills1920s } from './1920s';
import { skillsDarkAges } from './darkAges';
import { skillsModern } from './modern';
import { skillsRegency } from './regency';
import { skillsGaslight } from './gaslight';

export interface Skill {
  name: string;
  base: number;
  category: string;
  specialization?: string;
  eraSpecific?: boolean;
}

export const skillsByEra: Record<string, Skill[]> = {
  '1920s': skills1920s,
  'dark-ages': skillsDarkAges,
  'modern': skillsModern,
  'regency': skillsRegency,
  'gaslight': skillsGaslight,
};