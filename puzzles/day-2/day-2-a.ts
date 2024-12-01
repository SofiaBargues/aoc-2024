import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);
  parseLines(data);
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
