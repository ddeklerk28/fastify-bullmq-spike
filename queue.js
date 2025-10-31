import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const QUEUE_NAME = 'reporting_queue';
export const GLOBAL_CONCURRENCY_LIMIT = 0;
export const RATE_LIMIT_MAX_JOBS = 0;
export const RATE_LIMIT_DURATION = 0;

const connection = new IORedis({
    host: 'localhost',
    port: 6379,
});

let queue = null;

export const getQueueInstance = async () => {
    if (!queue) {
        queue = new Queue(QUEUE_NAME, { connection });
    }

    await configureQueue(queue);

    return queue;
}

const configureQueue = async (queue) => {
    if (GLOBAL_CONCURRENCY_LIMIT > 0) {
        await queue.setGlobalConcurrency(GLOBAL_CONCURRENCY_LIMIT);
    }

    if (RATE_LIMIT_MAX_JOBS > 0 && RATE_LIMIT_DURATION > 0) {
        await setRateLimit(queue, RATE_LIMIT_MAX_JOBS, RATE_LIMIT_DURATION);
    }
}

const setRateLimit = async (queue, maxJobs, duration) => {