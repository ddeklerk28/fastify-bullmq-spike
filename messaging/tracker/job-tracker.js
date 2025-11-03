import { EventEmitter } from 'events';

class JobTracker extends EventEmitter {
    constructor() {
        super();
        this.batches = new Map(); // batchId -> { total, completed, failed }
    }

    startBatch(batchId, totalJobs) {
        console.log(`[JobTracker] Starting batch '${batchId}' with ${totalJobs} jobs`);
        this.batches.set(batchId, {
            total: totalJobs,
            completed: 0,
            failed: 0
        });
    }

    recordCompletion(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;

        batch.completed++;
        console.log(`[JobTracker] Batch '${batchId}': ${batch.completed}/${batch.total} completed`);

        this.checkBatchComplete(batchId);
    }

    recordFailure(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;

        batch.failed++;
        console.log(`[JobTracker] Batch '${batchId}': ${batch.failed} failed`);

        this.checkBatchComplete(batchId);
    }

    checkBatchComplete(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;

        const totalProcessed = batch.completed + batch.failed;

        if (totalProcessed === batch.total) {
            console.log(`[JobTracker] Batch '${batchId}' is complete!`);
            console.log(`[JobTracker] Stats: ${batch.completed} succeeded, ${batch.failed} failed`);

            this.emit('batch:complete', {
                batchId,
                total: batch.total,
                completed: batch.completed,
                failed: batch.failed
            });

            // Clean up
            this.batches.delete(batchId);
        }
    }

    getBatchStatus(batchId) {
        return this.batches.get(batchId);
    }
}

// Singleton instance
export const jobTracker = new JobTracker();