import { Box, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

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

export default function CharacterCharacteristics() {
  const { values, handleChange, handleBlur, setFieldValue } = useFormikContext<CharacterCharacteristicsValues>();

  const handleCharacteristicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [characteristic, field] = e.target.name.split('.');
    if (field === 'current') {
      const { half, fifth } = calculateDerivedValues(e.target.value);
      setFieldValue(e.target.name, e.target.value);
      setFieldValue(`${characteristic}.half`, half);
      setFieldValue(`${characteristic}.fifth`, fifth);
    }
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
    </Box>
  );
}