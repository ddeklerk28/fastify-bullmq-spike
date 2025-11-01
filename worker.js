import { Worker } from 'bullmq';
import { QUEUE_NAME } from "./queue.js";
import IORedis from "ioredis";

const connection = new IORedis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null
});

let worker = null

const defaultProcessor = (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
}

export const getWorkerInstance = (processor) => {
    if (!worker) {

        const _processor = processor || defaultProcessor;

        worker = new Worker(QUEUE_NAME, _processor, { connection });
    }

    return worker;
}