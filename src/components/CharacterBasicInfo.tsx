import { Box, TextField } from '@mui/material';
import { useFormikContext } from 'formik';

interface CharacterBasicInfoValues {
  name: string;
  occupation: string;
  age: string;
  sex: string;
  residence: string;
  birthplace: string;
}

export default function CharacterBasicInfo() {
  const { values, handleChange, handleBlur } = useFormikContext<CharacterBasicInfoValues>();

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
      }}
    >
      <TextField
        fullWidth
        id="name"
        name="name"
        label="Investigator Name"
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name || ''}
      />
      <TextField
        fullWidth
        id="occupation"
        name="occupation"
        label="Occupation"
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.occupation || ''}
      />
      <TextField
        fullWidth
        id="age"
        name="age"
        label="Age"
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.age || ''}
      />
      <TextField
        fullWidth
        id="sex"
        name="sex"
        label="Sex"
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.sex || ''}
      />
      <TextField
        fullWidth
        id="residence"
        name="residence"
        label="Residence"
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.residence || ''}
      />
      <TextField
        fullWidth
        id="birthplace"
        name="birthplace"
        label="Birthplace"
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.birthplace || ''}
      />
    </Box>
  );
}