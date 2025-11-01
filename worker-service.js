import { getWorkerInstance } from './worker.js';

const initWorker = (processor) => {
    const worker = getWorkerInstance(processor);

    worker.on('complete', handleJobCompletion);

    worker.on('progress', handleJobProgress);
}

const handleJobCompletion = (job, returnValue) => {
    console.log(`Job ${job.id} has been completed with:`, returnValue);
}

const handleJobProgress = (job, progress) => {
    console.log(`Job ${job.id} is ${progress}% complete`);
}