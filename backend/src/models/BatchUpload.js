const mongoose = require('mongoose');

const batchUploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: String,
    totalSamples: Number,
    profileUsed: {
      type: String,
      enum: ['standard', 'rural'],
      default: 'standard',
    },
    summary: {
      verdictCounts: {
        Safe: { type: Number, default: 0 },
        Marginal: { type: Number, default: 0 },
        Unsafe: { type: Number, default: 0 },
        'Critically Unsafe': { type: Number, default: 0 },
      },
      averageRiskScore: Number,
      mostCommonViolation: String,
      mostCommonDisease: String,
      violationFrequency: mongoose.Schema.Types.Mixed,
      diseaseFrequency: mongoose.Schema.Types.Mixed,
    },
    rowResults: [
      {
        rowIndex: Number,
        verdict: String,
        riskScore: Number,
        safeProbability: Number,
        error: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('BatchUpload', batchUploadSchema);