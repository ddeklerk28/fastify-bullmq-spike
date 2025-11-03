import { generateReport } from "./generate-report.js";

const processors = new Map([
    'generate_repot', generateReport
]);

export const rootProcessor = async (job) => {
    const processor = processors.get(job.name);

    if (!processor) {
        throw new Error(`No processor found for job name: ${job.name}`);
    }

    return processor(job);
}