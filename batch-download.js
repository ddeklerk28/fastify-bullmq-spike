import { getQueueInstance } from "./queue.js";

const bulkAddJobs = async (payloads) => {
    const queue = getQueueInstance();

    const jobs = payloads.map((payload, index) => ({
        name: `batch-download-job-${index}`,
        data: payload
    }));

    await queue.add(jobs);
}
