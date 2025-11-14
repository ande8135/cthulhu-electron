import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { Add as AddIcon, FolderOpen as FolderOpenIcon } from '@mui/icons-material';
import { settings } from '../data/settings';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectSetting: (setting: typeof settings[0]) => void;
  onOpenCharacter: () => void;
}

export default function WelcomeDialog({
  open,
  onClose,
  onSelectSetting,
  onOpenCharacter,
}: WelcomeDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#fffbe8',
          backgroundImage: 'url("/texture.png")',
          backgroundBlend: 'overlay',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center', 
          pb: 1,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#2d2d2d'
        }}
      >
        Welcome to Call of Cthulhu
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<FolderOpenIcon />}
            onClick={onOpenCharacter}
            sx={{ 
              mb: 3, 
              py: 2,
              borderColor: 'secondary.main',
              '&:hover': {
                borderColor: 'secondary.dark',
                backgroundColor: 'rgba(191, 164, 109, 0.08)'
              }
            }}
          >
            Open Existing Character
          </Button>

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Create New Character
          </Typography>
          
          <List sx={{ 
            border: '1px solid #bfa46d',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}>
            {settings.map((setting, index) => (
              <Box key={setting.id}>
                {index > 0 && <Divider />}
                <ListItemButton onClick={() => onSelectSetting(setting)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <AddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={setting.name}
                    secondary={setting.description}
                    primaryTypographyProps={{
                      fontWeight: 500
                    }}
                  />
                </ListItemButton>
              </Box>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}