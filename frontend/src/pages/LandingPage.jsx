import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, ShieldCheck, ArrowRight, Activity, Users, CheckCircle2, HeartPulse, Sparkles, FileText, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageWrapper from '../components/layout/PageWrapper';
import { systemInfoService } from '../services/systemInfoService';

export function LandingPage() {
  const [stats, setStats] = useState({
    overallReliability: '88.4%',
    samplesAnalyzed: '1,000,000+',
    activeFactorsChecked: 16
  });

  useEffect(() => {
    systemInfoService.getSystemStats().then(setStats).catch(() => {});
  }, []);

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-water-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Next-Generation Public Health Technology</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15]">
                Know Your Water Is Safe.{' '}
                <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Protect What Matters Most.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Instant, science-backed water safety analysis — designed for families, health workers, and public health officials. Enter simple physical & chemical readings to receive a clear safety verdict and actionable recommendations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/check" className="w-full sm:w-auto">
                  <Button variant="primary" size="xl" icon={ArrowRight} className="w-full sm:w-auto">
                    Check Your Water Now
                  </Button>
                </Link>

                <Link to="/about" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" icon={ShieldCheck} className="w-full sm:w-auto">
                    How We Ensure Accuracy
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>WHO Standard Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Technical Jargon</span>
                </div>
              </div>
            </motion.div>

            {/* Right Graphic Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-sky-400/20 to-teal-400/20 blur-2xl -z-10" />

                {/* Card Mockup */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/80 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                          Safety Verdict
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">Safe to Drink</h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      Risk Index: 12/100
                    </span>
                  </div>

                  {/* Parameter summary pill grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Acid-Base (pH)</span>
                      <span className="text-sm font-bold text-slate-800">7.2 pH</span>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">Optimal Range</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Water Clarity</span>
                      <span className="text-sm font-bold text-slate-800">0.4 NTU</span>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">Crystal Clear</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Disinfectant</span>
                      <span className="text-sm font-bold text-slate-800">2.1 ppm</span>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">Protected</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Dissolved Minerals</span>
                      <span className="text-sm font-bold text-slate-800">210 ppm</span>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">Balanced</span>
                    </div>
                  </div>

                  {/* Recommendation pill */}
                  <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs space-y-1">
                    <p className="font-bold text-sky-900">Recommended Next Step:</p>
                    <p className="text-sky-800 leading-relaxed">
                      Water complies with public health guidelines — suitable for direct consumption.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-sky-600">{stats.samplesAnalyzed}</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Water Samples Checked</p>
              <p className="text-xs text-slate-400 mt-0.5">Across urban and rural communities</p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-sky-600">{stats.overallReliability}</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Real-World Reliability Rating</p>
              <p className="text-xs text-slate-400 mt-0.5">Cross-validated against physical testing</p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-sky-600">16 Safety Factors</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Comprehensive Analysis</p>
              <p className="text-xs text-slate-400 mt-0.5">Covering chemical balance & water clarity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Designed For Real Impact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Everything You Need to Safeguard Water Quality
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Whether you are testing water in your kitchen or managing public health across an entire region, AquaSentinel provides clear, actionable answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Instant Clear Verdicts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an immediate, color-coded safety verdict (Safe, Requires Caution, Unsafe, or Critical) in seconds.
              </p>
            </Card>

            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Plain-Language Guidance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No complex chemical jargon or raw numbers. Everything is translated into easy-to-understand health terms.
              </p>
            </Card>

            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Actionable Steps & PDF Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get step-by-step guidance on boiling, filtering, or sanitizing water, plus downloadable official PDF reports.
              </p>
            </Card>

            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Outbreak Surveillance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empower community health officers to log symptoms and detect waterborne disease spikes before they spread.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Ready to Verify Your Water Safety?
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            It takes less than a minute to analyze your water readings and ensure your household or community is protected.
          </p>
          <div className="pt-4 flex justify-center">
            <Link to="/check">
              <Button variant="primary" size="xl" icon={ArrowRight}>
                Start Water Safety Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default LandingPage;
