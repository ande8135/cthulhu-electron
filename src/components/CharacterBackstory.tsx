import { Box, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

interface CharacterBackstoryValues {
  description: string;
  ideology: string;
  significantPeople: string;
  meaningfulLocations: string;
  treasuredPossessions: string;
  traits: string;
  injuries: string;
  phobias: string;
  arcane: string;
  encounters: string;
}

export default function CharacterBackstory() {
  const { values, handleChange, handleBlur } = useFormikContext<CharacterBackstoryValues>();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Backstory
      </Typography>
      <Paper elevation={1} sx={{ p: 2, display: 'grid', gap: 2 }}>
        <TextField
          label="Description"
          name="description"
          value={values.description || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Ideology/Beliefs"
          name="ideology"
          value={values.ideology || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Significant People"
          name="significantPeople"
          value={values.significantPeople || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Meaningful Locations"
          name="meaningfulLocations"
          value={values.meaningfulLocations || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Treasured Possessions"
          name="treasuredPossessions"
          value={values.treasuredPossessions || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Traits"
          name="traits"
          value={values.traits || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Injuries & Scars"
          name="injuries"
          value={values.injuries || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Phobias & Manias"
          name="phobias"
          value={values.phobias || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Arcane/Occult"
          name="arcane"
          value={values.arcane || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Encounters with Strange Entities"
          name="encounters"
          value={values.encounters || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
      </Paper>
    </Box>
  );
}
