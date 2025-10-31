import { getQueueInstance } from "./queue.js";

const bulkAddJobs = async (payloads, keyExtractor) => {
    const queue = getQueueInstance();

    const jobs = payloads.map((payload, index) => {
        const key = keyExtractor ? keyExtractor(payload, index) : `job-${index}`;

        return ({
            name: key,
            data: payload
         })
    });

    await queue.add(jobs);
}
