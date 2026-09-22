const { classifyAberration } = require('../src/utils/statsUtils');

describe('classifyAberration', () => {
  test('returns "Insufficient Data" with fewer than 3 historical entries', () => {
    const result = classifyAberration(10, [3, 4]);
    expect(result.level).toBe('Insufficient Data');
  });

  test('classifies a normal count as Green', () => {
    const historical = [3, 4, 2, 5, 3, 4];
    const result = classifyAberration(4, historical);
    expect(result.level).toBe('Green');
  });

  test('classifies a count above the 3-sigma threshold as Red', () => {
    const historical = [3, 4, 2, 5, 3, 4];
    const result = classifyAberration(20, historical);
    expect(result.level).toBe('Red');
  });

  test('classifies a count between 2-sigma and 3-sigma as Amber', () => {
    // baseline mean=3.5, stddev~0.96 -> 2sigma~5.41, 3sigma~6.37
    const historical = [3, 4, 2, 5, 3, 4];
    const result = classifyAberration(6, historical);
    expect(result.level).toBe('Amber');
  });
});

describe('symptomSurveillanceService', () => {
  const { submitSymptomEntry, getLocationStatus } = require('../src/services/symptomSurveillanceService');

  jest.mock('../src/models/SymptomRecord');
  jest.mock('../src/models/Prediction');

  test('submitSymptomEntry creates a record with the given fields', async () => {
    const SymptomRecord = require('../src/models/SymptomRecord');
    SymptomRecord.create = jest.fn().mockResolvedValue({
      location: 'Village X', week: '2025-W38', diarrhea: 5, fever: 2, vomiting: 1,
    });

    const record = await submitSymptomEntry({
      reportedBy: 'user1', location: 'Village X', week: '2025-W38',
      diarrhea: 5, fever: 2, vomiting: 1,
    });

    expect(SymptomRecord.create).toHaveBeenCalled();
    expect(record.location).toBe('Village X');
  });

  test('getLocationStatus throws if no records exist for the location', async () => {
    const SymptomRecord = require('../src/models/SymptomRecord');
    SymptomRecord.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await expect(getLocationStatus('Nonexistent Village')).rejects.toThrow('No symptom records found');
  });
});