import {
  Box,
  Paper,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  Stack,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useFormikContext } from 'formik';
import { useState, memo, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { skillsList } from '../data/skills';
type SkillDef = { name: string; base: number; category: string; specialization?: string; eraSpecific?: boolean };

interface SkillValue {
  base: number;
  occupation: number;
  personal: number;
  final: number;
  checked?: boolean;
  adjustment?: number;
}

interface CharacterSkillsValues {
  skills: {
    [key: string]: SkillValue;
  };
}

const PlayModeSkillField = memo(({
  name,
  base,
  value,
  onCheckedChange
}: {
  name: string;
  base: number;
  value: SkillValue;
  onCheckedChange: (checked: boolean) => void;
}) => {
  const { values } = useFormikContext<any>();

  // Calculate base value for special skills
  let calculatedBase = base;
  if (name === 'Dodge') {
    calculatedBase = Math.floor(parseInt(values.dex?.current || '0') / 2);
  } else if (name === 'Language (Own)' || name === 'Own Language') {
    calculatedBase = parseInt(values.edu?.current || '0');
  }

  // Calculate final value including all modifiers
  const finalValue = calculatedBase + (value?.occupation || 0) + (value?.personal || 0) + (value?.adjustment || 0);
  const halfValue = Math.floor(finalValue / 2);
  const fifthValue = Math.floor(finalValue / 5);

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '40px minmax(200px, 1fr) repeat(3, 100px)',
      gap: 3,
      alignItems: 'center',
      padding: '4px 8px',
      '&:hover': {
        backgroundColor: 'rgba(191, 164, 109, 0.1)',
      }
    }}>
      <Checkbox 
        checked={!!value?.checked} 
        onChange={e => onCheckedChange(e.target.checked)}
        size="small"
        sx={{
          color: '#bfa46d',
          '&.Mui-checked': {
            color: '#bfa46d',
          }
        }}
      />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{name}</Typography>
      <Typography 
        variant="body2" 
        align="center"
        sx={{ 
          backgroundColor: '#f5f5f5',
          padding: '6px',
          borderRadius: 1,
          fontWeight: 500
        }}
      >
        {finalValue}
      </Typography>
      <Typography 
        variant="body2" 
        align="center"
        sx={{ 
          backgroundColor: '#f5f5f5',
          padding: '6px',
          borderRadius: 1,
        }}
      >
        {halfValue}
      </Typography>
      <Typography 
        variant="body2" 
        align="center"
        sx={{ 
          backgroundColor: '#f5f5f5',
          padding: '6px',
          borderRadius: 1,
        }}
      >
        {fifthValue}
      </Typography>
    </Box>
  );
});

const SkillField = memo(({
  name,
  base,
  value,
  onOccupationChange,
  onPersonalChange,
  onCheckedChange,
  onAdjustmentChange
}: {
  name: string;
  base: number;
  value: SkillValue;
  onOccupationChange: (val: number) => void;
  onPersonalChange: (val: number) => void;
  onCheckedChange: (checked: boolean) => void;
  onAdjustmentChange: (val: number) => void;
}) => {
  const { values } = useFormikContext<any>();

  // Calculate base value for special skills
  let calculatedBase = base;
  if (name === 'Dodge') {
    calculatedBase = Math.floor(parseInt(values.dex?.current || '0') / 2);
  } else if (name === 'Language (Own)' || name === 'Own Language') {
    calculatedBase = parseInt(values.edu?.current || '0');
  }

  // Calculate final value (pre-adjustment) and then include manual adjustment
  const preAdjustment = calculatedBase + (value?.occupation || 0) + (value?.personal || 0);
  const finalValue = preAdjustment + (value?.adjustment || 0);

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '40px minmax(200px, 1fr) 120px 120px 180px',
      gap: 3,
      alignItems: 'center',
      padding: '4px 8px',
      '&:hover': {
        backgroundColor: 'rgba(191, 164, 109, 0.1)',
      }
    }}>
      <Checkbox 
        checked={!!value?.checked} 
        onChange={e => onCheckedChange(e.target.checked)}
        size="small"
      />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{name}</Typography>
      <TextField
        size="small"
        type="number"
        label="Occ"
        value={value?.occupation || 0}
        onChange={e => onOccupationChange(parseInt(e.target.value || '0'))}
        InputProps={{
          inputProps: { min: 0 },
          sx: { backgroundColor: '#fff' }
        }}
      />
      <TextField
        size="small"
        type="number"
        label="Per"
        value={value?.personal || 0}
        onChange={e => onPersonalChange(parseInt(e.target.value || '0'))}
        InputProps={{
          inputProps: { min: 0 },
          sx: { backgroundColor: '#fff' }
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TextField
          size="small"
          type="number"
          label="Total"
          value={finalValue}
          disabled
          sx={{ width: '80px' }}
          InputProps={{
            sx: {
              backgroundColor: '#f5f5f5',
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000000'
              }
            }
          }}
        />
        <IconButton 
          size="small" 
          onClick={() => onAdjustmentChange((value?.adjustment || 0) - 1)}
          sx={{ padding: '2px' }}
        >
          <Typography variant="caption">−</Typography>
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => onAdjustmentChange((value?.adjustment || 0) + 1)}
          sx={{ padding: '2px' }}
        >
          <Typography variant="caption">+</Typography>
        </IconButton>
        {(value?.adjustment || 0) !== 0 && (
          <Typography 
            variant="caption" 
            sx={{ 
              ml: 0.5,
              color: (value?.adjustment || 0) > 0 ? 'success.main' : 'error.main'
            }}
          >
            ({(value?.adjustment || 0) > 0 ? '+' : ''}{value?.adjustment || 0})
          </Typography>
        )}
      </Box>
    </Box>
  );
});



export default function CharacterSkills() {
  const { values, setFieldValue } = useFormikContext<CharacterSkillsValues & any>();

  // Group skills by category
  const skillsByCategory = skillsList.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as { [key: string]: typeof skillsList });

  // Include dynamically added language skills (custom languages) into the Languages category
  const renderSkillsByCategory = (() => {
    const cloned: { [key: string]: SkillDef[] } = Object.keys(skillsByCategory).reduce((acc, key) => {
      acc[key] = [...(skillsByCategory as any)[key]] as SkillDef[];
      return acc;
    }, {} as { [key: string]: SkillDef[] });

    const baseLangList: SkillDef[] = (cloned['Languages'] || []) as SkillDef[];
    const baseLangKeys = new Set(
      baseLangList.map(s => s.name + (s.specialization ? ` ${s.specialization}` : ''))
    );

    const dynamicLangs: SkillDef[] = [];
    const langKeyRegex = /^(?:Language \(Other\)|Other Language)\s*\((.+)\)$/;
    Object.keys(values.skills || {}).forEach((key) => {
      if (baseLangKeys.has(key)) return;
      const match = key.match(langKeyRegex);
      if (match) {
        const isOtherLanguage = key.startsWith('Other Language');
        const specialization = `(${match[1]})`;
        dynamicLangs.push({
          name: isOtherLanguage ? 'Other Language' : 'Language (Other)',
          base: 1,
          category: 'Languages',
          specialization
        } as SkillDef);
      }
    });

    if (!cloned['Languages']) cloned['Languages'] = [] as SkillDef[];
    cloned['Languages'] = ([...(cloned['Languages'] as SkillDef[]), ...dynamicLangs]);
    return cloned as { [key: string]: SkillDef[] };
  })();

  // Calculate pools according to CoC7 rules (assumed defaults):
  // Occupational Points = EDU * 4
  // Personal Interest Points = INT * 2
  // NOTE: These are common/default values; if you want different formulas we can make them configurable.
  const edu = parseInt(values.edu?.current || '0') || 0;
  const intVal = parseInt(values.int?.current || '0') || 0;
  const occupationalPoints = edu * 4;
  const personalPoints = intVal * 2;

  const bonusPoints = parseInt(values.bonusSkillPoints || 0) || 0;

  // Totals spent
  const totalOccupationSpent = Object.values(values.skills || {}).reduce((acc: number, s: any) => acc + (parseInt(s?.occupation || 0) || 0), 0);
  const totalPersonalSpent = Object.values(values.skills || {}).reduce((acc: number, s: any) => acc + (parseInt(s?.personal || 0) || 0), 0);

  const overOccupation = Math.max(0, totalOccupationSpent - occupationalPoints);
  const overPersonal = Math.max(0, totalPersonalSpent - personalPoints);
  const totalOver = overOccupation + overPersonal;
  const remainingBonus = Math.max(0, bonusPoints - totalOver);

  // Helper to clamp requested changes so we never exceed available pools + bonus
  const handleOccupationChange = useCallback((skillKey: string, newVal: number) => {
    const currentOcc = parseInt(values.skills?.[skillKey]?.occupation || 0) || 0;
    const delta = newVal - currentOcc;

    const newTotalOcc = totalOccupationSpent + delta;
    const newOverOcc = Math.max(0, newTotalOcc - occupationalPoints);
    const newTotalOver = newOverOcc + overPersonal;

    // enforce per-skill creation cap: base + occupation + personal <= 80
    const currentPersonal = parseInt(values.skills?.[skillKey]?.personal || 0) || 0;
    // compute effective base (handle special skills)
    const computeBase = () => {
      const rawBase = parseInt(values.skills?.[skillKey]?.base || 0) || 0;
      if (skillKey === 'Dodge') {
        return Math.floor((parseInt(values.dex?.current || '0') || 0) / 2);
      }
      if (skillKey.includes('Language (Own)') || skillKey.includes('Own Language')) {
        return parseInt(values.edu?.current || '0') || rawBase;
      }
      return rawBase;
    };

    const effBase = computeBase();
    const maxOccByCap = Math.max(0, 80 - effBase - currentPersonal);

    // Now compute pool-based allowed value
    if (newTotalOver <= bonusPoints) {
      // allowed by pools, but still need to respect per-skill cap
      const allowedVal = Math.min(newVal, maxOccByCap);
      const finalVal = Math.max(0, Math.floor(allowedVal));
      setFieldValue(`skills.${skillKey}.occupation`, finalVal);
      if (allowedVal < newVal) {
        setClampMessage(`${skillKey} occupation limited to ${finalVal} due to the 80-point creation cap.`);
        setSnackOpen(true);
      }
    } else {
      // clamp to maximum allowed by pools and cap
      const allowedOver = Math.max(0, bonusPoints - overPersonal);
      const allowedTotalOcc = occupationalPoints + allowedOver;
      const allowedNewValPool = Math.max(0, Math.min(newVal, allowedTotalOcc - (totalOccupationSpent - currentOcc)));
      const allowedNewVal = Math.min(allowedNewValPool, maxOccByCap);
      const finalVal = Math.max(0, Math.floor(allowedNewVal));
      setFieldValue(`skills.${skillKey}.occupation`, finalVal);
      setClampMessage(`${skillKey} occupation limited to ${finalVal} because of point pools, bonus points, or the 80-point cap.`);
      setSnackOpen(true);
    }
  }, [values.skills, values.dex?.current, values.edu?.current, totalOccupationSpent, totalPersonalSpent, occupationalPoints, personalPoints, bonusPoints, overOccupation, overPersonal, setFieldValue]);

  const handlePersonalChange = useCallback((skillKey: string, newVal: number) => {
    const currentPer = parseInt(values.skills?.[skillKey]?.personal || 0) || 0;
    const delta = newVal - currentPer;

    const newTotalPer = totalPersonalSpent + delta;
    const newOverPer = Math.max(0, newTotalPer - personalPoints);
    const newTotalOver = overOccupation + newOverPer;

    // enforce per-skill creation cap: base + occupation + personal <= 80
    const currentOccupation = parseInt(values.skills?.[skillKey]?.occupation || 0) || 0;
    const computeBase = () => {
      const rawBase = parseInt(values.skills?.[skillKey]?.base || 0) || 0;
      if (skillKey === 'Dodge') {
        return Math.floor((parseInt(values.dex?.current || '0') || 0) / 2);
      }
      if (skillKey.includes('Language (Own)') || skillKey.includes('Own Language')) {
        return parseInt(values.edu?.current || '0') || rawBase;
      }
      return rawBase;
    };
    const effBase = computeBase();
    const maxPerByCap = Math.max(0, 80 - effBase - currentOccupation);

    if (newTotalOver <= bonusPoints) {
      const allowedVal = Math.min(newVal, maxPerByCap);
      const finalVal = Math.max(0, Math.floor(allowedVal));
      setFieldValue(`skills.${skillKey}.personal`, finalVal);
      if (allowedVal < newVal) {
        setClampMessage(`${skillKey} personal limited to ${finalVal} due to the 80-point creation cap.`);
        setSnackOpen(true);
      }
    } else {
      const allowedOver = Math.max(0, bonusPoints - overOccupation);
      const allowedTotalPer = personalPoints + allowedOver;
      const allowedNewValPool = Math.max(0, Math.min(newVal, allowedTotalPer - (totalPersonalSpent - currentPer)));
      const allowedNewVal = Math.min(allowedNewValPool, maxPerByCap);
      const finalVal = Math.max(0, Math.floor(allowedNewVal));
      setFieldValue(`skills.${skillKey}.personal`, finalVal);
      setClampMessage(`${skillKey} personal limited to ${finalVal} because of point pools, bonus points, or the 80-point cap.`);
      setSnackOpen(true);
    }
  }, [values.skills, values.dex?.current, values.edu?.current, totalOccupationSpent, totalPersonalSpent, occupationalPoints, personalPoints, bonusPoints, overOccupation, overPersonal, setFieldValue]);

  // Snackbar state for validation messages
  const [clampMessage, setClampMessage] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  // Check if there are points remaining to spend
  const hasPointsRemaining = 
    (occupationalPoints - totalOccupationSpent) > 0 || 
    (personalPoints - totalPersonalSpent) > 0 || 
    remainingBonus > 0;

  const [viewMode, setViewMode] = useState<'create' | 'play'>(() => 
    hasPointsRemaining ? 'create' : 'play'
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedSections(new Set());
    } else {
      setExpandedSections(new Set(Object.keys(skillsByCategory)));
    }
    setExpandAll(!expandAll);
  };

  return (
    <>
      <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Skills</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={toggleExpandAll}
            sx={{ textTransform: 'none' }}
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </Button>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newValue) => newValue && setViewMode(newValue)}
            size="small"
          >
            <ToggleButton value="create" sx={{ px: 2 }}>
              Create
            </ToggleButton>
            <ToggleButton value="play" sx={{ px: 2 }}>
              Play
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      {viewMode === 'create' && (
        <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="primary.main">Occupation Points</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={`Total: ${occupationalPoints}`} color="primary" />
                <Chip label={`Spent: ${totalOccupationSpent}`} variant="outlined" />
                <Chip label={`Remaining: ${Math.max(0, occupationalPoints - totalOccupationSpent)}`} />
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="secondary.main">Personal Points</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={`Total: ${personalPoints}`} color="secondary" />
                <Chip label={`Spent: ${totalPersonalSpent}`} variant="outlined" />
                <Chip label={`Remaining: ${Math.max(0, personalPoints - totalPersonalSpent)}`} />
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Bonus Points</Typography>
              <TextField
                label="Available"
                type="number"
                size="small"
                value={bonusPoints}
                onChange={e => setFieldValue('bonusSkillPoints', Math.max(0, parseInt(e.target.value || '0') || 0))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">pts</InputAdornment>
                }}
                sx={{ width: '140px' }}
              />
            </Stack>
            <Stack spacing={1} sx={{ height: '100%', justifyContent: 'flex-end' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={`Used: ${totalOver}`} variant="outlined" />
                <Chip 
                  label={`Remaining: ${remainingBonus}`} 
                  color={remainingBonus > 0 ? 'default' : 'error'}
                  sx={{ minWidth: '120px' }}
                />
              </Stack>
            </Stack>
          </Box>
        </Paper>
      )}

      {viewMode === 'play' && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="subtitle1" color="text.secondary" align="center">
            Full • Half • Fifth
          </Typography>
        </Box>
      )}

      <Paper elevation={1} sx={{ p: 2 }}>
        {Object.entries(renderSkillsByCategory).map(([category, skills]) => (
            <Accordion 
              key={category}
              expanded={expandedSections.has(category)}
              onChange={(_, isExpanded) => {
                const newExpanded = new Set(expandedSections);
                if (isExpanded) {
                  newExpanded.add(category);
                } else {
                  newExpanded.delete(category);
                }
                setExpandedSections(newExpanded);
                // Update expandAll state based on whether all are expanded
                setExpandAll(newExpanded.size === Object.keys(renderSkillsByCategory).length);
              }}
            >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{
                '&.Mui-expanded': {
                  minHeight: 48,
                  margin: '12px 0',
                }
              }}
            >
              <Typography variant="h6">{category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {category === 'Languages' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      const baseList = (renderSkillsByCategory['Languages'] || []) as SkillDef[];
                      const usesOtherLanguage = baseList.some(s => s.name === 'Other Language');
                      const promptName = window.prompt('Add language (e.g., French)');
                      if (!promptName) return;
                      const clean = String(promptName).trim();
                      if (!clean) return;
                      const key = usesOtherLanguage ? `Other Language (${clean})` : `Language (Other) (${clean})`;
                      if (values.skills?.[key]) {
                        setClampMessage(`${key} already exists.`);
                        setSnackOpen(true);
                        return;
                      }
                      setFieldValue(`skills.${key}` as any, {
                        base: 1,
                        occupation: 0,
                        personal: 0,
                        final: 1,
                        checked: false,
                        adjustment: 0
                      });
                      // Expand Languages section if not already
                      const newExpanded = new Set(expandedSections);
                      newExpanded.add('Languages');
                      setExpandedSections(newExpanded);
                    }}
                  >
                    Add Language
                  </Button>
                </Box>
              )}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                background: '#f7f3e3',
                border: '1px solid #bfa46d',
                borderRadius: 2,
                p: 2,
              }}>
                {skills.map((skill) => {
                  const key = skill.name + (skill.specialization ? ` ${skill.specialization}` : '');
                  const skillValue = values.skills?.[key] || { 
                    base: skill.base, 
                    occupation: 0, 
                    personal: 0, 
                    final: skill.base, 
                    checked: false, 
                    adjustment: 0 
                  };

                  return viewMode === 'create' ? (
                    <SkillField
                      key={key}
                      name={key}
                      base={skill.base}
                      value={skillValue}
                      onOccupationChange={(v) => handleOccupationChange(key, v)}
                      onPersonalChange={(v) => handlePersonalChange(key, v)}
                      onCheckedChange={(checked: boolean) => setFieldValue(`skills.${key}.checked`, checked)}
                      onAdjustmentChange={(adj: number) => setFieldValue(`skills.${key}.adjustment`, adj)}
                    />
                  ) : (
                    <PlayModeSkillField
                      key={key}
                      name={key}
                      base={skill.base}
                      value={skillValue}
                      onCheckedChange={(checked: boolean) => setFieldValue(`skills.${key}.checked`, checked)}
                    />
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
      </Box>
      <Snackbar open={snackOpen} autoHideDuration={5000} onClose={() => setSnackOpen(false)}>
        <Alert severity="warning" onClose={() => setSnackOpen(false)} sx={{ width: '100%' }}>
          {clampMessage}
        </Alert>
      </Snackbar>
    </>
  );
}