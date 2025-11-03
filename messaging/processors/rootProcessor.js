import { defaultProcessor } from "./default-processor.js";
import { generateReport } from "./generate-report.js";

const processors = new Map([
    ['default_processor', defaultProcessor]
    ['generate_report', generateReport]
]);

export const rootProcessor = async (job) => {
    console.log(`[RootProcessor] Received job ${job.id} of type '${job.name}'`);

    const processor = processors.get(job.name) ?? processors.get('default_processor');

    if (!processor) {
        console.error(`[RootProcessor] No processor found for job name: ${job.name}`);

        throw new Error(`No processor found for job name: ${job.name}`);
    }

    return await processor(job);
}