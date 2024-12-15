import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day15b(dataPath?: string) {
  const data = await readLines(dataPath);
  parseLines(data);
  return 0;
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
