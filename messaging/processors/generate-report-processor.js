export const generateReportProcessor = async (job) => {
    console.log(`[GenerateReport] Starting report generation for job ${job.id} with data:`, job.data);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`[GenerateReport] Finished processing job ${job.id}`);

    return { reportId: `report-${job.id}`, status: 'completed' };
}