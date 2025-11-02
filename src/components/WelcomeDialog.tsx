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
}

export default function WelcomeDialog({
  open,
  onClose,
  onSelectSetting,
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
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d2d2d' }}>
          Welcome to Call of Cthulhu
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Select Setting
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