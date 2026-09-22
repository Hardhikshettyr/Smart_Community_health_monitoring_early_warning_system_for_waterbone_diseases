require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { loadModel } = require('./src/services/xgboostPredictor');
const { loadPreprocessArtifacts } = require('./src/services/preprocessService');
const { loadExplainabilityArtifacts } = require('./src/services/explainabilityService');
const { loadModelMeta } = require('./src/services/modelInfoService');



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  loadModel();
  loadPreprocessArtifacts();
  loadExplainabilityArtifacts();
  loadModelMeta();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();