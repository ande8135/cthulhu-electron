import { Box, Paper, TextField, Typography, IconButton } from '@mui/material';
import { useFormikContext } from 'formik';
import { memo, useEffect } from 'react';
import { Setting } from '../data/settings';
import {
  calculateDamageBonus,
  calculateBuild,
  calculateMaxHp,
  calculateMaxSanity,
  calculateMovementRate,
  calculateSkillPointsAvailable
} from '../utils/calculations';

interface Characteristic {
  current: string;
  half: string;
  fifth: string;
}

interface CharacterCharacteristicsValues {
  str: Characteristic;
  con: Characteristic;
  dex: Characteristic;
  app: Characteristic;
  pow: Characteristic;
  siz: Characteristic;
  int: Characteristic;
  edu: Characteristic;
  age: string;
  damageBonus: string;
  build: string;
  hp: string;
  maxHp: string;
  sanity: string;
  maxSanity: string;
  movementRate: string;
  skillPoints: {
    occupation: number;
    personal: number;
  };
}

const calculateDerivedValues = (value: string): { half: string; fifth: string } => {
  const numValue = parseInt(value) || 0;
  return {
    half: Math.floor(numValue / 2).toString(),
    fifth: Math.floor(numValue / 5).toString(),
  };
};

const CharacteristicField = ({ 
  name, 
  label, 
  value, 
  onChange, 
  onBlur 
}: { 
  name: string; 
  label: string; 
  value: Characteristic;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      <Box sx={{ display: 'grid', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          id={`${name}.current`}
          name={`${name}.current`}
          label="Current"
          variant="outlined"
          value={value.current}
          onChange={onChange}
          onBlur={onBlur}
        />
        <TextField
          fullWidth
          size="small"
          id={`${name}.half`}
          name={`${name}.half`}
          label="Half"
          variant="outlined"
          value={value.half}
          disabled
        />
        <TextField
          fullWidth
          size="small"
          id={`${name}.fifth`}
          name={`${name}.fifth`}
          label="Fifth"
          variant="outlined"
          value={value.fifth}
          disabled
        />
      </Box>
    </Paper>
  );
};

interface CharacterCharacteristicsProps {
  setting: Setting;
}

function CharacterCharacteristics({ setting }: CharacterCharacteristicsProps) {
  const { values, handleChange, handleBlur, setFieldValue } = useFormikContext<CharacterCharacteristicsValues>();

  const handleCharacteristicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [characteristic, field] = e.target.name.split('.');
    if (field === 'current') {
      // Update half and fifth values
      const { half, fifth } = calculateDerivedValues(e.target.value);
      setFieldValue(e.target.name, e.target.value);
      setFieldValue(`${characteristic}.half`, half);
      setFieldValue(`${characteristic}.fifth`, fifth);

      // Update derived statistics
      const str = parseInt(characteristic === 'str' ? e.target.value : values.str.current) || 0;
      const siz = parseInt(characteristic === 'siz' ? e.target.value : values.siz.current) || 0;
      const dex = parseInt(characteristic === 'dex' ? e.target.value : values.dex.current) || 0;
      const con = parseInt(characteristic === 'con' ? e.target.value : values.con.current) || 0;
      const pow = parseInt(characteristic === 'pow' ? e.target.value : values.pow.current) || 0;
      const edu = parseInt(characteristic === 'edu' ? e.target.value : values.edu.current) || 0;

      // Calculate and update derived values
      setFieldValue('damageBonus', calculateDamageBonus(str, siz));
      setFieldValue('build', calculateBuild(str, siz));
      setFieldValue('maxHp', calculateMaxHp(con, siz).toString());
      setFieldValue('hp', calculateMaxHp(con, siz).toString());
      // Starting Sanity equals POW (7e). Max Sanity = 99 - Cthulhu Mythos.
      const mythosVal = (() => {
        try {
          const skills: any = (values as any).skills || {};
          const cm = skills['Cthulhu Mythos'] || {};
          // prefer final, fallback to occupation/personal/base sum
          const final = parseInt(cm.final ?? cm.base ?? 0) || 0;
          return Math.max(0, Math.min(99, final));
        } catch {
          return 0;
        }
      })();
      const maxSan = Math.max(0, 99 - mythosVal);
      setFieldValue('sanity', pow.toString());
      setFieldValue('maxSanity', maxSan.toString());
      
      const { occupation, personal } = calculateSkillPointsAvailable(setting.id as any, edu);
      setFieldValue('skillPoints.occupation', occupation);
      setFieldValue('skillPoints.personal', personal);
      
      if (values.age) {
        const movementRate = calculateMovementRate(str, dex, siz, setting.id as any, parseInt(values.age));
        setFieldValue('movementRate', movementRate.toString());
      }
    }
  };

  // Watch for changes to Cthulhu Mythos skill and update Max Sanity
  useEffect(() => {
    const skills: any = (values as any).skills || {};
    const cm = skills['Cthulhu Mythos'] || {};
    
    // Get the final Cthulhu Mythos value (base + occupation + personal + adjustment)
    const base = parseInt(cm.base ?? 0) || 0;
    const occupation = parseInt(cm.occupation ?? 0) || 0;
    const personal = parseInt(cm.personal ?? 0) || 0;
    const adjustment = parseInt(cm.adjustment ?? 0) || 0;
    
    const mythosVal = Math.max(0, Math.min(99, base + occupation + personal + adjustment));
    
    // Calculate Max Sanity: 99 - Cthulhu Mythos
    const maxSan = Math.max(0, 99 - mythosVal);
    
    // Only update if the value has actually changed to avoid infinite loops
    if (values.maxSanity !== maxSan.toString()) {
      setFieldValue('maxSanity', maxSan.toString());
    }
  }, [
    (values as any).skills?.['Cthulhu Mythos']?.base,
    (values as any).skills?.['Cthulhu Mythos']?.occupation,
    (values as any).skills?.['Cthulhu Mythos']?.personal,
    (values as any).skills?.['Cthulhu Mythos']?.adjustment,
    values.maxSanity,
    setFieldValue
  ]);

  const handleSanityChange = (delta: number) => {
    const currentSanity = parseInt(values.sanity) || 0;
    const maxSanity = parseInt(values.maxSanity) || 99;
    const newSanity = Math.max(0, Math.min(maxSanity, currentSanity + delta));
    setFieldValue('sanity', newSanity.toString());
  };

  const handleSanityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for editing
    if (value === '') {
      setFieldValue('sanity', '');
      return;
    }
    
    const numValue = parseInt(value) || 0;
    const maxSanity = parseInt(values.maxSanity) || 99;
    const clampedValue = Math.max(0, Math.min(maxSanity, numValue));
    setFieldValue('sanity', clampedValue.toString());
  };

  const handleHpChange = (delta: number) => {
    const currentHp = parseInt(values.hp) || 0;
    const maxHp = parseInt(values.maxHp) || 0;
    const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));
    setFieldValue('hp', newHp.toString());
  };

  const handleHpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for editing
    if (value === '') {
      setFieldValue('hp', '');
      return;
    }
    
    const numValue = parseInt(value) || 0;
    const maxHp = parseInt(values.maxHp) || 0;
    const clampedValue = Math.max(0, Math.min(maxHp, numValue));
    setFieldValue('hp', clampedValue.toString());
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Characteristics
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gap: 3,
        gridTemplateColumns: { 
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        }
      }}>
        <CharacteristicField
          name="str"
          label="STR"
          value={values.str}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
        <CharacteristicField
          name="con"
          label="CON"
          value={values.con}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
        <CharacteristicField
          name="dex"
          label="DEX"
          value={values.dex}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
        <CharacteristicField
          name="app"
          label="APP"
          value={values.app}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
        <CharacteristicField
          name="pow"
          label="POW"
          value={values.pow}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
        <CharacteristicField
          name="siz"
          label="SIZ"
          value={values.siz}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
        <CharacteristicField
          name="int"
          label="INT"
          value={values.int}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
        <CharacteristicField
          name="edu"
          label="EDU"
          value={values.edu}
          onChange={handleCharacteristicChange}
          onBlur={handleBlur}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Derived Statistics
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gap: 3,
          gridTemplateColumns: { 
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          }
        }}>
          <TextField
            fullWidth
            size="small"
            id="damageBonus"
            name="damageBonus"
            label="Damage Bonus"
            variant="outlined"
            value={values.damageBonus}
            disabled
          />
          <TextField
            fullWidth
            size="small"
            id="build"
            name="build"
            label="Build"
            variant="outlined"
            value={values.build}
            disabled
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TextField
              fullWidth
              size="small"
              id="hp"
              name="hp"
              label="Hit Points"
              variant="outlined"
              value={values.hp}
              onChange={handleHpInputChange}
              onBlur={handleBlur}
              inputProps={{
                min: 0,
                max: parseInt(values.maxHp) || 0
              }}
            />
            <IconButton 
              size="small" 
              onClick={() => handleHpChange(-1)}
              sx={{ padding: '2px' }}
            >
              <Typography variant="caption">−</Typography>
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleHpChange(1)}
              sx={{ padding: '2px' }}
            >
              <Typography variant="caption">+</Typography>
            </IconButton>
          </Box>
          <TextField
            fullWidth
            size="small"
            id="maxHp"
            name="maxHp"
            label="Max HP"
            variant="outlined"
            value={values.maxHp}
            disabled
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TextField
              fullWidth
              size="small"
              id="sanity"
              name="sanity"
              label="Sanity"
              variant="outlined"
              value={values.sanity}
              onChange={handleSanityInputChange}
              onBlur={handleBlur}
              inputProps={{
                min: 0,
                max: parseInt(values.maxSanity) || 99
              }}
            />
            <IconButton 
              size="small" 
              onClick={() => handleSanityChange(-1)}
              sx={{ padding: '2px' }}
            >
              <Typography variant="caption">−</Typography>
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleSanityChange(1)}
              sx={{ padding: '2px' }}
            >
              <Typography variant="caption">+</Typography>
            </IconButton>
          </Box>
          <TextField
            fullWidth
            size="small"
            id="maxSanity"
            name="maxSanity"
            label="Max Sanity"
            variant="outlined"
            value={values.maxSanity}
            disabled
          />
          <TextField
            fullWidth
            size="small"
            id="movementRate"
            name="movementRate"
            label="Movement Rate"
            variant="outlined"
            value={values.movementRate}
            disabled
          />
        </Box>
      </Box>
    </Box>
  );
}

export default memo(CharacterCharacteristics);