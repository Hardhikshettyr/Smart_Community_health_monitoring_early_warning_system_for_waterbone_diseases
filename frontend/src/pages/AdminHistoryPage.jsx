import React, { useEffect, useState } from 'react';
import { historyService } from '../services/historyService';
import { reportService } from '../services/reportService';
import { getVerdictConfig } from '../lib/verdictHelpers';
import { ShieldCheck, Search, Calendar, MapPin, Download, ChevronDown, ChevronUp, AlertCircle, Droplets, UserCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageWrapper from '../components/layout/PageWrapper';

export function AdminHistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    async function loadAllHistory() {
      try {
        const data = await historyService.getAllHistory();
        setHistoryItems(Array.isArray(data) ? data : data.history || []);
      } catch (err) {
        setLoadError(err.message || 'Failed to load organization-wide history.');
      } finally {
        setIsLoading(false);
      }
    }
    loadAllHistory();
  }, []);

  const handleDownload = async (item, e) => {
    e.stopPropagation();
    const id = item._id || item.id || item.predictionId;
    if (!id) return;
    setDownloadingId(id);
    try {
      await reportService.downloadPdfReport(id, `Water_Report_${id.slice(0, 6)}.pdf`);
    } catch (err) {
      alert(err.message || 'Failed to download the report. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    const location = (item.location || '').toLowerCase();
    const verdict = (item.verdict || '').toLowerCase();
    const submitterEmail = (item.userId?.email || '').toLowerCase();
    return location.includes(term) || verdict.includes(term) || submitterEmail.includes(term);
  });

  return (
    <PageWrapper className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Administrator Oversight</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Organization-Wide Analysis Timeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review water quality test records submitted by every user across the platform.
          </p>
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder="Search by location, verdict, or user..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner label="Retrieving organization-wide analysis records..." />
        </div>
      ) : loadError ? (
        <Card className="p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-rose-100 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Unable to Load Records</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{loadError}</p>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Droplets className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Records Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchTerm ? 'No records match your search filter.' : 'No water quality samples have been submitted yet.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, idx) => {
            const id = item._id || item.id || `item-${idx}`;
            const verdict = item.verdict || 'Safe';
            const config = getVerdictConfig(verdict);
            const isExpanded = expandedId === id;
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Recent Check';

            return (
              <Card
                key={id}
                hoverEffect
                className="p-5 cursor-pointer transition-all duration-200"
                onClick={() => setExpandedId(isExpanded ? null : id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${config.bgLight} ${config.text} border ${config.border}`}>
                      {Math.round(item.riskScore || 0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badgeBg}`}>
                          {config.label}
                        </span>

                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>

                        {item.userId?.email && (
                          <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                            <UserCircle2 className="w-3 h-3 text-slate-400" />
                            {item.userId.email}
                            {item.userId.role && (
                              <span className="text-slate-400">· {item.userId.role}</span>
                            )}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-sky-600" />
                        {item.location || 'Household Sample'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      isLoading={downloadingId === id}
                      onClick={(e) => handleDownload(item, e)}
                    >
                      PDF Report
                    </Button>

                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-100 text-xs space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">pH Reading</span>
                        <span className="text-sm font-bold text-slate-900">{item.rawInput?.ph ?? 'N/A'}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Water Clarity</span>
                        <span className="text-sm font-bold text-slate-900">{item.rawInput?.Turbidity ?? 'N/A'} NTU</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Disinfectant</span>
                        <span className="text-sm font-bold text-slate-900">{item.rawInput?.Chloramines ?? 'N/A'} ppm</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Dissolved Solids</span>
                        <span className="text-sm font-bold text-slate-900">{item.rawInput?.Solids ?? 'N/A'} ppm</span>
                      </div>
                    </div>

                    {item.violations && item.violations.length > 0 && (
                      <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 text-amber-900 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          Guideline Exceedances Recorded ({item.violations.length})
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          {item.violations.map(v => (typeof v === 'string' ? v : v.parameter)).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}

export default AdminHistoryPage;
