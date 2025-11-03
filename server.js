import Fastify from 'fastify';
import { randomUUID } from 'crypto';

import { addJobs } from './messaging/queue/index.js';
import { initWorker, jobTracker } from "./messaging/worker/index.js";
import { rootProcessor } from "./messaging/processors/index.js";

// Initialize worker when server starts
initWorker(rootProcessor);

// We fire the completion event to send message to reporting-graphql
jobTracker.on('batch:complete', (batchInfo) => {
    console.log('complete', JSON.stringify(batchInfo, null, 2));
})

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

	return { message: `batch with id: '${batch}' created` };
});

fastify.get('/batch/:id/status', async (req, res) => {
    const { id } = req.params;

    const batchInfo = jobTracker.getBatchStatus(id);

    return {
        total: batchInfo.total,
        completed: batchInfo.completed,
    }
})

fastify.listen({ port: 3000 }, (_, address) => {
	console.log(`Server listening on ${address}`);
});
