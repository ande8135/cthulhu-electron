import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import { useState } from 'react';
import WeaponSelectDialog from './WeaponSelectDialog';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormikContext, FieldArray } from 'formik';

import { Setting } from '../data/settings';
import { weapons, weaponSkills } from '../data/weapons';

interface Weapon {
  name: string;
  skill: string;
  damage: string;
  range: string;
  attacks: string;
  ammo: string;
  malfunction: string;
  custom?: boolean;
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

interface CharacterCombatProps {
  setting: Setting;
}

export default function CharacterCombat({ setting }: CharacterCombatProps) {
  const { values, handleChange, handleBlur, setFieldValue } = useFormikContext<CharacterCombatValues>();
  const [isWeaponDialogOpen, setIsWeaponDialogOpen] = useState(false);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Combat
      </Typography>
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 3, 
            mb: 3 
          }}
        >
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Physical
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Damage Bonus"
                name="damageBonus"
                value={values.damageBonus || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
                fullWidth
              />
              <TextField
                label="Build"
                name="build"
                value={values.build || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
                fullWidth
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Health
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="HP"
                name="hp"
                value={values.hp || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
                fullWidth
              />
              <TextField
                label="Max HP"
                name="maxHp"
                value={values.maxHp || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
                fullWidth
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Mental
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Sanity"
                name="sanity"
                value={values.sanity || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
                fullWidth
              />
              <TextField
                label="Max Sanity"
                name="maxSanity"
                value={values.maxSanity || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
                fullWidth
              />
        </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Weapons
          </Typography>
          <FieldArray name="weapons">
            {({ push, remove }) => (
              <>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="25%">Name</TableCell>
                        <TableCell width="20%">Skill</TableCell>
                        <TableCell width="15%">Damage</TableCell>
                        <TableCell width="15%">Range</TableCell>
                        <TableCell width="10%">Attacks</TableCell>
                        <TableCell width="7.5%">Ammo</TableCell>
                        <TableCell width="7.5%">Malf</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.weapons && values.weapons.length > 0 ? (
                        values.weapons.map((weapon, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                name={`weapons[${idx}].name`}
                                value={weapon.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!weapon.custom}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                name={`weapons[${idx}].skill`}
                                value={weapon.skill}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!weapon.custom}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                name={`weapons[${idx}].damage`}
                                value={weapon.damage}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!weapon.custom}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                name={`weapons[${idx}].range`}
                                value={weapon.range}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!weapon.custom}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                name={`weapons[${idx}].attacks`}
                                value={weapon.attacks}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!weapon.custom}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                name={`weapons[${idx}].ammo`}
                                value={weapon.ammo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!weapon.custom}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                name={`weapons[${idx}].malfunction`}
                                value={weapon.malfunction}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!weapon.custom}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => remove(idx)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No weapons added yet
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsWeaponDialogOpen(true)}
                >
                  Add Weapon
                </Button>
              </>
            )}
          </FieldArray>
        </Box>
      </Paper>

      <WeaponSelectDialog
        open={isWeaponDialogOpen}
        onClose={() => setIsWeaponDialogOpen(false)}
        onSelect={(weaponName) => {
          if (weaponName === 'custom') {
            const emptyWeapon = {
              name: '',
              skill: '',
              damage: '',
              range: '',
              attacks: '',
              ammo: '',
              malfunction: '',
              custom: true
            };
            setFieldValue('weapons', [...values.weapons, emptyWeapon]);
          } else {
            const selectedWeapon = weapons.find(w => w.name === weaponName);
            if (selectedWeapon) {
              setFieldValue('weapons', [...values.weapons, { ...selectedWeapon, custom: false }]);
            }
          }
          setIsWeaponDialogOpen(false);
        }}
        setting={setting}
      />
    </Box>
  );
}
