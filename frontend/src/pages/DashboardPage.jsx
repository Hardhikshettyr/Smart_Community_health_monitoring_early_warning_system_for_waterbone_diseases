import React, { useState, useRef } from 'react';
import { waterCheckService } from '../services/waterCheckService';
import { reportService } from '../services/reportService';
import { PARAMETER_META } from '../lib/verdictHelpers';
import { Sliders, Droplets, MapPin, Globe, Sparkles, RefreshCw, AlertCircle, Play } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageWrapper from '../components/layout/PageWrapper';
import VerdictBanner from '../components/results/VerdictBanner';
import RiskGauge from '../components/results/RiskGauge';
import ViolationCards from '../components/results/ViolationCards';
import DiseaseRiskList from '../components/results/DiseaseRiskList';
import ConfidenceIndicator from '../components/results/ConfidenceIndicator';
import FeatureContributionChart from '../components/results/FeatureContributionChart';
import RecommendationList from '../components/results/RecommendationList';

const PRESETS = {
  clean: {
    ph: 7.2,
    hardness: 140,
    solids: 220,
    chloramines: 2.1,
    sulfate: 180,
    conductivity: 320,
    organic_carbon: 1.1,
    trihalomethanes: 35,
    turbidity: 0.4,
    location: 'Central Household Tap'
  },
  marginal: {
    ph: 6.2,
    hardness: 280,
    solids: 480,
    chloramines: 3.8,
    sulfate: 240,
    conductivity: 390,
    organic_carbon: 2.1,
    trihalomethanes: 75,
    turbidity: 1.8,
    location: 'Community Well #4'
  },
  unsafe: {
    ph: 5.1,
    hardness: 380,
    solids: 650,
    chloramines: 5.2,
    sulfate: 340,
    conductivity: 510,
    organic_carbon: 3.8,
    trihalomethanes: 98,
    turbidity: 4.5,
    location: 'Unfiltered Surface Stream'
  }
};

export function DashboardPage() {
  const resultsRef = useRef(null);

  const [formData, setFormData] = useState({
    ph: '7.2',
    hardness: '150',
    solids: '300',
    chloramines: '2.5',
    sulfate: '180',
    conductivity: '350',
    organic_carbon: '1.2',
    trihalomethanes: '45',
    turbidity: '0.5',
    regionProfile: 'standard',
    location: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        ph: String(preset.ph),
        hardness: String(preset.hardness),
        solids: String(preset.solids),
        chloramines: String(preset.chloramines),
        sulfate: String(preset.sulfate),
        conductivity: String(preset.conductivity),
        organic_carbon: String(preset.organic_carbon),
        trihalomethanes: String(preset.trihalomethanes),
        turbidity: String(preset.turbidity),
        location: preset.location
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await waterCheckService.analyzeSample(formData);
      setResult(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Water safety analysis failed. Please check parameter inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result || !result.predictionId) {
      setError('No analysis result is available to export yet.');
      return;
    }
    setIsDownloading(true);
    try {
      await reportService.downloadPdfReport(result.predictionId, `Water_Safety_Report_${result.predictionId.slice(0,6)}.pdf`);
    } catch (err) {
      setError(err.message || 'Failed to download the report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWrapper className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
          <Droplets className="w-3.5 h-3.5 text-sky-600" />
          <span>Interactive Water Safety Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
          Analyze Water Sample Safety
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Enter physical and chemical readings from your water test kit to evaluate compliance with public health standards.
        </p>
      </div>

      {/* Preset Quick Fill Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Quick Sample Presets:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => applyPreset('clean')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            Clean Tap Sample
          </button>
          <button
            type="button"
            onClick={() => applyPreset('marginal')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            Community Well Sample
          </button>
          <button
            type="button"
            onClick={() => applyPreset('unsafe')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
          >
            Unfiltered Surface Stream
          </button>
        </div>
      </div>

      {/* Main Analysis Form */}
      <Card className="p-6 sm:p-8">
        {error && <Alert type="danger" message={error} onClose={() => setError(null)} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Indicators */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-sky-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-600" />
                1. Basic Quality Indicators
              </h3>
              <span className="text-xs text-slate-400">Essential field test readings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label={PARAMETER_META.ph.label}
                name="ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.ph}
                onChange={handleChange}
                tooltip={PARAMETER_META.ph.description}
                helperText={`Standard limit: ${PARAMETER_META.ph.standardRange}`}
                required
              />

              <Input
                label={PARAMETER_META.turbidity.label}
                name="turbidity"
                type="number"
                step="0.01"
                min="0"
                value={formData.turbidity}
                onChange={handleChange}
                tooltip={PARAMETER_META.turbidity.description}
                helperText={`Standard limit: ${PARAMETER_META.turbidity.standardRange} NTU`}
                required
              />
            </div>
          </div>

          {/* Section 2: Chemical Balance */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-sky-800">
                2. Disinfectant & Chemical Balance
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label={PARAMETER_META.chloramines.label}
                name="chloramines"
                type="number"
                step="0.01"
                min="0"
                value={formData.chloramines}
                onChange={handleChange}
                tooltip={PARAMETER_META.chloramines.description}
                helperText={`Limit: ${PARAMETER_META.chloramines.standardRange} ppm`}
                required
              />

              <Input
                label={PARAMETER_META.sulfate.label}
                name="sulfate"
                type="number"
                step="1"
                min="0"
                value={formData.sulfate}
                onChange={handleChange}
                tooltip={PARAMETER_META.sulfate.description}
                helperText={`Limit: ${PARAMETER_META.sulfate.standardRange} mg/L`}
                required
              />

              <Input
                label={PARAMETER_META.trihalomethanes.label}
                name="trihalomethanes"
                type="number"
                step="0.1"
                min="0"
                value={formData.trihalomethanes}
                onChange={handleChange}
                tooltip={PARAMETER_META.trihalomethanes.description}
                helperText={`Limit: ${PARAMETER_META.trihalomethanes.standardRange} µg/L`}
                required
              />
            </div>
          </div>

          {/* Section 3: Physical Properties */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-sky-800">
                3. Physical & Mineral Properties
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input
                label={PARAMETER_META.hardness.label}
                name="hardness"
                type="number"
                step="1"
                min="0"
                value={formData.hardness}
                onChange={handleChange}
                tooltip={PARAMETER_META.hardness.description}
                helperText={`Limit: ${PARAMETER_META.hardness.standardRange} mg/L`}
                required
              />

              <Input
                label={PARAMETER_META.solids.label}
                name="solids"
                type="number"
                step="1"
                min="0"
                value={formData.solids}
                onChange={handleChange}
                tooltip={PARAMETER_META.solids.description}
                helperText={`Limit: ${PARAMETER_META.solids.standardRange} ppm`}
                required
              />

              <Input
                label={PARAMETER_META.conductivity.label}
                name="conductivity"
                type="number"
                step="1"
                min="0"
                value={formData.conductivity}
                onChange={handleChange}
                tooltip={PARAMETER_META.conductivity.description}
                helperText={`Limit: ${PARAMETER_META.conductivity.standardRange} µS/cm`}
                required
              />

              <Input
                label={PARAMETER_META.organic_carbon.label}
                name="organic_carbon"
                type="number"
                step="0.01"
                min="0"
                value={formData.organic_carbon}
                onChange={handleChange}
                tooltip={PARAMETER_META.organic_carbon.description}
                helperText={`Limit: ${PARAMETER_META.organic_carbon.standardRange} mg/L`}
                required
              />
            </div>
          </div>

          {/* Section 4: Context & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Evaluation Guideline Profile
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, regionProfile: 'standard' }))}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    formData.regionProfile === 'standard'
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4 text-sky-600" />
                  Standard Limits
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, regionProfile: 'rural' }))}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    formData.regionProfile === 'rural'
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-sky-600" />
                  Remote / Rural Limits
                </button>
              </div>
            </div>

            <Input
              label="Sample Location / Identifier (Optional)"
              name="location"
              placeholder="e.g. Household Tap #2, Village Well B"
              icon={MapPin}
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="xl"
              isLoading={isLoading}
              icon={Play}
              className="w-full sm:w-auto px-12"
            >
              Analyze Water Sample
            </Button>
          </div>
        </form>
      </Card>

      {/* Loading Overlay State */}
      {isLoading && (
        <div className="py-16">
          <LoadingSpinner size="lg" label="Processing physical & chemical safety factors..." />
        </div>
      )}

      {/* Results Section */}
      {result && !isLoading && (
        <div ref={resultsRef} className="space-y-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold font-heading text-slate-900">
              Analysis Results Summary
            </h2>
            <Button variant="ghost" size="sm" icon={RefreshCw} onClick={resetForm}>
              Check Another Sample
            </Button>
          </div>

          {/* 1. Verdict Banner */}
          <VerdictBanner
            verdict={result.verdict}
            riskScore={result.riskScore}
            location={formData.location}
            regionProfile={formData.regionProfile}
            onDownloadReport={handleDownloadPdf}
            isDownloading={isDownloading}
          />

          {/* 2. Top Stats Grid (Gauge + Confidence) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <RiskGauge riskScore={result.riskScore} verdict={result.verdict} />
            </div>

            <div className="md:col-span-2 space-y-6">
              <ConfidenceIndicator
                confidenceScore={0.5 + Math.min(result.confidence?.distanceFromBoundary ?? 0.41, 0.5)}
                isBorderline={result.confidence?.isBorderline ?? false}
              />

              <ViolationCards
                violations={(result.violations || []).map((v) => ({
                  ...v,
                  explanation: `Recorded value is ${v.direction} the safe range (${v.min}-${v.max}).`
                }))}
                parameters={formData}
              />
            </div>
          </div>

          {/* 3. Disease Risks & Feature Contribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DiseaseRiskList diseaseRisks={result.diseases} />
            <FeatureContributionChart
              featureContributions={Object.fromEntries(
                (result.explanation?.ranked || []).map((f) => [f.feature, f.contribution])
              )}
            />
          </div>

          {/* 4. Actionable Next Steps */}
          <RecommendationList recommendations={result.recommendations} verdict={result.verdict} />
        </div>
      )}
    </PageWrapper>
  );
}

export default DashboardPage;
