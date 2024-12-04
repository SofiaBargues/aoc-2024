import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day3a(dataPath?: string) {
  const data = await readLines(dataPath);
  const numsPairs = parseLines(data);
  let numTotal = 0;
  for (const pair of numsPairs) {
    numTotal = Number(pair[0]) * Number(pair[1]) + numTotal;
  }

  return numTotal;
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
