import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const QUEUE_NAME = 'reporting_queue';

const connection = new IORedis({
    host: 'localhost',
    port: 6379,
});

let queue = null;

export const getQueueInstance = () => {
    if (!queue) {
        queue = new Queue(QUEUE_NAME, { connection });
    }
    return queue;
}
