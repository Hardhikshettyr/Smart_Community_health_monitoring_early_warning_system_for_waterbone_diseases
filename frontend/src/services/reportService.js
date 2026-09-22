import httpClient from './httpClient';

export const reportService = {
  async downloadPdfReport(predictionId, filename = 'Water_Safety_Report.pdf') {
    const response = await httpClient.get(`/report/${predictionId}/export`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
