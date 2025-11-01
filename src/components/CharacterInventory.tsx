import { Box, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext, FieldArray } from 'formik';

interface Possession {
  item: string;
  notes: string;
}

interface CharacterInventoryValues {
  possessions: Possession[];
  assets: string;
  cash: string;
  spendingLevel: string;
}

export default function CharacterInventory() {
  const { values, handleChange, handleBlur } = useFormikContext<CharacterInventoryValues>();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Inventory & Assets
      </Typography>
      <Paper elevation={1} sx={{ p: 2, display: 'grid', gap: 2 }}>
        <FieldArray name="possessions">
          {({ push, remove }) => (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Possessions & Gear
              </Typography>
              {values.possessions && values.possessions.length > 0 ? (
                values.possessions.map((possession, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      label="Item"
                      name={`possessions[${idx}].item`}
                      value={possession.item}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Notes"
                      name={`possessions[${idx}].notes`}
                      value={possession.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      sx={{ flex: 3 }}
                    />
                    <button type="button" onClick={() => remove(idx)} style={{ marginLeft: 8 }}>
                      Remove
                    </button>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No possessions added.</Typography>
              )}
              <button type="button" onClick={() => push({ item: '', notes: '' })}>
                Add Possession
              </button>
            </Box>
          )}
        </FieldArray>
        <TextField
          label="Assets (Property, Investments, etc.)"
          name="assets"
          value={values.assets || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          minRows={2}
        />
        <TextField
          label="Cash"
          name="cash"
          value={values.cash || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextField
          label="Spending Level"
          name="spendingLevel"
          value={values.spendingLevel || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Paper>
    </Box>
  );
}
