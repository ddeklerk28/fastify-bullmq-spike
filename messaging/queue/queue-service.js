import { getQueueInstance } from "./queue.js";

export const addJob = async (payload, name, jobId = 'job') => {
    const queue = await getQueueInstance();

    console.log(`[QueueService] Adding job type ${name} with jobId ${jobId}`);
    await queue.add(name, payload, { jobId });
}

export const addJobs = async (payloads, name, jobIdExtractor, batchId = null) => {
    const queue = await getQueueInstance();

    const jobs = payloads.map((payload, index) => {
        const jobId = jobIdExtractor ? jobIdExtractor(payload, name, index) : `job-${index}`;

        console.log(`[QueueService] Preparing job type ${name} with jobId ${jobId}`);

        // Add batchId to job data if provided
        const jobData = batchId ? { ...payload, _batchId: batchId } : payload;

        return ({
            name,
            data: jobData,
            opts: { jobId }
         })
    });

    console.log(`[QueueService] Adding ${jobs.length} jobs to queue...`);
    const result = await queue.addBulk(jobs);

    return {
        jobs: result,
        batchId,
        count: jobs.length
    };
}

export const removeJobs = async () => {
    const queue = await getQueueInstance();

    await queue.obliterate();
}