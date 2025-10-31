import { Worker } from 'bullmq';
import IORedis from "ioredis";

const WORKER_NAME = 'reporting-worker';

const connection = new IORedis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null
});

let worker = null

export const getWorkerInstance = () => {
    if (!worker) {
        worker = new Worker(WORKER_NAME, async (job) => {}, { connection });
    }

    return worker;
}