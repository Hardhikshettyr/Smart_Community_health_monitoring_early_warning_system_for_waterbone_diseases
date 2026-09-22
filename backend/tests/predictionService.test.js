const { loadModel } = require('../src/services/xgboostPredictor');
const { loadPreprocessArtifacts } = require('../src/services/preprocessService');
const { loadExplainabilityArtifacts } = require('../src/services/explainabilityService');
const { runPrediction } = require('../src/services/predictionService');

// mock the DB write so this test doesn't require a live MongoDB connection
jest.mock('../src/models/Prediction', () => ({
  create: jest.fn().mockResolvedValue({
    _id: 'mockid123',
    createdAt: new Date(),
  }),
}));

beforeAll(() => {
  loadModel();
  loadPreprocessArtifacts();
  loadExplainabilityArtifacts();
});

describe('runPrediction', () => {
  test('a clean water sample returns a Safe verdict with low risk score', async () => {
    const rawInput = {
      ph: 7.1, Hardness: 180, Solids: 320, Chloramines: 3.0, Sulfate: 200,
      Conductivity: 450, Organic_carbon: 2.5, Trihalomethanes: 60, Turbidity: 2.0,
    };

    const result = await runPrediction({ rawInput, profileName: 'standard', userId: 'user1' });

    expect(result.verdict).toBe('Safe');
    expect(result.riskScore).toBeLessThan(25);
    expect(result.safeProbability).toBeGreaterThan(0.9);
  });

  test('a heavily contaminated sample returns Unsafe/Critically Unsafe with high risk score', async () => {
    const rawInput = {
      ph: 5.1, Hardness: 340, Solids: 610, Chloramines: 5.5, Sulfate: 310,
      Conductivity: 900, Organic_carbon: 7.0, Trihalomethanes: 130, Turbidity: 8.2,
    };

    const result = await runPrediction({ rawInput, profileName: 'standard', userId: 'user1' });

    expect(['Unsafe', 'Critically Unsafe']).toContain(result.verdict);
    expect(result.riskScore).toBeGreaterThan(50);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.diseases.length).toBeGreaterThan(0);
  });

  test('rural profile produces fewer or equal violations than standard for the same sample', async () => {
    const rawInput = {
      ph: 5.1, Hardness: 340, Solids: 610, Chloramines: 5.5, Sulfate: 310,
      Conductivity: 900, Organic_carbon: 7.0, Trihalomethanes: 130, Turbidity: 8.2,
    };

    const standardResult = await runPrediction({ rawInput, profileName: 'standard', userId: 'user1' });
    const ruralResult = await runPrediction({ rawInput, profileName: 'rural', userId: 'user1' });

    expect(ruralResult.violations.length).toBeLessThanOrEqual(standardResult.violations.length);
  });
});