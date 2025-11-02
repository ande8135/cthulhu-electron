import { Box, Container, Paper, ThemeProvider, createTheme, Typography, GlobalStyles } from '@mui/material';
import { useRef, useEffect, lazy, Suspense, useState, useMemo } from 'react';
import { Formik, Form, useFormikContext } from 'formik';

// Import all fonts
import '@fontsource/unifrakturmaguntia';
import '@fontsource/im-fell-english-sc';
import '@fontsource/orbitron';
import '@fontsource/petit-formal-script';
import '@fontsource/playfair-display-sc';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import { settings } from './data/settings';
import WelcomeDialog from './components/WelcomeDialog';
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import CharacterBasicInfo from './components/CharacterBasicInfo';
import CharacterCharacteristics from './components/CharacterCharacteristics';
import { skillsByEra, Skill } from './data/skills/index';

// Lazy load components that aren't immediately visible
const CharacterSkills = lazy(() => import('./components/CharacterSkills'));
const CharacterCombat = lazy(() => import('./components/CharacterCombat'));
const CharacterBackstory = lazy(() => import('./components/CharacterBackstory'));
const CharacterInventory = lazy(() => import('./components/CharacterInventory'));

// Create theme based on selected setting
const createSettingTheme = (setting: typeof settings[0]) => createTheme({
  palette: {
    primary: {
      main: setting.themeOverrides?.primary || '#2d2d2d', // Use setting primary or default
    },
    secondary: {
      main: setting.themeOverrides?.secondary || '#bfa46d', // Use setting secondary or default
    },
    background: {
      default: setting.themeOverrides?.background || '#f7f3e3', // Use setting background or default
      paper: setting.themeOverrides?.background ? `${setting.themeOverrides.background}15` : '#fffbe8',
    },
    text: {
      primary: setting.themeOverrides?.primary || '#2d2d2d',
      secondary: setting.themeOverrides?.secondary || '#6b5b2b',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h3: {
      fontFamily: `'${setting.headerFont}', serif`,
    },
    h5: {
      fontWeight: 600,
      letterSpacing: 0.5,
      color: setting.themeOverrides?.primary || '#2d2d2d',
      textTransform: 'uppercase',
      borderBottom: `2px solid ${setting.themeOverrides?.secondary || '#bfa46d'}`,
      paddingBottom: 4,
      marginBottom: 12,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      color: '#6b5b2b',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#fffbe8',
          border: '1.5px solid #bfa46d',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#f7f3e3',
          '& .MuiInputLabel-root': {
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
          },
          '& .MuiInputBase-input': {
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9375rem',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.875rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8125rem',
        },
      },
    },
  },
});

import { createValidationSchema } from './validation/schema';

const getInitialSkills = (era: string) => {
  const eraSkills = skillsByEra[era] || skillsByEra['1920s'];
  return Object.fromEntries(
    eraSkills.map(skill => [
      skill.name + (skill.specialization ? ` ${skill.specialization}` : ''),
      { base: skill.base, occupation: 0, personal: 0, final: skill.base, checked: false, adjustment: 0 }
    ])
  );
};

const getInitialValues = (setting: typeof settings[0]) => ({
  name: '',
  occupation: '',
  age: '',
  sex: '',
  residence: '',
  birthplace: '',
  str: { current: '', half: '', fifth: '' },
  con: { current: '', half: '', fifth: '' },
  dex: { current: '', half: '', fifth: '' },
  app: { current: '', half: '', fifth: '' },
  pow: { current: '', half: '', fifth: '' },
  siz: { current: '', half: '', fifth: '' },
  int: { current: '', half: '', fifth: '' },
  edu: { current: '', half: '', fifth: '' },
  skills: getInitialSkills(setting.id),
  skillPoints: {
    occupation: 0,
    personal: 0
  },
  movementRate: '',
  // Extra bonus points that can be applied to skills (user-defined)
  bonusSkillPoints: 0,
  weapons: [],
  damageBonus: '',
  build: '',
  hp: '',
  maxHp: '',
  sanity: '',
  maxSanity: '',
  description: '',
  ideology: '',
  significantPeople: '',
  meaningfulLocations: '',
  treasuredPossessions: '',
  traits: '',
  injuries: '',
  phobias: '',
  arcane: '',
  encounters: '',
  possessions: [],
  assets: '',
  cash: '',
  spendingLevel: '',
  // Era-specific fields
  ...(setting.id === 'modern' ? { email: '' } : {}),
  ...(setting.id === 'regency' ? { socialClass: '' } : {})
});

export default function App() {
  const formikRef = useRef<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedSetting, setSelectedSetting] = useState(settings[0]);
  const isLoadingFileRef = useRef(false);

  useEffect(() => {
    // Reset form with new initial values when setting changes
    // BUT NOT when we're loading a file (the file load will handle the reset)
    if (formikRef.current && !showWelcome && !isLoadingFileRef.current) {
      formikRef.current.resetForm({ values: getInitialValues(selectedSetting) });
    }
    isLoadingFileRef.current = false;
  }, [selectedSetting, showWelcome]);

  useEffect(() => {
    // Expose formikRef to window for main process access
    (window as any).formikRef = formikRef;
    
    // Add a type declaration for window.api
    const api = (window as any).api;
    if (!api) return;

    // Listen for save/load events from menu
    api.onFileSave(async (filePath: string) => {
      if (formikRef.current) {
        const dataToSave = {
          setting: selectedSetting.id,
          values: formikRef.current.values
        };
        const result = await api.saveFile(filePath, dataToSave);
        if (result.success) {
          console.log('File saved successfully');
        } else {
          console.error('Failed to save file:', result.error);
        }
      }
    });

    api.onFileLoad(async (filePath: string) => {
      console.log('onFileLoad triggered with path:', filePath);
      isLoadingFileRef.current = true;
      const result = await api.loadFile(filePath);
      console.log('Load result:', result);
      if (result.success && formikRef.current) {
        const data = result.data;
        console.log('Data loaded:', data);
        if (data.setting) {
          const newSetting = settings.find(s => s.id === data.setting) || settings[0];
          console.log('Setting found:', newSetting);
          setSelectedSetting(newSetting);
          // Wait for setting to update before resetting form
          setTimeout(() => {
            if (formikRef.current) {
              console.log('Resetting form with values:', data.values || data);
              formikRef.current.resetForm({ values: data.values || data });
            }
          }, 0);
        } else {
          console.log('Resetting form with values:', data.values || data);
          formikRef.current.resetForm({ values: data.values || data });
        }
      } else {
        console.error('Failed to load file:', result.error);
        isLoadingFileRef.current = false;
      }
    });

    // Listen for keyboard shortcuts
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's': {
            e.preventDefault();
            const filePath = await api.showSaveDialog();
            if (filePath && formikRef.current) {
              const dataToSave = {
                setting: selectedSetting.id,
                values: formikRef.current.values
              };
              const result = await api.saveFile(filePath, dataToSave);
              if (!result.success) {
                console.error('Failed to save file:', result.error);
              }
            }
            break;
          }
          case 'o': {
            e.preventDefault();
            const filePath = await api.showOpenDialog();
            if (filePath) {
              isLoadingFileRef.current = true;
              const result = await api.loadFile(filePath);
              if (result.success && formikRef.current) {
                const data = result.data;
                if (data.setting) {
                  const newSetting = settings.find(s => s.id === data.setting) || settings[0];
                  setSelectedSetting(newSetting);
                  // Wait for setting to update before resetting form
                  setTimeout(() => {
                    if (formikRef.current) {
                      formikRef.current.resetForm({ values: data.values || data });
                    }
                  }, 0);
                } else {
                  formikRef.current.resetForm({ values: data.values || data });
                }
              } else {
                console.error('Failed to load file:', result.error);
                isLoadingFileRef.current = false;
              }
            }
            break;
          }
          case 'n': {
            e.preventDefault();
            await api.newWindow();
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  // Create theme based on selected setting
  const theme = useMemo(() => createSettingTheme(selectedSetting), [selectedSetting]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          'html, body': {
            margin: 0,
            padding: 0,
            overflow: 'hidden'
          },
          '#root': {
            width: '100%',
            height: '100vh',
            overflowX: 'hidden',
            overflowY: 'auto'
          }
        }}
      />
      <WelcomeDialog 
        open={showWelcome} 
        onClose={() => setShowWelcome(false)}
        onSelectSetting={(setting) => {
          setSelectedSetting(setting);
          setShowWelcome(false);
        }}
        onOpenCharacter={async () => {
          const api = (window as any).api;
          if (!api) return;

          const filePath = await api.showOpenDialog();
          if (filePath) {
            isLoadingFileRef.current = true;
            const result = await api.loadFile(filePath);
            if (result.success && formikRef.current) {
              const data = result.data;
              if (data.setting) {
                const newSetting = settings.find(s => s.id === data.setting) || settings[0];
                setSelectedSetting(newSetting);
                // Wait for setting to update before resetting form
                setTimeout(() => {
                  if (formikRef.current) {
                    formikRef.current.resetForm({ values: data.values || data });
                  }
                  setShowWelcome(false);
                }, 0);
              } else {
                formikRef.current.resetForm({ values: data.values || data });
                setShowWelcome(false);
              }
            } else {
              console.error('Failed to load file:', result.error);
              isLoadingFileRef.current = false;
            }
          }
        }}
      />
      <Box 
        sx={{ 
          minHeight: '100vh',
          width: '100%',
          background: '#f7f3e3',
          pt: 4,
          pb: 4,
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: 4,
              fontFamily: "'EB Garamond', serif",
              maxWidth: '1200px',
              mx: 'auto'
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                color: selectedSetting.themeOverrides?.primary || '#2d2d2d',
                fontFamily: `'${selectedSetting.headerFont}', serif`,
                letterSpacing: '0.05em',
                fontSize: '3.5rem',
                textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
                mb: 1
              }}
            >
              Call of Cthulhu
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#6b5b2b',
                fontFamily: "'EB Garamond', serif",
                fontStyle: 'italic',
                letterSpacing: '0.05em',
                textTransform: 'none'
              }}
            >
              {selectedSetting.name}
            </Typography>
          </Box>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 4 }, 
              background: '#fffbe8',
              border: '1.5px solid #bfa46d',
              boxShadow: '0 4px 12px rgba(191, 164, 109, 0.15)'
            }}
          >
            <Formik
              innerRef={formikRef}
              initialValues={getInitialValues(selectedSetting)}
              validationSchema={createValidationSchema(selectedSetting.id)}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={false}
            >
              <Form>
                <TitleUpdater eraName={selectedSetting.name} />
                <Box sx={{ display: 'grid', gap: 5 }}>
                  <CharacterBasicInfo setting={selectedSetting} />
                  <CharacterCharacteristics setting={selectedSetting} />
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  }>
                    <CharacterSkills setting={selectedSetting} />
                    <CharacterCombat setting={selectedSetting} />
                    <CharacterBackstory />
                    <CharacterInventory />
                  </Suspense>
                </Box>
              </Form>
            </Formik>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

// Small helper component to update the Electron window title based on era and investigator name
function TitleUpdater({ eraName }: { eraName: string }) {
  const { values } = useFormikContext<any>();
  useEffect(() => {
    const api = (window as any).api;
    if (!api || typeof api.setTitle !== 'function') return;
    const name = values?.name || '';
    const title = `Call of Cthulhu - ${eraName}${name ? ' - ' + name : ''}`;
    api.setTitle(title);
  }, [values?.name, eraName]);
  return null;
}