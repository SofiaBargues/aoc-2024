import chalk from 'chalk';
import { readLines } from '../../shared.ts';

export async function day18b(dataPath?: string) {
  const data = await readLines(dataPath);
  return 0;
}

const answer = await day18b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
