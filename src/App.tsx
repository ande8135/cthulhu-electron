import { Box, Container, Paper, ThemeProvider, createTheme, Typography } from '@mui/material';
import { useRef, useEffect, lazy, Suspense } from 'react';
import { Formik, Form } from 'formik';
import '@fontsource/unifrakturmaguntia';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import CharacterBasicInfo from './components/CharacterBasicInfo';
import CharacterCharacteristics from './components/CharacterCharacteristics';
import { skillsList } from './data/skills';

// Lazy load components that aren't immediately visible
const CharacterSkills = lazy(() => import('./components/CharacterSkills'));
const CharacterCombat = lazy(() => import('./components/CharacterCombat'));
const CharacterBackstory = lazy(() => import('./components/CharacterBackstory'));
const CharacterInventory = lazy(() => import('./components/CharacterInventory'));

// Create theme once outside component
const theme = createTheme({
  palette: {
    primary: {
      main: '#2d2d2d', // dark gray for headers
    },
    secondary: {
      main: '#bfa46d', // parchment gold accent
    },
    background: {
      default: '#f7f3e3', // parchment background
      paper: '#fffbe8',
    },
    text: {
      primary: '#2d2d2d',
      secondary: '#6b5b2b',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h5: {
      fontWeight: 600,
      letterSpacing: 0.5,
      color: '#2d2d2d',
      textTransform: 'uppercase',
      borderBottom: '2px solid #bfa46d',
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

const validationSchema = Yup.object({
  // We'll add validation rules as we implement each section
});

// Memoize initial values
const createInitialSkills = () => {
  const cached = {};
  return () => {
    if (Object.keys(cached).length === 0) {
      Object.assign(cached, Object.fromEntries(
        skillsList.map(skill => [
          skill.name + (skill.specialization ? ` ${skill.specialization}` : ''),
          { base: skill.base, occupation: 0, personal: 0, final: skill.base, checked: false, adjustment: 0 }
        ])
      ));
    }
    return cached;
  };
};

const getInitialSkills = createInitialSkills();

const initialValues = {
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
  skills: getInitialSkills(),
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
};

export default function App() {
  const formikRef = useRef<any>(null);

  useEffect(() => {
    // Expose formikRef to window for main process access
    (window as any).formikRef = formikRef;
    
    // Add a type declaration for window.api
    const api = (window as any).api;
    if (!api) return;

    // Listen for keyboard shortcuts
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's': {
            e.preventDefault();
            const filePath = await api.showSaveDialog();
            if (filePath && formikRef.current) {
              await api.saveFile(filePath, formikRef.current.values);
            }
            break;
          }
          case 'o': {
            e.preventDefault();
            const filePath = await api.showOpenDialog();
            if (filePath) {
              const data = await api.loadFile(filePath);
              if (data && formikRef.current) {
                formikRef.current.resetForm({ values: data });
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

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          minHeight: '100vh',
          width: '100vw',
          background: '#f7f3e3',
          pt: 4,
          pb: 4,
          overflow: 'auto'
        }}
      >
        <Container maxWidth="md">
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: 4,
              fontFamily: "'EB Garamond', serif"
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#2d2d2d',
                fontFamily: "'UnifrakturMaguntia', serif",
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
              1920s
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
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <Box sx={{ display: 'grid', gap: 5 }}>
                  <CharacterBasicInfo />
                  <CharacterCharacteristics />
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  }>
                    <CharacterSkills />
                    <CharacterCombat />
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