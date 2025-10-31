import { getQueueInstance } from "./queue.js";

const addJob = async (payload, key) => {
    const queue = getQueueInstance();

    await queue.add(key, payload);
}

const addJobs = async (payloads, keyExtractor) => {
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

const removeJobs = async () => {
    const queue = getQueueInstance();

    await queue.obliterate();
}