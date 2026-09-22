import React from 'react';
import { AlertTriangle, ShieldCheck, Activity, MapPin } from 'lucide-react';

export function AberrationIndicator({ outbreakStatus }) {
  if (!outbreakStatus) return null;

  const {
    location = 'Target Area',
    isAberration = false,
    aberrationScore = 0,
    currentCases = 0,
    baselineCases = 0,
    riskLevel = 'Normal',
    waterVerdictCorrelation
  } = outbreakStatus;

  const getStatusColor = () => {
    if (isAberration || riskLevel.toLowerCase() === 'high') {
      return {
        bg: 'bg-rose-50 border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        text: 'text-rose-900',
        icon: AlertTriangle,
        iconColor: 'text-rose-600',
        title: 'Elevated Community Outbreak Alert'
      };
    }
    if (riskLevel.toLowerCase() === 'moderate' || riskLevel.toLowerCase() === 'caution') {
      return {
        bg: 'bg-amber-50 border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        text: 'text-amber-900',
        icon: Activity,
        iconColor: 'text-amber-600',
        title: 'Moderate Symptom Activity'
      };
    }
    return {
      bg: 'bg-emerald-50 border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      text: 'text-emerald-900',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      title: 'Normal Health Baseline'
    };
  };

  const status = getStatusColor();
  const Icon = status.icon;

  return (
    <div className={`rounded-3xl border p-6 ${status.bg} transition-all duration-300 shadow-sm space-y-4`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
            <Icon className={`w-6 h-6 ${status.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.badge}`}>
                {status.title}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
            </div>
            <h4 className={`text-lg font-bold font-heading ${status.text}`}>
              {isAberration ? 'Community Disease Cases Exceed Expected Limits' : 'Reported Symptoms Match Expected Baseline'}
            </h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reported Cases</p>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{currentCases}</p>
        </div>

        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historical Baseline</p>
          <p className="text-xl font-extrabold text-slate-600 mt-0.5">{baselineCases}</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white/80 p-3.5 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surveillance Signal</p>
          <p className={`text-sm font-bold mt-1 ${isAberration ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isAberration ? 'Statistically Significant Spike' : 'Stable Health Trend'}
          </p>
        </div>
      </div>

      {/* Combined Risk Warning if water quality is also poor */}
      {isAberration && waterVerdictCorrelation && waterVerdictCorrelation !== 'Safe' && (
        <div className="bg-rose-600 text-white p-4 rounded-2xl shadow-md flex items-start gap-3 mt-2">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold">Combined Risk Warning</p>
            <p className="text-rose-100 mt-0.5 leading-relaxed">
              Both community symptom reports and water safety tests indicate active contamination in {location}. Immediate water sanitization intervention is advised.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AberrationIndicator;
