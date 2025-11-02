import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Button,
  DialogActions,
} from '@mui/material';
import { weapons } from '../data/weapons';
import { Setting } from '../data/settings';

interface WeaponSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (weaponName: string) => void;
  setting: Setting;
}

export default function WeaponSelectDialog({
  open,
  onClose,
  onSelect,
  setting
}: WeaponSelectDialogProps) {
  const eraWeapons = weapons.filter(w => w.era.includes(setting.id));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">Select Weapon</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {setting.name} Era Weapons
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <List>
          <ListItem>
            <ListItemButton onClick={() => onSelect('custom')}>
              <ListItemText 
                primary="Custom Weapon"
                secondary="Create your own weapon"
              />
            </ListItemButton>
          </ListItem>
          {eraWeapons.map((weapon) => (
            <ListItem key={weapon.name}>
              <ListItemButton onClick={() => onSelect(weapon.name)}>
                <ListItemText
                  primary={weapon.name}
                  secondary={`${weapon.damage} damage • ${weapon.skill} • ${weapon.range}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}