const mongoose = require('mongoose');

const symptomRecordSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    week: {
      type: String, // e.g. "2025-W38"
      required: true,
    },
    diarrhea: { type: Number, default: 0 },
    fever: { type: Number, default: 0 },
    vomiting: { type: Number, default: 0 },
  },
  { timestamps: true }
);

symptomRecordSchema.index({ location: 1, createdAt: 1 });

module.exports = mongoose.model('SymptomRecord', symptomRecordSchema);