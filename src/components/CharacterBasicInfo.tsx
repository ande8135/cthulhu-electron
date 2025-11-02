import { Box, TextField } from '@mui/material';
import { useFormikContext } from 'formik';

import { Setting } from '../data/settings';

interface CharacterBasicInfoProps {
  setting: Setting;
}

interface CharacterBasicInfoValues {
  name: string;
  occupation: string;
  age: string;
  sex: string;
  residence: string;
  birthplace: string;
  email?: string;
  socialClass?: string;
}

export default function CharacterBasicInfo({ setting }: CharacterBasicInfoProps) {
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
      {setting.id === 'modern' && (
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email Address"
          variant="outlined"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email || ''}
        />
      )}
      {setting.id === 'regency' && (
        <TextField
          fullWidth
          id="socialClass"
          name="socialClass"
          label="Social Class"
          variant="outlined"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.socialClass || ''}
        />
      )}
    </Box>
  );
}