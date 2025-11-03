import Fastify from 'fastify';
import IORedis from 'ioredis';

import { addJobs } from './messaging/queue/index.js';
import { initWorker } from "./messaging/worker/index.js";
import { rootProcessor } from "./messaging/processors/index.js";

// Initialize worker when server starts
initWorker(rootProcessor);

const concepts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12, 13, 14];

const fastify = Fastify();

fastify.get('/', async (req, res) => {
	console.log('Request for \'\/\' route received');

    await addJobs(
        concepts,
        'generate_report',
        (payload, name, index) => `${name}-${payload}-job`
    );

	return { message: 'Response from \'\/\'' };
});

fastify.listen({ port: 3000 }, (_, address) => {
	console.log(`Server listening on ${address}`);
});
