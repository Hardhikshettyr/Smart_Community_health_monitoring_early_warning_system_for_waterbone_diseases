import React, { useState, useEffect } from 'react';
import { communityHealthService } from '../services/communityHealthService';
import { Activity, ShieldAlert, MapPin, Calendar, Plus, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageWrapper from '../components/layout/PageWrapper';
import AberrationIndicator from '../components/charts/AberrationIndicator';

export function CommunityHealthPage() {
  const [logForm, setLogForm] = useState({
    location: 'East Sector Village',
    week_number: String(new Date().getWeek ? new Date().getWeek() : 38),
    year: '2026',
    diarrhea_count: '4',
    fever_count: '2',
    vomiting_count: '1'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [searchLocation, setSearchLocation] = useState('East Sector Village');
  const [outbreakStatus, setOutbreakStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const handleFetchStatus = async (loc) => {
    if (!loc) return;
    setIsLoadingStatus(true);
    setStatusError(null);
    try {
      const data = await communityHealthService.getOutbreakStatus(loc);
      setOutbreakStatus(data);
    } catch (err) {
      // No fabricated data on failure - show the real error and clear
      // any previous result so stale/fake information is never displayed.
      setOutbreakStatus(null);
      setStatusError(
        err.message || `No surveillance data found yet for "${loc}". Log a symptom report first.`
      );
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    handleFetchStatus(searchLocation);
  }, []);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      await communityHealthService.submitSymptomReport({
        location: logForm.location,
        week_number: Number(logForm.week_number),
        year: Number(logForm.year),
        diarrhea_count: Number(logForm.diarrhea_count),
        fever_count: Number(logForm.fever_count),
        vomiting_count: Number(logForm.vomiting_count)
      });
      setSubmitSuccess(true);
      handleFetchStatus(logForm.location);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit symptom surveillance record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
          <Activity className="w-3.5 h-3.5 text-sky-600" />
          <span>Public Health Surveillance Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
          Community Symptom Logging & Outbreak Signals
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Log weekly waterborne disease symptom reports and monitor early-warning outbreak signals correlated with water quality checks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Symptom Logging Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                Log Weekly Symptom Report
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Record observed gastroenteritis and fever cases for a community sector.
              </p>
            </div>

            {submitError && <Alert type="danger" message={submitError} onClose={() => setSubmitError(null)} />}
            {submitSuccess && (
              <Alert
                type="success"
                title="Report Recorded"
                message="Symptom data successfully added to public health surveillance network."
                onClose={() => setSubmitSuccess(false)}
              />
            )}

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <Input
                label="Community Location / Sector"
                placeholder="e.g. East Sector Village"
                icon={MapPin}
                value={logForm.location}
                onChange={(e) => setLogForm({ ...logForm, location: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Week Number"
                  type="number"
                  min="1"
                  max="53"
                  value={logForm.week_number}
                  onChange={(e) => setLogForm({ ...logForm, week_number: e.target.value })}
                  required
                />
                <Input
                  label="Year"
                  type="number"
                  value={logForm.year}
                  onChange={(e) => setLogForm({ ...logForm, year: e.target.value })}
                  required
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <Input
                  label="Diarrhea / Digestive Illness Cases"
                  type="number"
                  min="0"
                  value={logForm.diarrhea_count}
                  onChange={(e) => setLogForm({ ...logForm, diarrhea_count: e.target.value })}
                  required
                />

                <Input
                  label="Fever Cases Reported"
                  type="number"
                  min="0"
                  value={logForm.fever_count}
                  onChange={(e) => setLogForm({ ...logForm, fever_count: e.target.value })}
                  required
                />

                <Input
                  label="Vomiting / Nausea Cases"
                  type="number"
                  min="0"
                  value={logForm.vomiting_count}
                  onChange={(e) => setLogForm({ ...logForm, vomiting_count: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                icon={Activity}
                className="w-full mt-2"
              >
                Submit Community Health Record
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Location Outbreak Surveillance */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-sky-600" />
                  Outbreak Surveillance Monitor
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Statistical aberration detection comparing current symptoms against historical baselines.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter sector or village name..."
                  icon={Search}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => handleFetchStatus(searchLocation)}
                isLoading={isLoadingStatus}
              >
                Inspect
              </Button>
            </div>

            {isLoadingStatus ? (
              <div className="py-12">
                <LoadingSpinner label="Calculating statistical aberration index..." />
              </div>
            ) : statusError ? (
              <Alert type="warning" message={statusError} onClose={() => setStatusError(null)} />
            ) : (
              <AberrationIndicator outbreakStatus={outbreakStatus} />
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

export default CommunityHealthPage;
