import { getWorkerInstance } from './worker.js';

export const initWorker = (processor) => {
    const worker = getWorkerInstance(processor);

    worker.on('active', handleJobActive);
    worker.on('completed', handleJobCompletion);
    worker.on('progress', handleJobProgress);
    worker.on('failed', handleJobFailure);
    worker.on('error', handleWorkerError);
}

const handleJobActive = (job) => {
    console.log(`[Worker] Job ${job.id} of type '${job.name}' is now active`);
}

const handleJobCompletion = (job, returnValue) => {
    console.log(`[Worker] Job ${job.id} has been completed with:`, returnValue);
}

const handleJobProgress = (job, progress) => {
    console.log(`[Worker] Job ${job.id} is ${progress}% complete`);
}

const handleJobFailure = (job, error) => {
    console.error(`[Worker] Job ${job.id} failed with error:`, error.message);
    console.error('[Worker] Error stack:', error.stack);
}

const handleWorkerError = (error) => {
    console.error('[Worker] Worker error:', error);
}