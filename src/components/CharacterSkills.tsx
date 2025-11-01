import { 
  Box, 
  Paper, 
  TextField, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useFormikContext } from 'formik';
import { skillsList } from '../data/skills';

interface SkillValue {
  base: number;
  occupation: number;
  personal: number;
  final: number;
}

interface CharacterSkillsValues {
  skills: {
    [key: string]: SkillValue;
  };
}

const SkillField = ({ 
  name,
  base,
  value,
  onChange,
  onBlur 
}: { 
  name: string;
  base: number;
  value: SkillValue;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  const { values } = useFormikContext<any>();
  
  // Calculate base value for special skills
  let calculatedBase = base;
  if (name === "Dodge") {
    calculatedBase = Math.floor(parseInt(values.dex?.current || "0") / 2);
  } else if (name === "Language (Own)") {
    calculatedBase = parseInt(values.edu?.current || "0");
  }

  // Calculate final value
  const finalValue = calculatedBase + (value?.occupation || 0) + (value?.personal || 0);

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'minmax(150px, 2fr) repeat(3, 1fr)', 
      gap: 2, 
      alignItems: 'center',
      padding: '4px 8px',
      '&:hover': {
        backgroundColor: 'rgba(191, 164, 109, 0.1)',
      }
    }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{name}</Typography>
      <TextField
        size="small"
        type="number"
        label="Occupation"
        name={`skills.${name}.occupation`}
        value={value?.occupation || 0}
        onChange={onChange}
        onBlur={onBlur}
        InputProps={{ 
          inputProps: { min: 0 },
          sx: { backgroundColor: '#fff' }
        }}
      />
      <TextField
        size="small"
        type="number"
        label="Personal"
        name={`skills.${name}.personal`}
        value={value?.personal || 0}
        onChange={onChange}
        onBlur={onBlur}
        InputProps={{ 
          inputProps: { min: 0 },
          sx: { backgroundColor: '#fff' }
        }}
      />
      <TextField
        size="small"
        type="number"
        label="Final"
        value={finalValue}
        disabled
        InputProps={{ 
          sx: { 
            backgroundColor: '#f5f5f5',
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000000'
            }
          }
        }}
      />
    </Box>
  );
};

const SkillCategory = ({
  category,
  skills,
  values,
  handleChange,
  handleBlur
}: {
  category: string;
  skills: typeof skillsList;
  values: CharacterSkillsValues['skills'];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{category}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: '#f7f3e3',
          border: '1px solid #bfa46d',
          borderRadius: 2,
          p: 2,
        }}>
          {skills.map((skill) => (
            <SkillField
              key={skill.name + (skill.specialization || '')}
              name={skill.name + (skill.specialization ? ` ${skill.specialization}` : '')}
              base={skill.base}
              value={values[skill.name + (skill.specialization ? ` ${skill.specialization}` : '')] || {
                base: skill.base,
                occupation: 0,
                personal: 0,
                final: skill.base
              }}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default function CharacterSkills() {
  const { values, handleChange, handleBlur } = useFormikContext<CharacterSkillsValues>();

  // Group skills by category
  const skillsByCategory = skillsList.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as { [key: string]: typeof skillsList });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Skills
      </Typography>
      <Paper elevation={1} sx={{ p: 2 }}>
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <SkillCategory
            key={category}
            category={category}
            skills={skills}
            values={values.skills || {}}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
        ))}
      </Paper>
    </Box>
  );
}