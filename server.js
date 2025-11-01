import Fastify from 'fastify';
import IORedis from 'ioredis';

import { addJob, addJobs } from './messaging/queue/index.js';
import { initWorker } from "./messaging/worker/index.js";
import { generateReport as processor } from "./messaging/processors/index.js";

// Initialize worker when server starts
initWorker(processor);

const concepts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const fastify = Fastify();

fastify.get('/', async (req, res) => {
	console.log('Request for \'\/\' route received');

    await addJobs(
        concepts,
        'generate_report',
        (payload, name, index) => `${name}-${payload}-job`
    );
	// await addJob({ data: 'test' }, 'test_job', 'unique-id-2');

	return { message: 'Response from \'\/\'' };
});

fastify.listen({ port: 3000 }, (_, address) => {
	console.log(`Server listening on ${address}`);
});
