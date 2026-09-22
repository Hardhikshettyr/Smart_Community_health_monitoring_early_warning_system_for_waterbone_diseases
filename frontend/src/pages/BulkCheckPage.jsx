import React, { useState } from 'react';
import { waterCheckService } from '../services/waterCheckService';
import { FileSpreadsheet, Upload, CheckCircle2, ShieldAlert, Download, AlertTriangle, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import FileDropzone from '../components/ui/FileDropzone';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageWrapper from '../components/layout/PageWrapper';
import BatchSummaryCharts from '../components/charts/BatchSummaryCharts';

export function BulkCheckPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchResult, setBatchResult] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a CSV dataset file first.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const data = await waterCheckService.uploadBatch(selectedFile);
      setBatchResult(data);
    } catch (err) {
      setError(err.message || 'Batch dataset processing failed. Please ensure CSV headers match required parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
          <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
          <span>Health Worker & Public Safety Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
          Bulk Water Dataset Analysis
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Upload multi-sample CSV readings collected across villages, districts, or testing stations for aggregate safety surveillance.
        </p>
      </div>

      {/* Upload Box */}
      <Card className="p-8 max-w-2xl mx-auto space-y-6">
        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        <FileDropzone
          onFileSelect={(file) => setSelectedFile(file)}
          selectedFile={selectedFile}
          isLoading={isLoading}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Supported format: Standard CSV with parameter readings
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Upload}
            isLoading={isLoading}
            disabled={!selectedFile}
            onClick={handleUpload}
            className="w-full sm:w-auto"
          >
            Process Bulk Dataset
          </Button>
        </div>
      </Card>

      {/* Loading indicator */}
      {isLoading && (
        <div className="py-12">
          <LoadingSpinner size="lg" label="Processing multi-sample water quality records..." />
        </div>
      )}

      {/* Batch Results View */}
      {batchResult && !isLoading && (
        <div className="space-y-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold font-heading text-slate-900">
              Community Dataset Safety Breakdown
            </h2>
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              {batchResult.totalSamples ?? 0} Total Samples Analyzed
            </span>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Samples</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {batchResult.totalSamples ?? 0}
              </p>
            </div>

            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Safe Samples</span>
              <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                {batchResult.summary?.verdictCounts?.Safe ?? 0}
              </p>
            </div>

            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Cautionary</span>
              <p className="text-2xl font-extrabold text-amber-900 mt-1">
                {batchResult.summary?.verdictCounts?.Marginal ?? 0}
              </p>
            </div>

            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100 text-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Unsafe / Critical</span>
              <p className="text-2xl font-extrabold text-rose-900 mt-1">
                {(batchResult.summary?.verdictCounts?.Unsafe ?? 0) + (batchResult.summary?.verdictCounts?.['Critically Unsafe'] ?? 0)}
              </p>
            </div>
          </div>

          {/* High risk community alert - only shown when the real data warrants it */}
          {((batchResult.summary?.verdictCounts?.Unsafe ?? 0) + (batchResult.summary?.verdictCounts?.['Critically Unsafe'] ?? 0)) > 0 && (
            <div className="bg-rose-500 text-white p-5 rounded-3xl shadow-md flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-bold text-base">Community Contamination Cluster Detected</h4>
                <p className="text-rose-100 mt-1 leading-relaxed">
                  Several water samples in this dataset exhibit critical parameter violations. Consider initiating immediate boil water advisories and localized field sanitization.
                  {batchResult.summary?.mostCommonViolation && batchResult.summary.mostCommonViolation !== 'None' && (
                    <> Most frequently affected parameter: <strong>{batchResult.summary.mostCommonViolation}</strong>.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Charts - real violation frequency data is reshaped into the
              {issue, count} list the chart component expects, without
              modifying the chart component itself */}
          <BatchSummaryCharts
            summaryData={{
              ...batchResult.summary,
              topViolations: Object.entries(batchResult.summary?.violationFrequency || {})
                .map(([param, count]) => ({ issue: param, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
            }}
          />
        </div>
      )}
    </PageWrapper>
  );
}

export default BulkCheckPage;
