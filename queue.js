import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const QUEUE_NAME = 'reporting_queue';
export const GLOBAL_CONCURRENCY_LIMIT = 5;

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
    await queue.setGlobalConcurrency(GLOBAL_CONCURRENCY_LIMIT);
}