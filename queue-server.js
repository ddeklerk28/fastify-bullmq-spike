import { getQueueInstance } from "./queue.js";

const addJob = async (payload, name, jobId = 'job') => {
    const queue = getQueueInstance();

    await queue.add(key, payload, { jobId });
}

const addJobs = async (payloads, name, jobIdExtractor) => {
    const queue = getQueueInstance();

    const jobs = payloads.map((payload, index) => {
        const jobId = jobIdExtractor ? jobIdExtractor(payload, name, index) : `job-${index}`;

        return ({
            name,
            data: payload,
            opts: { jobId }
         })
    });

    await queue.add(jobs);
}

const removeJobs = async () => {
    const queue = getQueueInstance();

    await queue.obliterate();
}