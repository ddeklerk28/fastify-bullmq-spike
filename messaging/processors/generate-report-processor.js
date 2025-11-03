import { writeFile } from 'fs/promises';
import { join } from 'path';

export const generateReportProcessor = async (job) => {
    console.log(`[GenerateReport] Starting report generation for job ${job.id} with data:`, job.data);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create report file in batch tmp directory
    const batchId = job.data.batchId;
    const fileName = `report-${job.id}.txt`;
    const filePath = join(process.cwd(), `tmp-${batchId}`, fileName);

    // This will be the generated power point content
    const reportContent = JSON.stringify({
        jobId: job.id,
        payload: job.data.payload,
        generatedAt: new Date().toISOString()
    }, null, 2);

    await writeFile(filePath, reportContent, 'utf-8');
    console.log(`[GenerateReport] Report saved to: ${filePath}`);

    console.log(`[GenerateReport] Finished processing job ${job.id}`);

    return { reportId: `report-${job.id}`, status: 'completed', filePath };
}