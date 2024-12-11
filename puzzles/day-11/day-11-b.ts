import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day11b(dataPath?: string) {
  const grid = await readLines(dataPath);
  let pebbles = parseLines(grid);
}

const answer = await day11b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
