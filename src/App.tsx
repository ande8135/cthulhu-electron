import { Box, Container, Paper, ThemeProvider, createTheme } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CharacterBasicInfo from './components/CharacterBasicInfo';
import CharacterCharacteristics from './components/CharacterCharacteristics';
import CharacterSkills from './components/CharacterSkills';
import CharacterCombat from './components/CharacterCombat';
import CharacterBackstory from './components/CharacterBackstory';
import CharacterInventory from './components/CharacterInventory';
import { skillsList } from './data/skills';

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
    fontFamily: "'EB Garamond', 'Times New Roman', serif",
    h5: {
      fontWeight: 700,
      letterSpacing: 1,
      color: '#2d2d2d',
      textTransform: 'uppercase',
      borderBottom: '2px solid #bfa46d',
      paddingBottom: 4,
      marginBottom: 12,
    },
    h6: {
      fontWeight: 600,
      color: '#6b5b2b',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    body1: {
      fontSize: 16,
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
        },
      },
    },
  },
});

const validationSchema = Yup.object({
  // We'll add validation rules as we implement each section
});

const initialSkills = Object.fromEntries(
  skillsList.map(skill => [
    skill.name + (skill.specialization ? ` ${skill.specialization}` : ''),
    { base: skill.base, occupation: 0, personal: 0, final: skill.base }
  ])
);

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
  skills: initialSkills,
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
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, background: '#f7f3e3', borderRadius: 4, boxShadow: 3 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, background: '#fffbe8' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Box sx={{ display: 'grid', gap: 5 }}>
                <CharacterBasicInfo />
              <CharacterCharacteristics />
              <CharacterSkills />
              <CharacterCombat />
              <CharacterBackstory />
              <CharacterInventory />
              </Box>
            </Form>
          </Formik>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}