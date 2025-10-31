import Fastify from 'fastify';
import { Queue } from 'bullmq';

const QUEUE_NAME = 'my_queue';
const redisConnection = {
	host: 'localhost',
	port: 6379
}

const queue = new Queue(QUEUE_NAME, { connection: redisConnection});

const fastify = Fastify();

fastify.get('/', async (req, res) => {
	console.log('Request received');

	console.log('Enqueuing job...');
	await queue.add('my-job', {});

	return { message: 'hello world' };
});

fastify.listen({ port: 3000 }, (_, address) => {
	console.log(`Server listening on ${address}`);
});
