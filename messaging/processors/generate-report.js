export const generateReport = async (job) => {
    console.log(`Generating report for job ${job.id} with data:`, job.data);

    // Simulate report generation
    new Promise(resolve => setTimeout(resolve, 2000));

    return { reportId: `report-${job.id}`, status: 'completed' };
}