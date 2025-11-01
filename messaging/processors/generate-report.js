const generateReport = async (job) => {
    console.log(`Generating report for job ${job.id} with data:`, job.data);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
}