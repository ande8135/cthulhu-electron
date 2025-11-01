import { Box, Typography, Paper, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormikContext, FieldArray } from 'formik';

interface Weapon {
  name: string;
  damage: string;
  range: string;
  attacks: string;
  ammo: string;
  malfunction: string;
}

interface CharacterCombatValues {
  weapons: Weapon[];
  damageBonus: string;
  build: string;
  hp: string;
  maxHp: string;
  sanity: string;
  maxSanity: string;
}

export default function CharacterCombat() {
  const { values, handleChange, handleBlur } = useFormikContext<CharacterCombatValues>();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Combat
      </Typography>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Damage Bonus"
            name="damageBonus"
            value={values.damageBonus || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
          />
          <TextField
            label="Build"
            name="build"
            value={values.build || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
          />
          <TextField
            label="HP"
            name="hp"
            value={values.hp || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
          />
          <TextField
            label="Max HP"
            name="maxHp"
            value={values.maxHp || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
          />
          <TextField
            label="Sanity"
            name="sanity"
            value={values.sanity || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
          />
          <TextField
            label="Max Sanity"
            name="maxSanity"
            value={values.maxSanity || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
          />
        </Box>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Weapons
        </Typography>
        <FieldArray name="weapons">
          {({ push, remove }) => (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Damage</TableCell>
                    <TableCell>Range</TableCell>
                    <TableCell>Attacks</TableCell>
                    <TableCell>Ammo</TableCell>
                    <TableCell>Malfunction</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.weapons && values.weapons.length > 0 ? (
                    values.weapons.map((weapon, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <TextField
                            name={`weapons[${idx}].name`}
                            value={weapon.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`weapons[${idx}].damage`}
                            value={weapon.damage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`weapons[${idx}].range`}
                            value={weapon.range}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`weapons[${idx}].attacks`}
                            value={weapon.attacks}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`weapons[${idx}].ammo`}
                            value={weapon.ammo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`weapons[${idx}].malfunction`}
                            value={weapon.malfunction}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton color="error" onClick={() => remove(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No weapons added.
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <IconButton color="primary" onClick={() => push({ name: '', damage: '', range: '', attacks: '', ammo: '', malfunction: '' })}>
                        <AddIcon /> Add Weapon
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </FieldArray>
      </Paper>
    </Box>
  );
}
