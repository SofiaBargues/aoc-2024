import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker, isMainThread } from 'worker_threads';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day17b(dataPath?: string) {
  const data = await readLines(dataPath);
  let { B, C, program } = parseLines(data);
  const origProgramStr = program.join(',');

  const numWorkers = 40;
  const A_RANGE = 10000000000;
  const chunkSize = Math.ceil(A_RANGE / numWorkers);
  const workers: Worker[] = [];
  const workerPromises: Promise<number>[] = [];

  const workerPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'worker.ts'
  );

  console.log('Starting workers with chunk size:', chunkSize);

  for (let i = 0; i < numWorkers; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, A_RANGE);
    console.log(`Creating worker ${i} for range ${start}-${end}`);

    const worker = new Worker(workerPath, {
      workerData: { start, end, B, C, program: origProgramStr },
    });
    workers.push(worker);

    workerPromises.push(
      new Promise((resolve) => {
        worker.on('message', (result) => {
          console.log(`Worker finished with result:`, result);
          if (result !== -1) {
            workers.forEach((w) => w.terminate());
            resolve(result);
          }
        });

        worker.on('error', (err) => {
          console.error(err);
          resolve(-1);
        });
      })
    );
  }

  const results = await Promise.race(workerPromises);
  return results;
}

if (isMainThread) {
  const answer = await day17b();
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
}
