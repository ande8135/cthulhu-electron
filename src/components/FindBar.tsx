import { Box, Paper, TextField, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useEffect, useRef, useState } from 'react';

interface FindBarProps {
  open: boolean;
  onClose: () => void;
}

export default function FindBar({ open, onClose }: FindBarProps) {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      const api = (window as any).api;
      api?.stopFindInPage?.('clearSelection');
      setSearchText('');
    }
  }, [open]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const api = (window as any).api;
    if (api?.findInPage && text) {
      api.findInPage(text, { forward: true });
      setTimeout(() => inputRef.current?.focus(), 0);
    } else if (api?.stopFindInPage && !text) {
      api.stopFindInPage('clearSelection');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const api = (window as any).api;
    if (e.key === 'Enter') {
      if (searchText && api?.findInPage) {
        e.preventDefault();
        api.findInPage(searchText, { forward: !e.shiftKey, findNext: true });
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Keep focus on input after result updates
  useEffect(() => {
    const api = (window as any).api;
    if (!api?.onFindResult || !open) return;
    const handler = () => setTimeout(() => inputRef.current?.focus(), 0);
    api.onFindResult(handler);
    return () => {};
  }, [open]);

  // Global key routing while bar is open
  useEffect(() => {
    if (!open) return;
    const api = (window as any).api;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;
      const input = inputRef.current;
      if (!input) return;

      if (e.key === 'Enter') {
        if (searchText && api?.findInPage) {
          e.preventDefault();
          api.findInPage(searchText, { forward: !e.shiftKey, findNext: true });
          setTimeout(() => input.focus(), 0);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      const isPrintable = e.key.length === 1 && !e.altKey;
      const isEdit = e.key === 'Backspace' || e.key === 'Delete';
      if (document.activeElement !== input && (isPrintable || isEdit)) {
        e.preventDefault();
        if (isPrintable) {
          handleSearch(searchText + e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          handleSearch(searchText.slice(0, Math.max(0, searchText.length - 1)));
        }
        setTimeout(() => input.focus(), 0);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open, searchText, onClose]);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 60,
        right: 20,
        zIndex: 2000,
      }}
    >
      <Paper elevation={4} sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          inputRef={inputRef}
          size="small"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={() => setTimeout(() => inputRef.current?.focus(), 0)}
          autoFocus
        />
        <Tooltip title="Previous (Shift+Enter)">
          <IconButton size="small" onClick={() => {
            const api = (window as any).api;
            if (searchText && api?.findInPage) {
              api.findInPage(searchText, { forward: false, findNext: true });
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }} aria-label="Previous match">
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next (Enter)">
          <IconButton size="small" onClick={() => {
            const api = (window as any).api;
            if (searchText && api?.findInPage) {
              api.findInPage(searchText, { forward: true, findNext: true });
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }} aria-label="Next match">
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <IconButton size="small" onClick={onClose} aria-label="Close find">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Paper>
    </Box>
  );
}