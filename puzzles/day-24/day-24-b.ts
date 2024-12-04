import chalk from 'chalk';
import { readLines } from '../../shared.ts';

export async function day24b(dataPath?: string) {
  const data = await readLines(dataPath);
  return 0;
}

const answer = await day24b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
