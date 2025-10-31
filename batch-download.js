import { getQueueInstance } from "./queue.js";

const batchDownload = async (payloads) => {
    const queue = getQueueInstance();

    for (const payload of payloads) {
        const index = payloads.indexOf(payload);
        await queue.add(`batch-download-job-${index}`, payload);
    }
}