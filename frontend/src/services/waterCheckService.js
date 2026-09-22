import httpClient from './httpClient';

export const waterCheckService = {
  async analyzeSample(parameters) {
    // Standardize input keys for backend expectation
    const payload = {
      ph: parseFloat(parameters.ph),
      Hardness: parseFloat(parameters.hardness || parameters.Hardness),
      Solids: parseFloat(parameters.solids || parameters.Solids),
      Chloramines: parseFloat(parameters.chloramines || parameters.Chloramines),
      Sulfate: parseFloat(parameters.sulfate || parameters.Sulfate),
      Conductivity: parseFloat(parameters.conductivity || parameters.Conductivity),
      Organic_carbon: parseFloat(parameters.organic_carbon || parameters.Organic_carbon),
      Trihalomethanes: parseFloat(parameters.trihalomethanes || parameters.Trihalomethanes),
      Turbidity: parseFloat(parameters.turbidity || parameters.Turbidity),
      regionProfile: parameters.regionProfile || 'standard',
      location: parameters.location || ''
    };

    const response = await httpClient.post('/predict', payload);
    return response.data;
  },

  async uploadBatch(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post('/predict/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
