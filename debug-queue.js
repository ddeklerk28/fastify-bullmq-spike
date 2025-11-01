import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAME } from './messaging/queue/queue.js';

const connection = new IORedis({
    host: 'localhost',
    port: 6379,
});

const queue = new Queue(QUEUE_NAME, { connection });

async function debugQueue() {
    console.log('=== Queue Debug Info ===\n');

    // Get job counts
    const counts = await queue.getJobCounts();
    console.log('Job counts:', counts);

    // Get waiting jobs
    const waiting = await queue.getWaiting();
    console.log('\nWaiting jobs:', waiting.length);
    waiting.forEach(job => {
        console.log(`  - Job ${job.id}: ${job.name}`, job.data);
    });

    // Get active jobs
    const active = await queue.getActive();
    console.log('\nActive jobs:', active.length);
    active.forEach(job => {
        console.log(`  - Job ${job.id}: ${job.name}`, job.data);
    });

    // Get completed jobs
    const completed = await queue.getCompleted();
    console.log('\nCompleted jobs:', completed.length);
    completed.forEach(job => {
        console.log(`  - Job ${job.id}: ${job.name}`, job.data);
    });

    // Get failed jobs
    const failed = await queue.getFailed();
    console.log('\nFailed jobs:', failed.length);
    failed.forEach(job => {
        console.log(`  - Job ${job.id}: ${job.name}`, job.data);
    });

    await queue.close();
    await connection.quit();
}

debugQueue().catch(console.error);