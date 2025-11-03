export const defaultProcessor = (job) => {
    console.log(`[Worker] Processing job ${job.id} of type ${job.name}`);
}