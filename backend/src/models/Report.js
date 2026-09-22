const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    format: {
      type: String,
      enum: ['pdf'],
      default: 'pdf',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);