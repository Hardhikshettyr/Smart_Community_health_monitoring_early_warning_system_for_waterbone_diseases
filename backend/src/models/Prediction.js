const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    rawInput: {
      ph: Number,
      Hardness: Number,
      Solids: Number,
      Chloramines: Number,
      Sulfate: Number,
      Conductivity: Number,
      Organic_carbon: Number,
      Trihalomethanes: Number,
      Turbidity: Number,
    },
    profileUsed: {
      type: String,
      enum: ['standard', 'rural'],
      default: 'standard',
    },
    safeProbability: Number,
    riskScore: Number,
    verdict: {
      type: String,
      enum: ['Safe', 'Marginal', 'Unsafe', 'Critically Unsafe'],
    },
    recommendations: [String],
    violations: [
      {
        parameter: String,
        value: Number,
        min: Number,
        max: Number,
        direction: String,
      },
    ],
    diseases: [
      {
        id: String,
        disease: String,
        severity: String,
        reason: String,
      },
    ],
    confidence: {
      confidenceLevel: String,
      isBorderline: Boolean,
      distanceFromBoundary: Number,
      message: String,
    },
    explanation: {
      topFeature: String,
      ranked: [
        {
          feature: String,
          contribution: Number,
          absContribution: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', predictionSchema);