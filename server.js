import Fastify from 'fastify';
import IORedis from 'ioredis';
import { QueueEvents } from "bullmq";

import { addJob, QUEUE_NAME } from './messaging/queue/index.js';
import { initWorker } from "./messaging/worker/index.js";

const connection = new IORedis({
	host: 'localhost',
	port: 6379,
	maxRetriesPerRequest: null,
});

const queueEvents = new QueueEvents(QUEUE_NAME, { connection });

queueEvents.on('completed', ({ jobId, returnvalue }) => {
	console.log(`[QueueEvents] Job ${jobId} completed with return value:`, returnvalue);
});

// Define the job processor
const processor = async (job) => {
	console.log(`[Worker] Processing job ${job.id} of type ${job.name}`);
	console.log(`[Worker] Job data:`, job.data);

	// Simulate some work
	await new Promise(resolve => setTimeout(resolve, 1000));

	return { success: true, processedAt: new Date().toISOString() };
};

// Initialize worker when server starts
initWorker(processor);
console.log('Worker initialized and listening for jobs...');

const fastify = Fastify();

fastify.get('/', async (req, res) => {
	console.log('Request received');

	console.log('Adding job to queue...');

	await addJob({ data: 'test' }, 'test_job', 'unique-id-1');

	console.log('Job added successfully!');

	return { message: 'Job added to queue' };
});

fastify.listen({ port: 3000 }, (_, address) => {
	console.log(`Server listening on ${address}`);
});
