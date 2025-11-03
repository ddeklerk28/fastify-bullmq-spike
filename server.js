import Fastify from 'fastify';
import { randomUUID } from 'crypto';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

import { addJobs } from './messaging/queue/index.js';
import { initWorker } from "./messaging/worker/index.js";
import { rootProcessor } from "./messaging/processors/index.js";
import { jobTracker } from './messaging/tracker/index.js';

// Initialize worker when server starts
initWorker(rootProcessor);

// We fire the completion event to send message to reporting-graphql
jobTracker.on('batch:complete', async (batchInfo) => {
    console.log('complete', JSON.stringify(batchInfo, null, 2));

    // Archive the batch folder
    const batchId = batchInfo.batchId;
    const tmpDir = `tmp-${batchId}`;
    const archiveName = `${tmpDir}.zip`;

    try {
        console.log(`[Server] Archiving ${tmpDir}...`);

        // Create zip archive
        await execAsync(`zip -r ${archiveName} ${tmpDir}`);

        console.log(`[Server] Archive created: ${archiveName}`);

        // Optional: Remove the tmp directory after archiving
        // await execAsync(`rm -rf ${tmpDir}`);
        // console.log(`[Server] Removed directory: ${tmpDir}`);

    } catch (error) {
        console.error(`[Server] Failed to archive ${tmpDir}:`, error.message);
    }
})

const concepts = [1, 2, 3];

const fastify = Fastify();

fastify.get('/', async (req, res) => {
    const batchId = randomUUID();
    jobTracker.startBatch(batchId, concepts.length);

    // Create tmp folder for this batch
    const tmpDir = join(process.cwd(), `tmp-${batchId}`);
    await mkdir(tmpDir, { recursive: true });
    console.log(`[Server] Created directory: ${tmpDir}`);

    await addJobs(
        concepts,
        'generate_report',
        (payload, name, index) => `${name}-${payload}-job`,
        (payload) => ({ payload, batchId })
    );

	return { message: `batch with id: '${batchId}' created` };
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
