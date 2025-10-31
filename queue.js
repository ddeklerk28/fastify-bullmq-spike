import { Queue } from 'bullmq';

export const QUEUE_NAME = 'reporting_queue';

const connection = {
    host: 'localhost',
    port: 6379,
};

let queue = null;

export const getQueueInstance = () => {
    if (!queue) {
        queue = new Queue(QUEUE_NAME, { connection });
    }
    return queue;
}
