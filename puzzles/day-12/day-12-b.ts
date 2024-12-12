import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day12b(dataPath?: string) {
  const data = await readLines(dataPath);
  let garden = parseLines(data);

  return 0;
}

const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
