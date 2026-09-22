const { preprocessInput, engineerFeatures, loadPreprocessArtifacts } = require('../src/services/preprocessService');

beforeAll(() => {
  loadPreprocessArtifacts();
});

describe('engineerFeatures', () => {
  test('computes all 7 engineered features correctly for valid input', () => {
    const raw = {
      ph: 7.0, Hardness: 200, Solids: 300, Chloramines: 3,
      Sulfate: 200, Conductivity: 500, Organic_carbon: 2, Trihalomethanes: 50, Turbidity: 2,
    };
    const result = engineerFeatures(raw);

    expect(result.ph_deviation).toBeCloseTo(0, 5);
    expect(result.hard_cond_ratio).toBeCloseTo(200 / 500, 5);
    expect(result.chlor_oc_interact).toBeCloseTo(6, 5);
    expect(result.halogen_burden).toBeCloseTo(53, 5);
    expect(result.log_Solids).toBeCloseTo(Math.log1p(300), 5);
  });

  test('propagates null when a dependent raw value is missing', () => {
    const raw = {
      ph: null, Hardness: 200, Solids: 300, Chloramines: 3,
      Sulfate: 200, Conductivity: 500, Organic_carbon: 2, Trihalomethanes: 50, Turbidity: 2,
    };
    const result = engineerFeatures(raw);

    expect(result.ph_deviation).toBeNull();
    expect(result.hard_cond_ratio).not.toBeNull(); // does not depend on ph
  });
});

describe('preprocessInput', () => {
  test('returns exactly 16 values', () => {
    const raw = {
      ph: 7.1, Hardness: 180, Solids: 320, Chloramines: 3.0, Sulfate: 200,
      Conductivity: 450, Organic_carbon: 2.5, Trihalomethanes: 60, Turbidity: 2.0,
    };
    const result = preprocessInput(raw);
    expect(result).toHaveLength(16);
    result.forEach((v) => expect(typeof v).toBe('number'));
  });

  test('throws if a required parameter key is completely missing', () => {
    const raw = { ph: 7.1, Hardness: 180 }; // missing 7 keys
    expect(() => preprocessInput(raw)).toThrow('Missing required parameter');
  });

  test('handles a missing (null) value via imputation without throwing', () => {
    const raw = {
      ph: 7.1, Hardness: null, Solids: 320, Chloramines: 3.0, Sulfate: 200,
      Conductivity: 450, Organic_carbon: 2.5, Trihalomethanes: 60, Turbidity: 2.0,
    };
    expect(() => preprocessInput(raw)).not.toThrow();
  });
});