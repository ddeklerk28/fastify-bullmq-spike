import { Worker } from 'bullmq';
import { QUEUE_NAME } from "../queue/queue.js";
import IORedis from "ioredis";

const connection = new IORedis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null
});

let worker = null

export const getWorkerInstance = (processor) => {
    if (!worker) {
        console.log(`[Worker] Creating new worker for queue '${QUEUE_NAME}'`);

        const _processor = processor || defaultProcessor;

        worker = new Worker(QUEUE_NAME, _processor, { connection, removeOnComplete: { count: 0 }, removeOnFail: { count: 0} });
    }

    return worker;
}