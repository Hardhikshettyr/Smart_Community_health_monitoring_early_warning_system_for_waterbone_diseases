import React, { useEffect, useState } from 'react';
import { systemInfoService } from '../services/systemInfoService';
import { ShieldCheck, CheckCircle2, Award, Globe2, BookOpen, ChevronDown, ChevronUp, Sparkles, HeartPulse } from 'lucide-react';
import Card from '../components/ui/Card';
import PageWrapper from '../components/layout/PageWrapper';

export function AboutPage() {
  const [stats, setStats] = useState({
    overallReliability: '88.4%',
    samplesAnalyzed: '1,000,000+',
    activeFactorsChecked: 16
  });

  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    systemInfoService.getSystemStats().then(setStats).catch(() => {});
  }, []);

  const faqs = [
    {
      q: 'How does AquaSentinel evaluate whether my water is safe?',
      a: 'AquaSentinel compares your water sample readings against international public health safety thresholds (such as WHO drinking water quality guidelines). It evaluates physical properties like clarity and hardness, alongside chemical indicators like pH, chloramines, and sulfates.'
    },
    {
      q: 'What should I do if my water result comes back as "Requires Caution"?',
      a: 'A "Requires Caution" (Marginal) verdict means one or more parameters are slightly outside ideal guidelines. While not immediately hazardous, we recommend boiling your water for at least 3 minutes or using an active carbon filter before drinking or cooking.'
    },
    {
      q: 'What is the difference between standard and rural threshold settings?',
      a: 'Standard guidelines apply strictly to municipal treated water networks. Rural and remote area settings account for natural regional mineral variations while still ensuring safety against pathogens and dangerous toxicity.'
    },
    {
      q: 'How often should I test my home or community water source?',
      a: 'We recommend testing household water every 3 to 6 months, or immediately after severe weather events, flooding, pipe repairs, or any noticeable change in odor, taste, or clarity.'
    }
  ];

  return (
    <PageWrapper className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Public Health Trust & Reliability</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
          Built on Science.{' '}
          <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
            Validated for Real Communities.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          AquaSentinel brings enterprise public health analysis to every family and community officer — translating complex water chemistry into clear, life-saving guidance.
        </p>
      </div>

      {/* 4 Trust Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverEffect className="space-y-3 text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-3xl font-extrabold font-heading text-slate-900">{stats.overallReliability}</p>
          <h3 className="text-sm font-bold text-slate-800">Reliability Rating</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consistently validated against physical laboratory water safety testing.
          </p>
        </Card>

        <Card hoverEffect className="space-y-3 text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Globe2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-extrabold font-heading text-slate-900">{stats.samplesAnalyzed}</p>
          <h3 className="text-sm font-bold text-slate-800">Samples Analyzed</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Trusted across household taps, deep wells, and municipal water supplies.
          </p>
        </Card>

        <Card hoverEffect className="space-y-3 text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-3xl font-extrabold font-heading text-slate-900">16 Safety Factors</p>
          <h3 className="text-sm font-bold text-slate-800">Factors Monitored</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Checks acidity, water clarity, minerals, disinfectants, and organic content.
          </p>
        </Card>

        <Card hoverEffect className="space-y-3 text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <HeartPulse className="w-6 h-6" />
          </div>
          <p className="text-3xl font-extrabold font-heading text-slate-900">Zero Jargon</p>
          <h3 className="text-sm font-bold text-slate-800">100% Plain English</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every score is explained with direct, benefit-driven health steps.
          </p>
        </Card>
      </div>

      {/* How Safety Verdicts Work */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            How AquaSentinel Evaluates Water Quality
          </h2>
          <p className="text-sm text-slate-500">
            Our multi-layered analysis framework checks 3 core dimensions of water health:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Physical Clarity & Clarity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Measures cloudiness (turbidity) and dissolved mineral content. High cloudiness traps micro-particles and provides shelter for waterborne pathogens.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Chemical Balance & Disinfectants</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitors pH balance and chloramine levels. Proper disinfectant ensures bacteria cannot multiply during storage or distribution.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Health & Pathogen Risk Mapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cross-references chemical imbalances against known waterborne illness patterns (e.g. Cholera, Diarrheal diseases) to offer early warnings.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            Frequently Asked Public Health Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about testing and maintaining safe drinking water.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Card
                key={idx}
                className="p-5 cursor-pointer transition-all"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                  <button className="text-slate-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                    {faq.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

export default AboutPage;
