import { getQueueInstance } from "./queue.js";

export const addJob = async (payload, name, jobId = 'job') => {
    const queue = await getQueueInstance();

    console.log(`[QueueService] Adding job type ${name} with jobId ${jobId}`);

    await queue.add(name, payload, { jobId });
}

export const addJobs = async (payloads, name, jobIdExtractor) => {
    const queue = await getQueueInstance();

    const jobs = payloads.map((payload, index) => {
        const jobId = jobIdExtractor ? jobIdExtractor(payload, name, index) : `job-${index}`;

        return ({
            name,
            data: payload,
            opts: { jobId }
         })
    });

    console.log(`[QueueService] Adding ${jobs.length} jobs to queue...`);
    return await queue.addBulk(jobs);
}

export const removeJobs = async () => {
    const queue = await getQueueInstance();

    await queue.obliterate();
}