import Fastify from 'fastify';

import { addJobs, removeJobs } from './messaging/queue/index.js';
import { initWorker } from "./messaging/worker/index.js";
import { rootProcessor } from "./messaging/processors/index.js";

// Initialize worker when server starts
initWorker(rootProcessor);

const concepts = [1, 2, 3];

const fastify = Fastify();

fastify.get('/', async (req, res) => {
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
