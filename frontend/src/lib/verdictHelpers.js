// Helper utilities for translating water safety verdicts and parameters into consumer-friendly labels and styles

export const VERDICT_CONFIG = {
  'Safe': {
    label: 'Safe to Drink',
    subtitle: 'This water sample meets public health standards for daily consumption.',
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    gaugeColor: '#10B981',
    iconName: 'CheckCircle2',
    severityLevel: 'low',
    summaryText: 'Water quality parameters fall within recommended safe ranges.'
  },
  'Marginal': {
    label: 'Requires Caution',
    subtitle: 'Minor variations detected. Safe for utility use, but boiling is recommended before drinking.',
    color: 'amber',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    gaugeColor: '#F59E0B',
    iconName: 'AlertTriangle',
    severityLevel: 'moderate',
    summaryText: 'Certain readings are near or slightly beyond optimal guidelines.'
  },
  'Unsafe': {
    label: 'Unsafe for Drinking',
    subtitle: 'Significant contamination detected. Do not consume without proper treatment or filtration.',
    color: 'orange',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    gaugeColor: '#F97316',
    iconName: 'ShieldAlert',
    severityLevel: 'high',
    summaryText: 'Multiple water factors violate recommended safety thresholds.'
  },
  'Critically Unsafe': {
    label: 'Urgent: High Health Risk',
    subtitle: 'Critical safety violations found. Do not drink, cook, or wash with this water sample.',
    color: 'rose',
    bgLight: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    gaugeColor: '#EF4444',
    iconName: 'AlertOctagon',
    severityLevel: 'critical',
    summaryText: 'Severe health hazards identified. Immediate action required.'
  }
};

export const PARAMETER_META = {
  ph: {
    label: 'Acid-Base Balance (pH)',
    unit: '',
    standardRange: '6.5 - 8.5',
    description: 'Measures how acidic or alkaline your water is. Extremely low or high pH can cause pipe corrosion or chemical taste.',
    category: 'Basic Indicators'
  },
  hardness: {
    label: 'Mineral Hardness',
    unit: 'mg/L',
    standardRange: '< 300',
    description: 'Amount of dissolved calcium and magnesium. High hardness causes mineral buildup in pipes and appliances.',
    category: 'Physical Properties'
  },
  solids: {
    label: 'Dissolved Minerals & Solids (TDS)',
    unit: 'ppm',
    standardRange: '< 500',
    description: 'Total amount of organic and inorganic substances in the water. High levels affect taste and clarity.',
    category: 'Physical Properties'
  },
  chloramines: {
    label: 'Disinfectant Level (Chloramines)',
    unit: 'ppm',
    standardRange: '< 4.0',
    description: 'Disinfectant used to treat water supplies. Proper levels keep water free from micro-organisms.',
    category: 'Chemical Balance'
  },
  sulfate: {
    label: 'Sulfate Content',
    unit: 'mg/L',
    standardRange: '< 250',
    description: 'Naturally occurring compound. Excessive sulfate can give water a bitter taste and cause digestive discomfort.',
    category: 'Chemical Balance'
  },
  conductivity: {
    label: 'Electrical Conductivity',
    unit: 'µS/cm',
    standardRange: '< 400',
    description: 'Measures water’s ability to conduct electricity, indicating total dissolved salt content.',
    category: 'Physical Properties'
  },
  organic_carbon: {
    label: 'Organic Carbon',
    unit: 'mg/L',
    standardRange: '< 2.0',
    description: 'Indicates presence of decaying organic matter or microbial activity in the water source.',
    category: 'Physical Properties'
  },
  trihalomethanes: {
    label: 'Treatment Byproducts (THMs)',
    unit: 'µg/L',
    standardRange: '< 80',
    description: 'Compounds formed when chlorine reacts with organic matter. High long-term exposure should be avoided.',
    category: 'Chemical Balance'
  },
  turbidity: {
    label: 'Water Clarity (Turbidity)',
    unit: 'NTU',
    standardRange: '< 1.0',
    description: 'Measures cloudiness caused by microscopic particles. High turbidity can shelter bacteria.',
    category: 'Basic Indicators'
  }
};

export function getVerdictConfig(verdict) {
  return VERDICT_CONFIG[verdict] || VERDICT_CONFIG['Safe'];
}

export function formatRiskScore(score) {
  if (score === undefined || score === null) return 0;
  return Math.round(Number(score));
}

export function getRiskSeverityBadge(severity) {
  switch (String(severity).toLowerCase()) {
    case 'critical':
      return { label: 'High Priority Risk', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'high':
      return { label: 'Elevated Risk', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'moderate':
    case 'medium':
      return { label: 'Moderate Caution', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    default:
      return { label: 'Low Risk', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
}
