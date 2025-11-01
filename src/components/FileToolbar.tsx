import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  ListItemIcon, 
  ListItemText,
  Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';

const MAX_RECENT_FILES = 5;

interface FileToolbarProps {
  onSave: (values: any) => void;
  onLoad: (path: string) => void;
}

export default function FileToolbar({ onSave, onLoad }: FileToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const { values } = useFormikContext();

  useEffect(() => {
    // Load recent files from localStorage on component mount
    const savedRecent = localStorage.getItem('recentFiles');
    if (savedRecent) {
      setRecentFiles(JSON.parse(savedRecent));
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveAs = async () => {
    try {
      // @ts-ignore - window.api is injected by electron
      const filePath = await window.api.showSaveDialog({
        filters: [{ name: 'JSON', extensions: ['json'] }]
      });
      
      if (filePath) {
        await onSave({ ...values, filePath });
        addRecentFile(filePath);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
    handleClose();
  };

  const handleSave = async () => {
    if (values.filePath) {
      await onSave(values);
    } else {
      await handleSaveAs();
    }
    handleClose();
  };

  const handleOpen = async () => {
    try {
      // @ts-ignore - window.api is injected by electron
      const filePath = await window.api.showOpenDialog({
        filters: [{ name: 'JSON', extensions: ['json'] }]
      });
      
      if (filePath) {
        await onLoad(filePath);
        addRecentFile(filePath);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
    handleClose();
  };

  const handleOpenRecent = async (filePath: string) => {
    await onLoad(filePath);
    addRecentFile(filePath);
    handleClose();
  };

  const addRecentFile = (filePath: string) => {
    const newRecent = [filePath, ...recentFiles.filter(f => f !== filePath)]
      .slice(0, MAX_RECENT_FILES);
    setRecentFiles(newRecent);
    localStorage.setItem('recentFiles', JSON.stringify(newRecent));
  };

  const handleNew = () => {
    // @ts-ignore - window.api is injected by electron
    window.api.createNewWindow();
    handleClose();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" onClick={handleNew}>
          <CreateNewFolderIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleOpen}>
          <FolderOpenIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleSave}>
          <SaveIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleNew}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>New Character</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleOpen}>
            <ListItemIcon>
              <FolderOpenIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Open...</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSave}>
            <ListItemIcon>
              <SaveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Save</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSaveAs}>
            <ListItemIcon>
              <SaveAsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Save As...</ListItemText>
          </MenuItem>
          {recentFiles.length > 0 && (
            <>
              <Divider />
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                Recent Files
              </Typography>
              {recentFiles.map((file, index) => (
                <MenuItem key={index} onClick={() => handleOpenRecent(file)}>
                  <ListItemText 
                    primary={file.split('/').pop()} 
                    secondary={file}
                    secondaryTypographyProps={{ 
                      style: { 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                </MenuItem>
              ))}
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}