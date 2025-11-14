import React from 'react';
import { Box, IconButton, MenuItem, Select, TextField } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Weapon, weapons, weaponSkills } from '../data/weapons';

interface WeaponRowProps {
  value: {
    name: string;
    skill: string;
    damage: string;
    range: string;
    attacks: string;
    ammo: string;
    malfunction: string;
  };
  onChange: (field: string, value: string) => void;
  onDelete: () => void;
  era: string;
  custom?: boolean;
}

export default function WeaponRow({ value, onChange, onDelete, era, custom = false }: WeaponRowProps) {
  const availableWeapons = weapons.filter(w => w.era.includes(era));

  const handleWeaponSelect = (selectedName: string) => {
    if (selectedName === 'custom') {
      // Reset fields for custom weapon
      onChange('name', '');
      onChange('skill', '');
      onChange('damage', '');
      onChange('range', '');
      onChange('attacks', '');
      onChange('ammo', '');
      onChange('malfunction', '');
      return;
    }

    const weapon = weapons.find(w => w.name === selectedName);
    if (weapon) {
      onChange('name', weapon.name);
      onChange('skill', weapon.skill);
      onChange('damage', weapon.damage);
      onChange('range', weapon.range);
      onChange('attacks', weapon.attacks);
      onChange('ammo', weapon.ammo);
      onChange('malfunction', weapon.malfunction);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
      {custom ? (
        <TextField
          size="small"
          value={value.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Custom Weapon"
          sx={{ width: 150 }}
        />
      ) : (
        <Select
          size="small"
          value={value.name}
          onChange={(e) => handleWeaponSelect(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="custom">Custom Weapon...</MenuItem>
          {availableWeapons.map((weapon) => (
            <MenuItem key={weapon.name} value={weapon.name}>
              {weapon.name}
            </MenuItem>
          ))}
        </Select>
      )}

      <Select
        size="small"
        value={value.skill}
        onChange={(e) => onChange('skill', e.target.value)}
        sx={{ width: 150 }}
      >
        {weaponSkills.map((skill) => (
          <MenuItem key={skill} value={skill}>
            {skill}
          </MenuItem>
        ))}
      </Select>

      <TextField
        size="small"
        value={value.damage}
        onChange={(e) => onChange('damage', e.target.value)}
        placeholder="Damage"
        disabled={!custom && !!value.name && value.name !== 'custom'}
        sx={{ width: 100 }}
      />

      <TextField
        size="small"
        value={value.range}
        onChange={(e) => onChange('range', e.target.value)}
        placeholder="Range"
        disabled={!custom && !!value.name && value.name !== 'custom'}
        sx={{ width: 100 }}
      />

      <TextField
        size="small"
        value={value.attacks}
        onChange={(e) => onChange('attacks', e.target.value)}
        placeholder="Attacks"
        disabled={!custom && !!value.name && value.name !== 'custom'}
        sx={{ width: 80 }}
      />

      <TextField
        size="small"
        value={value.ammo}
        onChange={(e) => onChange('ammo', e.target.value)}
        placeholder="Ammo"
        disabled={!custom && !!value.name && value.name !== 'custom'}
        sx={{ width: 80 }}
      />

      <TextField
        size="small"
        value={value.malfunction}
        onChange={(e) => onChange('malfunction', e.target.value)}
        placeholder="Malf"
        disabled={!custom && !!value.name && value.name !== 'custom'}
        sx={{ width: 80 }}
      />

      <IconButton onClick={onDelete} size="small">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}