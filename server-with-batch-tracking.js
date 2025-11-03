import Fastify from 'fastify';
import { randomUUID } from 'crypto';

import { addJobs } from './messaging/queue/index.js';
import { initWorker, jobTracker } from "./messaging/worker/index.js";
import { rootProcessor } from "./messaging/processors/index.js";

// Initialize worker when server starts
initWorker(rootProcessor);

// Listen for batch completion events
jobTracker.on('batch:complete', (batchInfo) => {
    console.log('\n========================================');
    console.log('🎉 BATCH COMPLETE!');
    console.log(`Batch ID: ${batchInfo.batchId}`);
    console.log(`Total Jobs: ${batchInfo.total}`);
    console.log(`Successful: ${batchInfo.completed}`);
    console.log(`Failed: ${batchInfo.failed}`);
    console.log('========================================\n');
});

const concepts = [1, 2, 3];

const fastify = Fastify();

fastify.get('/', async (req, res) => {
    const batchId = randomUUID();

    jobTracker.startBatch(batchId, concepts.length);

    await addJobs(
        concepts,
        'generate_report',
        (payload, name, index) => `${name}-${payload}-job`,
        (payload) => ({ payload, batchId })
    );

    return {
        message: 'Jobs added to queue',
        batchId: batchId,
    };
});

fastify.get('/batch/:batchId/status', async (req, res) => {
    const { batchId } = req.params;
    const status = jobTracker.getBatchStatus(batchId);

    if (!status) {
        return { error: 'Batch not found or already completed' };
    }

    return {
        batchId,
        total: status.total,
        completed: status.completed,
        failed: status.failed,
        remaining: status.total - (status.completed + status.failed)
    };
});

fastify.listen({ port: 3000 }, (_, address) => {
    console.log(`Server listening on ${address}`);
});