import httpClient from './httpClient';

export const communityHealthService = {
  /**
   * Accepts the page's existing field names (location, week_number, year,
   * diarrhea_count, fever_count, vomiting_count) and maps them to the
   * shape the backend actually expects: { location, week, diarrhea, fever, vomiting },
   * where week is a single "YYYY-Www" string.
   */
  async submitSymptomReport(data) {
    const week = `${data.year}-W${String(data.week_number).padStart(2, '0')}`;

    const payload = {
      location: data.location,
      week,
      diarrhea: Number(data.diarrhea_count) || 0,
      fever: Number(data.fever_count) || 0,
      vomiting: Number(data.vomiting_count) || 0,
    };

    const response = await httpClient.post('/symptoms', payload);
    return response.data;
  },

  /**
   * Calls the real outbreak-status endpoint and maps the backend's actual
   * response shape into the shape the AberrationIndicator component expects.
   *
   * Backend shape:
   * {
   *   location,
   *   latestEntry: { week, diarrhea, fever, vomiting, total },
   *   historicalEntryCount,
   *   aberration: { level, baselineMean, baselineStdDev, threshold2sigma, threshold3sigma, message },
   *   waterCrossReference: { verdict, riskScore } | null,
   *   combinedSignal: { alert, message } | null
   * }
   */
  async getOutbreakStatus(location) {
    const response = await httpClient.get(`/symptoms/${encodeURIComponent(location)}/status`);
    const data = response.data;

    const level = data.aberration?.level;
    const isAberration = level === 'Amber' || level === 'Red';

    const mean = data.aberration?.baselineMean ?? 0;
    const stdDev = data.aberration?.baselineStdDev ?? 0;
    const currentTotal = data.latestEntry?.total ?? 0;
    const aberrationScore = stdDev > 0 ? Math.round(((currentTotal - mean) / stdDev) * 10) / 10 : 0;

    let riskLevel = 'Normal';
    if (level === 'Red') riskLevel = 'High';
    else if (level === 'Amber') riskLevel = 'Moderate';

    return {
      location: data.location,
      isAberration,
      aberrationScore,
      currentCases: currentTotal,
      baselineCases: Math.round(mean),
      riskLevel,
      waterVerdictCorrelation: data.waterCrossReference?.verdict,
      // extra real fields kept available for future use, without altering
      // the shape the existing component already relies on
      insufficientData: level === 'Insufficient Data',
      combinedSignal: data.combinedSignal,
      historicalEntryCount: data.historicalEntryCount,
    };
  }
};
