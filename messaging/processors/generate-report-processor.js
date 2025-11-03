export const generateReportProcessor = async (job) => {
    console.log(`[GenerateReport] Starting report generation for job ${job.id} with data:`, job.data);

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`[GenerateReport] Finished processing job ${job.id}`);

    return { reportId: `report-${job.id}`, status: 'completed' };
}