const {
  computeRiskScore,
  getVerdict,
  generateRecommendations,
  assessRisk,
} = require('../src/services/riskScoreService');

describe('computeRiskScore', () => {
  test('returns 0 for a perfectly safe sample (safeProbability=1, no violations, no disease)', () => {
    const score = computeRiskScore(1, 0, 0);
    expect(score).toBe(0);
  });

  test('returns 100 for a fully unsafe sample (safeProbability=0, max violations, max disease severity)', () => {
    const score = computeRiskScore(0, 9, 1);
    expect(score).toBe(100);
  });

  test('increases as safeProbability decreases', () => {
    const highSafety = computeRiskScore(0.9, 2, 0.3);
    const lowSafety = computeRiskScore(0.3, 2, 0.3);
    expect(lowSafety).toBeGreaterThan(highSafety);
  });
});

describe('getVerdict', () => {
  test.each([
    [10, 'Safe'],
    [25, 'Safe'],
    [40, 'Marginal'],
    [60, 'Unsafe'],
    [90, 'Critically Unsafe'],
  ])('score %i maps to verdict %s', (score, expectedVerdict) => {
    expect(getVerdict(score)).toBe(expectedVerdict);
  });
});

describe('generateRecommendations', () => {
  test('Safe verdict gives reassuring, non-alarming recommendations', () => {
    const recs = generateRecommendations('Safe', []);
    expect(recs.some((r) => r.toLowerCase().includes('no immediate action'))).toBe(true);
  });

  test('Critically Unsafe verdict includes a clear consumption warning', () => {
    const recs = generateRecommendations('Critically Unsafe', []);
    expect(recs.some((r) => r.toLowerCase().includes('do not consume'))).toBe(true);
  });

  test('includes parameter-specific guidance for violated parameters', () => {
    const violations = [{ parameter: 'Turbidity', direction: 'above maximum' }];
    const recs = generateRecommendations('Unsafe', violations);
    expect(recs.some((r) => r.toLowerCase().includes('turbidity'))).toBe(true);
  });
});

describe('assessRisk (integration of the three sub-functions)', () => {
  test('returns a consistent { riskScore, verdict, recommendations } shape', () => {
    const result = assessRisk({
      safeProbability: 0.4,
      violations: [{ parameter: 'ph', direction: 'below minimum' }],
      diseaseSeverityScore: 0.5,
    });

    expect(result).toHaveProperty('riskScore');
    expect(result).toHaveProperty('verdict');
    expect(result).toHaveProperty('recommendations');
    expect(Array.isArray(result.recommendations)).toBe(true);
  });
});