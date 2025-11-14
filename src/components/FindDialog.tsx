import { Dialog, DialogTitle, DialogContent, TextField, IconButton, Box } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface FindDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function FindDialog({ open, onClose }: FindDialogProps) {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useFindInputFocusGuard(open, inputRef, searchText);

  useEffect(() => {
    if (open && inputRef.current) {
      // Focus the input when dialog opens
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      // Clear search when dialog closes
      const api = (window as any).api;
      if (api?.stopFindInPage) {
        api.stopFindInPage('clearSelection');
      }
    }
  }, [open]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const api = (window as any).api;
    if (api?.findInPage && text) {
      api.findInPage(text, { forward: true });
      // Refocus input after Electron highlights a match
      setTimeout(() => inputRef.current?.focus(), 0);
    } else if (api?.stopFindInPage && !text) {
      api.stopFindInPage('clearSelection');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const api = (window as any).api;
    if (e.key === 'Enter' && searchText && api?.findInPage) {
      // Find next on Enter
      api.findInPage(searchText, { forward: !e.shiftKey, findNext: true });
      // Keep focus on the input for continuous typing
      setTimeout(() => inputRef.current?.focus(), 0);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // If main forwards found-in-page results, refocus input to prevent blur
  useEffect(() => {
    const api = (window as any).api;
    if (!api?.onFindResult) return;
    const handler = () => {
      // Defer to next tick to override any focus shift caused by selection
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    api.onFindResult(handler);
    return () => {
      // No explicit off binding available; dialog unmount will drop listener impact
    };
  }, []);

  // Global key capture: route typing to the search field even if focus drifted
  useEffect(() => {
    if (!open) return;
    const api = (window as any).api;
    const onKeyDown = (e: KeyboardEvent) => {
      // Allow shortcuts with Cmd/Ctrl to bubble (except Enter handling below)
      if (e.metaKey || e.ctrlKey) return;
      const input = inputRef.current;
      if (!input) return;

      // Handle Enter/Shift+Enter navigation globally
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

      // Route printable and edit keys to the input when it isn't focused
      const isPrintable = e.key.length === 1 && !e.altKey;
      const isEdit = e.key === 'Backspace' || e.key === 'Delete';
      if (document.activeElement !== input && (isPrintable || isEdit)) {
        e.preventDefault();
        if (isPrintable) {
          handleSearch(searchText + e.key);
        } else if (e.key === 'Backspace') {
          handleSearch(searchText.slice(0, Math.max(0, searchText.length - 1)));
        } else if (e.key === 'Delete') {
          // Delete acts same as Backspace here
          handleSearch(searchText.slice(0, Math.max(0, searchText.length - 1)));
        }
        setTimeout(() => input.focus(), 0);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open, searchText, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          top: 60,
          right: 20,
          m: 0,
          maxWidth: 400
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 1,
        px: 2
      }}>
        Find
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ ml: 1 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 2, px: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // If the dialog is still open, reclaim focus immediately
              if (open) setTimeout(() => inputRef.current?.focus(), 0);
            }}
            autoFocus
          />
        </Box>
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
          Press Enter for next, Shift+Enter for previous
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Focus guard: while the dialog is open, periodically ensure the input keeps focus
// We attach this at file scope with a component-local effect to avoid global listeners
export function useFindInputFocusGuard(open: boolean, input: React.RefObject<HTMLInputElement>, currentText: string) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => {
      const el = input.current;
      if (!el) return;
      if (document.activeElement !== el) {
        el.focus();
        try {
          const len = el.value?.length ?? currentText.length;
          el.setSelectionRange(len, len);
        } catch {}
      }
    }, 400);
    return () => window.clearInterval(timer);
  }, [open, input, currentText]);
}
